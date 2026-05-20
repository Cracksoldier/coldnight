---
title: "Timelines — the timeline block tag"
date: 2026-05-20 14:00:00
categories: [Documentation]
tags: [timeline, features, markdown]
cover_image: https://placeholdpicsum.dev/800x450
excerpt: "The timeline block tag renders vertical timelines for changelogs, career histories, and project journals — all at build time, zero runtime JavaScript."
---

The `timeline` block tag renders a vertical timeline directly in your post — build time only, zero runtime JavaScript. Wrap your entries in the opening and closing timeline tag. Each entry supports full Markdown in its body.

## Basic syntax

Each entry opens with an HTML comment marker and closes with `<!-- endentry -->`:

| Element | Format |
|---------|--------|
| Entry start | `<!-- entry DATE :: Title -->` |
| Entry body | Plain text or Markdown |
| Entry end | `<!-- endentry -->` |

The `::` separates the date label (left) from the title (right). Both are optional — you can have a date only, a title only, or neither. Order is author-controlled; entries are never auto-sorted.

---

## Changelog

The most common use-case: documenting software releases in reverse-chronological order.

{% timeline %}
<!-- entry 2026-05-20 :: v1.3.0 -->
- Added the `timeline` tag plugin for changelogs and career timelines
- Added mobile TOC drawer — floating button slides up a bottom-sheet on `≤640px` viewports
- Fixed `toc.js` load condition; scroll-spy now works when sidebar is hidden
<!-- endentry -->
<!-- entry 2026-03-01 :: v1.2.0 -->
- KaTeX math rendering — `$...$` and `$$...$$` converted to HTML at build time
- Mermaid diagram support — fenced ` ```mermaid ` blocks rendered to SVG
- Series posts — `series:` front-matter groups posts into a numbered nav strip
<!-- endentry -->
<!-- entry 2026-01-10 :: v1.1.0 -->
- Full-text search with lazy fetch, AND matching, and keyboard navigation
- Reading progress bar and back-to-top button
- Open Graph and Twitter Card meta tags
- CSS-only multi-tab content blocks
<!-- endentry -->
<!-- entry 2025-11-20 :: v1.0.0 -->
Initial public release.

- 3-column responsive post grid with cover images
- LightGallery v2 integration — auto-mount and explicit gallery tag
- Archive, tag, and category pages with year-grouped lists
- Sidebar with TOC, recent posts, tag cloud, and archive widgets
<!-- endentry -->
{% endtimeline %}

---

## Career history

Works equally well for a CV-style timeline. The date label can be a range, a year, or any string.

{% timeline %}
<!-- entry 2024 – present :: Senior Engineer, Acme Corp -->
Working on the platform team. Currently leading a migration from a monolithic Rails app to a set of Go microservices behind an API gateway.

Key projects:
- Zero-downtime database migration for a 200 M-row table
- Replaced a hand-rolled job queue with Redis Streams — cut P99 processing latency from 4 s to 180 ms
- Introduced ADR (Architecture Decision Records) across the engineering org
<!-- endentry -->
<!-- entry 2021 – 2024 :: Software Engineer, Startup Inc -->
Full-stack engineer on a three-person product team. Wore every hat from backend to DevOps.

```
Stack: TypeScript · React · Node.js · PostgreSQL · AWS
```

Shipped the initial public product from scratch, grew it to 15 k MAU before acquisition.
<!-- endentry -->
<!-- entry 2019 – 2021 :: Junior Developer, Agency XYZ -->
Built client sites and internal tooling. First real exposure to CI/CD, code review, and production incidents.
<!-- endentry -->
{% endtimeline %}

---

## Project milestones

Good for tracking the history of a single project.

{% timeline %}
<!-- entry 2026-04-01 :: Public beta -->
Opened access to the first 500 external testers. Onboarding funnel conversion held at 68%, above the 60% target.

{% note info %}
Feedback from the beta cohort drove 14 of the 22 items in the v1.0 backlog.
{% endnote %}
<!-- endentry -->
<!-- entry 2026-02-14 :: Internal alpha -->
First end-to-end working version deployed to staging. Core feature set complete; performance and polish work remaining.
<!-- endentry -->
<!-- entry 2025-12-01 :: Project kick-off -->
Team assembled. Agreed on tech stack, design language, and a 16-week delivery timeline.
<!-- endentry -->
{% endtimeline %}

---

## Date-free and title-free entries

Both the date and the title are optional. You can omit either, or omit both and let the body speak for itself.

{% timeline %}
<!-- entry :: Title only, no date -->
This entry has a title but no date label. Useful when the exact date is unknown or irrelevant.
<!-- endentry -->
<!-- entry 2026-01-01 -->
This entry has a date but no title. The content stands alone.
<!-- endentry -->
{% endtimeline %}
