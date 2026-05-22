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

Hexo static site using the custom **coldnight** theme at `themes/coldnight/`. Posts from `source/_posts/` → EJS templates → static HTML in `public/`.

```
themes/coldnight/
├── _config.yml          ← theme settings (all user-facing knobs live here)
├── layout/
│   ├── _partial/        ← reusable fragments included via partial()
│   │   └── widgets/     ← sidebar widgets (recent-posts, tag-cloud, archive, about, toc)
│   └── *.ejs            ← one file per Hexo page type
├── source/
│   ├── css/             ← SCSS source; compiled by hexo-renderer-dartsass
│   └── js/              ← vanilla JS; copied verbatim to public/js/
└── scripts/
    └── helpers.js       ← Hexo helper + tag plugin registrations
```

## Rules and gotchas

### CSS

- Never hardcode color values in partials — always reference a variable from `_variables.scss`.
- `$font-sans` and `$font-mono` are **unquoted** SCSS lists. Wrapping them in quotes causes the browser to treat the entire comma-separated value as one unrecognised font name.

### Page shells

- **Two-column** (`post`, `index`): `.page-wrapper` with CSS Grid (`65fr 35fr`), `.main-content` + `.sidebar`.
- **Full-width** (`archive`, `tag`, `category`, `page`, `showroom`, `project`, `links`): `.archive-wrapper`, `max-width: 1100px`. No sidebar.
- Both need `flex: 1` because `body` is `display: flex; flex-direction: column; min-height: 100vh`.

### EJS

- `post-card.ejs` expects a local variable — always call it as `partial('_partial/post-card', { post })`.
- Cover image `src` must use `<%- url_for(coverImg) %>`, never `<%= coverImg %>` — required for subdirectory deployments.
- The tag/category page accent colour uses `<span class="page-header__accent">` — never an inline `style=`.

### Showroom generator

The `layout` key in each route object returned by the showroom generator must be at the **top level**, not inside `data`. Hexo uses it to select the EJS template; inside `data` it serialises to JSON instead.

### Archive filter chips

Uses the `hidden` attribute (not `display:none`) for accessible visibility. `per_page: 0` on archive/tag/category guarantees all posts are in `page.posts` — required for reliable chip data collection.

### `updated:` front-matter

Hexo defaults `page.updated` to file mtime when not set. On a fresh `git clone` all mtimes reflect the clone time, triggering the "↻ Updated" badge on every post. Always set `updated:` explicitly in front-matter when surfacing a revision date.

### KaTeX false positives

`$...$` matches any two dollar signs on the same line. Prose containing currency amounts (e.g. `$50`) can accidentally trigger math rendering. Escape with `\$`.

## Post front-matter

```yaml
---
title: My Post
date: 2026-01-01
categories: [Dev]
tags: [javascript, hexo]
cover_image: /images/cover.jpg   # optional; falls back to theme.cover.default
cover_caption: "Photo by Jane Doe"  # optional; wraps cover in <figure><figcaption>
excerpt: "Override the auto-excerpt shown on post cards."
updated: 2026-06-01              # optional; shows "↻ Updated YYYY-MM-DD" when differs from date
pinned: true                     # optional; promotes post to featured hero on index page 1
series: My Series Name           # optional; groups post into a numbered series nav strip
---
```

`<!-- more -->` in the post body also sets the excerpt boundary.

## Theme configuration (`themes/coldnight/_config.yml`)

| Key | Effect |
|-----|--------|
| `sidebar.position: hidden` | Hides the sidebar on all pages |
| `grid.columns: N` | Index grid columns (1 = list view) |
| `grid.rows: N` | Rows per page in grid mode |
| `toc.enabled: false` | Disables TOC widget and `toc.js` |
| `toc.max_depth: 2` | Limit TOC to h2 only (default 3 = h2+h3) |
| `progress_bar: false` | Removes reading progress bar from posts |
| `sticky_title: false` | Disables sticky post title in navbar |
| `search.enabled: false` | Removes search box from navbar |
| `related_posts: false` | Hides "You might also like" section |
| `permalink_button: false` | Removes copy-permalink icon from post metadata |
| `epub_export: false` | Removes ePub download button (~100 KB JSZip) |
| `series: false` | Disables series navigation strip |
| `mermaid.enabled: true` | Renders ` ```mermaid ` blocks as SVG |
| `mermaid.theme: dark` | Mermaid colour scheme |
| `math.enabled: true` | KaTeX build-time math rendering |
| `social.share: true` | Shows X/Twitter, LinkedIn, copy-link buttons in post footer |
| `word_count: false` | Hides word count from post header |
| `reading_time: false` | Removes reading-time estimates everywhere |
| `lightgallery.enabled: false` | Removes all LightGallery CDN requests |
| `code.copy_button: false` | Disables copy-to-clipboard on code blocks |
| `external_links: true` | Adds `target="_blank"` + ↗ icon to external links in posts |
| `image_captions: true` | Converts `<p><img></p>` to `<figure><figcaption>` |
