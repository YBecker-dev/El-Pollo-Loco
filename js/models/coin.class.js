/**
 * Coin collectable object class
 * @class
 * @extends CollectableObject
 */
class Coin extends CollectableObject {
  /**
   * Creates an instance of Coin
   * @constructor
   */
  constructor() {
    super();
    this.loadImage('img_pollo_locco/img/8_coin/coin_1.png');
    this.x = 200 + Math.random() * 3250;
    this.y = 50;
    this.width = 175;
    this.height = 175;
  }

  /**
   * Checks collision with another object using precise hitboxes
   * @param {MovableObject} mo - Object to check collision with
   * @returns {boolean} True if objects are colliding
   */
  isColliding(mo) {
    const thisBox = this.getHitbox();
    const moBox = this.getMoBox(mo);
    return (
      thisBox.x + thisBox.width > moBox.x &&
      thisBox.y + thisBox.height > moBox.y &&
      thisBox.x < moBox.x + moBox.width &&
      thisBox.y < moBox.y + moBox.height
    );
  }

  /**
   * Gets hitbox of another object
   * @param {MovableObject} mo - Object to get hitbox from
   * @returns {Object} Hitbox dimensions and position
   */
  getMoBox(mo) {
    if (mo.getHitbox) {
      return mo.getHitbox();
    } else {
      return this.calculateHitbox(mo);
    }
  }

  /**
   * Calculates hitbox for an object
   * @param {Object} obj - Object to calculate hitbox for
   * @returns {Object} Hitbox with x, y, width, and height
   */
  calculateHitbox(obj) {
    const offsets = this.getOffsetsForObj(obj);
    return {
      x: obj.x + offsets.offsetX,
      y: obj.y + offsets.offsetYTop,
      width: obj.width - 2 * offsets.offsetX,
      height: obj.height - offsets.offsetYTop - offsets.offsetYBottom,
    };
  }

  /**
   * Gets hitbox offsets for an object
   * @param {Object} obj - Object to get offsets from
   * @returns {Object} Offset values
   */
  getOffsetsForObj(obj) {
    if (obj.getHitboxOffsets) {
      return obj.getHitboxOffsets();
    } else {
      return { offsetX: 0, offsetYTop: 0, offsetYBottom: 0 };
    }
  }

  /**
   * Gets the coin's hitbox
   * @returns {Object} Hitbox with x, y, width, and height
   */
  getHitbox() {
    const offsets = this.getHitboxOffsets();
    return {
      x: this.x + offsets.offsetX,
      y: this.y + offsets.offsetYTop,
      width: this.width - 2 * offsets.offsetX,
      height: this.height - offsets.offsetYTop - offsets.offsetYBottom,
    };
  }

  /**
   * Gets coin-specific hitbox offsets
   * @returns {Object} Offset values for coin
   */
  getHitboxOffsets() {
    return {
      offsetX: this.width * 0.3,
      offsetYTop: this.height * 0.3,
      offsetYBottom: this.height * 0.3,
    };
  }
}
