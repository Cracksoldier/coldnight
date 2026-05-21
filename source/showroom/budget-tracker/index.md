---
title: "Budget Tracker"
subtitle: "Personal finance dashboard"
cover_image: /images/showroom/budget-tracker.jpg
layout: project
date: 2025-11-05
---

A single-page personal finance tracker that imports bank CSV exports and visualises spending by category. All data stays local — nothing is sent to a server. Categories are user-defined and stored in `localStorage`.

## Features

- Drag-and-drop CSV import (works with most EU bank exports)
- Automatic category detection via keyword rules
- Monthly spending breakdown as a stacked bar chart
- Year-over-year comparison view
- Export categorised data back to CSV

## Tech

- Vanilla JavaScript, no build step
- Chart.js for visualisations
- `Papa Parse` for CSV parsing
