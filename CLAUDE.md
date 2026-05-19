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

### Page layouts

Two distinct page shells are used:

**Two-column shell** (`post`, `index`) — `.page-wrapper` with a CSS Grid (`65fr 35fr`) containing `.main-content` and `.sidebar`. The sidebar is controlled by `theme.sidebar.position`.

**Full-width shell** (`archive`, `tag`, `category`, `page`) — `.archive-wrapper` with `width: 100%; max-width: 1100px; margin: 0 auto`. No sidebar. Used for the archive list, tag/category filtered lists, and static pages like About.

`body` is `display: flex; flex-direction: column; min-height: 100vh`. Direct children that should push the footer down need `flex: 1` — both `.page-wrapper` and `.archive-wrapper` have this.

### EJS layouts and data flow

Each page type (`index`, `post`, `archive`, `tag`, `category`, `page`, `404`) is a full HTML document that `partial()`-includes `_partial/head`, `_partial/header`, `_partial/footer`, etc. The `page` object is Hexo's built-in page context; `theme` is the deserialized `themes/coldnight/_config.yml`.

`post-card.ejs` is the only partial that expects a local variable — always call it as `partial('_partial/post-card', { post })`.

### Archive / tag / category list layout

These pages use a year-grouped list instead of a card grid. Posts are grouped by `post.date.year()` in the EJS template, sorted newest-first. Each row uses `.archive-item` (CSS Grid: `3.5rem 1fr auto`) showing date, linked title, and category + reading time. Styles live in `_layout.styl` under the `// ─── Archive list` section.

Pagination is disabled for all three via `_config.yml`:
- `archive_generator.per_page: 0`
- `tag_generator.per_page: 0`
- `category_generator.per_page: 0`

### Static pages

`layout/page.ejs` renders static Hexo pages (created with `hexo new page`). It uses the full-width shell with no post metadata. The only static page currently in `source/` is `source/about/index.md`.

### Hexo helpers and tag plugins (`scripts/helpers.js`)

Five extensions are registered:

| Name | Type | Usage |
|------|------|-------|
| `reading_time(content)` | helper | `<%= reading_time(post.content) %>` in EJS |
| `{% gallery [cols] %}` | tag (block) | Markdown image list → LightGallery grid |
| `{% note type %}` | tag (block) | `tip \| info \| warning \| danger` callout box |
| `after_render:html` filter | filter | Injects `data-lang` attribute on `<figure class="highlight <lang>">` for CSS language labels |
| `before_generate` filter | filter | Auto-sets `index_generator.per_page = grid.columns × grid.rows` for grid mode |

### Code blocks

Hexo emits code blocks as `<figure class="highlight <lang>">` with a two-cell `<table>`: `td.gutter` (line numbers) and `td.code` (code). The `after_render:html` filter adds `data-lang` so the CSS toolbar can display the language name.

`source/js/copy-code.js` injects a `.code-toolbar` flex div (language label + copy button) into the top-right of each `figure.highlight`. The copy handler targets `td.code` explicitly to exclude line numbers. The toolbar is always visible; the copy button highlights on hover.

### Back-to-top button

`source/js/back-to-top.js` is loaded via `_partial/footer.ejs` on every page. A passive scroll listener toggles the `.back-to-top--visible` modifier on `#back-to-top` once `scrollY` exceeds one viewport height. The button uses `opacity` + `visibility` so it is excluded from the tab order when hidden.

### LightGallery integration

LightGallery v2 is loaded from jsDelivr CDN **only on post pages** (controlled by `theme.lightgallery.enabled`). `source/js/gallery.js` handles two cases:

1. **Auto-mount** (`theme.lightgallery.auto_mount: true`): clicking any `.post-body img` not tagged `.no-gallery` opens a full-screen lightbox.
2. **Explicit galleries**: `{% gallery %}` tag renders a `.lg-gallery` div; `gallery.js` mounts LightGallery on each one.

### Post grid (index page only)

The index page renders posts inside `.post-grid` (CSS Grid, `_layout.styl`). Column count and rows per page are configured via `theme.grid.columns` / `theme.grid.rows` in `themes/coldnight/_config.yml`. The EJS template injects `--post-grid-cols` and `--post-grid-cols-md` as inline CSS custom properties so the column count is resolved at render time without recompiling Stylus.

- Desktop: `grid.columns` columns (default 3)
- Tablet (≤1024px): `ceil(columns / 2)` columns
- Mobile (≤640px): always 1 column

When `grid.columns: 1` the grid switches to `.post-grid--list`, which flips each `.post-card` to `flex-direction: row` with a fixed-width thumbnail on the left.

A `before_generate` filter in `helpers.js` auto-sets `index_generator.per_page = columns × rows` for grid mode. In list mode (`columns: 1`) the filter does not override `per_page`, so the site `_config.yml` value is used.

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

User-facing settings are in `themes/coldnight/_config.yml`. Key toggles:

- `sidebar.position: hidden` — hides the sidebar on all pages
- `lightgallery.enabled: false` — removes all LightGallery CDN requests
- `code.copy_button: false` — disables the copy-to-clipboard button on code blocks
- `reading_time: false` — removes reading-time estimates everywhere
- `grid.columns: 1` — switches the index page to list view; any value >1 sets the grid column count
- `grid.rows: 3` — rows per page in grid mode; ignored in list mode (`per_page` from site config applies)
