# coldnight — example site

This repository is the example/demo site for the **[coldnight Hexo theme](https://github.com/Cracksoldier/coldnight-theme)**. It contains real content and configuration that demonstrate every theme feature.

**[Live Demo](https://cracksoldier.github.io/coldnight-demo/) · [Documentation](https://cracksoldier.github.io/coldnight/) · [Theme repo](https://github.com/Cracksoldier/coldnight-theme)**

---

## Theme features

| | |
|---|---|
| Responsive post grid | 3 → 2 → 1 column with cover images, reading time, and list-view mode |
| Featured post hero | `pinned: true` promotes a post to a full-width hero above the grid |
| Full-text search | Instant navbar dropdown — lazy-fetched, AND-matched, keyboard-navigable |
| LightGallery v2 | Full-screen image viewer with zoom and thumbnail strip |
| Code blocks | Language label, one-click copy, optional filename chip, diff highlighting |
| Table of contents | Build-time heading list with scroll-spy |
| Mermaid diagrams | ` ```mermaid ` blocks rendered to SVG — all assets self-hosted |
| KaTeX math | `$...$` and `$$...$$` rendered at build time — zero runtime JS |
| Related posts | Build-time tag & category scoring surfaces the 3 most relevant posts |
| Archive filter chips | Client-side category/tag pills on the archive page |
| PDF preview | `{% pdf %}` tag opens a PDF.js modal with page navigation and zoom |
| Audio player | `{% audio %}` tag embeds a styled HTML5 audio player with seek bar and mute toggle |
| Tag plugins | `{% note %}`, `{% tabs %}`, `{% timeline %}`, `{% spoiler %}`, `{% gallery %}`, `{% video %}`, `{% pdf %}`, `{% audio %}` |
| Open Graph & SEO | Full `og:*`, Twitter Card, and canonical tags |
| ePub export | Assembles a valid EPUB 3 archive in the browser via JSZip |
| Showroom | Paginated project portfolio with optional AI-assisted badge |
| Print styles | Hides UI chrome, shows external URLs, avoids awkward page breaks |
| Keyboard navigation | `←` / `→` navigate between posts; `/` focuses search |

---

## Requirements

- Node.js ≥ 18
- Hexo CLI: `npm install -g hexo-cli`

---

## Getting started

```bash
# Clone with the theme submodule
git clone --recurse-submodules https://github.com/Cracksoldier/coldnight.git
cd coldnight

# Install dependencies
npm install

# Development server with live reload
hexo server

# Generate static files
hexo generate
```

---

## Post front-matter

```yaml
---
title: My Post
date: 2026-01-01
categories: [Dev]
tags: [javascript, hexo]
cover_image: /images/cover.jpg
cover_caption: "Photo by Jane Doe"   # optional
excerpt: "Override the auto-excerpt shown on post cards."
updated: 2026-06-01                  # optional; shows "↻ Updated" badge
pinned: true                         # optional; featured hero on index page 1
series: My Series Name               # optional; numbered series nav strip
---
```

`<!-- more -->` in the post body also sets the excerpt boundary.

---

## Showroom front-matter

Each showroom project lives at `source/showroom/<slug>/index.md`:

```yaml
---
title: "Project Title"
subtitle: "Short tagline"
cover_image: /images/showroom/project.png
layout: project
date: 2026-01-01
ai_assisted: true   # optional; bare boolean — shows a badge on the card
---
```

---

## Theme configuration

See the [theme README](https://github.com/Cracksoldier/coldnight-theme#configuration) for the full configuration reference.

---

## License

MIT
