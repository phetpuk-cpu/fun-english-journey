"use strict";
/* ตัวช่วยโหลดข้อมูลจริงจาก data/*.json มาใช้เป็น fixture ในเทสต์
   ใช้ข้อมูลจริงแทน mock เพราะบั๊กที่เคยหลุดขึ้น production ส่วนใหญ่
   เกิดจากข้อมูลจริงที่มีรูปแบบไม่ตรงกับที่ engine คาด (เช่น บทไม่มี vocab/quiz) */

const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..", "..", "..");
const DATA_DIR = path.join(ROOT, "fun-english-journey", "data");
const ASSETS_DIR = path.join(ROOT, "assets");

const GRADES = ["p1", "p2", "p3", "p4", "p5", "p6"];
const UNITS_PER_GRADE = 10;
const K_UNITS = 8;

function readUnit(file) {
  return JSON.parse(fs.readFileSync(path.join(DATA_DIR, `${file}.json`), "utf8"));
}

/* รายชื่อไฟล์หน่วยทั้งหมดที่มีจริง (ชั้นอนุบาลใช้ ku1..ku8, ชั้นอื่น p{n}u1..u10) */
function allUnitFiles() {
  const files = [];
  for (let u = 1; u <= K_UNITS; u++) files.push(`ku${u}`);
  for (const g of GRADES) for (let u = 1; u <= UNITS_PER_GRADE; u++) files.push(`${g}u${u}`);
  return files.filter((f) => fs.existsSync(path.join(DATA_DIR, `${f}.json`)));
}

/* ไฟล์หน่วยของชั้นที่ระบุ เรียงตามเลขหน่วย (u2 ต้องมาก่อน u10 — เรียงแบบตัวเลขไม่ใช่ตัวอักษร) */
function unitFilesOfGrade(grade) {
  const re = new RegExp(`^${grade}u(\\d+)$`);
  return allUnitFiles()
    .map((f) => ({ f, m: re.exec(f) }))
    .filter((x) => x.m)
    .sort((a, b) => Number(a.m[1]) - Number(b.m[1]))
    .map((x) => x.f);
}

/* สร้าง CONTENT ในรูปแบบเดียวกับที่ loadGrade() ประกอบให้ engine ใช้ */
function buildContent(grades = ["k", ...GRADES]) {
  const content = {};
  for (const g of grades) {
    const files = unitFilesOfGrade(g);
    if (!files.length) continue;
    const datas = files.map(readUnit);
    content[g] = { name: datas[0].gradeName, units: datas.map((d) => ({ name: d.unitName, lessons: d.lessons })) };
  }
  return content;
}

/* บทเรียนทั้งหมดพร้อมไฟล์ต้นทาง — ใช้ตรวจ asset และ id ซ้ำ */
function allLessons() {
  const out = [];
  for (const file of allUnitFiles()) {
    const data = readUnit(file);
    for (const lesson of data.lessons) out.push({ file, grade: data.grade, lesson });
  }
  return out;
}

/* หาบทแรกที่ตรงเงื่อนไข — ใช้เลือกตัวอย่างบทแต่ละประเภทมาทดสอบ */
function findLesson(predicate) {
  const hit = allLessons().find(({ lesson }) => predicate(lesson));
  return hit ? hit.lesson : null;
}

/* เลียนแบบ slug() ของ engine ไว้ตรวจชื่อไฟล์ asset
   (เทสต์ engine-pure จะยืนยันอีกทีว่าตัวจริงให้ผลตรงกับตัวนี้) */
function slugOf(word) {
  return String(word).toLowerCase().replace(/'/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function assetExists(...parts) {
  return fs.existsSync(path.join(ASSETS_DIR, ...parts));
}

/* profile ตัวอย่างสำหรับเทสต์แดชบอร์ดผู้ปกครอง */
function makeProfile(overrides = {}) {
  return Object.assign(
    {
      id: 1,
      name: "ทดสอบ",
      avatar: "🦁",
      grade: "p1",
      xp: 120,
      stars: { p1u1l1: 3, p1u1l2: 2, p1u1l3: 1 },
      speakingStats: [],
    },
    overrides
  );
}

module.exports = {
  ROOT,
  DATA_DIR,
  ASSETS_DIR,
  GRADES,
  readUnit,
  allUnitFiles,
  unitFilesOfGrade,
  buildContent,
  allLessons,
  findLesson,
  slugOf,
  assetExists,
  makeProfile,
};
