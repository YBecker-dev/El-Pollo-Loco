/**
 * Enemy chicken class with walking animation and death behavior
 * @class
 * @extends MovableObject
 */
class Chicken extends MovableObject {
  IMAGES_WALKING = [];
  IMAGES_DEAD = [];
  deadTime = 0;
  movementInterval;
  animationInterval;
  type;

  /**
   * Creates an instance of Chicken
   * @constructor
   * @param {string} type - Type of chicken ('normal' or 'small')
   */
  constructor(type = 'normal') {
    super();
    this.type = type;
    this.initializeChickenType();
    this.loadChickenImages();
    this.setChickenPosition();
    this.animate();
  }

  /**
   * Initializes chicken properties based on type
   */
  initializeChickenType() {
    const folder = this.getChickenFolder();
    const size = this.getChickenSize();

    this.IMAGES_WALKING = [
      `img_pollo_locco/img/3_enemies_chicken/${folder}/1_walk/1_w.png`,
      `img_pollo_locco/img/3_enemies_chicken/${folder}/1_walk/2_w.png`,
      `img_pollo_locco/img/3_enemies_chicken/${folder}/1_walk/3_w.png`,
    ];
    this.IMAGES_DEAD = [`img_pollo_locco/img/3_enemies_chicken/${folder}/2_dead/dead.png`];
    this.width = size.width;
    this.height = size.height;
  }

  /**
   * Gets image folder path based on chicken type
   * @returns {string} Folder name for chicken images
   */
  getChickenFolder() {
    if (this.type === 'small') {
      return 'chicken_small';
    } else {
      return 'chicken_normal';
    }
  }

  /**
   * Gets size dimensions based on chicken type
   * @returns {Object} Width and height of chicken
   */
  getChickenSize() {
    if (this.type === 'small') {
      return { width: 60, height: 80 };
    } else {
      return { width: 70, height: 100 };
    }
  }

  /**
   * Loads all chicken images
   */
  loadChickenImages() {
    this.loadImage(this.IMAGES_WALKING[0]);
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_DEAD);
  }

  /**
   * Sets random position and speed for chicken
   */
  setChickenPosition() {
    this.x = 600 + Math.random() * 3000;
    this.y = 435 - this.height;
    this.speed = 0.1 + Math.random() * 0.25;
  }

  /**
   * Handles chicken being hit and killed
   */
  hit() {
    this.isDead = true;
    this.deadTime = new Date().getTime();
    this.loadImage(this.IMAGES_DEAD[0]);
    soundManager.playSound('chickenDead');
  }

  /**
   * Kills the chicken
   */
  die() {
    this.hit();
  }

  /**
   * Starts chicken movement and animation intervals
   */
  animate() {
    this.movementInterval = setStoppableInterval(() => {
      if (!this.isDead) {
        this.moveLeft();
      }
    }, 1000 / 144);
    this.animationInterval = setStoppableInterval(() => {
      if (!this.isDead) {
        this.playAnimation(this.IMAGES_WALKING);
      }
    }, 100);
  }

  /**
   * Pauses chicken animations
   */
  pauseAnimations() {
    clearStoppableInterval(this.movementInterval);
    clearStoppableInterval(this.animationInterval);
  }

  /**
   * Resumes chicken animations
   */
  resumeAnimations() {
    this.animate();
  }
}
