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
  deathAnimationComplete = false;
  isSleeping = false;

  constructor() {
    super();
    this.initializeCharacter();
    this.loadCharacterImages();
    this.startCharacter();
  }

  initializeCharacter() {
    this.width = 125;
    this.height = 350;
    this.y = 100;
  }

  loadCharacterImages() {
    this.loadImage('img_pollo_locco/img/2_character_pepe/2_walk/W-21.png');
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_JUMPING);
    this.loadImages(this.IMAGES_DEAD);
    this.loadImages(this.IMAGES_HURT);
    this.loadImages(this.IMAGES_IDLE);
    this.loadImages(this.IMAGES_IDLE_LONG);
  }

  startCharacter() {
    this.applyGravity();
    this.animate();
  }

  isColliding(mo) {
    let thisBox = this.getHitbox();
    let moBox = mo.getHitbox ? mo.getHitbox() : this.calculateHitbox(mo);
    return (
      thisBox.x + thisBox.width > moBox.x &&
      thisBox.y + thisBox.height > moBox.y &&
      thisBox.x < moBox.x + moBox.width &&
      thisBox.y < moBox.y + moBox.height
    );
  }

  calculateHitbox(obj) {
    let offsets = obj.getHitboxOffsets ? obj.getHitboxOffsets() : { xWidth: 0, yTop: 0, yBottom: 0 };
    return {
      x: obj.x + offsets.xWidth,
      y: obj.y + offsets.yTop,
      width: obj.width - 2 * offsets.xWidth,
      height: obj.height - offsets.yTop - offsets.yBottom,
    };
  }

  getHitbox() {
    let offsets = this.getHitboxOffsets();
    return {
      x: this.x + offsets.xWidth,
      y: this.y + offsets.yTop,
      width: this.width - 2 * offsets.xWidth,
      height: this.height - offsets.yTop - offsets.yBottom,
    };
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
    let enemyOffsets = enemy.getHitboxOffsets();
    let characterBottom = this.y + this.height - thisOffsets.yBottom;
    let enemyTop = enemy.y + enemyOffsets.yTop;
    let tolerance = enemy.height * 0.3;
    let isInAir = this.isAboveGround();
    let isFalling = this.speedY < 10;
    let isAboveEnemy = characterBottom < enemyTop + tolerance;

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
      if (this.currentImage >= this.IMAGES_DEAD.length) {
        this.deathAnimationComplete = true;
        this.currentImage = this.IMAGES_DEAD.length - 1;
        this.img = this.imageCache[this.IMAGES_DEAD[this.currentImage]];
      } else {
        this.playAnimation(this.IMAGES_DEAD);
      }
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
    if (this.isdead) {
      return false;
    }
    let moved = false;
    moved = this.handleRightMovement() || moved;
    moved = this.handleLeftMovement() || moved;
    moved = this.handleJumpInput() || moved;
    moved = this.handleThrowInput() || moved;
    return moved;
  }

  handleRightMovement() {
    if (this.world.keyboard.Right && this.x < this.world.level.level_end_x) {
      this.moveRight();
      this.OtherDirection = false;
      return true;
    }
    return false;
  }

  handleLeftMovement() {
    if (this.world.keyboard.Left && this.x > 0) {
      this.moveLeft();
      this.OtherDirection = true;
      return true;
    }
    return false;
  }

  handleJumpInput() {
    if (this.world.keyboard.Space && !this.isAboveGround()) {
      this.jump();
      return true;
    }
    return false;
  }

  handleThrowInput() {
    if (this.isHurt()) {
      return false;
    }
    return this.world.keyboard.F;
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
    if (idleTime < 15000) {
      this.playAnimation(this.IMAGES_IDLE);
      if (this.isSleeping) {
        soundManager.stopLoopingSound('sleeping');
        this.isSleeping = false;
      }
    } else {
      if (!this.isSleeping) {
        soundManager.playLoopingSound('sleeping');
        this.isSleeping = true;
      }
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
