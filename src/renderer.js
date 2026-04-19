import { state } from './state.js';

export const canvas = document.getElementById('mainCanvas');
const ctx = canvas.getContext('2d');

export const Renderer = {
  render() {
    if (!state.image) return;
    const { width: w, height: h } = canvas;
    ctx.clearRect(0, 0, w, h);
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
    ctx.drawImage(state.image, 0, 0, w, h);
    ctx.globalCompositeOperation = 'source-atop';
    state.watermarks.filter(wm => wm.visible).forEach(wm => this._drawOne(wm, w, h));
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  },

  _drawOne(wm, w, h) {
    ctx.save();
    ctx.globalAlpha  = wm.opacity;
    ctx.fillStyle    = wm.color;
    ctx.textAlign    = 'center';
    ctx.textBaseline = 'middle';
    ctx.font         = `${wm.weight} ${wm.size}px "${wm.font}", sans-serif`;
    ctx.translate(wm.x * w, wm.y * h);
    if (wm.rotation) ctx.rotate(wm.rotation * Math.PI / 180);
    if (ctx.letterSpacing !== undefined) ctx.letterSpacing = `${wm.letterSpacing}px`;
    const lines  = wm.text.split('\n');
    const lh     = wm.size * 1.2;
    const startY = -((lines.length - 1) * lh) / 2;
    lines.forEach((line, i) => ctx.fillText(line, 0, startY + i * lh));
    ctx.restore();
  },

  measure(wm) {
    const scale = canvas.getBoundingClientRect().width / canvas.width;
    ctx.save();
    ctx.font = `${wm.weight} ${wm.size}px "${wm.font}", sans-serif`;
    if (ctx.letterSpacing !== undefined) ctx.letterSpacing = `${wm.letterSpacing}px`;
    const lines = wm.text.split('\n');
    const maxW  = Math.max(...lines.map(l => ctx.measureText(l || ' ').width));
    const totalH = lines.length * wm.size * 1.2;
    ctx.restore();
    return { w: (maxW + wm.letterSpacing) * scale, h: totalH * scale };
  },
};
