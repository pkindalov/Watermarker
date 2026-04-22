export const escHtml = function(s) {
  return String(s).replace(/[&<>"]/g, c =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c])
  );
};

export const toHex = function(color) {
  if (!color) return '#ffffff';
  if (/^#([0-9a-f]{3}){1,2}$/i.test(color)) {
    return color.length === 4
      ? '#' + [...color.slice(1)].map(x => x + x).join('')
      : color;
  }
  const probe = document.createElement('div');
  probe.style.color = color;
  document.body.appendChild(probe);
  const rgb = getComputedStyle(probe).color;
  document.body.removeChild(probe);
  const m = rgb.match(/\d+/g);
  return m ? '#' + m.slice(0, 3).map(n => (+n).toString(16).padStart(2, '0')).join('') : '#ffffff';
};

export const segSelect = function(segId, value, prop) {
  document.querySelectorAll(`#${segId} button`).forEach(b => {
    b.classList.toggle('active', b.dataset[prop] === String(value));
  });
};

export const debounce = function(fn, ms) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), ms);
  };
};

// Lightweight synchronous event bus — no circular imports needed.
const _handlers = new Map();

export const bus = {
  on(event, fn) {
    if (!_handlers.has(event)) _handlers.set(event, []);
    _handlers.get(event).push(fn);
  },
  emit(event, data) {
    _handlers.get(event)?.forEach(fn => fn(data));
  },
};
