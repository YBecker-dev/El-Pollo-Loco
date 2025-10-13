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
    this.animator = new CharacterAnimator(this);
    this.animation = new CharacterAnimation(this);
    this.collision = new CharacterCollision(this);
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
   * Handles character movement logic
   */
  handleMovement() {
    const moved = this.handleKeyboardInput();
    this.updateMovementTimer(moved);
    this.collision.handleCollisionsAndCamera()
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
   * Starts movement and animation intervals
   */
  animate() {
    this.movementInterval = setStoppableInterval(() => this.handleMovement(), 1000 / 144);
    this.animationInterval = setStoppableInterval(() => this.animator.handleAnimation(), 150);
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
    this.animationInterval = setStoppableInterval(() => this.animator.handleAnimation(), 150);
    this.resumeGravity();
  }
}
