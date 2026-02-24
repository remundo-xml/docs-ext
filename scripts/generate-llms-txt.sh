#!/usr/bin/env bash
set -euo pipefail

DIST="docs/.vitepress/dist"

cat > "$DIST/llms.txt" <<'HEADER'
# Remundo Platform Documentation

Raw markdown files are available at /md/{path}, e.g. /md/sites/platform/pages/client/dashboard.md

HEADER
tree -I '.vitepress|index.md' --noreport docs >> "$DIST/llms.txt"
