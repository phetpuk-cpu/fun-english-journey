"use strict";
/* ทดสอบการคิดคะแนน XP เต็มและเกณฑ์ดาว
   สูตร max XP ต่างกันตามชนิดบท — เคยพังมาแล้วตอนเพิ่มชนิดบทใหม่ (อ่าน .speak.length ของบทที่ไม่มี speak) */

const { test, describe } = require("node:test");
const assert = require("node:assert/strict");
const { loadEngine } = require("./helpers/load-engine.js");
const fx = require("./helpers/fixtures.js");

const engine = loadEngine();
const CONTENT = fx.buildContent();
engine.setContent(CONTENT);

function allLessonsInContent() {
  const out = [];
  for (const g of Object.values(CONTENT)) for (const u of g.units) for (const l of u.lessons) out.push(l);
  return out;
}

/* เกณฑ์ดาวที่ใช้จริงในขั้น result ของ engine */
function starsFor(gained, max) {
  const ratio = gained / max;
  return ratio >= 0.8 ? 3 : ratio >= 0.5 ? 2 : 1;
}

describe("สูตรคิด XP เต็ม (max) ของแต่ละชนิดบท", () => {
  test("ทุกบทในระบบคำนวณ max ได้โดยไม่ throw (regression: บทไม่มี speak/quiz เคยทำพัง)", () => {
    for (const lesson of allLessonsInContent()) {
      assert.doesNotThrow(() => engine.maxXpFor(lesson.id), `บท ${lesson.id} คำนวณ max ไม่ได้`);
    }
  });

  test("ทุกบทต้องได้ max เป็นจำนวนบวก (ถ้าเป็น 0 จะหารแล้วได้ Infinity)", () => {
    for (const lesson of allLessonsInContent()) {
      const max = engine.maxXpFor(lesson.id);
      assert.ok(Number.isFinite(max) && max > 0, `บท ${lesson.id} ได้ max = ${max}`);
    }
  });

  test("บทนิทาน: max = จำนวนคำถาม × 3", () => {
    const lesson = allLessonsInContent().find((l) => l.lessonType === "reading");
    assert.ok(lesson, "ต้องมีบทนิทานใน data");
    assert.equal(engine.maxXpFor(lesson.id), lesson.reading.questions.length * 3);
  });

  test("บทอนุบาล: max รวมจากทุกขั้น (ขั้นสอน 1 + กิจกรรม 3)", () => {
    const lesson = allLessonsInContent().find((l) => l.lessonType === "phonics" && l.letters && !l.review);
    assert.ok(lesson, "ต้องมีบทอนุบาลแบบสอนตัวอักษร");
    const steps = engine.buildSteps(lesson.id);
    const expected = steps.reduce(
      (sum, t) => sum + (t === "phonics-letter" ? 1 : t.startsWith("phonics-") ? 3 : 0),
      0
    );
    assert.equal(engine.maxXpFor(lesson.id), expected);
  });

  test("บทปกติ: max เพิ่มขึ้นตามกิจกรรมเสริมที่มีในบท", () => {
    const plain = allLessonsInContent().find(
      (l) => !l.lessonType && l.vocab && !l.questionBuild && !l.writeSentence && !l.transform && !l.reading
    );
    const withExtra = allLessonsInContent().find((l) => !l.lessonType && l.vocab && l.transform);
    assert.ok(plain && withExtra, "ต้องมีทั้งบทเปล่าและบทที่มีกิจกรรมเสริม");
    assert.ok(
      engine.maxXpFor(withExtra.id) > 0 && engine.maxXpFor(plain.id) > 0,
      "ทั้งสองแบบต้องคำนวณได้"
    );
  });
});

describe("เกณฑ์ดาว", () => {
  test("ได้ XP เต็ม → 3 ดาวเสมอ ทุกชนิดบท (กันสูตรเพี้ยนจนเก็บ 3 ดาวไม่ได้)", () => {
    for (const lesson of allLessonsInContent()) {
      const max = engine.maxXpFor(lesson.id);
      assert.equal(starsFor(max, max), 3, `บท ${lesson.id} ได้เต็มแล้วยังไม่ได้ 3 ดาว`);
    }
  });

  test("ขอบเขตพอดี 80% ต้องได้ 3 ดาว", () => {
    assert.equal(starsFor(80, 100), 3);
  });

  test("ขอบเขตพอดี 50% ต้องได้ 2 ดาว", () => {
    assert.equal(starsFor(50, 100), 2);
  });

  test("ต่ำกว่า 50% ได้ 1 ดาว (ไม่มี 0 ดาว — เด็กต้องได้กำลังใจเสมอ)", () => {
    assert.equal(starsFor(0, 100), 1);
    assert.equal(starsFor(49, 100), 1);
  });

  test("ดาวอยู่ในช่วง 1-3 เสมอ", () => {
    for (const gained of [0, 1, 33, 50, 79, 80, 99, 100]) {
      const s = starsFor(gained, 100);
      assert.ok(s >= 1 && s <= 3, `ได้ ${gained}/100 → ${s} ดาว`);
    }
  });
});
