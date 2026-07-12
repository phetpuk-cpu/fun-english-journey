# Audio, Microphone และ Settings — รายงานส่งต่อ Claude

อัปเดต: 11 กรกฎาคม 2026

## ปัญหาที่ได้รับแจ้ง

- Safari บน iPad เปลี่ยนหน้าแล้วเสียงจากหน้าก่อนยังเล่นต่อ
- ระดับเสียงบางครั้งเบา บางครั้งดัง
- กดไมโครโฟนแล้วบางครั้งไม่รับเสียงหรือไม่ทราบว่าส่วนใดไม่ทำงาน
- ต้องการเมนู Settings สำหรับควบคุมเสียงและตรวจไมโครโฟน

## สาเหตุที่พบในโค้ดเดิม

1. `playAudio()` เก็บ Audio object ใน `currentAudio` หลัง `canplaythrough` เท่านั้น ถ้าเปลี่ยนหน้าระหว่างโหลด `stopAllAudio()` จะหาเสียงนั้นไม่พบ และเสียงเริ่มเล่นภายหลังในหน้าใหม่ได้
2. `playSfx()` สร้าง Audio object แบบ local โดยไม่ติดตาม จึงหยุดพร้อมเสียงหลักไม่ได้และอาจซ้อนกัน
3. MP3 ใช้ volume 1.0, SFX ใช้ 0.7, TTS ใช้ระดับระบบ และเสียงอัดขึ้นกับไมโครโฟน ทำให้ความดังไม่สม่ำเสมอ
4. timeout fallback เดิมเพียง 1.2 วินาที อาจเปลี่ยนไปใช้ TTS ทั้งที่ไฟล์จริงแค่โหลดช้า ทำให้เสียงและระดับเสียงเปลี่ยน
5. MediaRecorder กับ SpeechRecognition ถูกรวมเป็น flow เดียว ทำให้ผู้ใช้ไม่ทราบว่า “อัดไม่ได้” หรือ “อัดได้แต่ให้คะแนนไม่ได้”
6. ข้อผิดพลาดไมโครโฟนทุกประเภทใช้ข้อความทั่วไป จึงวินิจฉัย permission, ไม่มีอุปกรณ์, อุปกรณ์ถูกใช้งาน หรือ HTTPS ไม่ได้

## สิ่งที่ดำเนินการแล้ว

### Central Audio Manager

- เพิ่ม `AudioManager` ใน `fun-english-journey/js/engine.js`
- ติดตาม main audio, self-recorded audio, SFX, media stream, fallback timer และ playback token
- เก็บ Audio object ทันทีหลังสร้าง ก่อนรอโหลด
- ยกเลิกเสียงเก่าด้วย `pause()`, ล้าง `src` และ `load()`
- ใช้ playback token ป้องกัน callback เก่าเริ่มเสียงหลังเปลี่ยนหน้า
- หยุดเสียงและไมโครโฟนเมื่อเปลี่ยน screen, `visibilitychange` และ `pagehide`
- ติดตาม SFX ทุกตัวและหยุดพร้อมกันได้
- เปลี่ยน timeout fallback จาก 1.2 เป็น 5 วินาที
- แยกกรณี Safari ปิด autoplay ออกจากกรณีไฟล์เสียงเสีย
- เพิ่มตัวเลือกปิด autoplay และให้ผู้ใช้แตะปุ่มเสียงเอง

### Settings

เพิ่ม screen `scr-settings` โดยไม่เปลี่ยน schema ของบทเรียนหรือโปรไฟล์ ประกอบด้วย:

- Master Volume
- Lesson/Speech Volume
- SFX Volume
- เปิด/ปิดเสียงบทเรียนอัตโนมัติ
- ความเร็วเสียงช้า/ปกติ
- ปุ่มทดสอบเสียง
- ลดภาพเคลื่อนไหว

ค่าถูกเก็บใน `localStorage` key `fejAudioSettings` แยกจาก IndexedDB เดิม เพื่อไม่ต้อง migration โปรไฟล์

### Microphone Test

- แสดงว่า secure context พร้อมหรือไม่
- แสดงการรองรับ `getUserMedia`, `MediaRecorder` และ Speech Recognition แยกกัน
- แสดง permission เมื่อ browser รองรับ Permissions API
- เพิ่ม level meter จาก Web Audio API
- อัดเสียงทดสอบและเล่นกลับได้
- ไม่บันทึกเสียงทดสอบลงโปรไฟล์
- ปิด media tracks และ AudioContext เมื่อหยุดหรือออกจากหน้า
- revoke Blob URL เก่าก่อนสร้างรอบใหม่

### Error Messages

แยกข้อความสำหรับ:

- `NotAllowedError`
- `NotFoundError`
- `NotReadableError`
- `AbortError`
- `SecurityError`
- `OverconstrainedError`
- Speech Recognition: `not-allowed`, `audio-capture`, `no-speech`, `network`

### Privacy Flow

- ก่อนใช้ไมโครโฟนในบทเรียนครั้งแรก มีคำอธิบายและให้ยอมรับ
- ผู้เรียนยกเลิกและข้ามกิจกรรมพูดได้
- บันทึกการยอมรับใน `localStorage` key `fejMicConsent`
- ระบุว่า browser อาจใช้บริการรู้จำเสียงของผู้ผลิตอุปกรณ์

## การตรวจไฟล์เสียง

ตรวจพบไฟล์เสียงจริง 4,235 ไฟล์:

- MP3 จำนวน 4,225 ไฟล์: mono, 24 kHz, 64 kbps
- WAV SFX จำนวน 10 ไฟล์: stereo, 44.1 kHz, 24-bit PCM

codec และ sample rate ภายในแต่ละกลุ่มสม่ำเสมอ แต่เครื่องปัจจุบันไม่มี `ffmpeg` หรือเครื่องมือวัด LUFS ที่สามารถ normalize MP3 จำนวนมากและตรวจ true peak ได้อย่างปลอดภัย จึงไม่ได้เขียนทับต้นฉบับ

เพิ่ม `tools/normalize-audio-copy.sh` สำหรับสร้างไฟล์สำเนาใน `build/audio-normalized` เมื่อมี ffmpeg โดยตั้งเป้า:

- Integrated loudness: -18 LUFS
- True peak: -1 dBTP
- Loudness range: 7 LU
- Output: mono 24 kHz, 64 kbps MP3

สคริปต์ไม่เขียนทับต้นฉบับ ต้องฟังสุ่มตรวจและเปรียบเทียบก่อนนำ output มาแทน assets จริง

## ไฟล์ที่แก้หรือเพิ่ม

- `fun-english-journey/index.html`
- `fun-english-journey/css/style.css`
- `fun-english-journey/js/engine.js`
- `tools/normalize-audio-copy.sh`
- `audio-microphone-settings-handoff-for-claude.md`

## สิ่งที่ยังต้องทดสอบบนอุปกรณ์จริง

1. iPad Safari แบบแท็บปกติ
2. iPad ที่เพิ่มเว็บไว้หน้า Home Screen
3. Safari ขณะเปิดและปิด Siri
4. Permission สถานะ Ask, Allow และ Deny
5. สลับแอปหรือดับหน้าจอระหว่างเสียงกำลังเล่น
6. เปลี่ยนบทก่อน MP3 โหลดเสร็จ
7. กดเสียงหลายครั้งเร็ว ๆ
8. เสียบ/ถอดหูฟังหรือ Bluetooth ระหว่างใช้งาน
9. ปิด autoplay แล้วตรวจว่าทุกกิจกรรมยังทำต่อได้
10. อัดเสียงได้แต่ Speech Recognition ไม่พร้อม

## Acceptance Criteria

- เสียงจากหน้าเก่าไม่เริ่มหรือเล่นต่อหลังเปลี่ยนหน้า
- SFX ไม่ซ้อนแบบควบคุมไม่ได้
- slider มีผลกับเสียงใหม่ทุกประเภทที่โปรแกรมควบคุมได้
- ปิด autoplay แล้วไม่มีเสียงบทเรียนเริ่มเอง
- ปฏิเสธไมโครโฟนแล้วข้ามกิจกรรมได้
- level meter ขยับเมื่อไมโครโฟนรับเสียง
- อัดเสียงได้แต่ Speech Recognition ไม่รองรับ ต้องแสดงว่า “อัดได้ แต่ให้คะแนนอัตโนมัติไม่ได้”
- เมื่อแอปเข้า background ไม่มี media track ค้าง
- ไม่มี Blob URL เก่าสะสมจากการทดสอบซ้ำ

## หมายเหตุสำหรับ Claude

- อย่ารวมค่าการตั้งค่าเข้ากับ IndexedDB profile จนกว่าจะมีแผน migration ชัดเจน
- อย่าเรียก transcript similarity ว่า “คะแนนสำเนียง” เพราะเป็นเพียงความตรงของคำที่ระบบรู้จำ
- Safari ต้องมี user gesture สำหรับการเล่นเสียงในหลายสถานการณ์ จึงควรรักษาปุ่มเล่นเสียงแบบ manual ไว้เสมอ
- Speech Recognition บน Safari อาจต้องเปิด Siri; MediaRecorder และ Speech Recognition ต้องแสดงสถานะแยกกัน
- ก่อนแทนไฟล์เสียงจำนวนมาก ต้องทำ loudness report ก่อนและเก็บต้นฉบับไว้
