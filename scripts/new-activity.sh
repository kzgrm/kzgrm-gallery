#!/bin/sh
set -e

usage() {
  echo "Usage: $0 <activity-name>"
  echo "       $0 <YYMMDD> <activity-name>"
  echo "  e.g. $0 関西けもケット11"
  echo "       $0 250530 関西けもケット11"
  exit 1
}

# 引数が6桁数字なら日付指定あり
if [ $# -eq 2 ] && echo "$1" | grep -qE '^[0-9]{6}$'; then
  DATE="$1"
  NAME="$2"
  FULL_DATE="20${DATE%????}-${DATE#??}" # 250530 → 2025-05-30
  FULL_DATE=$(echo "$DATE" | sed 's/\(..\)\(..\)\(..\)/20\1-\2-\3/')
elif [ $# -eq 1 ]; then
  DATE=$(date +%y%m%d)
  NAME="$1"
  FULL_DATE=$(date +%Y-%m-%d)
else
  usage
fi

if [ -z "$NAME" ]; then
  usage
fi

SLUG="${DATE}-${NAME}"
DIR="src/content/activities/${SLUG}"

if [ -d "$DIR" ]; then
  echo "Error: $DIR already exists"
  exit 1
fi

mkdir -p "$DIR"

cat > "$DIR/index.md" << EOF
---
title: "${NAME}"
date: ${FULL_DATE}
tags: []
thumnail: ./thumbnail.jpeg
---

EOF

echo "Created: $DIR/index.md"
echo "Next: add thumbnail.jpeg and other images to $DIR/"
