import { state } from './state.js';
import { bus, escHtml } from './utils.js';

const _el = document.getElementById('layerList');

export const LayerList = {
  render() {
    _el.innerHTML = '';

    if (!state.watermarks.length) {
      const msg = document.createElement('div');
      msg.style.cssText = 'padding:20px 12px; text-align:center; color:var(--muted); font-size:12px;';
      msg.textContent   = 'No layers. Add one below.';
      _el.appendChild(msg);
      document.getElementById('infoLayers').textContent = '0';
      return;
    }

    [...state.watermarks].reverse().forEach(wm => _el.appendChild(this._createItem(wm)));
    document.getElementById('infoLayers').textContent = state.watermarks.length;
  },

  _createItem(wm) {
    const li     = document.createElement('div');
    li.className = `layer${wm.id === state.selectedId ? ' active' : ''}`;
    li.innerHTML = `
      <div class="eye${wm.visible ? '' : ' hidden'}" title="${wm.visible ? 'Hide' : 'Show'}">
        ${wm.visible
          ? '<svg class="i" viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12z"/><circle cx="12" cy="12" r="3"/></svg>'
          : '<svg class="i" viewBox="0 0 24 24"><path d="M17.94 17.94A10 10 0 0112 20c-7 0-11-8-11-8a20 20 0 015.36-6.36M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a20 20 0 01-2.1 3.16M14.12 14.12A3 3 0 119.88 9.88M1 1l22 22"/></svg>'
        }
      </div>
      <div class="meta">
        <div class="name">${escHtml(wm.text.split('\n')[0]) || 'Watermark'}</div>
        <div class="sub">${escHtml(wm.font)} · ${wm.size}px · ${Math.round(wm.opacity * 100)}%</div>
      </div>
      <div class="del" title="Delete">×</div>
    `;

    li.querySelector('.eye').addEventListener('click', e => {
      e.stopPropagation();
      bus.emit('toggle-visibility', { id: wm.id });
    });

    li.querySelector('.del').addEventListener('click', e => {
      e.stopPropagation();
      bus.emit('delete', { id: wm.id });
    });

    li.addEventListener('click', () => bus.emit('select', { id: wm.id }));
    return li;
  },
};
