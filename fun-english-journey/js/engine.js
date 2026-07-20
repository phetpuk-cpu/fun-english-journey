/* ============================================================
   DATA LOADING — CONTENT ย้ายไปอยู่ data/*.json (ดู project-handoff.md 3.1)
   ============================================================ */
const UNIT_FILES = {
  k: ["data/ku1.json", "data/ku5.json"], /* อนุบาล pilot 2 หน่วย (หน่วย 2-4, 6-8 จะเพิ่มหลังทดสอบกับเด็กจริง) */
  p1: ["data/p1u1.json", "data/p1u2.json", "data/p1u3.json", "data/p1u4.json", "data/p1u5.json", "data/p1u6.json", "data/p1u7.json", "data/p1u8.json", "data/p1u9.json", "data/p1u10.json"],
  p2: ["data/p2u1.json", "data/p2u2.json", "data/p2u3.json", "data/p2u4.json", "data/p2u5.json", "data/p2u6.json", "data/p2u7.json", "data/p2u8.json", "data/p2u9.json", "data/p2u10.json"],
  p3: ["data/p3u1.json", "data/p3u2.json", "data/p3u3.json", "data/p3u4.json", "data/p3u5.json", "data/p3u6.json", "data/p3u7.json", "data/p3u8.json", "data/p3u9.json", "data/p3u10.json"],
  p4: ["data/p4u1.json", "data/p4u2.json", "data/p4u3.json", "data/p4u4.json", "data/p4u5.json", "data/p4u6.json", "data/p4u7.json", "data/p4u8.json", "data/p4u9.json", "data/p4u10.json"],
  p5: ["data/p5u1.json", "data/p5u2.json", "data/p5u3.json", "data/p5u4.json", "data/p5u5.json", "data/p5u6.json", "data/p5u7.json", "data/p5u8.json", "data/p5u9.json", "data/p5u10.json"],
  p6: ["data/p6u1.json", "data/p6u2.json", "data/p6u3.json", "data/p6u4.json", "data/p6u5.json", "data/p6u6.json", "data/p6u7.json", "data/p6u8.json", "data/p6u9.json", "data/p6u10.json"],
};
let CONTENT = {};

async function fetchUnit(file){
  const res = await fetch(file);
  if(!res.ok) throw new Error(`โหลด ${file} ไม่สำเร็จ (${res.status})`);
  return res.json();
}
async function loadGrade(grade){
  /* โหลดเฉพาะ 10 ไฟล์ของชั้นที่เลือก แล้ว cache ไว้ใน CONTENT[grade] ไม่โหลดซ้ำ */
  if(CONTENT[grade]) return CONTENT[grade];
  const datas = await Promise.all(UNIT_FILES[grade].map(fetchUnit));
  CONTENT[grade] = {
    name: datas[0].gradeName,
    units: datas.map(d => ({ name: d.unitName, lessons: d.lessons }))
  };
  return CONTENT[grade];
}

/* ================= DATABASE (IndexedDB) ================= */
class FEJDatabase {
  constructor() {
    this.dbName = "FunEnglishJourneyDB";
    this.dbVersion = 1;
    this.db = null;
  }

  open() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion);
      request.onerror = (e) => reject(e.target.error);
      request.onsuccess = (e) => { this.db = e.target.result; resolve(this.db); };
      request.onupgradeneeded = (e) => {
        const db = e.target.result;
        if (!db.objectStoreNames.contains("profiles")) {
          db.createObjectStore("profiles", { keyPath: "id", autoIncrement: true });
        }
      };
    });
  }

  getAllProfiles() {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(["profiles"], "readonly");
      const store = transaction.objectStore("profiles");
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result);
      request.onerror = (e) => reject(e.target.error);
    });
  }

  saveProfile(profile) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(["profiles"], "readwrite");
      const store = transaction.objectStore("profiles");
      const request = store.put(profile);
      request.onsuccess = (e) => {
        profile.id = e.target.result;
        resolve(profile);
      };
      request.onerror = (e) => reject(e.target.error);
    });
  }
}

const db = new FEJDatabase();
let activeProfile = null;

async function refreshProfilesList() {
  try {
    const profiles = await db.getAllProfiles();
    const pBox = document.getElementById("profiles-box");
    const cBox = document.getElementById("create-profile-box");
    const cancelBtn = document.getElementById("btn-cancel-create");

    if (profiles.length > 0) {
      pBox.style.display = "block";
      cBox.style.display = "none";
      cancelBtn.style.display = "inline-block";

      const list = document.getElementById("profiles-list");
      list.replaceChildren();
      profiles.forEach(p => {
        const id = Number.isInteger(p.id) ? p.id : null;
        const xp = Number.isFinite(p.xp) && p.xp >= 0 ? p.xp : 0;
        const stars = Object.values(p.stars || {}).reduce((a, b) => a + (Number.isFinite(b) ? b : 0), 0);

        const btn = document.createElement("button");
        btn.className = "lesson-node";
        btn.style.cssText = "border: 2px solid var(--blue); margin: 4px 0; width: 100%; text-align: left;";
        if (id !== null) btn.addEventListener("click", () => handleSelectProfile(id));

        const icon = document.createElement("span");
        icon.className = "icon"; icon.style.cssText = "font-size: 2.2rem; margin-right: 10px;";
        icon.textContent = typeof p.avatar === "string" ? p.avatar : "🦁";

        const info = document.createElement("span");
        info.className = "info"; info.style.flex = "1";
        const name = document.createElement("span");
        name.className = "name"; name.style.cssText = "font-size: 1.1rem; font-weight: 700; display: block; color: var(--ink);";
        name.textContent = "น้อง " + (typeof p.name === "string" ? p.name : "เพื่อน");
        const sub = document.createElement("span");
        sub.className = "sub"; sub.style.cssText = "font-size: 0.85rem; color: #6b7a99;";
        sub.textContent = `💎 ${xp} XP`;
        info.append(name, sub);

        const starEl = document.createElement("span");
        starEl.style.cssText = "font-size: 1rem; color: var(--duck); font-weight: bold;";
        starEl.textContent = `⭐ ${stars}`;

        btn.append(icon, info, starEl);
        list.appendChild(btn);
      });
    } else {
      pBox.style.display = "none";
      cBox.style.display = "block";
      cancelBtn.style.display = "none";
    }
  } catch (e) {
    console.error(e);
  }
}

async function handleSelectProfile(id) {
  const profiles = await db.getAllProfiles();
  const found = profiles.find(p => p.id === id);
  if (found) {
    selectProfile(found);
  }
}

function selectProfile(profile) {
  activeProfile = profile;
  state.id = profile.id;
  state.name = profile.name;
  state.avatar = profile.avatar;
  state.xp = profile.xp || 0;
  state.stars = profile.stars || {};
  state.grade = profile.grade || "p1";

  document.getElementById("map-name").textContent = state.name;
  document.getElementById("map-avatar").textContent = state.avatar;
  document.getElementById("xp-total").textContent = state.xp;
  
  speak("สวัสดี น้อง" + state.name + " ยินดีต้อนรับกลับมาผจญภัย!","th-TH");
  goMap();
}
function logout(){
  stopAllAudio();
  activeProfile = null;
  state.id = null; state.name = "เพื่อน"; state.avatar = "🦁"; state.xp = 0; state.stars = {};
  refreshProfilesList();
  show("scr-welcome");
}

function showCreateForm() {
  document.getElementById("profiles-box").style.display = "none";
  document.getElementById("create-profile-box").style.display = "block";
  document.getElementById("inp-name").value = "";
}

function showProfilesList() {
  document.getElementById("profiles-box").style.display = "block";
  document.getElementById("create-profile-box").style.display = "none";
}

/* ================= STATE (in-memory) ================= */
const state = {id: null, name:"เพื่อน", avatar:"🦁", xp:0, grade:"p1", lessonId:null, step:0, lessonXp:0, stars:{}};
function getLesson(id){
  for(const g of Object.values(CONTENT))
    for(const u of g.units)
      for(const l of u.lessons)
        if(l.id===id) return l;
}
function nextLessonId(id){
  const flat = [];
  for(const g of Object.values(CONTENT)) for(const u of g.units) for(const l of u.lessons) flat.push(l.id);
  const i = flat.indexOf(id);
  /* บทถัดไปเฉพาะภายในชั้นเดียวกัน (p3.. / p4..) */
  if(i>=0 && i<flat.length-1 && flat[i+1].slice(0,2)===id.slice(0,2)) return flat[i+1];
  return null;
}

/* ================= AUDIO SETTINGS + CENTRAL AUDIO MANAGER ================= */
const DEFAULT_AUDIO_SETTINGS = { master:1, speech:1, sfx:.7, autoplay:true, rate:"slow", reduceMotion:false };
function loadAudioSettings(){
  try { return {...DEFAULT_AUDIO_SETTINGS, ...JSON.parse(localStorage.getItem("fejAudioSettings") || "{}")}; }
  catch(e){ return {...DEFAULT_AUDIO_SETTINGS}; }
}
const audioSettings = loadAudioSettings();
function saveAudioSettings(){
  localStorage.setItem("fejAudioSettings", JSON.stringify(audioSettings));
  document.body.classList.toggle("reduce-motion", !!audioSettings.reduceMotion);
}
function audioVolume(channel){ return Math.max(0, Math.min(1, audioSettings.master * audioSettings[channel])); }

const AudioManager = {
  main:null, self:null, sfx:new Set(), mediaStream:null, token:0, fallbackTimer:null,
  stopElement(audio){
    if(!audio) return;
    try { audio.pause(); audio.removeAttribute("src"); audio.load(); } catch(e){}
  },
  stopPlayback(){
    this.token++;
    if(this.fallbackTimer){ clearTimeout(this.fallbackTimer); this.fallbackTimer = null; }
    if("speechSynthesis" in window) speechSynthesis.cancel();
    this.stopElement(this.main); this.main = null;
    this.stopElement(this.self); this.self = null;
    this.sfx.forEach(a=>this.stopElement(a)); this.sfx.clear();
  },
  stopCapture(){
    if(this.mediaStream){ this.mediaStream.getTracks().forEach(t=>t.stop()); this.mediaStream = null; }
  },
  stopAll(){ this.stopPlayback(); this.stopCapture(); },
  playMain(filename, fallbackText, fallbackLang, options={}){
    this.stopPlayback();
    if(options.autoplay && !audioSettings.autoplay) return;
    const token = this.token;
    if(!filename){ speak(fallbackText, fallbackLang, token); return; }
    const audio = new Audio(`assets/audio/${filename}`);
    this.main = audio; // เก็บทันที เพื่อให้เปลี่ยนหน้าระหว่างโหลดแล้วหยุดได้
    audio.preload = "auto";
    audio.volume = audioVolume("speech");
    let settled = false;
    const fallback = ()=>{
      if(settled || token !== this.token || this.main !== audio) return;
      settled = true; this.stopElement(audio); this.main = null;
      speak(fallbackText, fallbackLang, token);
    };
    const begin = ()=>{
      if(settled || token !== this.token || this.main !== audio) return;
      if(this.fallbackTimer){ clearTimeout(this.fallbackTimer); this.fallbackTimer=null; }
      audio.play().then(()=>{ settled=true; }).catch(err=>{
        if(err && err.name === "NotAllowedError"){
          settled=true; this.stopElement(audio); this.main=null;
          showAudioNotice("Safari ปิดการเล่นอัตโนมัติ กรุณาแตะปุ่ม 🔊 เพื่อฟัง");
        }else fallback();
      });
    };
    audio.addEventListener("canplay", begin, {once:true});
    audio.addEventListener("error", fallback, {once:true});
    audio.addEventListener("ended", ()=>{ if(this.main===audio) this.main=null; }, {once:true});
    audio.load();
    this.fallbackTimer = setTimeout(fallback, 5000);
  },
  playSfx(name){
    if(audioVolume("sfx") <= 0) return;
    try{
      const a = new Audio(`assets/audio/sfx-${name}.wav`);
      a.volume = audioVolume("sfx"); this.sfx.add(a);
      const cleanup = ()=>this.sfx.delete(a);
      a.addEventListener("ended", cleanup, {once:true}); a.addEventListener("error", cleanup, {once:true});
      a.play().catch(cleanup);
    }catch(e){}
  }
};

let currentAudio = null, mediaStream = null; // compatibility aliases for lesson speech code
function syncAudioAliases(){ currentAudio = AudioManager.main; mediaStream = AudioManager.mediaStream; }
function showAudioNotice(message){
  const feedback = document.querySelector("#stage .feedback");
  if(feedback && !feedback.textContent) feedback.textContent = message;
}
function speak(text, lang, token=AudioManager.token){
  try{
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = lang;
    u.rate = audioSettings.rate === "normal" ? 1 : (lang.startsWith("en") ? 0.75 : 0.65);
    u.volume = audioVolume("speech");
    const voices = speechSynthesis.getVoices();
    const v = voices.find(v=>v.lang && v.lang.startsWith(lang.split("-")[0]));
    if(v) u.voice = v;
    if(token === AudioManager.token) speechSynthesis.speak(u);
  }catch(e){}
}
if("speechSynthesis" in window){
  speechSynthesis.getVoices();
  speechSynthesis.onvoiceschanged = ()=>speechSynthesis.getVoices();
}

function stopAllAudio(){
  AudioManager.stopAll(); syncAudioAliases();
}

/* ================= ASSET RESOLUTION — real file ถ้ามี / fallback emoji+TTS ถ้าไม่มี =================
   ชื่อไฟล์ต้องตรงตามกฎใน asset-production-kit.md (A3/A4 ภาพ, B2 เสียง) ทุกตัวอักษร */
function slug(w){
  return w.toLowerCase().replace(/'/g,"").replace(/[^a-z0-9]+/g,"-").replace(/(^-|-$)/g,"");
}
/* ธงชาติเล็กเกินจะมองเห็นในภาพขนาด 56px (ภาพจริงมีธงปักไว้ที่อกแล้ว แต่จิ๋วไป)
   เลยแปะ emoji ธงเพิ่มเป็น badge แยกให้ชัดเจนสำหรับคำสัญชาติ/ประเทศ */
const NATIONALITY_FLAGS = {
  "Thai":"🇹🇭","Thailand":"🇹🇭","Japanese":"🇯🇵","Japan":"🇯🇵","Chinese":"🇨🇳","China":"🇨🇳",
  "American":"🇺🇸","America":"🇺🇸","English":"🇬🇧","French":"🇫🇷","France":"🇫🇷",
  "Australian":"🇦🇺","Australia":"🇦🇺","Italian":"🇮🇹","Italy":"🇮🇹",
  "Korean":"🇰🇷","Korea":"🇰🇷","Vietnamese":"🇻🇳","Vietnam":"🇻🇳","Indian":"🇮🇳","India":"🇮🇳",
  "Singapore":"🇸🇬","Malaysia":"🇲🇾","Brazil":"🇧🇷","Canada":"🇨🇦",
};
function flagBadge(word){
  const flag = NATIONALITY_FLAGS[word];
  return flag ? `<div class="flag-badge">${flag}</div>` : "";
}
/* Codex เก็บภาพเป็นหมวดหมู่ย่อย (characters/, scenes/, ...) ไม่ใช่ชื่อแบนตามกฎ A3/A4 เป๊ะ
   เลยลองทั้งสองที่: ชื่อแบนก่อน แล้วค่อย fallback ไปโฟลเดอร์หมวดหมู่ */
function vocabImgSlot(lessonId, v){
  const file = `${lessonId}-vocab-${slug(v.w)}.png`;
  return `<span class="img-slot" data-img="${file}" data-img-alt="vocab/${file}">${v.e}</span>`;
}
function sceneImgSlot(lessonId, fallbackEmoji){
  const file = `${lessonId}-scene.png`;
  return `<span class="img-slot scene-slot" data-img="${file}" data-img-alt="scenes/${file}">${fallbackEmoji}</span>`;
}
/* ภาพโหมดอนุบาล: assets/img/phonics/ (hydrateImages เติม assets/img/ ให้เอง จึงส่ง path เริ่มที่ phonics/) */
function phonicsImgSlot(file, fallbackEmoji){
  return `<span class="img-slot phonics-slot" data-img="phonics/${file}">${fallbackEmoji}</span>`;
}
/* เล่นไฟล์เสียงเรียงต่อกัน (ใช้สะกดคำ c-a-t) — เคารพ token ของ AudioManager ให้เปลี่ยนหน้าแล้วเสียงหยุดเหมือนเสียงอื่น */
function playPhonicsSequence(files, {onStep, onDone, gapMs=350}={}){
  AudioManager.stopPlayback();
  const token = AudioManager.token;
  (function playNext(i){
    if(token !== AudioManager.token) return;
    if(i >= files.length){ if(onDone) onDone(); return; }
    if(onStep) onStep(i);
    const a = new Audio(`assets/audio/${files[i]}`);
    AudioManager.main = a;
    a.volume = audioVolume("speech");
    let advanced = false;
    const advance = ()=>{ if(advanced) return; advanced = true; setTimeout(()=>playNext(i+1), gapMs); };
    a.addEventListener("ended", advance, {once:true});
    a.addEventListener("error", advance, {once:true});
    a.play().catch(advance);
  })(0);
}
/* ปุ่มตอบของโหมดอนุบาล: ตอบถูกครั้งแรก +3 XP, ผิดแล้วลองใหม่จนถูกได้ +1 (ไม่มีตกรอบ — เด็กเล็กต้องจบด้วยความสำเร็จเสมอ) */
function wirePhonicsChoices(container){
  let wrongTried = false;
  container.querySelectorAll(".phonics-choice").forEach(el=>{
    el.onclick = ()=>{
      if(el.dataset.correct==="true"){
        el.classList.add("correct");
        container.querySelectorAll(".phonics-choice").forEach(c=>c.style.pointerEvents="none");
        addXp(wrongTried ? 1 : 3); playSfx("correct");
        setTimeout(next, 900);
      }else{
        wrongTried = true;
        el.classList.add("wrong"); playSfx("wrong");
        setTimeout(()=>el.classList.remove("wrong"), 600);
      }
    };
  });
}
function hydrateImages(){
  document.querySelectorAll("#stage [data-img]").forEach(el=>{
    if(el.dataset.hydrated) return;
    el.dataset.hydrated = "1";
    const bases = [el.dataset.img, el.dataset.imgAlt].filter(Boolean);
    /* ลอง .webp ก่อน (เบากว่า png มาก) แล้วค่อย fallback ไป .png เดิมถ้าไม่มีไฟล์ webp */
    const candidates = bases.flatMap(f => [f.replace(/\.png$/i, ".webp"), f]);
    (function tryNext(i){
      if(i>=candidates.length) return; /* ไม่มีไฟล์จริงที่ path ไหนเลย — ปล่อย emoji เดิมไว้ */
      const img = new Image();
      img.onload = ()=>{ el.innerHTML = ""; img.className = "asset-img"; el.appendChild(img); };
      img.onerror = ()=> tryNext(i+1);
      img.src = "assets/img/"+candidates[i];
    })(0);
  });
}
/* ใช้กับ <img> นอก #stage เช่นหน้า Characters — ลอง .webp ก่อน แล้วค่อย .png แล้วค่อย emoji */
function charImgFallback(img, emoji){
  if(/\.webp$/i.test(img.src)){ img.src = img.src.replace(/\.webp$/i, ".png"); return; }
  img.replaceWith(Object.assign(document.createElement("span"), {textContent: emoji, style: "font-size:3.5rem"}));
}
function playAudio(filename, fallbackText, fallbackLang, options={}){
  AudioManager.playMain(filename, fallbackText, fallbackLang, options);
  syncAudioAliases();
}
document.addEventListener("click", e=>{
  const b = e.target.closest("[data-say]");
  if(b){ playAudio(b.dataset.audio, b.dataset.say, b.dataset.lang || "en-US"); return; }
  if(e.target.closest(".btn, .lesson-node, .tab, .avatar, .back")) playSfx("click");
});

/* sfx-*.wav ไม่มี fallback (ไม่ใช่เสียงพูด ไม่มีอะไรให้ TTS แทน) เงียบไปเฉยๆ ถ้ายังไม่มีไฟล์ */
function playSfx(name){
  AudioManager.playSfx(name);
}

/* ================= NAVIGATION ================= */
let settingsReturnScreen = "scr-map";
function show(id){
  stopAllAudio();
  document.querySelectorAll(".screen").forEach(s=>s.classList.remove("active"));
  document.getElementById(id).classList.add("active"); window.scrollTo(0,0);
}
function openSettings(){
  settingsReturnScreen = document.querySelector(".screen.active")?.id || "scr-map";
  syncSettingsUi(); updateMicCapability(); show("scr-settings");
}
function closeSettings(){ stopMicTest(); show(settingsReturnScreen); }
document.addEventListener("visibilitychange", ()=>{ if(document.hidden){ stopMicTest(); stopAllAudio(); } });
window.addEventListener("pagehide", stopAllAudio);
document.querySelectorAll("#avatar-row .avatar").forEach(b=>b.onclick=()=>{
  document.querySelectorAll("#avatar-row .avatar").forEach(x=>x.classList.remove("selected"));
  b.classList.add("selected"); state.avatar=b.textContent;
});
let selectedGrade = "p1";
document.querySelectorAll("#grade-row .tab").forEach(b=>b.onclick=()=>{
  document.querySelectorAll("#grade-row .tab").forEach(x=>x.classList.remove("active"));
  b.classList.add("active"); selectedGrade = b.dataset.g;
});
document.querySelectorAll("#scr-map .tab").forEach(t=>t.onclick=async ()=>{
  document.querySelectorAll("#scr-map .tab").forEach(x=>x.classList.remove("active"));
  t.classList.add("active"); state.grade = t.dataset.g; await drawMap();
});
function syncGradeTabs(){
  document.querySelectorAll("#scr-map .tab").forEach(t=>t.classList.toggle("active", t.dataset.g===state.grade));
}
async function startApp(){
  const n = document.getElementById("inp-name").value.trim();
  if(!n) return;
  const consentBox = document.getElementById("inp-consent");
  if(!consentBox.checked){
    document.getElementById("consent-warn").style.display = "block";
    consentBox.focus();
    return;
  }
  document.getElementById("consent-warn").style.display = "none";
  localStorage.setItem("fejParentConsent", JSON.stringify({given:true, at:Date.now()}));
  const newProfile = {
    name: n,
    avatar: state.avatar || "🦁",
    grade: selectedGrade,
    xp: 0,
    stars: {},
    speakingStats: []
  };
  try {
    const saved = await db.saveProfile(newProfile);
    selectProfile(saved);
  } catch (e) {
    console.error(e);
    state.name = n;
    state.grade = selectedGrade;
    goMap();
  }
}
async function drawMap(){
  const mapList = document.getElementById("map-list");
  if(!CONTENT[state.grade]){
    mapList.innerHTML = `<p class="map-loading">🦆 กำลังโหลดบทเรียน...</p>`;
    try { await loadGrade(state.grade); }
    catch(e){ mapList.innerHTML = `<p class="map-loading">โหลดบทเรียนไม่สำเร็จ 😢</p>`; console.error(e); return; }
  }
  const g = CONTENT[state.grade];
  const flatIds = [];
  g.units.forEach(u=>u.lessons.forEach(l=>flatIds.push(l.id)));
  const nextId = flatIds.find(id => !(state.stars[id] > 0));
  const gradeComplete = flatIds.length > 0 && !nextId;
  const certBanner = gradeComplete
    ? `<a class="card certificate-banner" href="certificate.html?profileId=${encodeURIComponent(state.id ?? "")}&grade=${encodeURIComponent(state.grade)}">
        <span class="icon">🏅</span>
        <span class="info"><b>เก่งมาก! เรียนจบ ${g.name} แล้ว</b><span class="sub">แตะเพื่อดู/พิมพ์ใบประกาศนียบัตร 🖨️</span></span>
      </a>`
    : "";
  const hasQuiz = g.units.some(u=>u.lessons.some(l=>(l.quiz||[]).length));
  const examCard = hasQuiz ? `<button class="card certificate-banner" style="width:100%;border:none;cursor:pointer;font:inherit;text-align:left" onclick="startMockExam()">
      <span class="icon">📝</span>
      <span class="info"><b>ทดสอบจำลอง Cambridge YLE</b><span class="sub">สุ่มข้อสอบจากทุกบทที่มีในชั้นนี้ ลองได้ไม่จำกัด</span></span>
    </button>` : "";
  mapList.innerHTML =
    `<h2 style="margin:8px 0 0">🗺️ ${g.name}</h2>` +
    certBanner +
    g.units.map(u=>`
      <div class="unit-head">${u.name}</div>
      ${u.lessons.map(l=>{
        const s = state.stars[l.id]||0;
        const cls = "lesson-node" + (l.id===nextId ? " lesson-next" : "");
        const readingSub = "📖 อ่านนิทานสั้น + ตอบคำถาม";
        if(s>0){
          return `<button class="${cls}" onclick="startLesson('${l.id}')">
            <span class="icon">${l.icon}</span>
            <span class="info"><span class="name">${l.title} — ${l.sub}</span>
            <span class="sub">${l.lessonType==="reading" ? readingSub : l.lessonType==="phonics" ? "🐣 ฟังเสียง แตะเล่น เก็บดาว" : "ศัพท์ 8 คำ · พูด 4 ประโยค · ควิซ 8 ข้อ"}</span></span>
            <span>${"⭐".repeat(s)}${"☆".repeat(3-s)}</span></button>`;
        }
        return `<button class="${cls}" onclick="startLesson('${l.id}')">
          <span class="icon">${l.icon}</span>
          <span class="info"><span class="name">${l.title}</span>
          <span class="sub">แตะเพื่อเริ่ม 👉</span></span>
          <span>☆☆☆</span></button>`;
      }).join("")}`).join("") +
    examCard;
}
async function goMap(){
  stopAllAudio();
  document.getElementById("xp-total").textContent = state.xp;
  syncGradeTabs();
  show("scr-map");
  await drawMap();
}

/* ================= MOCK EXAM: สุ่มข้อสอบจาก quiz ทั้งชั้น สไตล์ Cambridge YLE ================= */
let examState = null;
async function startMockExam(){
  stopAllAudio();
  if(!CONTENT[state.grade]) await loadGrade(state.grade);
  const g = CONTENT[state.grade];
  const allQuiz = [];
  g.units.forEach(u=>u.lessons.forEach(l=>(l.quiz||[]).forEach(q=>allQuiz.push(q))));
  const picked = [...allQuiz].sort(()=>Math.random()-.5).slice(0, Math.min(20, allQuiz.length));
  examState = {questions: picked, idx: 0, correct: 0};
  show("scr-exam");
  renderExamQuestion();
}
function renderExamQuestion(){
  const stage = document.getElementById("exam-stage");
  if(examState.idx >= examState.questions.length){ renderExamResult(); return; }
  const q = examState.questions[examState.idx];
  const opts = q.c.map((c,i)=>({text:c, correct:i===q.a})).sort(()=>Math.random()-.5);
  stage.innerHTML = `
    <div class="bubble"><b>ข้อ ${examState.idx+1}/${examState.questions.length} 🛡️</b></div>
    <div class="card"><h2 style="margin-top:0">${q.q}</h2>
      ${opts.map(o=>`<button class="choice" data-correct="${o.correct}">${o.text}</button>`).join("")}
      <div class="feedback" id="exam-fb"></div>
    </div>`;
  stage.querySelectorAll(".choice").forEach(el=>{
    el.onclick = ()=>{
      stage.querySelectorAll(".choice").forEach(c=>c.style.pointerEvents="none");
      if(el.dataset.correct==="true"){ el.classList.add("correct"); examState.correct++; playSfx("correct"); }
      else{ el.classList.add("wrong"); playSfx("wrong"); }
      examState.idx++;
      setTimeout(renderExamQuestion, 900);
    };
  });
}
function renderExamResult(){
  const total = examState.questions.length;
  const pct = Math.round(examState.correct/total*100);
  const shields = pct>=90?5:pct>=75?4:pct>=60?3:pct>=40?2:1;
  document.getElementById("exam-stage").innerHTML = `
    <div class="center">
      <div class="badge-pop">🛡️</div>
      <h1>ผลทดสอบจำลอง</h1>
      <div class="stars" style="font-size:2rem">${"🛡️".repeat(shields)}${"⬜".repeat(5-shields)}</div>
      <div class="card"><h2>ตอบถูก ${examState.correct}/${total} ข้อ (${pct}%)</h2>
        <p class="th">คะแนนนี้ไม่ใช่ผลสอบจริง ใช้เพื่อลองประเมินความพร้อมเท่านั้น</p>
      </div>
      <button class="btn green" onclick="startMockExam()">🔁 ทดสอบอีกครั้ง</button>
      <button class="btn ghost" onclick="goMap()">🗺️ กลับแผนที่</button>
    </div>`;
  state.xp += examState.correct;
  const xpTotalEl = document.getElementById("xp-total");
  if(xpTotalEl) xpTotalEl.textContent = state.xp;
  if(activeProfile){ activeProfile.xp = state.xp; db.saveProfile(activeProfile).catch(console.error); }
}

/* ================= LESSON ENGINE ================= */
let steps = [];
function startLesson(id){
  state.lessonId = id; state.lessonXp = 0;
  const L = getLesson(id);
  if(L.lessonType === "reading"){
    steps = [
      {type:"intro"},
      {type:"reading"},
      {type:"result"},
    ];
  } else if(L.lessonType === "phonics"){
    /* โหมดอนุบาล audio-first: บทตัวอักษร (letters) หรือบทสะกดคำ CVC (cvc), review=true ข้ามขั้นสอนไปเล่นเกมเลย */
    const letters = L.letters || [];
    const cvc = L.cvc || [];
    const mix = arr => [...arr].sort(()=>Math.random()-.5);
    steps = [
      {type:"intro"},
      ...(L.review ? [] : letters.map(it=>({type:"phonics-letter", item:it}))),
      ...mix(letters).map(it=>({type:"phonics-listen", item:it})),
      ...mix(letters).slice(0, L.review ? 4 : letters.length).map(it=>({type:"phonics-match", item:it})),
      ...(L.review ? [] : cvc.map(it=>({type:"phonics-blend", item:it}))),
      ...mix(cvc).map(it=>({type:"phonics-listen-word", item:it})),
      ...(L.review && cvc.length ? mix(cvc).slice(0,3).map(it=>({type:"phonics-blend", item:it})) : []),
      {type:"result"},
    ];
  } else {
    const listenTargets = [...L.vocab].sort(()=>Math.random()-.5).slice(0,3);
    steps = [
      {type:"intro"},
      {type:"vocab"},
      ...listenTargets.map(v=>({type:"listen", item:v})),
      {type:"match"},
      ...(L.reading ? [{type:"reading"}] : []),
      {type:"build"},
      ...(L.questionBuild ? [{type:"question-build"}] : []),
      ...(L.writeSentence ? [{type:"write"}] : []),
      ...L.speak.map((s,i)=>({type:"speak", idx:i})),
      ...L.quiz.map((q,i)=>({type:"quiz", idx:i})),
      ...(L.transform||[]).map((t,i)=>({type:"transform", idx:i})),
      {type:"result"},
    ];
  }
  state.step = 0;
  show("scr-lesson");
  render();
}
function addXp(n){ state.lessonXp += n; document.getElementById("xp-lesson").textContent = state.lessonXp; }
function next(){ stopAllAudio(); state.step++; render(); }
function stepLabel(){
  const t = steps[state.step].type;
  const names = {intro:"เริ่มบทเรียน", vocab:"📖 คำศัพท์", listen:"🎧 ฟังแล้วเลือก", match:"🎮 จับคู่", build:"🧩 เรียงประโยค", speak:"🎤 ฝึกพูด", quiz:"⭐ ควิซ", transform:"🔄 แปลงประโยค", reading:"📖 อ่านเรื่อง", "phonics-letter":"🔤 ตัวอักษร", "phonics-listen":"👂 ฟังแล้วแตะ", "phonics-match":"🖼️ จับคู่เสียง", "phonics-blend":"🧩 สะกดคำ", "phonics-listen-word":"👂 ฟังคำ", result:"สรุปผล"};
  return `${names[t]||""} · ${state.step+1}/${steps.length}`;
}
function render(){
  const L = getLesson(state.lessonId);
  const st = steps[state.step];
  document.getElementById("lesson-progress").style.width = Math.round(state.step/(steps.length-1)*100)+"%";
  document.getElementById("xp-lesson").textContent = state.lessonXp;
  document.getElementById("step-label").textContent = stepLabel();
  const stage = document.getElementById("stage");

  if(st.type==="intro"){
    stage.innerHTML = `
      <div class="center">${sceneImgSlot(L.id, "🦆")}</div>
      <div class="bubble"><b>${L.intro.en}</b><div class="th">🐘 Mali: ${L.intro.th}</div></div>
      <div class="center">
        <button class="sound-btn en" data-say="${L.intro.en}" data-lang="en-US" data-audio="${L.id}-intro-en.mp3">🔊 EN</button>
        <button class="sound-btn th" data-say="${L.intro.th}" data-lang="th-TH" data-audio="${L.id}-intro-th.mp3">🔊 TH</button>
      </div>
      <div class="card center"><h2>${L.icon} ${L.title}</h2><p>${L.sub}</p>
        <p>${L.lessonType==="reading" ? "📖 อ่านนิทาน → ❓ ตอบคำถาม" : L.lessonType==="phonics" ? "👂 ฟัง → 👆 แตะ → 🌟 เก็บดาว" : "📖 ศัพท์ → 🎧 ฟังเลือก → 🎮 จับคู่ → 🧩 เรียงประโยค → 🎤 พูด → ⭐ ควิซ"}</p>
        <button class="btn yellow" onclick="next()">เริ่มเลย!</button>
      </div>`;
    playAudio(`${L.id}-intro-en.mp3`, L.intro.en, "en-US", {autoplay:true});
  }

  else if(st.type==="vocab"){
    stage.innerHTML = `
      <div class="bubble"><b>New Words! คำศัพท์ใหม่ 8 คำ</b><div class="th">แตะ 🔊 ฟังเสียง แล้วพูดตามนะ</div></div>
      <div class="grid2">${L.vocab.map(v=>`
        <div class="vocab-card">
          <div class="emoji">${vocabImgSlot(L.id, v)}</div>
          ${flagBadge(v.w)}
          <div class="word">${v.w}</div>
          <div class="th">${v.th}</div>
          <div class="sound-row">
            <button class="sound-btn en" data-say="${v.w}" data-lang="en-US" data-audio="${L.id}-vocab-${slug(v.w)}-en.mp3">🔊 EN</button>
            <button class="sound-btn th" data-say="${v.th}" data-lang="th-TH" data-audio="${L.id}-vocab-${slug(v.w)}-th.mp3">🔊 TH</button>
          </div>
        </div>`).join("")}
      </div>
      ${L.extraVocab ? `
      <div class="bubble" style="margin-top:14px"><b>คำศัพท์เสริม ⭐ (ไม่บังคับ)</b></div>
      <div class="grid2">${L.extraVocab.map(v=>`
        <div class="vocab-card">
          <div class="emoji">${v.e}</div>
          ${flagBadge(v.w)}
          <div class="word">${v.w}</div>
          <div class="th">${v.th}</div>
          <div class="sound-row">
            <button class="sound-btn en" data-say="${v.w}" data-lang="en-US">🔊 EN</button>
            <button class="sound-btn th" data-say="${v.th}" data-lang="th-TH">🔊 TH</button>
          </div>
        </div>`).join("")}
      </div>` : ""}
      <button class="btn green" onclick="addXp(10);next()">จำได้แล้ว! ต่อไป ➜</button>`;
  }

  else if(st.type==="listen"){
    const answer = st.item;
    const options = [answer, ...L.vocab.filter(v=>v.w!==answer.w).sort(()=>Math.random()-.5).slice(0,3)].sort(()=>Math.random()-.5);
    stage.innerHTML = `
      <div class="bubble"><b>Listen & Point! 🎧</b><div class="th">ฟังเสียงแล้วแตะภาพที่ถูกต้อง</div></div>
      <div class="center"><button class="sound-btn en" data-say="${answer.w}" data-lang="en-US" data-audio="${L.id}-vocab-${slug(answer.w)}-en.mp3" style="font-size:1.2rem;padding:12px 24px">🔊 ฟังอีกครั้ง</button></div>
      <div class="pick-grid" style="margin-top:10px">
        ${options.map(o=>`<button class="pick-item" data-w="${o.w}">${vocabImgSlot(L.id, o)}</button>`).join("")}
      </div>
      <div class="feedback" id="listen-fb"></div>`;
    playAudio(`${L.id}-vocab-${slug(answer.w)}-en.mp3`, answer.w, "en-US", {autoplay:true});
    document.querySelectorAll(".pick-item").forEach(el=>{
      el.onclick=()=>{
        if(el.dataset.w===answer.w){
          el.classList.add("correct"); addXp(2); playSfx("correct");
          document.getElementById("listen-fb").textContent = `✅ ${answer.w} = ${answer.th}`;
          document.querySelectorAll(".pick-item").forEach(x=>x.style.pointerEvents="none");
          setTimeout(next, 1000);
        }else{
          el.classList.add("wrong"); playSfx("wrong");
          document.getElementById("listen-fb").textContent = "ฟังอีกครั้งนะ 🎧";
          playAudio(`${L.id}-vocab-${slug(answer.w)}-en.mp3`, answer.w, "en-US");
          setTimeout(()=>el.classList.remove("wrong"),400);
        }
      };
    });
  }

  else if(st.type==="match"){
    const pairs = [...L.vocab].sort(()=>Math.random()-.5).slice(0,4);
    const words = [...pairs].sort(()=>Math.random()-.5);
    const emojis = [...pairs].sort(()=>Math.random()-.5);
    stage.innerHTML = `
      <div class="bubble"><b>Tap & Match!</b><div class="th">จับคู่คำกับภาพให้ถูกต้อง</div></div>
      <div class="match-grid" id="match-grid">
        ${words.map(v=>`<button class="match-item" data-k="${v.w}" data-t="w">${v.w}</button>`).join("")}
        ${emojis.map(v=>`<button class="match-item" data-k="${v.w}" data-t="e"><span class="big">${vocabImgSlot(L.id, v)}</span></button>`).join("")}
      </div>
      <div class="feedback" id="match-fb"></div>`;
    let sel = null, done = 0;
    document.querySelectorAll("#match-grid .match-item").forEach(el=>{
      el.onclick = ()=>{
        if(el.classList.contains("done")) return;
        if(sel === el){ el.classList.remove("selected"); sel=null; return; }
        if(!sel){ sel = el; el.classList.add("selected"); return; }
        if(sel.dataset.t !== el.dataset.t && sel.dataset.k === el.dataset.k){
          sel.classList.add("done"); el.classList.add("done");
          sel.classList.remove("selected");
          addXp(2); done++; playSfx("match");
          playAudio(`${L.id}-vocab-${slug(el.dataset.k)}-en.mp3`, el.dataset.k, "en-US");
          document.getElementById("match-fb").textContent = "✅ เก่งมาก!";
          if(done===4) setTimeout(next, 900);
        }else{
          el.classList.add("wrong"); playSfx("wrong"); setTimeout(()=>el.classList.remove("wrong"),400);
          sel.classList.remove("selected");
          document.getElementById("match-fb").textContent = "ลองใหม่นะ 💪";
        }
        sel = null;
      };
    });
  }

  else if(st.type==="reading"){
    const R = L.reading;
    stage.innerHTML = `
      <div class="bubble"><b>Reading Time! 📖</b><div class="th">อ่านย่อหน้าแล้วตอบคำถามด้านล่าง</div></div>
      ${L.lessonType==="reading" ? `<div class="center">${sceneImgSlot(L.id, L.icon)}</div>` : ""}
      <div class="card">
        ${R.passage.map(p=>`<p style="margin:.5em 0"><b>${p.en}</b><br><span class="th" style="color:#57678a">${p.th}</span></p>`).join("")}
      </div>
      ${R.questions.map((q,qi)=>`
        <div class="card">
          <h2 style="margin-top:0">${q.q}</h2>
          ${q.c.map((c,ci)=>`<button class="choice" data-qi="${qi}" data-ci="${ci}" data-correct="${ci===q.a}">${c}</button>`).join("")}
        </div>`).join("")}
      <div class="feedback" id="reading-fb"></div>
      <button class="btn green" id="reading-check">ตรวจคำตอบ ✔️</button>`;
    const selected = {};
    document.querySelectorAll(".choice").forEach(el=>{
      el.onclick = ()=>{
        const qi = el.dataset.qi;
        document.querySelectorAll(`.choice[data-qi="${qi}"]`).forEach(b=>b.style.borderColor="transparent");
        el.style.borderColor = "var(--blue)";
        selected[qi] = el;
      };
    });
    document.getElementById("reading-check").onclick = ()=>{
      let correct = 0;
      R.questions.forEach((q,qi)=>{
        const chosen = selected[qi];
        document.querySelectorAll(`.choice[data-qi="${qi}"]`).forEach(b=>{ if(b.dataset.correct==="true") b.classList.add("correct"); });
        if(chosen && chosen.dataset.correct==="true") correct++;
        else if(chosen) chosen.classList.add("wrong");
      });
      document.getElementById("reading-fb").textContent = `ตอบถูก ${correct}/${R.questions.length} ข้อ 🎉`;
      addXp(correct*3); playSfx(correct===R.questions.length?"star":"correct");
      document.getElementById("reading-check").style.display = "none";
      setTimeout(next, 2200);
    };
  }

  else if(st.type==="build"){
    const target = L.build.sentence.replace(/[.?!]/g,"");
    const words = target.split(" ");
    const shuffled = [...words].map((w,i)=>({w,i})).sort(()=>Math.random()-.5);
    let answer = [];
    stage.innerHTML = `
      <div class="bubble"><b>Word Builder! 🧩</b><div class="th">เรียงคำให้เป็นประโยค: "${L.build.th}"</div></div>
      <div class="card">
        <div class="chip-zone" id="answer-zone"></div>
        <div class="chip-zone" id="bank-zone" style="border-style:solid;border-color:transparent;background:transparent"></div>
        <div class="feedback" id="build-fb"></div>
        <button class="btn green" id="build-check">ตรวจคำตอบ ✔️</button>
      </div>`;
    const bank = document.getElementById("bank-zone"), zone = document.getElementById("answer-zone");
    function draw(){
      zone.innerHTML = answer.map((s,i)=>`<button class="chip in-answer" data-i="${i}">${s.w}</button>`).join("");
      bank.innerHTML = shuffled.filter(s=>!answer.includes(s)).map((s)=>`<button class="chip" data-si="${s.i}">${s.w}</button>`).join("");
      zone.querySelectorAll(".chip").forEach(c=>c.onclick=()=>{ answer.splice(+c.dataset.i,1); draw(); });
      bank.querySelectorAll(".chip").forEach(c=>c.onclick=()=>{
        const s = shuffled.find(x=>x.i===+c.dataset.si && !answer.includes(x));
        if(s) answer.push(s); draw();
      });
    }
    document.getElementById("build-check").onclick = ()=>{
      if(answer.map(s=>s.w).join(" ") === target){
        document.getElementById("build-fb").textContent = "🎉 ถูกต้อง! "+L.build.sentence;
        addXp(5); speak(L.build.sentence,"en-US");
        setTimeout(next, 1600);
      }else{
        document.getElementById("build-fb").textContent = "ยังไม่ถูก ลองสลับดูใหม่นะ 💪";
      }
    };
    draw();
  }

  else if(st.type==="question-build"){
    const target = L.questionBuild.sentence.replace(/[.?!]/g,"");
    const words = target.split(" ");
    const shuffled = [...words].map((w,i)=>({w,i})).sort(()=>Math.random()-.5);
    let answer = [];
    stage.innerHTML = `
      <div class="bubble"><b>Ask It! ❓</b><div class="th">เรียงคำให้เป็นประโยคคำถาม: "${L.questionBuild.th}"</div></div>
      <div class="card">
        <div class="chip-zone" id="qanswer-zone"></div>
        <div class="chip-zone" id="qbank-zone" style="border-style:solid;border-color:transparent;background:transparent"></div>
        <div class="feedback" id="qbuild-fb"></div>
        <button class="btn green" id="qbuild-check">ตรวจคำตอบ ✔️</button>
      </div>`;
    const bank = document.getElementById("qbank-zone"), zone = document.getElementById("qanswer-zone");
    function draw(){
      zone.innerHTML = answer.map((s,i)=>`<button class="chip in-answer" data-i="${i}">${s.w}</button>`).join("");
      bank.innerHTML = shuffled.filter(s=>!answer.includes(s)).map((s)=>`<button class="chip" data-si="${s.i}">${s.w}</button>`).join("");
      zone.querySelectorAll(".chip").forEach(c=>c.onclick=()=>{ answer.splice(+c.dataset.i,1); draw(); });
      bank.querySelectorAll(".chip").forEach(c=>c.onclick=()=>{
        const s = shuffled.find(x=>x.i===+c.dataset.si && !answer.includes(x));
        if(s) answer.push(s); draw();
      });
    }
    document.getElementById("qbuild-check").onclick = ()=>{
      if(answer.map(s=>s.w).join(" ") === target){
        document.getElementById("qbuild-fb").textContent = "🎉 ถามเก่งมาก! "+L.questionBuild.sentence+"?";
        addXp(5); speak(L.questionBuild.sentence+"?","en-US");
        setTimeout(next, 1600);
      }else{
        document.getElementById("qbuild-fb").textContent = "ยังไม่ถูก ลองสลับดูใหม่นะ 💪";
      }
    };
    draw();
  }

  else if(st.type==="write"){
    stage.innerHTML = `
      <div class="bubble"><b>Write It! ✏️</b><div class="th">พิมพ์ประโยคภาษาอังกฤษที่แปลว่า: "${L.build.th}"</div></div>
      <div class="card">
        <input class="name-input" id="write-input" autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false" placeholder="พิมพ์ประโยคที่นี่...">
        <div class="feedback" id="write-fb"></div>
        <button class="btn green" id="write-check">ตรวจคำตอบ ✔️</button>
        <button class="btn ghost" id="write-skip" onclick="next()" style="display:none">ต่อไป ➜</button>
      </div>`;
    document.getElementById("write-check").onclick = ()=>{
      const typed = document.getElementById("write-input").value.trim();
      const fb = document.getElementById("write-fb");
      if(!typed){ fb.textContent = "พิมพ์คำตอบก่อนนะ"; return; }
      const score = similarity(L.build.sentence, typed);
      if(score>=80){
        fb.innerHTML = `🌟 เก่งมาก! ตรง ${score}%<br>${L.build.sentence}`;
        addXp(5); playSfx("star");
        setTimeout(next, 1600);
      }else if(score>=50){
        fb.innerHTML = `👍 ใกล้แล้ว! ตรง ${score}%<br>ลองดูอีกครั้ง หรือกดต่อไปก็ได้`;
        addXp(3); playSfx("star");
        document.getElementById("write-skip").style.display = "block";
      }else{
        fb.innerHTML = `💪 ลองอีกครั้งนะ (คำตอบคือ: ${L.build.sentence})`;
        addXp(1); playSfx("star");
        document.getElementById("write-skip").style.display = "block";
      }
    };
  }

  else if(st.type==="speak"){
    const item = L.speak[st.idx];
    const audioFile = `${L.id}-speak-${String(st.idx+1).padStart(2,"0")}.mp3`;
    stage.innerHTML = `
      <div class="bubble"><b>Speak & Practice! 🎤 (${st.idx+1}/${L.speak.length})</b>
        <div class="th">1️⃣ ฟังต้นแบบ → 2️⃣ กดไมค์แล้วพูด (ระบบอัดเสียงให้) → 3️⃣ กด ▶️ ฟังเสียงตัวเองเทียบ</div></div>
      <div class="card center">
        <div class="target-sentence">"${item.t}"</div>
        <div class="th" style="color:#6b7a99">${item.th}</div>
        <div class="rec-row">
          <button class="sound-btn en" data-say="${item.t}" data-lang="en-US" data-audio="${audioFile}">🔊 ต้นแบบ</button>
          <button class="play-self" id="play-self">▶️ เสียงของหนู</button>
        </div>
        <button class="mic-btn" id="mic">🎙️</button>
        <div class="feedback" id="speak-fb">กดไมค์ 1 ครั้งแล้วพูดเลย!</div>
        <div class="stars" id="speak-stars"></div>
        <button class="btn ghost" id="speak-skip" onclick="next()" style="display:none">ต่อไป ➜</button>
      </div>`;
    setupSpeech(item.t);
    playAudio(audioFile, item.t, "en-US", {autoplay:true});
  }

  else if(st.type==="quiz"){
    const q = L.quiz[st.idx];
    /* สุ่มตำแหน่งตัวเลือก ไม่ให้คำตอบถูกอยู่ปุ่มแรกเสมอ (เดิม data มี a=0 เกือบทุกข้อ) */
    const opts = q.c.map((c,i)=>({text:c, correct:i===q.a})).sort(()=>Math.random()-.5);
    stage.innerHTML = `
      <div class="bubble"><b>Quiz ข้อ ${st.idx+1}/${L.quiz.length} 🦉</b></div>
      <div class="card"><h2 style="margin-top:0">${q.q}</h2>
        ${opts.map(o=>`<button class="choice" data-correct="${o.correct}">${o.text}</button>`).join("")}
        <div class="feedback" id="quiz-fb"></div>
      </div>`;
    document.querySelectorAll(".choice").forEach(el=>{
      el.onclick=()=>{
        if(el.dataset.correct === "true"){
          el.classList.add("correct"); addXp(3); playSfx("correct");
          document.getElementById("quiz-fb").textContent = "✅ ถูกต้อง!";
          document.querySelectorAll(".choice").forEach(c=>c.style.pointerEvents="none");
          setTimeout(next, 800);
        }else{
          el.classList.add("wrong"); playSfx("wrong");
          document.getElementById("quiz-fb").textContent = "เกือบแล้ว ลองใหม่นะ 💪";
        }
      };
    });
  }

  else if(st.type==="transform"){
    const t = L.transform[st.idx];
    const taskLabel = {negative:"เปลี่ยนเป็นประโยคปฏิเสธ", question:"เปลี่ยนเป็นประโยคคำถาม"}[t.task] || "แปลงประโยค";
    /* สุ่มตำแหน่งตัวเลือกเช่นเดียวกับควิซ */
    const topts = t.c.map((c,i)=>({text:c, correct:i===t.a})).sort(()=>Math.random()-.5);
    stage.innerHTML = `
      <div class="bubble"><b>Sentence Transform 🔄</b><div class="th">${taskLabel}</div></div>
      <div class="card">
        <h2 style="margin-top:0">${t.base}</h2>
        <p class="th">${t.baseTh}</p>
        ${topts.map(o=>`<button class="choice" data-correct="${o.correct}">${o.text}</button>`).join("")}
        <div class="feedback" id="transform-fb"></div>
      </div>`;
    document.querySelectorAll(".choice").forEach(el=>{
      el.onclick=()=>{
        if(el.dataset.correct === "true"){
          el.classList.add("correct"); addXp(4); playSfx("correct");
          document.getElementById("transform-fb").textContent = "✅ ถูกต้อง!";
          document.querySelectorAll(".choice").forEach(c=>c.style.pointerEvents="none");
          setTimeout(next, 800);
        }else{
          el.classList.add("wrong"); playSfx("wrong");
          document.getElementById("transform-fb").textContent = "เกือบแล้ว ลองใหม่นะ 💪";
        }
      };
    });
  }

  /* ================= PHONICS (โหมดอนุบาล) — ทุกกิจกรรม audio-first ไม่ต้องอ่านออก ================= */
  else if(st.type==="phonics-letter"){
    const it = st.item;
    const U = it.letter.toUpperCase();
    stage.innerHTML = `
      <div class="bubble"><b>ตัวอักษรใหม่! 🔤</b><div class="th">แตะปุ่มฟังเสียง แล้วพูดตามนะ</div></div>
      <div class="center"><div class="phonics-letter-big">${U} ${it.letter}</div></div>
      <div class="center">${phonicsImgSlot(`phonics-${it.letter}-${slug(it.word)}.png`, it.emoji)}</div>
      <div class="center"><b style="font-size:1.4rem">${it.word}</b> <span class="th" style="color:#57678a">${it.wordTh}</span></div>
      <div class="center">
        <button class="sound-btn en" id="ph-name">🔊 ชื่อ ${U}</button>
        <button class="sound-btn en" id="ph-sound">🗣️ เสียง</button>
        <button class="sound-btn en" id="ph-word">🔊 ${it.word}</button>
      </div>
      <div class="center"><button class="btn yellow" onclick="next()">ต่อไป ▶</button></div>`;
    document.getElementById("ph-name").onclick = ()=>playAudio(`phonics-${it.letter}-name.mp3`, U, "en-US");
    document.getElementById("ph-sound").onclick = ()=>playAudio(`phonics-${it.letter}-sound.mp3`, U, "en-US");
    document.getElementById("ph-word").onclick = ()=>playAudio(`phonics-${it.letter}-word.mp3`, it.word, "en-US");
    addXp(1);
    if(audioSettings.autoplay) playPhonicsSequence([`phonics-${it.letter}-name.mp3`, `phonics-${it.letter}-sound.mp3`, `phonics-${it.letter}-word.mp3`], {gapMs:500});
  }

  else if(st.type==="phonics-listen" || st.type==="phonics-match"){
    const L3 = getLesson(state.lessonId);
    const it = st.item;
    const pool = (L3.letters||[]).filter(x=>x.letter!==it.letter).sort(()=>Math.random()-.5).slice(0,2);
    const choices = [it, ...pool].sort(()=>Math.random()-.5);
    const isListen = st.type==="phonics-listen";
    stage.innerHTML = isListen ? `
      <div class="bubble"><b>ฟังเสียงแล้วแตะตัวอักษร 👂</b><div class="th">เสียงนี้คือตัวอักษรไหนนะ</div></div>
      <div class="center"><button class="sound-btn en" id="ph-replay" style="font-size:1.2rem">🔊 ฟังอีกครั้ง</button></div>
      <div class="phonics-choices">${choices.map(c=>`
        <button class="choice phonics-choice" data-correct="${c.letter===it.letter}">${c.letter.toUpperCase()} ${c.letter}</button>`).join("")}
      </div>` : `
      <div class="bubble"><b>ตัวอักษรนี้ขึ้นต้นคำไหน 🖼️</b><div class="th">แตะภาพที่ขึ้นต้นด้วยเสียงนี้</div></div>
      <div class="center"><div class="phonics-letter-big">${it.letter.toUpperCase()} ${it.letter}</div>
        <button class="sound-btn en" id="ph-replay">🔊 ฟังเสียง</button></div>
      <div class="phonics-choices">${choices.map(c=>`
        <button class="choice phonics-choice" data-correct="${c.letter===it.letter}">
          ${phonicsImgSlot(`phonics-${c.letter}-${slug(c.word)}.png`, c.emoji)}</button>`).join("")}
      </div>`;
    const play = ()=>playAudio(`phonics-${it.letter}-sound.mp3`, it.letter.toUpperCase(), "en-US");
    document.getElementById("ph-replay").onclick = play;
    if(audioSettings.autoplay) play();
    wirePhonicsChoices(stage);
  }

  else if(st.type==="phonics-blend" || st.type==="phonics-listen-word"){
    const L3 = getLesson(state.lessonId);
    const it = st.item;
    const pool = (L3.cvc||[]).filter(x=>x.word!==it.word).sort(()=>Math.random()-.5).slice(0,2);
    const choices = [it, ...pool].sort(()=>Math.random()-.5);
    const isBlend = st.type==="phonics-blend";
    const tiles = it.word.split("");
    stage.innerHTML = `
      <div class="bubble"><b>${isBlend ? "สะกดคำกัน! 🧩" : "ฟังคำแล้วแตะภาพ 👂"}</b><div class="th">${isBlend ? "ฟังเสียงสะกดทีละตัว แล้วแตะภาพที่ถูกต้อง" : "คำนี้คือภาพไหนนะ"}</div></div>
      ${isBlend ? `<div class="phonics-tiles">${tiles.map((ch,i)=>`<span class="phonics-tile" id="ph-tile-${i}">${ch}</span>`).join("")}</div>` : ""}
      <div class="center"><button class="sound-btn en" id="ph-replay" style="font-size:1.2rem">${isBlend ? "🔤 สะกดอีกครั้ง" : "🔊 ฟังอีกครั้ง"}</button></div>
      <div class="phonics-choices">${choices.map(c=>`
        <button class="choice phonics-choice" data-correct="${c.word===it.word}">
          ${phonicsImgSlot(`phonics-cvc-${c.word}.png`, c.emoji)}</button>`).join("")}
      </div>`;
    const play = isBlend
      ? ()=>playPhonicsSequence(
          [...tiles.map(ch=>`phonics-${ch}-sound.mp3`), `phonics-cvc-${it.word}.mp3`],
          {gapMs:450, onStep:i=>{
            tiles.forEach((_,j)=>document.getElementById(`ph-tile-${j}`)?.classList.toggle("lit", j===i));
            if(i>=tiles.length) tiles.forEach((_,j)=>document.getElementById(`ph-tile-${j}`)?.classList.add("lit"));
          }})
      : ()=>playAudio(`phonics-cvc-${it.word}.mp3`, it.word, "en-US");
    document.getElementById("ph-replay").onclick = play;
    if(audioSettings.autoplay) play();
    wirePhonicsChoices(stage);
  }

  else if(st.type==="result"){
    const L2 = getLesson(state.lessonId);
    const max = L2.lessonType === "reading"
      ? (L2.reading.questions.length*3)
      : L2.lessonType === "phonics"
      ? steps.reduce((s,x)=> s + (x.type==="phonics-letter" ? 1 : (x.type||"").startsWith("phonics-") ? 3 : 0), 0)
      : 10 + 6 + 8 + 5 + (L2.questionBuild?5:0) + (L2.writeSentence?5:0) + ((L2.reading?.questions.length||0)*3) + (L2.speak.length*10) + (L2.quiz.length*3) + ((L2.transform||[]).length*4);
    const ratio = state.lessonXp / max;
    const stars = ratio>=.8?3:ratio>=.5?2:1;
    state.xp += state.lessonXp;
    state.stars[state.lessonId] = Math.max(state.stars[state.lessonId]||0, stars);
    
    if(activeProfile){
      activeProfile.xp = state.xp;
      activeProfile.stars = state.stars;
      db.saveProfile(activeProfile).catch(console.error);
    }
    
    const nid = nextLessonId(state.lessonId);
    stage.innerHTML = `
      <div class="center">
        <div class="badge-pop">${stars===3?"🏆":stars===2?"🎉":"🌟"}</div>
        <h1>เยี่ยมมาก ${state.name}!</h1>
        <div class="stars">${"⭐".repeat(stars)}${"☆".repeat(3-stars)}</div>
        <div class="card">
          <h2>💎 +${state.lessonXp} XP</h2>
          <p>${L2.icon} ${L2.title} — ${L2.sub}</p>
          ${stars<3?"<p>💡 เล่นซ้ำเพื่อเก็บดาวให้ครบ 3 ได้นะ!</p>":"<p>🏅 ได้เหรียญ Perfect Lesson!</p>"}
        </div>
        ${nid?`<button class="btn green" onclick="playSfx('levelup');startLesson('${nid}')">▶️ บทถัดไป: ${getLesson(nid).title}</button>`:""}
        <button class="btn yellow" onclick="startLesson(state.lessonId)">🔁 เล่นอีกครั้ง</button>
        <button class="btn" onclick="goMap()">🗺️ กลับแผนที่</button>
      </div>`;
    playSfx("lesson-complete");
    if(stars===3) setTimeout(()=>playSfx("perfect"), 400);
    speak("เก่งมากๆ เลย! ได้ "+stars+" ดาว","th-TH");
  }

  hydrateImages();
}

/* ================= SPEECH: อัดเสียง + ถอดเสียง + ฟังเทียบ ================= */
function similarity(a,b){
  const norm = s => s.toLowerCase().replace(/[^a-z ]/g,"").split(/\s+/).filter(Boolean);
  const ta = norm(a), tb = norm(b);
  if(!ta.length) return 0;
  let hit = 0;
  ta.forEach(w=>{ if(tb.includes(w)) hit++; });
  return Math.round(hit/ta.length*100);
}
function recordSpeakingAttempt(target, score){
  if(!activeProfile) return;
  if(!Array.isArray(activeProfile.speakingStats)) activeProfile.speakingStats = [];
  activeProfile.speakingStats.push({ lessonId: state.lessonId, target, score, at: Date.now() });
  /* เก็บแค่ 200 ครั้งล่าสุดต่อโปรไฟล์ กันข้อมูลบวมไม่มีที่สิ้นสุด */
  if(activeProfile.speakingStats.length > 200) activeProfile.speakingStats = activeProfile.speakingStats.slice(-200);
  db.saveProfile(activeProfile).catch(console.error);
}
function setupSpeech(target){
  const mic = document.getElementById("mic");
  const fb = document.getElementById("speak-fb");
  const starEl = document.getElementById("speak-stars");
  const skip = document.getElementById("speak-skip");
  const playSelf = document.getElementById("play-self");
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  const canRecord = navigator.mediaDevices && window.MediaRecorder;
  let myVoiceUrl = null, recorder = null, chunks = [], rec = null, busy = false;

  playSelf.onclick = ()=>{
    if(!myVoiceUrl) return;
    AudioManager.stopPlayback();
    const a = new Audio(myVoiceUrl); a.volume = audioVolume("speech"); AudioManager.self = a;
    a.play().catch(()=>{ fb.textContent="Safari ไม่อนุญาตให้เล่นเสียง กรุณาแตะ ▶️ อีกครั้ง"; });
  };

  function finishScore(best, heard){
    /* best = % ของคำที่ระบบได้ยินตรงกับต้นแบบ ไม่ใช่การวัดสำเนียง — สื่อสารให้ตรงความจริง
       และให้ XP จากความพยายามทุกครั้ง เพราะระบบรู้จำเสียงอาจ bias กับสำเนียงเด็กไทย */
    const stars = best>=80?3:best>=50?2:1;
    starEl.textContent = "⭐".repeat(stars)+"☆".repeat(3-stars);
    if(best>=80){ fb.innerHTML = `🌟 เยี่ยมมาก! ระบบได้ยินคำตรง <b>${best}%</b><br>กด ▶️ ฟังเสียงตัวเองเทียบกับต้นแบบได้เลย`; addXp(10); playSfx("star"); }
    else if(best>=50){ fb.innerHTML = `👍 ดีมาก! ตรง <b>${best}%</b> ของคำ (ระบบได้ยิน: "${heard}")<br>สำเนียงแต่ละคนต่างกันได้นะ จะอัดใหม่หรือไปต่อก็ได้`; addXp(6); playSfx("star"); }
    else { fb.innerHTML = `💪 เก่งมากที่ลองพูด! (ระบบได้ยิน: "${heard||"—"}")<br>กด 🔊 ต้นแบบ ฟังช้าๆ แล้วลองอีกครั้ง — พูดได้ก็ได้ดาวนะ`; addXp(3); playSfx("star"); }
    skip.style.display="block";
    recordSpeakingAttempt(target, best);
  }

  async function startRecording(){
    if(busy) return;
    if(localStorage.getItem("fejMicConsent")!=="yes"){
      const accepted = confirm("ไมโครโฟนใช้สำหรับฝึกพูดและฟังเสียงตนเอง เบราว์เซอร์อาจใช้บริการรู้จำเสียงของผู้ผลิตอุปกรณ์ หนูสามารถกดยกเลิกและข้ามกิจกรรมนี้ได้");
      if(!accepted){ fb.textContent="ไม่ได้เปิดไมโครโฟน สามารถกด ต่อไป เพื่อข้ามกิจกรรมนี้"; skip.style.display="block"; return; }
      localStorage.setItem("fejMicConsent","yes");
    }
    busy = true;
    playSfx("record-start");
    speechSynthesis.cancel();
    chunks = [];
    if(myVoiceUrl){ URL.revokeObjectURL(myVoiceUrl); myVoiceUrl=null; }
    playSelf.style.display="none";

    if(canRecord){
      try{
        mediaStream = await navigator.mediaDevices.getUserMedia({audio:{echoCancellation:true,noiseSuppression:true,autoGainControl:true}});
        AudioManager.mediaStream = mediaStream;
        recorder = new MediaRecorder(mediaStream);
        recorder.ondataavailable = e=>{ if(e.data.size) chunks.push(e.data); };
        recorder.onstop = ()=>{
          if(chunks.length){
            myVoiceUrl = URL.createObjectURL(new Blob(chunks));
            playSelf.style.display="inline-block";
            fb.innerHTML += "<br>💾 อัดเสียงแล้ว! กด ▶️ ฟังได้เลย";
          }
          if(mediaStream){ mediaStream.getTracks().forEach(t=>t.stop()); mediaStream=null; }
          AudioManager.mediaStream=null;
        };
        recorder.start();
      }catch(e){
        fb.textContent = micErrorMessage(e);
        busy = false; skip.style.display="block"; return;
      }
    }
    mic.classList.add("listening");
    fb.textContent = "🔴 กำลังอัด... พูดเลย!";

    if(SR){
      rec = new SR();
      rec.lang = "en-US"; rec.interimResults = false; rec.maxAlternatives = 3;
      rec.onresult = ev=>{
        let best = 0, heard = "";
        for(const alt of ev.results[0]){
          const s = similarity(target, alt.transcript);
          if(s > best){ best = s; heard = alt.transcript; }
        }
        finishScore(best, heard);
      };
      rec.onerror = ev=>{
        const speechMessages={"not-allowed":"Safari ไม่อนุญาตระบบรู้จำเสียง กรุณาตรวจสิทธิ์ไมโครโฟนและเปิด Siri","audio-capture":"ระบบรู้จำเสียงไม่พบสัญญาณไมโครโฟน","no-speech":"ระบบไม่ได้ยินคำพูด ลองพูดใกล้ไมโครโฟนอีกครั้ง","network":"ระบบรู้จำเสียงเชื่อมต่อบริการไม่ได้ แต่อาจยังฟังเสียงที่อัดไว้ได้"};
        fb.textContent = speechMessages[ev.error] || `ระบบรู้จำเสียงไม่พร้อม (${ev.error||"unknown"})`;
        skip.style.display="block";
      };
      rec.onend = ()=> stopRecording();
      try{ rec.start(); }catch(e){}
      setTimeout(()=>{ if(busy) stopRecording(); }, 6000);
    }else{
      fb.textContent = "🔴 กำลังอัด 4 วินาที... พูดเลย!";
      setTimeout(()=>{
        stopRecording();
        fb.innerHTML = "อุปกรณ์นี้ให้คะแนนอัตโนมัติไม่ได้ 🙏<br>กด ▶️ ฟังเสียงตัวเอง เทียบกับ 🔊 ต้นแบบดูนะ";
        addXp(6); skip.style.display="block";
      }, 4000);
    }
  }
  function stopRecording(){
    busy = false;
    playSfx("record-stop");
    mic.classList.remove("listening");
    if(rec){ try{ rec.stop(); }catch(e){} rec = null; }
    if(recorder && recorder.state !== "inactive") recorder.stop();
    if(mediaStream && (!recorder || recorder.state === "inactive")){ mediaStream.getTracks().forEach(t=>t.stop()); mediaStream=null; AudioManager.mediaStream=null; }
  }
  mic.onclick = ()=>{ busy ? stopRecording() : startRecording(); };
}

/* ================= SETTINGS + MICROPHONE DIAGNOSTICS ================= */
let micTestStream = null, micTestRecorder = null, micTestChunks = [], micTestUrl = null;
let micTestContext = null, micTestFrame = null;
function syncSettingsUi(){
  const fields = {"set-master":audioSettings.master*100,"set-speech":audioSettings.speech*100,"set-sfx":audioSettings.sfx*100};
  Object.entries(fields).forEach(([id,value])=>{ const el=document.getElementById(id); if(el) el.value=value; });
  document.getElementById("set-autoplay").checked = !!audioSettings.autoplay;
  document.getElementById("set-rate").value = audioSettings.rate;
  document.getElementById("set-motion").checked = !!audioSettings.reduceMotion;
  updateSettingsOutputs(); document.body.classList.toggle("reduce-motion", !!audioSettings.reduceMotion);
}
function updateSettingsOutputs(){
  document.getElementById("out-master").textContent = Math.round(audioSettings.master*100)+"%";
  document.getElementById("out-speech").textContent = Math.round(audioSettings.speech*100)+"%";
  document.getElementById("out-sfx").textContent = Math.round(audioSettings.sfx*100)+"%";
  if(AudioManager.main) AudioManager.main.volume = audioVolume("speech");
}
function bindSettings(){
  [["set-master","master"],["set-speech","speech"],["set-sfx","sfx"]].forEach(([id,key])=>{
    document.getElementById(id).addEventListener("input", e=>{ audioSettings[key]=+e.target.value/100; updateSettingsOutputs(); saveAudioSettings(); });
  });
  document.getElementById("set-autoplay").addEventListener("change", e=>{ audioSettings.autoplay=e.target.checked; saveAudioSettings(); });
  document.getElementById("set-rate").addEventListener("change", e=>{ audioSettings.rate=e.target.value; saveAudioSettings(); });
  document.getElementById("set-motion").addEventListener("change", e=>{ audioSettings.reduceMotion=e.target.checked; saveAudioSettings(); });
  document.getElementById("test-sound").addEventListener("click", ()=>speak("Hello! เสียงทดสอบพร้อมแล้ว", "th-TH"));
  document.getElementById("mic-test-start").addEventListener("click", startMicTest);
  document.getElementById("mic-test-stop").addEventListener("click", stopMicTest);
  document.getElementById("mic-test-play").addEventListener("click", ()=>{
    if(!micTestUrl) return; AudioManager.stopPlayback();
    const a = new Audio(micTestUrl); a.volume=audioVolume("speech"); AudioManager.self=a; a.play().catch(()=>setMicStatus("Safari ไม่อนุญาตให้เล่นเสียง กรุณาลองแตะอีกครั้ง"));
  });
}
function micErrorMessage(err){
  const messages = {
    NotAllowedError:"ไม่ได้รับอนุญาตไมโครโฟน กรุณาเปิดสิทธิ์ Microphone ในการตั้งค่า Safari",
    NotFoundError:"ไม่พบไมโครโฟนบนอุปกรณ์นี้",
    NotReadableError:"ไมโครโฟนอาจถูกใช้งานโดยแอปอื่น กรุณาปิดแอปนั้นแล้วลองใหม่",
    AbortError:"การเปิดไมโครโฟนถูกยกเลิก กรุณาลองใหม่",
    SecurityError:"ต้องเปิดเว็บผ่าน HTTPS เพื่อใช้ไมโครโฟน",
    OverconstrainedError:"อุปกรณ์ไม่รองรับการตั้งค่าไมโครโฟนที่ร้องขอ"
  };
  return messages[err?.name] || `เปิดไมโครโฟนไม่สำเร็จ${err?.name?` (${err.name})`:""}`;
}
function setMicStatus(text){ const el=document.getElementById("mic-test-status"); if(el) el.textContent=text; }
async function updateMicCapability(){
  const box=document.getElementById("mic-capability"); if(!box) return;
  const secure=window.isSecureContext, media=!!navigator.mediaDevices?.getUserMedia;
  const recorder=!!window.MediaRecorder, recognition=!!(window.SpeechRecognition||window.webkitSpeechRecognition);
  let permission="ไม่ทราบ";
  try{ if(navigator.permissions?.query) permission=(await navigator.permissions.query({name:"microphone"})).state; }catch(e){}
  box.innerHTML=`<b>สถานะอุปกรณ์</b><br>${secure?"✅":"❌"} Secure connection<br>${media?"✅":"❌"} รับเสียงไมโครโฟน<br>${recorder?"✅":"❌"} อัดเสียง<br>${recognition?"✅":"⚠️"} รู้จำคำพูด${recognition?"":" (อัดเสียงได้ แต่ให้คะแนนอัตโนมัติไม่ได้)"}<br>สิทธิ์ไมโครโฟน: ${permission}`;
}
async function startMicTest(){
  if(micTestStream) return;
  setMicStatus("กำลังขออนุญาตไมโครโฟน…");
  try{
    if(!navigator.mediaDevices?.getUserMedia) throw Object.assign(new Error(),{name:window.isSecureContext?"NotSupportedError":"SecurityError"});
    micTestStream = await navigator.mediaDevices.getUserMedia({audio:{echoCancellation:true,noiseSuppression:true,autoGainControl:true}});
    AudioManager.mediaStream=micTestStream; syncAudioAliases(); micTestChunks=[];
    document.getElementById("mic-test-start").disabled=true; document.getElementById("mic-test-stop").disabled=false;
    if(micTestUrl){ URL.revokeObjectURL(micTestUrl); micTestUrl=null; }
    document.getElementById("mic-test-play").disabled=true;
    if(window.MediaRecorder){
      micTestRecorder=new MediaRecorder(micTestStream);
      const activeRecorder=micTestRecorder;
      micTestRecorder.ondataavailable=e=>{if(e.data.size) micTestChunks.push(e.data);};
      micTestRecorder.onstop=()=>{
        if(micTestChunks.length){ micTestUrl=URL.createObjectURL(new Blob(micTestChunks,{type:activeRecorder.mimeType||"audio/mp4"})); document.getElementById("mic-test-play").disabled=false; }
      };
      micTestRecorder.start();
    }
    startMicMeter(micTestStream); setMicStatus("🔴 กำลังรับเสียง — ลองพูดแล้วดูแถบระดับเสียง"); updateMicCapability();
  }catch(err){ setMicStatus(micErrorMessage(err)); document.getElementById("mic-test-start").disabled=false; document.getElementById("mic-test-stop").disabled=true; updateMicCapability(); }
}
function startMicMeter(stream){
  try{
    const AC=window.AudioContext||window.webkitAudioContext; if(!AC) return;
    micTestContext=new AC(); const source=micTestContext.createMediaStreamSource(stream); const analyser=micTestContext.createAnalyser(); analyser.fftSize=256; source.connect(analyser);
    const values=new Uint8Array(analyser.frequencyBinCount); const fill=document.getElementById("mic-meter-fill");
    const draw=()=>{ analyser.getByteTimeDomainData(values); let sum=0; for(const v of values){const n=(v-128)/128;sum+=n*n;} const rms=Math.sqrt(sum/values.length); fill.style.width=Math.min(100,Math.max(2,rms*500))+"%"; micTestFrame=requestAnimationFrame(draw); }; draw();
  }catch(e){}
}
function stopMicTest(){
  if(micTestRecorder && micTestRecorder.state!=="inactive") micTestRecorder.stop();
  micTestRecorder=null; if(micTestFrame) cancelAnimationFrame(micTestFrame); micTestFrame=null;
  if(micTestContext){ micTestContext.close().catch(()=>{}); micTestContext=null; }
  if(micTestStream){ micTestStream.getTracks().forEach(t=>t.stop()); micTestStream=null; }
  AudioManager.mediaStream=null; syncAudioAliases();
  const fill=document.getElementById("mic-meter-fill"); if(fill) fill.style.width="0";
  const start=document.getElementById("mic-test-start"), stop=document.getElementById("mic-test-stop"); if(start) start.disabled=false; if(stop) stop.disabled=true;
  if(document.getElementById("mic-test-status")?.textContent.includes("กำลังรับเสียง")) setMicStatus(micTestUrl?"✅ อัดเสียงทดสอบแล้ว กดฟังเพื่อตรวจสอบ":"หยุดทดสอบแล้ว");
}

/* ================= INIT: โหลดเนื้อหาบทเรียนและเปิดฐานข้อมูลก่อนปลดล็อก ================= */
(function init(){
  const btn = document.getElementById("btn-start");
  bindSettings(); syncSettingsUi(); saveAudioSettings();
  try {
    if(JSON.parse(localStorage.getItem("fejParentConsent") || "null")?.given){
      document.getElementById("inp-consent").checked = true;
    }
  } catch(e) {}
  db.open().then(() => {
    btn.disabled = false;
    btn.textContent = "เริ่มผจญภัย! 🚀";
    refreshProfilesList();
  }).catch(err => {
    btn.textContent = "โหลดไม่สำเร็จ 😢";
    console.error(err);
    alert("โหลดข้อมูลเริ่มต้นไม่สำเร็จ: " + err.message);
  });
})();
