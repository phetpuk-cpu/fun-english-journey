"use strict";
/* ตรวจความสอดคล้องของไฟล์เนื้อหากับที่ engine อ้างถึง
   ครอบ validate-lessons.js เดิมไว้ด้วย เพื่อให้รันคำสั่งเดียวได้ครบ */

const { test, describe } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { execFileSync } = require("node:child_process");
const fx = require("./helpers/fixtures.js");
const { loadEngine } = require("./helpers/load-engine.js");

const engine = loadEngine();

describe("validate-lessons.js — ตรวจ schema ของไฟล์เนื้อหา", () => {
  test("ผ่านทุกไฟล์ (ห่อสคริปต์เดิมไว้ ไม่เขียนตรรกะซ้ำ)", () => {
    const result = execFileSync("node", [path.join(fx.ROOT, "tools", "validate-lessons.js")], {
      cwd: fx.ROOT,
      encoding: "utf8",
    });
    assert.match(result, /พบข้อผิดพลาด 0 จุด/, `validate-lessons รายงานว่ามีข้อผิดพลาด:\n${result}`);
  });
});

describe("UNIT_FILES ใน engine.js — ต้องชี้ไฟล์ที่มีอยู่จริง", () => {
  test("ทุกไฟล์ที่ประกาศไว้มีอยู่จริงบนดิสก์", () => {
    const missing = [];
    for (const [grade, files] of Object.entries(engine.UNIT_FILES)) {
      for (const rel of files) {
        const full = path.join(fx.ROOT, "fun-english-journey", rel);
        if (!fs.existsSync(full)) missing.push(`${grade}: ${rel}`);
      }
    }
    assert.deepEqual(missing, [], `engine อ้างไฟล์ที่ไม่มี:\n  ${missing.join("\n  ")}`);
  });

  test("ไฟล์เนื้อหาทุกไฟล์ถูกประกาศใน UNIT_FILES (กันสร้างไฟล์แล้วลืมต่อสาย)", () => {
    /* regression: เคยสร้าง ku2-ku8 ไว้แล้วลืมเพิ่มใน UNIT_FILES ทำให้เด็กเห็นแค่ 2 หน่วย */
    const declared = new Set(
      Object.values(engine.UNIT_FILES)
        .flat()
        .map((rel) => path.basename(rel, ".json"))
    );
    const orphans = fx.allUnitFiles().filter((f) => !declared.has(f));
    assert.deepEqual(orphans, [], `ไฟล์ที่มีอยู่แต่ไม่ถูกโหลด: ${orphans.join(", ")}`);
  });

  test("ลำดับหน่วยใน UNIT_FILES เรียงถูกต้อง (u2 ต้องมาก่อน u10)", () => {
    for (const [grade, files] of Object.entries(engine.UNIT_FILES)) {
      const nums = files.map((rel) => Number(/u(\d+)\.json$/.exec(rel)[1]));
      const sorted = [...nums].sort((a, b) => a - b);
      assert.deepEqual(nums, sorted, `ชั้น ${grade} เรียงหน่วยผิด: ${nums.join(",")}`);
    }
  });
});

describe("รหัสบทเรียน", () => {
  test("ไม่ซ้ำกันทั้งโปรเจกต์", () => {
    const seen = new Map();
    const dupes = [];
    for (const { file, lesson } of fx.allLessons()) {
      if (seen.has(lesson.id)) dupes.push(`${lesson.id} อยู่ทั้งใน ${seen.get(lesson.id)} และ ${file}`);
      else seen.set(lesson.id, file);
    }
    assert.deepEqual(dupes, [], dupes.join("\n"));
  });

  test("รหัสบทต้องตรงกับไฟล์ที่บทนั้นอยู่ (p3u5l2 ต้องอยู่ใน p3u5.json)", () => {
    const mismatches = [];
    for (const { file, lesson } of fx.allLessons()) {
      const expectedPrefix = `${file}l`;
      if (!lesson.id.startsWith(expectedPrefix)) mismatches.push(`${lesson.id} อยู่ในไฟล์ ${file}.json`);
    }
    assert.deepEqual(mismatches, [], `รหัสบทไม่ตรงไฟล์:\n  ${mismatches.join("\n  ")}`);
  });

  test("field grade ในไฟล์ตรงกับชื่อไฟล์", () => {
    const mismatches = [];
    for (const file of fx.allUnitFiles()) {
      const data = fx.readUnit(file);
      const gradeFromName = /^([a-z]+\d?)u\d+$/.exec(file)[1];
      if (data.grade !== gradeFromName) mismatches.push(`${file}.json: grade="${data.grade}" แต่ชื่อไฟล์บอก "${gradeFromName}"`);
    }
    assert.deepEqual(mismatches, [], mismatches.join("\n"));
  });
});

describe("แท็บชั้นเรียนใน index.html", () => {
  const html = fs.readFileSync(path.join(fx.ROOT, "fun-english-journey", "index.html"), "utf8");

  test("ทุกชั้นที่มีเนื้อหามีแท็บให้กดเลือก", () => {
    const missing = Object.keys(engine.UNIT_FILES).filter((g) => !html.includes(`data-g="${g}"`));
    assert.deepEqual(missing, [], `ชั้นที่มีเนื้อหาแต่ไม่มีแท็บ: ${missing.join(", ")}`);
  });

  test("ไม่มีแท็บของชั้นที่ยังไม่มีเนื้อหา (กดแล้วจะเจอหน้าว่าง)", () => {
    const tabs = [...html.matchAll(/data-g="([^"]+)"/g)].map((m) => m[1]);
    const unknown = [...new Set(tabs)].filter((g) => !engine.UNIT_FILES[g]);
    assert.deepEqual(unknown, [], `แท็บที่ไม่มีเนื้อหารองรับ: ${unknown.join(", ")}`);
  });
});
