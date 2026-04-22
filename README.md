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

## Deprecated — original README

> The content below is from the original version of this project and no longer reflects the current codebase.

Little web application to put watermark on images.

<img src="watermarker screenshot.png" alt="screenshot of the watermarker web app" />
