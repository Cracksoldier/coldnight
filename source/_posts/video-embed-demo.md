---
title: "Video Embed Demo"
date: 2026-07-11
updated: 2026-07-11
categories: [Demo]
tags: [video, theme]
excerpt: "Demonstrating the click-to-load video facade — no YouTube or Vimeo iframe loads until you press play."
---

The `{% raw %}{% video %}{% endraw %}` tag embeds YouTube and Vimeo videos behind a privacy-friendly click-to-load facade: the page makes no third-party player request until you actually press play. YouTube shows its cookie-free thumbnail; Vimeo gets a themed placeholder with zero external requests. Without JavaScript the facade is a plain link to the video page.

<!-- more -->

## YouTube

The thumbnail comes from `i.ytimg.com` (no cookies), and the player injected on click uses the `youtube-nocookie.com` domain.

{% video https://www.youtube.com/watch?v=aqz-KE-bpKQ Big Buck Bunny — Blender Foundation %}

## Vimeo

Vimeo has no static thumbnail URL, so the facade shows a themed placeholder instead — not a single third-party request before the click.

{% video https://vimeo.com/1084537 Big Buck Bunny on Vimeo %}

## Parameters

| Parameter | Required | Notes |
|-----------|----------|-------|
| URL | yes | YouTube watch/short URL, Vimeo URL, or a direct `.mp4`/`.webm`/`.ogv` file |
| Caption | no | Everything after the URL; shown below the frame and used as the player title |

Direct video files render a native `<video>` element (no facade needed — nothing third-party about them). Set `video_facade: false` in the theme config to restore eager iframes.
