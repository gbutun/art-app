# CLAUDE.md

Static marketing/gallery website for "Modern Miras Galerisi" (Art App).
Plain HTML/CSS/JS — **no build framework, no package.json.**

## Deploy paths
- **Nonprod → Azure Static Web Apps:** GitHub Actions
  (`.github/workflows/deploy-nonprod-static-web-app.yml`) on push to `master`.
  Auth via the `AZURE_STATIC_WEB_APPS_API_TOKEN_NONPROD` GitHub secret.
  Asset base URL from `vars.NONPROD_ASSET_BASE_URL`.
- **Local preview → microk8s:** `./sync-k8s-site.sh` copies site files into
  `k8s/site/`, served by an nginx pod via `hostPath` (`k8s/deployment.yaml`),
  then `kubectl apply -k k8s`.

## Content workflow
`artifacts/` (images) → `node scripts/generate-gallery-data.mjs` → `gallery-data.js`.
`scripts/upload-nonprod-artifacts.sh` pushes assets to Azure Storage.

## Guardrails (ask before touching)
- **Production is off limits:** `infra/terraform/prod/` and the prod Azure
  subscription. Do not modify or apply prod infra without explicit instruction.
- Do not action the committed `static_web_app_api_key` (a leaked SWA token)
  unless asked — CI uses the GitHub secret, not this file.

## Generated / noise (don't hand-edit, regenerated)
- `dist/` — built by CI from the root site files.
- `gallery-data.js` — generated from `artifacts/`; **git-ignored, never commit it.**
  CI regenerates it with `ASSET_BASE_URL=<azure>` (absolute URLs); `sync-k8s-site.sh`
  regenerates it without (relative paths for local use). Committing it would break one
  or the other.
- `infra/terraform/**/outputs/*.log` — local plan/apply transcripts.
