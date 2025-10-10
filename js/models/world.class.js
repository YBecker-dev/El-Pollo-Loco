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
   * Checks if player can throw bottles and handles throwing
   */
  checkThrowableObjects() {
    const currentTime = new Date().getTime();
    const timeSinceLastThrow = currentTime - this.lastThrowTime;

    if (this.canThrowBottle(timeSinceLastThrow)) {
      this.throwBottle(currentTime);
    } else if (this.keyboard.F && this.collectedBottles === 0 && timeSinceLastThrow > 300) {
      this.lastThrowTime = currentTime;
    }
  }

  /**
   * Checks if bottle throwing conditions are met
   * @param {number} timeSinceLastThrow - Time since last bottle throw
   * @returns {boolean} True if bottle can be thrown
   */
  canThrowBottle(timeSinceLastThrow) {
    return this.keyboard.F && this.collectedBottles > 0 && timeSinceLastThrow > 300 && !this.character.isHurt();
  }

  /**
   * Creates and throws a new bottle
   * @param {number} currentTime - Current timestamp
   */
  throwBottle(currentTime) {
    const bottle = new ThrowableObject(this.character.x + 50, this.character.y + 50);
    this.throwableObjects.push(bottle);
    soundManager.playSound('bottleThrow');
    this.collectedBottles--;
    this.lastThrowTime = currentTime;
    const percentage = Math.min(this.collectedBottles * 20, 100);
    this.statusBarBottle.setPercentage(percentage);
  }

  /**
   * Checks collisions with coins and updates coin status bar
   */
  checkCollisionsforCoinsStatusBar() {
    this.level.coins.forEach((coin) => {
      if (this.character.isColliding(coin) && !coin.collected) {
        coin.collect();
        soundManager.playSound('coin');
        let collectedCount = 0;
        this.level.coins.forEach((c) => {
          if (c.collected) collectedCount++;
        });
        const percentage = Math.min(collectedCount * 20, 100);
        this.statusBarCoin.setPercentage(percentage);
      }
    });
  }

  /**
   * Checks collisions with bottles and updates bottle status bar
   */
  checkCollisionsforBottlesStatusBar() {
    this.level.bottles.forEach((bottle) => {
      if (this.character.isColliding(bottle) && !bottle.collected && this.collectedBottles < 5) {
        bottle.collect();
        soundManager.playSound('bottleCollect');
        this.collectedBottles++;
        const percentage = Math.min(this.collectedBottles * 20, 100);
        this.statusBarBottle.setPercentage(percentage);
      }
    });
  }

  /**
   * Checks enemy collisions and updates health status bar
   */
  checkCollisionsforHealthStatusBar() {
    this.level.enemies.forEach((enemy) => {
      if (this.character.isJumpingOnEnemy(enemy)) {
        return;
      }
      this.handleEnemyCollision(enemy);
      this.handleCharacterDeath();
    });
  }

  /**
   * Handles collision between character and enemy
   * @param {MovableObject} enemy - Enemy that collided with character
   */
  handleEnemyCollision(enemy) {
    if (this.character.isColliding(enemy) && !this.character.isHurt() && !enemy.isDead) {
      this.character.hit();
      this.character.energy -= 15;
      this.statusBarHealth.setPercentage(this.character.energy);
    }
  }

  /**
   * Handles character death when health reaches zero
   */
  handleCharacterDeath() {
    if (this.character.energy <= 0 && !this.character.isdead) {
      this.character.isdead = true;
      this.character.currentImage = 0;
      soundManager.gameOver();
      soundManager.playEndScreenSound('dead');
      clearStoppableInterval(this.collisionInterval);
    }
  }

  /**
   * Processes bottle collisions with enemies
   */
  checkBottleCollisions() {
    this.processBottleHits();
    this.removeCompletedBottles();
  }

  /**
   * Processes hits for all throwable bottles
   */
  processBottleHits() {
    this.throwableObjects.forEach((bottle) => {
      if (bottle.hit) return;
      this.checkBottleAgainstEnemies(bottle);
    });
  }

  /**
   * Checks if a bottle hits any enemy
   * @param {ThrowableObject} bottle - Bottle to check
   */
  checkBottleAgainstEnemies(bottle) {
    this.level.enemies.forEach((enemy) => {
      if (this.isBottleHittingEnemy(bottle, enemy)) {
        this.handleBottleHit(bottle, enemy);
      }
    });
  }

  /**
   * Checks if bottle is hitting a specific enemy
   * @param {ThrowableObject} bottle - Bottle object
   * @param {MovableObject} enemy - Enemy object
   * @returns {boolean} True if bottle hits enemy
   */
  isBottleHittingEnemy(bottle, enemy) {
    return bottle.isColliding(enemy) && !enemy.isDead;
  }

  /**
   * Handles bottle hitting an enemy
   * @param {ThrowableObject} bottle - Bottle that hit
   * @param {MovableObject} enemy - Enemy that was hit
   */
  handleBottleHit(bottle, enemy) {
    bottle.hit = true;
    soundManager.playSound('bottleSplash');
    this.applyDamageToEnemy(enemy);
  }

  /**
   * Applies damage to enemy based on enemy type
   * @param {MovableObject} enemy - Enemy to damage
   */
  applyDamageToEnemy(enemy) {
    if (enemy.hit) {
      enemy.hit();
      this.updateEndbossHealthBar(enemy);
    } else if (enemy.die) {
      enemy.die();
    }
  }

  /**
   * Updates endboss health bar if enemy is endboss
   * @param {MovableObject} enemy - Enemy to check
   */
  updateEndbossHealthBar(enemy) {
    if (enemy instanceof Endboss) {
      const percentage = (enemy.health / 5) * 100;
      this.statusBarEndboss.setPercentage(percentage);
    }
  }

  /**
   * Removes completed bottle splash animations
   */
  removeCompletedBottles() {
    this.throwableObjects.forEach((bottle, index) => {
      if (bottle.splashAnimationComplete) {
        this.throwableObjects.splice(index, 1);
      }
    });
  }

  /**
   * Checks if endboss is defeated and handles level completion
   */
  checkEndbossDefeated() {
    this.level.enemies.forEach((enemy) => {
      if (enemy instanceof Endboss && enemy.isDead && !this.levelCompleted) {
        const timeSinceDeath = (new Date().getTime() - enemy.deadTime) / 1000;
        if (timeSinceDeath > 1) {
          this.levelCompleted = true;
          soundManager.stopBackgroundMusic();
          soundManager.gameOver();
        }
      }
    });
  }

  /**
   * Draws the game world using the renderer
   */
  draw() {
    this.renderer.draw();
  }
}
