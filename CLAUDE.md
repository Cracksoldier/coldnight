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

Cover image `src` attributes in `post.ejs`, `post-card.ejs`, and `pinned-post.ejs` use `<%- url_for(coverImg) %>` so paths resolve correctly for subdirectory-deployed sites (e.g. `root: /blog/`). Never use `<%= coverImg %>` directly for a `src` attribute.

### Archive / tag / category list layout

These pages use a year-grouped list instead of a card grid. Posts are grouped by `post.date.year()` in the EJS template, sorted newest-first. Each row uses `.archive-item` (CSS Grid: `3.5rem 1fr auto`) showing date, linked title, and category + reading time. Styles live in `_layout.scss` under the `// ─── Archive list` section.

The tag and category page headings highlight the tag/category name with `<span class="page-header__accent">` — a CSS class defined inside `.page-header` in `_layout.scss` that sets `color: $accent-light`. Never use an inline `style=` for this colour.

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

**Accessibility** — each chip carries `aria-pressed="true/false"` so screen readers announce the active filter state ("Dev, button, pressed"). The JS toggles `aria-pressed` alongside the CSS class on every click.

**Styles** — `.archive-filters` and `.archive-filter-chip` live in `_layout.scss` under `// ─── Archive filter chips`. The active chip uses `$accent` background; chips have a `:focus-visible` outline for keyboard accessibility.

### Sidebar tag cloud widget

`widgets/tag-cloud.ejs` renders a flex-wrapped cloud of `.tag-pill` links. The container uses `.tag-cloud` (`display: flex; flex-wrap: wrap; gap: 6px`) and each tag count `(N)` uses `.tag-cloud__count` (`opacity: 0.6; font-size: 10px`). Both classes are defined in `_components.scss` under `// ─── Tag cloud widget`. Never use inline styles in the widget partial.

### External link indicator

When `external_links: true` (default), every author-written link in a post body that points to an external domain automatically receives `target="_blank"` and `rel="noopener noreferrer"`, and a small `↗` icon appears after the link text.

**Hook: `after_post_render`** — the filter is registered with `hexo.extend.filter.register('after_post_render', ...)` rather than `after_render:html`. The `after_post_render` hook receives only `data.content` (the rendered Markdown fragment before layout injection), so no theme-owned external links (social icons, sponsor button, footer links — all of which already carry their own `target`/`rel` in the EJS) are ever touched.

**Filter logic** — a regex replaces opening `<a href="https?://...">` tags. Three skip conditions (checked in order):
1. Link already has a `target=` attribute — author-configured, leave untouched.
2. Link has a `download` attribute — `{% download %}` tag output, not a navigation link.
3. The link's hostname matches `hexo.config.url` — internal absolute URL.

**Icon** — rendered purely via CSS in `_typography.scss` inside `.post-body, .prose`:
```scss
a[target="_blank"]::after { content: " ↗"; font-size: 0.75em; opacity: 0.6; }
.lg-gallery a[target="_blank"]::after { content: none; }
```
The `.lg-gallery` override suppresses the icon on `{% gallery %}` thumbnail anchors (which have external image URLs but trigger LightGallery, not navigation). The icon inherits `$accent-light` color from the parent `a` rule automatically.

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
| `{% timeline %}` | tag (block) | Vertical timeline for changelogs, career histories, etc. Entries delimited by `<!-- entry DATE :: TITLE -->` / `<!-- endentry -->`. `::` separates ISO date from title; order is author-controlled. Each body rendered via `renderSync` with try/catch fallback. Returns `""` if no entries found. Styles in `_components.scss` under `// ─── Timeline`. |
| `{% spoiler [label] %}` | tag (block) | Collapsible `<details>/<summary>` block. Optional label argument (default: `"Show spoiler"`). Body rendered via `renderSync` with try/catch fallback. Styles in `_components.scss` under `// ─── Spoiler`. |
| `after_render:html` filter | filter | Injects `data-lang` on `<figure class="highlight <lang>">` for CSS language labels; converts mermaid code blocks to `<div class="mermaid">` when `theme.mermaid.enabled`; also converts `<p><img></p>` to `<figure><img><figcaption>` when `theme.image_captions` is enabled |
| `before_generate` filter | filter | Resets tab counter and auto-sets `index_generator.per_page = grid.columns × grid.rows` for grid mode |
| `before_post_render` filter | filter | When `theme.math.enabled`: replaces `$...$` / `$$...$$` with KaTeX placeholder tags, skipping pre-rendered code blocks (`<hexoPostRenderCodeBlock>`) and inline code spans |
| `after_post_render` (KaTeX) filter | filter | When `theme.math.enabled`: renders KaTeX placeholders to HTML via `katex.renderToString()`; skips placeholders inside `<figure>` blocks |
| `after_post_render` (links) filter | filter | When `theme.external_links`: adds `target="_blank" rel="noopener noreferrer"` to external links in post body |

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

`toc.js` and `toc-drawer.js` are both loaded whenever `theme.toc.enabled` is true — the former sidebar-hidden guard has been removed. Both scripts share the same `if (theme.toc && theme.toc.enabled)` gate in `post.ejs`. `toc.js` queries `.toc-link` globally, so scroll-spy highlights work for both the sidebar widget and the mobile drawer.

The `toc` widget is registered in `sidebar.ejs` with a `page.layout === 'post'` guard — it never renders on archive/tag/category/page layouts. The widget partial (`widgets/toc.ejs`) calls `render_toc(page.content)` and renders nothing if the result is empty, so headingless posts show no widget. The toggle button collapses/expands the `<nav id="toc-list">` via `hidden` attribute.

Styles live in `_components.scss` under `.widget-toc__toggle`, `.toc-list`, `.toc-item`, `.toc-item--h3`, and `.toc-link`.

**Mobile TOC drawer** — On mobile (`≤640px`) the sidebar is CSS-hidden, leaving long posts without navigation. `_partial/toc-drawer.ejs` (rendered in `post.ejs` inside the same `toc.enabled` gate) calls `render_toc(page.content)` a second time at build time. If the result is empty (no headings), it renders nothing. Otherwise it emits a `.toc-fab` button (fixed bottom-right, `z-index: 30`, only visible via `@media (max-width: $bp-mobile)`) and a `.toc-drawer` overlay + bottom-sheet panel (`z-index: 40/41`) with slide-up animation. `source/js/toc-drawer.js` handles open/close: backdrop click, close button, Escape key, click on any `.toc-link`, and a Tab/Shift+Tab focus trap that cycles within the drawer (required to honour `aria-modal="true"`). Styles live in `_components.scss` under `// ─── Mobile TOC floating button + drawer`.

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

**Dropdown CSS design** — `.search-results` is `position: absolute; top: 100%; right: 0; min-width: 320px`, anchored to the right edge of `.search-wrap` so it extends leftward into the page on right-aligned navbars. The `.open` modifier uses `margin-top: -1px` to overlap the input's bottom border by 1px; the dropdown's `z-index: 20` ensures its border renders on top, producing a single clean join line rather than a double border. The top-right corner is squared (`border-top-right-radius: 0`) where it meets the input; the top-left keeps `$radius`. When the input is focused with the dropdown open, `.search-input:focus + .search-results.open` applies `border-color: $border-focus` to highlight the whole container, and `.search-input:focus:has(+ .search-results.open)` squares the input's bottom corners so the two elements read as one connected unit. `.search-result-item` is explicitly `display: block` (it is an `<a>` tag — inline by default) so the `$accent-glow` hover background fills the full row width. `mark` elements inside results have `background: none` to suppress the browser's default yellow; matched terms render as bold `$accent-light` text instead. Mobile dropdown `max-height` is reduced to `240px` to avoid overflowing the nav drawer.

The `#mobile-nav` drawer carries `aria-hidden="true"` in its initial (closed) state. `nav.js` sets `aria-hidden="false"` in `openNav()` and `aria-hidden="true"` in `closeNav()` so screen readers never traverse the drawer's content while it is visually hidden. The drawer uses `position: fixed; top: 56px` so it stays anchored immediately below the sticky navbar regardless of scroll position.

### Back-to-top button

`source/js/back-to-top.js` is loaded via `_partial/footer.ejs` on every page. A passive scroll listener toggles the `.back-to-top--visible` modifier on `#back-to-top` once `scrollY` exceeds one viewport height. The button uses `opacity` + `visibility` so it is excluded from the tab order when hidden.

### Open Graph / SEO (`_partial/head.ejs`)

All meta computation runs in a single `<% %>` block at the top of `head.ejs` (before any HTML output — EJS is sequential):

```js
const ogImage    = page.cover_image || (theme.cover && theme.cover.default) || ''
const ogImageAbs = ogImage ? config.url.replace(/\/$/, '') + url_for(ogImage) : ''
const rawExcerpt = page.excerpt
  ? page.excerpt
      .replace(/<[^>]+>/g, '')                          // strip HTML tags
      .replace(/&amp;/g, '&').replace(/&lt;/g, '<')...  // decode common entities
      .replace(/\s+/g, ' ').trim()
  : ''
const metaDesc   = (page.description || rawExcerpt || config.description || '').slice(0, 160)
const metaKeywords = (page.tags && page.tags.length
  ? page.tags.toArray().map(function(t){ return t.name }).join(', ')
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

### Mermaid diagram support

Toggled by `theme.mermaid.enabled` (default `false`). When enabled, fenced ` ```mermaid ` code blocks are converted to `<div class="mermaid">` at build time and rendered as SVG by the Mermaid JS library client-side.

**How it works**: Hexo's highlight.js renderer emits mermaid blocks as `<figure class="highlight plaintext">` with a `<code class="hljs mermaid">` inner element (mermaid is not a known HL language, so it falls back to `plaintext` for the figure class but still applies the `mermaid` class to the `<code>` tag). The `after_render:html` filter iterates every `<figure>` block on the page; if the `<code>` element has `class="hljs mermaid"`, it decodes the HTML-escaped source and replaces the entire `<figure>` with `<div class="mermaid">decoded source</div>`.

**Entity decoding**: Hexo HTML-encodes the code content (`>` → `&gt;`, `{` → `&#123;`, line breaks → `<br>`, etc.). The transform decodes `&amp;`, `&lt;`, `&gt;`, `&quot;`, `&#39;`, `&nbsp;`, `&#123;`, `&#125;`, and `<br>` before writing the source into the div. Known edge case: decoding `&lt;` → `<` puts a literal `<` into the div's innerHTML; a node label containing `<` would break surrounding HTML. Rare in practice since mermaid syntax rarely uses `<` in node text.

**Mermaid JS**: Vendored under `themes/coldnight/source/vendor/mermaid/` — entry point `mermaid.esm.min.mjs` plus its required `chunks/mermaid.esm.min/` subdirectory (the ESM build is chunked; the entry file alone is insufficient). Injected as `<script type="module">` at the bottom of `post.ejs` (module scripts are deferred by default). `mermaid.initialize({ startOnLoad: true, theme: '...' })` renders all `.mermaid` divs on load. The theme value is validated against `/^[a-z]+$/` before injection to prevent code injection.

**Theme**: `theme.mermaid.theme` (default `dark`). Mermaid's `dark` theme renders self-contained SVG — no extra color overrides needed.

**CSS**: `.mermaid { margin: 1.5rem 0; text-align: center; svg { max-width: 100%; height: auto; } }` in `_code.scss`.

### KaTeX math rendering

Toggled by `theme.math.enabled` (default `true`). When enabled, `$...$` (inline) and `$$...$$` (display) delimiters in post Markdown are converted to KaTeX HTML at build time — zero runtime JavaScript.

**Two-filter pipeline**:

1. **`before_post_render`** — runs on the partially-preprocessed Markdown. By the time this filter fires, hexo-renderer-marked has already converted fenced code blocks to `<hexoPostRenderCodeBlock><figure>...</figure></hexoPostRenderCodeBlock>` HTML. The combined `MATH_RE` regex uses leftmost-wins priority: `<hexoPostRenderCodeBlock>` regions and inline code spans are matched first and returned unchanged; math delimiters outside those regions are replaced with placeholder tags:
   - `$$expr$$` → `<div class="katex-d" data-e="htmlEncoded(expr)"></div>`
   - `$expr$` → `<span class="katex-i" data-e="htmlEncoded(expr)"></span>`

2. **`after_post_render`** — finds the placeholders and renders them with `katex.renderToString()`. A combined regex also matches `<figure>` blocks first so any placeholders that ended up inside a code block (edge case) are skipped rather than rendered. Output mode is the KaTeX default (`htmlAndMathml`): visual HTML plus a `<math>` element for screen readers.

**False positives**: `$...$` matches any two dollar signs on the same line, so prose containing currency amounts (e.g. `$50`) can accidentally trigger math rendering. Escape a literal dollar sign with `\$`.

**KaTeX CSS**: Linked in `_partial/head.ejs` on post pages only when `math.enabled`. No `<script>` tag anywhere — rendering is fully build-time.

**Vendor files**: `themes/coldnight/source/vendor/katex/katex.min.css` + `fonts/` (60 font files), copied from `node_modules/katex/dist/`. `katex.min.css` uses `url(fonts/...)` relative paths — correct at `/vendor/katex/katex.min.css`.

**`katex` package**: Listed as an explicit dependency in `package.json` (was previously only a transitive dep of mermaid).

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

Styles live in `_layout.scss` under `// ─── Related posts` (`.related-posts`, `.related-posts__heading`). The heading is `<h3>` (not `<h2>`) to avoid conflicting with post body `##` headings at the same outline level. The grid reuses `.post-grid` with `--post-grid-cols` and `--post-grid-cols-md` set to `Math.min(relatedPosts.length, 2)` — so a single related post fills a 1-column grid rather than sitting in one half of a 2-column row. 2 columns fits comfortably within the post body width (~700px); 3 columns produces cards too narrow (~217px).

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

### Social share buttons (`post.ejs`)

Toggled by `theme.social.share` (default `false`). When enabled, a `.post-share` row renders in `post.ejs` between the `.post-tags` block and `.post-nav`. It contains three buttons: X / Twitter (opens `twitter.com/intent/tweet` with `encodeURIComponent` title + permalink), LinkedIn (`linkedin.com/sharing/share-offsite/`), and a "Copy link" button. The copy handler lives in `copy-code.js` — it queries `.post-share-copy`, reads `dataset.permalink`, and calls the shared `writeToClipboard()` / `showToast()` helpers already in scope. Styles live in `_layout.scss` under `// ─── Post share`.

### Keyboard post navigation (`post-nav-keys.js`)

`source/js/post-nav-keys.js` is a tiny IIFE loaded via `<script defer>` only on post pages. It binds `ArrowLeft` / `ArrowRight` to the `.post-nav__item--prev a` and `.post-nav__item--next a` links respectively. Guard conditions: skips when `activeElement` is `input`, `textarea`, `select`, `button`, `summary`, or `isContentEditable`. Calls `e.preventDefault()` to suppress simultaneous horizontal scroll. The `summary` guard is critical — without it, pressing `→` while a `{% spoiler %}` summary is focused would navigate away instead of toggling the spoiler.

The `?` keyboard shortcuts modal in `search.js` lazily adds `←` / `→` entries only when `.post-nav__item--prev` or `.post-nav__item--next` is present in the DOM at dialog-build time, so the entries are correctly absent on archive/tag/category pages.

### Print / PDF styles (`_print.scss`)

`source/css/_print.scss` defines a dedicated `@media print` block, `@use`d at the end of `style.scss`. Key behaviors:
- Wildcard reset: all `background` forced white, all `color` forced black so no syntax-highlighted code or dark UI element produces a black rectangle.
- Hidden elements: `.navbar`, `.sidebar`, `#back-to-top`, `#reading-progress`, `.toc-fab`, `.toc-drawer`, `.post-permalink-btn`, `.post-share`, `.related-posts`, `.post-nav`, `.code-toolbar`, `.site-footer`, `.toast-container`, `.skip-nav`, `.series-nav`, `.pinned-post`.
- Layout: `.page-wrapper { display: block }`, `.main-content, .post-page { max-width: 100% }` so the post body fills the paper width.
- External link URLs: two rules in order — (1) suppress the ↗ icon (`a[target="_blank"]::after { content: none }`) then (2) append URL text (`.post-body a[href^="http"]::after { content: " (" attr(href) ")" }`). **Rule order matters**: since all external links receive `target="_blank"` from the `after_post_render` filter, the suppress rule must come first so it is overridden by the more specific URL rule, not the other way around.
- Page breaks: `h2, h3 { page-break-after: avoid }`, `pre, figure, .post-cover { page-break-inside: avoid }`.

## Post front-matter

```yaml
---
title: My Post
date: 2026-01-01
categories: [Dev]
tags: [javascript, hexo]
cover_image: /images/cover.jpg   # optional; falls back to theme.cover.default
cover_caption: "Photo by Jane Doe"  # optional; wraps cover in <figure><figcaption> with attribution text
excerpt: "Override the auto-excerpt shown on post cards."
updated: 2026-06-01              # optional; shows "↻ Updated YYYY-MM-DD" in post metadata when it differs from date
pinned: true                     # optional; promotes post to featured hero on the index page
series: My Series Name           # optional; groups post into a numbered series nav strip
---
```

`<!-- more -->` in the post body also sets the excerpt boundary.

**`updated:` and file mtime**: Hexo always populates `page.updated` — it defaults to the file's mtime when not set in front-matter. On a fresh `git clone`, all mtimes reflect the clone timestamp, which will differ from `date:` and trigger the "↻ Updated" badge on every post. Always set `updated:` explicitly in front-matter when you want to surface a revision date; do not rely on mtime.

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
- `sticky_title: false` — disables the sticky post title that fades into the navbar when the `<h1>` scrolls out of view; prevents `post-title.js` from loading
- `search.enabled: false` — removes the search box from the navbar and skips loading `search.js`
- `related_posts: false` — hides the "You might also like" section at the bottom of post pages
- `permalink_button: false` — removes the copy-permalink icon from the post metadata row
- `series: false` — disables the series navigation strip on all post pages
- `mermaid.enabled: true` — converts ` ```mermaid ` fenced blocks to rendered SVG diagrams; `mermaid.theme: dark` sets the Mermaid colour scheme
- `social.share: true` — shows X / Twitter, LinkedIn, and copy-link share buttons in the post footer
- `word_count: false` — hides the raw word count from the post header metadata row
