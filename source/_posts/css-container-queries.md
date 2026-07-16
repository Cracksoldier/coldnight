---
title: CSS Container Queries in Practice
date: 2025-05-22 09:00:00
categories: [Web]
tags: [css, responsive-design, frontend]
excerpt: Container queries let components respond to the size of their container rather than the viewport. After a year of using them in production, here's what actually changes about how you write CSS.
---

{% note info %}
This post has no `cover_image` in its front-matter — the cover on its index card is the site-wide `cover.default` fallback (`/images/og-default.jpg`), which also serves as the `og:image` for social previews.
{% endnote %}

Container queries landed in all major browsers in late 2023. A year of using them in real projects has clarified where they genuinely help and where media queries are still the right tool.

## The problem they solve

Media queries couple a component's layout to the viewport size. That works when a component always appears in the same position on the page, but breaks down when a component is reused in contexts of different widths — a card that appears at full width on mobile, in a two-column grid on tablet, and in a sidebar on desktop.

With a media query you end up with something like:

```css
.card { /* full width styles */ }

@media (min-width: 768px) { .card { /* two-column styles */ } }
@media (min-width: 1024px) { .main-content .card { /* wide styles */ } }
@media (min-width: 1024px) { .sidebar .card { /* narrow styles */ } }
```

The component's layout is now tangled with knowledge of where it's placed. Container queries decouple the two.

## Basic syntax

```css
/* Establish a containment context */
.card-wrapper {
  container-type: inline-size;
}

/* Style the card based on its container's width */
.card {
  display: block;
}

@container (min-width: 400px) {
  .card {
    display: grid;
    grid-template-columns: 200px 1fr;
  }
}
```

The `.card` now switches layout at 400px of its *container*, not the viewport. Drop it in a narrow sidebar or a wide main area — it adapts correctly either way.

## Named containers

When components are nested, you can name containers to query a specific ancestor:

```css
.layout {
  container-type: inline-size;
  container-name: layout;
}

.sidebar {
  container-type: inline-size;
  container-name: sidebar;
}

@container layout (min-width: 900px) {
  .nav { flex-direction: row; }
}

@container sidebar (max-width: 280px) {
  .widget { font-size: 0.875rem; }
}
```

## Container units

Container queries come with their own unit set: `cqw` (1% of container width), `cqh`, `cqi` (inline), `cqb` (block), `cqmin`, `cqmax`.

```css
.card__title {
  font-size: clamp(1rem, 4cqi, 1.5rem);
}
```

The title scales with the container width, clamped between 1rem and 1.5rem. No JavaScript, no resize observer.

## Where media queries still win

Container queries don't replace media queries — they complement them. Use media queries for:

- **Page-level layout changes** — switching from a single column to a sidebar layout
- **Global typography scaling** — base font size relative to viewport
- **Anything that genuinely depends on screen size** — print styles, orientation

Container queries are for **component-level adaptation** — how a component looks given the space it has been given.

## A practical example: a stat card

```css
.stat-card-wrapper {
  container-type: inline-size;
}

.stat-card {
  padding: 1rem;
}

.stat-card__value {
  font-size: 1.5rem;
  font-weight: 700;
}

.stat-card__label {
  font-size: 0.875rem;
  color: #666;
}

/* When the card has room, lay out value and label side by side */
@container (min-width: 240px) {
  .stat-card {
    display: flex;
    align-items: baseline;
    gap: 0.75rem;
  }

  .stat-card__value {
    font-size: 2rem;
  }
}
```

This stat card stacks vertically in a narrow column and goes horizontal when it has the space — without any JavaScript or knowledge of where on the page it lives.

## Browser support

Container queries have full support in Chrome 105+, Safari 16+, and Firefox 110+. If you need to support older browsers, the `@container` block is safely ignored, so you can layer it on top of existing media query styles.
