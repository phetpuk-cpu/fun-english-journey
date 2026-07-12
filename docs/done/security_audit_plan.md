# 🔒 Security Audit & Hardening Plan — Fun English Journey

อัปเดต: 12 กรกฎาคม 2026  
สถานะ: แผนตรวจและแผนดำเนินงาน — **ยังไม่ได้แก้โค้ดตามแผนนี้**

## 1. เป้าหมายและขอบเขต

เป้าหมายคือทำให้เว็บแอปปลอดภัยสำหรับเด็กและผู้ปกครอง โดยรักษาระบบบทเรียน เสียง คะแนน และ IndexedDB เดิมไว้ให้มากที่สุด

ขอบเขตการตรวจ:

- `fun-english-journey/index.html`
- `fun-english-journey/js/engine.js`
- `fun-english-journey/js/parents-dashboard.js`
- `fun-english-journey/data/*.json`
- `fun-english-journey/css/*.css`
- `parents.html`, `privacy.html`, `help.html`
- การใช้ IndexedDB, localStorage, microphone, MediaRecorder และ Speech Recognition
- การตั้งค่า HTTPS, CSP, Permissions Policy และ security headers บน production hosting
- Supply chain จาก Google Fonts และ assets ภายนอก

นอกขอบเขตในระยะนี้:

- ระบบบัญชีออนไลน์ เพราะปัจจุบันไม่มี backend หรือ authentication
- การป้องกันโกง XP สำหรับรางวัลจริง เพราะคะแนนยังเป็น local-only
- กฎหมายฉบับสมบูรณ์ ควรให้ผู้เชี่ยวชาญกฎหมายตรวจหากเปิดให้สาธารณะใช้จริง

## 2. ภาพรวมความเสี่ยงปัจจุบัน

| ID | ความเสี่ยง | ระดับ | หลักฐานปัจจุบัน | สถานะ |
|---|---|---:|---|---|
| SEC-01 | Stored DOM XSS จากชื่อโปรไฟล์ | **High** | `refreshProfilesList()` นำ `p.name` จาก IndexedDB เข้า `innerHTML` | ต้องแก้ทันที |
| SEC-02 | DOM XSS จากข้อมูลบทเรียน/JSON | Medium | หลายหน้าจอ render JSON ด้วย `stage.innerHTML` | ต้องกำหนด trust boundary และ validation |
| SEC-03 | CSP ใช้งานไม่ได้เต็มรูปแบบ | Medium | มี inline `onclick`, `onerror` และ inline styles จำนวนมาก | ต้อง refactor ก่อนเปิด CSP เข้มงวด |
| SEC-04 | Microphone/Speech privacy | Medium | มีคำอธิบายและ consent ขั้นต้นแล้ว แต่ยังเป็น `confirm()` และไม่มี versioned consent | ปรับปรุงต่อ |
| SEC-05 | ข้อมูลเด็กค้างใน shared device | Medium | ไม่มี UI ลบโปรไฟล์/ล้างข้อมูลทั้งหมดที่ชัดเจน | ต้องเพิ่ม data controls |
| SEC-06 | Third-party fonts/privacy dependency | Low–Medium | โหลด Google Fonts จากภายนอก | ควร self-host |
| SEC-07 | Production headers/HTTPS ไม่ได้ยืนยัน | High เมื่อ deploy | repository ยังไม่ระบุ hosting config | ต้องตรวจ environment จริง |
| SEC-08 | Blob URL/media lifecycle | Low | มีการ revoke บางเส้นทางแล้ว ต้องตรวจทุก exit path | Audit เพิ่ม |
| SEC-09 | Error/log disclosure | Low | มี `console.error()` และข้อความ error บางส่วน | แยกข้อความผู้ใช้กับ developer log |
| SEC-10 | Local score integrity | Low ปัจจุบัน | XP/ดาวแก้ได้จาก DevTools | ยอมรับได้จนกว่าจะมี leaderboard/รางวัล |

## 3. หลักการแก้ไข

### 3.1 ไม่ใช้ escaping เป็นแนวป้องกันหลักเมื่อสร้าง DOM ได้

สำหรับข้อมูลผู้ใช้ ควรสร้าง element แล้วกำหนดด้วย `textContent` แทนการประกอบ string เข้า `innerHTML` การเพิ่ม `escapeHTML()` อย่างเดียวลดความเสี่ยงเฉพาะ HTML context แต่ยังผิดพลาดได้เมื่อนำข้อมูลไปใช้ใน attribute, URL หรือ JavaScript context

แนวทางที่เลือก:

1. ข้อมูลผู้ใช้ → DOM API + `textContent`
2. ตัวเลข → แปลงด้วย `Number()`, ตรวจ `Number.isFinite()` และกำหนดช่วง
3. ID → ตรวจ type/range ก่อนใช้ และผูก event ด้วย `addEventListener`
4. URL/asset path → สร้างจาก identifier ที่ผ่าน allowlist เท่านั้น
5. HTML ที่มาจากภายนอก → ไม่รองรับในระยะนี้ หากต้องรองรับต้องใช้ sanitizer ที่ผ่านการดูแล

### 3.2 Validation ไม่ควรทำลายชื่อเด็กโดยเงียบ

ไม่ควรใช้ `replace()` เพื่อลบอักขระแล้วบันทึกชื่อที่เปลี่ยนไปโดยไม่แจ้งผู้ใช้ ให้ใช้การตรวจแล้วแสดงข้อความแทน

ข้อกำหนดชื่อเล่นที่เสนอ:

- trim ช่องว่างหัวท้าย
- normalize เป็น Unicode NFC
- ความยาว 1–20 grapheme clusters
- อนุญาตอักษรไทย อังกฤษ ตัวเลข ช่องว่าง เครื่องหมายขีด `-` และ apostrophe ที่ใช้ในชื่อ
- ปฏิเสธ control characters, bidi overrides และ markup delimiters
- แสดงค่าด้วย `textContent` เสมอ แม้ validation ผ่านแล้ว

### 3.3 IndexedDB ต้องถือเป็น untrusted input

ข้อมูลใน IndexedDB แก้ได้จาก DevTools หรือจากเว็บเวอร์ชันเก่าที่มีช่องโหว่ ทุกค่าที่อ่านกลับมาต้อง validate/canonicalize ก่อนใช้

## 4. Roadmap การดำเนินงาน

## Phase 0 — Baseline และ Regression Guard

ระยะเวลาโดยประมาณ: 0.5 วัน

- บันทึกรายการไฟล์และ checksum ก่อนแก้
- ทำ test fixtures สำหรับ profile ปกติและ profile อันตราย
- เพิ่ม test cases อย่างน้อย:
  - `<img src=x onerror=alert(1)>`
  - `"><svg onload=alert(1)>`
  - ชื่อไทย/อังกฤษ/ตัวเลข/emoji
  - ID, XP และดาวที่เป็น string, negative, `NaN`, ค่าสูงผิดปกติ
- บันทึกพฤติกรรมหน้า Welcome, Map, Lesson, Parents Dashboard และ Settings ก่อนเปลี่ยน
- ตรวจว่าไม่มีข้อมูลผู้ใช้จริงถูกใส่ใน test fixture

เกณฑ์ผ่าน:

- มี baseline test ที่ทำซ้ำได้
- ทราบทุกตำแหน่งที่รับข้อมูลจาก IndexedDB, localStorage และ JSON

## Phase 1 — P0 Stored XSS Remediation

ระยะเวลาโดยประมาณ: 0.5–1 วัน

### งาน 1.1 เปลี่ยน profile list เป็น DOM API

- เอา `profiles.map(...).join("")` ออกจาก `refreshProfilesList()`
- ใช้ `replaceChildren()` และ `document.createElement()`
- ชื่อ/avatar/XP/ดาวใช้ `textContent`
- ผูกการเลือก profile ด้วย `addEventListener("click", ...)`
- ตรวจ `profile.id` เป็นจำนวนเต็มบวก
- จำกัด XP และดาวที่แสดงไม่ให้เป็นค่าติดลบหรือค่าที่ทำ UI พัง

### งาน 1.2 Validate ตอนสร้าง profile

- เพิ่ม `validateNickname(rawName)` ที่คืน `{ok, value, message}`
- ไม่แก้ชื่อโดยเงียบ
- ใช้ชื่อที่ normalize แล้วบันทึก
- เพิ่มข้อความ validation ในหน้าแทน `alert()` เมื่อทำได้

### งาน 1.3 Migration ข้อมูลเก่าแบบไม่ทำลายข้อมูล

- ไม่แก้ IndexedDB schema ในรอบแรก
- ข้อมูลชื่อเก่าที่มี markup ต้องแสดงเป็นข้อความธรรมดา ไม่ execute
- ถ้าชื่อเก่าไม่ผ่านกฎใหม่ ยังอนุญาตให้เลือก profile ได้ แต่ขอให้เปลี่ยนชื่อก่อนแก้ไข profile ในอนาคต

เกณฑ์ผ่าน:

- Payload XSS ทุกตัวแสดงเป็นข้อความธรรมดา
- ไม่มีข้อมูลจาก profile เข้า `innerHTML`, inline event handler หรือ dynamic style
- Profile ปกติและความก้าวหน้าเดิมยังใช้งานได้

## Phase 2 — Dynamic Content Trust Boundary

ระยะเวลาโดยประมาณ: 1–2 วัน

ปัจจุบัน lesson JSON เป็น static same-origin แต่ถูก render ด้วย `innerHTML` หลายตำแหน่ง ต้องกำหนดว่าเป็น trusted build artifact ไม่ใช่ trusted โดยธรรมชาติ

- สร้าง schema validator สำหรับ unit/lesson JSON
- ตรวจ `grade`, lesson ID, title, vocab, quiz choices, answer index และ asset slug
- ปฏิเสธ lesson ID หรือ asset path ที่มี `/`, `..`, `:`, backslash หรือ control characters
- ตรวจ answer index ให้อยู่ในช่วง choices
- จำกัดความยาวข้อความและจำนวนรายการต่อบท
- แยก render helper สำหรับ plain text
- ลด `innerHTML` ทีละ activity โดยเริ่มจากค่าที่แสดงจาก JSON
- ใช้ `textContent` และ hardcoded attributes
- ไม่อนุญาต HTML markup ในไฟล์บทเรียน

เกณฑ์ผ่าน:

- JSON ที่ผิด schema โหลดไม่ผ่านและแสดงข้อผิดพลาดทั่วไป
- ไม่มี path traversal ผ่านชื่อไฟล์ภาพ/เสียง
- ข้อความ `<script>` ใน JSON แสดงเป็นข้อความหรือถูกปฏิเสธ ไม่ execute

## Phase 3 — Remove Inline JavaScript และเตรียม CSP

ระยะเวลาโดยประมาณ: 2–3 วัน

- ย้าย `onclick` และ `onerror` ใน `index.html` ไป `addEventListener`
- เอา inline handlers ที่สร้างจาก `stage.innerHTML` ออก
- ใช้ event delegation ด้วย `data-action` ที่มี allowlist
- ย้าย inline style ที่จำเป็นไป CSS class
- แทน image `onerror` ด้วย event listener
- ตรวจว่าไม่มี `eval`, `new Function`, string-based timer หรือ `javascript:` URL

เหตุผล: CSP `script-src 'self'` จะบล็อก inline event handlers โดยตรง จึงเปิดใช้นโยบายเข้มงวดไม่ได้จนกว่างานนี้เสร็จ

เกณฑ์ผ่าน:

- ค้นหา `onclick=`, `onerror=` และ inline `<script>` แล้วไม่พบใน HTML ที่ deploy
- แอปทำงานภายใต้ CSP แบบไม่มี `'unsafe-inline'` สำหรับ script
- Console ไม่มี CSP violation ที่เกิดจากโค้ดแอป

## Phase 4 — Microphone Privacy และ Data Controls

ระยะเวลาโดยประมาณ: 1–2 วัน

### Microphone

- แทน `confirm()` ด้วย accessible consent panel/modal
- แยกคำยินยอมของผู้ปกครองจากสถานะ browser permission
- บันทึก consent version เช่น `{version:1, acceptedAt, scope:"practice-audio"}`
- มีปุ่มถอน consent และ reset microphone permission guidance
- ระบุว่า Speech Recognition อาจใช้บริการของผู้ผลิตเบราว์เซอร์
- ข้ามกิจกรรมได้โดยไม่เสียสิทธิ์เรียน
- ตรวจทุก exit path ว่าปิด MediaStream tracks, recorder, SpeechRecognition, AudioContext และ revoke Blob URL

### Local data

- เพิ่มหน้าจัดการข้อมูล:
  - เปลี่ยนชื่อเล่น
  - ลบโปรไฟล์รายคน
  - ลบข้อมูลทั้งหมด
  - ดูว่าข้อมูลใดบันทึกในเครื่อง
- ยืนยันก่อนลบด้วยข้อความที่ชัดเจน
- หลังลบตรวจ IndexedDB และ localStorage ที่เกี่ยวข้อง
- ห้ามเก็บชื่อจริง โรงเรียน วันเกิด อีเมล หรือตำแหน่งโดยไม่จำเป็น

เกณฑ์ผ่าน:

- ปฏิเสธไมโครโฟนแล้วเรียนต่อได้
- เข้า background/เปลี่ยนหน้าแล้วไม่มี track ค้าง
- ผู้ปกครองลบข้อมูลได้จริงและตรวจยืนยันผลได้

## Phase 5 — Production Headers และ Dependency Hardening

ระยะเวลาโดยประมาณ: 1–2 วัน ขึ้นกับ hosting

### ขั้น 5.1 CSP Report-Only

เริ่มด้วย `Content-Security-Policy-Report-Only` และเก็บ violation ระหว่างทดสอบ จากนั้นจึง enforce

นโยบายเป้าหมายหลังย้าย inline code และ self-host fonts:

```text
default-src 'self';
script-src 'self';
style-src 'self';
font-src 'self';
img-src 'self' data: blob:;
media-src 'self' blob:;
connect-src 'self';
object-src 'none';
base-uri 'none';
frame-ancestors 'none';
form-action 'self';
manifest-src 'self';
```

### ขั้น 5.2 Headers อื่น

```text
Permissions-Policy: microphone=(self), camera=(), geolocation=()
X-Content-Type-Options: nosniff
Referrer-Policy: no-referrer
Cross-Origin-Opener-Policy: same-origin
```

เปิด HSTS หลังยืนยัน HTTPS ทุก subdomain:

```text
Strict-Transport-Security: max-age=31536000; includeSubDomains
```

### ขั้น 5.3 Third-party resources

- self-host Mali และ Baloo 2 หรือใช้ system font stack
- เอา Google Fonts และ `preconnect` ภายนอกออก
- ตรวจ MIME types ของ JS, CSS, JSON, MP3, WAV และ PNG
- กำหนด cache policy แยกระหว่าง HTML, versioned assets และข้อมูลบทเรียน

เกณฑ์ผ่าน:

- HTTPS redirect ทำงาน
- ไม่มี mixed content
- CSP enforce โดยไม่ใช้ `unsafe-inline` สำหรับ script
- microphone ใช้ได้เฉพาะ top-level same-origin app
- ไม่มี request ไป third-party domain โดยไม่จำเป็น

## Phase 6 — Verification และ Release Gate

ระยะเวลาโดยประมาณ: 1–2 วัน

### Automated checks

- JavaScript syntax/lint
- HTML validation และ duplicate IDs
- ค้นหา dangerous sinks/sources
- XSS payload regression tests
- JSON schema tests
- ตรวจ security headers บน staging URL
- ตรวจ dependency/asset inventory

### Manual checks

- Safari บน iPad ทั้ง Allow/Deny microphone
- Chrome/Edge desktop
- Android Chrome
- shared-device flow: สร้าง → ใช้ → ลบ profile
- offline/connection loss ระหว่างโหลดบท
- เปลี่ยนหน้าและ background ระหว่างอัดเสียง
- Parents Dashboard ต้องไม่ execute ชื่อ profile ที่เป็น markup

### Release blockers

ห้าม deploy หากพบข้อใดข้อหนึ่ง:

- ข้อมูลผู้ใช้เข้า dangerous sink โดยไม่มี contextual protection
- XSS payload execute ได้
- ไมโครโฟนเปิดค้างหลังออกจากกิจกรรม
- production ใช้ HTTP
- CSP/headers ไม่ตรงกับเอกสาร deploy
- ไม่มีวิธีลบข้อมูลเด็กจากอุปกรณ์

## 5. Test Matrix ขั้นต่ำ

| หมวด | Test case | ผลที่คาดหวัง |
|---|---|---|
| Profile XSS | ชื่อ `<img src=x onerror=alert(1)>` | แสดงเป็นข้อความหรือถูกปฏิเสธ ไม่มี event ทำงาน |
| Profile ID | ID เป็น string/negative/ใหญ่ผิดปกติ | ไม่สร้าง inline JS และไม่เลือก profile ผิด |
| Numeric data | XP/ดาวเป็น `NaN`, string หรือ negative | normalize เป็นค่าปลอดภัย |
| Lesson JSON | title มี `<script>` | ไม่ execute |
| Asset path | slug มี `../` | ปฏิเสธก่อนสร้าง URL |
| Microphone deny | ผู้ใช้กดไม่อนุญาต | แสดงคำแนะนำและข้ามได้ |
| Background | สลับแอประหว่างอัด | ทุก track หยุด |
| Local data delete | ลบ profile | profile และ progress หายจริง |
| CSP | เปิด policy บน staging | ไม่มี unexpected violation |
| Clickjacking | โหลดแอปใน iframe ต่าง origin | ถูกบล็อกด้วย `frame-ancestors 'none'` |

## 6. Deliverables

- Security findings พร้อม severity, evidence และสถานะ
- Code changes แยก commit ตาม phase
- XSS regression test fixtures
- JSON schema/validator
- Privacy consent UI และ data-management UI
- Hosting security-header configuration
- Staging verification report
- Release checklist สำหรับ Safari/iPad และเบราว์เซอร์หลัก
- เอกสาร residual risks

## 7. ลำดับแนะนำ

1. **P0:** Phase 0–1 แก้ Stored XSS ก่อนงาน feature ใหม่
2. **P1:** Phase 2 กำหนด trust boundary ของ JSON
3. **P1:** Phase 3 ย้าย inline handlers เพื่อเปิด CSP
4. **P1:** Phase 4 ปรับ microphone consent และ data deletion
5. **P2:** Phase 5 ตั้งค่า hosting และ self-host fonts
6. **Release gate:** Phase 6 ตรวจ staging และอุปกรณ์จริง

ประมาณการรวม: **6–11 วันทำงาน** สำหรับผู้พัฒนาหนึ่งคน ไม่รวมเวลารอ hosting หรือ legal review

## 8. แหล่งอ้างอิงหลัก

- [OWASP Cross-Site Scripting Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html)
- [OWASP DOM-based XSS Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/DOM_based_XSS_Prevention_Cheat_Sheet.html)
- [OWASP Content Security Policy Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Content_Security_Policy_Cheat_Sheet.html)
- [OWASP HTML5 Security Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/HTML5_Security_Cheat_Sheet.html)
- [MDN CSP: script-src](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Content-Security-Policy/script-src)
- [OWASP Application Security Verification Standard](https://owasp.org/www-project-application-security-verification-standard/)
