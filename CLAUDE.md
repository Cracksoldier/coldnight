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

**Font stacks**: `$font-sans` and `$font-mono` are unquoted SCSS lists, not quoted strings. Wrapping them in quotes would make the entire comma-separated value a single SCSS string, causing the CSS compiler to output it with quotes — which browsers treat as one unrecognised font name and fall back to defaults. Always keep these values unquoted when modifying them.

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

### Archive filter chips

The archive page (`archive.ejs`) shows a row of pill-shaped filter chips above the year-grouped list. Chips let readers filter posts by category or tag client-side without a page load.

**Data collection** — at the top of the EJS `<% %>` block, unique categories and tags are collected from `page.posts` using `Set`-based deduplication, then sorted alphabetically. `per_page: 0` guarantees all posts are present in `page.posts`, making the chip set and filter logic reliable.

**Data attributes** — each `<li class="archive-item">` carries:
- `data-category` — the post's primary category name, or `""` if none
- `data-tags` — pipe-separated (`|`) tag names, or `""` if none. Pipe is used instead of space so tag names containing spaces work correctly.

**Chip markup** — each `<button class="archive-filter-chip">` stores `data-filter-type` (`"all"`, `"category"`, or `"tag"`) and `data-filter-value`. Category chips show the bare name; tag chips are prefixed with `#`.

**`source/js/archive-filter.js`** — plain IIFE, no dependencies. On click:
1. Removes `archive-filter-chip--active` from all chips, adds it to the clicked one (exclusive mode — one active filter at a time).
2. Sets `item.hidden` on each `.archive-item` based on the active filter.
3. Checks each `.archive-year-group`: if all its items are hidden, sets `group.hidden = true` to collapse the year heading.

Uses the `hidden` attribute (not `display:none`) for accessible, style-decoupled visibility. `Array.prototype.some.call` is used for NodeList iteration, consistent with the existing `var`-style codebase.

**Styles** — `.archive-filters` and `.archive-filter-chip` live in `_layout.scss` under `// ─── Archive filter chips`. The active chip uses `$accent` background; chips have a `:focus-visible` outline for keyboard accessibility.

### Static pages

`layout/page.ejs` renders static Hexo pages (created with `hexo new page`). It uses the full-width shell with no post metadata. The only static page currently in `source/` is `source/about/index.md`.

### Hexo helpers and tag plugins (`scripts/helpers.js`)

Eight extensions are registered. Two module-level utilities are defined at the top and shared by all handlers: `stripHtml` (removes `<pre>`/`<figure>` blocks then all tags) and `escHtml` (HTML-escapes `&`, `<`, `>`, `"`).

| Name | Type | Usage |
|------|------|-------|
| `reading_time(content)` | helper | `<%= reading_time(post.content) %>` in EJS — strips `<pre>`/`<figure>` blocks before counting so code doesn't inflate the estimate |
| `word_count(content)` | helper | `<%= word_count(post.content) %>` in EJS — returns formatted word count (e.g. `"1,234 words"`) excluding code blocks |
| `render_toc(content)` | helper | `<%- render_toc(page.content) %>` in EJS — parses `<h2>`/`<h3>` with `id` attributes from rendered HTML; heading text and ids are HTML-escaped via `escHtml` before output. Returns `""` if no headings found. Respects `theme.toc.max_depth` (2 = h2 only, 3 = h2+h3). |
| `{% gallery [cols] %}` | tag (block) | Markdown image list → LightGallery grid. `alt` and `src` values are HTML-escaped via `escHtml` before insertion into attributes. |
| `{% note type %}` | tag (block) | `tip \| info \| warning \| danger` callout box. Body is rendered via `renderSync`; falls back to `<pre>`-escaped content if the Markdown engine throws. |
| `{% tabs %}` | tag (block) | Multi-tab content block using CSS-only radio toggle. Each panel rendered via `renderSync` with the same try/catch safety as `{% note %}`. Supports up to 10 tabs. |
| `after_render:html` filter | filter | Injects `data-lang` on `<figure class="highlight <lang>">` for CSS language labels; also converts `<p><img></p>` to `<figure><img><figcaption>` when `theme.image_captions` is enabled |
| `before_generate` filter | filter | Resets tab counter and auto-sets `index_generator.per_page = grid.columns × grid.rows` for grid mode |

### Footnotes

`hexo-renderer-marked` renders `[^label]` / `[^label]: text` Markdown footnote syntax without any plugin. The theme provides matching CSS in `_typography.scss`.

Rendered HTML:
- Inline reference: `<sup class="footnote-ref"><a href="#fn1" id="fnref1">[1]</a></sup>`
- Bottom section: `<section class="footnotes"><hr><ol><li id="fn1">...<a href="#fnref1" class="footnote-backref">↩</a></li></ol></section>`

`_typography.scss` inside `.post-body, .prose { }` styles `.footnote-ref a` as a small superscript in `$accent-light`, and styles `.footnotes` with a `border-top` separator (the `<hr>` emitted inside is hidden via `display: none` — the border-top replaces it), smaller font size, and muted text color.

### Code blocks

Hexo emits code blocks as `<figure class="highlight <lang>">` with a two-cell `<table>`: `td.gutter` (line numbers) and `td.code` (code). The `after_render:html` filter adds `data-lang` so the CSS toolbar can display the language name.

`source/js/copy-code.js` injects a `.code-toolbar` flex div (language label + copy button) into the top-right of each `figure.highlight`. The copy handler targets `td.code` explicitly to exclude line numbers. The toolbar is always visible; the copy button highlights on hover. Clipboard writes use `navigator.clipboard` with an `execCommand('copy')` fallback for non-HTTPS contexts.

The same file also handles the **permalink button**: a click handler at the bottom of the `DOMContentLoaded` callback queries `.post-permalink-btn` and calls the shared `writeToClipboard()` / `showToast()` helpers already in scope. The button is rendered in `post.ejs` with `data-permalink="<%= page.permalink %>"` so no client-side URL construction is needed. Gated on `theme.permalink_button !== false`.

The same `DOMContentLoaded` callback also injects **heading anchor links**: it queries every `.post-body h2[id]` and `.post-body h3[id]`, appends an `<a class="heading-anchor" href="#id" aria-hidden="true" tabindex="-1">#</a>` to each, and lets the browser handle hash navigation natively on click. The anchor is hidden by default (`opacity: 0`) and revealed by a CSS `:hover` rule on the parent heading. Styles live in `_components.scss` under `// ─── Heading anchors`.

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
- `mark()` wraps matched terms in `<mark>`; `esc()` HTML-escapes all output — including `post.url` in result anchor `href` attributes — to prevent XSS.
- Keyboard: `/` pressed outside any text field focuses the desktop search input and selects any existing text; `ArrowDown`/`ArrowUp` navigate result links; `Escape` closes the dropdown and blurs the input; `ArrowUp` at the first result returns focus to the input field. `?` opens a keyboard shortcuts modal (a native `<dialog>`) listing all available shortcuts; the dialog is lazily created on first trigger and closes on `Escape`, click-outside, or the `×` button.
- Outside click closes the dropdown.

Two instances are initialised — `init('search-input', 'search-wrap', 'search-results')` for the desktop navbar and `init('search-input-mobile', 'search-wrap-mobile', 'search-results-mobile')` for the mobile nav drawer — both sharing the same data cache.

The mobile search input lives at the top of `#mobile-nav` in `header.ejs`, wrapped in `.mobile-nav__search` (padded row with a bottom border). Styles live in `_components.scss` under `// ─── Search`. The navbar-specific width (`200px`) and mobile hiding are in `.navbar__search`.

The `#mobile-nav` drawer carries `aria-hidden="true"` in its initial (closed) state. `nav.js` sets `aria-hidden="false"` in `openNav()` and `aria-hidden="true"` in `closeNav()` so screen readers never traverse the drawer's content while it is visually hidden.

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

The index page renders posts inside `.post-grid` (CSS Grid, `_layout.scss`). Column count and rows per page are configured via `theme.grid.columns` / `theme.grid.rows` in `themes/coldnight/_config.yml`. The EJS template injects `--post-grid-cols` and `--post-grid-cols-md` as inline CSS custom properties so the column count is resolved at render time without recompiling SCSS.

- Desktop: `grid.columns` columns (default 3)
- Tablet (≤1024px): `ceil(columns / 2)` columns
- Mobile (≤640px): always 1 column

When `grid.columns: 1` the grid switches to `.post-grid--list`, which flips each `.post-card` to `flex-direction: row` with a fixed-width thumbnail on the left.

A `before_generate` filter in `helpers.js` auto-sets `index_generator.per_page = columns × rows` for grid mode. In list mode (`columns: 1`) the filter does not override `per_page`, so the site `_config.yml` value is used.

If a pinned post is detected, it is rendered as a hero above the grid on page 1 and filtered out of the grid on that same page (see **Featured / Pinned Post** below).

### Related posts (`post.ejs`)

At the bottom of each post page (below the post footer, above `</main>`), a "You might also like" section renders up to 3 related posts as `.post-grid` cards. Toggled by `theme.related_posts`.

The scoring runs entirely at build time in the top `<% %>` block of `post.ejs`:
- +2 pts per shared tag between the current post and a candidate
- +1 pt if the candidate shares the current post's primary category
- Candidates with score 0 are excluded; the rest are sorted descending and the top 3 taken

`site.posts.each()` iterates all posts via the Warehouse collection API. The related-posts section is only rendered when at least one candidate scores > 0.

Styles live in `_layout.scss` under `// ─── Related posts` (`.related-posts`, `.related-posts__heading`). The heading is `<h3>` (not `<h2>`) to avoid conflicting with post body `##` headings at the same outline level. The grid reuses the existing `.post-grid` with fixed inline custom properties `--post-grid-cols: 2; --post-grid-cols-md: 2` — 2 columns fits comfortably within the post body width (~700px); 3 columns produces cards too narrow (~217px).

### Series posts (`post.ejs`)

A post with `series: "Series Name"` in its front-matter shows a numbered nav strip above the post body. Toggled by `theme.series`.

Series detection runs entirely at build time in the top `<% %>` block of `post.ejs`, alongside the related-posts scoring:
- `site.posts.each()` collects all posts whose `p.series` equals the current post's series name into `_seriesCandidates`
- The candidates array is sorted ascending by `date` (oldest = Part 1)
- `seriesIndex` is the 1-based position of the current post in that sorted array
- The strip renders only when `seriesPosts.length > 1 && seriesIndex > 0` — the second guard prevents a "Part 0 of N" display if `findIndex` returns `-1` due to a path inconsistency between the current page and the series candidate list
- The current post renders as a `<span>` (not a `<a>`) so it is visually highlighted and not a self-link

Styles live in `_components.scss` under `// ─── Series nav` (`.series-nav`, `.series-nav__badge`, `.series-nav__name`, `.series-nav__progress`, `.series-nav__list`, `.series-nav__item`). The left accent border and pill badge reuse the same `$accent` / `$accent-glow` tokens as other callout-style components.

### Featured / Pinned Post (`index.ejs`, `_partial/pinned-post.ejs`)

A post with `pinned: true` in its front-matter is promoted to a full-width hero card above the grid on index page 1. If no post is pinned, the index page is unchanged.

Detection in `index.ejs`:
```js
const pinnedPost = site.posts.sort('-date').toArray().find(p => p.pinned)
const showHero   = !!pinnedPost && (page.current === 1 || !page.current)
```
`sort('-date')` ensures the most recently dated pinned post wins when several are marked. `!page.current` handles single-page sites where `page.current` is `undefined`.

When `showHero` is true the grid loop skips the pinned post (`if (showHero && post.path === pinnedPost.path) return`) so it does not appear twice on page 1. On page 2+ the hero is suppressed and the post occupies its chronological grid slot.

The partial `_partial/pinned-post.ejs` uses the same data as `post-card.ejs` (cover image, category, read time, excerpt) and reuses `.post-card__category` and `.post-card__read-more`. Styles live in `_components.scss` under `// ─── Pinned / Featured post`. Key visual details: blue `$border-focus` border, 45%-wide cover panel on the left (stacks on mobile), `.pinned-badge` label in accent colour, `min-height: 200px` on `.pinned-post` to guarantee hero visual weight with minimal content and to anchor the cover panel height via flex stretch.

## Post front-matter

```yaml
---
title: My Post
date: 2026-01-01
categories: [Dev]
tags: [javascript, hexo]
cover_image: /images/cover.jpg   # optional; falls back to theme.cover.default
excerpt: "Override the auto-excerpt shown on post cards."
pinned: true                     # optional; promotes post to featured hero on the index page
series: My Series Name           # optional; groups post into a numbered series nav strip
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
- `related_posts: false` — hides the "You might also like" section at the bottom of post pages
- `permalink_button: false` — removes the copy-permalink icon from the post metadata row
- `series: false` — disables the series navigation strip on all post pages
