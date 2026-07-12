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

function createMetric(label,value,className){
  const item=document.createElement("div"); item.className=`profile-mini-metric ${className}`;
  const val=document.createElement("strong"); val.textContent=value;
  const lbl=document.createElement("span"); lbl.textContent=label;
  item.append(val,lbl); return item;
}

function renderProfiles(profiles){
  const list=document.getElementById("parent-profile-list"); list.replaceChildren();
  if(!profiles.length){
    const empty=document.createElement("div"); empty.className="dashboard-empty";
    empty.textContent="ยังไม่มีโปรไฟล์ผู้เรียนในอุปกรณ์นี้ กลับหน้าแอปเพื่อสร้างโปรไฟล์และเริ่มบทเรียนได้เลย";
    list.appendChild(empty); return;
  }
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
    card.append(identity,metrics); list.appendChild(card);
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
    renderProfiles(profiles);
  }catch(error){
    console.error("Unable to load parent dashboard",error);
    status.textContent="อ่านความก้าวหน้าไม่ได้ กรุณาเปิดหน้านี้ด้วยเบราว์เซอร์และอุปกรณ์เดียวกับที่ใช้เรียน";
    renderProfiles([]);
  }
}

document.addEventListener("DOMContentLoaded",loadParentsDashboardData);
