import { state } from './state.js';
import { canvas } from './renderer.js';
import { bus } from './utils.js';

const STAGE_PADDING      = 64;  // breathing room between canvas edge and viewport
const MOBILE_BREAKPOINT  = 768; // must match the CSS @media breakpoint

export const ImageManager = {
  load(src, name) {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = () => {
      state.image     = img;
      state.imageName = name ?? 'image';
      this.fitToStage();
      bus.emit('render');
      document.getElementById('fileLabel').textContent  = state.imageName;
      document.getElementById('stageTitle').textContent = state.imageName;
      this._updateDimLabel();
    };
    img.src = src;
  },

  fitToStage() {
    if (!state.image) return;
    let { naturalWidth: w, naturalHeight: h } = state.image;
    if (state.resizeTo > 0) {
      const s = state.resizeTo / Math.max(w, h);
      w = Math.round(w * s);
      h = Math.round(h * s);
    }
    canvas.width  = w;
    canvas.height = h;
    const stage = document.getElementById('stage');
    const availableWidth = stage.clientWidth - STAGE_PADDING;
    // On mobile the layout scrolls vertically — the stage has no fixed container height,
    // so stage.clientHeight reflects the canvas itself (circular). Each fitToStage() call
    // would shrink the scale a bit more, causing the canvas to collapse toward 0%.
    // On mobile we only constrain by width; height is unconstrained in the scroll layout.
    const isMobile = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT}px)`).matches;
    const scale = isMobile
      ? Math.min(availableWidth / w, 1)
      : Math.min(availableWidth / w, (stage.clientHeight - STAGE_PADDING) / h, 1);
    // Inline style required — these are runtime-computed values, not static CSS.
    canvas.style.width  = `${w * scale}px`;
    canvas.style.height = `${h * scale}px`;
    document.getElementById('zoomLabel').textContent = `${Math.round(scale * 100)}%`;
    this._updateDimLabel();
  },

  _updateDimLabel() {
    const t = `${canvas.width} × ${canvas.height}`;
    document.getElementById('dimLabel').textContent = t;
    document.getElementById('infoDim').textContent  = t;
  },
};
