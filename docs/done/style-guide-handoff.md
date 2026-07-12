# Fun English Journey — สรุปสไตล์ (สำหรับส่งต่อ Claude Code)

อ้างอิงจากต้นแบบ `Fun English Journey.dc.html` ที่ปรับปรุงจากดีไซน์เดิมใน `style.css` ให้ดูพรีเมียม/สนุกขึ้น โดยยังใช้โทนสีและฟอนต์เดิมของแอป

## 1. ฟอนต์
- Heading: `'Baloo 2', 'Mali', sans-serif` (weight 600/800)
- Body: `'Mali', 'Comic Sans MS', sans-serif` (weight 400/600/700)
- Google Fonts: `Mali:wght@400;600;700` + `Baloo+2:wght@600;800`

## 2. สีหลัก (คงเดิมจาก style.css)
- sky (bg): `#EAF6FF` / ink (text): `#1D3557`
- blue: `#2E90FA` / duck-yellow: `#FFC93C` / coral: `#FF6B6B`
- green: `#34C77B` / purple: `#9B7EDE` / white: `#FFFFFF`
- secondary text: เดิม `#6b7a99` → **แนะนำเปลี่ยนเป็น `#57678a`** (contrast ดีขึ้นบนพื้นขาว, ผ่าน AA)

## 3. พื้นหลัง (ใหม่ — เพิ่มความพรีเมียม)
แทนที่ `background:#EAF6FF` เรียบๆ ด้วย gradient นุ่มๆ:
```css
background:
  radial-gradient(circle at 15% 0%, #FFF3D6 0%, transparent 45%),
  radial-gradient(circle at 100% 10%, #FDE4F3 0%, transparent 40%),
  linear-gradient(180deg, #EAF6FF 0%, #DCEEFF 55%, #E7F0FF 100%);
```
เพิ่มเลเยอร์ตกแต่งลอยไปมา (fixed, pointer-events:none, opacity .25-.35): ⭐☁️🎈✨🌈 กระจายตามมุมจอ พร้อม keyframes ลอยขึ้นลงช้าๆ (`fejFloat`/`fejFloat2`, 6.5–9s ease-in-out infinite, สลับ translateY + rotate เล็กน้อย)

## 4. การ์ด (Card)
เดิม: `border-radius:24px; box-shadow:0 4px 0 rgba(29,53,87,.15)` (เงาแบนแบบเกม)
ใหม่ (พรีเมียมขึ้น แต่ยังนุ่มนวล):
```css
border-radius:24px;
box-shadow:0 10px 28px rgba(29,53,87,.10), 0 2px 8px rgba(29,53,87,.06);
border:1px solid rgba(255,255,255,.7);
```

## 5. ปุ่ม CTA เต็มความกว้าง
เดิมเป็นสีเรียบ + เงาแบน 4px แบบเกม → เปลี่ยนเป็น gradient + เงานุ่มร่วมกับเงาแบบกดได้ (skeuomorphic แต่ soft):

- **เหลือง (primary)**: `linear-gradient(135deg,#FFDD7A,#FFC93C)`, shadow `0 6px 0 #E8A317, 0 14px 22px rgba(255,183,39,.35)`
- **เขียว (success/continue)**: `linear-gradient(135deg,#5FE0A0,#34C77B)`, shadow `0 6px 0 #22935a, 0 14px 22px rgba(52,199,123,.35)`
- **ม่วง (parents/dashboard)**: `linear-gradient(135deg,#C3ADF2,#9B7EDE)`, shadow `0 6px 0 #7c5fc4, 0 14px 22px rgba(155,126,222,.35)`
- **ขาว (ghost/secondary)**: คงพื้นขาว แต่เพิ่ม `border:1px solid rgba(29,53,87,.10)` + shadow นุ่ม `0 4px 14px rgba(29,53,87,.08)`

Hover/Active state (ทุกปุ่ม CTA): hover ยกขึ้นเล็กน้อย `translateY(-2px)`; active กดลง `translateY(4px)` พร้อมลดเงาให้เหลือ inset-like (จำลองการกดจริง คล้ายเดิมแต่นุ่มกว่า)

## 6. XP Pill
เดิมพื้นขาวเรียบ → `linear-gradient(135deg,#fff,#FFF6DE)` + border `rgba(255,201,60,.4)` + shadow เรืองแสงเหลืองอ่อน `0 4px 10px rgba(255,183,39,.25)`

## 7. Hero/Mascot (หน้า Welcome)
- วงกลม glow ด้านหลังตัวละคร: `radial-gradient(circle, rgba(255,201,60,.55) 0%, transparent 70%)` ขนาด 120×120px
- ตัวอักษรหัวข้อ "Fun English Journey": gradient text `linear-gradient(135deg,#2E90FA,#9B7EDE)` ผ่าน `-webkit-background-clip:text; -webkit-text-fill-color:transparent;`

## 8. Keyframes ที่ใช้
```css
@keyframes fejPop{from{opacity:0;transform:scale(.97)}to{opacity:1;transform:scale(1)}}
@keyframes fejShake{0%,100%{transform:translateX(0)}25%{transform:translateX(-5px)}75%{transform:translateX(5px)}}
@keyframes fejPulse{0%,100%{transform:scale(1)}50%{transform:scale(1.06)}}
@keyframes fejBounce{0%{transform:scale(0)}60%{transform:scale(1.2)}100%{transform:scale(1)}}
@keyframes fejFloat{0%,100%{transform:translateY(0) rotate(-4deg)}50%{transform:translateY(-16px) rotate(4deg)}}
@keyframes fejFloat2{0%,100%{transform:translateY(0) rotate(3deg)}50%{transform:translateY(-22px) rotate(-3deg)}}
@keyframes fejWiggle{0%,100%{transform:rotate(0) scale(1)}25%{transform:rotate(-8deg) scale(1.08)}75%{transform:rotate(8deg) scale(1.08)}}
```

## 9. ยังไม่ได้ทำ (ทำต่อได้)
- Bounce/wiggle บนไอคอนบทเรียน, emoji การ์ดคำศัพท์ (ตอน hover)
- Hover-scale บนปุ่มตัวเลือก quiz/choice และการ์ดคำศัพท์

## 10. หมายเหตุสำคัญ
สไตล์นี้ทำในต้นแบบแยกต่างหาก (ไม่ใช่ repo จริง) — ยังไม่ถูก push ขึ้น `github.com/phetpuk-cpu/fun-english-journey` ต้องนำค่าสีตามข้อ 1-8 ไปปรับใน `css/style.css` ของโปรเจกต์จริงเอง
