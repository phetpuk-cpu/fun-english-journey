# 🎨 ชุดสั่งงานภาพ — ชุดที่ 8 (Batch 8: โหมดอนุบาล Phonics/ABC) — **สำหรับ Codex**
**Fun English Journey — แท็บใหม่ 🐣 อนุบาล (grade key `k`) · ~56 ภาพ**

> โหมดใหม่สำหรับเด็กอนุบาล (ยังอ่านหนังสือไม่ออก) — สอน ABC + Phonics + คำ CVC (cat/bat/rat)
> **ไฟล์คู่กับชุดเสียง:** `asset-production-kit-batch8-kindergarten-audio.md` (Antigravity ทำเสียง) — **รายการคำในสองไฟล์นี้ล็อกตรงกันแล้ว ห้ามเปลี่ยนคำ/ชื่อไฟล์เองโดยไม่แจ้ง** เพราะ engine จะอ้างชื่อไฟล์ตามนี้เป๊ะๆ
> สถานะฝั่งแอป: engine ยังไม่สร้าง (Claude ทำถัดไป) — ผลิตภาพล่วงหน้าได้เลย ไม่บล็อกกัน

## 📦 สรุปจำนวน

| ประเภท | จำนวน |
|---|---|
| ภาพคำตัวอย่างประจำตัวอักษร a-z | 26 ภาพ |
| ภาพคำ CVC (หน่วย 5-8) | 30 ภาพ (ซ้ำกับชุดตัวอักษร 3 คำ → ผลิตใหม่จริง ~27) |

**หมายเหตุ:** ไม่ต้องทำภาพตัวอักษร A-Z เอง — แอปเรนเดอร์ตัวอักษรเป็น text ใหญ่ๆ ในหน้าจอโดยตรง ภาพที่ต้องการคือ "ภาพคำ" เท่านั้น

## 📁 โฟลเดอร์ใหม่ + pipeline

- วางไฟล์ที่ **`assets/img/phonics/`** (โฟลเดอร์ใหม่)
- **ต้องแก้ `tools/optimize-images.sh` เพิ่ม category `phonics` โดย max dimension = 512** (เด็กเล็กใช้ภาพใหญ่กว่า vocab ปกติที่ 160px) — เพิ่ม `phonics) echo 512 ;;` ใน `maxdim_for()` และเพิ่ม `phonics` ใน `for category in ...` แล้วรันให้ได้คู่ `.webp` ตามปกติ
- สไตล์ภาพ: ใช้สไตล์กลาง A1 เดิมทุกประการ (flat cartoon, thick outlines, bright pastel, plain white background, **no text no letters no numbers**)
- ขนาดต้นฉบับ 512×512 PNG เหมือน vocab เดิม

## ♻️ ประหยัดแรง: คำที่มีภาพอยู่แล้วใน `assets/img/vocab/`

คำเหล่านี้เคยผลิตแล้วในชั้นอื่น (เช่น cat, dog, egg, fish, hat, lion, pig, sun, van, nose, fan, map, bed, pen, hen) — **ให้ copy ไฟล์เดิมมาตั้งชื่อใหม่ตามกฎด้านล่างได้เลยถ้าภาพสื่อความหมายเดี่ยวชัดเจน** (เช็คด้วยตาก่อนว่าภาพเดิมไม่มีบริบทปนเช่นอยู่ในฉากตลาด) ผลิตใหม่เฉพาะที่ไม่มีหรือไม่เหมาะ

## A. ภาพคำตัวอย่างประจำตัวอักษร (26 ภาพ)

**กฎชื่อไฟล์:** `phonics-{ตัวอักษร}-{คำ}.png` เช่น `phonics-a-apple.png`

| ไฟล์ | คำ | คำอธิบายภาพ (ต่อท้ายด้วยสไตล์กลาง A1) |
|---|---|---|
| phonics-a-apple | apple | one shiny red apple |
| phonics-b-ball | ball | one colorful bouncing ball |
| phonics-c-cat | cat | one cute orange cat sitting |
| phonics-d-dog | dog | one happy brown puppy |
| phonics-e-egg | egg | one white egg, one cracked showing yolk beside it |
| phonics-f-fish | fish | one smiling blue fish |
| phonics-g-goat | goat | one friendly white goat |
| phonics-h-hat | hat | one red sun hat |
| phonics-i-insect | insect | one cute red ladybug insect |
| phonics-j-jam | jam | one jar of strawberry jam (no label text, plain jar) |
| phonics-k-kite | kite | one colorful diamond kite with tail in the sky |
| phonics-l-lion | lion | one friendly lion with fluffy mane |
| phonics-m-monkey | monkey | one playful brown monkey |
| phonics-n-nose | nose | ⚠️ กฎร่างมนุษย์: a friendly Thai child's face in profile with the nose gently highlighted (ห้ามใช้จมูกเป็ด) |
| phonics-o-octopus | octopus | one cute purple octopus |
| phonics-p-pig | pig | one pink pig |
| phonics-q-queen | queen | one kind smiling queen with golden crown |
| phonics-r-rabbit | rabbit | one white rabbit with long ears |
| phonics-s-sun | sun | one bright smiling sun |
| phonics-t-tiger | tiger | one friendly orange tiger cub |
| phonics-u-umbrella | umbrella | one open rainbow umbrella |
| phonics-v-van | van | one blue van |
| phonics-w-worm | worm | one cute pink worm on green grass |
| phonics-x-fox | fox | one orange fox (ใช้ "x as in fo**x**" เสียงท้ายคำ — มาตรฐาน phonics) |
| phonics-y-yoyo | yo-yo | one red yo-yo with string |
| phonics-z-zebra | zebra | one striped zebra |

## B. ภาพคำ CVC หน่วย 5-8 (30 ภาพ)

**กฎชื่อไฟล์:** `phonics-cvc-{คำ}.png` เช่น `phonics-cvc-cat.png`
(cat, hat, pig ใช้ copy จากชุด A มาเปลี่ยนชื่อได้เลย)

| หน่วย | ตระกูล | คำ + คำอธิบายภาพ |
|---|---|---|
| 5 | -at | **cat** (copy จาก A) · **bat** ค้างคาวน่ารักกางปีก (สัตว์ ไม่ใช่ไม้เบสบอล) · **rat** หนูสีเทาน่ารัก · **hat** (copy จาก A) · **mat** เสื่อ/พรมเช็ดเท้าสี่เหลี่ยมมีลาย · **sat** Ducky นั่งบนเก้าอี้เล็ก |
| 6 | -an/-ap | **man** ⚠️ กฎร่างมนุษย์: ชายไทยใจดียิ้มแย้ม · **fan** พัดลมตั้งพื้น · **pan** กระทะมีด้าม · **van** (copy จาก A) · **cap** หมวกแก๊ปสีน้ำเงิน · **map** แผนที่กางออก (เส้นหยึกๆ เท่านั้น ห้ามตัวหนังสือ) · **nap** Ducky หลับกลางวันบนเบาะ มี z ลอย (ใช้สัญลักษณ์ Zzz ได้ เป็นข้อยกเว้นเดียว) · **tap** ก๊อกน้ำมีหยดน้ำ |
| 7 | -ig/-og/-ug | **pig** (copy จาก A) · **wig** วิกผมสีม่วงตลกๆ บนหัวหุ่น · **dig** Ducky ขุดดินด้วยพลั่วเล็ก · **dog** สุนัขน้อย (copy ได้ถ้ามี) · **log** ท่อนไม้ · **bug** แมลงเต่าทองเขียว (ให้ต่างจาก insect ชุด A ชัดๆ เช่นสีเขียว) · **hug** Ducky กอดกับ Mali อบอุ่น · **rug** พรมกลมมีลายสดใส |
| 8 | -et/-en/-ed | **net** สวิงจับผีเสื้อ · **jet** เครื่องบินเจ็ตน่ารัก · **vet** ⚠️ สัตวแพทย์ (คนไทยใส่เสื้อกาวน์) กำลังตรวจลูกหมา · **wet** Ducky ตัวเปียกมีหยดน้ำ ยืนในแอ่งน้ำ · **hen** แม่ไก่สีน้ำตาล · **pen** ปากกาสีน้ำเงิน · **bed** เตียงเด็กมีผ้าห่มลายดาว · **red** วงกลม/หัวใจสีแดงสดใหญ่ๆ (สอนสี) |

## C. ลำดับแนะนำ + QA

- แบ่ง 4 ก้อน: A ครึ่งแรก (a-m, 13) → A ครึ่งหลัง (n-z, 13) → B หน่วย 5-6 (14) → B หน่วย 7-8 (16) หยุดตรวจทีละก้อน
- เช็คลิสต์ QA ต่อภาพ: (1) ไม่มีตัวหนังสือ/ตัวเลข (ยกเว้น Zzz ใน nap) (2) 1 ภาพ = 1 ความหมายเดี่ยว ไม่มีของอื่นปน (สำคัญมาก เด็กอนุบาลใช้ภาพเดาคำ) (3) กฎร่างมนุษย์ที่ nose/man/vet (4) ชื่อไฟล์ตรงตาราง (5) แก้ optimize-images.sh แล้วรัน ได้ .webp ครบคู่
- อัปเดตความคืบหน้าใน walkthrough ของตัวเองตามปกติ — **นับเฉพาะไฟล์จริง ไม่นับ `._*`**
