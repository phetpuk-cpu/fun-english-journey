# P2 Image Production Handoff

Updated: 2026-07-15 (Asia/Bangkok)

## Current inventory

- Vocabulary images: **104/256 complete**; **152 missing**.
- Lesson scene images: **32/32 complete**.
- Count only production PNG files whose names match the lesson JSON. Ignore `._*` and `*preview*` files.
- Vocabulary filename rule: `<lesson-id>-vocab-<slug>.png`, using lowercase words, removing apostrophes, replacing non-alphanumeric runs with `-`, and trimming leading/trailing `-`.

| Unit | Vocabulary status | Notes |
|---|---:|---|
| P2 Unit 1 | 0/32 | Not started |
| P2 Unit 2 | 0/32 | Not started |
| P2 Unit 3 | 32/32 | Complete |
| P2 Unit 4 | 32/32 | Complete |
| P2 Unit 5 | 32/32 | Complete |
| P2 Unit 6 | 8/32 | Lesson 1 complete; Lessons 2-4 not started |
| P2 Unit 7 | 0/32 | Not started |
| P2 Unit 8 | 0/32 | Not started |

## Work completed in this session

The prior P2 session stopped after creating six of eight images in `p2u6l1` (`head`, `eyes`, `ears`, `nose`, `mouth`, and `hands`). This session added the two missing images and completed P2 Unit 6 Lesson 1:

- `assets/img/vocab/p2u6l1-vocab-legs.png` and `.webp`
- `assets/img/vocab/p2u6l1-vocab-feet.png` and `.webp`

Both new PNG files are 1086 × 1448 pixels (3:4 portrait), matching the recent P2 production dimensions.

## Important visual rule from the project owner

- **Human body-part vocabulary must use human anatomy**, not Ducky anatomy. This prevents learners from confusing a duck's body parts with human body-part words.
- Ducky may be used for actions, objects, situations, emotions, and other concepts only when the character will not make the vocabulary meaning ambiguous.
- For human body parts, use a friendly school-age Thai/Asian child, warm off-white background, clean educational composition, soft child-friendly semi-realistic shading, no text, and no watermark.
- Apply the same human-anatomy rule to upcoming Unit 6 vocabulary such as `hair`, `teeth`, `tongue`, and `finger`.

## Next safe production queue

Continue with **P2 Unit 6 Lesson 2**, in this order, as small batches to reduce heat and simplify quality control:

1. `hair`
2. `teeth`
3. `tongue`
4. `finger`
5. `see`
6. `hear`
7. `smell`
8. `taste`

Recommended batch size: 2-4 images, then pause and visually verify anatomy, filename, dimensions, and concept clarity before continuing.

## Source-of-truth notes

- Curriculum data: `fun-english-journey/data/p2u1.json` through `p2u8.json`.
- Production descriptions for this curriculum are in `asset-production-kit-batch2.md`, but the document uses the old `p3` prefix. Map old `p3u*` descriptions to current `p2u*` filenames.
- Never overwrite an existing production image unless replacement is explicitly approved.
