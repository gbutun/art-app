# Nonprod Content Update

This runbook explains how to publish new paintings, artist images, or event images to the Azure nonprod website.

## Scope

This procedure is for the Azure nonprod site.

- Static Web App hosts the website shell
- Azure Blob Storage hosts `artifacts/`
- Local Kubernetes is separate and not part of this procedure

## Start Here

Run everything from the repo root:

```bash
cd /home/ronin/projects/art-app
```

## Example

If you add a new painting like:

```bash
artifacts/artists/Mehmet Ozdemir/resim31.png
```

follow the steps below.

## Procedure

### 1. Regenerate site data with the Azure asset base URL

This updates `gallery-data.js` so the website knows about the new file.

```bash
ASSET_BASE_URL="$(terraform -chdir=infra/terraform/nonprod output -raw asset_base_url)" \
  node scripts/generate-gallery-data.mjs
```

### 2. Upload artifacts to Azure Blob Storage

This uploads the actual image files to the nonprod storage account.

```bash
./scripts/upload-nonprod-artifacts.sh
```

The script resolves its defaults from `infra/terraform/nonprod`, uploads the blobs, and also regenerates
`gallery-data.js` with the same Azure asset base URL so the committed site data matches production.

### 3. Commit and push the repo changes

This updates the website data and triggers the nonprod GitHub Actions deployment.

```bash
git add artifacts gallery-data.js
git commit -m "Add new painting"
git push origin master
```

### 4. Let GitHub Actions deploy nonprod

The workflow updates the Static Web App shell and generated data.

If needed, you can also trigger the workflow manually from GitHub Actions.

## Why Both Steps Are Needed

Both of these are required:

1. Blob upload
   This makes the actual image file available in Azure Storage.
2. Git push and site deploy
   This updates the website data so the site references the new image.

If you only upload the blob, the site may not list the new painting.

If you only push Git, the site may reference an image that does not exist yet in storage.

## Repeatable Workflow

For normal nonprod content publishing, use:

```bash
cd /home/ronin/projects/art-app
ASSET_BASE_URL="$(terraform -chdir=infra/terraform/nonprod output -raw asset_base_url)" \
  node scripts/generate-gallery-data.mjs
./scripts/upload-nonprod-artifacts.sh
git add artifacts gallery-data.js
git commit -m "Add new painting"
git push origin master
```

## Optional Local Kubernetes Update

If you also want the same change on your local Kubernetes site, run this separately:

```bash
./sync-k8s-site.sh
```

This is not required for Azure nonprod publishing.
