---
title: Typography & Prose Elements
date: 2026-05-08 09:00:00
categories: [Design]
tags: [typography, markdown, writing]
cover_image: https://picsum.photos/seed/typo/800/450
excerpt: Every markdown element rendered through the coldnight prose stylesheet — headings, lists, tables, blockquotes, and more.
---

This post renders every standard prose element so you can verify the typography styles in one place.

## Headings

# H1 — Page Title
## H2 — Section
### H3 — Subsection
#### H4 — Detail

---

## Body Text

Paragraph text is set at 16px with a line-height of 1.7, giving comfortable reading density. **Bold text** uses font-weight 600. *Italic text* is used for emphasis or foreign terms. `Inline code` renders in the mono stack with a subtle blue tint.

You can also use ~~strikethrough~~ for corrections, and [links go to `accent-light` blue](#) with a hover transition.

---

## Lists

### Unordered

- First item at the top level
- Second item
  - Nested item A
  - Nested item B
    - Doubly nested
- Third item

### Ordered

1. Clone the repository
2. Install dependencies with `npm install`
3. Copy `_config.example.yml` to `_config.yml`
4. Run `hexo server` and open `http://localhost:4000`

### Task list (via HTML)

<ul>
  <li>✅ Color tokens defined in _variables.styl</li>
  <li>✅ Post grid — 3 columns, responsive</li>
  <li>✅ LightGallery integration</li>
  <li>✅ Syntax highlighting with language labels</li>
  <li>☐ Comments system (optional)</li>
</ul>

---

## Blockquotes

> The best themes are the ones you don't notice. They get out of the way and let the content speak.

Nested blockquote:

> Premature optimisation is the root of all evil.
>
> — Donald Knuth

---

## Tables

| Language | Paradigm | Typing | First Released |
|----------|----------|--------|---------------|
| JavaScript | Multi-paradigm | Dynamic | 1995 |
| TypeScript | OOP / Functional | Static | 2012 |
| Python | Multi-paradigm | Dynamic | 1991 |
| Rust | Systems | Static | 2015 |
| Go | Concurrent | Static | 2009 |

Table cells can contain `inline code` and **bold** text without issue.

---

## Horizontal Rule

Three or more dashes produce a rule:

---

## Images

Standard markdown images get `border-radius: 6px` and are lazy-loaded. Clicking them opens the LightGallery lightbox.

![A placeholder landscape photo](https://picsum.photos/seed/typo1/800/400)

![Abstract architecture](https://picsum.photos/seed/typo2/800/400)

---

## Code in prose

Referring to a CSS variable like `--lg-toolbar-background-color` or a file path like `themes/coldnight/source/css/_variables.styl` in running text is handled by inline code styling.

Multi-word references such as `hexo.extend.filter.register` are readable thanks to the `accent-light` color on a subtle `bg-elevated` background.
