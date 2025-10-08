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

  constructor(x, y) {
    super().loadImage('img_pollo_locco/img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png');
    this.loadImages(this.BOTTLE_ROTATION_IMAGES);
    this.loadImages(this.BOTTLE_SPLASH_IMAGES);
    this.x = x;
    this.y = y + 100;
    this.height = 80;
    this.width = 50;
    this.throw();
    this.animate();
  }

  animate() {
    this.animationInterval = setStoppableInterval(() => {
      if (this.hit) {
        this.handleSplashAnimation();
      } else {
        this.playAnimation(this.BOTTLE_ROTATION_IMAGES);
      }
    }, 100);
  }

  handleSplashAnimation() {
    if (this.splashAnimationStartTime === 0) {
      this.initializeSplashAnimation();
    }
    this.playAnimation(this.BOTTLE_SPLASH_IMAGES);
    this.checkSplashAnimationComplete();
  }

  initializeSplashAnimation() {
    this.splashAnimationStartTime = Date.now();
    this.currentImage = 0;
    clearStoppableInterval(this.throwInterval);
    this.pauseGravity();
  }

  checkSplashAnimationComplete() {
    let elapsedTime = Date.now() - this.splashAnimationStartTime;
    if (elapsedTime >= this.BOTTLE_SPLASH_IMAGES.length * 100) {
      this.splashAnimationComplete = true;
      clearStoppableInterval(this.animationInterval);
    }
  }

  throw() {
    this.speedY = 20;
    this.applyGravity();
    this.throwInterval = setStoppableInterval(() => {
      this.x += 10;
    }, 25);
  }

  pauseAnimations() {
    clearStoppableInterval(this.throwInterval);
    clearStoppableInterval(this.animationInterval);
    this.pauseGravity();
  }

  resumeAnimations() {
    this.throwInterval = setStoppableInterval(() => {
      this.x += 10;
    }, 25);
    this.animationInterval = setStoppableInterval(() => {
      if (this.hit) {
        this.playAnimation(this.BOTTLE_SPLASH_IMAGES);
      } else {
        this.playAnimation(this.BOTTLE_ROTATION_IMAGES);
      }
    }, 100);
    this.resumeGravity();
  }
}
