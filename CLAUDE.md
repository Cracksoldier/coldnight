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

This is a Hexo static site using the custom **coldnight** theme located at `themes/coldnight/`. The Hexo CLI renders Markdown posts from `source/_posts/` through EJS templates, compiles SCSS to CSS, and writes static HTML to `public/`.

### Theme structure

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

### CSS pipeline

All design tokens (colors, spacing, typography, breakpoints) are declared as Sass variables in `source/css/_variables.scss` and consumed by every other partial via `@use 'variables' as *;` at the top of each file. The entry point is `style.scss`, which `@use`s the partials in dependency order. Never hardcode color values in partials — always reference a variable from `_variables.scss`.

### Page layouts

Two distinct page shells are used:

**Two-column shell** (`post`, `index`) — `.page-wrapper` with a CSS Grid (`65fr 35fr`) containing `.main-content` and `.sidebar`. The sidebar is controlled by `theme.sidebar.position`.

**Full-width shell** (`archive`, `tag`, `category`, `page`) — `.archive-wrapper` with `width: 100%; max-width: 1100px; margin: 0 auto`. No sidebar. Used for the archive list, tag/category filtered lists, and static pages like About.

`body` is `display: flex; flex-direction: column; min-height: 100vh`. Direct children that should push the footer down need `flex: 1` — both `.page-wrapper` and `.archive-wrapper` have this.

### EJS layouts and data flow

Each page type (`index`, `post`, `archive`, `tag`, `category`, `page`, `404`) is a full HTML document that `partial()`-includes `_partial/head`, `_partial/header`, `_partial/footer`, etc. The `page` object is Hexo's built-in page context; `theme` is the deserialized `themes/coldnight/_config.yml`.

`post-card.ejs` is the only partial that expects a local variable — always call it as `partial('_partial/post-card', { post })`.

### Archive / tag / category list layout

These pages use a year-grouped list instead of a card grid. Posts are grouped by `post.date.year()` in the EJS template, sorted newest-first. Each row uses `.archive-item` (CSS Grid: `3.5rem 1fr auto`) showing date, linked title, and category + reading time. Styles live in `_layout.scss` under the `// ─── Archive list` section.

Pagination is disabled for all three via `_config.yml`:
- `archive_generator.per_page: 0`
- `tag_generator.per_page: 0`
- `category_generator.per_page: 0`

### Static pages

`layout/page.ejs` renders static Hexo pages (created with `hexo new page`). It uses the full-width shell with no post metadata. The only static page currently in `source/` is `source/about/index.md`.

### Hexo helpers and tag plugins (`scripts/helpers.js`)

Six extensions are registered:

| Name | Type | Usage |
|------|------|-------|
| `reading_time(content)` | helper | `<%= reading_time(post.content) %>` in EJS — strips `<pre>`/`<figure>` blocks before counting so code doesn't inflate the estimate |
| `render_toc(content)` | helper | `<%- render_toc(page.content) %>` in EJS — parses `<h2>`/`<h3>` with `id` attributes from rendered HTML and returns a flat `<ol class="toc-list">`. Returns `""` if no headings found. Respects `theme.toc.max_depth` (2 = h2 only, 3 = h2+h3). |
| `{% gallery [cols] %}` | tag (block) | Markdown image list → LightGallery grid |
| `{% note type %}` | tag (block) | `tip \| info \| warning \| danger` callout box |
| `after_render:html` filter | filter | Injects `data-lang` attribute on `<figure class="highlight <lang>">` for CSS language labels |
| `before_generate` filter | filter | Auto-sets `index_generator.per_page = grid.columns × grid.rows` for grid mode |

### Code blocks

Hexo emits code blocks as `<figure class="highlight <lang>">` with a two-cell `<table>`: `td.gutter` (line numbers) and `td.code` (code). The `after_render:html` filter adds `data-lang` so the CSS toolbar can display the language name.

`source/js/copy-code.js` injects a `.code-toolbar` flex div (language label + copy button) into the top-right of each `figure.highlight`. The copy handler targets `td.code` explicitly to exclude line numbers. The toolbar is always visible; the copy button highlights on hover. Clipboard writes use `navigator.clipboard` with an `execCommand('copy')` fallback for non-HTTPS contexts.

### Table of contents

`source/js/toc.js` is loaded on post pages when `theme.toc.enabled` is true. It uses `IntersectionObserver` (rootMargin `0px 0px -65% 0px`) to mark a heading active when it enters the top 35% of the viewport, toggling `.active` on the matching `.toc-link`. Headings are resolved from the TOC links' `href` attributes, so the DOM and helper output must agree on ids (they always do because `render_toc` reads from the same rendered HTML).

The `toc` widget is registered in `sidebar.ejs` with a `page.layout === 'post'` guard — it never renders on archive/tag/category/page layouts. The widget partial (`widgets/toc.ejs`) calls `render_toc(page.content)` and renders nothing if the result is empty, so headingless posts show no widget. The toggle button collapses/expands the `<nav id="toc-list">` via `hidden` attribute.

Styles live in `_components.scss` under `.widget-toc__toggle`, `.toc-list`, `.toc-item`, `.toc-item--h3`, and `.toc-link`.

### Reading progress bar

`source/js/reading-progress.js` is loaded on post pages when `theme.progress_bar` is true. A passive scroll listener computes `scrollY / (scrollHeight - clientHeight) * 100` and sets it as the `width` of `#reading-progress`. The element is a `<div>` injected at the very top of `<body>` in `post.ejs`, styled as `position: fixed; top: 0; height: 3px; z-index: 6` (above the sticky navbar at z-index 5). `pointer-events: none` prevents it from intercepting clicks.

### Search

Full-text search is powered by `hexo-generator-search` (emits `public/search.json` at build time) and `source/js/search.js` (loaded via `_partial/footer.ejs`). The feature is toggled by `theme.search.enabled` in `themes/coldnight/_config.yml`.

The search index is configured in the site-level `_config.yml`:
```yaml
search:
  path: search.json
  field: post
  content: true
```

`search.js` behaviour:
- The script reads the index URL from `data-search-url` on its own `<script>` tag (set by `footer.ejs` via `url_for`), falling back to `/search.json`. This keeps the path correct for subdirectory deployments.
- Index is fetched **lazily** on the first `focus` of either search input. The fetch is a single shared promise (`loadPromise`) so focusing the mobile input while a desktop-triggered fetch is in-flight does not start a second request.
- Once the fetch resolves, if the input already has a query, `runSearch()` fires immediately (handles the race where the user types before the network responds).
- `hexo-generator-search` v2.4 emits a top-level JSON array; the script handles both `Array` and `{ posts: [] }` formats for forward-compatibility.
- 180 ms debounce; multi-term AND matching against title, first 800 chars of content, and tags.
- Results are capped at 8; each rendered as an `<a class="search-result-item">` with a snippet.
- `mark()` wraps matched terms in `<mark>`; `esc()` HTML-escapes all output to prevent XSS.
- Keyboard: `ArrowDown`/`ArrowUp` navigate result links; `Escape` closes and returns focus to input; `ArrowUp` at the first result returns focus to the input field.
- Outside click closes the dropdown.

Two instances are initialised — `init('search-input', 'search-wrap', 'search-results')` for the desktop navbar and `init('search-input-mobile', 'search-wrap-mobile', 'search-results-mobile')` for the mobile nav drawer — both sharing the same data cache.

The mobile search input lives at the top of `#mobile-nav` in `header.ejs`, wrapped in `.mobile-nav__search` (padded row with a bottom border). Styles live in `_components.scss` under `// ─── Search`. The navbar-specific width (`200px`) and mobile hiding are in `.navbar__search`.

### Back-to-top button

`source/js/back-to-top.js` is loaded via `_partial/footer.ejs` on every page. A passive scroll listener toggles the `.back-to-top--visible` modifier on `#back-to-top` once `scrollY` exceeds one viewport height. The button uses `opacity` + `visibility` so it is excluded from the tab order when hidden.

### Open Graph / SEO (`_partial/head.ejs`)

All meta computation runs in a single `<% %>` block at the top of `head.ejs` (before any HTML output — EJS is sequential):

```js
const ogImage    = page.cover_image || theme.cover.default || ''
const ogImageAbs = ogImage ? config.url + url_for(ogImage) : ''
const rawExcerpt = page.excerpt
  ? page.excerpt
      .replace(/<[^>]+>/g, '')                          // strip HTML tags
      .replace(/&amp;/g, '&').replace(/&lt;/g, '<')...  // decode common entities
      .replace(/\s+/g, ' ').trim()
  : ''
const metaDesc   = (page.description || rawExcerpt || config.description || '').slice(0, 160)
const metaKeywords = (page.tags?.length
  ? page.tags.map(t => t.name).join(', ')
  : '') || config.keywords || ''
```

`rawExcerpt` strips HTML tags then decodes `&amp;`, `&lt;`, `&gt;`, `&quot;`, `&#39;`, `&nbsp;` so entities from Markdown rendering don't bleed into the OG description. `metaDesc` is capped at 160 characters. It is used for all three description tags: `<meta name="description">`, `og:description`, and `twitter:description`. The `rawExcerpt` fallback means posts using `<!-- more -->` get a populated OG description even without a front-matter `description:` field.

Tags emitted:
- `<meta name="description">` / `<meta name="keywords">` (keywords gated on non-empty value)
- `og:title`, `og:description`, `og:type` (`article` for posts, `website` otherwise), `og:url`, `og:site_name`, `og:image` (gated)
- `article:published_time`, `article:author` (gated on `page.layout === 'post'`)
- `<link rel="canonical">` (uses `page.permalink` or `config.url`)
- `twitter:card`, `twitter:title`, `twitter:description`, `twitter:site` (gated on `theme.social.twitter`), `twitter:image` (gated)

### LightGallery integration

LightGallery v2 JS and CSS are loaded from jsDelivr CDN **only on post pages** (gated by `page.layout === 'post'` in `_partial/head.ejs` and `layout/post.ejs`). `source/js/gallery.js` handles two cases:

1. **Auto-mount** (`theme.lightgallery.auto_mount: true`): a single LightGallery instance is created on page load for all `.post-body img` elements (excluding `.no-gallery`). Clicking an image calls `instance.openGallery(idx)` — no new instance per click.
2. **Explicit galleries**: `{% gallery [cols] %}` tag renders a `.lg-gallery` div with a `data-cols` attribute (1–6); `gallery.js` mounts a separate LightGallery instance on each one. CSS for all column counts is generated via a SCSS `@for` loop in `_components.scss`.

### Post grid (index page only)

The index page renders posts inside `.post-grid` (CSS Grid, `_layout.scss`). Column count and rows per page are configured via `theme.grid.columns` / `theme.grid.rows` in `themes/coldnight/_config.yml`. The EJS template injects `--post-grid-cols` and `--post-grid-cols-md` as inline CSS custom properties so the column count is resolved at render time without recompiling Stylus.

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
- `toc.enabled: false` — disables the TOC widget and prevents `toc.js` from loading
- `toc.max_depth: 2` — limit TOC to h2 headings only (default 3 includes h3)
- `progress_bar: false` — removes the reading progress bar from post pages
- `search.enabled: false` — removes the search box from the navbar and skips loading `search.js`
