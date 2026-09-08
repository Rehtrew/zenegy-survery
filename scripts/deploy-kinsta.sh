#!/usr/bin/env bash
#
# Deploy the survey to Kinsta over SSH.
#
#   npm run deploy            build, then upload
#   npm run deploy -- --dry   show what would change, upload nothing
#   npm run deploy -- --schema  also create/patch the database table first
#
# Connection details come from the environment so nothing about the host lives
# in the repo; the defaults below match the Zenegy.com site. Authentication is by
# SSH key — no password is ever read, stored or typed by this script.
set -euo pipefail

HOST="${KINSTA_SSH_HOST:-34.90.140.185}"
PORT="${KINSTA_SSH_PORT:-25219}"
USER="${KINSTA_SSH_USER:-zenegycomwebsite}"
KEY="${KINSTA_SSH_KEY:-$HOME/.ssh/zenegy_kinsta_ed25519}"
REMOTE="${KINSTA_REMOTE_PATH:-/www/zenegycomwebsite_223/public/markeds-undersoegelse}"

DRY=""
SCHEMA=""
for arg in "$@"; do
  case "$arg" in
    --dry|--dry-run) DRY="--dry-run" ;;
    --schema) SCHEMA="1" ;;
    *) echo "Unknown option: $arg" >&2; exit 2 ;;
  esac
done

cd "$(dirname "$0")/.."

if [ ! -f dist/index.html ] || [ ! -f dist/api.php ]; then
  echo "dist/ is not built — running the build first."
  npm run build:kinsta
fi

SSH_CMD="ssh -i $KEY -p $PORT -o BatchMode=yes"

if [ -n "$SCHEMA" ]; then
  echo "→ Applying kinsta/schema.sql (CREATE TABLE IF NOT EXISTS, survey_ tables only)"
  if [ -n "$DRY" ]; then
    echo "  (dry run — skipped)"
  else
    $SSH_CMD "$USER@$HOST" "cd $(dirname "$REMOTE") && wp db query" < kinsta/schema.sql
    echo "  done"
  fi
fi

echo "→ Uploading dist/ to $USER@$HOST:$REMOTE"
# --delete keeps the folder equal to dist/. The folder belongs to the survey and
# holds nothing else, so a stale file from an older build can't linger.
rsync -avz --delete $DRY -e "$SSH_CMD" dist/ "$USER@$HOST:$REMOTE/"

if [ -z "$DRY" ]; then
  URL="${KINSTA_PUBLIC_URL:-https://zenegy.com/$(basename "$REMOTE")}"
  echo "→ Health check: $URL/api.php"
  curl -fsS "$URL/api.php" && echo
  echo "→ Survey: $URL/"
fi
