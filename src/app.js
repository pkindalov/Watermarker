import { state, createWatermark } from './state.js';
import { bus, debounce, segSelect } from './utils.js';
import { canvas, Renderer } from './renderer.js';
import { Handles } from './handles.js';
import { LayerList } from './layers.js';
import { PropPanel } from './panel.js';
import { Presets } from './presets.js';
import { ImageManager } from './image-manager.js';
import { Exporter } from './exporter.js';
import { Tweaks } from './tweaks.js';

// ── Bus handlers ──────────────────────────────────────────────────────────────

// Canvas re-render is debounced for text input so the canvas doesn't
// redraw on every keystroke. The layer list (sidebar name) updates instantly.
const debouncedCanvasRender = debounce(() => {
  Renderer.render();
  Handles.render();
}, 180);

bus.on('select', ({ id }) => {
  state.selectedId = id;
  Renderer.render();
  Handles.render();
  LayerList.render();
  PropPanel.render();
});

bus.on('render', () => {
  Renderer.render();
  Handles.render();
  LayerList.render();
});

bus.on('text-change', () => {
  LayerList.render();
  debouncedCanvasRender();
});

bus.on('move', wm => {
  Renderer.render();
  Handles.render();
  PropPanel.syncPosition(wm);
});

bus.on('delete', ({ id }) => {
  state.watermarks = state.watermarks.filter(w => w.id !== id);
  if (state.selectedId === id) {
    state.selectedId = state.watermarks.at(-1)?.id ?? null;
  }
  Renderer.render();
  Handles.render();
  LayerList.render();
  PropPanel.render();
});

bus.on('toggle-visibility', ({ id }) => {
  const wm = state.watermarks.find(w => w.id === id);
  if (wm) wm.visible = !wm.visible;
  Renderer.render();
  Handles.render();
  LayerList.render();
});

// ── Actions ───────────────────────────────────────────────────────────────────

const addWatermark = function() {
  const wm = createWatermark({ x: 0.5, y: 0.5 });
  state.watermarks.push(wm);
  bus.emit('select', { id: wm.id });
};

// ── DOM event wiring ──────────────────────────────────────────────────────────

const ARROW_STEP            = 0.005;
const ARROW_STEP_SHIFT      = 0.05; // hold Shift for a larger nudge
const INITIAL_WATERMARK_DELAY_MS = 150;

const initEvents = function() {
  const fileInput = document.getElementById('fileInput');

  const loadFile = f => {
    if (!f?.type.startsWith('image/')) return;
    const fr = new FileReader();
    fr.onload = ev => ImageManager.load(ev.target.result, f.name);
    fr.readAsDataURL(f);
    fileInput.value = '';
  };

  const onUploadClick  = () => fileInput.click();
  const onFileChange   = e => loadFile(e.target.files[0]);
  const onResetClick   = () => {
    state.watermarks = [];
    state.selectedId = null;
    Renderer.render();
    Handles.render();
    LayerList.render();
    PropPanel.render();
  };
  const onFitClick    = () => { ImageManager.fitToStage(); bus.emit('render'); };
  const onExportClick = () => Exporter.export();
  const onFormatClick = () => document.querySelector('.tab[data-tab="image"]').click();
  const onQualityInput = e => {
    state.exportQuality = +e.target.value;
    document.getElementById('qualityVal').textContent = e.target.value;
  };

  document.getElementById('uploadBtn').addEventListener('click',  onUploadClick);
  document.getElementById('uploadBtn2').addEventListener('click', onUploadClick);
  fileInput.addEventListener('change', onFileChange);
  document.getElementById('resetBtn').addEventListener('click', onResetClick);

  ['addWatermarkBtn', 'addWatermarkTop', 'toolAddText'].forEach(id => {
    document.getElementById(id).addEventListener('click', addWatermark);
  });

  document.querySelectorAll('.preset').forEach(btn => {
    const onPresetClick = () => Presets.apply(btn.dataset.preset);
    btn.addEventListener('click', onPresetClick);
  });

  document.querySelectorAll('.tab').forEach(t => {
    const onTabClick = () => {
      document.querySelectorAll('.tab').forEach(x => x.classList.remove('active'));
      t.classList.add('active');
      document.getElementById('tab-watermark').classList.toggle('visible', t.dataset.tab === 'watermark');
      document.getElementById('tab-image').classList.toggle('visible', t.dataset.tab === 'image');
    };
    t.addEventListener('click', onTabClick);
  });

  const onResSegClick = e => {
    const b = e.target.closest('button[data-res]');
    if (!b) return;
    segSelect('resSeg', b.dataset.res, 'res');
    state.resizeTo = +b.dataset.res;
    if (state.image) { ImageManager.fitToStage(); bus.emit('render'); }
  };
  document.getElementById('resSeg').addEventListener('click', onResSegClick);

  const onFmtSegClick = e => {
    const b = e.target.closest('button[data-fmt]');
    if (!b) return;
    segSelect('fmtSeg', b.dataset.fmt, 'fmt');
    state.exportFormat = b.dataset.fmt;
    document.getElementById('qualityRow').classList.toggle('visible', b.dataset.fmt !== 'png');
    document.querySelector('#formatBtn span').textContent = b.dataset.fmt.toUpperCase();
    document.getElementById('infoFmt').textContent        = b.dataset.fmt.toUpperCase();
  };
  document.getElementById('fmtSeg').addEventListener('click', onFmtSegClick);

  document.getElementById('qualityRange').addEventListener('input', onQualityInput);
  document.getElementById('formatBtn').addEventListener('click',    onFormatClick);
  document.getElementById('exportBtn').addEventListener('click',    onExportClick);
  document.getElementById('exportBtn2').addEventListener('click',   onExportClick);
  document.getElementById('fitBtn').addEventListener('click',       onFitClick);

  const stageEl  = document.getElementById('stage');
  const dropzone = document.getElementById('dropzone');

  const onDragOver  = e => { e.preventDefault(); dropzone.classList.add('active'); };
  const onDragLeave = e => { if (e.target === stageEl) dropzone.classList.remove('active'); };
  const onDrop      = e => {
    e.preventDefault();
    dropzone.classList.remove('active');
    loadFile(e.dataTransfer.files[0]);
  };
  const onStagePointerDown = e => {
    if (e.target === stageEl || e.target === canvas) {
      state.selectedId = null;
      Renderer.render();
      Handles.render();
      LayerList.render();
      PropPanel.render();
    }
  };

  stageEl.addEventListener('dragover',    onDragOver);
  stageEl.addEventListener('dragleave',   onDragLeave);
  stageEl.addEventListener('drop',        onDrop);
  stageEl.addEventListener('pointerdown', onStagePointerDown);

  const onKeyDown = e => {
    if (e.target.matches('input, textarea, select')) return;
    const wm = state.watermarks.find(w => w.id === state.selectedId);

    if (e.key === 'Delete' || e.key === 'Backspace') {
      if (!wm) return;
      bus.emit('delete', { id: wm.id });

    } else if (e.key === 't' || e.key === 'T') {
      addWatermark();

    } else if (wm && ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
      e.preventDefault();
      const step = e.shiftKey ? ARROW_STEP_SHIFT : ARROW_STEP;
      const deltas = { ArrowUp: [0, -step], ArrowDown: [0, step], ArrowLeft: [-step, 0], ArrowRight: [step, 0] };
      const [dx, dy] = deltas[e.key];
      wm.x = Math.max(0, Math.min(1, wm.x + dx));
      wm.y = Math.max(0, Math.min(1, wm.y + dy));
      bus.emit('move', wm);
    }
  };
  document.addEventListener('keydown', onKeyDown);

  const onResize = () => {
    if (state.image) { ImageManager.fitToStage(); bus.emit('render'); }
  };
  window.addEventListener('resize', onResize);
};

// ── Boot ──────────────────────────────────────────────────────────────────────

Tweaks.init();
initEvents();
LayerList.render();
PropPanel.render();

ImageManager.load('images/examplePicture.jpg', 'example.jpg');

setTimeout(() => addWatermark(), INITIAL_WATERMARK_DELAY_MS);
