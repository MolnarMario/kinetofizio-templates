#!/usr/bin/env bash
# Usage: bash shot.sh <url> <out.png> <width> <height>
# Headless Chrome screenshot of the first <width>x<height> pixels. Each run gets its own temporary
# profile, so several agents can take screenshots at the same time.
# Windows keeps headless windows at least ~500 px wide, so for a 390 px phone view load m.html
# (see SKILL.md) at a wider window. Set CHROME if Chrome lives somewhere else.
CHROME="${CHROME:-/c/Program Files/Google/Chrome/Application/chrome.exe}"
[ $# -eq 4 ] || { echo "usage: bash shot.sh <url> <out.png> <width> <height>" >&2; exit 1; }
P="$(mktemp -d)"
PW="$(cygpath -w "$P" 2>/dev/null || echo "$P")"
OUT="$(cygpath -w "$2" 2>/dev/null || echo "$2")"
rm -f "$2"
"$CHROME" --headless=new --disable-gpu --hide-scrollbars --user-data-dir="$PW" --virtual-time-budget=6000 \
  --window-size="$3,$4" --screenshot="$OUT" "$1" >/dev/null 2>&1
rm -rf "$P"
[ -s "$2" ] && echo "$2" || { echo "no screenshot written for $1" >&2; exit 1; }
