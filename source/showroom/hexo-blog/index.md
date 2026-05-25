---
title: "Hexo Blog"
subtitle: "Static site powered by the coldnight theme"
cover_image: /images/showroom/hexo-blog.png
layout: project
date: 2026-05-01
ai_assisted: true
---

A personal blog built with Hexo 8 and the coldnight dark theme. Features include a 3-column post grid, full-text search, LightGallery image viewer, KaTeX math rendering, Mermaid diagram support, PDF preview, and ePub export.

## Stack

- **Generator**: Hexo 8
- **Theme**: coldnight (custom)
- **Renderer**: hexo-renderer-dartsass, hexo-renderer-marked
- **Deployment**: GitHub Pages via GitHub Actions

## Features

- Dark, minimal design with configurable sidebar
- Post grid with reading-time estimates and cover images
- Keyboard navigation and accessibility features
- Tag plugin ecosystem: `{% gallery %}`, `{% note %}`, `{% tabs %}`, `{% timeline %}`, `{% spoiler %}`, `{% download %}`, `{% video %}`, `{% pdf %}`
- In-page PDF preview via PDF.js — lazy-loaded modal with page navigation and zoom
