var Shader = require('engine/pixi/gl-core').GLShader;

/**
 * @class
 * @extends PIXI.Shader
 * @memberof PIXI.mesh
 * @param shaderManager {PIXI.ShaderManager} The WebGL shader manager this shader works for.
 */
function TilingShader(gl)
{
    Shader.call(this,
        gl,
         require('./tilingSprite.vert'),
         require('./tilingSprite.frag')
    );
}

TilingShader.prototype = Object.create(Shader.prototype);
TilingShader.prototype.constructor = TilingShader;
module.exports = TilingShader;

