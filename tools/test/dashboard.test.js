"use strict";
/* ทดสอบตรรกะคำนวณของแดชบอร์ดผู้ปกครอง (js/parents-dashboard.js) */

const { test, describe } = require("node:test");
const assert = require("node:assert/strict");
const { loadDashboard } = require("./helpers/load-engine.js");
const fx = require("./helpers/fixtures.js");

const dash = loadDashboard();

describe("lessonsPerGrade() — จำนวนบทต่อชั้น (ใช้คิด % ความคืบหน้า)", () => {
  test("อนุบาลมี 28 บท (regression: เคยใส่ผิดเป็น 25)", () => {
    assert.equal(dash.lessonsPerGrade("k"), 28);
  });

  test("ป.1-6 มีชั้นละ 34 บท", () => {
    for (const g of fx.GRADES) assert.equal(dash.lessonsPerGrade(g), 34);
  });

  test("ตัวเลขต้องตรงกับจำนวนบทจริงในไฟล์ data (กันแก้เนื้อหาแล้วลืมแก้ตัวเลข)", () => {
    const counts = {};
    for (const { grade, lesson } of fx.allLessons()) {
      const key = grade || /^([a-z]+\d?)u/.exec(lesson.id)[1];
      counts[key] = (counts[key] || 0) + 1;
    }
    for (const [grade, actual] of Object.entries(counts)) {
      assert.equal(
        dash.lessonsPerGrade(grade),
        actual,
        `ชั้น ${grade}: โค้ดบอก ${dash.lessonsPerGrade(grade)} บท แต่ใน data มี ${actual} บท`
      );
    }
  });

  test("ชั้นที่ไม่รู้จักคืนค่าเริ่มต้น 34 ไม่ใช่ undefined", () => {
    assert.equal(dash.lessonsPerGrade("ไม่มีชั้นนี้"), 34);
  });
});

describe("parseLessonId() — แยกชั้น/หน่วยจากรหัสบท", () => {
  test("รหัสบทปกติ", () => {
    assert.deepEqual(dash.parseLessonId("p3u5l2"), { grade: "p3", unitFile: "p3u5" });
  });

  test("รองรับชั้นอนุบาล (ขึ้นต้นด้วย k ไม่ใช่ p+เลข)", () => {
    assert.deepEqual(dash.parseLessonId("ku1l1"), { grade: "k", unitFile: "ku1" });
  });

  test("รองรับหน่วยเลขสองหลัก (u10 ต้องไม่ถูกตัดเป็น u1)", () => {
    assert.deepEqual(dash.parseLessonId("p6u10l1"), { grade: "p6", unitFile: "p6u10" });
  });

  test("รหัสผิดรูปแบบคืน null ไม่ throw", () => {
    for (const bad of ["", "abc", "p9u1l1", null, undefined, "p1u1"]) {
      assert.equal(dash.parseLessonId(bad), null, `"${bad}" ควรคืน null`);
    }
  });

  test("แยกรหัสของทุกบทจริงในระบบได้ครบ", () => {
    for (const { lesson } of fx.allLessons()) {
      assert.ok(dash.parseLessonId(lesson.id), `แยกรหัส ${lesson.id} ไม่ได้`);
    }
  });
});

describe("weakLessons() — บทที่ควรฝึกเพิ่ม", () => {
  test("เลือกเฉพาะบทที่ได้ 1-2 ดาว (ยังไม่เคยเรียน = 0 ดาว ไม่นับ)", () => {
    const profile = fx.makeProfile({ stars: { a: 3, b: 2, c: 1, d: 0 } });
    const ids = dash.weakLessons(profile, 10).map((w) => w.id);
    assert.deepEqual(ids.sort(), ["b", "c"]);
  });

  test("เรียงจากดาวน้อยไปมาก (บทที่แย่สุดขึ้นก่อน)", () => {
    const profile = fx.makeProfile({ stars: { a: 2, b: 1, c: 2 } });
    assert.equal(dash.weakLessons(profile, 10)[0].stars, 1);
  });

  test("จำกัดจำนวนตาม limit", () => {
    const profile = fx.makeProfile({ stars: { a: 1, b: 1, c: 2, d: 2 } });
    assert.equal(dash.weakLessons(profile, 2).length, 2);
  });

  test("โปรไฟล์ที่ยังไม่มีข้อมูลคืน [] ไม่ throw", () => {
    assert.deepEqual(dash.weakLessons({}, 5), []);
    assert.deepEqual(dash.weakLessons(fx.makeProfile({ stars: {} }), 5), []);
  });

  test("ได้ 3 ดาวหมดทุกบท = ไม่มีจุดอ่อน", () => {
    assert.deepEqual(dash.weakLessons(fx.makeProfile({ stars: { a: 3, b: 3 } }), 5), []);
  });
});

describe("recentActivity() — สรุปกิจกรรม 7 วันล่าสุด", () => {
  const daysAgo = (n) => Date.now() - n * 24 * 60 * 60 * 1000;

  test("นับเฉพาะที่อยู่ในช่วงเวลาที่กำหนด", () => {
    const profile = fx.makeProfile({
      speakingStats: [
        { at: daysAgo(1), score: 80 },
        { at: daysAgo(3), score: 60 },
        { at: daysAgo(30), score: 100 }, // เก่าเกิน ต้องไม่ถูกนับ
      ],
    });
    const result = dash.recentActivity(profile, 7);
    assert.equal(result.count, 2);
    assert.equal(result.avg, 70, "เฉลี่ยจาก 80 กับ 60 เท่านั้น");
  });

  test("ไม่มีกิจกรรมในช่วงนั้นคืน null", () => {
    const profile = fx.makeProfile({ speakingStats: [{ at: daysAgo(30), score: 90 }] });
    assert.equal(dash.recentActivity(profile, 7), null);
  });

  test("โปรไฟล์ที่ไม่เคยฝึกพูดคืน null ไม่ throw", () => {
    assert.equal(dash.recentActivity({}, 7), null);
    assert.equal(dash.recentActivity(fx.makeProfile({ speakingStats: [] }), 7), null);
  });

  test("ค่าเฉลี่ยเป็นจำนวนเต็ม", () => {
    const profile = fx.makeProfile({
      speakingStats: [
        { at: daysAgo(1), score: 70 },
        { at: daysAgo(1), score: 75 },
      ],
    });
    assert.ok(Number.isInteger(dash.recentActivity(profile, 7).avg));
  });
});

describe("ตัวเลขสรุปโปรไฟล์", () => {
  test("countProfileStars รวมดาวทุกบท", () => {
    assert.equal(dash.countProfileStars(fx.makeProfile({ stars: { a: 3, b: 2, c: 1 } })), 6);
  });

  test("profileLessonCount นับจำนวนบทที่เคยเล่น", () => {
    assert.equal(dash.profileLessonCount(fx.makeProfile({ stars: { a: 3, b: 1 } })), 2);
  });

  test("profileSpeakingAverage คืน null เมื่อยังไม่เคยฝึกพูด", () => {
    assert.equal(dash.profileSpeakingAverage(fx.makeProfile({ speakingStats: [] })), null);
  });

  test("profileSpeakingAverage เฉลี่ยถูกต้อง", () => {
    const profile = fx.makeProfile({ speakingStats: [{ score: 60 }, { score: 80 }] });
    assert.equal(dash.profileSpeakingAverage(profile), 70);
  });

  test("ทนต่อโปรไฟล์ว่าง/field หาย ไม่ throw", () => {
    for (const fn of ["countProfileStars", "profileLessonCount", "profileSpeakingAverage"]) {
      assert.doesNotThrow(() => dash[fn]({}), `${fn} พังกับโปรไฟล์ว่าง`);
    }
  });
});

describe("GRADE_LABELS — ป้ายชื่อชั้น", () => {
  test("มีป้ายครบทุกชั้นที่มีเนื้อหาจริง", () => {
    for (const grade of ["k", ...fx.GRADES]) {
      assert.ok(dash.GRADE_LABELS[grade], `ขาดป้ายชื่อชั้น ${grade}`);
    }
  });
});
