import engine from 'engine/core';
import Scene from 'engine/scene';
import PIXI from 'engine/pixi';
import Timer from 'engine/timer';
import loader from 'engine/loader';

import config from 'game/config';
import 'game/loading';

// Load textures
loader.addAsset('gold_1.png', 'gold_1');
loader.addAsset('gold_2.png', 'gold_2');
loader.addAsset('gold_3.png', 'gold_3');
loader.addAsset('gold_4.png', 'gold_4');

// Load bitmap fonts
loader.addAsset('KenPixel.fnt');

PIXI.SCALE_MODES.DEFAULT = PIXI.SCALE_MODES.NEAREST;

class Main extends Scene {
  constructor() {
    super();

    // PIXI instance
    let text = new PIXI.extras.BitmapText('It Works!', {
      font: '32px KenPixel',
    }).addTo(this.stage);
    text.y = engine.height * 0.5;
    this.info = text;

    // AnimatedSprite with frames
    const anim = new PIXI.extras.AnimatedSprite([
      PIXI.Texture.fromAsset('gold_1'),
      PIXI.Texture.fromAsset('gold_2'),
      PIXI.Texture.fromAsset('gold_3'),
      PIXI.Texture.fromAsset('gold_4'),
    ]).addTo(this.stage);
    anim.position.set(engine.width * 0.5, 50);
    anim.anchor.set(0.5);
    anim.addAnim('rotate', [0, 1, 2, 3, 2, 1], { speed: 12 });
    anim.play('rotate');
  }
  update(dt) {
    this.info.x = engine.width * 0.5 - this.info.width * 0.5;
  }
};
engine.addScene('Main', Main);

engine.startWithScene('Loading');
