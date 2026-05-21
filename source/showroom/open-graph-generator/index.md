---
title: "OG Image Generator"
subtitle: "Automated social preview cards"
cover_image: /images/showroom/og-generator.jpg
layout: project
date: 2026-03-01
---

A serverless function that generates Open Graph preview images on demand. Pass a title, description, and optional background image in the query string and receive a 1200×630 PNG suitable for social sharing.

## Usage

```
GET /api/og?title=Hello+World&desc=A+short+description&bg=forest
```

Returns a PNG image rendered with a consistent brand template.

## Tech

- **Runtime**: Node.js on Vercel Edge Functions
- **Rendering**: `@vercel/og` with JSX template
- **Fonts**: Geist Sans, self-hosted subset
