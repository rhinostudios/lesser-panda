var core = require('../core');
var Timer = require('engine/timer');

/**
  @class AnimationData
  @constructor
  @param {Array} frames
  @param {Object} [props]
**/
function AnimationData(frames, props) {
  /**
    Is animation looping.
    @property {Boolean} loop
    @default true
  **/
  this.loop = true;
  /**
    Play animation in random order.
    @property {Boolean} random
    @default false
  **/
  this.random = false;
  /**
    Play animation in reverse.
    @property {Boolean} reverse
    @default false
  **/
  this.reverse = false;
  /**
    Speed of animation (frames per second).
    @property {Number} speed
    @default 10
  **/
  this.speed = 10;
  /**
    Animation frame order.
    @property {Array} frames
  **/
  this.frames = frames;

  Object.assign(this, props);
}

/**
  @class Animation
  @extends DisplayObject
  @constructor
  @param {Array} textures Textures this animation made up of
**/
function Animation(textures) {
  this.anims = {};
  this.currentAnim = 'default';
  this.currentFrame = 0;
  this.playing = false;
  this.finished = false;

  this._finishEvtEmit = false;
  this._frameTime = 0;

  this.textures = textures;

  var newTextures = [];
  for (var i = 0; i < this.textures.length; i++) {
    var texture = this.textures[i];
    if (!(texture instanceof core.Texture)) {
      texture = core.Texture.fromFrame(texture);
    }

    newTextures.push(texture);
  }

  if (newTextures.length > 0) {
    this.textures = newTextures;
  }

  this.addAnim('default');

  core.Sprite.call(this, this.textures[0]);
};

Animation.prototype = Object.create(core.Sprite.prototype);
Animation.prototype.constructor = Animation;

/**
  Add new animation.
  @method addAnim
  @param {String} name
  @param {Array} [frames]
  @param {Object} [props]
  @chainable
**/
Animation.prototype.addAnim = function addAnim(name, frames, props) {
  if (!name) return;
  if (!frames) {
    frames = [];
    for (var i = 0; i < this.textures.length; i++) {
      frames.push(i);
    }
  }

  var anim = new AnimationData(frames, props);
  this.anims[name] = anim;
  return this;
};

/**
  Play animation.
  @method play
  @param {String} name Name of animation
  @param {Number} [frame] Frame index
  @chainable
**/
Animation.prototype.play = function play(name, frame) {
  name = name || this.currentAnim;
  var anim = this.anims[name];
  if (!anim) return;
  this.playing = true;
  this._finishEvtEmit = false;
  this.finished = false;
  this.currentAnim = name;
  if (typeof frame !== 'number' && anim.reverse) {
    frame = anim.frames.length - 1;
  }

  this.gotoFrame(frame || 0);
  return this;
};

/**
  Stop animation.
  @method stop
  @param {Number} [frame] Frame index
  @chainable
**/
Animation.prototype.stop = function stop(frame) {
  this.playing = false;
  if (typeof frame === 'number') this.gotoFrame(frame);
  return this;
};

/**
  Jump to specific frame.
  @method gotoFrame
  @param {Number} frame
  @chainable
**/
Animation.prototype.gotoFrame = function gotoFrame(frame) {
  var anim = this.anims[this.currentAnim];
  if (!anim) return;
  this.currentFrame = frame;
  this._frameTime = 0;
  this.texture = this.textures[anim.frames[frame]];
  return this;
};

/**
  @method updateAnimation
**/
Animation.prototype.updateAnimation = function updateAnimation() {
  var anim = this.anims[this.currentAnim];

  if (this.finished) {
    if (!this._finishEvtEmit) {
      this.emit('finish', this);
    }

    return;
  }
  else if (this.playing) {
    this._frameTime += anim.speed * (Timer.delta / 1000);
  }

  if (this._frameTime >= 1) {
    this._frameTime = 0;

    if (anim.random && anim.frames.length > 1) {
      var nextFrame = this.currentFrame;
      while (nextFrame === this.currentFrame) {
        var nextFrame = Math.round(Math.random(0, anim.frames.length - 1));
      }

      this.currentFrame = nextFrame;
      this.texture = this.textures[anim.frames[nextFrame]];
      return;
    }

    var nextFrame = this.currentFrame + (anim.reverse ? -1 : 1);

    if (nextFrame >= anim.frames.length) {
      if (anim.loop) {
        this.currentFrame = 0;
        this.texture = this.textures[anim.frames[0]];
      } else {
        this.playing = false;
        this.finished = true;
        this._finishEvtEmit = false;
      }
    } else if (nextFrame < 0) {
      if (anim.loop) {
        this.currentFrame = anim.frames.length - 1;
        this.texture = this.textures[anim.frames.last()];
      } else {
        this.playing = false;
        this.finished = true;
        this._finishEvtEmit = false;
      }
    } else {
      this.currentFrame = nextFrame;
      this.texture = this.textures[anim.frames[nextFrame]];
    }
  }
};

Animation.prototype.updateTransform = function updateTransform() {
  if (this.currentAnim) this.updateAnimation();
  core.Sprite.prototype.updateTransform.call(this);
};

Object.assign(Animation, {
  // TODO: cache sheet textures instead of creating each time
  fromSpriteSheet: function fromSpriteSheet(sheet, width, height, frameNum) {
    var sheetTexture = sheet;
    if (!(sheetTexture instanceof core.Texture)) {
      sheetTexture = core.Texture.fromFrame(sheetTexture);
    }

    var crop = sheetTexture.crop;
    var baseTexture = sheetTexture.baseTexture;
    var col = Math.floor(sheetTexture.width / width);
    var row = Math.floor(sheetTexture.height / height);
    var fNum = Math.min(frameNum, col * row);

    var x, y, textures = [];
    for (var i = 0; i < fNum; i++) {
      x = (i % col) * width;
      y = Math.floor(i / col) * height;
      textures.push(new core.Texture(baseTexture, new core.Rectangle(x + crop.x, y + crop.y, width, height)));
    }

    return new Animation(textures);
  },
});

module.exports = Animation;
