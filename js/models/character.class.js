/**
 * Player character class with movement, animations, and collision detection
 * @class
 * @extends MovableObject
 */
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
  speed = 2;
  lastMovementTime = new Date().getTime();
  movementInterval;
  animationInterval;
  deathAnimationComplete = false;
  isSleeping = false;

  /**
   * Creates an instance of Character
   * @constructor
   */
  constructor() {
    super();
    this.initializeCharacter();
    this.loadCharacterImages();
    this.startCharacter();
  }

  /**
   * Initializes character dimensions and position
   */
  initializeCharacter() {
    this.width = 125;
    this.height = 350;
    this.y = 100;
  }

  /**
   * Loads all character animation images
   */
  loadCharacterImages() {
    this.loadImage('img_pollo_locco/img/2_character_pepe/2_walk/W-21.png');
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_JUMPING);
    this.loadImages(this.IMAGES_DEAD);
    this.loadImages(this.IMAGES_HURT);
    this.loadImages(this.IMAGES_IDLE);
    this.loadImages(this.IMAGES_IDLE_LONG);
  }

  /**
   * Starts character physics and animations
   */
  startCharacter() {
    this.applyGravity();
    this.animate();
  }

  /**
   * Checks collision with another object using precise hitboxes
   * @param {MovableObject} mo - Object to check collision with
   * @returns {boolean} True if objects are colliding
   */
  isColliding(mo) {
    const thisBox = this.getHitbox();
    const moBox = this.getMoBox(mo);
    return (
      thisBox.x + thisBox.width > moBox.x &&
      thisBox.y + thisBox.height > moBox.y &&
      thisBox.x < moBox.x + moBox.width &&
      thisBox.y < moBox.y + moBox.height
    );
  }

  /**
   * Gets hitbox of another object
   * @param {MovableObject} mo - Object to get hitbox from
   * @returns {Object} Hitbox dimensions and position
   */
  getMoBox(mo) {
    if (mo.getHitbox) {
      return mo.getHitbox();
    } else {
      return this.calculateHitbox(mo);
    }
  }

  /**
   * Calculates hitbox for an object
   * @param {Object} obj - Object to calculate hitbox for
   * @returns {Object} Hitbox with x, y, width, and height
   */
  calculateHitbox(obj) {
    const offsets = this.getOffsetsForObj(obj);
    return {
      x: obj.x + offsets.offsetX,
      y: obj.y + offsets.offsetYTop,
      width: obj.width - 2 * offsets.offsetX,
      height: obj.height - offsets.offsetYTop - offsets.offsetYBottom,
    };
  }

  /**
   * Gets hitbox offsets for an object
   * @param {Object} obj - Object to get offsets from
   * @returns {Object} Offset values
   */
  getOffsetsForObj(obj) {
    if (obj.getHitboxOffsets) {
      return obj.getHitboxOffsets();
    } else {
      return { offsetX: 0, offsetYTop: 0, offsetYBottom: 0 };
    }
  }

  /**
   * Gets the character's hitbox
   * @returns {Object} Hitbox with x, y, width, and height
   */
  getHitbox() {
    const offsets = this.getHitboxOffsets();
    return {
      x: this.x + offsets.offsetX,
      y: this.y + offsets.offsetYTop,
      width: this.width - 2 * offsets.offsetX,
      height: this.height - offsets.offsetYTop - offsets.offsetYBottom,
    };
  }

  /**
   * Gets character-specific hitbox offsets
   * @returns {Object} Offset values for character
   */
  getHitboxOffsets() {
    return {
      offsetX: this.width * 0.1,
      offsetYTop: this.height * 0.35,
      offsetYBottom: this.height * 0.03,
    };
  }

  /**
   * Checks if character is jumping on an enemy
   * @param {MovableObject} enemy - Enemy to check
   * @returns {boolean} True if valid jump attack
   */
  isJumpingOnEnemy(enemy) {
    if (!this.isColliding(enemy) || enemy.isDead) {
      return false;
    }
    return this.isCharacterLandingOnEnemy(enemy);
  }

  /**
   * Checks if character is landing on enemy from above
   * @param {MovableObject} enemy - Enemy to check
   * @returns {boolean} True if landing on enemy
   */
  isCharacterLandingOnEnemy(enemy) {
    const characterBottom = this.getCharacterBottom();
    const enemyTop = this.getEnemyTop(enemy);
    const tolerance = enemy.height * 0.3;
    return this.isValidJumpAttack(characterBottom, enemyTop, tolerance);
  }

  /**
   * Gets the bottom position of the character
   * @returns {number} Y coordinate of character bottom
   */
  getCharacterBottom() {
    const offsets = this.getHitboxOffsets();
    return this.y + this.height - offsets.offsetYBottom;
  }

  /**
   * Gets the top position of an enemy
   * @param {MovableObject} enemy - Enemy object
   * @returns {number} Y coordinate of enemy top
   */
  getEnemyTop(enemy) {
    const offsets = enemy.getHitboxOffsets();
    return enemy.y + offsets.offsetYTop;
  }

  /**
   * Validates if jump attack is successful
   * @param {number} characterBottom - Character's bottom Y position
   * @param {number} enemyTop - Enemy's top Y position
   * @param {number} tolerance - Collision tolerance value
   * @returns {boolean} True if valid jump attack
   */
  isValidJumpAttack(characterBottom, enemyTop, tolerance) {
    const isInAir = this.isAboveGround();
    const isFalling = this.speedY < 10;
    const isAboveEnemy = characterBottom < enemyTop + tolerance;
    return isInAir && isFalling && isAboveEnemy;
  }

  /**
   * Performs jump attack on enemy
   * @param {MovableObject} enemy - Enemy to attack
   */
  jumpOnEnemy(enemy) {
    enemy.die();
    this.speedY = 20;
  }

  /**
   * Checks and handles jump attacks on all enemies
   */
  checkJumpOnEnemies() {
    if (!this.world || !this.world.level) return;

    this.world.level.enemies.forEach((enemy) => {
      if (this.isJumpingOnEnemy(enemy)) {
        this.jumpOnEnemy(enemy);
      }
    });
  }

  /**
   * Handles character movement logic
   */
  handleMovement() {
    const moved = this.handleKeyboardInput();
    this.updateMovementTimer(moved);
    this.handleCollisionsAndCamera();
  }

  /**
   * Handles character animation selection
   */
  handleAnimation() {
    if (this.shouldStopAnimationForLevelComplete()) return;
    const idleTime = this.getIdleTime();
    this.selectAndPlayAnimation(idleTime);
  }

  /**
   * Checks if animation should stop for level completion
   * @returns {boolean} True if level is completed
   */
  shouldStopAnimationForLevelComplete() {
    if (this.world && this.world.levelCompleted) {
      this.stopSleepingIfActive();
      return true;
    }
    return false;
  }

  /**
   * Stops sleeping sound if character is sleeping
   */
  stopSleepingIfActive() {
    if (this.isSleeping) {
      soundManager.stopLoopingSound('sleeping');
      this.isSleeping = false;
    }
  }

  /**
   * Gets time elapsed since last movement
   * @returns {number} Idle time in milliseconds
   */
  getIdleTime() {
    const currentTime = new Date().getTime();
    return currentTime - this.lastMovementTime;
  }

  /**
   * Selects and plays appropriate animation based on state
   * @param {number} idleTime - Time since last movement
   */
  selectAndPlayAnimation(idleTime) {
    if (this.isdead) {
      this.handleDeathAnimation();
    } else if (this.isHurt()) {
      this.handleHurtAnimation();
    } else if (this.isAboveGround()) {
      this.handleJumpAnimation();
    } else {
      this.handleGroundAnimation(idleTime);
    }
  }

  /**
   * Handles death animation sequence
   */
  handleDeathAnimation() {
    if (this.currentImage >= this.IMAGES_DEAD.length) {
      this.finalizeDeathAnimation();
    } else {
      this.playAnimation(this.IMAGES_DEAD);
    }
  }

  /**
   * Finalizes death animation at last frame
   */
  finalizeDeathAnimation() {
    this.deathAnimationComplete = true;
    this.currentImage = this.IMAGES_DEAD.length - 1;
    this.img = this.imageCache[this.IMAGES_DEAD[this.currentImage]];
  }

  /**
   * Handles hurt animation
   */
  handleHurtAnimation() {
    this.playAnimation(this.IMAGES_HURT);
    this.lastMovementTime = new Date().getTime();
    this.stopSleepingIfActive();
  }

  /**
   * Handles jump animation
   */
  handleJumpAnimation() {
    this.playAnimation(this.IMAGES_JUMPING);
    this.stopSleepingIfActive();
  }

  /**
   * Handles ground animations including walking and idle
   * @param {number} idleTime - Time since last movement
   */
  handleGroundAnimation(idleTime) {
    if (this.world.keyboard.Right || this.world.keyboard.Left) {
      this.playAnimation(this.IMAGES_WALKING);
      this.lastMovementTime = new Date().getTime();
      if (this.isSleeping) {
        soundManager.stopLoopingSound('sleeping');
        this.isSleeping = false;
      }
    } else {
      this.handleIdleAnimation(idleTime);
    }
  }

  /**
   * Processes keyboard input and returns movement state
   * @returns {boolean} True if character moved
   */
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

  /**
   * Handles right movement input
   * @returns {boolean} True if moved right
   */
  handleRightMovement() {
    if (this.world.keyboard.Right && this.x < this.world.level.level_end_x) {
      this.moveRight();
      this.OtherDirection = false;
      return true;
    }
    return false;
  }

  /**
   * Handles left movement input
   * @returns {boolean} True if moved left
   */
  handleLeftMovement() {
    if (this.world.keyboard.Left && this.x > 0) {
      this.moveLeft();
      this.OtherDirection = true;
      return true;
    }
    return false;
  }

  /**
   * Handles jump input
   * @returns {boolean} True if jumped
   */
  handleJumpInput() {
    if (this.world.keyboard.Space && !this.isAboveGround()) {
      this.jump();
      return true;
    }
    return false;
  }

  /**
   * Handles throw input
   * @returns {boolean} True if throw key is pressed
   */
  handleThrowInput() {
    if (this.isHurt()) {
      return false;
    }
    return this.world.keyboard.F;
  }

  /**
   * Updates last movement time if character moved
   * @param {boolean} moved - Whether character moved
   */
  updateMovementTimer(moved) {
    if (moved) {
      this.lastMovementTime = new Date().getTime();
    }
  }

  /**
   * Handles collision detection and camera positioning
   */
  handleCollisionsAndCamera() {
    this.checkJumpOnEnemies();
    this.world.camera_x = -this.x + 100;
  }

  /**
   * Handles idle animation based on idle time
   * @param {number} idleTime - Time since last movement
   */
  handleIdleAnimation(idleTime) {
    if (idleTime < 15000) {
      this.playShortIdleAnimation();
    } else {
      this.playLongIdleAnimation();
    }
  }

  /**
   * Plays short idle animation
   */
  playShortIdleAnimation() {
    this.playAnimation(this.IMAGES_IDLE);
    this.stopSleepingIfActive();
  }

  /**
   * Plays long idle animation with sleeping sound
   */
  playLongIdleAnimation() {
    this.startSleepingIfNotActive();
    this.playAnimation(this.IMAGES_IDLE_LONG);
  }

  /**
   * Starts sleeping sound if not already sleeping
   */
  startSleepingIfNotActive() {
    if (!this.isSleeping) {
      soundManager.playLoopingSound('sleeping');
      this.isSleeping = true;
    }
  }

  /**
   * Starts movement and animation intervals
   */
  animate() {
    this.movementInterval = setStoppableInterval(() => this.handleMovement(), 1000 / 144);
    this.animationInterval = setStoppableInterval(() => this.handleAnimation(), 150);
  }

  /**
   * Pauses all character animations and physics
   */
  pauseAnimations() {
    clearStoppableInterval(this.movementInterval);
    clearStoppableInterval(this.animationInterval);
    this.pauseGravity();
  }

  /**
   * Resumes all character animations and physics
   */
  resumeAnimations() {
    this.movementInterval = setStoppableInterval(() => this.handleMovement(), 1000 / 144);
    this.animationInterval = setStoppableInterval(() => this.handleAnimation(), 150);
    this.resumeGravity();
  }
}
