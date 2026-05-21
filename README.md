# coldnight

A dark, minimal [Hexo](https://hexo.io) theme built for developers.

Grid layout · LightGallery · full-text search · Mermaid diagrams · KaTeX math · polished code blocks — all without a framework.

**[Live Demo](https://cracksoldier.github.io/coldnight-demo/) · [Documentation](https://cracksoldier.github.io/coldnight/)**

---

## Features

| | |
|---|---|
| 🗃️ Responsive post grid | 3 → 2 → 1 column with cover images, reading time, and list-view mode |
| ⭐ Featured post hero | `pinned: true` promotes a post to a full-width hero above the grid |
| 🔍 Full-text search | Instant navbar dropdown — lazy-fetched, AND-matched, keyboard-navigable |
| 🖼️ LightGallery v2 | Full-screen image viewer with zoom and thumbnail strip |
| 💻 Code blocks | Language label, one-click copy, optional filename chip, diff highlighting |
| 📖 Table of contents | Build-time heading list with `IntersectionObserver` scroll-spy |
| 📑 Mobile TOC drawer | Bottom-sheet TOC on mobile — same scroll-spy as the desktop widget |
| 📐 Mermaid diagrams | ` ```mermaid ` blocks rendered to SVG — all assets self-hosted |
| ∑ KaTeX math | `$...$` and `$$...$$` rendered at build time — zero runtime JS |
| 🔁 Related posts | Build-time tag & category scoring surfaces the 3 most relevant posts |
| 🏷️ Archive filter chips | Client-side category/tag pills on the archive page |
| 🔌 Tag plugins | `{% note %}`, `{% tabs %}`, `{% timeline %}`, `{% spoiler %}`, `{% gallery %}`, `{% video %}` |
| 🔗 Open Graph & SEO | Full `og:*`, Twitter Card, and canonical tags |
| 📥 ePub export | Assembles a valid EPUB 3 archive in the browser via JSZip |
| ↗ External link indicator | Auto-injects `target="_blank"` and a subtle ↗ icon on external links |
| 🖨️ Print / PDF styles | Hides UI chrome, shows external URLs, avoids awkward page breaks |
| ⌨️ Keyboard navigation | `←` / `→` navigate between posts; `/` focuses search |
| 🎨 Design tokens | All colors, spacing, and breakpoints in `_variables.scss` |

---

## Requirements

- Node.js ≥ 18
- Hexo CLI: `npm install -g hexo-cli`

---

## Installation

```bash
# 1. Clone into your Hexo site's themes directory
git clone https://github.com/Cracksoldier/coldnight.git themes/coldnight

# 2. Set the theme in your site's _config.yml
echo "theme: coldnight" >> _config.yml

# 3. Install dependencies
npm install
```

---

## Quick start

```bash
# Development server with live reload
hexo server

# Generate static files
hexo generate

# Clear cache and generated files
hexo clean
```

---

## Configuration

All theme settings live in `themes/coldnight/_config.yml`. Key toggles:

```yaml
grid:
  columns: 3   # 1 = list view, 2–6 = grid columns
  rows: 3      # rows per page

sidebar:
  position: right   # left | right | hidden

toc:
  enabled: true
  max_depth: 3

search:
  enabled: true

mermaid:
  enabled: true

math:
  enabled: true

social:
  share: false   # X/Twitter + LinkedIn + copy-link in post footer

epub_export: true
```

See the [full configuration reference](https://cracksoldier.github.io/coldnight/configuration.html) for all options.

---

## Post front-matter

```yaml
---
title: My Post
date: 2026-01-01
categories: [Dev]
tags: [javascript, hexo]
cover_image: /images/cover.jpg
cover_caption: "Photo by Jane Doe"
excerpt: "Override the auto-excerpt shown on post cards."
updated: 2026-06-01
pinned: true          # promote to featured hero on index page
series: My Series     # group into a numbered series nav strip
---
```

---

## License

MIT
