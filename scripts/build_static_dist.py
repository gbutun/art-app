#!/usr/bin/env python3

from __future__ import annotations

import shutil
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
DIST = ROOT / "dist"
ARTIFACTS_SRC = ROOT / "artifacts"
ARTIFACTS_DST = DIST / "artifacts"

SITE_FILES = [
    "index.html",
    "artist.html",
    "artists.html",
    "news.html",
    "styles.css",
    "script.js",
    "artist-page.js",
    "artists-page.js",
    "news-page.js",
    "gallery-data.js",
]

MAX_DIMENSION = 1600
JPEG_QUALITY = 82


def prepare_dist() -> None:
    if DIST.exists():
        shutil.rmtree(DIST)
    DIST.mkdir(parents=True, exist_ok=True)

    for relative_path in SITE_FILES:
        shutil.copy2(ROOT / relative_path, DIST / relative_path)


def optimize_image(source: Path, destination: Path) -> None:
    destination.parent.mkdir(parents=True, exist_ok=True)

    suffix = source.suffix.lower()
    if suffix not in {".png", ".jpg", ".jpeg"}:
        shutil.copy2(source, destination)
        return

    with Image.open(source) as image:
        image = image.copy()
        image.thumbnail((MAX_DIMENSION, MAX_DIMENSION), Image.Resampling.LANCZOS)

        if suffix in {".jpg", ".jpeg"}:
            if image.mode not in {"RGB", "L"}:
                image = image.convert("RGB")
            image.save(destination, format="JPEG", optimize=True, quality=JPEG_QUALITY, progressive=True)
            return

        save_options = {"optimize": True, "compress_level": 9}
        if image.mode in {"RGBA", "LA"}:
            image.save(destination, format="PNG", **save_options)
            return

        rgb_image = image.convert("RGB")
        palette_image = rgb_image.quantize(colors=256, method=Image.Quantize.MEDIANCUT)
        palette_image.save(destination, format="PNG", **save_options)


def copy_artifacts() -> None:
    for source in ARTIFACTS_SRC.rglob("*"):
        relative_path = source.relative_to(ARTIFACTS_SRC)
        destination = ARTIFACTS_DST / relative_path

        if source.is_dir():
            destination.mkdir(parents=True, exist_ok=True)
            continue

        optimize_image(source, destination)


def main() -> None:
    prepare_dist()
    copy_artifacts()


if __name__ == "__main__":
    main()
