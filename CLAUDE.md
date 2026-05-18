# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Development server (live reload at http://localhost:4000)
hexo server
# or
npm run server

# Generate static files to public/
hexo generate
# or
npm run build

# Clear generated files and cache
hexo clean

# Create a new post
hexo new post "Post Title"
```

After `hexo clean`, always run `hexo generate` or `hexo server` before inspecting output — the `public/` directory won't exist.

## Architecture

This is a Hexo static site using the custom **coldnight** theme located at `themes/coldnight/`. The Hexo CLI renders Markdown posts from `source/_posts/` through EJS templates, compiles Stylus to CSS, and writes static HTML to `public/`.

### Theme structure

```
themes/coldnight/
├── _config.yml          ← theme settings (all user-facing knobs live here)
├── layout/
│   ├── _partial/        ← reusable fragments included via partial()
│   │   └── widgets/     ← sidebar widgets (recent-posts, tag-cloud, archive)
│   └── *.ejs            ← one file per Hexo page type
├── source/
│   ├── css/             ← Stylus source; compiled by hexo-renderer-stylus
│   └── js/              ← vanilla JS; copied verbatim to public/js/
└── scripts/
    └── helpers.js       ← Hexo helper + tag plugin registrations
```

### CSS pipeline

All Stylus variables (colors, spacing, typography, breakpoints) are declared in `source/css/_variables.styl` and used by every other stylesheet. The entry point is `style.styl`, which `@import`s the others in dependency order. Never hardcode color values in partials — always reference a variable from `_variables.styl`.

### EJS layouts and data flow

Each page type (`index`, `post`, `archive`, `tag`, `category`, `404`) is a full HTML document that `partial()`-includes `_partial/head`, `_partial/header`, `_partial/footer`, etc. The `page` object is Hexo's built-in page context; `theme` is the deserialized `themes/coldnight/_config.yml`.

`post-card.ejs` is the only partial that expects a local variable — always call it as `partial('_partial/post-card', { post })`.

### Hexo helpers and tag plugins (`scripts/helpers.js`)

Three extensions are registered:

| Name | Type | Usage |
|------|------|-------|
| `reading_time(content)` | helper | `<%= reading_time(post.content) %>` in EJS |
| `{% gallery [cols] %}` | tag (block) | Markdown image list → LightGallery grid |
| `{% note type %}` | tag (block) | `tip \| info \| warning \| danger` callout box |

### LightGallery integration

LightGallery v2 is loaded from jsDelivr CDN **only on post pages** (controlled by `theme.lightgallery.enabled`). `source/js/gallery.js` handles two cases:

1. **Auto-mount** (`theme.lightgallery.auto_mount: true`): clicking any `.post-body img` not tagged `.no-gallery` opens a full-screen lightbox using a `dynamic` gallery built at runtime.
2. **Explicit galleries**: `{% gallery %}` tag renders a `.lg-gallery` div; `gallery.js` calls `lightGallery(el, { selector: 'a' })` on each one.

### Post grid

The index/archive/tag/category pages render posts inside `.post-grid`, a CSS Grid container defined in `_layout.styl`:
- Desktop (>1024px): 3 columns
- Tablet (≤1024px): 2 columns
- Mobile (≤640px): 1 column

`per_page: 9` in `_config.yml` keeps the grid full (3×3). Changing this value without adjusting the CSS grid columns will leave incomplete rows.

## Post front-matter

```yaml
---
title: My Post
date: 2026-01-01
categories: [Dev]
tags: [javascript, hexo]
cover_image: /images/cover.jpg   # optional; falls back to theme.cover.default
excerpt: "Override the auto-excerpt shown on post cards."
---
```

`<!-- more -->` in the post body also sets the excerpt boundary.

## Theme configuration

User-facing settings are in `themes/coldnight/_config.yml`. The full schema is documented inline there. Key toggles:

- `sidebar.position: hidden` — hides the sidebar on all pages
- `lightgallery.enabled: false` — removes all LightGallery CDN requests
- `code.copy_button: false` — disables the copy-to-clipboard button on code blocks
- `reading_time: false` — removes reading-time estimates everywhere
