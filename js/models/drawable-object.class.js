let offsetX;
let offsetYTop;
let offsetYBottom;

/**
 * Base class for all drawable game objects
 * @class
 */
class DrawableObject {
  img;
  imageCache = {};
  currentImage = 0;
  x = 100;
  y = 200;
  height = 250;
  width = 150;

  /**
   * Loads a single image from the specified path
   * @param {string} path - Path to the image file
   */
  loadImage(path) {
    this.img = new Image();
    this.img.src = path;
  }

  /**
   * Loads multiple images into the image cache
   * @param {string[]} arr - Array of image paths to load
   */
  loadImages(arr) {
    arr.forEach((path) => {
      const img = new Image();
      img.src = path;
      this.imageCache[path] = img;
    });
  }

  /**
   * Gets hitbox offset values for character objects
   * @returns {Object} Object containing offsetX, offsetYTop, and offsetYBottom
   */
  getCharacterHitboxOffsets() {
    return {
      offsetX: this.width * 0.1,
      offsetYTop: this.height * 0.35,
      offsetYBottom: this.height * 0.03,
    };
  }

  /**
   * Gets hitbox offset values for chicken objects
   * @returns {Object} Object containing offsetX, offsetYTop, and offsetYBottom
   */
  getChickenHitboxOffsets() {
    return {
      offsetX: this.width * 0,
      offsetYTop: this.height * 0.05,
      offsetYBottom: this.height * 0,
    };
  }

  /**
   * Gets hitbox offset values for coin objects
   * @returns {Object} Object containing offsetX, offsetYTop, and offsetYBottom
   */
  getCoinHitboxOffsets() {
    return this.getCollectableHitboxOffsets();
  }

  /**
   * Gets hitbox offset values for bottle objects
   * @returns {Object} Object containing offsetX, offsetYTop, and offsetYBottom
   */
  getBottleHitboxOffsets() {
    return this.getCollectableHitboxOffsets();
  }

  /**
   * Gets hitbox offset values for collectable objects (coins & bottles)
   * @returns {Object} Object containing offsetX, offsetYTop, and offsetYBottom
   */
  getCollectableHitboxOffsets() {
    return {
      offsetX: this.width * 0.3,
      offsetYTop: this.height * 0.3,
      offsetYBottom: this.height * 0.3,
    };
  }

  /**
   * Draws a red debug hitbox rectangle on the canvas
   * @param {CanvasRenderingContext2D} ctx - Canvas rendering context
   * @param {Object} offsets - Hitbox offset values
   */
  drawHitbox(ctx, offsets) {
    const dimensions = this.calculateHitboxDimensions(offsets);
    this.renderHitboxRect(ctx, dimensions);
  }

  /**
   * Calculates hitbox dimensions based on offsets
   * @param {Object} offsets - Hitbox offset values
   * @returns {Object} Hitbox dimensions (x, y, width, height)
   */
  calculateHitboxDimensions(offsets) {
    const offsetLeft = offsets.offsetLeft ?? offsets.offsetX;
    const offsetRight = offsets.offsetRight ?? offsets.offsetX;
    return {
      x: this.x + offsetLeft,
      y: this.y + offsets.offsetYTop,
      width: this.width - offsetLeft - offsetRight,
      height: this.height - offsets.offsetYTop - offsets.offsetYBottom,
    };
  }

  /**
   * Renders hitbox rectangle on canvas
   * @param {CanvasRenderingContext2D} ctx - Canvas rendering context
   * @param {Object} dimensions - Hitbox dimensions
   */
  renderHitboxRect(ctx, dimensions) {
    ctx.save();
    ctx.beginPath();
    ctx.lineWidth = 3;
    ctx.strokeStyle = 'red';
    ctx.rect(dimensions.x, dimensions.y, dimensions.width, dimensions.height);
    ctx.stroke();
    ctx.restore();
  }

  /**
   * Draws the debug hitbox frame if applicable
   * @param {CanvasRenderingContext2D} ctx - Canvas rendering context
   */
  drawFrame(ctx) {
    return;
    const shouldDraw = this.shouldDrawHitbox();
    if (shouldDraw) {
      const offsets = this.getHitboxOffsets();
      if (offsets) {
        this.drawHitbox(ctx, offsets);
      }
    }
  }

  /**
   * Determines if hitbox should be drawn for this object
   * @returns {boolean} True only for objects that need collision detection
   */
  shouldDrawHitbox() {
    return (
      this instanceof Character ||
      this instanceof Chicken ||
      this instanceof Endboss ||
      this instanceof Coin ||
      this instanceof Bottle ||
      this instanceof ThrowableObject
    );
  }

  /**
   * Draws the object image without directional flipping
   * @param {CanvasRenderingContext2D} ctx - Canvas rendering context
   */
  drawOtherDirectionReset(ctx) {
    if (this.img && this.img.complete) {
      ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    }
  }
}
