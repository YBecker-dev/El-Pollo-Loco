/**
 * Bottle collectable object class
 * @class
 * @extends CollectableObject
 */
class Bottle extends CollectableObject {
  /**
   * Creates an instance of Bottle
   * @constructor
   */
  constructor() {
    super();
    this.loadImage('img_pollo_locco/img/6_salsa_bottle/1_salsa_bottle_on_ground.png');
    this.x = 200 + Math.random() * 3250;
    this.y = 350;
    this.width = 80;
    this.height = 80;
  }

  /**
   * Gets bottle-specific hitbox offsets
   * @returns {Object} Offset values for bottle
   */
  getHitboxOffsets() {
    return {
      offsetLeft: this.width * 0.65,
      offsetRight: this.width * 0.4,
      offsetYTop: this.height * 0.15,
      offsetYBottom: this.height * 0.075,
    };
  }
}
