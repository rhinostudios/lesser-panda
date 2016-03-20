var BaseRenderTexture = require('./BaseRenderTexture'),
    Texture = require('./Texture');

/**
 * A RenderTexture is a special texture that allows any Pixi display object to be rendered to it.
 *
 * __Hint__: All DisplayObjects (i.e. Sprites) that render to a RenderTexture should be preloaded
 * otherwise black rectangles will be drawn instead.
 *
 * A RenderTexture takes a snapshot of any Display Object given to its render method. The position
 * and rotation of the given Display Objects is ignored. For example:
 *
 * ```js
 * var renderer = PIXI.autoDetectRenderer(1024, 1024, { view: canvas, ratio: 1 });
 * var renderTexture = new PIXI.RenderTexture(renderer, 800, 600);
 * var sprite = PIXI.Sprite.fromImage("spinObj_01.png");
 *
 * sprite.position.x = 800/2;
 * sprite.position.y = 600/2;
 * sprite.anchor.x = 0.5;
 * sprite.anchor.y = 0.5;
 *
 * renderTexture.render(sprite);
 * ```
 *
 * The Sprite in this case will be rendered to a position of 0,0. To render this sprite at its actual
 * position a Container should be used:
 *
 * ```js
 * var doc = new PIXI.Container();
 *
 * doc.addChild(sprite);
 *
 * renderTexture.render(doc);  // Renders to center of renderTexture
 * ```
 *
 * @class
 * @extends PIXI.Texture
 * @memberof PIXI
 * @param renderer {PIXI.CanvasRenderer|PIXI.WebGLRenderer} The renderer used for this RenderTexture
 * @param [width=100] {number} The width of the render texture
 * @param [height=100] {number} The height of the render texture
 * @param [scaleMode] {number} See {@link PIXI.SCALE_MODES} for possible values
 * @param [resolution=1] {number} The resolution of the texture being generated
 */
function RenderTexture(baseRenderTexture, frame)
{
    if(baseRenderTexture instanceof Number)
    {
        // we have an old render texture..
        console.warn('v4 RenderTexture now expects a new BaseRenderTexture. Please use RenderTexture.create(400, 400)')

        var width = baseRenderTexture;
        var height = frame;
        
        baseRenderTexture = new BaseRenderTexture(width, height);
    }

    /**
     * The base texture object that this texture uses
     *
     * @member {BaseTexture}
     */
    Texture.call(this,
        baseRenderTexture,
        frame
    );

    /**
     * @member {boolean}
     */
    this.valid = true;

    this._updateUvs();
}

RenderTexture.prototype = Object.create(Texture.prototype);
RenderTexture.prototype.constructor = RenderTexture;
module.exports = RenderTexture;

/**
 * Resizes the RenderTexture.
 *
 * @param width {number} The width to resize to.
 * @param height {number} The height to resize to.
 * @param updateBase {boolean} Should the baseTexture.width and height values be resized as well?
 */
RenderTexture.prototype.resize = function (width, height, doNotResizeBaseTexture)
{

    //TODO - could be not required..
    this.valid = (width > 0 && height > 0);

    this._frame.width = this.crop.width = width;
    this._frame.height = this.crop.height = height;

    if (!doNotResizeBaseTexture)
    {
        this.baseTexture.resize(width, height);
    }

    this._updateUvs();
};


RenderTexture.create = function(width, height, scaleMode, resolution)
{
    return new RenderTexture(new BaseRenderTexture(width, height, scaleMode, resolution));
};
