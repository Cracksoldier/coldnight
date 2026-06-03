---
title: "3D Model Viewer"
date: 2026-06-01 12:00:00
updated: 2026-06-01
categories: [Demo]
tags: [3d, webgl, threejs]
cover_image: https://placeholdpicsum.dev/800x450
excerpt: "Embed interactive 3D models directly in posts using the {% model %} tag. Supports GLB, GLTF, and STL files — rendered with Three.js, no CDN required."
abstract: "Demonstrates the **`{% model %}`** tag: an interactive Three.js WebGL viewer for GLB, GLTF, and STL files. Drag to orbit, scroll to zoom, right-click to pan."
---

The `{% model %}` tag embeds an interactive 3D viewer directly in a post. Three.js and the required loaders are self-hosted and only loaded on pages that use the tag — zero cost elsewhere.

## Basic usage

Drop a model file under `source/models/` and reference it by path:

```
{% model src="/models/cube.stl" %}
```

{% model src="/models/cube.stl" caption="A simple cube — drag to orbit, scroll to zoom" %}

## Parameters

| Parameter | Default | Description |
|-----------|---------|-------------|
| `src` | — | Path to a `.glb`, `.gltf`, or `.stl` file (**required**) |
| `height` | `400px` | Canvas height — `px`, `em`, `rem`, `vh`, `vw`, `%` |
| `bg` | `#1a1a2e` | Canvas background colour |
| `view` | `front` | Starting camera angle: `front` (Z-axis) or `iso` ((1,1,1) diagonal) |
| `autorotate` | — | Any non-empty value (e.g. `"true"`) enables continuous spin |
| `caption` | — | Plain-text caption rendered below the viewer |

## Custom height and background

```
{% model src="/models/cube.stl" height="300px" bg="#0f2027" caption="Dark background" %}
```

{% model src="/models/cube.stl" height="300px" bg="#0f2027" caption="Dark background variant" %}

```
{% model src="/models/cube.stl" height="300px" bg="#f5f5f0" caption="Light background" %}
```

{% model src="/models/cube.stl" height="300px" bg="#f5f5f0" caption="Light background variant" %}

## Camera view

`view="iso"` positions the camera along the (1,1,1) diagonal — equal distance from all three axes — for a classic isometric perspective:

```
{% model src="/models/cube.stl" view="iso" caption="Isometric start" %}
```

{% model src="/models/cube.stl" view="iso" caption="Isometric start" %}

The default (`view="front"`) keeps the camera on the Z-axis as before.

## Auto-rotate

`autorotate="true"` continuously spins the model around the Y-axis. Drag to orbit as normal — the rotation pauses during the drag and resumes on release:

```
{% model src="/models/cube.stl" autorotate="true" caption="Auto-rotate" %}
```

{% model src="/models/cube.stl" autorotate="true" caption="Auto-rotate" %}

Combine both options:

```
{% model src="/models/cube.stl" view="iso" autorotate="true" caption="Iso + auto-rotate" %}
```

{% model src="/models/cube.stl" view="iso" autorotate="true" caption="Iso + auto-rotate" %}

## Supported formats

| Format | Notes |
|--------|-------|
| `.glb` | Binary GLTF — recommended for models with textures |
| `.gltf` | Text GLTF with separate asset files |
| `.stl` | Common 3D-printing format; rendered with a flat Phong material |

## How it works

Three.js r170 (ESM build) and the required loaders — `GLTFLoader`, `STLLoader`, `OrbitControls` — are vendored under `themes/coldnight/source/vendor/three/`. They are injected as a `<script type="module">` only on posts whose rendered HTML contains a model viewer element. The rAF render loop is paused via `IntersectionObserver` when the viewer scrolls out of the viewport, so off-screen viewers consume no CPU.
