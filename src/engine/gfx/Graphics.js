var Graphics = require('./core/graphics/Graphics');
var Vector = require('engine/Vector');
var CONST = require('./const');
require('./core/graphics/webgl/GraphicsRenderer');

const DEFAULT_POLYGON_VERTICES = [
  Vector.create(-4, -4),
  Vector.create(+4, -4),
  Vector.create(+4, +4),
  Vector.create(-4, +4),
];

/**
 * Factory function for `Graphics`.
 *
 * @param {object} data
 * @return {Graphics}
 */
module.exports = function(data) {
  let inst = new Graphics();

  // TODO: add fill/stroke support
  inst.beginFill(data.color || 0x000000);
  let shape = data.shape || 'Box';
  if (shape === 'Circle') {
    inst.drawCircle(0, 0, data.radius || 8);
  }
  else if (shape === 'Box') {
    let w = data.width || 8;
    let h = data.height || 8;
    inst.drawRect(-w / 2, -h / 2, w, h);
  }
  else if (shape === 'Polygon') {
    let points = data.points || DEFAULT_POLYGON_VERTICES;
    inst.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
      inst.lineTo(points[i].x, points[i].y);
    }
  }
  inst.endFill();

  for (let k in data) {
    switch (k) {
      // Directly set
      // - Container
      case 'alpha':
      case 'width':
      case 'height':
      case 'rotation':
      case 'visible':
      case 'x':
      case 'y':
      case 'interactive':
      // - Sprite
      case 'tint':
      // - Graphics
      case 'boundsPadding':
        inst[k] = data[k];
        break;

      // Set vector
      // - Container
      case 'pivot':
      case 'position':
      case 'skew':
        inst[k].x = data[k].x || 0;
        inst[k].y = data[k].y || 0;
        break;

      // - Container
      case 'scale':
        inst[k].x = data[k].x || 1;
        inst[k].y = data[k].y || 1;
        break;

      // Set blend mode
      case 'blendMode':
        inst.blendMode = CONST.BLEND_MODES[data[k]];
        break;
    }
  }

  return inst;
};
