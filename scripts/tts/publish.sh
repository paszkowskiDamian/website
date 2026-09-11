#!/usr/bin/env bash
# Upload essay narration to the R2 bucket the Worker serves from — and only the
# files that actually changed.
#
# Generation happens on this machine (scripts/tts/run.sh). Cloudflare never runs
# the model; it only serves finished mp3s.
#
#   scripts/tts/publish.sh              # upload what's new or changed
#   scripts/tts/publish.sh --dry-run    # say what it would do, upload nothing
#   scripts/tts/publish.sh --all        # re-upload everything
#
# How "changed" is decided: R2 sets an object's ETag to the MD5 of its contents
# for a single-part upload, and the Worker passes that ETag through. So a HEAD
# against the live site tells us exactly what is in the bucket, with no download,
# no S3 keys and no local state file that could drift from reality.
#
# First time only, with your Cloudflare account:
#   pnpm wrangler login
#   pnpm wrangler r2 bucket create codeberg-audio
set -euo pipefail

bucket="${R2_AUDIO_BUCKET:-codeberg-audio}"
site="${SITE_URL:-}"
root="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
dir="$root/apps/web/public/audio"
wrangler="$root/node_modules/.bin/wrangler"

mode="incremental"
case "${1:-}" in
  --dry-run) mode="dry" ;;
  --all) mode="all" ;;
  "") ;;
  *) echo "unknown option: $1" >&2; exit 2 ;;
esac

shopt -s nullglob
files=("$dir"/*.mp3)
if [ ${#files[@]} -eq 0 ]; then
  echo "no mp3s in $dir — run scripts/tts/run.sh first" >&2
  exit 1
fi

md5_of() { md5 -q "$1" 2>/dev/null || md5sum "$1" | cut -d' ' -f1; }

# Ask the live site what it already has. Without a reachable SITE_URL we cannot
# know, so we upload everything rather than silently skipping.
remote_etag() {
  [ -n "$site" ] || return 1
  curl -fsI --max-time 10 "$site/audio/$1" 2>/dev/null \
    | awk 'tolower($1)=="etag:"{gsub(/[\r"]/,"",$2); print $2; exit}'
}

if [ -z "$site" ] && [ "$mode" = "incremental" ]; then
  echo "note: SITE_URL not set, so the bucket's current contents are unknown."
  echo "      Uploading everything. Set SITE_URL=https://<your-site> to upload only changes."
  mode="all"
fi

uploaded=0 skipped=0
echo "→ ${#files[@]} narrated essays, bucket $bucket"
for f in "${files[@]}"; do
  key="$(basename "$f")"
  local_md5="$(md5_of "$f")"
  kb=$(( $(stat -f%z "$f" 2>/dev/null || stat -c%s "$f") / 1024 ))

  if [ "$mode" != "all" ]; then
    if [ "$(remote_etag "$key" || true)" = "$local_md5" ]; then
      echo "  = $key"
      skipped=$((skipped + 1))
      continue
    fi
  fi

  if [ "$mode" = "dry" ]; then
    echo "  + $key (${kb} KB) — would upload"
    uploaded=$((uploaded + 1))
    continue
  fi

  echo "  + $key (${kb} KB)"
  "$wrangler" r2 object put "$bucket/$key" \
    --file "$f" \
    --content-type audio/mpeg \
    --remote >/dev/null
  uploaded=$((uploaded + 1))
done

verb="uploaded"
[ "$mode" = "dry" ] && verb="would upload"
echo
echo "$uploaded $verb, $skipped unchanged"
