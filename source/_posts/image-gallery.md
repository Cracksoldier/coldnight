---
title: Image Galleries with LightGallery
date: 2026-04-24 14:00:00
categories: [Design]
tags: [images, gallery, lightgallery]
cover_image: https://placeholdpicsum.dev/800x450
excerpt: Two ways to add image galleries — the auto-mount feature on regular post images, and the explicit gallery tag for curated grids.
---

The coldnight theme ships with [LightGallery v2](https://www.lightgalleryjs.com/) for full-screen image viewing. There are two ways to use it.

## Auto-mount (click any post image)

Any `<img>` tag inside a post body is automatically wired up. Click the image below to open it in the lightbox. Add `class="no-gallery"` to an image to opt out.

![Mountain lake at dusk](https://placeholdpicsum.dev/900x600)

![Aerial view of a forest path](https://placeholdpicsum.dev/900x600)

![City skyline at night](https://placeholdpicsum.dev/900x600)

When you click any of the images above, LightGallery opens in full-screen with a thumbnail strip at the bottom. Use arrow keys or swipe to navigate. Press `Escape` or click the backdrop to close.

---

## Explicit gallery grid

Use the `{% gallery %}` tag to create a curated grid. Images are arranged in a configurable number of columns and all open in the same lightbox session.

### 3-column grid (default)

{% gallery 3 %}
![Abstract blue waves](https://placeholdpicsum.dev/600x400)
![Forest in fog](https://placeholdpicsum.dev/600x400)
![Desert dunes at sunset](https://placeholdpicsum.dev/600x400)
![Snowy mountain peak](https://placeholdpicsum.dev/600x400)
![Calm ocean horizon](https://placeholdpicsum.dev/600x400)
![Autumn leaves close-up](https://placeholdpicsum.dev/600x400)
{% endgallery %}

### 2-column grid

{% gallery 2 %}
![Modern architecture](https://placeholdpicsum.dev/800x600)
![Bridge at sunset](https://placeholdpicsum.dev/800x600)
![Urban street art](https://placeholdpicsum.dev/800x600)
![Rainy city reflections](https://placeholdpicsum.dev/800x600)
{% endgallery %}

---

## Opt-out example

This image uses `class="no-gallery"` so clicking it will not open the lightbox:

<img src="https://placeholdpicsum.dev/600x300" alt="This image is excluded from the gallery" class="no-gallery">

---

## How it works

Both modes use the same LightGallery instance. The CDN scripts load **only on post pages**, controlled by `theme.lightgallery.enabled` in `themes/coldnight/_config.yml`. Setting it to `false` removes all CDN requests site-wide.
