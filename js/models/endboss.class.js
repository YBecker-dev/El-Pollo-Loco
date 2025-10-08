class Endboss extends MovableObject {
  height = 500;
  width = 300;
  y = -30;

  IMAGES_WALKING = [
    'img_pollo_locco/img/4_enemie_boss_chicken/1_walk/G1.png',
    'img_pollo_locco/img/4_enemie_boss_chicken/1_walk/G2.png',
    'img_pollo_locco/img/4_enemie_boss_chicken/1_walk/G3.png',
    'img_pollo_locco/img/4_enemie_boss_chicken/1_walk/G4.png',
  ];

  IMAGES_ALERT = [
    'img_pollo_locco/img/4_enemie_boss_chicken/2_alert/G5.png',
    'img_pollo_locco/img/4_enemie_boss_chicken/2_alert/G6.png',
    'img_pollo_locco/img/4_enemie_boss_chicken/2_alert/G7.png',
    'img_pollo_locco/img/4_enemie_boss_chicken/2_alert/G8.png',
    'img_pollo_locco/img/4_enemie_boss_chicken/2_alert/G9.png',
    'img_pollo_locco/img/4_enemie_boss_chicken/2_alert/G10.png',
    'img_pollo_locco/img/4_enemie_boss_chicken/2_alert/G11.png',
    'img_pollo_locco/img/4_enemie_boss_chicken/2_alert/G12.png',
  ];

  IMAGES_ATTACK = [
    'img_pollo_locco/img/4_enemie_boss_chicken/3_attack/G13.png',
    'img_pollo_locco/img/4_enemie_boss_chicken/3_attack/G14.png',
    'img_pollo_locco/img/4_enemie_boss_chicken/3_attack/G15.png',
    'img_pollo_locco/img/4_enemie_boss_chicken/3_attack/G16.png',
    'img_pollo_locco/img/4_enemie_boss_chicken/3_attack/G17.png',
    'img_pollo_locco/img/4_enemie_boss_chicken/3_attack/G18.png',
    'img_pollo_locco/img/4_enemie_boss_chicken/3_attack/G19.png',
    'img_pollo_locco/img/4_enemie_boss_chicken/3_attack/G20.png',
  ];

  IMAGES_HURT = [
    'img_pollo_locco/img/4_enemie_boss_chicken/4_hurt/G21.png',
    'img_pollo_locco/img/4_enemie_boss_chicken/4_hurt/G22.png',
    'img_pollo_locco/img/4_enemie_boss_chicken/4_hurt/G23.png',
  ];

  IMAGES_DEAD = [
    'img_pollo_locco/img/4_enemie_boss_chicken/5_dead/G24.png',
    'img_pollo_locco/img/4_enemie_boss_chicken/5_dead/G25.png',
    'img_pollo_locco/img/4_enemie_boss_chicken/5_dead/G26.png',
  ];

  world;
  health = 5;
  isDead = false;
  isHurt = false;
  hurtTime = 0;
  deadTime = 0;
  isVisible = false;
  animationInterval;
  movementInterval;

  constructor() {
    super();
    this.loadImage(this.IMAGES_WALKING[0]);

    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_ALERT);
    this.loadImages(this.IMAGES_ATTACK);
    this.loadImages(this.IMAGES_HURT);
    this.loadImages(this.IMAGES_DEAD);

    this.animate();
    this.x = 4000;
    this.speed = 0.5;
  }

  hit() {
    if (this.isDead) return;

    this.health--;
    this.isHurt = true;
    this.hurtTime = new Date().getTime();

    console.log('🎯 Endboss hit! Health remaining:', this.health, '/ 5');

    if (this.health <= 0) {
      this.die();
    }

    setTimeout(() => {
      this.isHurt = false;
    }, 500);
  }

  die() {
    this.isDead = true;
    this.deadTime = new Date().getTime();
    console.log('💀 Endboss defeated!');
  }

  getCurrentAnimationSet() {
    if (this.isDead) {
      return this.IMAGES_DEAD;
    } else if (this.isHurt) {
      return this.IMAGES_HURT;
    } else if (this.health <= 2 && this.health > 0) {
      return this.IMAGES_ATTACK;
    } else if (this.health <= 4 && this.health > 2) {
      return this.IMAGES_ALERT;
    } else {
      return this.IMAGES_WALKING;
    }
  }

  checkVisibility() {
    if (this.world && this.world.character) {
      let characterX = this.world.character.x;
      let endbossX = this.x;
      let distance = endbossX - characterX;

      if (distance < 720 && !this.isVisible) {
        this.isVisible = true;
        console.log('👁️ Endboss is now visible! Starting to move towards player.');
      }
    }
  }

  moveTowardsPlayer() {
    if (this.isVisible && !this.isDead && this.world && this.world.character) {
      let characterX = this.world.character.x;
      if (this.x > characterX + 100) {
        this.x -= this.speed;
      }
    }
  }

  animate() {
    this.animationInterval = setStoppableInterval(() => {
      this.playAnimation(this.getCurrentAnimationSet());
    }, 100);

    this.movementInterval = setStoppableInterval(() => {
      this.checkVisibility();
      this.moveTowardsPlayer();
    }, 1000 / 60);
  }

  pauseAnimations() {
    clearStoppableInterval(this.animationInterval);
    clearStoppableInterval(this.movementInterval);
  }

  resumeAnimations() {
    this.animationInterval = setStoppableInterval(() => {
      this.playAnimation(this.getCurrentAnimationSet());
    }, 100);

    this.movementInterval = setStoppableInterval(() => {
      this.checkVisibility();
      this.moveTowardsPlayer();
    }, 1000 / 60);
  }
}
