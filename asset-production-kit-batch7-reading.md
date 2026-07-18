# 🎨 ชุดสั่งงานผลิตภาพ — ชุดที่ 7 (Batch 7: ภาพประกอบนิทาน หน่วย 9-10)
**Fun English Journey — "มุมนิทาน" (Story Corner) ป.1-6 · 12 ภาพ**

> ชุดสั่งงานต่อจากชุด 1-6 — หน่วย 9-10 เป็นหน่วยใหม่ (17 ก.ค. 2026) เป็นบทเรียนแบบ **อ่านจับใจความล้วน** (ไม่มีคำศัพท์/พูด/ควิซ) ชั้นละ 2 บท บทละ 1 นิทานสั้น
> **งานชุดนี้มีแค่ภาพฉากเท่านั้น** — ไม่มีภาพคำศัพท์ ไม่มีเสียง (ข้อความในนิทานใช้ TTS ของเบราว์เซอร์อยู่แล้ว)
> **สไตล์ภาพและกฎการตั้งชื่อไฟล์เหมือน scene เดิมทุกประการ** (ดู A1/A2 ใน `asset-production-kit.md`) — ตัวละครใช้ character sheet ชุดเดิม
> ภาพจะแสดง 2 ที่: หน้า intro ของบท และ **บนหัวเรื่องตอนเด็กอ่านนิทาน** (engine รองรับแล้ว ส่งไฟล์มา push แล้วขึ้นเว็บอัตโนมัติ)

## 📦 สรุปจำนวนงานทั้งชุดที่ 7

| ประเภท | จำนวน |
|---|---|
| ภาพฉากนิทาน | 12 ภาพ (1024×768) |

**กฎชื่อไฟล์:** `{lessonId}-scene.png` วางที่ `assets/img/vocab/../scenes/` เหมือนเดิม แล้วรัน `tools/optimize-images.sh` ให้ได้คู่ `.webp` เช่นเคย

## ⚠️ กฎพิเศษของชุดนี้ (สำคัญกว่าชุดก่อน)

1. **ห้ามมีตัวหนังสือ/ตัวเลขที่อ่านออกได้ในภาพเด็ดขาด** — ชุดนี้มีฉาก "โปสการ์ด" และ "จดหมาย" ซึ่ง AI ชอบเติมตัวหนังสือเอง ให้ทำเป็นเส้นหยึกๆ (squiggly lines) แทนตัวอักษรเสมอ
2. **1 ภาพต้องเล่าทั้งเรื่องได้** — เลือกช็อตที่เป็นหัวใจของนิทาน (ระบุไว้ให้แล้วในตาราง) ไม่ใช่แค่ฉากเปิด
3. ภาพต้องสอดคล้องกับเนื้อเรื่องเป๊ะๆ เพราะเด็กจะใช้ภาพช่วยเดาความหมายขณะอ่าน — ห้ามใส่รายละเอียดที่ขัดกับเนื้อเรื่อง (เช่น เรื่องบอกฝนตก ภาพห้ามแดดออก)
4. ตัวละครยึด character sheet เดิม: Ducky (เป็ดเหลือง), Mali (ช้างเทา-ชมพู), Teacher Owl (นกฮูก), Grumpy Cat (แมวหน้าบึ้ง)

## A. ตารางภาพฉากนิทาน (12 ภาพ · 1024×768)

สไตล์กลางต่อท้ายทุก prompt เหมือนเดิม:
```
, flat cartoon illustration for children, thick clean outlines, bright pastel colors,
rounded friendly shapes, simple composition, no text, no letters, no numbers
```

| ไฟล์ | เนื้อเรื่องย่อ (ไทย เพื่อ QA) | ฉากที่ต้องวาด (ใส่ต่อด้วยสไตล์กลาง) |
|---|---|---|
| p1u9l1-scene | ฝนตก Ducky กับ Mali อยู่บ้าน มองนอกหน้าต่าง ดอกไม้ชอบฝน | Ducky the yellow duckling and Mali the little elephant looking out a cozy home window together at gentle falling rain, colorful happy flowers blooming outside in the rain |
| p1u10l1-scene | Ducky หาของเล่นเป็ดไม่เจอ แม่เจอในห้องครัว ดีใจ | Mother duck in the kitchen holding up a small toy duck, Ducky the duckling jumping with joy beside her, warm cozy kitchen background |
| p2u9l1-scene | ครอบครัว Ducky ไปสวนสัตว์ เห็นช้างใหญ่ Mali โบกมือ ลิงตลก | Ducky's duck family at a cheerful zoo, Mali the little elephant waving at a big friendly elephant behind a low fence, funny monkeys playing on a tree nearby |
| p2u10l1-scene | Grumpy Cat เศร้าเพราะหมวกหาย Ducky ช่วยหา เจอแล้วดีใจ | Ducky the duckling handing a found red hat back to Grumpy Cat whose face is turning from sad to happy, small sparkles of joy around them |
| p3u9l1-scene | Ducky ทำแผนที่หาย Mali ถามทางตำรวจ เลี้ยวซ้ายไปห้องสมุด | Ducky and Mali asking a friendly police officer duck for directions on a town street corner, the officer pointing left toward a library building visible down the street, a dropped paper map on the ground near Ducky |
| p3u10l1-scene | วันกีฬาสีเมื่อวาน Ducky วิ่งชนะ Mali ชักเย่อเก่ง ทีมได้ที่หนึ่ง | Sports day at a colorful fair, Ducky crossing a finish line ribbon ahead of Grumpy Cat, Mali pulling strongly in a tug of war in the background, a shiny first place trophy nearby |
| p4u9l1-scene | ทีมเก็บขวดพลาสติกที่สวน ใส่ถังรีไซเคิล เป็นฮีโร่รักษ์โลก | Ducky, Mali and friends collecting plastic bottles in a sunny park and putting them into a green recycling bin, Teacher Owl watching proudly, small green hearts floating above them |
| p4u10l1-scene | Ducky เที่ยวต่างประเทศ นั่งเครื่องบิน เขียนโปสการ์ดถึง Mali | Ducky sitting at a scenic viewpoint of a beautiful national park writing a postcard (squiggly lines only, no letters), a small airplane flying in the sky behind, travel bag beside him |
| p5u9l1-scene | ฤดูกาลที่แล้วไม่ได้แชมป์ Teacher Owl ให้กำลังใจ ฝึกทุกวันจนมั่นใจ | Teacher Owl gently encouraging a determined Ducky at a sports academy training field at sunrise, Ducky in training gear doing practice drills, a small bench with sports equipment nearby |
| p5u10l1-scene | สัปดาห์หน้าแข่งชิงแชมป์ ทีมวางแผน Mali เช็คอุปกรณ์ Grumpy Cat จะมาเชียร์ | Ducky's team gathered around a strategy board with simple shapes and arrows (no letters), Mali checking sports gear in a bag, Grumpy Cat holding small cheering flags, excited team mood |
| p6u9l1-scene | ทีมสร้างหุ่นยนต์ Green Bot จากขวดและกระป๋องเก่า คัดแยกขยะ คนทั้งเมืองรัก | A cute friendly robot built from recycled bottles and cans sorting trash into colorful bins, Ducky and friends standing proudly beside it, townspeople animals smiling in the background |
| p6u10l1-scene | Ducky เขียนจดหมายถึงตัวเองในอนาคต อยากเป็นนักวิทยาศาสตร์ ไม่เคยยอมแพ้ | Ducky at a desk writing a letter (squiggly lines only, no letters) by warm lamp light, a dreamy thought bubble above showing future Ducky in a scientist lab coat holding a beaker, stars twinkling outside the window |

## B. ลำดับแนะนำ + QA

- แนะนำทำเป็น 3 ก้อน: ป.1-2 (4 ภาพ) → ป.3-4 (4 ภาพ) → ป.5-6 (4 ภาพ) หยุดตรวจทีละก้อน
- เช็คลิสต์ QA ต่อภาพ: (1) ไม่มีตัวหนังสือ/ตัวเลขอ่านออก (2) ตัวละครตรง character sheet (3) รายละเอียดตรงเนื้อเรื่องย่อภาษาไทยในตาราง (4) ชื่อไฟล์ตรง lessonId (5) รัน optimize-images.sh แล้วมี .webp ครบคู่
- เนื้อเรื่องเต็มของแต่ละนิทานดูได้ที่ `fun-english-journey/data/p{ชั้น}u9.json` และ `u10.json` (field `reading.passage`)
