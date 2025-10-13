/**
 * Base class for all movable game objects with physics and animations
 * @class
 * @extends DrawableObject
 */
class MovableObject extends DrawableObject {
  speed = 0.15;
  OtherDirection = false;
  speedY = 0;
  acceleration = 2.5;
  energy = 100;
  isdead = false;
  lastHit = 0;
  gravityInterval;

  /**
   * Applies gravity physics to the object
   */
  applyGravity() {
    this.gravityInterval = setInterval(() => {
      if (this.isAboveGround() || this.speedY > 0) {
        this.y -= this.speedY;
        this.speedY -= this.acceleration;

        if (this.y > 100 && !(this instanceof ThrowableObject)) {
          this.y = 100;
          this.speedY = 0;
        }
      }
    }, 1000 / 25);
  }

  /**
   * Pauses gravity calculation
   */
  pauseGravity() {
    clearStoppableInterval(this.gravityInterval);
  }

  /**
   * Resumes gravity calculation
   */
  resumeGravity() {
    this.applyGravity();
  }

  /**
   * Checks if object is above ground level
   * @returns {boolean} True if object is above ground
   */
  isAboveGround() {
    if (this instanceof ThrowableObject) {
      return true;
    } else {
      return this.y < 100;
    }
  }

  /**
   * Moves object to the right
   */
  moveRight() {
    this.x += this.speed;
  }

  /**
   * Moves object to the left
   */
  moveLeft() {
    this.x -= this.speed;
  }

  /**
   * Makes the object jump with upward velocity
   */
  jump() {
    this.speedY = 25;
    soundManager.playSound('jump');
  }

  /**
   * Applies damage to the object and plays hurt sound
   */
  hit() {
    this.energy -= 5;
    if (this.energy <= 0) {
      this.energy = 0;
    } else {
      this.lastHit = new Date().getTime();
    }
    soundManager.playSound('hurt');
  }

  /**
   * Checks if object is currently in hurt state
   * @returns {boolean} True if hurt animation should play
   */
  isHurt() {
    let timepassed = new Date().getTime() - this.lastHit;
    timepassed = timepassed / 1000;
    return timepassed < 1;
  }

  /**
   * Checks if object is dead
   * @returns {boolean} True if energy is 0
   */
  isdead() {
    return this.energy == 0;
  }

  /**
   * Plays an animation from a set of images
   * @param {string[]} images - Array of image paths for animation
   */
  playAnimation(images) {
    const index = this.currentImage % images.length;
    const path = images[index];
    this.img = this.imageCache[path];
    this.currentImage++;
  }

  /**
   * Draws the object flipped horizontally
   * @param {CanvasRenderingContext2D} ctx - Canvas rendering context
   */
  drawOtherDirection(ctx) {
    ctx.save();
    ctx.translate(this.x + this.width, this.y);
    ctx.scale(-1, 1);
    ctx.drawImage(this.img, 0, 0, this.width, this.height);
    ctx.restore();
  }

  /**
   * Checks collision with another movable object
   * @param {MovableObject} mo - Other movable object to check collision with
   * @returns {boolean} True if objects are colliding
   */
  isColliding(mo) {
    return (
      this.x + this.width > mo.x && this.y + this.height > mo.y && this.x < mo.x + mo.width && this.y < mo.y + mo.height
    );
  }

  /**
   * Gets default hitbox offsets for movable objects
   * @returns {Object} Object containing offsetX, offsetYTop, and offsetYBottom
   */
  getHitboxOffsets() {
    return {
      offsetX: 0,
      offsetYTop: 0,
      offsetYBottom: 0,
    };
  }
}
