#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
K8S_DIR="$ROOT_DIR/k8s"
SITE_DIR="$K8S_DIR/site"
KUBECTL_BIN="${KUBECTL_BIN:-microk8s kubectl}"
NODE_BIN="${NODE_BIN:-node}"

FILES=(
  "index.html"
  "artist.html"
  "artists.html"
  "news.html"
  "gallery-data.js"
  "script.js"
  "artist-page.js"
  "artists-page.js"
  "news-page.js"
  "styles.css"
)

usage() {
  cat <<'EOF'
Usage: ./sync-k8s-site.sh [--sync-only] [--no-restart]

Regenerates gallery-data.js from artifacts/, copies the root site files and
artifacts into k8s/site, applies the k8s manifests, and restarts the art-app
deployment.

Options:
  --sync-only   Copy files into k8s/site but do not apply manifests
  --no-restart  Apply manifests without restarting the deployment
  --help        Show this help text

Environment:
  NODE_BIN     Override the node command. Default: "node"
  KUBECTL_BIN   Override the kubectl command. Default: "microk8s kubectl"
EOF
}

SYNC_ONLY=false
RESTART_DEPLOYMENT=true

while (($# > 0)); do
  case "$1" in
    --sync-only)
      SYNC_ONLY=true
      ;;
    --no-restart)
      RESTART_DEPLOYMENT=false
      ;;
    --help|-h)
      usage
      exit 0
      ;;
    *)
      echo "Unknown argument: $1" >&2
      usage >&2
      exit 1
      ;;
  esac
  shift
done

mkdir -p "$SITE_DIR"

echo "Generating gallery-data.js from artifacts/"
"$NODE_BIN" "$ROOT_DIR/scripts/generate-gallery-data.mjs"

for file in "${FILES[@]}"; do
  if [[ ! -f "$ROOT_DIR/$file" ]]; then
    echo "Missing source file: $ROOT_DIR/$file" >&2
    exit 1
  fi

  cp "$ROOT_DIR/$file" "$SITE_DIR/$file"
  echo "Synced $file"
done

if [[ -d "$ROOT_DIR/artifacts" ]]; then
  rm -rf "$SITE_DIR/artifacts"
  cp -R "$ROOT_DIR/artifacts" "$SITE_DIR/artifacts"
  echo "Synced artifacts/"
fi

if [[ "$SYNC_ONLY" == true ]]; then
  echo "Sync complete. Skipped Kubernetes apply."
  exit 0
fi

echo "Applying manifests from $K8S_DIR"
$KUBECTL_BIN apply -k "$K8S_DIR"

if [[ "$RESTART_DEPLOYMENT" == true ]]; then
  echo "Restarting deployment/art-app"
  $KUBECTL_BIN -n art-app rollout restart deployment/art-app
  $KUBECTL_BIN -n art-app rollout status deployment/art-app --timeout=180s
fi

echo "Done."
