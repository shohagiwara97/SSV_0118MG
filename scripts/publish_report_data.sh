#!/usr/bin/env bash
set -euo pipefail

src="${1:-}"
if [[ -z "$src" ]]; then
  if ls Data/converted/*.json >/dev/null 2>&1; then
    src=$(ls -t Data/converted/*.json | head -n 1)
  else
    echo "No JSON files found in Data/converted" >&2
    exit 1
  fi
fi

dest="pwa/public/data/report_latest.json"
mkdir -p "$(dirname "$dest")"
cp "$src" "$dest"

echo "Published: $src -> $dest"
