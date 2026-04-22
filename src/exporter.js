import { state } from './state.js';
import { canvas, Renderer } from './renderer.js';

const URL_REVOKE_DELAY_MS = 1000; // enough time for the browser download to start

export const Exporter = {
  export() {
    if (!state.image) return;
    Renderer.render();
    const { exportFormat: fmt, exportQuality: quality, imageName } = state;
    const mime = fmt === 'png' ? 'image/png' : fmt === 'webp' ? 'image/webp' : 'image/jpeg';
    const q    = fmt === 'png' ? undefined : quality / 100;
    canvas.toBlob(blob => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a   = document.createElement('a');
      a.href     = url;
      a.download = `${imageName.replace(/\.[^.]+$/, '')}-watermarked.${fmt}`;
      document.body.append(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), URL_REVOKE_DELAY_MS);
    }, mime, q);
  },
};
