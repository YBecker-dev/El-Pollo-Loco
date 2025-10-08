class Chicken extends MovableObject {
  IMAGES_WALKING = [];
  IMAGES_DEAD = [];
  isDead = false;
  deadTime = 0;
  movementInterval;
  animationInterval;
  type;

  constructor(type = 'normal') {
    super();
    this.type = type;
    this.initializeChickenType();
    this.loadChickenImages();
    this.setChickenPosition();
    this.animate();
  }

  initializeChickenType() {
    const folder = this.type === 'small' ? 'chicken_small' : 'chicken_normal';
    const size = this.type === 'small' ? { width: 60, height: 80 } : { width: 70, height: 100 };

    this.IMAGES_WALKING = [
      `img_pollo_locco/img/3_enemies_chicken/${folder}/1_walk/1_w.png`,
      `img_pollo_locco/img/3_enemies_chicken/${folder}/1_walk/2_w.png`,
      `img_pollo_locco/img/3_enemies_chicken/${folder}/1_walk/3_w.png`,
    ];
    this.IMAGES_DEAD = [`img_pollo_locco/img/3_enemies_chicken/${folder}/2_dead/dead.png`];
    this.width = size.width;
    this.height = size.height;
  }

  loadChickenImages() {
    this.loadImage(this.IMAGES_WALKING[0]);
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_DEAD);
  }

  setChickenPosition() {
    this.x = 300 + Math.random() * 3000;
    this.y = 435 - this.height;
    this.speed = 0.1 + Math.random() * 0.25;
  }

  hit() {
    this.isDead = true;
    this.deadTime = new Date().getTime();
    this.loadImage(this.IMAGES_DEAD[0]);
  }

  die() {
    this.hit();
  }

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

  pauseAnimations() {
    clearStoppableInterval(this.movementInterval);
    clearStoppableInterval(this.animationInterval);
  }

  resumeAnimations() {
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
}
