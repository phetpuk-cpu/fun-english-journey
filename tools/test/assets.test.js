"use strict";
/* ตรวจว่าไฟล์ภาพ/เสียงจริงบนดิสก์ตรงกับที่เนื้อหาบทเรียนอ้างถึง

   นี่คือชุดเทสต์ที่จับบั๊กที่หลุดขึ้น production บ่อยที่สุดในโปรเจกต์นี้
   เพราะเป็นบั๊กแบบ "เงียบ" — engine มี fallback เป็น emoji/TTS ให้อัตโนมัติ
   เวลาไฟล์ผิดชื่อหรือหาย จึงไม่มี error ให้เห็น เด็กแค่ไม่เห็นภาพเฉยๆ */

const { test, describe } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");
const { execFileSync } = require("node:child_process");
const fx = require("./helpers/fixtures.js");
const { loadEngine } = require("./helpers/load-engine.js");

const engine = loadEngine();

/* ภาพที่ยังผลิตไม่เสร็จ — อนุญาตให้ขาดชั่วคราวได้
   เมื่อ Codex ส่งไฟล์มาแล้ว "ให้ลบรายการออกจากลิสต์นี้" เพื่อให้เทสต์คุมต่อ
   ตอนนี้ว่าง = ภาพครบทุกคำแล้ว */
const PENDING_IMAGES = new Set([]);

const vocabDir = path.join(fx.ASSETS_DIR, "img", "vocab");
const phonicsDir = path.join(fx.ASSETS_DIR, "img", "phonics");
const scenesDir = path.join(fx.ASSETS_DIR, "img", "scenes");
const audioDir = path.join(fx.ASSETS_DIR, "audio");

/* ไฟล์จริงบนดิสก์ (ตัด ._* ของ macOS ที่ไม่ใช่ไฟล์จริงออก) */
function realFiles(dir, ext) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).filter((f) => !f.startsWith("._") && f.endsWith(ext));
}

const vocabWebp = new Set(realFiles(vocabDir, ".webp").map((f) => f.replace(/\.webp$/, "")));
const vocabPng = new Set(realFiles(vocabDir, ".png").map((f) => f.replace(/\.png$/, "")));

describe("ภาพคำศัพท์ — ต้องมีครบทุกคำในบทเรียน", () => {
  test("ทุกคำมีไฟล์ .webp (ตัวที่เว็บใช้จริง)", () => {
    const missing = [];
    for (const { lesson } of fx.allLessons()) {
      for (const v of lesson.vocab || []) {
        const name = `${lesson.id}-vocab-${engine.slug(v.w)}`;
        if (!vocabWebp.has(name) && !PENDING_IMAGES.has(name)) missing.push(`${name} (คำว่า "${v.w}")`);
      }
    }
    assert.deepEqual(missing, [], `ภาพหาย ${missing.length} ไฟล์:\n  ${missing.join("\n  ")}`);
  });

  test("ทุกไฟล์ .webp มี .png คู่กัน (ต้นฉบับสำหรับผลิตซ้ำ)", () => {
    const orphans = [...vocabWebp].filter((n) => !vocabPng.has(n));
    assert.deepEqual(orphans, [], `มี .webp ที่ไม่มี .png คู่: ${orphans.join(", ")}`);
  });

  test("ไม่มีภาพที่ไม่ตรงคำใดในบทเรียน (dead file)", () => {
    /* regression: เคยมี p6u5l3-vocab-observe (ใส่ชื่อบทผิด) และ p2u2l3-vocab-early/late (ผิดหน่วย)
       ค้างอยู่ในโฟลเดอร์ กินพื้นที่และทำให้นับยอดผิด */
    const wanted = new Set();
    for (const { lesson } of fx.allLessons())
      for (const v of lesson.vocab || []) wanted.add(`${lesson.id}-vocab-${engine.slug(v.w)}`);

    const dead = [...vocabWebp].filter((n) => !wanted.has(n));
    assert.deepEqual(dead, [], `มีภาพที่ไม่ถูกใช้ ${dead.length} ไฟล์:\n  ${dead.join("\n  ")}`);
  });
});

describe("ภาพนิทาน (บทหน่วย 9-10)", () => {
  const sceneWebp = new Set(realFiles(scenesDir, ".webp").map((f) => f.replace(/\.webp$/, "")));

  test("ทุกบทนิทานมีภาพประกอบ", () => {
    const missing = [];
    for (const { lesson } of fx.allLessons()) {
      if (lesson.lessonType !== "reading") continue;
      if (!sceneWebp.has(`${lesson.id}-scene`)) missing.push(lesson.id);
    }
    assert.deepEqual(missing, [], `บทนิทานที่ยังไม่มีภาพ: ${missing.join(", ")}`);
  });
});

describe("โหมดอนุบาล — ภาพและเสียงต้องครบทุกตัวอักษร/คำ", () => {
  const phonicsWebp = new Set(realFiles(phonicsDir, ".webp").map((f) => f.replace(/\.webp$/, "")));
  const audioFiles = new Set(realFiles(audioDir, ".mp3").map((f) => f.replace(/\.mp3$/, "")));

  const kLessons = fx.allLessons().filter(({ lesson }) => lesson.lessonType === "phonics");

  test("มีบทอนุบาลใน data", () => assert.ok(kLessons.length > 0));

  test("ทุกตัวอักษรมีเสียงครบ 3 แบบ (ชื่อ/เสียง/คำ)", () => {
    const missing = [];
    for (const { lesson } of kLessons) {
      for (const it of lesson.letters || []) {
        for (const kind of ["name", "sound", "word"]) {
          const f = `phonics-${it.letter}-${kind}`;
          if (!audioFiles.has(f)) missing.push(f);
        }
      }
    }
    assert.deepEqual([...new Set(missing)], [], `เสียงหาย: ${missing.join(", ")}`);
  });

  test("ทุกตัวอักษรมีภาพคำตัวอย่าง", () => {
    const missing = [];
    for (const { lesson } of kLessons) {
      for (const it of lesson.letters || []) {
        const f = `phonics-${it.letter}-${engine.slug(it.word)}`;
        if (!phonicsWebp.has(f)) missing.push(`${f} (คำว่า "${it.word}")`);
      }
    }
    assert.deepEqual([...new Set(missing)], [], `ภาพหาย: ${missing.join(", ")}`);
  });

  test("ทุกคำ CVC มีทั้งเสียงและภาพ", () => {
    const missing = [];
    for (const { lesson } of kLessons) {
      for (const it of lesson.cvc || []) {
        if (!audioFiles.has(`phonics-cvc-${it.word}`)) missing.push(`เสียง phonics-cvc-${it.word}`);
        if (!phonicsWebp.has(`phonics-cvc-${it.word}`)) missing.push(`ภาพ phonics-cvc-${it.word}`);
      }
    }
    assert.deepEqual([...new Set(missing)], [], missing.join(", "));
  });

  test("ชื่อตัวอักษร เสียง phoneme และคำ ต้องเป็นคนละไฟล์กัน", () => {
    /* บั๊กจริง: Antigravity เคยส่งไฟล์ชื่อตัวอักษรที่เป็นไฟล์เดียวกับเสียง phoneme 16/26 ตัว
       ทำให้กดปุ่ม "ชื่อ B" แล้วได้ยิน "บึ" แทน "บี" — ตรวจด้วยการ hash ไฟล์

       หมายเหตุ: ไฟล์ซ้ำข้ามหมวดถือว่าปกติ เช่น phonics-c-word (cat) กับ phonics-cvc-cat
       เป็นคำเดียวกันจริง จึงเทียบเฉพาะ 3 ไฟล์ของตัวอักษรเดียวกัน */
    const hashOf = (f) =>
      crypto.createHash("md5").update(fs.readFileSync(path.join(audioDir, `${f}.mp3`))).digest("hex");
    const letters = new Set();
    for (const { lesson } of kLessons) for (const it of lesson.letters || []) letters.add(it.letter);

    const problems = [];
    for (const letter of letters) {
      const kinds = ["name", "sound", "word"].filter((k) => audioFiles.has(`phonics-${letter}-${k}`));
      const seen = new Map();
      for (const kind of kinds) {
        const h = hashOf(`phonics-${letter}-${kind}`);
        if (seen.has(h)) problems.push(`ตัว ${letter}: -${seen.get(h)} กับ -${kind} เป็นไฟล์เดียวกัน`);
        else seen.set(h, kind);
      }
    }
    assert.deepEqual(problems, [], `เสียงซ้ำผิดหมวด:\n  ${problems.join("\n  ")}`);
  });
});

describe("ไฟล์ขยะของ macOS", () => {
  test("ไม่มีไฟล์ ._* ถูก track ใน git", () => {
    /* ไฟล์ ._* เกิดใหม่ตลอดเวลาบน macOS และอยู่ใน .gitignore อยู่แล้ว
       จึงไม่ตรวจว่ามีบนดิสก์ไหม (จะแดงตลอดบน Mac แต่เขียวบน CI = เทสต์ที่เชื่อไม่ได้)
       สิ่งที่เป็นปัญหาจริงคือถ้ามันหลุดเข้า git ไปแล้ว — ตรวจตรงนั้นแทน */
    const tracked = execFileSync("git", ["ls-files"], { cwd: fx.ROOT, encoding: "utf8" })
      .split("\n")
      .filter((f) => path.basename(f).startsWith("._"));
    assert.deepEqual(tracked, [], `ไฟล์ขยะที่หลุดเข้า git: ${tracked.join(", ")}`);
  });
});
