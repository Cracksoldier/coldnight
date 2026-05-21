---
title: "Photo Gallery"
subtitle: "Static photography portfolio"
cover_image: /images/showroom/photo-gallery.png
layout: project
date: 2025-12-10
---

A performance-focused photography portfolio generated from a folder of RAW/JPEG files. The build pipeline converts each image to WebP, generates LQIP placeholders, and writes the gallery JSON. The frontend is pure HTML + CSS — no JavaScript until the lightbox is opened.

## Build pipeline

1. `exiftool` extracts EXIF metadata (date, camera, lens, focal length)
2. `sharp` generates three sizes: `thumb`, `medium`, `full`
3. `blurhash` computes a 4×3 hash for the LQIP placeholder
4. A Node.js script writes `gallery.json` consumed by the HTML template

## Performance

- First Contentful Paint: &lt; 0.8s on a 4G connection
- Lighthouse Performance: 98
