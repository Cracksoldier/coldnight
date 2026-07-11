# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this repo is

This is the **example/demo site** for the coldnight Hexo theme. Content lives here (`source/`); the theme lives in a separate repository consumed as a git submodule at `themes/coldnight/`.

**Theme repo:** `github.com/Cracksoldier/coldnight-theme` — theme CLAUDE.md is at `themes/coldnight/CLAUDE.md`.

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

Hexo static site using the **coldnight** theme (git submodule at `themes/coldnight/`). Posts from `source/_posts/` → EJS templates → static HTML in `public/`.

```
source/
├── _posts/          ← blog posts (Markdown)
├── _data/           ← YAML data files (e.g. links.yml)
├── showroom/        ← one directory per showroom project
│   └── <slug>/
│       └── index.md
├── about/
└── links/
themes/coldnight/    ← git submodule (do not edit here; commit to theme repo)
```

## npm install (alternative to submodule)

The theme is also published to npm as `hexo-theme-coldnight`. Sites that don't need to contribute to the theme can install it this way instead:

```bash
npm install hexo-theme-coldnight
```

Hexo will find it automatically in `node_modules/` with `theme: coldnight` in `_config.yml`. Configure it via `_config.coldnight.yml` in the site root (Hexo 5+ standard — overrides the theme's default `_config.yml` without touching node_modules):

```yaml
# _config.coldnight.yml
navbar:
  title: My Blog
```

This demo site uses the submodule so theme changes can be tested here before publishing.

## Submodule workflow

The theme is a git submodule — changes to theme files must be committed inside `themes/coldnight/` and pushed to the theme repo separately.

```bash
# Pull latest theme changes
git submodule update --remote themes/coldnight

# After updating, bump the pointer in the site repo
git add themes/coldnight
git commit -m "chore: update theme submodule"

# When cloning this repo fresh
git clone --recurse-submodules <url>
# or after a plain clone
git submodule update --init
```

## Gotchas

### `updated:` front-matter

Hexo defaults `page.updated` to file mtime when not set. On a fresh `git clone` all mtimes reflect the clone time, triggering the "↻ Updated" badge on every post. Always set `updated:` explicitly in front-matter when surfacing a revision date.

### KaTeX false positives

`$...$` matches any two dollar signs on the same line. Prose containing currency amounts (e.g. `$50`) can accidentally trigger math rendering. Escape with `\$`.

### Archive filter chips

`per_page: 0` on archive/tag/category in `_config.yml` guarantees all posts are in `page.posts` — required for reliable chip data collection. Do not change this.

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
description: "Custom og:description / meta description."  # optional; overrides excerpt for OG/SEO
updated: 2026-06-01              # optional; shows "↻ Updated YYYY-MM-DD" when differs from date
pinned: true                     # optional; promotes post to featured hero on index page 1
series: My Series Name           # optional; groups post into a numbered series nav strip
abstract: |                      # optional; styled summary block rendered before the post body
  Supports **markdown** inline formatting.
stale_warning: false             # optional; suppresses the post-age banner on this post
difficulty: 3                    # optional; integer 1–5 → signal-bar meter (alias: effort:; difficulty wins if both set)
llms_txt: false                  # optional; excludes this post/page from /llms.txt and /llms-full.txt
---
```

`<!-- more -->` in the post body also sets the excerpt boundary.

## OpenGraph / social previews

OG and Twitter Card meta tags are generated automatically in `themes/coldnight/layout/_partial/head.ejs` for every page. No plugin is needed.

| OG tag | Source (in priority order) |
|--------|---------------------------|
| `og:title` | `page.title` → `config.title` |
| `og:description` | `page.description` → `page.excerpt` → start of body (shared `page_description` helper, HTML-stripped + entity-decoded) → `config.description` |
| `og:image` | `page.cover_image` → `theme.cover.default` (absolute URL via `full_url_for`) |
| `og:type` | `article` for posts, `website` for all other pages |
| `og:url` | `page.permalink` → current page URL (trailing `index.html` stripped) |
| `og:locale` | `config.language` mapped to territory form (`en` → `en_US`, `de` → `de_DE`) |

The canonical `<link>` uses the same source as `og:url` — archive/tag/category pages get their own URL, never the site root.

Post pages additionally emit JSON-LD structured data (`BlogPosting` + `BreadcrumbList`) from the same sources — also automatic, no plugin needed.

The site-wide fallback image lives at `source/images/og-default.jpg` (1200×630 px recommended). Set it via `theme_config.cover.default` in `_config.yml` so the submodule stays untouched.

## Showroom project front-matter

Each project lives at `source/showroom/<slug>/index.md`:

```yaml
---
title: "Project Title"
subtitle: "Short tagline"           # shown on card hover and project page
cover_image: /images/showroom/x.png
layout: project                     # required — routes to project.ejs
date: 2026-01-01                    # controls sort order (newest first)
ai_assisted: true                   # optional; bare boolean only — never "true", "yes", or 1
difficulty: 4                       # optional; integer 1–5 → signal-bar meter on card overlay + project page (alias: effort:)
llms_txt: false                     # optional; excludes this project from /llms.txt and /llms-full.txt
---
```

## Navbar links (opt-in)

The theme default includes only `Home`, `Archive`, and `About`. `Links` and `Showroom` are **opt-in** — add them via `theme_config:` in the site's `_config.yml` when the corresponding pages exist:

```yaml
theme_config:
  navbar:
    links:
      - { name: Home,     url: / }
      - { name: Archive,  url: /archives }
      - { name: Links,    url: /links }
      - { name: Showroom, url: /showroom }
      - { name: About,    url: /about }
```

This site's `_config.yml` already has this override. Do not add Links/Showroom to the theme's own `_config.yml` — it's a submodule shared by all users.

## Theme configuration (`themes/coldnight/_config.yml`)

| Key | Effect |
|-----|--------|
| `navbar.icon: "❄"` | Brand icon before the navbar title — image path (`/images/logo.png`) or emoji/short text; empty = built-in SVG logo. Image vs text is auto-detected by file extension |
| `navbar.icon_color: "#60a5fa"` | Font color for a text `navbar.icon` (hex, keyword, modern color functions incl. `rgb(… / …)`/`oklch()`/`var()`; allowlist-validated). Ignored for images; color-emoji glyphs ignore it |
| `navbar.icon_after: "🌙"` | Optional image path or emoji/text rendered after the navbar title (hides on mobile together with the title) |
| `navbar.icon_after_color: "#fbbf24"` | Font color for a text `navbar.icon_after`; same rules as `icon_color` |
| `favicon: /favicon.png` | Favicon image path; empty or not an image path = theme default `favicon.svg`/`.ico` |
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
| `difficulty: false` | Hides the 1–5 difficulty/effort signal-bar meter everywhere |
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
| `code.collapse: false` | Disables auto-collapse of long code blocks ("Show N more lines" button) |
| `code.collapse_lines: 25` | Visible lines when collapsed; blocks collapse only when longer by 5+ lines |
| `pdf_viewer: false` | Prevents `pdf-viewer.js` from loading on post pages |
| `external_links: true` | Adds `target="_blank"` + ↗ icon to external links in posts |
| `image_captions: true` | Converts `<p><img></p>` to `<figure><figcaption>` |
| `cover.default: /images/og-default.jpg` | Fallback `og:image` for pages with no `cover_image`; place file at `source/images/og-default.jpg` |
| `audio_player: false` | Prevents `audio-player.js` from loading; `{% audio %}` tag returns empty string |
| `compare_slider: false` | Prevents `compare-slider.js` from loading; `{% compare %}` tag returns empty string |
| `stale_warning.enabled: true` | Shows an "information may be outdated" banner on old posts (opt-in) |
| `stale_warning.months: 24` | Age threshold for the banner; counted from explicit `updated:` or `date:` at build time |
| `view_transitions: false` | Removes the cross-document View Transitions crossfade between pages |
| `model_viewer.enabled: false` | Disables the Three.js 3D model viewer tag |
| `model_viewer.background: "#1a1a2e"` | Canvas background colour for model viewer |
| `llms_txt.enabled: true` | Emits `/llms.txt` — LLM-friendly markdown site index per llmstxt.org (opt-in; this site enables it) |
| `llms_txt.full: false` | Suppresses the companion `/llms-full.txt` (full markdown of every post/project) |

## Audio player

Place audio files under `source/audio/` and embed them in any post:

```
{% audio src="/audio/episode.mp3" %}
{% audio src="/audio/episode.mp3" title="Episode 1" caption="Recorded live" %}
```

| Parameter | Required | Notes |
|-----------|----------|-------|
| `src` | yes | Path to `.mp3`, `.ogg`, `.wav`, `.flac`, or `.m4a` |
| `title` | no | Player label; defaults to the filename |
| `caption` | no | Small muted text rendered below the player |

`audio-player.js` is only loaded on posts that contain an `{% audio %}` tag.

## Image compare slider

Embed a before/after slider in any post (see `source/_posts/image-compare-demo.md`):

```
{% compare before="/images/old.png" after="/images/new.png" %}
{% compare before="/images/old.png" after="/images/new.png" label_before="v1" label_after="v2" caption="Redesign" %}
```

| Parameter | Required | Notes |
|-----------|----------|-------|
| `before` / `after` | yes | Image paths; should share the same aspect ratio |
| `label_before` / `label_after` | no | Corner labels; default "Before" / "After" |
| `caption` | no | Muted text below the frame |

Drag, touch, or arrow keys move the divider (native range input under the hood). Without JS it renders as a static 50/50 split. `compare-slider.js` is only loaded on posts that use the tag.

## 3D model viewer

Place `.glb` / `.stl` files under `source/models/` and embed them in any post:

```
{% model src="/models/foo.glb" %}
{% model src="/models/bar.stl" height="500px" caption="FDM bracket v3" %}
```

All parameters except `src` are optional:

| Parameter | Default | Notes |
|-----------|---------|-------|
| `src` | — | Path to `.glb`, `.gltf`, or `.stl` file |
| `height` | `400px` | CSS height — allowlist-validated (`px\|em\|rem\|vh\|vw\|%` only) |
| `bg` | from `model_viewer.background` | CSS colour for canvas background |
| `view` | `front` | Starting camera angle: `front` (Z-axis) or `iso` ((1,1,1) diagonal) |
| `autorotate` | — | Any non-empty value (e.g. `"true"`) enables continuous Y-axis spin |
| `caption` | — | Plain-text caption rendered below the viewer |

Three.js (~680 KB) and loader scripts are only loaded on posts that contain a `{% model %}` tag. Vendor files live at `themes/coldnight/source/vendor/three/`.
