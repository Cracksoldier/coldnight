---
title: "Git Dashboard"
subtitle: "Local repository activity overview"
cover_image: /images/showroom/git-dashboard.jpg
layout: project
date: 2025-09-30
---

A terminal dashboard that displays activity across all local Git repositories. Scans a configurable list of directories, fetches recent commits, and renders a unified activity feed grouped by day.

## Display

```
Today
  ● my-blog       feat: add showroom page          2 min ago
  ● cli-tool      fix: handle missing config        1 h ago

Yesterday
  ● design-system chore: update spacing tokens     10 h ago
  ● rss-reader    feat: add OPML import            14 h ago
```

## Tech

- **Runtime**: Node.js
- **UI**: `blessed` (terminal UI library)
- **Git**: `simple-git` for repository introspection
