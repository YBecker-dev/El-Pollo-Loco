/**
 * Cloud background object class with floating animation
 * @class
 * @extends MovableObject
 */
class Cloud extends MovableObject {
  y = 20;
  width = 500;
  height = 250;
  movementInterval;

  /**
   * Creates an instance of Cloud
   * @constructor
   */
  constructor() {
    super();
    this.loadImage('img_pollo_locco/img/5_background/layers/4_clouds/1.png');
    this.x = Math.random() * 500;
    this.animate();
  }

  /**
   * Starts cloud movement animation
   */
  animate() {
    this.moveLeft();
  }

  /**
   * Moves cloud to the left continuously
   */
  moveLeft() {
    this.movementInterval = setStoppableInterval(() => {
      this.x -= this.speed;
    }, 1000 / 144);
  }

  /**
   * Pauses cloud movement animation
   */
  pauseAnimations() {
    clearStoppableInterval(this.movementInterval);
  }

  /**
   * Resumes cloud movement animation
   */
  resumeAnimations() {
    this.moveLeft();
  }
}
