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
    const folder = type === 'small' ? 'chicken_small' : 'chicken_normal';
    const size = type === 'small' ? { width: 60, height: 80 } : { width: 70, height: 100 };
    this.IMAGES_WALKING = [
      `img_pollo_locco/img/3_enemies_chicken/${folder}/1_walk/1_w.png`,
      `img_pollo_locco/img/3_enemies_chicken/${folder}/1_walk/2_w.png`,
      `img_pollo_locco/img/3_enemies_chicken/${folder}/1_walk/3_w.png`,
    ];
    this.IMAGES_DEAD = [`img_pollo_locco/img/3_enemies_chicken/${folder}/2_dead/dead.png`];
    this.loadImage(this.IMAGES_WALKING[0]);
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_DEAD);
    this.x = 300 + Math.random() * 3000;
    this.width = size.width;
    this.height = size.height;
    this.y = 435 - this.height;
    this.speed = 0.1 + Math.random() * 0.25;
    this.animate();
  }

  hit() {
    this.isDead = true;
    this.deadTime = new Date().getTime();
    this.loadImage(this.IMAGES_DEAD[0]);
    console.log(`💀 ${this.type === 'small' ? 'Small' : 'Normal'} Chicken died!`);
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
