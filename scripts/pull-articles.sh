#!/usr/bin/env bash
# Pull project articles from their single source of truth (a folder outside this
# repo, e.g. a notes vault) into content/projects/. Set ARTICLES_SOURCE_DIR in
# .env.local (gitignored). content/projects/ is a synced copy: edit the source.
set -euo pipefail
cd "$(dirname "$0")/.."

if [[ -f .env.local ]]; then
  # shellcheck disable=SC1091
  set -a; source .env.local; set +a
fi

if [[ -z "${ARTICLES_SOURCE_DIR:-}" ]]; then
  echo "ARTICLES_SOURCE_DIR is not set (add it to .env.local); keeping content/projects/ as is."
  exit 0
fi
if [[ ! -d "$ARTICLES_SOURCE_DIR" ]]; then
  echo "ARTICLES_SOURCE_DIR not found: $ARTICLES_SOURCE_DIR" >&2
  exit 1
fi

rsync -a --delete --exclude ".DS_Store" --exclude "README.md" "$ARTICLES_SOURCE_DIR/" content/projects/
echo "Pulled articles from $ARTICLES_SOURCE_DIR into content/projects/"
