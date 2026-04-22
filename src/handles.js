import { state } from './state.js';
import { canvas, Renderer } from './renderer.js';
import { bus } from './utils.js';

const handleLayer = document.getElementById('handleLayer');
let _lastDown = { id: null, t: 0 };

const DOUBLE_CLICK_MAX_MS = 600;
const MIN_HANDLE_W = 30; // minimum clickable width in px
const MIN_HANDLE_H = 16; // minimum clickable height in px

export const Handles = {
  render() {
    handleLayer.innerHTML = '';
    const { width: canvasDisplayWidth, height: canvasDisplayHeight } = canvas.getBoundingClientRect();
    handleLayer.style.width  = `${canvasDisplayWidth}px`;
    handleLayer.style.height = `${canvasDisplayHeight}px`;
    state.watermarks
      .filter(watermark => watermark.visible)
      .forEach(watermark => handleLayer.appendChild(
        this._createHandleElement(watermark, canvasDisplayWidth, canvasDisplayHeight)
      ));
  },

  _createHandleElement(watermark, canvasDisplayWidth, canvasDisplayHeight) {
    const handleElement = document.createElement('div');
    const { w: textDisplayWidth, h: textDisplayHeight } = Renderer.measure(watermark);

    handleElement.className  = `handle${watermark.id === state.selectedId ? ' selected' : ''}`;
    handleElement.style.left = `${watermark.x * canvasDisplayWidth}px`;
    handleElement.style.top  = `${watermark.y * canvasDisplayHeight}px`;
    handleElement.style.width  = `${Math.max(MIN_HANDLE_W, textDisplayWidth + 12)}px`;
    handleElement.style.height = `${Math.max(MIN_HANDLE_H, textDisplayHeight + 8)}px`;
    handleElement.style.transform = `translate(-50%, -50%) rotate(${watermark.rotation}deg)`;
    handleElement.dataset.id = watermark.id;

    if (watermark.id === state.selectedId) {
      const labelTag = document.createElement('div');
      labelTag.className   = 'tag';
      labelTag.textContent = watermark.text.split('\n')[0].slice(0, 24) || 'Watermark';

      const bottomLeftCorner  = document.createElement('div');
      bottomLeftCorner.className  = 'corner c-bl';

      const bottomRightCorner = document.createElement('div');
      bottomRightCorner.className = 'corner c-br';

      handleElement.append(labelTag, bottomLeftCorner, bottomRightCorner);
    }

    this._attachDragBehavior(handleElement, watermark);
    return handleElement;
  },

  _openInlineEdit(handleEl, watermark) {
    const editor = document.createElement('textarea');
    editor.className = 'handle-editor';
    editor.value = watermark.text;

    const onEditorPointerDown = e => e.stopPropagation();
    editor.addEventListener('pointerdown', onEditorPointerDown);

    const commit = () => {
      watermark.text = editor.value;
      bus.emit('text-change');
      Handles.render();
    };

    const onEditorKeyDown = e => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        editor.removeEventListener('blur', commit);
        commit();
      } else if (e.key === 'Escape') {
        editor.removeEventListener('blur', commit);
        Handles.render();
      }
    };
    editor.addEventListener('keydown', onEditorKeyDown);

    handleEl.appendChild(editor);
    // Defer focus so the element is rendered and no spurious blur fires
    // during the pointerdown event that opened the editor.
    requestAnimationFrame(() => {
      editor.focus();
      editor.select();
      editor.addEventListener('blur', commit);
    });
  },

  _attachDragBehavior(handleElement, watermark) {
    const onPointerDown = pointerDownEvent => {
      if (pointerDownEvent.target.classList.contains('handle-editor')) return;

      const now = Date.now();
      const isDouble = _lastDown.id === watermark.id && (now - _lastDown.t) < DOUBLE_CLICK_MAX_MS;
      _lastDown = { id: watermark.id, t: isDouble ? 0 : now };

      if (isDouble) {
        if (state.selectedId !== watermark.id) bus.emit('select', { id: watermark.id });
        const current = handleLayer.querySelector(`[data-id="${watermark.id}"]`);
        if (current) Handles._openInlineEdit(current, watermark);
        return;
      }

      pointerDownEvent.preventDefault();

      // Capture on the persistent layer element BEFORE bus.emit('select') triggers
      // Handles.render(), which destroys handleElement from the DOM. Calling
      // setPointerCapture on a detached element throws InvalidStateError.
      handleLayer.setPointerCapture(pointerDownEvent.pointerId);

      bus.emit('select', { id: watermark.id });

      const pointerStartX   = pointerDownEvent.clientX;
      const pointerStartY   = pointerDownEvent.clientY;
      const watermarkStartX = watermark.x;
      const watermarkStartY = watermark.y;
      const { width: canvasDisplayWidth, height: canvasDisplayHeight } = canvas.getBoundingClientRect();

      const onPointerMove = moveEvent => {
        moveEvent.preventDefault();
        watermark.x = Math.max(0, Math.min(1, watermarkStartX + (moveEvent.clientX - pointerStartX) / canvasDisplayWidth));
        watermark.y = Math.max(0, Math.min(1, watermarkStartY + (moveEvent.clientY - pointerStartY) / canvasDisplayHeight));
        bus.emit('move', watermark);
      };

      const onPointerUp = () => {
        handleLayer.removeEventListener('pointermove', onPointerMove);
        handleLayer.removeEventListener('pointerup',   onPointerUp);
      };

      // { passive: false } is required — without it, preventDefault() is silently
      // ignored on mobile and the browser scrolls the page during the drag.
      handleLayer.addEventListener('pointermove', onPointerMove, { passive: false });
      handleLayer.addEventListener('pointerup',   onPointerUp);
    };
    handleElement.addEventListener('pointerdown', onPointerDown);
  },
};

