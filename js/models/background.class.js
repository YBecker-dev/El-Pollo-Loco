/**
 * Background object class for game scenery and parallax scrolling
 * @class
 * @extends MovableObject
 */
class BackgroundObject extends MovableObject {
  width = 720;
  height = 480;

  /**
   * Creates an instance of BackgroundObject
   * @constructor
   * @param {string} imagePath - Path to the background image file
   * @param {number} x - X position of the background object
   * @param {number} y - Y position of the background object
   */
  constructor(imagePath, x, y) {
    super();
    this.loadImage(imagePath);
    this.y = 480 - this.height;
    this.x = x;
  }
}
