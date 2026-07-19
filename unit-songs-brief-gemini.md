# 🎵 คอนเซปต์เพลงประจำหน่วย — สำหรับส่งต่อให้ Gemini แต่งเนื้อเพลง/สร้างเพลง
**Fun English Journey — 48 เพลงหลัก (ป.1-6 × 8 หน่วย) + 2 เพลงโบนัสอนุบาล**

> วิธีใช้: copy "Prompt แม่แบบ" ด้านล่าง + แถวคอนเซปต์ของเพลงที่ต้องการจากตาราง วางให้ Gemini ทีละเพลง
> คำ/วลีในคอลัมน์ "คำที่ต้องมี" ดึงมาจากไฟล์บทเรียนจริง (`fun-english-journey/data/*.json`) — เด็กเรียนคำเหล่านี้ในแอปอยู่แล้ว เพลงจะช่วยตอกย้ำ ไม่ใช่สอนคำใหม่

## 1. สเปกกลางทุกเพลง

| หัวข้อ | สเปก |
|---|---|
| ความยาว | 60-90 วินาที (สั้น จบไว ฟังซ้ำได้ไม่เบื่อ) |
| โครงเพลง | Intro สั้น → Verse 1 → Chorus → Verse 2 → Chorus ×2 → จบ |
| ท่อนฮุค | ต้องมี "โครงสร้างเป้าหมาย" ของหน่วยซ้ำอย่างน้อย 3 รอบต่อเพลง |
| เนื้อร้อง | อังกฤษล้วน คำง่ายระดับเดียวกับบทเรียน ประโยคสั้น ร้องตามได้ |
| เสียงร้อง | เสียงเด็ก/ผู้หญิงโทนอบอุ่นสดใส ออกเสียงชัดช้ากว่าเพลงปกติเล็กน้อย |
| จังหวะ | ป.1-2: 88-104 BPM · ป.3-4: 100-116 BPM · ป.5-6: 108-124 BPM |
| ⚠️ ลิขสิทธิ์ | เนื้อร้อง+ทำนองต้องออริจินัล 100% ห้ามอิงทำนอง/ท่อนจากเพลงเด็กที่มีอยู่ (Twinkle Twinkle, Baby Shark ฯลฯ) และห้ามใช้วลีชื่อเพลงดังเช่น "We Are the Champions" |
| ไฟล์ส่งมอบ | mp3 128kbps ตั้งชื่อ `unit-song-{รหัสหน่วย}.mp3` เช่น `unit-song-p1u1.mp3` วางที่ `assets/audio/` |

## 2. Prompt แม่แบบ (วางให้ Gemini พร้อมแถวคอนเซปต์ 1 แถว)

```
ช่วยแต่งเพลงเด็กสำหรับแอปสอนภาษาอังกฤษเด็กไทย ตามคอนเซปต์นี้:
[วางแถวจากตาราง: ชื่อเพลง / สไตล์ / โครงสร้างเป้าหมาย / คำที่ต้องมี / ท่อนฮุคแนะนำ]

ข้อกำหนด:
- เนื้อร้องอังกฤษล้วน ยาว 60-90 วินาที โครง Verse1-Chorus-Verse2-Chorus×2
- ท่อนฮุคต้องใช้ "โครงสร้างเป้าหมาย" ซ้ำ ≥3 รอบ ปรับจากท่อนฮุคแนะนำได้แต่ต้องคงโครงสร้างไวยากรณ์
- ใช้คำจากรายการ "คำที่ต้องมี" ให้ได้มากที่สุด ห้ามใช้คำยากนอกระดับ
- ทำนอง/เนื้อออริจินัล 100% ห้ามอิงเพลงเด็กที่มีอยู่แล้ว
- ตอบกลับเป็น: (1) เนื้อเพลงเต็ม (2) style prompt ภาษาอังกฤษสำหรับ AI สร้างเพลง (แนว, BPM, เครื่องดนตรี, เสียงร้อง)
```

## 3. ตารางคอนเซปต์ 48 เพลง

### 🌻 ป.1 — Ducky's Pond School (แนวเพลง: nursery acoustic, ukulele/เปียโนใส ซน น่ารัก)

| ไฟล์ | ชื่อเพลง | โครงสร้างเป้าหมาย | คำที่ต้องมี | ท่อนฮุคแนะนำ |
|---|---|---|---|---|
| unit-song-p1u1 | What's This? | What's this? It's a... | bag, pen, pencil, desk, chair, apple, teacher | "What's this? What's this? It's a pen! It's a bag!" |
| unit-song-p1u2 | Colors & Numbers | I like (red). / counting 1-10 | red, blue, yellow, circle, square, one-ten, count | "Red and blue and yellow too — one, two, three, I count with you!" |
| unit-song-p1u3 | My Family | This is my... | mom, dad, brother, teacher, doctor, nurse | "This is my mom, this is my dad — my family makes me glad!" |
| unit-song-p1u4 | Jump Run Climb | I have two (eyes). / action verbs | head, eyes, ears, swing, slide, jump, run, climb | "Head and eyes and ears — jump, run, climb with me!" |
| unit-song-p1u5 | I Wear My Shirt | I wear a... | shirt, shorts, shoes, scarf, bedroom, kitchen, house | "I wear my shirt, I wear my shoes — ready for the day!" |
| unit-song-p1u6 | Yummy Lunch Box | I like... / I don't like... | sandwich, apple, banana, sweet, sour, yummy, favorite | "Yummy yummy lunch box — I like this, I love that!" |
| unit-song-p1u7 | My Friend & Me | This is my friend. / I have a... | friend, play, share, dog, cat, lion, elephant, monkey | "This is my friend, we play and share — animals everywhere!" |
| unit-song-p1u8 | Sunny Rainy Day | It is (sunny) today. / I can... | bed, sunny, rainy, cloudy, sea, sand, shell, can | "Sunny, rainy, cloudy day — let's go to the beach today!" |

### 🏙️ ป.2 — Big City (แนวเพลง: kids pop สดใส กลอง+คีย์บอร์ด มีเสียงเมืองประกอบเบาๆ)

| ไฟล์ | ชื่อเพลง | โครงสร้างเป้าหมาย | คำที่ต้องมี | ท่อนฮุคแนะนำ |
|---|---|---|---|---|
| unit-song-p2u1 | This Is My Day | I (brush my teeth) in the morning. | wake up, take a shower, brush my teeth, read a book, do homework | "I wake up, I brush my teeth — this is my day, follow me!" |
| unit-song-p2u2 | Tick Tock Clock | It is (half past six). / What time is it? | clock, morning, o'clock, half past, breakfast time, get up | "Tick tock, tick tock — what time is it? It's eight o'clock!" |
| unit-song-p2u3 | Tall Dad Kind Mom | My (father) is (tall). | father, mother, brother, tall, short, kind, have dinner | "My father is tall, my mother is kind — the best family you'll find!" |
| unit-song-p2u4 | In My House | There is a... in my... | bedroom, kitchen, bed, table, chair, clean the room, big, small | "There is a bed in my bedroom — welcome to my happy home!" |
| unit-song-p2u5 | Sweet Sour Spicy | I like eating... / I eat ... every day | apple, banana, rice, noodles, sweet, sour, spicy, hungry | "Sweet and sour and spicy too — yummy food, I like you!" |
| unit-song-p2u6 | Healthy Me | I (see) with my (eyes). | head, eyes, ears, teeth, exercise, eat vegetables, drink water | "I see with my eyes, I hear with my ears — healthy, healthy me!" |
| unit-song-p2u7 | Animal Friends | The (cow) says (moo). / I have a... | dog, cat, rabbit, cow, pig, horse, feed, walk the dog | "The cow says moo, the cat says meow — sing with the animals now!" |
| unit-song-p2u8 | I Feel Happy | It is (sunny) today. / I feel (happy). | sunny, rainy, cloudy, happy, sad, angry, umbrella | "Sunny day, I feel happy — rainy day, still happy me!" |

### 🎪 ป.3 — Four Seasons Fair (แนวเพลง: carnival folk สนุก แอคคอร์เดียน/เครื่องเป่า บรรยากาศงานวัด)

| ไฟล์ | ชื่อเพลง | โครงสร้างเป้าหมาย | คำที่ต้องมี | ท่อนฮุคแนะนำ |
|---|---|---|---|---|
| unit-song-p3u1 | Yes I Can! | I can (swim). / Can you...? | swim, run fast, jump high, cook, climb, speak English, try again | "I can swim, I can run — I can do it, yes I can!" |
| unit-song-p3u2 | Sports Day | He is (kicking) the ball. (present continuous) | football, basketball, kicking, throwing, catching, warm up | "Kick the ball, throw the ball — it's sports day, give it your all!" |
| unit-song-p3u3 | Ten Baht Please | How much is it? It is ... baht. | market, money, coin, baht, buy, sell, choose, discount | "How much is it? How much is it? Ten baht, ten baht please!" |
| unit-song-p3u4 | I Would Like... | I would like ..., please. | cotton candy, ice cream, popcorn, order, share, taste, festival | "I would like some ice cream, please — fair food time, yippee!" |
| unit-song-p3u5 | Turn Left Turn Right | Turn left. / Go straight. / Where is...? | bank, hospital, post office, turn left, turn right, go straight, excuse me | "Turn left, turn right, go straight ahead — we won't get lost, Ducky said!" |
| unit-song-p3u6 | Bigger Faster Stronger | X is (bigger) than Y. | bigger, smaller, faster, slower, stronger, more than, win, first place | "Bigger, faster, stronger — who will win today?" |
| unit-song-p3u7 | Yesterday Song | I (played) yesterday. (past -ed + irregular) | was, yesterday, played, watched, walked, went, ate, saw | "Yesterday I played, yesterday I ate — what a happy day!" |
| unit-song-p3u8 | Four Seasons | I like (spring) best because... | spring, summer, autumn, winter, plant flowers, collect leaves, warm | "Spring and summer, autumn, winter — which season do you like best?" |

### 🌍 ป.4 — World Explorer Club (แนวเพลง: world-pop ผสมกลิ่นดนตรีนานาชาติ เปลี่ยนสีสันตามหน่วย)

| ไฟล์ | ชื่อเพลง | โครงสร้างเป้าหมาย | คำที่ต้องมี | ท่อนฮุคแนะนำ |
|---|---|---|---|---|
| unit-song-p4u1 | Where Are You From? | Where are you from? I am from... | Thailand, Japan, China, America, Thai, Japanese, country | "Where are you from? Where are you from? I'm from Thailand — welcome, everyone!" |
| unit-song-p4u2 | Amazing Landmarks | This place is famous for... | pyramid, tower, castle, famous for, visit, Grand Palace, Wat Arun | "Pyramids and towers tall — amazing places, see them all!" |
| unit-song-p4u3 | While I Was Reading | I was (reading) while you were (sleeping). | was reading, was eating, was sleeping, while, when, suddenly | "I was reading while you were sleeping — swing rhythm ชิลๆ" |
| unit-song-p4u4 | Best of the Best | This is the (tallest) ... in the world. | biggest, smallest, tallest, best, fastest, strongest, amazing fact | "The biggest, the tallest, the best of the best!" |
| unit-song-p4u5 | Let's Go! | We travel by (airplane). | airplane, ship, train, through, passport, ticket, journey | "By plane, by ship, by train — let's go, let's go again!" |
| unit-song-p4u6 | Festival Time | We celebrate with... | festival, parade, fireworks, Songkran, Loy Krathong, water | "Splash splash Songkran day — festivals around the world, hooray!" |
| unit-song-p4u7 | Save Our Earth | We must/should (recycle). | Earth, ocean, forest, recycle, reduce, reuse, plant a tree, turn off lights | "Reduce, reuse, recycle — together we save our Earth!" |
| unit-song-p4u8 | My Explorer Journal | I am proud of... / คำถาม What is...? | journal, adventure, memory, postcard, souvenir, interview | "My journal, my adventure — memories I'll always treasure!" |

### 🏆 ป.5 — Champion Academy (แนวเพลง: sport anthem/pop-rock เบาๆ กลองหนักขึ้น ปรบมือ สร้างฮึด)

| ไฟล์ | ชื่อเพลง | โครงสร้างเป้าหมาย | คำที่ต้องมี | ท่อนฮุคแนะนำ |
|---|---|---|---|---|
| unit-song-p5u1 | Practice Every Day | I (always) practice... / three times a week | always, usually, sometimes, how often, once a week, warm up | "I always practice, twice a week, three times a week — champion beat!" |
| unit-song-p5u2 | Whose Jersey? | Whose ... is this? It's mine/yours. | gear, jersey, helmet, mine, yours, his, team, uniform | "Whose jersey is this? It's mine, it's mine!" |
| unit-song-p5u3 | Healthy Snack Time | How much...? / How many...? | fruit, vegetable, protein, how much, how many, snack bar, vitamin | "How much? How many? Healthy snacks for me!" |
| unit-song-p5u4 | Rules of the Game | You must... / You mustn't... | rule, must, wear, safety, mustn't, fair, obey | "You must wear your helmet — you mustn't ever cheat!" |
| unit-song-p5u5 | Last Season | There were... / I had... (past) | last year, last season, had, was, were, winner, proud | "Last year we were small — now look at us stand tall!" |
| unit-song-p5u6 | I Will Win | I will... / I won't give up. | will, won't, next season, promise, improve, championship | "I will practice, I will fight — I won't give up, I'll reach new heights!" |
| unit-song-p5u7 | Because I Practice | I ... because ... / ..., so ... | because, reason, why, so, effort, together, unity | "Why do I get stronger? Because I practice longer!" |
| unit-song-p5u8 | Champion's Day | ประโยคฉลอง + thankful/grateful | final match, stadium, award, champion, grateful, success | "Champion's day, we made it all the way!" |

### 🚀 ป.6 — Future & Beyond (แนวเพลง: electro-pop ใส อนาคต ซินธ์เบาๆ มีความฝัน)

| ไฟล์ | ชื่อเพลง | โครงสร้างเป้าหมาย | คำที่ต้องมี | ท่อนฮุคแนะนำ |
|---|---|---|---|---|
| unit-song-p6u1 | My Dream Job | I am going to be a... | doctor, engineer, pilot, dream job, interested in, study hard | "I'm going to be a doctor — I'm going to touch the sky!" |
| unit-song-p6u2 | Weekend Plans | What are you going to do? I'm going to... | go shopping, watch a movie, visit grandma, plan, invite | "What are you going to do this weekend? Tell me, tell me now!" |
| unit-song-p6u3 | You Should Try | You should... / You could... | should, shouldn't, advice, could, try, recommend | "You should try, you could fly — good advice will get you high!" |
| unit-song-p6u4 | Smart Future | อนาคตกับเทคโนโลยี + will | computer, smartphone, robot, smart home, video call, safe | "Smart phone, smart home — the future's coming, we're not alone!" |
| unit-song-p6u5 | I Wonder Why | I wonder how/why... | wonder, explore, discover, invent, experiment, knowledge | "I wonder why, I wonder how — let's discover, here and now!" |
| unit-song-p6u6 | Have You Ever? | Have you ever...? I have... | been, seen, tried, ever, never, already, experience | "Have you ever seen the sea? I have, I have — come with me!" |
| unit-song-p6u7 | Made Of | It is made of... / made in... | made of, wood, glass, made in, factory, handmade, material | "Made of wood, made of glass — made in Thailand, built to last!" |
| unit-song-p6u8 | If I Try My Best | If ..., I will ... (first conditional) | if, then, if it rains, if I win, journey, growth, graduate | "If I try, then I will shine — one more step, the future's mine!" |

## 4. โบนัส 🐣 อนุบาล (2 เพลง — สำคัญมากสำหรับโหมดใหม่)

| ไฟล์ | ชื่อเพลง | คอนเซปต์ | หมายเหตุพิเศษ |
|---|---|---|---|
| unit-song-k-abc | A Says /æ/ | เพลง phonics ตัวอักษร: ร้องไล่ "A says /æ/, /æ/ /æ/ apple!" ครบ a-g (ช่วงที่ pilot เปิดสอน) จังหวะช้า 80-92 BPM เว้นช่องให้เด็กร้องตาม | ⚠️ ต้องออกเสียง phoneme บริสุทธิ์แบบเดียวกับไฟล์เสียงที่มีอยู่ (/æ/ ไม่ใช่ชื่อตัวอักษร "เอ") — แจ้ง Gemini ให้เขียนกำกับ pure phonics sounds ใน style prompt ด้วย |
| unit-song-k-at | The -at Family | เพลงสะกดคำ: "c-a-t, cat! b-a-t, bat!" ครบ cat bat rat hat mat sat จังหวะ chant ปรบมือ | เว้นจังหวะหลังสะกดให้เด็กตะโกนคำเอง เช่น "c-a-t ... (เงียบ 1 จังหวะ) ... CAT!" |

## 5. หมายเหตุการนำเข้าแอป (งานฝั่ง Claude ภายหลัง — ไม่เกี่ยวกับ Gemini)

- ตอนนี้ engine ยังไม่มีปุ่มเล่นเพลง — เมื่อไฟล์ชุดแรกมาถึงจะเพิ่มปุ่ม 🎵 ที่หัวหน่วย (unit-head) ในหน้าแผนที่ให้กดฟังได้
- แนะนำ generate ทีละชั้น (8 เพลง) แล้วลองให้เด็กฟังก่อนลุยชั้นถัดไป — เริ่มจากชั้นของผู้ทดสอบจริง (ป.4) หรือเพลงอนุบาล 2 เพลงที่หนุน pilot ใหม่
- ได้ไฟล์แล้ววางที่ `assets/audio/` ตามชื่อในตาราง แจ้ง Claude ให้ตรวจ+commit+เพิ่มปุ่มเล่นได้เลย
