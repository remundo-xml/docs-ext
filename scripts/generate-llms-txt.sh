#!/usr/bin/env bash
# Generates llms.txt from the markdown files in sites/platform/pages

set -euo pipefail

PAGES_DIR="sites/platform/pages"
OUT="$PAGES_DIR/.vitepress/dist/llms.txt"

cat > "$OUT" <<'HEADER'
# Remundo Platform Documentation

> Remundo platform documentation covering client, worker, and common pages.
HEADER

for section in client worker common; do
  dir="$PAGES_DIR/$section"
  [ -d "$dir" ] || continue

  title="$(echo "$section" | sed 's/./\U&/')"
  printf '\n## %s Pages\n\n' "$title" >> "$OUT"

  find "$dir" -name '*.md' | sort | while read -r file; do
    rel="${file#$PAGES_DIR/}"
    # Read the first H1 heading as the label, fall back to filename
    label=$(grep -m1 '^# ' "$file" | sed 's/^# //' || true)
    if [ -z "$label" ]; then
      label=$(basename "$file" .md)
    fi
    printf -- '- [%s](/md/%s)\n' "$label" "$rel" >> "$OUT"
  done
done
