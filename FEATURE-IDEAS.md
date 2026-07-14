# coldnight theme — feature ideas

Suggestions for future theme features. Roughly ordered by impact-per-effort within each group.

> **Correction (2026-07-11):** deeper inspection showed items 1–3 were largely already implemented in the theme. Item 1 (heading anchor links) exists in `copy-code.js` + `.heading-anchor` CSS. Item 3 (`?` shortcut overlay) exists in `search.js` (`.shortcuts-modal` dialog), along with a `/` focus-search shortcut. Item 2's filename label (`// filename: x` first-line comment) and `mark:` line highlighting (via `{% codeblock %}`) also existed — only the collapse toggle was missing, and it has now been implemented (`code.collapse` / `code.collapse_lines`).

## Quick wins

### 1. Heading anchor links — ✅ already existed
Hover `#` anchor on h2/h3 that copies a deep link and shows a toast. Shipped in `copy-code.js`.

### 2. Code block upgrades — ✅ done
Filename label and `mark:` line highlighting already existed; the collapse toggle for long blocks (default-on, `code.collapse_lines: 25`, 5-line hysteresis, no-JS = expanded) was implemented 2026-07-11.

### 3. Keyboard shortcut help overlay (`?`) — ✅ already existed
`?` opens a native `<dialog>` listing `/`, `Esc`, `?`, and ←/→ (post pages). Shipped in `search.js`.

### 4. Styled RSS feed
An XSL stylesheet so `/atom.xml` renders as a nice branded page in the browser instead of raw XML, with a "what is RSS" blurb and subscribe instructions. Cheap, distinctive, and `social.rss` is already on by default. *Update 2026-07-14: `/atom.xml` now actually exists — the demo site installed `hexo-generator-feed` after the new link checker flagged the sitewide dead link — so this idea is fully actionable.*

## Medium effort, high payoff

### 5. "Copy page as Markdown" button
The theme already ships llms.txt and has the raw markdown (`page._content`) at build time. A post-footer button that copies the post as clean markdown (or an "open in Claude/ChatGPT" link) is the per-page companion to llms.txt and currently trending on docs sites.

### 6. Click-to-load video facade
The `{% video %}` tag embeds the YouTube/Vimeo iframe eagerly — the single biggest third-party payload a post can carry, and a GDPR concern in the EU. A lite-youtube-style facade (thumbnail + play button, iframe injected on click) fits the theme's existing "load JS only when the tag is used" philosophy.

### 7. Speculation Rules prerendering
The theme already does cross-document View Transitions; adding a `<script type="speculationrules">` block (prerender links on hover / moderate eagerness) makes internal navigation feel instant and makes the crossfade look even better. Progressive enhancement, exactly like the view-transitions block in `head.ejs`.

### 8. Posting-activity heatmap on the archive page — ✅ done
Implemented 2026-07-13. GitHub-style contribution calendar built at generate time from `site.posts` via the `heatmap_data()` helper (`scripts/helpers.js`); no client JS at all — tooltips use the native `title` attribute. Toggle with `heatmap.enabled` / `heatmap.weeks` in theme config.

## Bigger features, worth considering

### 9. Series index page
The series nav strip exists per-post, but there's no `/series/` overview listing all series with progress (3 of 5 parts, etc.). Same generator pattern as the showroom.

### 10. Footnote hover previews
Show the footnote text in a small popover on hover/tap instead of forcing a jump to the bottom. Big readability win for reference-heavy posts; ~50 lines of vanilla JS, on-brand for the theme.

### 11. Build-time OG image generation
Render a branded 1200×630 card (title, site name, difficulty pill) per post for pages without a `cover_image`, instead of the one static fallback. Needs a Node canvas/satori dependency, so it's the heaviest item here — could be an optional peer dependency.

## Added 2026-07-14 (verified against the code first)

### Quick wins

#### 12. Mastodon + Bluesky share buttons — ✅ done 2026-07-14
Bluesky ships as a plain `bsky.app/intent/compose` anchor (zero JS); Mastodon prompts for an instance domain (validated, hardcoded `https://` scheme, remembered in localStorage under `coldnight:mastodon-instance`). Gated by the existing `social.share`, no new config key.

#### 13. JSON Feed (`/feed.json`) — ✅ done 2026-07-14
JSON Feed 1.1 via the plain-string route pattern (like llms.txt). `json_feed.enabled` default on, independent of `social.rss`; `json_feed.limit` caps items (default 20). Root-relative URLs in `content_html` are absolutised; `date_modified` only with explicit `updated:` front-matter. Pairs naturally with idea #4 (styled RSS).

#### 14. Glossary tooltips — ✅ done 2026-07-14
`source/_data/glossary.yml` + an `after_post_render` filter wrapping the first occurrence per post in `<abbr title="…">` — never inside code, links, or headings (protected-region split). Zero client JS; disable with `glossary: false`. Known limitation: ASCII `\b` boundaries, so symbol-edged terms like `C++` won't match.

### Medium effort

#### 15. Stats page (`/stats/`) — ✅ done 2026-07-14
Build-time generator (showroom pattern) + `layout/stats.ejs`: totals (posts/words/tags/categories), posts-per-year bars, top 10 tags, longest streak (consecutive months with ≥1 post). Zero client JS. Opt-in via `stats.enabled` — the demo site enables it plus a Stats navbar link.

#### 16. Reading-position restore
Small localStorage script offering "Continue where you left off" on long posts. Fits the conditional-loading philosophy — only load on posts above a length threshold.

#### 17. Per-series ePub export
`epub-export.js` already bundles a single post; a "Download series" button on the series nav strip that packs all parts into one book with chapters is a distinctive extension of existing code.

### Dev QoL

#### 18. Build-time internal link checker — ✅ done 2026-07-14
Warns on internal hrefs with no matching route; catches broken cross-post links before deploy, no runtime cost. Shipped as collect-in-`after_render:html` + validate-in-`before_exit` (not `after_generate` — reading lazy route streams there would double-render), aggregated by missing target; `link_check.fail: true` exits 1 for CI. First real catch: the sitewide `/atom.xml` dead link.

### Checked and already covered (do not re-suggest)

- **Search index lazy-loading** — `search.js` already fetches `search.json` on first focus via a guarded promise.
- **TOC scrollspy** — `toc.js` already highlights the active heading via IntersectionObserver.

## Deliberately not suggested

- **Light-mode toggle** — the dark identity is the brand ("coldnight").
- **Post reactions** — giscus already provides them.
- **i18n** — big maintenance surface for a personal theme.
