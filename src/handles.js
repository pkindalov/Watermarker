import { state } from './state.js';
import { canvas, Renderer } from './renderer.js';
import { bus } from './utils.js';

const _el = document.getElementById('handleLayer');

export const Handles = {
  render() {
    _el.innerHTML = '';
    const { width: cw, height: ch } = canvas.getBoundingClientRect();
    _el.style.width  = `${cw}px`;
    _el.style.height = `${ch}px`;
    state.watermarks
      .filter(wm => wm.visible)
      .forEach(wm => _el.appendChild(this._createEl(wm, cw, ch)));
  },

  _createEl(wm, cw, ch) {
    const el  = document.createElement('div');
    const { w, h } = Renderer.measure(wm);
    el.className       = `handle${wm.id === state.selectedId ? ' selected' : ''}`;
    el.style.left      = `${wm.x * cw}px`;
    el.style.top       = `${wm.y * ch}px`;
    el.style.width     = `${Math.max(30, w + 12)}px`;
    el.style.height    = `${Math.max(16, h + 8)}px`;
    el.style.transform = `translate(-50%, -50%) rotate(${wm.rotation}deg)`;
    el.dataset.id      = wm.id;

    if (wm.id === state.selectedId) {
      const tag = document.createElement('div');
      tag.className   = 'tag';
      tag.textContent = wm.text.split('\n')[0].slice(0, 24) || 'Watermark';
      const c1 = document.createElement('div'); c1.className = 'corner c-bl';
      const c2 = document.createElement('div'); c2.className = 'corner c-br';
      el.append(tag, c1, c2);
    }

    this._attachDrag(el, wm);
    return el;
  },

  _attachDrag(el, wm) {
    el.addEventListener('pointerdown', e => {
      e.preventDefault();
      bus.emit('select', { id: wm.id });

      const startX  = e.clientX, startY  = e.clientY;
      const startWX = wm.x,      startWY = wm.y;
      el.setPointerCapture(e.pointerId);
      const { width: rw, height: rh } = canvas.getBoundingClientRect();

      const onMove = me => {
        wm.x = Math.max(0, Math.min(1, startWX + (me.clientX - startX) / rw));
        wm.y = Math.max(0, Math.min(1, startWY + (me.clientY - startY) / rh));
        bus.emit('move', wm);
      };

      const onUp = () => {
        el.removeEventListener('pointermove', onMove);
        el.removeEventListener('pointerup',   onUp);
      };

      el.addEventListener('pointermove', onMove);
      el.addEventListener('pointerup',   onUp);
    });
  },
};
