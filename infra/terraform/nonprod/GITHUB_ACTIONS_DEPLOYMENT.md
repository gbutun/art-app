# GitHub Actions Deployment for Nonprod Static Web App

This guide explains how to deploy the Art App website from this repository to the existing nonprod Azure Static Web App by using GitHub Actions.

## Current Nonprod Target

- Static Web App name: `n-weu-art-swa-01-a01`
- Resource group: `n-weu-rg-01-a01`
- Default hostname: `red-glacier-0d0fc8003.2.azurestaticapps.net`

The GitHub Actions workflow for this deployment is:

- [../../../.github/workflows/deploy-nonprod-static-web-app.yml](/home/ronin/projects/art-app/.github/workflows/deploy-nonprod-static-web-app.yml)

## How This Deployment Works

This repository uses an Azure Static Web Apps deployment token.

- Terraform creates the Static Web App resource.
- Terraform also creates a blob storage account and public container for website assets.
- Terraform exposes the deployment token as `static_web_app_api_key`.
- Terraform exposes the blob asset base URL as `asset_base_url`.
- GitHub stores that token as a repository secret.
- GitHub stores the asset base URL as a repository variable.
- The workflow uploads only the site shell to Azure Static Web Apps and points image/content assets at blob storage.

The workflow does not log in to Azure with tenant, subscription, or service principal credentials. The deployment token is already tied to one specific Static Web App resource.

## Prerequisites

- The nonprod Azure Static Web App must already exist.
- Terraform for `infra/terraform/nonprod` must already be initialized against the correct backend.
- `gh` must be installed and authenticated if you want to set the secret from the terminal.
- You must have permission to manage repository secrets in GitHub.

## Files Used by the Deployment

- Website content is generated from the repository root into a `dist/` folder during CI.
- The workflow publishes the site shell files such as `index.html`, `styles.css`, `script.js`, `artists.html`, `artist.html`, and the generated `gallery-data.js`.
- The `artifacts/` tree is expected to live in Azure Blob Storage for nonprod once `NONPROD_ASSET_BASE_URL` is set.
- The `k8s` folder is not part of this GitHub Actions deployment flow.

## Step 1: Confirm GitHub CLI Access

Check that GitHub CLI is available:

```bash
gh --version
gh auth status
```

Optional checks:

```bash
gh repo view --json nameWithOwner
gh secret list
```

## Step 2: Retrieve the Deployment Token from Terraform

Run:

```bash
terraform -chdir=infra/terraform/nonprod output -raw static_web_app_api_key
```

This returns the Azure Static Web App deployment token for the nonprod resource.

Treat this token like a password. Anyone with it can deploy to the Static Web App.

## Step 3: Add the Token to GitHub Actions Secrets

### Option A: GitHub CLI

Run:

```bash
terraform -chdir=infra/terraform/nonprod output -raw static_web_app_api_key | gh secret set AZURE_STATIC_WEB_APPS_API_TOKEN_NONPROD
```

This creates or updates the repository secret used by the workflow.

### Option B: GitHub Web UI

In the repository:

1. Open `Settings`.
2. Open `Secrets and variables`.
3. Select `Actions`.
4. Click `New repository secret`.
5. Create this secret:

- Name: `AZURE_STATIC_WEB_APPS_API_TOKEN_NONPROD`
- Secret: paste the token value from Terraform

## Step 4: Retrieve the Nonprod Asset Base URL from Terraform

Run:

```bash
terraform -chdir=infra/terraform/nonprod output -raw asset_base_url
```

This returns the blob base URL that the website should use for paintings, artist portraits, and event images.

## Step 5: Upload `artifacts/` to Blob Storage

Run from the repo root:

```bash
./scripts/upload-nonprod-artifacts.sh
```

The script defaults to Terraform outputs from `infra/terraform/nonprod`. If needed, you can override the storage account explicitly:

```bash
./scripts/upload-nonprod-artifacts.sh --account-name <storage-account-name>
```

## Step 6: Add the Asset Base URL to GitHub Actions Variables

### Option A: GitHub CLI

Run:

```bash
terraform -chdir=infra/terraform/nonprod output -raw asset_base_url | gh variable set NONPROD_ASSET_BASE_URL
```

### Option B: GitHub Web UI

In the repository:

1. Open `Settings`.
2. Open `Secrets and variables`.
3. Select `Actions`.
4. Open the `Variables` tab.
5. Create this variable:

- Name: `NONPROD_ASSET_BASE_URL`
- Value: paste the Terraform `asset_base_url`

## Step 7: Review the Workflow

The workflow file is:

- [../../../.github/workflows/deploy-nonprod-static-web-app.yml](/home/ronin/projects/art-app/.github/workflows/deploy-nonprod-static-web-app.yml)

Key settings:

- Branch trigger: `master`
- Manual trigger: `workflow_dispatch`
- App artifact location: `dist`
- Build step: skipped with `skip_app_build: true`
- Assets come from blob storage when `NONPROD_ASSET_BASE_URL` is set

This is correct for the current repository because the site is plain static HTML, CSS, and JavaScript generated into a deployable static bundle.

## Step 8: Commit and Push the Workflow

If the workflow file has not been committed yet, run:

```bash
git add .github/workflows/deploy-nonprod-static-web-app.yml
git commit -m "Add nonprod static web app deployment workflow"
git push origin master
```

Once pushed, GitHub Actions should automatically run for matching changes on `master`.

## Step 9: Run the Workflow

The workflow can start in either of these ways:

- Automatically when matching files are pushed to `master`
- Manually from the GitHub `Actions` tab by running `Deploy Nonprod Static Web App`

## Step 10: Verify the Deployment

Check the GitHub Actions run:

- Open the repository `Actions` tab
- Open `Deploy Nonprod Static Web App`
- Confirm the job completed successfully

Then verify the site in Azure:

- Default URL: `https://red-glacier-0d0fc8003.2.azurestaticapps.net`

## Troubleshooting

### Secret missing

If the workflow fails with an authentication or deployment token error:

- Confirm the repository secret `AZURE_STATIC_WEB_APPS_API_TOKEN_NONPROD` exists
- Recreate it from Terraform output

### Asset URLs still point to local files

If the deployed site still references `./artifacts/...` paths:

- Confirm the repository variable `NONPROD_ASSET_BASE_URL` exists
- Confirm the workflow run includes the `Prepare Static Site` step with that variable set
- Confirm `gallery-data.js` in the build was generated after the variable was added

### Blob upload missing content

If images do not load but the site shell deploys:

- Re-run `./scripts/upload-nonprod-artifacts.sh`
- Confirm Terraform was applied and `asset_storage_account_name` / `asset_container_name` outputs exist
- Check the blob URLs under the `asset_base_url`

### Wrong branch

If nothing runs after a push:

- Confirm you pushed to `master`
- Confirm the changed files match the workflow `paths` filter

### No workflow trigger for nested assets

The current workflow only watches top-level `*.html`, `*.css`, and `*.js` files.

If you later move files into nested folders or add images, fonts, or other asset types, update the `paths` filter in the workflow.

### Terraform output not available

If `terraform output -raw static_web_app_api_key` fails:

- Confirm `terraform init -backend-config=backend.hcl` was run in `infra/terraform/nonprod`
- Confirm the backend points to the correct state file
- Confirm the nonprod stack has already been applied

## Quick Command Summary

```bash
gh auth status
terraform -chdir=infra/terraform/nonprod output -raw static_web_app_api_key | gh secret set AZURE_STATIC_WEB_APPS_API_TOKEN_NONPROD
terraform -chdir=infra/terraform/nonprod output -raw asset_base_url | gh variable set NONPROD_ASSET_BASE_URL
./scripts/upload-nonprod-artifacts.sh
git add .github/workflows/deploy-nonprod-static-web-app.yml
git commit -m "Add nonprod static web app deployment workflow"
git push origin master
```
