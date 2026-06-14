# Nonprod Content Update

This runbook explains how to publish new paintings, artist images, or event images to the Azure nonprod website.

## Scope

- Static Web App hosts the website shell (HTML/CSS/JS)
- Azure Blob Storage (`nweuartsa01a01`) hosts `artifacts/`
- Local Kubernetes is separate and not part of this procedure

## Procedure

Run everything from the repo root:

```bash
cd /home/ronin/projects/art-app
```

### 1. Add your files

Place new images under `artifacts/artists/<Artist Name>/` or `artifacts/events/`.

Supported formats: `.png`, `.jpg`, `.jpeg`, `.webp`, `.avif` (case-insensitive).

### 2. Upload artifacts to Azure Blob Storage

```bash
./scripts/upload-nonprod-artifacts.sh --account-name nweuartsa01a01
```

This uploads all files in `artifacts/` to Azure Blob Storage and regenerates `gallery-data.js` with the correct Azure URLs.

### 3. Commit and push

```bash
git add artifacts/ gallery-data.js
git commit -m "Add new paintings"
git push origin master
```

GitHub Actions will deploy the updated site to Azure automatically.

---

## Why Both Steps Are Needed

- **Upload** — makes the image files available in Azure Blob Storage so the site can serve them.
- **Push** — updates `gallery-data.js` so the site lists the new paintings and links to them.

If you only push without uploading, images will be referenced but return 404.
If you only upload without pushing, the gallery won't show the new paintings.

---

## Optional: Local Kubernetes Preview

To also see the changes on your local microk8s site:

```bash
./sync-k8s-site.sh
```

This is not required for the Azure nonprod deployment.
