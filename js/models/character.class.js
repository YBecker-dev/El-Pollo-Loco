class Character extends MovableObject {
  IMAGES_WALKING = [
    'img_pollo_locco/img/2_character_pepe/2_walk/W-21.png',
    'img_pollo_locco/img/2_character_pepe/2_walk/W-22.png',
    'img_pollo_locco/img/2_character_pepe/2_walk/W-23.png',
    'img_pollo_locco/img/2_character_pepe/2_walk/W-24.png',
    'img_pollo_locco/img/2_character_pepe/2_walk/W-25.png',
    'img_pollo_locco/img/2_character_pepe/2_walk/W-26.png',
  ];
  IMAGES_JUMPING = [
    'img_pollo_locco/img/2_character_pepe/3_jump/J-31.png',
    'img_pollo_locco/img/2_character_pepe/3_jump/J-32.png',
    'img_pollo_locco/img/2_character_pepe/3_jump/J-33.png',
    'img_pollo_locco/img/2_character_pepe/3_jump/J-34.png',
    'img_pollo_locco/img/2_character_pepe/3_jump/J-35.png',
    'img_pollo_locco/img/2_character_pepe/3_jump/J-36.png',
    'img_pollo_locco/img/2_character_pepe/3_jump/J-37.png',
    'img_pollo_locco/img/2_character_pepe/3_jump/J-38.png',
    'img_pollo_locco/img/2_character_pepe/3_jump/J-39.png',
  ];
  IMAGES_DEAD = [
    'img_pollo_locco/img/2_character_pepe/5_dead/D-51.png',
    'img_pollo_locco/img/2_character_pepe/5_dead/D-52.png',
    'img_pollo_locco/img/2_character_pepe/5_dead/D-53.png',
    'img_pollo_locco/img/2_character_pepe/5_dead/D-54.png',
    'img_pollo_locco/img/2_character_pepe/5_dead/D-55.png',
    'img_pollo_locco/img/2_character_pepe/5_dead/D-56.png',
    'img_pollo_locco/img/2_character_pepe/5_dead/D-57.png',
  ];
  IMAGES_HURT = [
    'img_pollo_locco/img/2_character_pepe/4_hurt/H-41.png',
    'img_pollo_locco/img/2_character_pepe/4_hurt/H-42.png',
    'img_pollo_locco/img/2_character_pepe/4_hurt/H-43.png',
  ];

  IMAGES_IDLE = [
    'img_pollo_locco/img/2_character_pepe/1_idle/idle/I-1.png',
    'img_pollo_locco/img/2_character_pepe/1_idle/idle/I-2.png',
    'img_pollo_locco/img/2_character_pepe/1_idle/idle/I-3.png',
    'img_pollo_locco/img/2_character_pepe/1_idle/idle/I-4.png',
    'img_pollo_locco/img/2_character_pepe/1_idle/idle/I-5.png',
    'img_pollo_locco/img/2_character_pepe/1_idle/idle/I-6.png',
    'img_pollo_locco/img/2_character_pepe/1_idle/idle/I-7.png',
    'img_pollo_locco/img/2_character_pepe/1_idle/idle/I-8.png',
    'img_pollo_locco/img/2_character_pepe/1_idle/idle/I-9.png',
    'img_pollo_locco/img/2_character_pepe/1_idle/idle/I-10.png',
  ];

  IMAGES_IDLE_LONG = [
    'img_pollo_locco/img/2_character_pepe/1_idle/long_idle/I-11.png',
    'img_pollo_locco/img/2_character_pepe/1_idle/long_idle/I-12.png',
    'img_pollo_locco/img/2_character_pepe/1_idle/long_idle/I-13.png',
    'img_pollo_locco/img/2_character_pepe/1_idle/long_idle/I-14.png',
    'img_pollo_locco/img/2_character_pepe/1_idle/long_idle/I-15.png',
    'img_pollo_locco/img/2_character_pepe/1_idle/long_idle/I-16.png',
    'img_pollo_locco/img/2_character_pepe/1_idle/long_idle/I-17.png',
    'img_pollo_locco/img/2_character_pepe/1_idle/long_idle/I-18.png',
    'img_pollo_locco/img/2_character_pepe/1_idle/long_idle/I-19.png',
    'img_pollo_locco/img/2_character_pepe/1_idle/long_idle/I-20.png',
  ];
  world;
  speed = 10;
  lastMovementTime = new Date().getTime();
  movementInterval;
  animationInterval;

  constructor() {
    super();
    this.loadImage('img_pollo_locco/img/2_character_pepe/2_walk/W-21.png');
    this.applyGravity();
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_JUMPING);
    this.loadImages(this.IMAGES_DEAD);
    this.loadImages(this.IMAGES_HURT);
    this.loadImages(this.IMAGES_IDLE);
    this.loadImages(this.IMAGES_IDLE_LONG);
    this.animate();
    this.width = 125;
    this.height = 350;
    this.y = 100;
  }

  isColliding(mo) {
    let thisOffsets = this.getHitboxOffsets();
    let moOffsets = mo.getHitboxOffsets();

    let thisX = this.x + thisOffsets.xWidth;
    let thisY = this.y + thisOffsets.yTop;
    let thisWidth = this.width - 2 * thisOffsets.xWidth;
    let thisHeight = this.height - thisOffsets.yTop - thisOffsets.yBottom;

    let moX = mo.x + moOffsets.xWidth;
    let moY = mo.y + moOffsets.yTop;
    let moWidth = mo.width - 2 * moOffsets.xWidth;
    let moHeight = mo.height - moOffsets.yTop - moOffsets.yBottom;
    return thisX + thisWidth > moX && thisY + thisHeight > moY && thisX < moX + moWidth && thisY < moY + moHeight;
  }

  getHitboxOffsets() {
    return {
      xWidth: this.width * 0.1,
      yTop: this.height * 0.35,
      yBottom: this.height * 0.03,
    };
  }

  isJumpingOnEnemy(enemy) {
    if (!this.isColliding(enemy) || enemy.isDead) {
      return false;
    }

    let thisOffsets = this.getHitboxOffsets();
    let characterBottom = this.y + this.height - thisOffsets.yBottom;
    let isInAir = this.isAboveGround();
    let isFalling = this.speedY < 10;
    let isAboveEnemy = characterBottom + 80;

    return isInAir && isFalling && isAboveEnemy;
  }

  jumpOnEnemy(enemy) {
    enemy.die();
    this.speedY = 20;
  }

  checkJumpOnEnemies() {
    if (!this.world || !this.world.level) return;

    this.world.level.enemies.forEach((enemy) => {
      if (this.isJumpingOnEnemy(enemy)) {
        this.jumpOnEnemy(enemy);
      }
    });
  }

  handleMovement() {
    let moved = this.handleKeyboardInput();
    this.updateMovementTimer(moved);
    this.handleCollisionsAndCamera();
  }

  handleAnimation() {
    let currentTime = new Date().getTime();
    let idleTime = currentTime - this.lastMovementTime;

    if (this.isdead) {
      this.playAnimation(this.IMAGES_DEAD);
    } else if (this.isHurt()) {
      this.playAnimation(this.IMAGES_HURT);
      this.lastMovementTime = currentTime;
    } else if (this.isAboveGround()) {
      this.playAnimation(this.IMAGES_JUMPING);
    } else {
      this.handleGroundAnimation(idleTime);
    }
  }

  handleGroundAnimation(idleTime) {
    if (this.world.keyboard.Right || this.world.keyboard.Left) {
      this.playAnimation(this.IMAGES_WALKING);
      this.lastMovementTime = new Date().getTime();
    } else {
      this.handleIdleAnimation(idleTime);
    }
  }

  handleKeyboardInput() {
    let moved = false;

    if (this.world.keyboard.Right && this.x < this.world.level.level_end_x) {
      this.moveRight();
      this.OtherDirection = false;
      moved = true;
    }
    if (this.world.keyboard.Left && this.x > 0) {
      this.moveLeft();
      this.OtherDirection = true;
      moved = true;
    }
    if (this.world.keyboard.Space && !this.isAboveGround()) {
      this.jump();
      moved = true;
    }
    if (this.world.keyboard.F) {
      moved = true;
    }

    return moved;
  }

  updateMovementTimer(moved) {
    if (moved) {
      this.lastMovementTime = new Date().getTime();
    }
  }

  handleCollisionsAndCamera() {
    this.checkJumpOnEnemies();
    this.world.camera_x = -this.x + 100;
  }

  handleIdleAnimation(idleTime) {
    if (idleTime < 10000) {
      this.img = this.imageCache['img_pollo_locco/img/2_character_pepe/2_walk/W-21.png'];
    } else if (idleTime < 30000) {
      this.playAnimation(this.IMAGES_IDLE);
    } else {
      this.playAnimation(this.IMAGES_IDLE_LONG);
    }
  }

  animate() {
    this.movementInterval = setStoppableInterval(() => this.handleMovement(), 1000 / 144);
    this.animationInterval = setStoppableInterval(() => this.handleAnimation(), 150);
  }

  pauseAnimations() {
    clearStoppableInterval(this.movementInterval);
    clearStoppableInterval(this.animationInterval);
    this.pauseGravity();
  }

  resumeAnimations() {
    this.movementInterval = setStoppableInterval(() => this.handleMovement(), 1000 / 144);
    this.animationInterval = setStoppableInterval(() => this.handleAnimation(), 150);
    this.resumeGravity();
  }
}
