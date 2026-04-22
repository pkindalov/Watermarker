import { THEME_VARS, STAGE_COLORS } from './constants.js';
import { segSelect } from './utils.js';

export const Tweaks = {
  _s: { theme: 'warm', stage: 'dark', accent: 'oklch(0.72 0.14 65)' },

  apply() {
    const r = document.documentElement.style;
    const { bg, panel2, hair, hair2 } = THEME_VARS[this._s.theme] ?? THEME_VARS.warm;
    r.setProperty('--accent',  this._s.accent);
    r.setProperty('--bg',      bg);
    r.setProperty('--panel-2', panel2);
    r.setProperty('--hair',    hair);
    r.setProperty('--hair-2',  hair2);
    r.setProperty('--stage',   STAGE_COLORS[this._s.stage] ?? STAGE_COLORS.dark);
  },

  persist() {
    try { window.parent.postMessage({ type: '__edit_mode_set_keys', edits: this._s }, '*'); } catch (err) { console.debug('tweaks: postMessage blocked (cross-origin)', err); }
  },

  init() {
    this.apply();
    const panel = document.getElementById('tweaksPanel');

    const onMessage = ({ data: d = {} }) => {
      if (d.type === '__activate_edit_mode')   panel.classList.add('visible');
      if (d.type === '__deactivate_edit_mode') panel.classList.remove('visible');
    };
    window.addEventListener('message', onMessage);
    try { window.parent.postMessage({ type: '__edit_mode_available' }, '*'); } catch (err) { console.debug('tweaks: postMessage blocked (cross-origin)', err); }

    document.getElementById('tweaksClose').addEventListener('click', () => panel.classList.remove('visible'));

    document.getElementById('themeSeg').addEventListener('click', e => {
      const b = e.target.closest('button[data-theme]');
      if (!b) return;
      segSelect('themeSeg', b.dataset.theme, 'theme');
      this._s.theme = b.dataset.theme;
      this.apply(); this.persist();
    });

    document.getElementById('stageSeg').addEventListener('click', e => {
      const b = e.target.closest('button[data-stage]');
      if (!b) return;
      segSelect('stageSeg', b.dataset.stage, 'stage');
      this._s.stage = b.dataset.stage;
      this.apply(); this.persist();
    });

    document.querySelectorAll('#tweaksPanel .sw').forEach(sw => {
      sw.addEventListener('click', () => {
        document.querySelectorAll('#tweaksPanel .sw').forEach(s => s.classList.remove('active'));
        sw.classList.add('active');
        this._s.accent = sw.dataset.accent;
        this.apply(); this.persist();
      });
    });
  },
};
