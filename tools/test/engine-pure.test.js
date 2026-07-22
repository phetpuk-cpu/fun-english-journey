"use strict";
/* ทดสอบฟังก์ชันบริสุทธิ์ใน engine.js — ไม่พึ่ง DOM/เครือข่าย */

const { test, describe } = require("node:test");
const assert = require("node:assert/strict");
const { loadEngine } = require("./helpers/load-engine.js");

const engine = loadEngine();

describe("slug() — แปลงคำเป็นชื่อไฟล์", () => {
  /* เคสเหล่านี้มาจากบั๊กจริงที่เคยทำให้ภาพไม่ขึ้นแบบเงียบๆ:
     Codex ตั้งชื่อไฟล์เป็น don-t-like/o-clock/yoyo แต่ engine หา dont-like/oclock/yo-yo */
  const cases = [
    ["don't like", "dont-like", "อะพอสทรอฟีต้องถูกตัดทิ้ง ไม่ใช่แปลงเป็นขีด"],
    ["o'clock", "oclock", "อะพอสทรอฟีกลางคำ"],
    ["world's largest", "worlds-largest", "อะพอสทรอฟี + ช่องว่าง"],
    ["yo-yo", "yo-yo", "ขีดเดิมต้องคงไว้"],
    ["take out the trash", "take-out-the-trash", "ช่องว่างหลายจุด"],
    ["Thailand", "thailand", "ตัวพิมพ์ใหญ่ต้องเป็นเล็ก"],
    ["ice cream", "ice-cream", "คำสองพยางค์"],
    ["How much is it?", "how-much-is-it", "เครื่องหมายคำถามท้ายต้องหาย ไม่เหลือขีด"],
    ["  extra  spaces  ", "extra-spaces", "ช่องว่างหัวท้ายต้องไม่เหลือขีด"],
  ];
  for (const [input, expected, why] of cases) {
    test(`"${input}" → "${expected}" (${why})`, () => {
      assert.equal(engine.slug(input), expected);
    });
  }

  test("ผลลัพธ์ต้องไม่ขึ้นหรือลงท้ายด้วยขีด และไม่มีขีดซ้อน", () => {
    for (const [input] of cases) {
      const out = engine.slug(input);
      assert.doesNotMatch(out, /^-|-$/, `"${input}" ให้ผล "${out}" ที่มีขีดหัวหรือท้าย`);
      assert.doesNotMatch(out, /--/, `"${input}" ให้ผล "${out}" ที่มีขีดซ้อน`);
    }
  });
});

describe("similarity() — ให้คะแนนความใกล้เคียง (ใช้ทั้งฝึกพูดและเขียน)", () => {
  test("ตรงเป๊ะ = 100", () => {
    assert.equal(engine.similarity("I like red", "I like red"), 100);
  });

  test("ตัวพิมพ์เล็กใหญ่และเครื่องหมายวรรคตอนไม่มีผล", () => {
    assert.equal(engine.similarity("I like red.", "i LIKE red!"), 100);
  });

  test("ไม่ตรงเลย = 0", () => {
    assert.equal(engine.similarity("apple banana", "car train"), 0);
  });

  test("ตรงครึ่งเดียว = 50", () => {
    assert.equal(engine.similarity("apple banana", "apple train"), 50);
  });

  test("ข้อความว่างต้องคืน 0 ไม่ใช่ NaN (กันหารด้วยศูนย์)", () => {
    assert.equal(engine.similarity("", "anything"), 0);
    assert.equal(engine.similarity("   ", "anything"), 0);
  });

  test("คืนค่าเป็นจำนวนเต็ม 0-100 เสมอ", () => {
    const score = engine.similarity("one two three", "one two");
    assert.ok(Number.isInteger(score), "ต้องเป็นจำนวนเต็ม");
    assert.ok(score >= 0 && score <= 100, "ต้องอยู่ในช่วง 0-100");
  });
});

describe("flagBadge() — ธงสำหรับคำสัญชาติ/ประเทศ", () => {
  test("คำสัญชาติที่รู้จักคืน badge พร้อม emoji ธง", () => {
    const out = engine.flagBadge("Thai");
    assert.match(out, /flag-badge/);
    assert.match(out, /🇹🇭/);
  });

  test("ชื่อประเทศก็ได้ธงเดียวกับสัญชาติ", () => {
    assert.match(engine.flagBadge("Thailand"), /🇹🇭/);
    assert.match(engine.flagBadge("Japan"), /🇯🇵/);
  });

  test("คำทั่วไปคืนค่าว่าง (ไม่แปะธงมั่ว)", () => {
    assert.equal(engine.flagBadge("apple"), "");
    assert.equal(engine.flagBadge("run"), "");
  });
});

describe("micErrorMessage() — ข้อความแจ้งปัญหาไมโครโฟน", () => {
  test("แต่ละสาเหตุให้ข้อความต่างกัน และเป็นภาษาไทย", () => {
    const names = ["NotAllowedError", "NotFoundError", "NotReadableError"];
    const messages = names.map((name) => engine.micErrorMessage({ name }));
    for (const [i, msg] of messages.entries()) {
      assert.ok(typeof msg === "string" && msg.length > 0, `${names[i]} ต้องมีข้อความ`);
      assert.match(msg, /[ก-๙]/, `${names[i]} ควรเป็นภาษาไทยให้ผู้ปกครองอ่านเข้าใจ`);
    }
    assert.equal(new Set(messages).size, messages.length, "แต่ละสาเหตุควรได้ข้อความต่างกัน");
  });

  test("สาเหตุที่ไม่รู้จักก็ยังคืนข้อความ ไม่ throw", () => {
    assert.ok(engine.micErrorMessage({ name: "SomethingWeird" }).length > 0);
    assert.ok(engine.micErrorMessage({}).length > 0);
  });
});
