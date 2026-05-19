#!/bin/bash
# Removes known temporary/generated artifacts from the project root.
# Safe to run anytime — only targets files that are never committed.

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

PATTERNS=(
  # QA test dump files
  "t[0-9]*.json"
  "t[0-9]*[ab].json"
  "meta.json"
  "res[0-9]*.json"
  # Log files
  "*.log"
  "*.err.log"
  # Codex dev artifacts
  ".codex-local-dev.log"
  ".countryform.tmp.txt"
  "frontend-e2e.log"
  "prod-start.log"
  "prod-start.err.log"
  "prod3003-start.log"
  "prod3003-start.err.log"
  # Stray nul file (Windows artifact)
  "nul"
)

deleted=0
for pattern in "${PATTERNS[@]}"; do
  # Only match in root, not recursively
  for file in $ROOT/$pattern; do
    if [ -f "$file" ]; then
      rm -f "$file"
      echo "Deleted: $(basename "$file")"
      deleted=$((deleted + 1))
    fi
  done
done

if [ "$deleted" -eq 0 ]; then
  echo "Nothing to clean up."
else
  echo ""
  echo "Cleaned $deleted file(s)."
fi
