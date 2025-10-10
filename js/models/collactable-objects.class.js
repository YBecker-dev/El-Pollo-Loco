/**
 * Base class for collectable game objects
 * @class
 * @extends DrawableObject
 */
class CollectableObject extends DrawableObject {
  collected = false;

  /**
   * Marks the object as collected
   */
  collect() {
    this.collected = true;
  }

  /**
   * Gets hitbox offsets for collectable objects
   * @returns {Object} Hitbox offset values
   */
  getHitboxOffsets() {
    return {
      offsetX: 0,
      offsetYTop: 0,
      offsetYBottom: 0,
    };
  }
}
