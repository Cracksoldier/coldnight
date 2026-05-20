---
title: CSS Layout Techniques Worth Knowing
date: 2026-04-03 10:00:00
categories: [Design]
tags: [css, layout, grid, flexbox, frontend]
cover_image: https://placeholdpicsum.dev/800x450
excerpt: Grid, Flexbox, container queries, and logical properties — the layout tools that make responsive design feel natural rather than fought against.
---

CSS layout has come a long way. These are the techniques worth reaching for in 2026.

## CSS Grid — the post card grid used on this blog

```css
/* The exact grid this theme uses for post index/archive pages */
.post-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}

@media (max-width: 1024px) {
  .post-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 640px) {
  .post-grid {
    grid-template-columns: 1fr;
  }
}
```

### auto-fill vs auto-fit

```css
/* auto-fill: keeps empty column tracks */
.gallery-fill {
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
}

/* auto-fit: collapses empty tracks — items stretch to fill */
.gallery-fit {
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
}
```

---

## Flexbox — the sidebar layout

```css
/* Two-column page shell: main content + sidebar */
.page-wrapper {
  display: flex;
  gap: 24px;
  max-width: 1100px;
  margin: 0 auto;
}

.main-content { flex: 1 1 65%; min-width: 0; }
.sidebar      { flex: 0 0 calc(35% - 24px); }

/* Stack vertically on mobile */
@media (max-width: 640px) {
  .page-wrapper { flex-direction: column; }
  .sidebar      { display: none; }
}
```

{% note warning %}
Always set `min-width: 0` on flex children that contain text or code. Without it, the flex item won't shrink below its content's intrinsic size, causing overflow.
{% endnote %}

---

## Container queries

Container queries scope responsive rules to an element's own size rather than the viewport, making components truly portable.

```css
/* Define a containment context */
.card-grid {
  container-type: inline-size;
  container-name: grid;
}

/* Respond to the container's width, not the viewport */
@container grid (max-width: 480px) {
  .card {
    flex-direction: column;
  }

  .card__thumbnail {
    width: 100%;
    aspect-ratio: 16 / 9;
  }
}
```

---

## Logical properties

Logical properties (`margin-inline`, `padding-block`, `border-inline-start`) adapt to writing direction automatically, making internationalisation free.

```css
/* Physical (writing-direction aware in LTR only) */
.blockquote {
  margin-left: 1rem;
  border-left: 3px solid #2563eb;
  padding-left: 1rem;
}

/* Logical (works in both LTR and RTL) */
.blockquote {
  margin-inline-start: 1rem;
  border-inline-start: 3px solid #2563eb;
  padding-inline-start: 1rem;
}
```

---

## :has() — the parent selector

```css
/* Style a form field differently when its input is focused */
.field:has(input:focus) .field__label {
  color: #60a5fa;
}

/* Hide the sidebar when the page has no aside element */
.page-wrapper:not(:has(aside)) .main-content {
  max-width: 780px;
  margin-inline: auto;
}
```

---

## Subgrid

```css
.card-row {
  display: grid;
  grid-template-rows: subgrid;
  grid-row: span 4; /* cover, title, excerpt, footer */
}

/* All cards in a row share the same row tracks,
   so titles and footers line up regardless of content length */
```

{% note info %}
Subgrid has broad support as of 2024. Check caniuse before using it in production without a fallback.
{% endnote %}
