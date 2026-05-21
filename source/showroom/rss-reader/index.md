---
title: "RSS Reader"
subtitle: "Minimal feed aggregator"
cover_image: /images/showroom/rss-reader.jpg
layout: project
date: 2026-01-25
---

A self-hosted RSS aggregator with a clean reading interface. Feeds are stored in a SQLite database; new items are fetched on a configurable cron schedule. The UI is server-rendered HTML — no client-side JavaScript except for the "mark as read" toggle.

## Architecture

- **Backend**: Fastify + better-sqlite3
- **Frontend**: Server-rendered EJS templates + minimal CSS
- **Deployment**: Single binary via `pkg`, runs on a Raspberry Pi

## Screenshot

The reading view strips all ads and tracking pixels, presenting only the article title, source, and content.
