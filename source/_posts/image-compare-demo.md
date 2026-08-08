---
title: "Image Compare Slider Demo"
date: 2026-07-02
updated: 2026-07-02
categories: [Demo]
tags: [images, theme]
cover_image: https://picsum.photos/800/450
excerpt: "Demonstrating the built-in before/after compare slider tag — drag, touch, or use arrow keys to reveal the difference."
---

The `{% raw %}{% compare %}{% endraw %}` tag renders two stacked images with a draggable divider. It's built on a native range input, so pointer, touch, and keyboard (arrow keys) all work out of the box — without JavaScript it falls back to a static 50/50 split.

<!-- more -->

## Basic usage

Only `before` and `after` are required. Labels default to "Before" and "After".

{% compare before="/images/showroom/cli-tool.png" after="/images/showroom/design-system.png" %}

## Custom labels and caption

{% compare before="/images/showroom/hexo-blog.png" after="/images/showroom/og-generator.png" label_before="v1 palette" label_after="v2 palette" caption="Mock redesign comparison — drag the divider or focus the slider and use ← / →." %}

## Parameters

| Parameter | Required | Notes |
|-----------|----------|-------|
| `before` | yes | Image shown on the left of the divider |
| `after` | yes | Image shown on the right of the divider |
| `label_before` | no | Corner label, defaults to "Before" |
| `label_after` | no | Corner label, defaults to "After" |
| `caption` | no | Muted text rendered below the frame |

Both images should share the same aspect ratio — the *after* image defines the frame size and the *before* image is clipped over it.
