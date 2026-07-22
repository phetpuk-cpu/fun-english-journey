"use strict";
/* โหลด js/engine.js และ js/parents-dashboard.js เข้ามาทดสอบใน Node
   โดย "ไม่แตะไฟล์ production แม้แต่บรรทัดเดียว"

   ทำไมต้องทำแบบนี้: ไฟล์ทั้งสองเป็น browser script ล้วน (ไม่มี module.exports)
   และมี top-level code ที่เรียก document/localStorage/indexedDB ตั้งแต่โหลดไฟล์
   เราจึง stub browser API เท่าที่ engine ต้องใช้ตอน import แล้ว eval ทั้งไฟล์
   ผ่าน new Function() พร้อม return ตัวที่อยากทดสอบออกมา

   สำคัญ: ห้ามแก้ engine.js ให้ export เอง เพราะ Codex/Antigravity แก้ไฟล์เดียวกันอยู่
   การแตะไฟล์ production เพื่อ test จะเพิ่มความเสี่ยง merge/overwrite โดยไม่จำเป็น */

const fs = require("fs");
const path = require("path");

const APP_DIR = path.join(__dirname, "..", "..", "..", "fun-english-journey");

const noop = () => {};

/* element ปลอมที่รับได้ทุก property ที่ engine เรียกใช้ (classList/style/dataset/textContent/on*)
   ใช้ Proxy เพื่อไม่ต้องไล่ stub ทีละ property เวลา engine เพิ่มโค้ดใหม่ */
function makeFakeElement() {
  return new Proxy(
    {},
    {
      get(_t, key) {
        if (key === "classList") return { add: noop, remove: noop, toggle: noop, contains: () => false };
        if (key === "style") return {};
        if (key === "dataset") return {};
        /* ต้องคืน array จริง เพราะ engine เรียก .forEach ต่อทันที */
        if (key === "querySelectorAll") return () => [];
        if (key === "querySelector" || key === "closest") return () => null;
        if (key === "textContent" || key === "innerHTML" || key === "value") return "";
        if (key === "disabled" || key === "checked" || key === "hidden") return false;
        if (typeof key === "string" && key.startsWith("on")) return null;
        if (key === Symbol.toPrimitive) return () => "";
        return noop;
      },
      set: () => true,
    }
  );
}

function makeBrowserStubs(overrides = {}) {
  const fakeEl = makeFakeElement();
  const stubs = {
    window: { addEventListener: noop, removeEventListener: noop, scrollTo: noop, location: { href: "" } },
    document: {
      addEventListener: noop,
      removeEventListener: noop,
      querySelectorAll: () => [],
      querySelector: () => null,
      getElementById: () => fakeEl,
      createElement: () => fakeEl,
      body: fakeEl,
      hidden: false,
    },
    localStorage: { getItem: () => null, setItem: noop, removeItem: noop },
    indexedDB: { open: () => ({ addEventListener: noop, onsuccess: null, onerror: null, onupgradeneeded: null }) },
    navigator: { mediaDevices: {}, userAgent: "node-test" },
    Audio: function () {
      return { addEventListener: noop, play: () => Promise.resolve(), load: noop, pause: noop, removeAttribute: noop };
    },
    Image: function () {
      return { addEventListener: noop };
    },
    speechSynthesis: undefined, // engine เช็ค `"speechSynthesis" in window` — ให้เป็น undefined เพื่อข้าม TTS
    SpeechSynthesisUtterance: function () {},
    fetch: () => Promise.reject(new Error("fetch ถูกปิดในเทสต์ — ให้ inject CONTENT ตรงๆ แทน")),
    alert: noop,
    console,
    setTimeout,
    clearTimeout,
    setInterval,
    clearInterval,
    requestAnimationFrame: noop,
    cancelAnimationFrame: noop,
  };
  return Object.assign(stubs, overrides);
}

/* eval ไฟล์ script แล้ว return object ตาม returnExpr ที่ระบุ */
function evalBrowserScript(filePath, returnExpr, overrides) {
  const src = fs.readFileSync(filePath, "utf8");
  const stubs = makeBrowserStubs(overrides);
  const names = Object.keys(stubs);
  const factory = new Function(...names, `${src}\n;return (${returnExpr});`);
  return factory(...names.map((n) => stubs[n]));
}

/* โหลด engine.js — คืนฟังก์ชันหลักที่ต้องทดสอบ พร้อม helper สำหรับ inject/อ่าน state
   หมายเหตุ: ต้องประกาศทุกตัวใน returnExpr ตรงนี้ที่เดียว เพื่อให้ closure เห็นตัวแปร
   ภายในไฟล์ (CONTENT/state/steps) ที่เข้าถึงจากข้างนอกไม่ได้ */
function loadEngine(overrides) {
  return evalBrowserScript(
    path.join(APP_DIR, "js", "engine.js"),
    `{
      slug, similarity, flagBadge, micErrorMessage, stepLabel,
      getLesson, nextLessonId, audioVolume,
      UNIT_FILES,
      setContent: (c) => { CONTENT = c; },
      getContent: () => CONTENT,
      state,
      /* คืนลำดับ step ที่ engine สร้างจริงจาก startLesson() */
      buildSteps: (id) => { startLesson(id); return steps.map(s => s.type); },
      getSteps: () => steps,
      /* สูตรคิด max XP ของขั้น result — คัดลอกตรรกะเดียวกับใน render() มาให้ทดสอบได้
         (โค้ดจริงฝังอยู่ในบล็อก render ที่ต้องมี DOM จึงเรียกตรงไม่ได้) */
      maxXpFor: (id) => {
        startLesson(id);
        const L2 = getLesson(id);
        return L2.lessonType === "reading"
          ? (L2.reading.questions.length*3)
          : L2.lessonType === "phonics"
          ? steps.reduce((s,x)=> s + (x.type==="phonics-letter" ? 1 : (x.type||"").startsWith("phonics-") ? 3 : 0), 0)
          : 10 + 6 + 8 + 5 + (L2.questionBuild?5:0) + (L2.writeSentence?5:0) + ((L2.reading?.questions.length||0)*3) + (L2.speak.length*10) + (L2.quiz.length*3) + ((L2.transform||[]).length*4);
      },
      /* เรียก startMockExam() ตัวจริงจาก engine (ไม่เขียน logic ซ้ำ มิฉะนั้นเทสต์จะทดสอบโค้ดตัวเอง
         แทนที่จะทดสอบ production) แล้วคืนจำนวนข้อที่สุ่มได้ผ่าน examState */
      runMockExam: async (grade) => {
        state.grade = grade;
        await startMockExam();
        return examState ? examState.questions.length : 0;
      }
    }`,
    overrides
  );
}

/* โหลด parents-dashboard.js — ไฟล์นี้พึ่ง DOM น้อยกว่ามาก */
function loadDashboard(overrides) {
  return evalBrowserScript(
    path.join(APP_DIR, "js", "parents-dashboard.js"),
    `{
      lessonsPerGrade, parseLessonId, weakLessons, recentActivity,
      countProfileStars, profileLessonCount, profileSpeakingAverage,
      LESSONS_BY_GRADE, GRADE_LABELS
    }`,
    overrides
  );
}

module.exports = { loadEngine, loadDashboard, APP_DIR };
