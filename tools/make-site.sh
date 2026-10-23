#!/bin/sh
# Builds the folder that hosting serves (Netlify runs this automatically; see netlify.toml).
cd "$(dirname "$0")/.." || exit 1
rm -rf site && mkdir -p site
cp index.html styles.css manifest.webmanifest ./*.js site/
cp -R data vendor icons site/
echo "Ready: $(pwd)/site"
