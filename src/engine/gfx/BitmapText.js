const BitmapText = require('./core/text/BitmapText');
const textureFromData = require('./utils').textureFromData;
const CONST = require('./const');
require('./core/sprites/webgl/SpriteRenderer');

/**
 * Factory function for `BitmapText`.
 *
 * @param {object} data
 * @return {BitmapText}
 */
module.exports = function(data) {
  const inst = new BitmapText(data.text, data);

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

      // - BitmapText
      case 'font':
        inst.font = data.font;
        break;

      // Set blend mode
      case 'blendMode':
        inst.blendMode = CONST.BLEND_MODES[data[k]];
        break;
    }
  }

  return inst;
};
