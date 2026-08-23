---
title: "Build-Time SVG Charts"
date: 2026-08-23
categories: [Demo]
tags: [charts, theme, dataviz]
excerpt: "The chart tag turns plain text into finished SVG at build time — no JavaScript, no library, and it still works with scripts disabled."
card_border: "#34d399"
difficulty: 2
---

The `{% raw %}{% chart %}{% endraw %}` tag renders bar, line, and pie charts **at build time**. The output is a plain `<svg>` element — there is no charting library, no runtime, and nothing to download. Charts survive printing, the ePub export, and readers who browse with JavaScript turned off.

<!-- more -->

## Bar charts

One value per line gives a single series, and the row labels become the category axis.

{% chart bar title="Lines of code by language" %}
Rust: 4200
Go: 3100
Python: 2700
Shell: 640
{% endchart %}

{% raw %}
```
{% chart bar title="Lines of code by language" %}
Rust: 4200
Go: 3100
Python: 2700
Shell: 640
{% endchart %}
```
{% endraw %}

Add `x` to plot several values per row instead. Each row then becomes its own series, drawn as a grouped bar.

{% chart bar x="2024, 2025, 2026" title="Posts published" %}
Guides: 12, 19, 23
Notes: 8, 14, 16
Talks: 2, 3, 7
{% endchart %}

## Line charts

Same data shape, different `type`. Use `unit` to suffix the axis labels.

{% chart line x="Jan, Feb, Mar, Apr, May, Jun" unit="ms" title="p99 request latency" caption="Lower is better. Measured against the staging cluster." %}
API: 182, 174, 158, 141, 133, 121
Worker: 96, 103, 88, 84, 79, 71
{% endchart %}

## Pie charts

Pie always treats each line as one slice, and percentages are computed for you.

{% chart pie title="Traffic sources" %}
Direct: 55
Search: 128
Social: 34
Referral: 19
{% endchart %}

## Pulling from a data file

Rather than repeating figures across posts, put them in `source/_data/` and reference the file by name. This chart reads `source/_data/benchmarks.yml`:

{% chart line data="benchmarks" unit="ms" title="Parse time by payload size" caption="Sourced from source/_data/benchmarks.yml" %}{% endchart %}

The YAML mirrors the inline format — `x` is the category axis, every other key is a series:

```yaml
x: [1 KB, 10 KB, 100 KB, 1 MB, 10 MB]
Rust: [0.8, 1.9, 12.4, 108, 1120]
Go: [1.1, 2.6, 17.8, 154, 1610]
Python: [4.7, 11.2, 78.3, 690, 7240]
```

An inline body always wins over `data`, so you can override a shared file for one post without editing it.

## Parameters

| Parameter | Required | Notes |
|-----------|----------|-------|
| type | no | First bare word: `bar`, `line`, or `pie`. Defaults to `bar` |
| `x` | no | Comma-separated category labels; switches rows to multi-point series |
| `data` | no | Key into `source/_data/<name>.yml`; ignored when the body is non-empty |
| `title` | no | Heading above the chart, also the SVG accessible name |
| `caption` | no | Muted text below the chart |
| `unit` | no | Suffix appended to axis and table values, e.g. `ms` or `%` |
| `max` | no | Y-axis ceiling; defaults to a rounded value above the largest data point |

Blank lines and lines starting with `#` are ignored, so you can comment a dataset inline.

## Accessibility

Every chart carries a `role="img"` with a generated description listing each value, and ships a visually hidden data table alongside the SVG. Screen readers get the real numbers rather than an unlabelled graphic, and that same table is what appears when the page is printed.
