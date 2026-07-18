"use strict";

const PARENT_DB_NAME = "FunEnglishJourneyDB";
const PARENT_DB_VERSION = 1;

function openProgressDatabase(){
  return new Promise((resolve,reject)=>{
    const request=indexedDB.open(PARENT_DB_NAME,PARENT_DB_VERSION);
    request.onsuccess=()=>resolve(request.result);
    request.onerror=()=>reject(request.error);
    request.onupgradeneeded=()=>{
      const db=request.result;
      if(!db.objectStoreNames.contains("profiles")) db.createObjectStore("profiles",{keyPath:"id",autoIncrement:true});
    };
  });
}

function readProfiles(db){
  return new Promise((resolve,reject)=>{
    const tx=db.transaction("profiles","readonly");
    const request=tx.objectStore("profiles").getAll();
    request.onsuccess=()=>resolve(request.result||[]);
    request.onerror=()=>reject(request.error);
  });
}

function countProfileStars(profile){
  return Object.values(profile.stars||{}).reduce((sum,value)=>sum+(Number(value)||0),0);
}

function profileLessonCount(profile){
  return Object.keys(profile.stars||{}).length;
}

function profileSpeakingAverage(profile){
  const stats = profile.speakingStats||[];
  if(!stats.length) return null;
  const sum = stats.reduce((total,s)=>total+(Number(s.score)||0),0);
  return Math.round(sum/stats.length);
}

const LESSONS_PER_GRADE = 34; // 8 หน่วย x 4 บท + หน่วย 9-10 อย่างละ 1 บท (Reading) คงที่ทุกชั้น ป.1-6
const GRADE_LABELS = {p1:"ป.1",p2:"ป.2",p3:"ป.3",p4:"ป.4",p5:"ป.5",p6:"ป.6"};

function parseLessonId(id){
  const m = /^(p[1-6])u(\d+)l\d+$/.exec(id||"");
  return m ? {grade:m[1], unitFile:`${m[1]}u${m[2]}`} : null;
}

function weakLessons(profile, limit){
  return Object.entries(profile.stars||{})
    .filter(([,stars])=>stars>0 && stars<3)
    .sort((a,b)=>a[1]-b[1])
    .slice(0, limit)
    .map(([id,stars])=>({id, stars}));
}

function recentActivity(profile, days){
  const cutoff = Date.now() - days*24*60*60*1000;
  const stats = (profile.speakingStats||[]).filter(s=>Number(s.at)>=cutoff);
  if(!stats.length) return null;
  const avg = Math.round(stats.reduce((sum,s)=>sum+(Number(s.score)||0),0)/stats.length);
  return {count: stats.length, avg};
}

async function fetchLessonTitles(lessonIds){
  const unitFiles = [...new Set(lessonIds.map(id=>parseLessonId(id)?.unitFile).filter(Boolean))];
  const titles = {};
  await Promise.all(unitFiles.map(async uf=>{
    try{
      const res = await fetch(`data/${uf}.json`);
      if(!res.ok) return;
      const data = await res.json();
      (data.lessons||[]).forEach(l=>{ titles[l.id] = l.title; });
    }catch(e){ /* ไฟล์โหลดไม่ได้ก็ข้ามไป แสดง id ดิบแทน */ }
  }));
  return titles;
}

function createMetric(label,value,className){
  const item=document.createElement("div"); item.className=`profile-mini-metric ${className}`;
  const val=document.createElement("strong"); val.textContent=value;
  const lbl=document.createElement("span"); lbl.textContent=label;
  item.append(val,lbl); return item;
}

function buildProgressBar(profile){
  const grade = profile.grade || "p1";
  const done = profileLessonCount(profile);
  const pct = Math.min(100, Math.round(done/LESSONS_PER_GRADE*100));
  const wrap = document.createElement("div"); wrap.className = "grade-progress";
  const label = document.createElement("div"); label.className = "grade-progress-label";
  label.textContent = `เรียนไปแล้ว ${done}/${LESSONS_PER_GRADE} บทของชั้น ${GRADE_LABELS[grade]||grade} (${pct}%)`;
  const track = document.createElement("div"); track.className = "grade-progress-track";
  const fill = document.createElement("div"); fill.className = "grade-progress-fill"; fill.style.width = `${pct}%`;
  track.appendChild(fill);
  wrap.append(label, track);
  return wrap;
}

function buildWeakList(profile, titles){
  const weak = weakLessons(profile, 5);
  if(!weak.length) return null;
  const box = document.createElement("div"); box.className = "weak-lessons";
  const h = document.createElement("div"); h.className = "weak-lessons-title"; h.textContent = "🎯 จุดที่ควรฝึกฝนเพิ่ม";
  const ul = document.createElement("ul");
  weak.forEach(w=>{
    const li = document.createElement("li");
    const label = document.createElement("span"); label.textContent = titles[w.id] || w.id;
    const stars = document.createElement("span"); stars.className = "weak-stars"; stars.textContent = "⭐".repeat(w.stars)+"☆".repeat(3-w.stars);
    li.append(label, stars); ul.appendChild(li);
  });
  box.append(h, ul);
  return box;
}

function buildRecentActivity(profile){
  const recent = recentActivity(profile, 7);
  const box = document.createElement("div"); box.className = "recent-activity";
  if(!recent){
    box.textContent = "📅 7 วันล่าสุด: ยังไม่มีการฝึกพูดในช่วงนี้";
    return box;
  }
  const allTimeAvg = profileSpeakingAverage(profile);
  let trend = "";
  if(allTimeAvg!==null){
    if(recent.avg > allTimeAvg+3) trend = " 📈 ดีขึ้นกว่าค่าเฉลี่ยเดิม";
    else if(recent.avg < allTimeAvg-3) trend = " 📉 ต่ำกว่าค่าเฉลี่ยเดิม ลองฝึกเพิ่ม";
    else trend = " ➡️ ใกล้เคียงค่าเฉลี่ยเดิม";
  }
  box.textContent = `📅 7 วันล่าสุด: ฝึกพูด ${recent.count} ครั้ง เฉลี่ยตรง ${recent.avg}%${trend}`;
  return box;
}

async function renderProfiles(profiles){
  const list=document.getElementById("parent-profile-list"); list.replaceChildren();
  if(!profiles.length){
    const empty=document.createElement("div"); empty.className="dashboard-empty";
    empty.textContent="ยังไม่มีโปรไฟล์ผู้เรียนในอุปกรณ์นี้ กลับหน้าแอปเพื่อสร้างโปรไฟล์และเริ่มบทเรียนได้เลย";
    list.appendChild(empty); return;
  }
  const allWeakIds = profiles.flatMap(p=>weakLessons(p,5).map(w=>w.id));
  const titles = allWeakIds.length ? await fetchLessonTitles(allWeakIds) : {};
  profiles.forEach(profile=>{
    const card=document.createElement("article"); card.className="profile-progress-item";
    const identity=document.createElement("div"); identity.className="profile-identity";
    const avatar=document.createElement("span"); avatar.className="profile-avatar"; avatar.textContent=profile.avatar||"🦁"; avatar.setAttribute("aria-hidden","true");
    const copy=document.createElement("div");
    const name=document.createElement("h3"); name.textContent=`น้อง ${profile.name||"เพื่อน"}`;
    const note=document.createElement("span"); note.textContent="ข้อมูลในอุปกรณ์นี้";
    copy.append(name,note); identity.append(avatar,copy);
    const metrics=document.createElement("div"); metrics.className="profile-mini-metrics";
    metrics.append(createMetric("XP",String(Number(profile.xp)||0),"mini-xp"),createMetric("ดาว",String(countProfileStars(profile)),"mini-stars"),createMetric("บท",String(profileLessonCount(profile)),"mini-lessons"));
    const speakingAvg = profileSpeakingAverage(profile);
    if(speakingAvg!==null) metrics.append(createMetric("พูดตรง",`${speakingAvg}%`,"mini-speaking"));
    card.append(identity,metrics);
    card.appendChild(buildProgressBar(profile));
    card.appendChild(buildRecentActivity(profile));
    const weakBox = buildWeakList(profile, titles);
    if(weakBox) card.appendChild(weakBox);
    list.appendChild(card);
  });
}

async function loadParentsDashboardData(){
  const status=document.getElementById("parent-data-status");
  try{
    const db=await openProgressDatabase();
    const profiles=await readProfiles(db); db.close();
    const totalXP=profiles.reduce((sum,p)=>sum+(Number(p.xp)||0),0);
    const totalStars=profiles.reduce((sum,p)=>sum+countProfileStars(p),0);
    const totalLessons=profiles.reduce((sum,p)=>sum+profileLessonCount(p),0);
    document.getElementById("parent-total-xp").textContent=`💎 ${totalXP}`;
    document.getElementById("parent-total-stars").textContent=`⭐ ${totalStars}`;
    document.getElementById("parent-total-lessons").textContent=`📖 ${totalLessons}`;
    status.textContent=profiles.length?`พบ ${profiles.length} โปรไฟล์ในอุปกรณ์นี้`:"ยังไม่มีข้อมูลความก้าวหน้า";
    await renderProfiles(profiles);
  }catch(error){
    console.error("Unable to load parent dashboard",error);
    status.textContent="อ่านความก้าวหน้าไม่ได้ กรุณาเปิดหน้านี้ด้วยเบราว์เซอร์และอุปกรณ์เดียวกับที่ใช้เรียน";
    await renderProfiles([]);
  }
}

document.addEventListener("DOMContentLoaded",loadParentsDashboardData);
