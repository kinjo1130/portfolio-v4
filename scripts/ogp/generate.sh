#!/usr/bin/env bash
# public/ogp.png (1200×630) を scripts/ogp/ogp.html から再生成する
set -euo pipefail
cd "$(dirname "$0")"

CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"

"$CHROME" \
  --headless=new \
  --disable-gpu \
  --hide-scrollbars \
  --force-device-scale-factor=1 \
  --window-size=1200,630 \
  --virtual-time-budget=10000 \
  --screenshot=../../public/ogp.png \
  "file://$(pwd)/ogp.html"

echo "generated: public/ogp.png"
