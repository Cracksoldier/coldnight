---
title: "Audio Player Demo"
date: 2026-06-03
updated: 2026-06-03
categories: [Demo]
tags: [audio, theme]
excerpt: "Demonstrating the built-in audio player tag — themed controls, seek bar, mute, and keyboard navigation."
---

The `{% raw %}{% audio %}{% endraw %}` tag embeds a styled audio player that matches the blog's dark theme. Controls are fully custom — no browser chrome — with a scrubable progress bar, mute toggle, and keyboard support.

<!-- more -->

## Basic embed

Minimal usage — just a `src`. The title falls back to the filename.

{% audio src="/audio/sample.mp3" %}

## With title and caption

{% audio src="/audio/ambient.mp3" title="Ambient tone" caption="528 Hz sine wave — 8 seconds" %}

## Multiple players

Both players can exist on the same page. Starting one automatically pauses the other.

{% audio src="/audio/sample.mp3" title="Track A — 440 Hz" %}

{% audio src="/audio/ambient.mp3" title="Track B — 528 Hz" %}

## Tag reference

```
{% audio src="/audio/file.mp3" %}
{% audio src="/audio/file.mp3" title="Display name" caption="Optional caption below the player" %}
```

| Parameter | Required | Notes |
|-----------|----------|-------|
| `src`     | yes      | Path to audio file (`.mp3`, `.ogg`, `.wav`, `.flac`, `.m4a`) |
| `title`   | no       | Player label; defaults to the filename |
| `caption` | no       | Small muted text rendered below the player |

**Keyboard controls:** focus the seek bar and use ← / → to jump ±5 seconds.

To disable the player site-wide, set `audio_player: false` in your theme config.
