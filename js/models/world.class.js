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

  constructor(canvas, keyboard) {
    this.initializeCanvasAndKeyboard(canvas, keyboard);
    this.initializeLevelAndEnemies();
    this.initializeCharacter();
    this.initializeRenderer();
    this.startGameLoops();
    this.loadImages();
  }

  initializeRenderer() {
    this.renderer = new WorldRenderer(this);
  }

  initializeCanvasAndKeyboard(canvas, keyboard) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.keyboard = keyboard;
  }

  initializeLevelAndEnemies() {
    this.level = level1;
    this.enemies = level1.enemies;
  }

  initializeCharacter() {
    this.character.world = this;
  }

  startGameLoops() {
    this.draw();
    this.setWorld();
    this.run();
    this.runThrowCheck();
    this.runCollectablesCheck();
  }

  loadImages() {
    this.gameOverImage.src = 'img_pollo_locco/img/9_intro_outro_screens/game_over/game over!.png';
    this.youWinImage.src = 'img_pollo_locco/img/You won, you lost/You Win A.png';
    this.muteImage.src = 'img_pollo_locco/img/homescreen-icons/mute.png';
    this.volumeImage.src = 'img_pollo_locco/img/homescreen-icons/volume.png';
  }

  togglePause() {
    this.isPaused = !this.isPaused;
    if (this.isPaused) {
      this.pauseGame();
    } else {
      this.resumeGame();
    }
  }

  pauseGame() {
    this.pauseWorldIntervals();
    this.pauseAllGameObjects();
    soundManager.playPauseSound('pause');
    soundManager.pauseGame();
  }

  pauseWorldIntervals() {
    clearStoppableInterval(this.collisionInterval);
    clearStoppableInterval(this.throwInterval);
    clearStoppableInterval(this.collectablesInterval);
  }

  pauseAllGameObjects() {
    this.character.pauseAnimations();
    this.level.enemies.forEach((enemy) => enemy.pauseAnimations?.());
    this.level.clouds.forEach((cloud) => cloud.pauseAnimations?.());
    this.throwableObjects.forEach((bottle) => bottle.pauseAnimations?.());
  }

  resumeGame() {
    this.resumeWorldIntervals();
    this.resumeAllGameObjects();
    soundManager.resumeGame();
    soundManager.playSound('unpause');
    this.draw();
  }

  resumeWorldIntervals() {
    this.run();
    this.runThrowCheck();
    this.runCollectablesCheck();
  }

  resumeAllGameObjects() {
    this.character.resumeAnimations();
    this.level.enemies.forEach((enemy) => enemy.resumeAnimations?.());
    this.level.clouds.forEach((cloud) => cloud.resumeAnimations?.());
    this.throwableObjects.forEach((bottle) => bottle.resumeAnimations?.());
  }

  setWorld() {
    this.character.world = this;
    this.level.enemies.forEach((enemy) => {
      enemy.world = this;
    });
  }

  run() {
    this.collisionInterval = setStoppableInterval(() => {
      if (this.character.isdead) return;
      this.checkCollisionsforHealthStatusBar();
      this.checkBottleCollisions();
      this.checkEndbossDefeated();
    }, 200);
    return this.collisionInterval;
  }

  runThrowCheck() {
    this.throwInterval = setStoppableInterval(() => {
      if (this.character.isdead) return;
      this.checkThrowableObjects();
    }, 50);
    return this.throwInterval;
  }

  runCollectablesCheck() {
    this.collectablesInterval = setStoppableInterval(() => {
      if (this.character.isdead) return;
      this.checkCollisionsforCoinsStatusBar();
      this.checkCollisionsforBottlesStatusBar();
    }, 1000 / 60);
    return this.collectablesInterval;
  }

  checkThrowableObjects() {
    const currentTime = new Date().getTime();
    const timeSinceLastThrow = currentTime - this.lastThrowTime;

    if (this.canThrowBottle(timeSinceLastThrow)) {
      this.throwBottle(currentTime);
    } else if (this.keyboard.F && this.collectedBottles === 0 && timeSinceLastThrow > 300) {
      this.lastThrowTime = currentTime;
    }
  }

  canThrowBottle(timeSinceLastThrow) {
    return this.keyboard.F && this.collectedBottles > 0 && timeSinceLastThrow > 300 && !this.character.isHurt();
  }

  throwBottle(currentTime) {
    const bottle = new ThrowableObject(this.character.x + 50, this.character.y + 50);
    this.throwableObjects.push(bottle);
    soundManager.playSound('bottleThrow');
    this.collectedBottles--;
    this.lastThrowTime = currentTime;
    const percentage = Math.min(this.collectedBottles * 20, 100);
    this.statusBarBottle.setPercentage(percentage);
  }

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

  checkCollisionsforHealthStatusBar() {
    this.level.enemies.forEach((enemy) => {
      if (this.character.isJumpingOnEnemy(enemy)) {
        return;
      }
      this.handleEnemyCollision(enemy);
      this.handleCharacterDeath();
    });
  }

  handleEnemyCollision(enemy) {
    if (this.character.isColliding(enemy) && !this.character.isHurt() && !enemy.isDead) {
      this.character.hit();
      this.character.energy -= 15;
      this.statusBarHealth.setPercentage(this.character.energy);
    }
  }

  handleCharacterDeath() {
    if (this.character.energy <= 0 && !this.character.isdead) {
      this.character.isdead = true;
      this.character.currentImage = 0;
      soundManager.gameOver();
      soundManager.playEndScreenSound('dead');
      clearStoppableInterval(this.collisionInterval);
    }
  }

  checkBottleCollisions() {
    this.processBottleHits();
    this.removeCompletedBottles();
  }

  processBottleHits() {
    this.throwableObjects.forEach((bottle) => {
      if (bottle.hit) return;
      this.checkBottleAgainstEnemies(bottle);
    });
  }

  checkBottleAgainstEnemies(bottle) {
    this.level.enemies.forEach((enemy) => {
      if (this.isBottleHittingEnemy(bottle, enemy)) {
        this.handleBottleHit(bottle, enemy);
      }
    });
  }

  isBottleHittingEnemy(bottle, enemy) {
    return bottle.isColliding(enemy) && !enemy.isDead;
  }

  handleBottleHit(bottle, enemy) {
    bottle.hit = true;
    soundManager.playSound('bottleSplash');
    this.applyDamageToEnemy(enemy);
  }

  applyDamageToEnemy(enemy) {
    if (enemy.hit) {
      enemy.hit();
      this.updateEndbossHealthBar(enemy);
    } else if (enemy.die) {
      enemy.die();
    }
  }

  updateEndbossHealthBar(enemy) {
    if (enemy instanceof Endboss) {
      const percentage = (enemy.health / 5) * 100;
      this.statusBarEndboss.setPercentage(percentage);
    }
  }

  removeCompletedBottles() {
    this.throwableObjects.forEach((bottle, index) => {
      if (bottle.splashAnimationComplete) {
        this.throwableObjects.splice(index, 1);
      }
    });
  }

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

  draw() {
    this.renderer.draw();
  }
}
