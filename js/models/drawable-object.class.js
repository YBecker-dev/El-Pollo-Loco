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
    const hitboxX = this.x + offsets.offsetX;
    const hitboxY = this.y + offsets.offsetYTop;
    const hitboxWidth = this.width - 2 * offsets.offsetX;
    const hitboxHeight = this.height - offsets.offsetYTop - offsets.offsetYBottom;

    ctx.save();
    ctx.beginPath();
    ctx.lineWidth = 3;
    ctx.strokeStyle = 'red';
    ctx.rect(hitboxX, hitboxY, hitboxWidth, hitboxHeight);
    ctx.stroke();
    ctx.restore();
  }

  /**
   * Draws the debug hitbox frame if applicable
   * @param {CanvasRenderingContext2D} ctx - Canvas rendering context
   */
  drawFrame(ctx) {
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
   * @returns {boolean} False - debug hitboxes are disabled
   */
  shouldDrawHitbox() {
    return false;
  }

  /**
   * Gets the appropriate hitbox offsets based on object type
   * @returns {Object} Object containing offsetX, offsetYTop, and offsetYBottom
   */
  getHitboxOffsets() {
    if (this instanceof Character) {
      return this.getCharacterHitboxOffsets();
    }
    if (this instanceof Chicken) {
      return this.getChickenHitboxOffsets();
    }
    if (this instanceof Coin) {
      return this.getCoinHitboxOffsets();
    }
    return { offsetX: 0, offsetYTop: 0, offsetYBottom: 0 };
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
