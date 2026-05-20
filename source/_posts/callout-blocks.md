---
title: Callout Blocks & Alerts
date: 2026-05-01 11:00:00
categories: [Documentation]
tags: [callouts, markdown, features]
cover_image: https://placeholdpicsum.dev/800x450
excerpt: The four callout types — tip, info, warning, and danger — rendered with the coldnight colour palette and inline SVG icons.
---

Callout blocks draw the reader's eye to important information without interrupting the flow of prose. Use the `{% note type %}` tag plugin to insert them.

## Tip

{% note tip %}
Use `<!-- more -->` in a post to set the excerpt boundary. Everything before it appears on post cards; everything after is hidden until the reader clicks through.
{% endnote %}

## Info

{% note info %}
LightGallery is loaded from the jsDelivr CDN **only on post pages**. Index, archive, tag, and category pages do not request the library, keeping their page weight minimal.
{% endnote %}

## Warning

{% note warning %}
Changing `per_page` in `_config.yml` after publishing breaks existing pagination URLs like `/page/2/`. If you must change it, set up redirects for old paginated pages.
{% endnote %}

## Danger

{% note danger %}
Never commit your `_config.yml` if it contains a deploy `repository:` URL with embedded credentials. Use environment variables or a `.env` file excluded from git instead.
{% endnote %}

---

## Multiple callouts together

The four types are designed to sit next to each other without clashing.

{% note tip %}
**Tip:** This is a tip. Use it to suggest best practices or shortcuts.
{% endnote %}

{% note info %}
**Info:** Background context the reader should know but doesn't need to act on right now.
{% endnote %}

{% note warning %}
**Warning:** Something to watch out for — not immediately dangerous, but worth noting.
{% endnote %}

{% note danger %}
**Danger:** Stop. Read this before proceeding. Irreversible consequences possible.
{% endnote %}

---

## Callouts with code inside

{% note info %}
To create a new post, run:

```bash
hexo new post "My Post Title"
```

Hexo will create `source/_posts/my-post-title.md` pre-filled with the scaffold front-matter.
{% endnote %}

{% note warning %}
The `gallery` tag requires each image to be on its own line inside the block. Putting multiple images on a single line will result in only the first image being parsed. Always use one `![alt](url)` per line.
{% endnote %}
