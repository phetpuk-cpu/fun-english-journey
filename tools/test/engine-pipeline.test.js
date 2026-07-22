"use strict";
/* ทดสอบว่า startLesson() ประกอบลำดับขั้นบทเรียนถูกต้องตามชนิดของบท
   ใช้ข้อมูลจริงจาก data/*.json เพราะบั๊กที่เคยหลุดเกิดจากบทที่มีโครงสร้างต่างจากที่ engine คาด */

const { test, describe } = require("node:test");
const assert = require("node:assert/strict");
const { loadEngine } = require("./helpers/load-engine.js");
const fx = require("./helpers/fixtures.js");

const engine = loadEngine();
const CONTENT = fx.buildContent();
engine.setContent(CONTENT);

/* หา id ของบทแรกที่ตรงเงื่อนไข ภายใน CONTENT ที่ inject ไว้ */
function findId(predicate) {
  for (const g of Object.values(CONTENT))
    for (const u of g.units)
      for (const l of u.lessons) if (predicate(l)) return l.id;
  return null;
}

describe("บทเรียนปกติ (มีคำศัพท์/ฝึกพูด/ควิซ)", () => {
  const id = findId((l) => !l.lessonType && l.vocab && l.speak && l.quiz);

  test("มีบทปกติให้ทดสอบ", () => assert.ok(id, "ไม่พบบทปกติใน data"));

  test("ลำดับขั้นครบตามโครงหลักสูตร", () => {
    const steps = engine.buildSteps(id);
    assert.equal(steps[0], "intro", "ต้องเริ่มด้วย intro");
    assert.equal(steps.at(-1), "result", "ต้องจบด้วย result");
    for (const type of ["vocab", "listen", "match", "build", "speak", "quiz"]) {
      assert.ok(steps.includes(type), `ต้องมีขั้น ${type}`);
    }
  });

  test("จำนวนขั้นตรงกับจำนวนข้อมูลจริงในบท", () => {
    const lesson = engine.getLesson(id);
    const steps = engine.buildSteps(id);
    const count = (t) => steps.filter((s) => s === t).length;
    assert.equal(count("listen"), 3, "ขั้นฟังเลือกมี 3 ข้อเสมอ");
    assert.equal(count("speak"), lesson.speak.length, "ขั้นพูดต้องเท่าจำนวนประโยคในบท");
    assert.equal(count("quiz"), lesson.quiz.length, "ขั้นควิซต้องเท่าจำนวนข้อในบท");
  });

  test("ต้องไม่มีขั้นของโหมดอนุบาลปนมา", () => {
    const steps = engine.buildSteps(id);
    assert.ok(!steps.some((s) => s.startsWith("phonics-")), "บทปกติต้องไม่มีขั้น phonics");
  });
});

describe("บทนิทาน (lessonType: reading)", () => {
  const id = findId((l) => l.lessonType === "reading");

  test("มีบทนิทานให้ทดสอบ", () => assert.ok(id, "ไม่พบบท reading ใน data"));

  test("ลำดับขั้นต้องเป็น intro → reading → result เท่านั้น", () => {
    assert.deepEqual(engine.buildSteps(id), ["intro", "reading", "result"]);
  });

  test("ไม่แตะ vocab/speak/quiz ที่บทนี้ไม่มี (regression: เคย throw ตอนเพิ่มชนิดบทใหม่)", () => {
    const lesson = engine.getLesson(id);
    assert.equal(lesson.vocab, undefined, "บทนิทานไม่ควรมี vocab");
    assert.doesNotThrow(() => engine.buildSteps(id));
  });
});

describe("บทอนุบาล — สอนตัวอักษร (lessonType: phonics + letters)", () => {
  const id = findId((l) => l.lessonType === "phonics" && l.letters && !l.review);

  test("มีบทสอนตัวอักษรให้ทดสอบ", () => assert.ok(id, "ไม่พบบท phonics แบบ letters"));

  test("จำนวนขั้นสอนตัวอักษรตรงกับจำนวนตัวอักษรในบท", () => {
    const lesson = engine.getLesson(id);
    const steps = engine.buildSteps(id);
    const letterSteps = steps.filter((s) => s === "phonics-letter").length;
    assert.equal(letterSteps, lesson.letters.length);
  });

  test("มีขั้นฝึกฟังและจับคู่ต่อจากขั้นสอน", () => {
    const steps = engine.buildSteps(id);
    assert.ok(steps.includes("phonics-listen"), "ต้องมีขั้นฟังเสียงแล้วแตะตัวอักษร");
    assert.ok(steps.includes("phonics-match"), "ต้องมีขั้นจับคู่เสียงกับภาพ");
    assert.ok(
      steps.indexOf("phonics-letter") < steps.indexOf("phonics-listen"),
      "ต้องสอนก่อนแล้วค่อยทดสอบ"
    );
  });
});

describe("บทอนุบาล — ทบทวน (review: true)", () => {
  const id = findId((l) => l.lessonType === "phonics" && l.review);

  test("มีบททบทวนให้ทดสอบ", () => assert.ok(id, "ไม่พบบท phonics แบบ review"));

  test("ข้ามขั้นสอน ไปเล่นเกมทบทวนเลย", () => {
    const steps = engine.buildSteps(id);
    assert.ok(!steps.includes("phonics-letter"), "บททบทวนต้องไม่มีขั้นสอนตัวอักษรซ้ำ");
    assert.ok(steps.length > 2, "ต้องมีกิจกรรมทบทวนจริง ไม่ใช่แค่ intro→result");
  });
});

describe("บทอนุบาล — สะกดคำ CVC", () => {
  const id = findId((l) => l.lessonType === "phonics" && l.cvc && !l.review);

  test("มีบทสะกดคำให้ทดสอบ", () => assert.ok(id, "ไม่พบบท phonics แบบ cvc"));

  test("จำนวนขั้นสะกดคำตรงกับจำนวนคำในบท", () => {
    const lesson = engine.getLesson(id);
    const steps = engine.buildSteps(id);
    assert.equal(steps.filter((s) => s === "phonics-blend").length, lesson.cvc.length);
  });

  test("มีขั้นฟังคำแล้วแตะภาพด้วย", () => {
    assert.ok(engine.buildSteps(id).includes("phonics-listen-word"));
  });
});

describe("ขั้นเสริมที่ใส่เฉพาะบางบท (optional fields)", () => {
  const optionalCases = [
    ["questionBuild", "question-build"],
    ["writeSentence", "write"],
    ["transform", "transform"],
  ];

  for (const [field, stepType] of optionalCases) {
    test(`บทที่มี ${field} ต้องมีขั้น ${stepType}`, () => {
      const id = findId((l) => l[field] && !l.lessonType);
      if (!id) return; // ยังไม่มีบทที่ใช้ field นี้ ก็ข้ามไป
      assert.ok(engine.buildSteps(id).includes(stepType));
    });

    test(`บทที่ไม่มี ${field} ต้องไม่มีขั้น ${stepType}`, () => {
      const id = findId((l) => !l[field] && !l.lessonType && l.vocab);
      assert.ok(id);
      assert.ok(!engine.buildSteps(id).includes(stepType));
    });
  }

  test("บทปกติที่มี reading ต้องมีขั้นอ่านเพิ่ม (ไม่ใช่บทนิทานล้วน)", () => {
    const id = findId((l) => l.reading && !l.lessonType);
    if (!id) return;
    const steps = engine.buildSteps(id);
    assert.ok(steps.includes("reading"));
    assert.ok(steps.includes("vocab"), "ยังต้องมีขั้นคำศัพท์ตามปกติด้วย");
  });
});

describe("nextLessonId() — การไปบทถัดไป", () => {
  test("บทสุดท้ายของแต่ละชั้นต้องคืน null (ไม่ข้ามไปชั้นอื่น)", () => {
    for (const [grade, g] of Object.entries(CONTENT)) {
      const lastLesson = g.units.at(-1).lessons.at(-1);
      assert.equal(
        engine.nextLessonId(lastLesson.id),
        null,
        `${grade}: บทสุดท้าย ${lastLesson.id} ควรคืน null แต่ได้ ${engine.nextLessonId(lastLesson.id)}`
      );
    }
  });

  test("บทถัดไปต้องอยู่ชั้นเดียวกันเสมอ", () => {
    for (const g of Object.values(CONTENT)) {
      for (const u of g.units) {
        for (const l of u.lessons) {
          const next = engine.nextLessonId(l.id);
          if (!next) continue;
          const gradeOf = (id) => /^([a-z]+\d?)u/.exec(id)[1];
          assert.equal(gradeOf(next), gradeOf(l.id), `${l.id} → ${next} ข้ามชั้น`);
        }
      }
    }
  });

  test("ข้ามหน่วยภายในชั้นเดียวกันได้ (บทสุดท้ายของหน่วย → บทแรกของหน่วยถัดไป)", () => {
    const g = CONTENT.p1;
    const lastOfUnit1 = g.units[0].lessons.at(-1).id;
    const firstOfUnit2 = g.units[1].lessons[0].id;
    assert.equal(engine.nextLessonId(lastOfUnit1), firstOfUnit2);
  });

  test("id ที่ไม่มีอยู่จริงคืน null ไม่ throw", () => {
    assert.equal(engine.nextLessonId("ไม่มีบทนี้"), null);
    assert.equal(engine.nextLessonId(""), null);
  });
});

describe("แบบทดสอบจำลอง Cambridge — ต้องทนบทที่ไม่มีควิซ", () => {
  /* เรียก startMockExam() ตัวจริง ไม่ใช่เขียน logic เลียนแบบ
     regression: โค้ดเดิมใช้ l.quiz.forEach ตรงๆ จึง throw เมื่อเจอบทนิทาน/บทอนุบาลที่ไม่มี quiz */

  test("ชั้นที่มีบทนิทานปนอยู่ (ไม่มี quiz) ต้องสุ่มข้อสอบได้โดยไม่พัง", async () => {
    const count = await engine.runMockExam("p1");
    assert.ok(count > 0, "ชั้น ป.1 ต้องสุ่มข้อสอบได้");
    assert.ok(count <= 20, "สุ่มไม่เกิน 20 ข้อตามที่ออกแบบไว้");
  });

  test("ชั้นอนุบาลไม่มีควิซเลย ต้องไม่พัง (แค่ได้ 0 ข้อ)", async () => {
    const count = await engine.runMockExam("k");
    assert.equal(count, 0, "อนุบาลไม่มีควิซ จึงไม่ควรมีข้อสอบ");
  });

  test("ทุกชั้นเรียกได้โดยไม่ throw", async () => {
    for (const grade of Object.keys(CONTENT)) {
      await assert.doesNotReject(() => engine.runMockExam(grade), `ชั้น ${grade} ทำให้ startMockExam พัง`);
    }
  });
});
