import { state, createWatermark } from './state.js';
import { bus } from './utils.js';

export const Presets = {
  apply(preset) {
    const text = state.watermarks.find(w => w.id === state.selectedId)?.text ?? 'YOUR WATERMARK';
    state.watermarks = [];

    const mk = overrides => {
      const wm = createWatermark({ text, size: 36, ...overrides });
      state.watermarks.push(wm);
      return wm;
    };

    switch (preset) {
      case 'grid2':
        for (let r = 0; r < 5; r++)
          for (let c = 0; c < 2; c++)
            mk({ x: 0.25 + c * 0.5, y: 0.1 + r * 0.2, size: 28, opacity: 0.45 });
        break;
      case 'grid3':
        for (let r = 0; r < 6; r++)
          for (let c = 0; c < 3; c++)
            mk({ x: 0.17 + c * 0.33, y: 0.08 + r * 0.17, size: 22, opacity: 0.4 });
        break;
      case 'diagTL':
        for (let i = 0; i < 5; i++)
          mk({ x: 0.15 + i * 0.17, y: 0.15 + i * 0.17, size: 30, opacity: 0.5, rotation: -30 });
        break;
      case 'diagTR':
        for (let i = 0; i < 5; i++)
          mk({ x: 0.85 - i * 0.17, y: 0.15 + i * 0.17, size: 30, opacity: 0.5, rotation: 30 });
        break;
      case 'corners':
        mk({ x: 0.15, y: 0.12, size: 26 }); mk({ x: 0.85, y: 0.12, size: 26 });
        mk({ x: 0.5,  y: 0.5,  size: 34 });
        mk({ x: 0.15, y: 0.88, size: 26 }); mk({ x: 0.85, y: 0.88, size: 26 });
        break;
      case 'center':
        mk({ x: 0.5, y: 0.5, size: 64, weight: 700, letterSpacing: 8 });
        break;
      case 'edgeBottom':
        mk({ text: `© ${text} – 2026`, x: 0.5, y: 0.94, size: 20, letterSpacing: 4, opacity: 0.75 });
        break;
      case 'tileDiag':
        for (let r = -2; r < 8; r++)
          for (let c = -1; c < 5; c++)
            mk({ x: 0.1 + c * 0.3 + (r % 2) * 0.15, y: 0.1 + r * 0.14, size: 20, opacity: 0.35, rotation: -30 });
        break;
      // 'clear' — state.watermarks already reset above
    }

    bus.emit('select', { id: state.watermarks[0]?.id ?? null });
  },
};
