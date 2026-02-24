#!/usr/bin/env bash
set -euo pipefail

DIST="sites/platform/pages/.vitepress/dist"

echo "# Remundo Platform Documentation" > "$DIST/llms.txt"
echo "" >> "$DIST/llms.txt"
tree -I '.vitepress|index.md' --noreport sites/platform/pages >> "$DIST/llms.txt"
