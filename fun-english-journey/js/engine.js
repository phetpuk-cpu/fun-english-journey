/* ============================================================
   DATA LOADING — CONTENT ย้ายไปอยู่ data/*.json (ดู project-handoff.md 3.1)
   ============================================================ */
const UNIT_FILES = {
  p3: ["data/p3u1.json", "data/p3u2.json"],
  p4: ["data/p4u1.json", "data/p4u2.json"],
};
let CONTENT = null;

async function loadContent(){
  const build = {};
  for(const grade of Object.keys(UNIT_FILES)){
    const units = [];
    let gradeName = "";
    for(const file of UNIT_FILES[grade]){
      const res = await fetch(file);
      if(!res.ok) throw new Error(`โหลด ${file} ไม่สำเร็จ (${res.status})`);
      const data = await res.json();
      gradeName = data.gradeName;
      units.push({ name: data.unitName, lessons: data.lessons });
    }
    build[grade] = { name: gradeName, units };
  }
  return build;
}

/* ================= STATE (in-memory) ================= */
const state = {name:"เพื่อน", avatar:"🦁", xp:0, grade:"p3", lessonId:null, step:0, lessonXp:0, stars:{}};
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

/* ================= AUDIO (TTS placeholder until real voice files) ================= */
function speak(text, lang){
  try{
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = lang; u.rate = lang.startsWith("en") ? 0.75 : 0.65;
    const voices = speechSynthesis.getVoices();
    const v = voices.find(v=>v.lang && v.lang.startsWith(lang.split("-")[0]));
    if(v) u.voice = v;
    speechSynthesis.speak(u);
  }catch(e){}
}
if("speechSynthesis" in window){
  speechSynthesis.getVoices();
  speechSynthesis.onvoiceschanged = ()=>speechSynthesis.getVoices();
}

let currentAudio = null, mediaStream = null;
function stopAllAudio(){
  speechSynthesis.cancel();
  if(currentAudio){ currentAudio.pause(); currentAudio = null; }
  if(mediaStream){ mediaStream.getTracks().forEach(t=>t.stop()); mediaStream = null; }
}

/* ================= ASSET RESOLUTION — real file ถ้ามี / fallback emoji+TTS ถ้าไม่มี =================
   ชื่อไฟล์ต้องตรงตามกฎใน asset-production-kit.md (A3/A4 ภาพ, B2 เสียง) ทุกตัวอักษร */
function slug(w){
  return w.toLowerCase().replace(/'/g,"").replace(/[^a-z0-9]+/g,"-").replace(/(^-|-$)/g,"");
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
function hydrateImages(){
  document.querySelectorAll("#stage [data-img]").forEach(el=>{
    if(el.dataset.hydrated) return;
    el.dataset.hydrated = "1";
    const candidates = [el.dataset.img, el.dataset.imgAlt].filter(Boolean);
    (function tryNext(i){
      if(i>=candidates.length) return; /* ไม่มีไฟล์จริงที่ path ไหนเลย — ปล่อย emoji เดิมไว้ */
      const img = new Image();
      img.onload = ()=>{ el.innerHTML = ""; img.className = "asset-img"; el.appendChild(img); };
      img.onerror = ()=> tryNext(i+1);
      img.src = "assets/img/"+candidates[i];
    })(0);
  });
}
function playAudio(filename, fallbackText, fallbackLang){
  stopAllAudio();
  if(!filename){ speak(fallbackText, fallbackLang); return; }
  const audio = new Audio(`assets/audio/${filename}`);
  let handled = false;
  const useFallback = ()=>{ if(handled) return; handled = true; speak(fallbackText, fallbackLang); };
  audio.addEventListener("canplaythrough", ()=>{
    if(handled) return; handled = true;
    currentAudio = audio; audio.play().catch(useFallback);
  }, {once:true});
  audio.addEventListener("error", useFallback, {once:true});
  audio.load();
  setTimeout(useFallback, 1200);
}
document.addEventListener("click", e=>{
  const b = e.target.closest("[data-say]");
  if(b){ playAudio(b.dataset.audio, b.dataset.say, b.dataset.lang || "en-US"); return; }
  if(e.target.closest(".btn, .lesson-node, .tab, .avatar, .back")) playSfx("click");
});

/* sfx-*.wav ไม่มี fallback (ไม่ใช่เสียงพูด ไม่มีอะไรให้ TTS แทน) เงียบไปเฉยๆ ถ้ายังไม่มีไฟล์ */
function playSfx(name){
  try{
    const a = new Audio(`assets/audio/sfx-${name}.wav`);
    a.volume = 0.7;
    a.play().catch(()=>{});
  }catch(e){}
}

/* ================= NAVIGATION ================= */
function show(id){ document.querySelectorAll(".screen").forEach(s=>s.classList.remove("active")); document.getElementById(id).classList.add("active"); window.scrollTo(0,0); }
document.querySelectorAll("#avatar-row .avatar").forEach(b=>b.onclick=()=>{
  document.querySelectorAll("#avatar-row .avatar").forEach(x=>x.classList.remove("selected"));
  b.classList.add("selected"); state.avatar=b.textContent;
});
document.querySelectorAll(".tab").forEach(t=>t.onclick=()=>{
  document.querySelectorAll(".tab").forEach(x=>x.classList.remove("active"));
  t.classList.add("active"); state.grade = t.dataset.g; drawMap();
});
function startApp(){
  const n = document.getElementById("inp-name").value.trim();
  if(n) state.name = n;
  document.getElementById("map-name").textContent = state.name;
  document.getElementById("map-avatar").textContent = state.avatar;
  speak("สวัสดี น้อง"+state.name+" ยินดีต้อนรับสู่การผจญภัยภาษาอังกฤษ!","th-TH");
  goMap();
}
function drawMap(){
  const g = CONTENT[state.grade];
  document.getElementById("map-list").innerHTML =
    `<h2 style="margin:8px 0 0">🗺️ ${g.name}</h2>` +
    g.units.map(u=>`
      <div class="unit-head">${u.name}</div>
      ${u.lessons.map(l=>{
        const s = state.stars[l.id]||0;
        return `<button class="lesson-node" onclick="startLesson('${l.id}')">
          <span class="icon">${l.icon}</span>
          <span class="info"><span class="name">${l.title} — ${l.sub}</span>
          <span class="sub">ศัพท์ 8 คำ · พูด 4 ประโยค · ควิซ 8 ข้อ</span></span>
          <span>${"⭐".repeat(s)}${"☆".repeat(3-s)}</span></button>`;
      }).join("")}`).join("");
}
function goMap(){
  stopAllAudio();
  document.getElementById("xp-total").textContent = state.xp;
  drawMap();
  show("scr-map");
}

/* ================= LESSON ENGINE ================= */
let steps = [];
function startLesson(id){
  state.lessonId = id; state.lessonXp = 0;
  const L = getLesson(id);
  const listenTargets = [...L.vocab].sort(()=>Math.random()-.5).slice(0,3);
  steps = [
    {type:"intro"},
    {type:"vocab"},
    ...listenTargets.map(v=>({type:"listen", item:v})),
    {type:"match"},
    {type:"build"},
    ...L.speak.map((s,i)=>({type:"speak", idx:i})),
    ...L.quiz.map((q,i)=>({type:"quiz", idx:i})),
    {type:"result"},
  ];
  state.step = 0;
  show("scr-lesson");
  render();
}
function addXp(n){ state.lessonXp += n; document.getElementById("xp-lesson").textContent = state.lessonXp; }
function next(){ stopAllAudio(); state.step++; render(); }
function stepLabel(){
  const t = steps[state.step].type;
  const names = {intro:"เริ่มบทเรียน", vocab:"📖 คำศัพท์", listen:"🎧 ฟังแล้วเลือก", match:"🎮 จับคู่", build:"🧩 เรียงประโยค", speak:"🎤 ฝึกพูด", quiz:"⭐ ควิซ", result:"สรุปผล"};
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
        <p>📖 ศัพท์ → 🎧 ฟังเลือก → 🎮 จับคู่ → 🧩 เรียงประโยค → 🎤 พูด → ⭐ ควิซ</p>
        <button class="btn yellow" onclick="next()">เริ่มเลย!</button>
      </div>`;
    playAudio(`${L.id}-intro-en.mp3`, L.intro.en, "en-US");
  }

  else if(st.type==="vocab"){
    stage.innerHTML = `
      <div class="bubble"><b>New Words! คำศัพท์ใหม่ 8 คำ</b><div class="th">แตะ 🔊 ฟังเสียง แล้วพูดตามนะ</div></div>
      <div class="grid2">${L.vocab.map(v=>`
        <div class="vocab-card">
          <div class="emoji">${vocabImgSlot(L.id, v)}</div>
          <div class="word">${v.w}</div>
          <div class="th">${v.th}</div>
          <div class="sound-row">
            <button class="sound-btn en" data-say="${v.w}" data-lang="en-US" data-audio="${L.id}-vocab-${slug(v.w)}-en.mp3">🔊 EN</button>
            <button class="sound-btn th" data-say="${v.th}" data-lang="th-TH" data-audio="${L.id}-vocab-${slug(v.w)}-th.mp3">🔊 TH</button>
          </div>
        </div>`).join("")}
      </div>
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
    playAudio(`${L.id}-vocab-${slug(answer.w)}-en.mp3`, answer.w, "en-US");
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

  else if(st.type==="speak"){
    const item = L.speak[st.idx];
    const audioFile = `${L.id}-speak-${String(st.idx+1).padStart(2,"0")}.mp3`;
    stage.innerHTML = `
      <div class="bubble"><b>Speak & Score! 🎤 (${st.idx+1}/${L.speak.length})</b>
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
    playAudio(audioFile, item.t, "en-US");
  }

  else if(st.type==="quiz"){
    const q = L.quiz[st.idx];
    stage.innerHTML = `
      <div class="bubble"><b>Quiz ข้อ ${st.idx+1}/${L.quiz.length} 🦉</b></div>
      <div class="card"><h2 style="margin-top:0">${q.q}</h2>
        ${q.c.map((c,i)=>`<button class="choice" data-i="${i}">${c}</button>`).join("")}
        <div class="feedback" id="quiz-fb"></div>
      </div>`;
    document.querySelectorAll(".choice").forEach(el=>{
      el.onclick=()=>{
        if(+el.dataset.i === q.a){
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

  else if(st.type==="result"){
    const L2 = getLesson(state.lessonId);
    const max = 10 + 6 + 8 + 5 + (L2.speak.length*10) + (L2.quiz.length*3);
    const ratio = state.lessonXp / max;
    const stars = ratio>=.8?3:ratio>=.5?2:1;
    state.xp += state.lessonXp;
    state.stars[state.lessonId] = Math.max(state.stars[state.lessonId]||0, stars);
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
    speechSynthesis.cancel();
    if(currentAudio) currentAudio.pause();
    currentAudio = new Audio(myVoiceUrl);
    currentAudio.play();
  };

  function finishScore(best, heard){
    const stars = best>=80?3:best>=50?2:1;
    starEl.textContent = "⭐".repeat(stars)+"☆".repeat(3-stars);
    if(best>=80){ fb.innerHTML = `🌟 Excellent! <b>${best} คะแนน</b><br>กด ▶️ ฟังเสียงตัวเองเทียบกับต้นแบบได้เลย`; addXp(10); playSfx("star"); }
    else if(best>=50){ fb.innerHTML = `👍 Good! <b>${best} คะแนน</b> (ได้ยิน: "${heard}")<br>ฟังเทียบแล้วลองอัดใหม่ได้นะ`; addXp(6); playSfx("star"); }
    else { fb.innerHTML = `💪 ลองอีกครั้งนะ (ได้ยิน: "${heard||"—"}")<br>กด 🔊 ต้นแบบ ฟังช้าๆ ก่อน`; playSfx("wrong"); }
    skip.style.display="block";
  }

  async function startRecording(){
    if(busy) return;
    busy = true;
    playSfx("record-start");
    speechSynthesis.cancel();
    chunks = []; myVoiceUrl = null; playSelf.style.display="none";

    if(canRecord){
      try{
        mediaStream = await navigator.mediaDevices.getUserMedia({audio:true});
        recorder = new MediaRecorder(mediaStream);
        recorder.ondataavailable = e=>{ if(e.data.size) chunks.push(e.data); };
        recorder.onstop = ()=>{
          if(chunks.length){
            myVoiceUrl = URL.createObjectURL(new Blob(chunks));
            playSelf.style.display="inline-block";
            fb.innerHTML += "<br>💾 อัดเสียงแล้ว! กด ▶️ ฟังได้เลย";
          }
          if(mediaStream){ mediaStream.getTracks().forEach(t=>t.stop()); mediaStream=null; }
        };
        recorder.start();
      }catch(e){
        fb.textContent = "เปิดไมค์ไม่ได้ ตรวจสอบการอนุญาตไมโครโฟนนะครับ 🙏";
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
      rec.onerror = ()=>{ fb.textContent = "ไม่ได้ยินชัด ลองพูดดังๆ ใกล้ไมค์นะ 🎙️"; skip.style.display="block"; };
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
  }
  mic.onclick = ()=>{ busy ? stopRecording() : startRecording(); };
}

/* ================= INIT: โหลดเนื้อหาบทเรียนก่อนปลดล็อกปุ่มเริ่ม ================= */
(function init(){
  const btn = document.getElementById("btn-start");
  loadContent().then(c=>{
    CONTENT = c;
    btn.disabled = false;
    btn.textContent = "เริ่มผจญภัย! 🚀";
  }).catch(err=>{
    btn.textContent = "โหลดไม่สำเร็จ 😢";
    console.error(err);
    alert("โหลดข้อมูลบทเรียนไม่สำเร็จ: "+err.message+"\n\nถ้าเปิดไฟล์นี้ตรงๆ (file://) เบราว์เซอร์จะบล็อกการโหลด JSON — ต้องรันผ่านเว็บเซิร์ฟเวอร์ในเครื่อง เช่น python3 -m http.server แล้วเปิด http://localhost:8000");
  });
})();
