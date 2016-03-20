var Filter = require('../Filter'),
    math =  require('../../../../math');

// @see https://github.com/substack/brfs/issues/25

/**
 * The SpriteMaskFilter class
 *
 * @class
 * @extends PIXI.AbstractFilter
 * @memberof PIXI
 * @param sprite {PIXI.Sprite} the target sprite
 */
function SpriteMaskFilter(sprite)
{
    var maskMatrix = new math.Matrix();

    Filter.call(this,
         require('./spriteMaskFilter.vert'),
         require('./spriteMaskFilter.frag')
    );

    sprite.renderable = false;

    this.maskSprite = sprite;
    this.maskMatrix = maskMatrix;
}

SpriteMaskFilter.prototype = Object.create(Filter.prototype);
SpriteMaskFilter.prototype.constructor = SpriteMaskFilter;
module.exports = SpriteMaskFilter;

/**
 * Applies the filter
 *
 * @param renderer {PIXI.WebGLRenderer} The renderer to retrieve the filter from
 * @param input {PIXI.RenderTarget}
 * @param output {PIXI.RenderTarget}
 */
SpriteMaskFilter.prototype.apply = function (filterManager, input, output)
{
    var maskSprite = this.maskSprite;

    this.uniforms.mask = maskSprite._texture;
    this.uniforms.otherMatrix = filterManager.calculateSpriteMatrix(this.maskMatrix, maskSprite );
    this.uniforms.alpha = maskSprite.worldAlpha;

    filterManager.applyFilter(this, input, output);
};
