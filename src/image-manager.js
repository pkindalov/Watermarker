import { state } from './state.js';
import { canvas } from './renderer.js';
import { bus } from './utils.js';

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
    const scale = Math.min((stage.clientWidth - 64) / w, (stage.clientHeight - 64) / h, 1);
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
