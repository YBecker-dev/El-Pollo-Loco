/**
 * Throwable bottle object class with rotation and splash animations
 * @class
 * @extends MovableObject
 */
class ThrowableObject extends MovableObject {
  hit = false;
  throwInterval;
  animationInterval;
  splashAnimationComplete = false;
  splashAnimationStartTime = 0;

  BOTTLE_ROTATION_IMAGES = [
    'img_pollo_locco/img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png',
    'img_pollo_locco/img/6_salsa_bottle/bottle_rotation/2_bottle_rotation.png',
    'img_pollo_locco/img/6_salsa_bottle/bottle_rotation/3_bottle_rotation.png',
    'img_pollo_locco/img/6_salsa_bottle/bottle_rotation/4_bottle_rotation.png',
  ];

  BOTTLE_SPLASH_IMAGES = [
    'img_pollo_locco/img/6_salsa_bottle/bottle_rotation/bottle_splash/1_bottle_splash.png',
    'img_pollo_locco/img/6_salsa_bottle/bottle_rotation/bottle_splash/2_bottle_splash.png',
    'img_pollo_locco/img/6_salsa_bottle/bottle_rotation/bottle_splash/3_bottle_splash.png',
    'img_pollo_locco/img/6_salsa_bottle/bottle_rotation/bottle_splash/4_bottle_splash.png',
    'img_pollo_locco/img/6_salsa_bottle/bottle_rotation/bottle_splash/5_bottle_splash.png',
    'img_pollo_locco/img/6_salsa_bottle/bottle_rotation/bottle_splash/6_bottle_splash.png',
  ];

  /**
   * Creates an instance of ThrowableObject
   * @constructor
   * @param {number} x - X position to throw from
   * @param {number} y - Y position to throw from
   * @param {boolean} throwLeft - True if throwing left, false for right
   */
  constructor(x, y, throwLeft = false) {
    super().loadImage('img_pollo_locco/img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png');
    this.loadImages(this.BOTTLE_ROTATION_IMAGES);
    this.loadImages(this.BOTTLE_SPLASH_IMAGES);
    this.x = x;
    this.y = y + 100;
    this.height = 80;
    this.width = 50;
    this.throwLeft = throwLeft;
    this.OtherDirection = throwLeft;
    this.throw();
    this.animate();
  }

  /**
   * Starts bottle animation intervals
   */
  animate() {
    this.animationInterval = setStoppableInterval(() => {
      if (this.hit) {
        this.handleSplashAnimation();
      } else {
        this.playAnimation(this.BOTTLE_ROTATION_IMAGES);
      }
    }, 100);
  }

  /**
   * Handles splash animation when bottle hits something
   */
  handleSplashAnimation() {
    if (this.splashAnimationStartTime === 0) {
      this.initializeSplashAnimation();
    }
    this.playAnimation(this.BOTTLE_SPLASH_IMAGES);
    this.checkSplashAnimationComplete();
  }

  /**
   * Initializes splash animation sequence
   */
  initializeSplashAnimation() {
    this.splashAnimationStartTime = Date.now();
    this.currentImage = 0;
    clearStoppableInterval(this.throwInterval);
    this.pauseGravity();
  }

  /**
   * Checks if splash animation has completed
   */
  checkSplashAnimationComplete() {
    const elapsedTime = Date.now() - this.splashAnimationStartTime;
    if (elapsedTime >= this.BOTTLE_SPLASH_IMAGES.length * 100) {
      this.splashAnimationComplete = true;
      clearStoppableInterval(this.animationInterval);
    }
  }

  /**
   * Throws the bottle with physics in the specified direction
   */
  throw() {
    this.speedY = 20;
    this.applyGravity();
    let direction = 1;
    if (this.throwLeft) {
      direction = -1;
    }
    this.throwInterval = setStoppableInterval(() => {
      this.x += 10 * direction;
    }, 25);
  }

  /**
   * Pauses bottle animations and physics
   */
  pauseAnimations() {
    clearStoppableInterval(this.throwInterval);
    clearStoppableInterval(this.animationInterval);
    this.pauseGravity();
  }

  /**
   * Resumes bottle animations and physics
   */
  resumeAnimations() {
    this.resumeThrowInterval();
    this.resumeAnimationInterval();
    this.resumeGravity();
  }

  /**
   * Resumes throw movement interval
   */
  resumeThrowInterval() {
    let direction = 1;
    if (this.throwLeft) {
      direction = -1;
    }
    this.throwInterval = setStoppableInterval(() => {
      this.x += 10 * direction;
    }, 25);
  }

  /**
   * Resumes animation interval
   */
  resumeAnimationInterval() {
    this.animationInterval = setStoppableInterval(() => {
      if (this.hit) {
        this.playAnimation(this.BOTTLE_SPLASH_IMAGES);
      } else {
        this.playAnimation(this.BOTTLE_ROTATION_IMAGES);
      }
    }, 100);
  }
}
