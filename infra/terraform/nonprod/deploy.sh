#!/usr/bin/env bash
set -euo pipefail

ACTION=""
ENVIRONMENT=""
PLAN_TIMESTAMP=""

START_EPOCH="$(date +%s)"
TIMESTAMP="$(date -u +%Y%m%dT%H%M%SZ)"
DATE_STAMP="$(date -u +%Y%m%d)"
export VRP_DEPLOY_TIMESTAMP="$TIMESTAMP"

TARGETS=()
TARGET_FILE=""

usage() {
  cat <<'EOF'
Usage:
  ./deploy.sh <action> <environment> [plan_timestamp] [options]

Actions:
  init | plan | apply | destroy | validate | fmt | show-plan-json | graph

Environments:
  nonprod

Options:
  --target <resource>       Add a Terraform target. Repeatable.
  --target-file <file>      JSON file containing {"targets":[...]}
  -Target <resource>        PowerShell-compatible alias for --target
  -TargetFile <file>        PowerShell-compatible alias for --target-file
  -h, --help                Show help

Examples:
  ./deploy.sh init nonprod
  ./deploy.sh plan nonprod
  ./deploy.sh apply nonprod 20260401T120000Z
  ./deploy.sh plan nonprod --target azurerm_static_web_app.art_app
EOF
}

require_command() {
  local cmd="$1"
  if ! command -v "$cmd" >/dev/null 2>&1; then
    echo "Required command not found: $cmd" >&2
    exit 1
  fi
}

confirm_required_parameters() {
  if [[ -z "$ACTION" ]]; then
    echo "Action parameter required" >&2
    return 1
  fi

  if [[ -z "$ENVIRONMENT" ]]; then
    echo "Environment parameter required" >&2
    return 1
  fi

  case "$ACTION" in
    init|plan|apply|destroy|validate|fmt|show-plan-json|graph) ;;
    *)
      echo "Invalid action: $ACTION" >&2
      return 1
      ;;
  esac

  if [[ "$ENVIRONMENT" != "nonprod" ]]; then
    echo "Invalid environment: $ENVIRONMENT (this folder currently supports only nonprod)" >&2
    return 1
  fi

  if [[ "$ACTION" =~ ^(apply|show-plan-json)$ ]] && [[ -z "$PLAN_TIMESTAMP" ]]; then
    echo "Plan timestamp parameter required" >&2
    return 1
  fi
}

parse_args() {
  local positionals=()

  while [[ $# -gt 0 ]]; do
    case "$1" in
      --target|-Target)
        [[ $# -ge 2 ]] || { echo "Missing value for $1" >&2; exit 1; }
        TARGETS+=("$2")
        shift 2
        ;;
      --target-file|-TargetFile)
        [[ $# -ge 2 ]] || { echo "Missing value for $1" >&2; exit 1; }
        TARGET_FILE="$2"
        shift 2
        ;;
      -h|--help)
        usage
        exit 0
        ;;
      -*)
        echo "Unknown argument: $1" >&2
        usage
        exit 1
        ;;
      *)
        positionals+=("$1")
        shift
        ;;
    esac
  done

  if [[ ${#positionals[@]} -gt 0 ]]; then
    ACTION="${positionals[0]}"
  fi
  if [[ ${#positionals[@]} -gt 1 ]]; then
    ENVIRONMENT="${positionals[1]}"
  fi
  if [[ ${#positionals[@]} -gt 2 ]]; then
    PLAN_TIMESTAMP="${positionals[2]}"
  fi
  if [[ ${#positionals[@]} -gt 3 ]]; then
    echo "Too many positional arguments" >&2
    usage
    exit 1
  fi
}

get_tfvar_value() {
  local file_path="$1"
  local key="$2"

  [[ -f "$file_path" ]] || {
    echo "Terraform vars file not found: $file_path" >&2
    exit 1
  }

  awk -F= -v wanted="$key" '
    /^[[:space:]]*[A-Za-z_][A-Za-z0-9_]*[[:space:]]*=/ {
      k=$1
      gsub(/^[[:space:]]+|[[:space:]]+$/, "", k)
      if (k == wanted) {
        v=substr($0, index($0, "=") + 1)
        gsub(/^[[:space:]]+|[[:space:]]+$/, "", v)
        gsub(/^"/, "", v)
        gsub(/"$/, "", v)
        print v
        exit
      }
    }
  ' "$file_path"
}

write_plan_overview() {
  local output_file_path="$1"
  [[ -f "$output_file_path" ]] || return 0

  local line
  local plan_summary=""

  while IFS= read -r line; do
    case "$line" in
      *" -/+ resource "*) printf '\033[30;43m%s\033[0m\n' "$line" ;;
      *" - resource "*)   printf '\033[37;41m%s\033[0m\n' "$line" ;;
      *" + resource "*)   printf '\033[30;42m%s\033[0m\n' "$line" ;;
      *" ~ resource "*)   printf '\033[37;46m%s\033[0m\n' "$line" ;;
      "Plan: "*|"No changes. Infrastructure is up-to-date."*|"No changes. Your infrastructure matches the configuration."*)
        plan_summary="$line"
        ;;
    esac
  done < "$output_file_path"

  if [[ -n "$plan_summary" ]]; then
    printf '\n\033[30;47m%s\033[0m\n\n' "$plan_summary"
  fi
}

initialize_paths() {
  ROOT_PATH="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
  TF_ROOT_PATH="$ROOT_PATH"
  PLANS_PATH="$TF_ROOT_PATH/plans"
  OUTPUTS_PATH="$TF_ROOT_PATH/outputs/$DATE_STAMP"
  VARS_FILE="$TF_ROOT_PATH/terraform.tfvars"
  BACKEND_FILE="$TF_ROOT_PATH/backend.hcl"

  [[ -f "$VARS_FILE" ]] || { echo "Terraform vars file not found: $VARS_FILE" >&2; exit 1; }

  mkdir -p "$PLANS_PATH" "$OUTPUTS_PATH"
}

load_targets_from_file() {
  [[ -z "$TARGET_FILE" ]] && return 0
  [[ -f "$TARGET_FILE" ]] || { echo "Target file not found: $TARGET_FILE" >&2; exit 1; }

  require_command jq

  mapfile -t file_targets < <(jq -r '.targets[]? // empty' "$TARGET_FILE")
  if [[ ${#file_targets[@]} -gt 0 ]]; then
    TARGETS+=("${file_targets[@]}")
    echo "|--> (TargetFile=[$TARGET_FILE], TargetCount=[${#file_targets[@]}])"
  fi
}

build_names() {
  local product_name_short product_unique

  product_name_short="$(get_tfvar_value "$VARS_FILE" "product_name_short")"
  product_unique="$(get_tfvar_value "$VARS_FILE" "product_unique")"

  PLAN_KEY_FILE_NAME=""
  PLAN_FILE_PATH=""

  if [[ "$ACTION" == "plan" ]]; then
    PLAN_KEY_FILE_NAME="${ENVIRONMENT}-${product_name_short}-${product_unique}-${TIMESTAMP}.tfplan"
    PLAN_FILE_PATH="$PLANS_PATH/$PLAN_KEY_FILE_NAME"
  elif [[ "$ACTION" == "apply" || "$ACTION" == "show-plan-json" ]]; then
    PLAN_KEY_FILE_NAME="${ENVIRONMENT}-${product_name_short}-${product_unique}-${PLAN_TIMESTAMP}.tfplan"
    PLAN_FILE_PATH="$PLANS_PATH/$PLAN_KEY_FILE_NAME"
  fi
  OUTPUT_KEY_FILE_NAME="${ENVIRONMENT}-${product_name_short}-${product_unique}-${ACTION}-${TIMESTAMP}.log"

  OUTPUT_FILE_PATH="$OUTPUTS_PATH/$OUTPUT_KEY_FILE_NAME"
}

build_target_args() {
  TARGET_ARGS=()
  local target
  for target in "${TARGETS[@]}"; do
    TARGET_ARGS+=("-target=$target")
  done
}

run_and_log() {
  local output_file="$1"
  shift
  "$@" 2>&1 | tee -a "$output_file"
}

invoke_terraform_action() {
  case "$ACTION" in
    init)
      if [[ -f "$BACKEND_FILE" ]]; then
        echo "|--> (BackendFile=[$BACKEND_FILE])"
        run_and_log "$OUTPUT_FILE_PATH" terraform -chdir="$TF_ROOT_PATH" init \
          -upgrade=true \
          -no-color \
          -backend=true \
          "-backend-config=$BACKEND_FILE"
      else
        echo "backend.hcl not found. Initializing without remote backend config."
        run_and_log "$OUTPUT_FILE_PATH" terraform -chdir="$TF_ROOT_PATH" init \
          -upgrade=true \
          -no-color \
          -backend=false
      fi
      ;;
    plan)
      run_and_log "$OUTPUT_FILE_PATH" terraform -chdir="$TF_ROOT_PATH" plan \
        -parallelism=20 \
        -no-color \
        -refresh=true \
        "-var-file=$VARS_FILE" \
        "-out=$PLAN_FILE_PATH" \
        "${TARGET_ARGS[@]}"
      ;;
    apply)
      [[ -f "$PLAN_FILE_PATH" ]] || { echo "Plan file not found: $PLAN_FILE_PATH" >&2; exit 1; }
      run_and_log "$OUTPUT_FILE_PATH" terraform -chdir="$TF_ROOT_PATH" apply \
        -parallelism=10 \
        -no-color \
        "$PLAN_FILE_PATH"
      ;;
    destroy)
      run_and_log "$OUTPUT_FILE_PATH" terraform -chdir="$TF_ROOT_PATH" destroy \
        -no-color \
        -refresh=true \
        "-var-file=$VARS_FILE" \
        "${TARGET_ARGS[@]}"
      ;;
    validate)
      terraform -chdir="$TF_ROOT_PATH" validate -no-color
      ;;
    fmt)
      terraform -chdir="$TF_ROOT_PATH" fmt -no-color
      ;;
    show-plan-json)
      [[ -f "$PLAN_FILE_PATH" ]] || { echo "Plan file not found: $PLAN_FILE_PATH" >&2; exit 1; }
      run_and_log "$OUTPUT_FILE_PATH" terraform -chdir="$TF_ROOT_PATH" show -json "$PLAN_FILE_PATH"
      ;;
    graph)
      local graph_dot="$TF_ROOT_PATH/graph.dot"
      terraform -chdir="$TF_ROOT_PATH" graph -no-color > "$graph_dot"
      if command -v dot >/dev/null 2>&1; then
        dot -Tsvg "$graph_dot" > "$TF_ROOT_PATH/graph.svg"
        echo "Graph generated: $TF_ROOT_PATH/graph.svg"
      else
        echo "Graphviz 'dot' not found. DOT output generated at: $graph_dot"
      fi
      ;;
  esac
}

main() {
  echo "------------------------------------------------------------------------"

  parse_args "$@"
  confirm_required_parameters
  initialize_paths
  load_targets_from_file
  build_names
  build_target_args

  echo "Started.."
  echo "|--> (OutputFilePath=[$OUTPUT_FILE_PATH])"
  echo

  invoke_terraform_action

  if [[ "$ACTION" == "plan" ]]; then
    write_plan_overview "$OUTPUT_FILE_PATH"
  fi

  echo "Finished"
  echo "------------------------------------------------------------------------"
  if [[ -n "$PLAN_FILE_PATH" ]]; then
    echo "Plan file path: $PLAN_FILE_PATH"
  fi
  echo "Log file path: $OUTPUT_FILE_PATH"
  if [[ "$ACTION" == "plan" ]]; then
    echo "Plan execution command: ./deploy.sh apply $ENVIRONMENT $TIMESTAMP"
  fi
  echo "------------------------------------------------------------------------"
}

trap 'elapsed=$(( $(date +%s) - START_EPOCH )); echo "Invoke-Main has been completed. (LastTimestamp=[$TIMESTAMP], PlanTimestamp=[$PLAN_TIMESTAMP], ElapsedTimeSec=[$elapsed], Environment=[$ENVIRONMENT])"' EXIT

main "$@"
