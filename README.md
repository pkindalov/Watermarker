# Watermarker — Editor

A browser-based image watermarking tool. Upload any photo, configure one or more text watermarks with full control over font, size, color, opacity, position, and rotation, then export the result as PNG, JPG, or WebP.

## Features

- Multiple watermark layers, each independently configurable
- Preset patterns: grid, diagonal, corners, footer, tiled diagonal, center
- Live canvas preview with drag-to-move handles
- Export at original resolution or downscaled (500 / 800 / 1024 px)
- Format selector (PNG / JPG / WebP) with quality slider
- Theme and accent color tweaks panel

## Running

No build step required. Open `index.html` directly in a browser, or serve with any static file server:

```bash
npx serve .
# or
python -m http.server
```

---

## Deprecated — original version

The original version of this app (simpler, jQuery-based) is preserved as the git tag **[v1-legacy](https://github.com/pkindalov/Watermarker/releases/tag/v1-legacy)**.

You can download it directly from GitHub — no git required:

- **[Download v1-legacy as zip](https://github.com/pkindalov/Watermarker/archive/refs/tags/v1-legacy.zip)**

Or browse all tags at [github.com/pkindalov/Watermarker/tags](https://github.com/pkindalov/Watermarker/tags).

> Original README:

Little web application to put watermark on images.

<img src="watermarker screenshot.png" alt="screenshot of the watermarker web app" />
