import { state } from './state.js';
import { bus, escHtml, toHex } from './utils.js';
import { FONT_OPTIONS, SWATCH_COLORS } from './constants.js';
import { canvas, Renderer } from './renderer.js';

const _body  = document.getElementById('propBody');
const _empty = document.getElementById('emptyState');

export const PropPanel = {
  render() {
    const wm = state.watermarks.find(w => w.id === state.selectedId);
    if (!wm) {
      _body.classList.remove('visible');
      _empty.classList.add('visible');
      return;
    }
    _body.classList.add('visible');
    _empty.classList.remove('visible');
    this._build(wm);
    this._wire(wm);
  },

  _build(wm) {
    _body.innerHTML = `
      <div class="prop-group">
        <h4 class="prop-h">Content</h4>
        <div class="row">
          <textarea class="input" id="p_text" rows="2" placeholder="Enter text…">${escHtml(wm.text)}</textarea>
        </div>
      </div>

      <div class="prop-group">
        <h4 class="prop-h">Typography</h4>
        <div class="row">
          <label class="sub">Font family</label>
          <select class="select input" id="p_font">
            ${FONT_OPTIONS.map(f => `<option value="${f}"${wm.font === f ? ' selected' : ''}>${f}</option>`).join('')}
          </select>
        </div>
        <div class="row row-2">
          <div>
            <label class="sub">Weight</label>
            <select class="select input" id="p_weight">
              ${[300,400,500,600,700,800].map(w => `<option value="${w}"${wm.weight === w ? ' selected' : ''}>${w}</option>`).join('')}
            </select>
          </div>
          <div>
            <label class="sub">Size</label>
            <div class="stepper">
              <input type="number" class="input mono" id="p_size" value="${wm.size}" min="6" max="400">
              <span class="units">px</span>
            </div>
          </div>
        </div>
        <div class="row">
          <label class="sub">
            Letter spacing
            <span id="lbl_letter" class="range-val">${wm.letterSpacing}px</span>
          </label>
          <input type="range" min="-2" max="20" step="0.5" value="${wm.letterSpacing}" id="p_letter">
        </div>
      </div>

      <div class="prop-group">
        <h4 class="prop-h">Color</h4>
        <div class="row">
          <div class="color-pick">
            <div class="color-swatch">
              <div class="fill" id="p_swatch_fill" style="--fill-color:${wm.color}"></div>
              <input type="color" id="p_color_picker" value="${toHex(wm.color)}" class="color-picker-input">
            </div>
            <input class="input mono" id="p_color" value="${wm.color}">
          </div>
          <div class="swatches" id="p_swatches">
            ${SWATCH_COLORS.map(s => `<div class="sw${wm.color === s ? ' active' : ''}" style="--sw-color:${s}" data-c="${s}"></div>`).join('')}
          </div>
        </div>
        <div class="row">
          <label class="sub">
            Opacity
            <span id="lbl_opacity" class="range-val">${Math.round(wm.opacity * 100)}%</span>
          </label>
          <input type="range" min="0" max="100" value="${Math.round(wm.opacity * 100)}" id="p_opacity">
        </div>
      </div>

      <div class="prop-group">
        <h4 class="prop-h">Transform</h4>
        <div class="row row-2">
          <div>
            <label class="sub">X</label>
            <div class="stepper">
              <input type="number" class="input mono" id="p_x" step="0.5" value="${(wm.x * 100).toFixed(1)}">
              <span class="units">%</span>
            </div>
          </div>
          <div>
            <label class="sub">Y</label>
            <div class="stepper">
              <input type="number" class="input mono" id="p_y" step="0.5" value="${(wm.y * 100).toFixed(1)}">
              <span class="units">%</span>
            </div>
          </div>
        </div>
        <div class="row">
          <label class="sub">
            Rotation
            <span id="lbl_rotation" class="range-val">${wm.rotation}°</span>
          </label>
          <input type="range" min="-180" max="180" value="${wm.rotation}" id="p_rotation">
        </div>
        <div class="row">
          <label class="sub">Quick align</label>
          <div class="align-grid">
            ${[
              ['↖',0,0],['↑',0.5,0],['↗',1,0],
              ['←',0,0.5],['⊙',0.5,0.5],['→',1,0.5],
              ['↙',0,1],['↓',0.5,1],['↘',1,1],
            ].map(([sym, x, y]) =>
              `<button class="btn align-btn" data-ax="${x}" data-ay="${y}">${sym}</button>`
            ).join('')}
          </div>
        </div>
      </div>
    `;
  },

  _wire(wm) {
    const $ = id => _body.querySelector(id);

    // Text: layer list updates instantly; canvas render is debounced to avoid
    // redrawing the canvas on every keystroke while typing.
    $('#p_text').addEventListener('input', e => {
      wm.text = e.target.value;
      bus.emit('text-change');
    });

    $('#p_font').addEventListener('change', e => {
      wm.font = e.target.value;
      bus.emit('render');
    });
    $('#p_weight').addEventListener('change', e => {
      wm.weight = +e.target.value;
      bus.emit('render');
    });
    $('#p_size').addEventListener('input', e => {
      wm.size = Math.max(6, +e.target.value || 6);
      bus.emit('render');
    });

    $('#p_letter').addEventListener('input', e => {
      wm.letterSpacing = +e.target.value;
      $('#lbl_letter').textContent = `${wm.letterSpacing}px`;
      bus.emit('render');
    });
    $('#p_opacity').addEventListener('input', e => {
      wm.opacity = +e.target.value / 100;
      $('#lbl_opacity').textContent = `${Math.round(wm.opacity * 100)}%`;
      bus.emit('render');
    });
    $('#p_rotation').addEventListener('input', e => {
      wm.rotation = +e.target.value;
      $('#lbl_rotation').textContent = `${wm.rotation}°`;
      bus.emit('render');
    });

    const syncColor = color => {
      wm.color = color;
      $('#p_swatch_fill').style.setProperty('--fill-color', color);
      bus.emit('render');
    };
    $('#p_color').addEventListener('input', e => syncColor(e.target.value));
    $('#p_color_picker').addEventListener('input', e => {
      $('#p_color').value = e.target.value;
      syncColor(e.target.value);
    });
    _body.querySelectorAll('#p_swatches .sw').forEach(sw => {
      sw.addEventListener('click', () => {
        _body.querySelectorAll('#p_swatches .sw').forEach(s => s.classList.remove('active'));
        sw.classList.add('active');
        $('#p_color').value = sw.dataset.c;
        syncColor(sw.dataset.c);
      });
    });

    $('#p_x').addEventListener('input', e => {
      wm.x = Math.max(0, Math.min(1, +e.target.value / 100));
      bus.emit('render');
    });
    $('#p_y').addEventListener('input', e => {
      wm.y = Math.max(0, Math.min(1, +e.target.value / 100));
      bus.emit('render');
    });

    _body.querySelectorAll('[data-ax]').forEach(b => {
      b.addEventListener('click', () => {
        const { w: tw, h: th } = Renderer.measure(wm);
        const rect  = canvas.getBoundingClientRect();
        const halfW = tw / (2 * rect.width);
        const halfH = th / (2 * rect.height);
        const M     = 0.005; // 0.5% margin from edge
        const ax    = +b.dataset.ax;
        const ay    = +b.dataset.ay;
        wm.x = ax === 0 ? halfW + M : ax === 1 ? 1 - halfW - M : 0.5;
        wm.y = ay === 0 ? halfH + M : ay === 1 ? 1 - halfH - M : 0.5;
        this.syncPosition(wm);
        bus.emit('render');
      });
    });
  },

  syncPosition(wm) {
    const px = _body.querySelector('#p_x');
    const py = _body.querySelector('#p_y');
    if (px) px.value = (wm.x * 100).toFixed(1);
    if (py) py.value = (wm.y * 100).toFixed(1);
  },
};
