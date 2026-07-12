#!/bin/bash
# แปลง assets/img/**/*.png เป็น .webp (บีบอัด + resize ให้พอดีขนาดที่แสดงจริงบนจอ)
# ไม่ลบ .png ต้นฉบับ — engine.js จะลอง .webp ก่อนแล้ว fallback ไป .png ถ้าเบราว์เซอร์เก่าไม่รองรับ
# รัน: bash tools/optimize-images.sh   (ต้องมี cwebp: brew install webp)
set -euo pipefail
cd "$(dirname "$0")/.."

if ! command -v cwebp &>/dev/null; then
  echo "ไม่พบ cwebp — ติดตั้งก่อนด้วย: brew install webp" >&2
  exit 1
fi

# ขนาดสูงสุดต่อหมวด (2x ของขนาดที่แสดงจริงใน CSS เผื่อจอ retina)
# (ใช้ case แทน associative array เพราะ macOS มาพร้อม bash 3.2 ที่ไม่รองรับ declare -A)
maxdim_for() {
  case "$1" in
    vocab) echo 160 ;;
    characters) echo 200 ;;
    scenes) echo 680 ;;
  esac
}

converted=0
skipped=0
failed=0
total_before=0
total_after=0

for category in vocab characters scenes; do
  dir="assets/img/$category"
  [ -d "$dir" ] || continue
  max="$(maxdim_for "$category")"
  while IFS= read -r -d '' png; do
    webp="${png%.png}.webp"
    if [ -f "$webp" ] && [ "$webp" -nt "$png" ]; then
      skipped=$((skipped+1)); continue
    fi
    before=$(stat -f%z "$png")
    w=$(sips -g pixelWidth "$png" | awk '/pixelWidth/{print $2}')
    h=$(sips -g pixelHeight "$png" | awk '/pixelHeight/{print $2}')
    if [ "$w" -ge "$h" ]; then resize_args="$max 0"; else resize_args="0 $max"; fi
    # ไม่ขยายภาพที่เล็กกว่า max อยู่แล้ว
    if [ "$w" -le "$max" ] && [ "$h" -le "$max" ]; then resize_args="0 0"; fi
    if ! cwebp -quiet -q 82 -resize $resize_args -mt "$png" -o "$webp" 2>/dev/null; then
      echo "  ✗ แปลงไม่สำเร็จ: $png" >&2
      failed=$((failed+1)); continue
    fi
    after=$(stat -f%z "$webp")
    total_before=$((total_before+before))
    total_after=$((total_after+after))
    converted=$((converted+1))
  done < <(find "$dir" -name "*.png" -print0)
done

echo "แปลงแล้ว $converted ไฟล์ (ข้าม $skipped ไฟล์ที่แปลงแล้ว, ล้มเหลว $failed ไฟล์)"
if [ "$converted" -gt 0 ]; then
  before_mb=$((total_before/1024/1024))
  after_mb=$((total_after/1024/1024))
  echo "ขนาดรวม: ${before_mb}MB -> ${after_mb}MB"
fi
