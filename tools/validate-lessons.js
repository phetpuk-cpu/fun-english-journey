#!/usr/bin/env node
/* ตรวจ data/*.json ทั้ง 48 ไฟล์ (ป.1-6 x 8 หน่วย) ให้ตรง schema ที่ engine.js คาดหวัง
   รัน: node tools/validate-lessons.js */
"use strict";
const fs = require("fs");
const path = require("path");

const DATA_DIR = path.join(__dirname, "..", "fun-english-journey", "data");
const GRADES = ["p1", "p2", "p3", "p4", "p5", "p6"];
const UNITS_PER_GRADE = 8;

let errors = 0;
let lessonCount = 0;
const seenLessonIds = new Set();

function fail(file, msg) {
  errors++;
  console.error(`✗ ${file}: ${msg}`);
}

function checkString(file, label, v) {
  if (typeof v !== "string" || !v.trim()) fail(file, `${label} ต้องเป็นข้อความไม่ว่าง (ได้ ${JSON.stringify(v)})`);
}

function checkBilingual(file, label, v) {
  if (!v || typeof v !== "object") { fail(file, `${label} ต้องเป็น object {en/en, th}`); return; }
  const enKey = "en" in v ? "en" : ("t" in v ? "t" : null);
  if (!enKey) fail(file, `${label} ขาด key ภาษาอังกฤษ (en หรือ t)`);
  else checkString(file, `${label}.${enKey}`, v[enKey]);
  checkString(file, `${label}.th`, v.th);
}

function checkLesson(file, l, idx) {
  const where = `lessons[${idx}]`;
  checkString(file, `${where}.id`, l.id);
  if (l.id) {
    if (seenLessonIds.has(l.id)) fail(file, `${where}.id "${l.id}" ซ้ำกับบทอื่นในทั้งโปรเจกต์`);
    seenLessonIds.add(l.id);
  }
  checkString(file, `${where}.icon`, l.icon);
  checkString(file, `${where}.title`, l.title);
  checkString(file, `${where}.sub`, l.sub);
  checkBilingual(file, `${where}.intro`, l.intro);

  if (!Array.isArray(l.vocab) || l.vocab.length !== 8) fail(file, `${where}.vocab ต้องมี 8 คำ (ได้ ${l.vocab?.length ?? "ไม่มี"})`);
  else l.vocab.forEach((v, i) => {
    checkString(file, `${where}.vocab[${i}].w`, v.w);
    checkString(file, `${where}.vocab[${i}].th`, v.th);
    checkString(file, `${where}.vocab[${i}].e`, v.e);
  });

  if (!l.build || typeof l.build !== "object") fail(file, `${where}.build ขาดหาย`);
  else { checkString(file, `${where}.build.sentence`, l.build.sentence); checkString(file, `${where}.build.th`, l.build.th); }

  if (!Array.isArray(l.speak) || l.speak.length !== 4) fail(file, `${where}.speak ต้องมี 4 ประโยค (ได้ ${l.speak?.length ?? "ไม่มี"})`);
  else l.speak.forEach((s, i) => { checkString(file, `${where}.speak[${i}].t`, s.t); checkString(file, `${where}.speak[${i}].th`, s.th); });

  if (!Array.isArray(l.quiz) || l.quiz.length !== 8) fail(file, `${where}.quiz ต้องมี 8 ข้อ (ได้ ${l.quiz?.length ?? "ไม่มี"})`);
  else l.quiz.forEach((q, i) => {
    checkString(file, `${where}.quiz[${i}].q`, q.q);
    if (!Array.isArray(q.c) || q.c.length < 2) fail(file, `${where}.quiz[${i}].c ต้องมีตัวเลือกอย่างน้อย 2 ข้อ`);
    if (typeof q.a !== "number" || !q.c || q.a < 0 || q.a >= q.c.length) fail(file, `${where}.quiz[${i}].a ต้องเป็น index ที่ถูกต้องใน c`);
  });

  if (l.transform !== undefined) {
    if (!Array.isArray(l.transform)) fail(file, `${where}.transform ถ้ามีต้องเป็น array`);
    else l.transform.forEach((t, i) => {
      checkString(file, `${where}.transform[${i}].task`, t.task);
      checkString(file, `${where}.transform[${i}].base`, t.base);
      checkString(file, `${where}.transform[${i}].baseTh`, t.baseTh);
      if (!Array.isArray(t.c) || t.c.length < 2) fail(file, `${where}.transform[${i}].c ต้องมีตัวเลือกอย่างน้อย 2 ข้อ`);
      if (typeof t.a !== "number" || !t.c || t.a < 0 || t.a >= t.c.length) fail(file, `${where}.transform[${i}].a ต้องเป็น index ที่ถูกต้องใน c`);
    });
  }

  if (l.questionBuild !== undefined) {
    checkString(file, `${where}.questionBuild.sentence`, l.questionBuild.sentence);
    checkString(file, `${where}.questionBuild.th`, l.questionBuild.th);
    if (l.questionBuild.sentence && /[.?!]$/.test(l.questionBuild.sentence.trim()))
      fail(file, `${where}.questionBuild.sentence ไม่ควรมีเครื่องหมาย .?! ต่อท้าย (engine เติม ? ให้เองตอนพูด/แสดงผล)`);
  }
}

for (const grade of GRADES) {
  for (let u = 1; u <= UNITS_PER_GRADE; u++) {
    const file = `${grade}u${u}.json`;
    const full = path.join(DATA_DIR, file);
    if (!fs.existsSync(full)) { fail(file, "ไฟล์หายไป (คาดว่าต้องมี)"); continue; }
    let data;
    try { data = JSON.parse(fs.readFileSync(full, "utf8")); }
    catch (e) { fail(file, `JSON parse ไม่ผ่าน: ${e.message}`); continue; }

    checkString(file, "grade", data.grade);
    checkString(file, "gradeName", data.gradeName);
    checkString(file, "unitName", data.unitName);
    if (data.grade && data.grade !== grade) fail(file, `grade field เป็น "${data.grade}" แต่ชื่อไฟล์บอกว่าเป็น "${grade}"`);

    if (!Array.isArray(data.lessons) || !data.lessons.length) fail(file, "lessons ต้องเป็น array ไม่ว่าง");
    else data.lessons.forEach((l, i) => { checkLesson(file, l, i); lessonCount++; });
  }
}

console.log(`\nตรวจแล้ว ${GRADES.length * UNITS_PER_GRADE} ไฟล์, ${lessonCount} บทเรียน, พบข้อผิดพลาด ${errors} จุด`);
process.exit(errors ? 1 : 0);
