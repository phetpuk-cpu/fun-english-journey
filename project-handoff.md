# 📋 สรุปงานโปรเจกต์ Fun English Journey — สำหรับทำต่อบนคอมพิวเตอร์
อัปเดต: 11 ก.ค. 2026 (เวอร์ชัน 8 — **หลักสูตร ป.1-6 ครบสมบูรณ์ 192 บทเรียน + เสียงครบ 100% ทุกชั้น + DEPLOY ขึ้นเว็บจริงแล้ว!** 🎉 https://phetpuk-cpu.github.io/fun-english-journey/ — เหลือแค่งานภาพที่ Codex/Antigravity ทยอยผลิต ซึ่งเว็บอัปเดตเองอัตโนมัติเมื่อ push)

## ⚠️ สำคัญ: เลขชั้นเปลี่ยนไปแล้ว
สิ่งที่เคยเรียกว่า **แอป ป.3 → ตอนนี้คือ ป.2** (🏙️ Big City), **แอป ป.4 → ตอนนี้คือ ป.3** (🎪 Four Seasons Fair), **แอป ป.5 → ตอนนี้คือ ป.4** (🌍 World Explorer Club) — เนื้อหาเดิมทุกตัวอักษร ไฟล์เสียง/ภาพ/JSON/engine.js/index.html เปลี่ยนชื่อ prefix ตามแล้ว (p3u→p2u, p4u→p3u, p5u→p4u) ตรวจสอบผ่านเบราว์เซอร์แล้วว่าใช้งานได้ปกติ

## 1. สถานะปัจจุบัน (ทำเสร็จแล้ว ✅)

| ชิ้นงาน | ไฟล์ | สถานะ |
|---|---|---|
| โปรเจกต์จริง (แยกจากไฟล์เดี่ยวแล้ว) | `fun-english-journey/` (index.html, css/, js/engine.js, data/*.json) | ✅ เสร็จ — git repo แล้ว |
| เนื้อหา ป.1-2-3-4-5-6 ครบทุกหน่วย (192 บทเรียน รวม — **ครบหลักสูตรทั้งหมดแล้ว**) | `fun-english-journey/data/{p1,p2,p3,p4,p5,p6}u{1-8}.json` | ✅ เสร็จ — เล่นได้จริงทุกบท |
| ชุดสั่งงาน AI ภาพ/เสียง (6 ชุด, ครบทุกชั้นแล้ว) | `asset-production-kit.md`, `-batch2.md` ถึง `-batch6.md` | ✅ เขียนเสร็จหมด — **หมายเหตุ: ชุด 1-3 ยังอ้างชื่อไฟล์แบบเก่า (p3u/p4u/p5u) มีป้ายเตือนต่อท้ายชื่อไฟล์แล้วว่าให้แปลงเป็น p2u/p3u/p4u — ชุด 4-6 (ป.1, ป.5, ป.6) ใช้ prefix ถูกต้องแล้วไม่ต้องแปลง** |
| เสียงเอฟเฟกต์ 10 ไฟล์ | `assets/audio/sfx-*.wav` | ✅ เสร็จ (ยืมจาก Unity asset pack LittleVillage) |
| Character sheet 4 ตัวละคร | `assets/img/characters/` | ✅ เสร็จ (Codex) — **ตอนนี้ถูกใช้งานจริงแล้ว** ในหน้าจอใหม่ "รู้จักเพื่อนๆ" |
| ภาพฉากเปิดบท + ภาพคำศัพท์บางส่วน | `assets/img/scenes/`, `assets/img/vocab/` | 🔄 กำลังทยอยผลิต (Codex คุมตัวละคร, Antigravity ช่วยภาพไม่มีตัวละคร) |
| ระบบบันทึกความคืบหน้า (IndexedDB) | `engine.js` (FEJDatabase) | ✅ เสร็จ — ทดสอบแล้วว่าโปรไฟล์/XP/ดาวคงอยู่ข้ามการปิดเบราว์เซอร์ |
| หน้าจอ "รู้จักเพื่อนๆ" (Meet the Characters) | `index.html` (`#scr-characters`) | ✅ เสร็จใหม่ — เปิดจากปุ่ม 👥 ในหน้าแผนที่ |
| กิจกรรมแปลงประโยค (statement→negative/question) | `engine.js` (step type `transform`, optional field ต่อบท) | ✅ เสร็จใหม่ — นำร่องใน `p3u7l2` (Past Simple) และ `p5u4l1`/`p5u4l2` (must/mustn't) เท่านั้น ยังไม่ทำครบทุกบท |
| แผนอัพเกรดพรีเมียม | `premium-roadmap.md` | ✅ เสร็จ (Phase 2-5) |
| แผนหลักสูตรเต็ม ป.1-6 (v3, อิงหนังสือจริง + วิจัยเพิ่ม) | `curriculum-plan-p1-2-p5-6.md` | ✅ เสร็จทั้งแผนและเนื้อหาจริงครบทุกชั้นแล้ว |
| ตารางรวมหนังสือเรียนจริง ป.1-4 | `curriculum-reference-real-books.md` | ✅ เสร็จ |

**สถานะรวมตอนนี้:** ป.1-6 มีเนื้อหาเต็มครบ **192 บทเรียนทั้งหมด** เล่นได้จริงในแอปแล้วทั้งหมด มี 6 แท็บในหน้าแผนที่ (🌻 ป.1 / 🏙️ ป.2 / 🎪 ป.3 / 🌍 ป.4 / 🏆 ป.5 / 🚀 ป.6) — **หลักสูตรเนื้อหาเขียนจบสมบูรณ์แล้ว** สิ่งที่เหลือทั้งหมดตอนนี้คืองานภาพ/เสียง (Codex/Antigravity) และงาน polish/deploy

**ของที่ยังไม่มี:** ภาพคำศัพท์ส่วนใหญ่ (Codex/Antigravity กำลังทยอยผลิต — เว็บ fallback เป็น emoji ให้อัตโนมัติ), กิจกรรมแปลงประโยคยังมีแค่ 3 บทนำร่อง (ยังไม่ขยายทั้งระบบ). **เว็บจริง deploy แล้ว** ที่ https://phetpuk-cpu.github.io/fun-english-journey/ (ดูข้อ 3.3)

**จุดสำคัญที่ตัดสินใจไปแล้ว:**
- หลักสูตรผสม สพฐ. × CEFR / เริ่มที่ ป.3–4 ก่อน (ลูกชายอยู่ ป.4 เป็นผู้ทดสอบ)
- ตัวละคร: Ducky 🦆 (ตัวเอก), Mali 🐘 (ผู้ช่วยภาษาไทย), Teacher Owl 🦉, Grumpy Cat 🐱
- โครงบทเรียน: intro → ศัพท์ 8 → ฟังเลือก 3 → จับคู่ → เรียงประโยค → พูด 4 (อัดเสียง+ฟังเทียบ) → ควิซ 8
- เสียงตอนนี้ใช้ Web Speech API (TTS) ชั่วคราว / ภาพใช้ emoji ชั่วคราว — รอไฟล์จริงจาก AI ภาพ/เสียง
- TTS rate: EN 0.75, TH 0.65 / เกณฑ์คะแนนพูด: ≥80 = 3 ดาว, 50–79 = 2 ดาว
- ยังไม่บันทึกคะแนนถาวร (in-memory) — ห้ามใช้ localStorage ใน artifact, เวอร์ชันจริงใช้ IndexedDB

## 2. รอผล
- [ ] ลูกชายทดสอบเล่นบทเรียน (ตอนนี้มีครบ 64 บท ป.3-4 ให้ลองแล้ว ไม่ใช่แค่ 16 บทแรก) → จดว่า: บทไหนติดขัด / กิจกรรมไหนสนุก-น่าเบื่อ / คะแนนไมค์แฟร์ไหม / ศัพท์ยากง่ายพอดีไหม (โดยเฉพาะหน่วย 6-8 ของ ป.4 ที่เริ่มมี comparatives กับ Past Simple ยากขึ้นกว่าหน่วยแรกๆ)
- [ ] ส่ง `asset-production-kit-batch2.md` ให้ Codex (ภาพ 48×9=432 ภาพ) และ Antigravity (เสียง 48 บท) ทำต่อ — รูปแบบ/กฎตั้งชื่อไฟล์เหมือนชุดแรกทุกอย่าง

## 3. งานบนคอมพิวเตอร์ (เรียงตามลำดับแนะนำ)

### 3.1 ~~แยกโครงสร้างโปรเจกต์จริง~~ ✅ เสร็จแล้ว
โครงสร้างจริงอยู่ที่ `fun-english-journey/` (index.html, css/style.css, js/engine.js, data/*.json, assets/img+audio เป็น symlink ไปยัง `English_fun/assets/` ที่ Codex/Antigravity เขียนไฟล์ลงจริง) — เป็น git repo แล้วที่ `English_fun/` ทั้งโฟลเดอร์

### 3.2 ~~เพิ่มระบบบันทึกความคืบหน้า~~ ✅ เสร็จแล้ว (Antigravity)
ใช้ IndexedDB เก็บ: โปรไฟล์ (ชื่อเล่น+อวาตาร์), ดาวรายบท, XP รวม, สถิติคะแนนพูด — หลายโปรไฟล์ต่อเครื่องได้ (`FEJDatabase` class ใน engine.js) ทดสอบแล้วว่าข้อมูลคงอยู่ข้ามการปิดเบราว์เซอร์

### 3.3 ~~Deploy ขึ้นเว็บจริง~~ ✅ LIVE แล้ว! (11 ก.ค. 2026)
- **🎉 เว็บจริง: https://phetpuk-cpu.github.io/fun-english-journey/** — ลูกเปิดเล่นได้ทุกเครื่องทุกเวลา (https, ไมโครโฟนใช้ได้)
- **repo:** `github.com/phetpuk-cpu/fun-english-journey` (public)
- **deploy อัตโนมัติ:** ทุกครั้งที่ `git push` ขึ้น main (แตะไฟล์ใน `fun-english-journey/` หรือ `assets/`) → GitHub Actions (`.github/workflows/deploy.yml`) build + deploy ให้เองใน ~30 วิ ไม่ต้องทำมือ **→ เวลา Codex/Antigravity ส่งภาพใหม่ แค่ commit+push เว็บอัปเดตเอง**
- **วิธีแก้ 2 ปัญหาที่เจอ:** (1) symlink `assets` → workflow ใช้ `cp -rL` แปลงเป็นไฟล์จริงตอน build (โครงสร้าง local + ที่ Codex/Antigravity เขียน ไม่ต้องเปลี่ยน); (2) แอปอยู่ใน subfolder → workflow serve จาก `fun-english-journey/` ผ่าน artifact ของ actions/upload-pages-artifact (ไม่ใช้โหมด "deploy from branch")
- ยืนยันบนเว็บจริงแล้ว: JSON ทั้ง 6 ชั้นโหลดได้, mp3 เสียงเล่นได้ (audio/mp3), ภาพ scene/vocab เสิร์ฟเป็นไฟล์จริง (image/png) — ไม่ใช่ broken symlink อีกต่อไป
- ขนาดเว็บจริง ~213 MB (audio 52MB + img 139MB) ต่ำกว่าลิมิต GitHub Pages 1GB สบายๆ (ตัวเลข `du` 1.2GB เป็น slack ของ volume block 128KB ไม่ใช่ขนาดจริง)

### 3.4 เสียบไฟล์ภาพ/เสียงจริงแทน placeholder — ทำงานอัตโนมัติอยู่แล้ว ✅
engine เช็คไฟล์จริงก่อนเสมอ (ทั้งชื่อไฟล์แบบแบนตามกฎ และแบบแยกโฟลเดอร์หมวดหมู่ที่ Codex ใช้จริง เช่น `img/scenes/`, `img/vocab/`) → มีใช้ไฟล์จริง / ไม่มี fallback เป็น emoji+TTS โดยอัตโนมัติ ไม่ต้องแก้โค้ดเพิ่มเวลา Codex/Antigravity ส่งไฟล์ใหม่มา

### 3.5 ผลิตเนื้อหา ✅ ครบทั้ง ป.1-6 แล้ว (192 บทเรียน)
- [x] เขียนเนื้อหา ป.3–4 หน่วย 3–8 ครบแล้ว (48 บทใหม่ — รวมของเดิม 16 บทเป็น 64 บทเต็มทั้ง ป.3-4)
- [x] เขียนเนื้อหา ป.1 ครบทั้ง 8 หน่วยแล้ว (32 บทใหม่ — ธีม 🌻 Ducky's Pond School) + ชุดสั่งงานภาพ/เสียง batch4 เสร็จแล้ว
- [x] เขียนเนื้อหา ป.5 ครบทั้ง 8 หน่วยแล้ว (32 บทใหม่ — ธีม 🏆 Champion Academy) + ชุดสั่งงานภาพ/เสียง batch5 เสร็จแล้ว
- [x] เขียนเนื้อหา ป.6 ครบทั้ง 8 หน่วยแล้ว (32 บทใหม่ — ธีม 🚀 Future & Beyond: going-to future, should/could, will ทบทวน, present perfect, passive voice, first conditional) + ชุดสั่งงานภาพ/เสียง batch6 เสร็จแล้ว — **นี่คือชั้นสุดท้าย หลักสูตร ป.1-6 เขียนจบสมบูรณ์แล้ว**
- [ ] ปรับเนื้อหาตาม feedback ลูกชายหลังทดสอบเล่น (ดูข้อ 2)

### 3.6 กิจกรรมแปลงประโยค (Sentence Transform) — ขยายครบ 73/192 บทแล้ว (12 ก.ค. 2026)
step type `"transform"` ใน engine.js (field `transform` ในไฟล์ JSON เป็น array แบบ optional ต่อบทเรียน) backward compatible 100% — ขยายจาก 3 บทนำร่องเป็น 73 บทที่มีไวยากรณ์ชัดเจนพอ: can/can't, present continuous, comparatives, present simple (หลายหน่วย), past simple/continuous, must/should, future will/going-to, present perfect, passive voice, first conditional — ทดสอบผ่าน `tools/validate-lessons.js` ครบ 192 บท 0 error และทดสอบ UI จริงแล้ว บทที่เหลือ 119 บทเป็น vocab-only หรือ functional phrase ที่ไม่มีไวยากรณ์เดี่ยวชัดพอ (ป.1 ส่วนใหญ่, shopping/directions ฯลฯ) ตั้งใจไม่ใส่ให้

### 3.7 หน้าจอ "รู้จักเพื่อนๆ" (Meet the Characters) — เพิ่งเพิ่ม
ใช้ character sheet 4 ตัวที่ Codex ทำไว้นานแล้วแต่ไม่เคยถูกเรียกใช้จริง — เปิดจากปุ่ม 👥 มุมขวาบนของหน้าแผนที่

### เฟสถัดไป — งานที่เหลือทั้งหมด เรียงตามลำดับความสำคัญ (อัปเดต 12 ก.ค. 2026)
รวมทุกแผนที่เคยคุยไว้ (premium-roadmap.md + งาน infra ที่เจอระหว่างทาง) ไว้ที่เดียว กันลืม — เช็คลิสต์นี้คือ source of truth เดียว ตัวอื่น (premium-roadmap.md) แค่ลิงก์กลับมา

**Tier 0 — เช็คสถานะ (ไม่ใช่งานใหม่ แค่ติดตาม)**
- [ ] ยืนยันว่า Codex ผนวก `tools/optimize-images.sh` เข้า pipeline ผลิตภาพแล้ว (ส่งบรีฟให้ 12 ก.ค.)

**Tier 1 — ทำก่อน: เร็ว คุ้มค่า ไม่มีข้อผูกมัด/ไม่บล็อกงานอื่น**
- [x] ขยายกิจกรรมแปลงประโยค (`transform`) ให้ครบทุกบทที่มีไวยากรณ์เหมาะสม — เสร็จแล้ว 12 ก.ค. 2026 ขยายจาก 3 → 73/192 บท (ดูข้อ 3.6)
- [ ] Phase 4a: แบบทดสอบจำลอง Cambridge Starters/Movers/Flyers + badge/certificate พิมพ์ได้ — ต่อยอดจาก result-screen ที่มีอยู่แล้วใน `engine.js`
- [ ] หน้า **PDPA consent ผู้ปกครอง** — ต้องมีก่อนเก็บเงินหรือเก็บข้อมูลเด็กเพิ่มเติม (บล็อก Phase 4b/5 ด้านล่าง)
- [ ] เช็ค **license เสียง SFX** (ยืมจาก Unity asset pack "Leohpaz RPG_Essentials_Free") — ต้องเคลียร์ก่อนขายเชิงพาณิชย์จริง

**Tier 2 — ตัวสร้างความแตกต่าง (effort กลาง-สูง แต่เป็นจุดขายหลัก)**
- [ ] Phase 3 (EP depth): โหมดเขียนประโยคเอง, โหมดอ่านจับใจความ (มีกรอบจาก Oxford Skills World แล้ว), โหมดตั้งคำถามเอง, ขยาย vocab เสริม, หน่วย Past Simple + Future — ดูรายละเอียดใน `premium-roadmap.md`
- [ ] เพลงประจำหน่วย (บรีฟ AI เพลงตามภาคผนวก B ของแผนแม่บท)
- [ ] กิจกรรม Roleplay Chat สำหรับ ป.4 ขึ้นไป
- [ ] Phase 4b: แดชบอร์ดผู้ปกครองขั้นสูง (กราฟเทียบ benchmark, จุดที่ลูกติดขัดบ่อย, รายงานรายสัปดาห์ทางอีเมล/LINE) — ต้องรอ PDPA (Tier 1) ก่อน

**Tier 3 — โครงสร้างพื้นฐาน/technical debt (ไม่เร่ง แต่ความเสี่ยงโตขึ้นเรื่อยๆ ถ้าปล่อยไว้)**
- [ ] Git LFS migration — ต้อง rewrite ประวัติ git + force-push ต้องเลือกจังหวะที่ไม่มี Codex/Antigravity กำลัง push งานอยู่
- [ ] เลือก analytics service ต่อบทเรียน (ต้องสมัครบัญชี เช่น GoatCounter/Plausible)
- [ ] Automated test เพิ่มเติมนอกจาก schema validator (เช่น navigation, save/resume, permission denied — ตามที่ระบุใน `docs/done/webapp-ux-ui-security-review-for-claude.md`)

**Tier 4 — ทำท้ายสุด (ต้องมี backend ก่อนถึงจะเริ่มได้)**
- [ ] Phase 5: หลายโปรไฟล์เด็กไม่จำกัด, adaptive lesson selection, cloud sync ข้ามอุปกรณ์ (Supabase) — รอ PDPA (Tier 1) เสร็จก่อนด้วย

~~แก้ปัญหา symlink + subfolder ก่อน deploy~~ ✅ deploy สำเร็จแล้ว (ดูข้อ 3.3)

## 4. ข้อควรระวังทางเทคนิค (บทเรียนที่เจอมาแล้ว)
1. **ห้ามฝังข้อความลงใน onclick โดยตรง** — ประโยคที่มี ' ทำสคริปต์พังทั้งหน้า → ใช้ data-say attribute + ตัวฟังกลาง (แก้แล้วใน v ปัจจุบัน)
2. SpeechRecognition ใช้ได้ดีบน Chrome/Android, **iOS Safari ไม่รองรับ** → มี fallback อัดเสียง 4 วิ + ฟังเทียบเองแล้ว
3. เสียง TTS บนมือถือเล่นได้หลังผู้ใช้แตะหน้าจอครั้งแรกเท่านั้น
4. อัดเสียง: MediaRecorder + SpeechRecognition รันพร้อมกัน มี timeout กันค้าง 6 วิ
