let _nextId = 1;

export const state = {
  image:         null,
  imageName:     'example.jpg',
  exportFormat:  'png',
  exportQuality: 92,
  resizeTo:      800,
  watermarks:    [],
  selectedId:    null,
};

export function createWatermark(overrides = {}) {
  return {
    id:            _nextId++,
    text:          'YOUR WATERMARK',
    font:          'Inter',
    weight:        500,
    size:          36,
    color:         '#ffffff',
    opacity:       0.55,
    x:             0.5,
    y:             0.5,
    rotation:      0,
    letterSpacing: 2,
    visible:       true,
    ...overrides,
  };
}
