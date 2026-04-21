#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/.." && pwd)"
SOURCE_DIR="$ROOT_DIR/artifacts"
CONTAINER_NAME="${CONTAINER_NAME:-}"
ACCOUNT_NAME="${ACCOUNT_NAME:-}"
SUBSCRIPTION_ID="${SUBSCRIPTION_ID:-}"
TF_DIR="${TF_DIR:-$ROOT_DIR/infra/terraform/nonprod}"

usage() {
  cat <<'EOF'
Usage: ./scripts/upload-nonprod-artifacts.sh --account-name <storage-account> [options]

Uploads the local artifacts/ tree to the nonprod Azure Blob container used by the
art-app website.

Options:
  --account-name <name>   Azure Storage account name. Required unless ACCOUNT_NAME is set.
  --container <name>      Blob container name. Default: art-app-artifacts
  --subscription <id>     Azure subscription to target before upload
  --source <path>         Source directory to upload. Default: ./artifacts
  --tf-dir <path>         Terraform directory used to read default outputs
  --help                  Show this help text

Environment:
  ACCOUNT_NAME            Same as --account-name
  CONTAINER_NAME          Same as --container
  SUBSCRIPTION_ID         Same as --subscription
  TF_DIR                  Same as --tf-dir

Notes:
  - Requires az CLI and a logged-in session
  - Uses Azure AD auth mode, so no storage keys are needed
  - Upload is additive/overwrite-only; it does not delete removed blobs
  - If account/container are omitted, the script tries Terraform outputs from infra/terraform/nonprod
EOF
}

while (($# > 0)); do
  case "$1" in
    --account-name)
      ACCOUNT_NAME="${2:-}"
      shift 2
      ;;
    --container)
      CONTAINER_NAME="${2:-}"
      shift 2
      ;;
    --subscription)
      SUBSCRIPTION_ID="${2:-}"
      shift 2
      ;;
    --source)
      SOURCE_DIR="${2:-}"
      shift 2
      ;;
    --tf-dir)
      TF_DIR="${2:-}"
      shift 2
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
done

if [[ -z "$ACCOUNT_NAME" ]] && command -v terraform >/dev/null 2>&1 && [[ -d "$TF_DIR" ]]; then
  ACCOUNT_NAME="$(terraform -chdir="$TF_DIR" output -raw asset_storage_account_name 2>/dev/null || true)"
fi

if [[ -z "${CONTAINER_NAME:-}" ]] && command -v terraform >/dev/null 2>&1 && [[ -d "$TF_DIR" ]]; then
  CONTAINER_NAME="$(terraform -chdir="$TF_DIR" output -raw asset_container_name 2>/dev/null || true)"
fi

if [[ -z "$CONTAINER_NAME" ]]; then
  CONTAINER_NAME="artifacts"
fi

if [[ -z "$ACCOUNT_NAME" ]]; then
  echo "Missing required storage account name and no Terraform output was available." >&2
  usage >&2
  exit 1
fi

if [[ ! -d "$SOURCE_DIR" ]]; then
  echo "Source directory not found: $SOURCE_DIR" >&2
  exit 1
fi

if ! command -v az >/dev/null 2>&1; then
  echo "Azure CLI 'az' is required but not installed." >&2
  exit 1
fi

if [[ -n "$SUBSCRIPTION_ID" ]]; then
  az account set --subscription "$SUBSCRIPTION_ID"
fi

echo "Uploading $SOURCE_DIR to https://${ACCOUNT_NAME}.blob.core.windows.net/${CONTAINER_NAME}"
az storage blob upload-batch \
  --auth-mode login \
  --account-name "$ACCOUNT_NAME" \
  --destination "$CONTAINER_NAME" \
  --source "$SOURCE_DIR" \
  --overwrite true

echo "Done."
