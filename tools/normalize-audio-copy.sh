#!/bin/sh
# สร้างสำเนาเสียงที่ปรับ loudness แล้วในโฟลเดอร์ใหม่ ไม่เขียนทับต้นฉบับ
# ต้องติดตั้ง ffmpeg ก่อนใช้: ./tools/normalize-audio-copy.sh [source] [output]
set -eu

SOURCE_DIR="${1:-assets/audio}"
OUTPUT_DIR="${2:-build/audio-normalized}"

if ! command -v ffmpeg >/dev/null 2>&1; then
  echo "ไม่พบ ffmpeg — ยังไม่มีไฟล์ต้นฉบับใดถูกแก้ไข" >&2
  exit 2
fi

mkdir -p "$OUTPUT_DIR"
find "$SOURCE_DIR" -type f ! -name '._*' \( -name '*.mp3' -o -name '*.wav' \) -print0 |
while IFS= read -r -d '' input; do
  relative="${input#"$SOURCE_DIR"/}"
  output="$OUTPUT_DIR/${relative%.*}.mp3"
  mkdir -p "$(dirname "$output")"
  ffmpeg -nostdin -hide_banner -loglevel error -y -i "$input" \
    -af "loudnorm=I=-18:TP=-1:LRA=7" -ar 24000 -ac 1 -b:a 64k "$output"
done

echo "สร้างสำเนาที่ปรับระดับเสียงแล้วใน $OUTPUT_DIR"
