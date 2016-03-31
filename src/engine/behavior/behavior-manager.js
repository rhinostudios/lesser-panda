var utils = require('engine/utils');

/**
 * Behavior protocol
 */
var Behavior = {
  init: function(target, settings, memory) {}
};

function BehaviorManager(owner) {
  this.owner = owner;

  this.behaviors = [];
  /**
   * A map keeps behavior runtime informatinos, looks like this:
   * {
   *   // Each item is an array
   *   'Jump': [
   *     // Reference to the behavior object
   *     BehaviorJump,
   *
   *     // Whether this behavior is enabled
   *     true,
   *
   *     // A map to keep runtime data of this behavior,
   *     // so that behaviors will never mutate themselves
   *     // (like "pure functions")
   *     {
   *       isJumping: true,
   *     },
   *
   *     // Settings to initialize this behavior
   *     {}
   *   ]
   * }
   * @type {Object}
   */
  this.behaviorMap = {};
}

BehaviorManager.prototype.addBehavior = function(behavior, settings) {
  var pack = [behavior, true, {}, settings || {}];
  this.behaviorMap[behavior.name] = pack;
  this.behaviors.push(pack);

  return this;
};

BehaviorManager.prototype.removeBehavior = function(name) {
  if (this.behaviorMap.hasOwnProperty(name)) {
    utils.removeItems(this.behaviors, this.behaviors.indexOf(this.behaviorMap[name]), 1);
    delete this.behaviorMap[name];
  }
};

BehaviorManager.prototype.removeBehaviors = function() {
  this.behaviors.length = 0;
  this.behaviorMap = {};
};

BehaviorManager.prototype.hasBehavior = function(name) {
  return this.behaviorMap.hasOwnProperty(name);
};

BehaviorManager.prototype.enableBehavior = function(name) {
  var be = this.behaviorMap[name];
  if (be) {
    be[1] = true;
  }
};

BehaviorManager.prototype.disableBehavior = function(name) {
  var be = this.behaviorMap[name];
  if (be) {
    be[1] = false;
  }
};

BehaviorManager.prototype.isBehaviorEnabled = function(name) {
  var be = this.behaviorMap[name];
  if (be) {
    return be[1];
  }
  return false;
};

BehaviorManager.prototype.initBehaviors = function() {
  var i, be;
  for (i = 0; i < this.behaviors.length; i++) {
    be = this.behaviors[i];
    be[0].init(this.owner, be[3], be[2]);
  }
};

module.exports = exports = BehaviorManager;
