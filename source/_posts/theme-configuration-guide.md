---
title: Configuring the Coldnight Theme
date: 2026-03-13 10:00:00
categories: [Documentation]
tags: [hexo, theme, configuration, setup]
cover_image: https://placeholdpicsum.dev/800x450
excerpt: A complete walkthrough of every option in themes/coldnight/_config.yml — navbar, sidebar, LightGallery, sponsor button, and more.
---

All theme options live in `themes/coldnight/_config.yml`. You can override any of them in the root `_config.yml` under `theme_config:` without touching the theme source.

## Navbar

```yaml
navbar:
  title: "My Blog"          # displayed next to the logo (hidden below 1024px)
  links:
    - name: Home
      url: /
    - name: Archive
      url: /archives
    - name: Tags
      url: /tags
    - name: About
      url: /about
```

The active link is highlighted with `accent-light` text on an `accent-glow` background. `aria-current="page"` is also set for assistive technology.

## Sidebar

```yaml
sidebar:
  position: right      # left | right | hidden
  widgets:
    - recent_posts     # last 5 posts by date
    - tags             # all tags as pills
    - archives         # posts grouped by year
    - about            # author name, bio, avatar, social links
```

Set `position: hidden` to remove the sidebar entirely — the main content will expand to fill the full width.

## Sponsor / coffee button

```yaml
sponsor:
  enabled: true
  label: "Buy me a coffee"
  url: "https://ko-fi.com/yourname"
```

Renders as an amber-tinted button in the navbar when enabled. Uses a dedicated colour palette distinct from the blue accent so it stands out without clashing.

## Social links

```yaml
social:
  github: "yourname"        # appended to https://github.com/
  twitter: "yourname"       # appended to https://twitter.com/
  rss: true                 # adds <link rel="alternate"> and an RSS link in the footer
```

Social links appear in the navbar (GitHub icon button), the footer, and the About sidebar widget.

## Reading time

```yaml
reading_time: true
```

Displays an estimate like `"4 min read"` on post cards and in the post metadata bar. Calculated at `~200 words per minute` by the `reading_time()` Hexo helper.

## Code blocks

```yaml
code:
  copy_button: true      # clipboard icon in the top-left of each code block
  language_label: true   # language name chip in the top-right corner
```

{% note info %}
The language label is injected at build time by a Hexo `after_render:html` filter. It adds `data-lang` to every `<figure class="highlight <lang>">` so the CSS `::before` rule can display it.
{% endnote %}

## Cover images

```yaml
cover:
  default: "/images/default-cover.jpg"
  aspect_ratio: "16/9"
```

Set `cover_image` in a post's front-matter to use a per-post image. If omitted, `cover.default` is used. If that is also empty, the card renders without a cover image.

```yaml
---
title: My Post
cover_image: https://example.com/my-cover.jpg
---
```

## LightGallery

```yaml
lightgallery:
  enabled: true          # load CDN assets (CSS + JS)
  auto_mount: true       # wire up all .post-body images automatically
  zoom: true             # enable pinch-to-zoom and scroll zoom
  thumbnail: true        # show thumbnail strip at the bottom of the lightbox
```

Disable `auto_mount` to opt out of the automatic wiring and use only explicit `{% gallery %}` blocks. Add `class="no-gallery"` to individual images to exclude them from auto-mount.

---

## Post front-matter reference

| Key | Type | Description |
|-----|------|-------------|
| `title` | string | Post title shown in H1 and the browser tab |
| `date` | datetime | Publication date, used for ordering and display |
| `categories` | list | First category shown as a pill on post cards |
| `tags` | list | All tags shown at the bottom of a post |
| `cover_image` | string | URL or path to the cover image |
| `excerpt` | string | Override the auto-generated excerpt on post cards |

Set the excerpt boundary inside the post body with `<!-- more -->` instead of the `excerpt` key if you want the card to show a natural cut from the post content.
