# 🎨🔊 ชุดสั่งงานผลิตภาพและเสียง (Asset Production Kit)
**Fun English Journey — ครอบคลุม 16 บทเรียน (ป.3 หน่วย 1–2 / ป.4 หน่วย 1–2)**

> วิธีใช้: ส่วน A ก๊อป prompt ไปใช้กับ AI ภาพ (Midjourney / DALL·E / Firefly ฯลฯ)
> ส่วน B เป็นสคริปต์เสียงสำหรับ AI เสียง (ElevenLabs ฯลฯ)
> ตั้งชื่อไฟล์ตามกฎในแต่ละส่วน แล้วส่งกลับมา ผมจะเขียนโค้ดเสียบเข้าแอปให้เอง

## 📦 สรุปจำนวนงานทั้งชุด

| ประเภท | จำนวน |
|---|---|
| ภาพ Character Sheet | 4 ตัวละคร (ทำก่อนทุกอย่าง) |
| ภาพคำศัพท์ | 128 ภาพ (16 บท × 8 คำ) |
| ภาพฉากเปิดบทเรียน | 16 ภาพ |
| เสียงคำศัพท์ EN | 128 ไฟล์ |
| เสียงคำแปล TH | 128 ไฟล์ |
| เสียงประโยคฝึกพูด EN | 64 ไฟล์ |
| เสียงประโยคเปิดบท EN + TH | 16 + 16 ไฟล์ |
| เสียงเอฟเฟกต์ | 10 ไฟล์ |

---

# ส่วน A — งานภาพ 🎨

## A1. สไตล์กลาง (ต่อท้าย prompt ทุกภาพ)

```
, flat cartoon illustration for children, thick clean outlines, bright pastel colors,
rounded friendly shapes, simple composition, plain white background, no text, no letters
```

**ขนาดไฟล์:** ภาพศัพท์ 512×512 PNG (พื้นหลังโปร่งใสถ้าทำได้) · ฉากเปิดบท 1024×768

## A2. Character Sheets (ทำก่อน — ใช้เป็นภาพอ้างอิงให้หน้าตาคงที่)

**A2.1 Ducky 🦆 (ตัวเอก)**
```
Character sheet of a cute little yellow duckling named Ducky, wearing a small red backpack,
big curious eyes, cheerful smile, standing upright like a cartoon character,
multiple poses: waving hello, jumping happily, thinking, giving thumbs up,
multiple emotions: happy, surprised, sleepy, proud
```
**A2.2 Mali 🐘 (เพื่อนซี้ ผู้ช่วยภาษาไทย)**
```
Character sheet of a cute small pink-grey elephant girl named Mali, wearing a Thai student
uniform with a blue skirt, kind gentle eyes, warm smile, holding a small book,
multiple poses: explaining with trunk raised, clapping, hugging, pointing at a blackboard,
multiple emotions: happy, encouraging, giggling, thoughtful
```
**A2.3 Teacher Owl 🦉**
```
Character sheet of a wise friendly owl teacher wearing round glasses and a graduation cap,
holding a wooden pointer stick, standing on a small branch podium,
poses: teaching, nodding approvingly, holding a gold star, reading a book
```
**A2.4 Grumpy Cat 🐱 (ตัวป่วน)**
```
Character sheet of a chubby mischievous orange cat with a tiny frown that hides a good heart,
poses: sneaking on tiptoe, hiding behind a box, laughing, surprised caught in the act
```

## A3. ภาพฉากเปิดบทเรียน (16 ภาพ · 1024×768)

**กฎชื่อไฟล์:** `{lessonId}-scene.png` เช่น `p3u1l1-scene.png`

| ไฟล์ | ฉาก (ใส่ต่อด้วยสไตล์กลาง A1) |
|---|---|
| p3u1l1-scene | Ducky the duckling waking up in a cozy bedroom, morning sunlight through window, alarm clock ringing |
| p3u1l2-scene | Ducky and Mali the elephant studying happily in a colorful forest classroom, owl teacher at blackboard |
| p3u1l3-scene | Ducky doing homework at home while Mali feeds a happy puppy, warm afternoon light |
| p3u1l4-scene | Ducky in pajamas being tucked into bed, mother duck reading a bedtime story, moon and stars outside |
| p3u2l1-scene | Ducky and Mali looking up at a giant friendly clock tower in a big city, morning sky |
| p3u2l2-scene | Ducky pointing excitedly at a big alarm clock showing seven, Mali checking her wristwatch |
| p3u2l3-scene | A cute daily schedule board with pictures, Ducky placing a star sticker on playtime |
| p3u2l4-scene | Ducky and Mali running happily to catch a school bus, clock tower showing eight in background |
| p4u1l1-scene | Ducky riding a bicycle proudly at a colorful fair, Mali cheering, ferris wheel in background |
| p4u1l2-scene | Talent fair booths: a cat playing guitar, a rabbit doing a magic trick, Ducky taking photos |
| p4u1l3-scene | Animals showing talents: bird flying, dolphin swimming, owl with night sky, chameleon changing color |
| p4u1l4-scene | Ducky on a festival stage under spotlight, audience of animal friends clapping and cheering |
| p4u2l1-scene | Sports day at the fair: animals playing football, basketball and badminton on a green field |
| p4u2l2-scene | Action scene: Ducky kicking a ball, Mali catching, rabbit skipping rope, crowd cheering |
| p4u2l3-scene | Team huddle: owl coach with whistle talking to Ducky and Mali in red team shirts |
| p4u2l4-scene | Exciting race finish: Ducky and friends crossing a finish line ribbon together, confetti |

## A4. ภาพคำศัพท์ (128 ภาพ · 512×512)

**กฎชื่อไฟล์:** `{lessonId}-vocab-{คำศัพท์เปลี่ยนช่องว่างเป็นขีด}.png`
เช่น `p3u1l1-vocab-wake-up.png`, `p4u1l2-vocab-play-the-guitar.png` (ตัดเครื่องหมาย ' ออก)

**วิธีเขียน prompt:** เอา "คำอธิบายภาพ" ในตาราง + สไตล์กลาง A1 · ถ้าเป็นท่าทางให้ใช้ Ducky เป็นแบบ

### ป.3 หน่วย 1
| บท | คำศัพท์ | คำอธิบายภาพ |
|---|---|---|
| p3u1l1 | wake up | Ducky stretching arms in bed, alarm clock ringing |
| p3u1l1 | take a shower | Ducky in a shower with bubbles and water drops |
| p3u1l1 | brush my teeth | Ducky brushing teeth with a big toothbrush, toothpaste foam |
| p3u1l1 | wash my face | Ducky splashing water on face at a sink |
| p3u1l1 | get dressed | Ducky putting on a cute school shirt |
| p3u1l1 | comb my hair | Ducky combing feathers on head with a small comb, mirror |
| p3u1l1 | eat breakfast | Ducky eating fried egg and toast at a table |
| p3u1l1 | go to school | Ducky with red backpack walking toward a school building |
| p3u1l2 | study English | open English textbook with ABC letters, pencil |
| p3u1l2 | read a book | Ducky reading a big storybook happily |
| p3u1l2 | write | Ducky writing in a notebook with a pencil |
| p3u1l2 | listen to the teacher | Ducky sitting attentively, owl teacher talking |
| p3u1l2 | sing a song | Ducky singing with music notes floating around |
| p3u1l2 | draw a picture | Ducky drawing a rainbow with crayons |
| p3u1l2 | play with friends | Ducky and Mali playing ball together, laughing |
| p3u1l2 | eat lunch | lunch tray with noodle bowl and fruit |
| p3u1l3 | go home | Ducky walking toward a cozy house, afternoon sun |
| p3u1l3 | do homework | Ducky concentrating on homework at a desk |
| p3u1l3 | play games | Ducky holding a game controller, excited |
| p3u1l3 | watch TV | Ducky and Mali sitting on a sofa watching cartoon on TV |
| p3u1l3 | help my mom | Ducky sweeping the floor with a broom, mother duck smiling |
| p3u1l3 | feed the dog | Ducky pouring food into a happy puppy's bowl |
| p3u1l3 | take a bath | Ducky in a bathtub with rubber toy and bubbles |
| p3u1l3 | eat dinner | family of ducks eating rice dinner together at table |
| p3u1l4 | put on pajamas | Ducky wearing cute star-pattern pajamas |
| p3u1l4 | read a bedtime story | mother duck reading a glowing storybook to Ducky in bed |
| p3u1l4 | hug my mom and dad | Ducky hugging mother and father duck warmly |
| p3u1l4 | say goodnight | Ducky waving goodnight at bedroom door, sleepy eyes |
| p3u1l4 | turn off the light | Ducky reaching for a lamp switch, room half dark |
| p3u1l4 | go to bed | Ducky climbing into a cozy bed with blanket |
| p3u1l4 | sleep tight | Ducky sleeping peacefully with a teddy bear, zzz |
| p3u1l4 | have a good dream | sleeping Ducky with a dream bubble of rainbow and candy |

### ป.3 หน่วย 2
| บท | คำศัพท์ | คำอธิบายภาพ |
|---|---|---|
| p3u2l1 | clock | a friendly round wall clock with smiling face |
| p3u2l1 | watch | a cute wristwatch with colorful strap |
| p3u2l1 | morning | sunrise over hills with rooster |
| p3u2l1 | afternoon | bright sun high in blue sky over a park |
| p3u2l1 | evening | orange sunset sky with silhouette trees |
| p3u2l1 | night | dark blue night sky with moon and stars |
| p3u2l1 | early | rooster crowing at sunrise, Ducky jumping out of bed |
| p3u2l1 | late | Ducky running with toast in mouth, clock showing late time |
| p3u2l2 | o'clock | big clock showing exactly seven with sparkle |
| p3u2l2 | half past | clock showing six thirty highlighted |
| p3u2l2 | hour | hourglass with sand flowing |
| p3u2l2 | minute | stopwatch ticking with motion lines |
| p3u2l2 | alarm clock | classic red alarm clock ringing with bells |
| p3u2l2 | noon | sun directly overhead, Ducky eating lunch |
| p3u2l2 | midnight | clock showing twelve at night, moon and sleeping town |
| p3u2l2 | time | calendar and clock together |
| p3u2l3 | breakfast time | pancakes with syrup and morning sun |
| p3u2l3 | school time | school bell ringing, children walking in |
| p3u2l3 | lunch time | cute lunch box with rice and vegetables |
| p3u2l3 | playtime | Ducky flying a kite in a park |
| p3u2l3 | snack time | cookies and milk glass |
| p3u2l3 | homework time | notebook, pencil and small desk lamp |
| p3u2l3 | dinner time | steaming hot pot dinner on family table |
| p3u2l3 | bedtime | Ducky yawning in bed, moon in window |
| p3u2l4 | get up | Ducky sitting up in bed stretching, sunrise |
| p3u2l4 | start school | school bell with number eight clock |
| p3u2l4 | finish school | children cheering leaving school, flag |
| p3u2l4 | come home | Ducky opening home door, welcome mat |
| p3u2l4 | every day | weekly calendar with all days checked |
| p3u2l4 | on time | Ducky arriving as clock strikes, thumbs up |
| p3u2l4 | too late | Ducky running after a departing school bus |
| p3u2l4 | hurry up | Ducky and Mali running fast with motion lines |

### ป.4 หน่วย 1
| บท | คำศัพท์ | คำอธิบายภาพ |
|---|---|---|
| p4u1l1 | swim | Ducky swimming happily in a pool with goggles |
| p4u1l1 | run fast | Ducky running fast with speed lines |
| p4u1l1 | jump high | Ducky jumping high over a small bar |
| p4u1l1 | sing | Ducky singing into a microphone, music notes |
| p4u1l1 | dance | Mali the elephant dancing with sparkles |
| p4u1l1 | ride a bike | Ducky riding a red bicycle with helmet |
| p4u1l1 | play football | Ducky kicking a soccer ball |
| p4u1l1 | draw | Ducky painting on an easel with brush |
| p4u1l2 | cook | father duck in chef hat cooking in a pan |
| p4u1l2 | climb a tree | monkey and Ducky climbing a big tree |
| p4u1l2 | speak English | Ducky with speech bubble saying HELLO |
| p4u1l2 | play the guitar | cat character playing an acoustic guitar |
| p4u1l2 | take a photo | Ducky holding a camera taking a picture |
| p4u1l2 | skate | Ducky on a skateboard with helmet and pads |
| p4u1l2 | do a magic trick | rabbit pulling stars from a magic hat |
| p4u1l2 | make a cake | Ducky and Mali decorating a birthday cake |
| p4u1l3 | fly | white dove flying in blue sky |
| p4u1l3 | hop | cute rabbit hopping with motion arcs |
| p4u1l3 | climb | monkey climbing a coconut tree |
| p4u1l3 | swim fast | dolphin jumping through water waves |
| p4u1l3 | run very fast | cheetah running at full speed |
| p4u1l3 | see at night | owl with big glowing eyes on branch at night |
| p4u1l3 | carry heavy things | elephant carrying big logs with trunk |
| p4u1l3 | change color | chameleon changing from green to pink on branch |
| p4u1l4 | on stage | small festival stage with red curtains and spotlight |
| p4u1l4 | practice | Ducky practicing guitar with sweat drop, determined |
| p4u1l4 | try again | Ducky getting up after falling off bike, determined face |
| p4u1l4 | do my best | Ducky with fist up and fire in eyes, star burst |
| p4u1l4 | win a prize | Ducky holding a golden trophy overhead |
| p4u1l4 | clap | audience of animals clapping hands |
| p4u1l4 | cheer | Mali cheering with pompoms |
| p4u1l4 | smile | Ducky with a big warm smile close-up |
| p4u2l1 | football | classic black and white soccer ball |
| p4u2l1 | basketball | orange basketball bouncing near a hoop |
| p4u2l1 | volleyball | volleyball flying over a net |
| p4u2l1 | badminton | badminton racket and shuttlecock |
| p4u2l1 | table tennis | ping pong paddle and ball on table |
| p4u2l1 | running | Ducky running on a track with number bib |
| p4u2l1 | swimming | Ducky swimming in lanes of a pool |
| p4u2l1 | tug of war | two teams of animals pulling a rope |
| p4u2l2 | kicking | Ducky kicking a ball mid-air |
| p4u2l2 | throwing | Mali throwing a frisbee |
| p4u2l2 | catching | Ducky catching a ball with a glove |
| p4u2l2 | bouncing | rabbit bouncing a basketball |
| p4u2l2 | hitting | cat hitting a ping pong ball with paddle |
| p4u2l2 | skipping | Mali skipping rope happily |
| p4u2l2 | racing | Ducky and rabbit racing side by side to a flag |
| p4u2l2 | cheering | crowd of animals cheering with flags |
| p4u2l3 | ball | colorful playground ball |
| p4u2l3 | racket | tennis racket standing upright |
| p4u2l3 | net | white sports net across a court |
| p4u2l3 | team | group of animal friends in matching red shirts |
| p4u2l3 | coach | owl coach with whistle and clipboard |
| p4u2l3 | player | Ducky in sports uniform with number one |
| p4u2l3 | field | green sports field with white lines |
| p4u2l3 | medal | shiny gold medal with red ribbon |
| p4u2l4 | get ready | Ducky tying shoelaces in racing outfit |
| p4u2l4 | warm up | Mali stretching arms up, exercise pose |
| p4u2l4 | start | traffic light turning green, runners ready |
| p4u2l4 | run the race | animals running a race on track |
| p4u2l4 | finish line | checkered finish line ribbon |
| p4u2l4 | winner | Ducky on podium number one with trophy |
| p4u2l4 | teamwork | Ducky and Mali high-fiving |
| p4u2l4 | have fun | animals celebrating with confetti and balloons |

---

# ส่วน B — งานเสียง 🔊

## B1. สเปกเสียง

| เสียง | ลักษณะ | ใช้กับ |
|---|---|---|
| **EN Model Voice** | เสียงหญิงอบอุ่น สำเนียง US ชัด ช้ากว่าปกติ ~15% | คำศัพท์ EN, ประโยคฝึกพูด, ประโยคเปิดบท EN |
| **TH Mali Voice** | เสียงหญิงไทย นุ่ม เป็นกันเอง พูดช้า ชัดถ้อยชัดคำ | คำแปล TH, ประโยคเปิดบท TH, ประโยคช่วยเหลือ |
| ฟอร์แมต | mp3 128kbps, mono, ตัดหัว-ท้ายเงียบไม่เกิน 0.3 วิ | ทุกไฟล์ |

## B2. กฎชื่อไฟล์

| ประเภท | รูปแบบ | ตัวอย่าง |
|---|---|---|
| ศัพท์ EN | `{lessonId}-vocab-{slug}-en.mp3` | `p4u1l1-vocab-ride-a-bike-en.mp3` |
| คำแปล TH | `{lessonId}-vocab-{slug}-th.mp3` | `p4u1l1-vocab-ride-a-bike-th.mp3` |
| ประโยคพูด | `{lessonId}-speak-{ลำดับ}.mp3` | `p4u1l1-speak-01.mp3` |
| เปิดบท | `{lessonId}-intro-en.mp3` / `-intro-th.mp3` | `p3u1l1-intro-en.mp3` |
| เอฟเฟกต์ | `sfx-{ชื่อ}.mp3` | `sfx-correct.mp3` |

**สคริปต์ศัพท์ EN = คำศัพท์ / สคริปต์ TH = คำแปล** ตามตารางส่วน A4 ได้เลย (ตารางเดียวใช้ทั้งภาพและเสียง)

## B3. สคริปต์ประโยคฝึกพูด (64 ประโยค · EN Model Voice)

| ไฟล์ (speak-01 ถึง 04) | ประโยค |
|---|---|
| p3u1l1 | I wake up at seven. · I take a shower. · I eat breakfast with my family. · I go to school by bus. |
| p3u1l2 | I study English at school. · I listen to the teacher. · I play with my friends. · We sing a song together. |
| p3u1l3 | I go home at four. · I do my homework first. · I help my mom at home. · I eat dinner with my family. |
| p3u1l4 | I put on my pajamas. · Mom reads a bedtime story. · Good night, Mom and Dad. · I sleep tight every night. |
| p3u2l1 | What time is it? · Good morning! · I play in the afternoon. · Do not be late for school. |
| p3u2l2 | It is seven o'clock. · It is half past eight. · My alarm clock rings at six. · It is noon. Time for lunch! |
| p3u2l3 | It is breakfast time. · Playtime is my favorite time. · It is time for homework. · Bedtime is at nine o'clock. |
| p3u2l4 | What time do you get up? · I get up at six o'clock. · School starts at eight. · Hurry up! We are late! |
| p4u1l1 | I can swim. · I can play football. · Can you dance? · Yes, I can. I can dance very well. |
| p4u1l2 | I can speak English. · My friend can play the guitar. · He can do a magic trick. · We can make a cake together. |
| p4u1l3 | A bird can fly. · A fish can swim fast. · An owl can see at night. · I cannot fly, but I can dream! |
| p4u1l4 | I practice every day. · Do not give up. Try again! · I can do it! · Everyone claps and cheers. |
| p4u2l1 | I like football. · Do you play badminton? · Swimming is fun. · Let us play table tennis. |
| p4u2l2 | He is running fast. · She is throwing the ball. · They are cheering loudly. · We are racing to the line. |
| p4u2l3 | I am a football player. · Our team is red team. · The coach helps us practice. · We want to win a medal. |
| p4u2l4 | Ready, set, go! · Warm up before you play. · Teamwork makes us strong. · Winning is fun, but playing is more fun! |

## B4. สคริปต์ประโยคเปิดบท (16 บท × EN/TH)

| บท | EN (Model Voice) | TH (Mali Voice) |
|---|---|---|
| p3u1l1 | Good morning! This is my morning. | เช้าแล้ว! มาดูกันว่าตอนเช้า Ducky ทำอะไรบ้าง |
| p3u1l2 | Welcome to Forest School! What do we do at school? | ถึงโรงเรียนแล้ว! วันนี้เรียนคำที่ใช้ในห้องเรียนนะ |
| p3u1l3 | School is over! What do you do after school? | เลิกเรียนแล้ว! หลังเลิกเรียนหนูทำอะไรบ้าง? |
| p3u1l4 | It is night time. Sweet dreams! | ค่ำแล้ว ก่อนนอนทำอะไรบ้างนะ? บทนี้มีทบทวนทั้งหน่วยด้วย! |
| p3u2l1 | Tick tock! What time is it? | ติ๊กต่อกๆ! วันนี้เรียนคำบอกช่วงเวลาของวันกัน |
| p3u2l2 | It is seven o'clock! Time to wake up! | เจ็ดโมงแล้ว! มาหัดบอกเวลาแบบเต็มชั่วโมงกัน |
| p3u2l3 | Every time has a name! Breakfast time, playtime... | แต่ละช่วงเวลามีชื่อเรียกด้วยนะ มาดูตารางเวลาใน 1 วันกัน |
| p3u2l4 | What time do you wake up? Let us ask and answer! | บทสุดท้ายของหน่วย! ฝึกถาม-ตอบว่าทำอะไรกี่โมง |
| p4u1l1 | What can you do? Let us find out! | หนูทำอะไรได้บ้าง? วันนี้เรียนคำว่า can แปลว่า 'สามารถ' นะ |
| p4u1l2 | Everyone has a special talent! | ทุกคนมีความสามารถพิเศษ! มาดูกันว่าเพื่อนๆ ทำอะไรได้บ้าง |
| p4u1l3 | A bird can fly, but a fish cannot! | สัตว์แต่ละชนิดเก่งไม่เหมือนกัน! เรียน can't = ทำไม่ได้ |
| p4u1l4 | Welcome to the Fair Talent Show! | ถึงเวลาประกวดความสามารถ! บทนี้ทบทวนทั้งหน่วยด้วยนะ |
| p4u2l1 | Sports Day is coming! What sports do you like? | วันกีฬาสีใกล้มาแล้ว! มารู้จักกีฬาชนิดต่างๆ กัน |
| p4u2l2 | Look at the field! Everyone is playing! | ดูที่สนามสิ ทุกคนกำลังเล่นกีฬา! เรียนประโยค 'กำลังทำ' |
| p4u2l3 | A good team needs a good coach! | รู้จักคำเรียกทีม อุปกรณ์ และสถานที่เล่นกีฬากัน |
| p4u2l4 | Today is Sports Day! Ready, set, go! | วันกีฬาสีมาถึงแล้ว! บทสุดท้าย พร้อมทบทวนทั้งหมด |

## B5. เสียงเอฟเฟกต์ (10 ไฟล์ · โทนน่ารัก ไม่ดังตกใจ)

| ไฟล์ | เสียง |
|---|---|
| sfx-correct | เสียงกริ๊งสดใสตอบถูก |
| sfx-wrong | เสียงตุ๊บนุ่มๆ ตอบผิด (ไม่หดหู่) |
| sfx-star | เสียงระยิบระยับได้ดาว |
| sfx-levelup | แตรสั้นเลื่อนเลเวล |
| sfx-click | เสียงป๊อกแตะปุ่ม |
| sfx-match | เสียงป๊อปจับคู่สำเร็จ |
| sfx-record-start | บี๊บสั้นเริ่มอัด |
| sfx-record-stop | บี๊บคู่หยุดอัด |
| sfx-lesson-complete | แฟนแฟร์สั้นจบบทเรียน |
| sfx-perfect | แฟนแฟร์ใหญ่ได้ 3 ดาว |

---

## ✅ ลำดับการผลิตที่แนะนำ
1. Character sheets 4 ตัว → ยืนยันหน้าตาก่อน
2. ภาพศัพท์บท p4u1l1 + เสียงบทเดียวกัน → ส่งมาให้ผมเสียบเข้าแอปเป็นตัวอย่าง 1 บทเต็ม
3. เห็นผลแล้วค่อยผลิตที่เหลือทั้งชุด (จะได้ไม่ต้องแก้ 128 ภาพถ้าสไตล์ไม่ใช่)
