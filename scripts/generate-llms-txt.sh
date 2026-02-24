#!/usr/bin/env bash
set -euo pipefail

DIST="docs/.vitepress/dist"

cat > "$DIST/llms.txt" <<'HEADER'
# Remundo Platform Documentation

> Public documentation for the Remundo platform.
> Published at https://dev.docs.remundo.com

Raw markdown files are available at /md/{path}.
For example: /md/sites/platform/pages/client/dashboard.md

## Contents

HEADER
tree -I '.vitepress|index.md' --noreport docs >> "$DIST/llms.txt"
