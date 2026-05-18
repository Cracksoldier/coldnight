# Hexo Theme Specification — Coldnight

A dark, cold-blue Hexo blog theme derived from the md2epub design system.

---

## 1. Theme Identity

| Property   | Value                                                |
|------------|------------------------------------------------------|
| Name       | `coldnight`                                          |
| Style      | Dark, deep-navy, developer-focused                   |
| Mood       | Calm, sharp, minimal — productive rather than flashy |
| Audience   | Technical writers, developers, open-source authors   |

---

## 2. Color Tokens

All color values are taken directly from `src/styles/_variables.scss`.

### 2.1 Background Scale

| Token            | Hex / Value              | Role                                              |
|------------------|--------------------------|---------------------------------------------------|
| `bg-base`        | `#050d1a`                | Page background, `<body>`                         |
| `bg-surface`     | `#0a1628`                | Navbar / header bar, sidebar, footer              |
| `bg-elevated`    | `#0f2040`                | Cards, blockquotes, code blocks, table headers    |
| `bg-input`       | `#152b52`                | Code block inner background, search field, tags   |

### 2.2 Border Scale

| Token            | Hex / Value              | Role                                              |
|------------------|--------------------------|---------------------------------------------------|
| `border-subtle`  | `#1e3a6e`                | Default rule lines, card borders, dividers        |
| `border-focus`   | `#2563eb`                | Focused inputs, active elements                   |

### 2.3 Accent (Blue)

| Token            | Hex / Value              | Role                                              |
|------------------|--------------------------|---------------------------------------------------|
| `accent`         | `#2563eb`                | Primary CTA buttons, links (body), active nav     |
| `accent-hover`   | `#3b82f6`                | Hover state for accent elements                   |
| `accent-light`   | `#60a5fa`                | Inline `code`, anchor text in prose, tag labels   |
| `accent-glow`    | `rgba(37,99,235,0.15)`   | Focus ring (`box-shadow`), selected backgrounds   |

### 2.4 Text Scale

| Token             | Hex / Value | Role                                              |
|-------------------|-------------|---------------------------------------------------|
| `text-primary`    | `#e2e8f0`   | Body copy, headings, post titles                  |
| `text-secondary`  | `#94a3b8`   | Subtitles, metadata (date, reading time), labels  |
| `text-muted`      | `#64748b`   | Placeholder text, disabled states, fine print     |

### 2.5 Semantic

| Token        | Hex / Value              | Role                                           |
|--------------|--------------------------|------------------------------------------------|
| `success`    | `#10b981`                | Alert / callout blocks — "tip", "note"         |
| `success-bg` | `rgba(16,185,129,0.12)`  | Success callout background                     |
| `danger`     | `#ef4444`                | Alert / callout blocks — "warning", "error"    |
| `danger-bg`  | `rgba(239,68,68,0.12)`   | Danger callout background                      |
| `info-bg`    | `rgba(37,99,235,0.12)`   | Info callout background                        |

### 2.6 Accent-Amber (Donation / Sponsor button only)

| Value                     | Role                          |
|---------------------------|-------------------------------|
| `#fbbf24` / `#fcd34d`     | Sponsor / coffee button text  |
| `rgba(251,191,36,0.10)`   | Sponsor button background     |
| `rgba(251,191,36,0.30)`   | Sponsor button border         |

---

## 3. Typography

### 3.1 Font Stacks

| Use case        | Stack                                                                              |
|-----------------|------------------------------------------------------------------------------------|
| Body / UI       | `-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`                |
| Code / mono     | `'Cascadia Code', 'Fira Code', 'JetBrains Mono', 'Consolas', monospace`           |
| Custom CSS code | `'SF Mono', 'Consolas', 'Liberation Mono', Menlo, monospace` (textarea / editors) |

No web-font imports. System fonts only — keeps the first paint fast and respects user font preferences.

### 3.2 Heading Scale

| Level | Size       | Weight | Color            | Extra                                           |
|-------|------------|--------|------------------|-------------------------------------------------|
| H1    | `1.875rem` | 700    | `text-primary`   | Border-bottom `1px solid border-subtle`, `pb: 0.4rem` |
| H2    | `1.5rem`   | 600    | `text-primary`   | —                                               |
| H3    | `1.25rem`  | 600    | `text-secondary` | —                                               |
| H4    | `1.1rem`   | 600    | `text-secondary` | —                                               |

### 3.3 Body Text

- Font size: `16px` (base)
- Line height: `1.7`
- Color: `text-primary`
- Paragraph margin: `0.75rem 0`

### 3.4 Form Labels

- Size: `12px`
- Weight: 500
- Color: `text-secondary`
- Transform: `uppercase`
- Letter spacing: `0.05em`

---

## 4. Layout

### 4.1 Breakpoints

| Name     | Value   | Behavior                                   |
|----------|---------|--------------------------------------------|
| Mobile   | `640px` | Single-column; sidebar hidden; nav collapses |
| Tablet   | `1024px`| Nav brand title hidden; sidebar optional   |
| Desktop  | > 1024px| Full two-column layout (main + sidebar)    |

### 4.2 Page Structure

```
┌─────────────────────────────────────────┐
│  Header / Navbar  (bg-surface, 56px)    │
├────────────────────────┬────────────────┤
│                        │                │
│   Main Content Area    │   Sidebar      │
│   (bg-base)            │   (bg-surface) │
│                        │                │
├────────────────────────┴────────────────┤
│  Footer  (bg-surface)                   │
└─────────────────────────────────────────┘
```

- Max content width: `780px` (post body), `1100px` (page wrapper)
- Main/sidebar split: `~65% / 35%` with a `24px` gap
- On mobile: sidebar moves below main or is hidden behind a toggle
- Page horizontal padding: `16px` (mobile), `24px` (tablet+)

### 4.3 Spacing Scale

Derived from the component measurements in the codebase. Use multiples of `4px`.

| Step | Value  |
|------|--------|
| 1    | `4px`  |
| 2    | `8px`  |
| 3    | `12px` |
| 4    | `16px` |
| 6    | `24px` |
| 8    | `32px` |

---

## 5. Border Radius

| Token           | Value  | Use                                       |
|-----------------|--------|-------------------------------------------|
| `border-radius` | `6px`  | Buttons, inputs, code blocks, cards, tags |
| `border-radius-lg` | `10px` | Modals, large cards, cover images      |

---

## 6. Components

### 6.1 Navbar / Header

- Height: `56px`
- Background: `bg-surface`
- Bottom border: `1px solid border-subtle`
- Brand logo: inline SVG, `28×28px`
- Brand title: `15px`, weight 600, `text-primary`, hidden below `1024px`
- Action links: `btn--ghost` style (see §7)
- Sticky; `z-index: 5`

#### Nav Links (desktop)

- Default color: `text-secondary`
- Hover: `text-primary`, background `bg-elevated`, border `border-focus`
- Active / current page: `accent-light` text, `accent-glow` background

#### Mobile Nav

- Hamburger toggle button (icon-only, `btn--icon`)
- Dropdown opens below header, full-width, background `bg-surface`
- Nav items stack vertically, `padding: 12px 16px` each

### 6.2 Post Card (Index / Archive)

```
┌─────────────────────────────────────────┐  bg-elevated
│  [Cover image, optional, 16:9 ratio]    │  border: border-subtle
│─────────────────────────────────────────│  border-radius-lg
│  Category tag  ·  Reading time          │  padding: 20px
│  Post Title (H2, text-primary)          │
│  Excerpt (text-secondary, 2–3 lines)    │
│  Date  ·  Author         Read more →    │
└─────────────────────────────────────────┘
```

- Card hover: `border-color` → `border-focus`, subtle `box-shadow 0 4px 16px rgba(0,0,0,0.4)`
- "Read more" link: `accent-light`
- Category tag: small pill, `bg-input` background, `accent-light` text, `border-subtle` border
- Transition: `0.15s ease` on `border-color` and `box-shadow`

### 6.3 Post Page

- Title: H1, `text-primary`
- Metadata bar (date, author, tags, reading time): `text-secondary`, `font-size: 13px`
- Body prose: follows the `.prose` rules in §3 exactly
- Tags at bottom: pill style (same as category tag)
- Prev / Next post navigation: two `btn--ghost` blocks below the post body

### 6.4 Sidebar Widgets

Each widget is a card:
- Background: `bg-elevated`
- Border: `1px solid border-subtle`
- Border radius: `border-radius` (`6px`)
- Padding: `16px`
- Widget title: `13px`, weight 600, uppercase, `text-secondary`, letter-spacing `0.05em`
- Margin between widgets: `16px`

**Recent Posts widget** — plain list, `text-primary` links, hover `accent-light`  
**Tags Cloud widget** — pill tags, same style as post tags  
**About / Profile widget** — avatar `48px` circle, name `text-primary`, bio `text-secondary 13px`  
**Archive widget** — year/month groups, count badge in `accent-glow` bg, `accent-light` text

### 6.5 Code Blocks

```
background:    bg-elevated
border:        1px solid border-subtle
border-radius: border-radius (6px)
padding:       1rem
font-family:   $font-mono
font-size:     0.875rem
color:         text-primary
overflow-x:    auto
```

- Language label: top-right corner, `12px`, `text-muted`, background `bg-input`, padding `2px 8px`, `border-radius 0 6px 0 6px`
- Syntax highlighting: **highlight.js GitHub-Light** (same spans the EPUB uses — keeps the theme self-contained with no extra CDN dependency; override span colors to work on dark bg by adjusting hue while keeping readability)
- Copy-to-clipboard button: top-right corner (icon-only), appears on hover, `btn--icon` style

### 6.6 Inline Code

```
font-family:   $font-mono
font-size:     0.875em
background:    bg-elevated
color:         accent-light
padding:       0.15em 0.4em
border-radius: 4px
border:        1px solid border-subtle
```

### 6.7 Blockquote

```
border-left:   3px solid accent (#2563eb)
background:    bg-elevated
border-radius: 0 border-radius border-radius 0
padding:       0.5rem 1rem
color:         text-secondary
margin:        1rem 0
```

### 6.8 Callout / Alert Blocks

Hexo tag-plugin syntax: `{% note tip %}`, `{% note warning %}`, `{% note danger %}`, `{% note info %}`.

| Type    | Icon color   | Background      | Border                     |
|---------|--------------|-----------------|----------------------------|
| tip     | `success`    | `success-bg`    | `rgba(success, 0.4)`       |
| info    | `accent-light` | `info-bg`     | `rgba(accent, 0.3)`        |
| warning | `#fbbf24`    | `rgba(251,191,36,0.10)` | `rgba(251,191,36,0.30)` |
| danger  | `danger`     | `danger-bg`     | `rgba(danger, 0.4)`        |

Shared structure: `border-radius: 6px`, `padding: 12px 14px`, `font-size: 13px`, icon on the left (`flex-shrink: 0`), text `text-primary`.

### 6.9 Tables

```
width:           100%
border-collapse: collapse
margin:          1rem 0
font-size:       0.9rem
```

- `<th>`: background `bg-elevated`, color `text-secondary`, weight 600, border `border-subtle`, `padding: 0.5rem 0.75rem`
- `<td>`: border `border-subtle`, `padding: 0.5rem 0.75rem`
- Zebra stripe: `tr:nth-child(even) td { background: rgba(255,255,255,0.02) }`

### 6.10 Horizontal Rule

```
border: none
border-top: 1px solid border-subtle
margin: 1.5rem 0
```

### 6.11 Images

```
max-width:     100%
height:        auto
border-radius: border-radius (6px)
```

Captions (`<figcaption>`): `text-muted`, `font-size: 12px`, centered, `margin-top: 6px`.

### 6.12 Pagination

- Buttons: `btn--ghost` style
- Current page number: `btn--primary` style (accent background, white text)
- Gap (`…`): `text-muted`

### 6.13 Search

- Input: `.form-input` style (see §8.2)
- Results dropdown: `bg-elevated`, border `border-subtle`, `box-shadow: 0 8px 24px rgba(0,0,0,0.5)`
- Matched text: highlighted with `accent-glow` background, `accent-light` color
- No-results text: `text-muted`

### 6.14 Footer

- Background: `bg-surface`
- Top border: `1px solid border-subtle`
- Text: `text-muted`, `font-size: 13px`
- Links: `accent-light`, hover `accent-hover`
- Layout: centered or two-column (links left, copyright right)

### 6.15 404 / Error Page

- Large error code: H1 scale, `accent` color
- Message: `text-secondary`
- "Go home" button: `btn--primary`

---

## 7. Button Variants

| Variant       | Background                      | Text            | Border                  | Hover                                        |
|---------------|---------------------------------|-----------------|-------------------------|----------------------------------------------|
| `primary`     | `accent` (`#2563eb`)            | `#fff`          | none                    | bg → `accent-hover` (`#3b82f6`)              |
| `ghost`       | transparent                     | `text-secondary`| `border-subtle`         | bg `bg-elevated`, text `text-primary`, border `border-focus` |
| `icon`        | transparent                     | `text-secondary`| none                    | bg `bg-elevated`, text `text-primary`        |
| `coffee`/sponsor | `rgba(251,191,36,0.10)`     | `#fbbf24`       | `rgba(251,191,36,0.30)` | bg `rgba(251,191,36,0.18)`, border `rgba(251,191,36,0.55)`, text `#fcd34d` |

Shared button properties:
- `padding: 7px 14px`
- `border-radius: 6px`
- `font-size: 13px`
- `font-weight: 500`
- `transition: background 0.15s ease, color 0.15s ease, box-shadow 0.15s ease`
- Disabled: `opacity: 0.45; cursor: not-allowed`
- Small modifier (`btn--sm`): `padding: 4px 10px; font-size: 12px`

---

## 8. Form Elements

### 8.1 Labels

`12px`, weight 500, `text-secondary`, uppercase, `letter-spacing: 0.05em`.

### 8.2 Text Inputs / Textareas / Selects

```
background:    bg-input   (#152b52)
border:        1px solid border-subtle
border-radius: 6px
color:         text-primary
padding:       8px 12px
font-size:     13px
width:         100%
transition:    border-color 0.15s ease, box-shadow 0.15s ease
```

- Placeholder: `text-muted`
- Focus: `border-color: border-focus`, `box-shadow: 0 0 0 3px accent-glow`
- `<select>` custom chevron arrow: `rgba(64,116,139,1)` fill, `right: 12px center`

---

## 9. Transitions

| Token             | Value         | Usage                                        |
|-------------------|---------------|----------------------------------------------|
| `transition-fast` | `0.15s ease`  | Hover states, dropdowns open/close           |
| `transition-normal`| `0.25s ease` | Modals, backdrop fade, settings panel slide  |

---

## 10. Animations

### 10.1 Toast / Notification entrance

```css
@keyframes toast-in {
  from { opacity: 0; transform: translateY(8px) scale(0.97); }
  to   { opacity: 1; transform: translateY(0)   scale(1);    }
}
duration: 0.2s ease
```

### 10.2 Spinner

```css
@keyframes spin {
  to { transform: rotate(360deg); }
}
width: 14px; height: 14px
border: 2px solid rgba(255,255,255,0.3)
border-top-color: #fff
border-radius: 50%
animation: spin 0.7s linear infinite
```

### 10.3 Fade-in (page load)

Post cards and sidebar widgets fade in staggered via `opacity 0 → 1` over `0.25s ease`, `delay: 0ms, 50ms, 100ms…` per item. Maximum `5` staggered items — after that no delay.

---

## 11. Toast / Notification Component

Fixed bottom-right, `20px` from edges, `max-width: 360px`, stacked with `8px` gap.

```
background:    bg-elevated
border:        1px solid border-subtle
border-radius: 6px
padding:       12px 14px
font-size:     13px
line-height:   1.4
box-shadow:    0 8px 24px rgba(0,0,0,0.4)
```

| Type      | Border                  | Background (tinted)             | Icon color    |
|-----------|-------------------------|---------------------------------|---------------|
| `success` | `rgba(success, 0.4)`    | mix(bg-elevated, success, 90%)  | `success`     |
| `error`   | `rgba(danger, 0.4)`     | mix(bg-elevated, danger, 90%)   | `danger`      |
| `info`    | `rgba(accent, 0.3)`     | `bg-elevated`                   | `accent-light`|

Auto-dismiss after `3.5s`. Close (×) button: `text-muted`, hover `text-primary`.

---

## 12. Backdrop / Overlay

```
background:     rgba(0,0,0,0.5)
backdrop-filter: blur(2px)
z-index:        10
opacity:        0 → 1 on open (transition-normal 0.25s)
```

---

## 13. Favicon & Brand Assets

- Favicon: SVG preferred — dark rounded background (`#050d1a`), blue accent lines, white arrow motif (matches the md2epub logo).
- Provide `favicon.ico` as fallback.
- Social preview card (OG image): `1200×630px`, dark `#050d1a` background with centered blog title in `text-primary`.

---

## 14. Scrollbar (Webkit)

```css
::-webkit-scrollbar       { width: 6px; height: 6px; }
::-webkit-scrollbar-track { background: bg-base; }
::-webkit-scrollbar-thumb { background: border-subtle; border-radius: 3px; }
::-webkit-scrollbar-thumb:hover { background: text-muted; }
```

---

## 15. Theme Configuration (`_config.yml` surface)

The following keys should be exposed in the theme's `_config.yml` so users can customise without touching source:

```yaml
# Navbar
navbar:
  title: "My Blog"
  links:
    - name: Home
      url: /
    - name: Archive
      url: /archives
    - name: About
      url: /about

# Sidebar
sidebar:
  position: right           # left | right | hidden
  widgets:
    - recent_posts
    - tags
    - archives
    - about

# Sponsor / Donation button (amber button in navbar)
sponsor:
  enabled: false
  label: "Buy me a coffee"
  url: ""

# Social links (footer + about widget)
social:
  github: ""
  twitter: ""
  rss: true

# Reading time estimate
reading_time: true          # shows "N min read" on post cards and post header

# Code block
code:
  copy_button: true         # show copy-to-clipboard button
  language_label: true      # show language tag top-right

# Post card cover image
cover:
  default: ""               # fallback image path if no cover set
  aspect_ratio: "16/9"
```

---

## 16. File Structure (reference, not prescriptive)

```
themes/coldnight/
├── _config.yml          ← theme defaults
├── layout/
│   ├── _partial/
│   │   ├── head.ejs
│   │   ├── header.ejs   ← navbar
│   │   ├── footer.ejs
│   │   ├── sidebar.ejs
│   │   ├── post-card.ejs
│   │   ├── pagination.ejs
│   │   ├── toast.ejs
│   │   └── widgets/
│   │       ├── recent-posts.ejs
│   │       ├── tag-cloud.ejs
│   │       └── archive.ejs
│   ├── index.ejs
│   ├── post.ejs
│   ├── archive.ejs
│   ├── tag.ejs
│   ├── category.ejs
│   └── 404.ejs
├── source/
│   ├── css/
│   │   ├── _variables.styl   ← all tokens from §2–§5
│   │   ├── _base.styl
│   │   ├── _typography.styl  ← prose rules
│   │   ├── _layout.styl
│   │   ├── _components.styl  ← buttons, forms, toasts, cards
│   │   ├── _code.styl        ← code blocks + hljs overrides
│   │   └── style.styl        ← entry point, imports all
│   └── js/
│       ├── nav.js            ← mobile hamburger toggle
│       ├── copy-code.js      ← copy-to-clipboard
│       └── search.js         ← local search (optional)
└── scripts/
    └── helpers.js            ← reading-time helper, etc.
```

---

## 17. Accessibility Requirements

- All interactive elements must have a visible focus ring (`box-shadow: 0 0 0 3px accent-glow`)
- Color contrast: `text-primary` (`#e2e8f0`) on `bg-base` (`#050d1a`) → ≈ 14:1 (AAA)
- Color contrast: `text-secondary` (`#94a3b8`) on `bg-base` → ≈ 6.5:1 (AA)
- Color contrast: `accent-light` (`#60a5fa`) on `bg-base` → ≈ 6.9:1 (AA)
- Skip-to-main-content link at top of `<body>`, visually hidden until focused
- `<nav>` landmark with `aria-label="Main navigation"`
- `aria-current="page"` on the active nav link
- Images must have `alt` attributes; decorative images use `alt=""`
- Mobile nav toggle uses `aria-expanded` and `aria-controls`
