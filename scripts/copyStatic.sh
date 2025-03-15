#!/bin/bash
mkdir -p dist 
cp src/manifest.json dist/
cp src/*.css dist/
cp src/popup/*.html dist/popup/
cp src/assets/* build/assets/ 2>/dev/null || :
