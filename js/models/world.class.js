/**
 * Main game world class managing all game objects and game logic
 * @class
 */
class World {
  character = new Character();
  enemies;
  gameOverImage = new Image();
  youWinImage = new Image();
  muteImage = new Image();
  volumeImage = new Image();
  level;
  camera_x = 0;
  canvas;
  ctx;
  keyboard;
  statusBarHealth = new StatusBarHealth();
  statusBarCoin = new StatusBarCoin();
  statusBarBottle = new StatusBarBottle();
  statusBarEndboss = new StatusBarEndboss();
  throwableObjects = [];
  collectedBottles = 0;
  lastThrowTime = 0;
  isPaused = false;
  collisionInterval;
  throwInterval;
  collectablesInterval;
  gameOverStartTime = null;
  gameOverButtonScale = 0;
  youWinStartTime = null;
  levelCompleted = false;
  renderer;

  /**
   * Creates an instance of World
   * @constructor
   * @param {HTMLCanvasElement} canvas - Game canvas element
   * @param {Keyboard} keyboard - Keyboard input handler
   */
  constructor(canvas, keyboard) {
    this.initializeCanvasAndKeyboard(canvas, keyboard);
    this.initializeLevelAndEnemies();
    this.initializeCharacter();
    this.initializeRenderer();
    this.startGameLoops();
    this.loadImages();
  }

  /**
   * Initializes the world renderer
   */
  initializeRenderer() {
    this.renderer = new WorldRenderer(this);
  }

  /**
   * Sets up canvas and keyboard references
   * @param {HTMLCanvasElement} canvas - Game canvas element
   * @param {Keyboard} keyboard - Keyboard input handler
   */
  initializeCanvasAndKeyboard(canvas, keyboard) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.keyboard = keyboard;
  }

  /**
   * Initializes level and enemy references
   */
  initializeLevelAndEnemies() {
    this.level = level1;
    this.enemies = level1.enemies;
  }

  /**
   * Sets up character world reference
   */
  initializeCharacter() {
    this.character.world = this;
  }

  /**
   * Starts all main game loops
   */
  startGameLoops() {
    this.draw();
    this.setWorld();
    this.run();
    this.runThrowCheck();
    this.runCollectablesCheck();
  }

  /**
   * Loads UI images for game over and win screens
   */
  loadImages() {
    this.gameOverImage.src = 'img_pollo_locco/img/9_intro_outro_screens/game_over/game over!.png';
    this.youWinImage.src = 'img_pollo_locco/img/You won, you lost/You Win A.png';
    this.muteImage.src = 'img_pollo_locco/img/homescreen-icons/mute.png';
    this.volumeImage.src = 'img_pollo_locco/img/homescreen-icons/volume.png';
  }

  /**
   * Toggles pause state of the game
   */
  togglePause() {
    this.isPaused = !this.isPaused;
    if (this.isPaused) {
      this.pauseGame();
    } else {
      this.resumeGame();
    }
  }

  /**
   * Pauses the game and all animations
   */
  pauseGame() {
    this.pauseWorldIntervals();
    this.pauseAllGameObjects();
    soundManager.playPauseSound('pause');
    soundManager.pauseGame();
  }

  /**
   * Pauses all world update intervals
   */
  pauseWorldIntervals() {
    clearStoppableInterval(this.collisionInterval);
    clearStoppableInterval(this.throwInterval);
    clearStoppableInterval(this.collectablesInterval);
  }

  /**
   * Pauses animations for all game objects
   */
  pauseAllGameObjects() {
    this.character.pauseAnimations();
    this.level.enemies.forEach((enemy) => enemy.pauseAnimations?.());
    this.level.clouds.forEach((cloud) => cloud.pauseAnimations?.());
    this.throwableObjects.forEach((bottle) => bottle.pauseAnimations?.());
  }

  /**
   * Resumes the game and all animations
   */
  resumeGame() {
    this.resumeWorldIntervals();
    this.resumeAllGameObjects();
    soundManager.resumeGame();
    soundManager.playSound('unpause');
    this.draw();
  }

  /**
   * Resumes all world update intervals
   */
  resumeWorldIntervals() {
    this.run();
    this.runThrowCheck();
    this.runCollectablesCheck();
  }

  /**
   * Resumes animations for all game objects
   */
  resumeAllGameObjects() {
    this.character.resumeAnimations();
    this.level.enemies.forEach((enemy) => enemy.resumeAnimations?.());
    this.level.clouds.forEach((cloud) => cloud.resumeAnimations?.());
    this.throwableObjects.forEach((bottle) => bottle.resumeAnimations?.());
  }

  /**
   * Sets world reference for all game objects
   */
  setWorld() {
    this.character.world = this;
    this.level.enemies.forEach((enemy) => {
      enemy.world = this;
    });
  }

  /**
   * Starts the main collision detection loop
   * @returns {number} Interval ID
   */
  run() {
    this.collisionInterval = setStoppableInterval(() => {
      if (this.character.isdead) return;
      this.checkCollisionsforHealthStatusBar();
      this.checkBottleCollisions();
      this.checkEndbossDefeated();
    }, 200);
    return this.collisionInterval;
  }

  /**
   * Starts the bottle throwing check loop
   * @returns {number} Interval ID
   */
  runThrowCheck() {
    this.throwInterval = setStoppableInterval(() => {
      if (this.character.isdead) return;
      this.checkThrowableObjects();
    }, 50);
    return this.throwInterval;
  }

  /**
   * Starts the collectables collision check loop
   * @returns {number} Interval ID
   */
  runCollectablesCheck() {
    this.collectablesInterval = setStoppableInterval(() => {
      if (this.character.isdead) return;
      this.checkCollisionsforCoinsStatusBar();
      this.checkCollisionsforBottlesStatusBar();
    }, 1000 / 60);
    return this.collectablesInterval;
  }

  /**
   * Draws the game world using the renderer
   */
  draw() {
    this.renderer.draw();
  }
}
