#!/bin/sh
# Builds the folder to upload to free hosting (Netlify Drop, GitHub Pages, Cloudflare Pages).
cd "$(dirname "$0")/.." || exit 1
rm -rf site && mkdir -p site
rsync -a --include='/index.html' --include='/styles.css' --include='/*.js' --include='/manifest.webmanifest' \
  --include='/data/***' --include='/vendor/***' --include='/icons/***' --exclude='*' ./ site/
echo "Ready: $(pwd)/site  — drag this folder onto https://app.netlify.com/drop"
