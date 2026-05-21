---
title: "CLI Tool"
subtitle: "Developer productivity scripts"
cover_image: /images/showroom/cli-tool.jpg
layout: project
date: 2026-03-20
---

A collection of Node.js CLI utilities for automating repetitive development tasks: scaffolding new projects, running local mock servers, and batch-processing media assets.

## Commands

```bash
# Scaffold a new project from a template
tool new my-project --template blog

# Start a local JSON mock server
tool mock --port 3001 --data fixtures/

# Resize and optimise images in bulk
tool images --input src/ --output dist/ --width 1200
```

## Installation

```bash
npm install -g @user/tool
```
