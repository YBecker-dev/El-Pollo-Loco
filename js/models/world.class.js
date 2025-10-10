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

  constructor(canvas, keyboard) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.keyboard = keyboard;
    this.level = level1;
    this.enemies = level1.enemies;
    this.character.world = this;
    this.draw();
    this.setWorld();
    this.run();
    this.runThrowCheck();
    this.runCollectablesCheck();
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
    let currentTime = new Date().getTime();
    let timeSinceLastThrow = currentTime - this.lastThrowTime;

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
    let bottle = new ThrowableObject(this.character.x + 50, this.character.y + 50);
    this.throwableObjects.push(bottle);
    soundManager.playSound('bottleThrow');
    this.collectedBottles--;
    this.lastThrowTime = currentTime;
    let percentage = Math.min(this.collectedBottles * 20, 100);
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
        let percentage = Math.min(collectedCount * 20, 100);
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
        let percentage = Math.min(this.collectedBottles * 20, 100);
        this.statusBarBottle.setPercentage(percentage);
      }
    });
  }

  checkCollisionsforHealthStatusBar() {
    this.level.enemies.forEach((enemy) => {
      if (this.character.isJumpingOnEnemy(enemy)) {
        return;
      }

      if (this.character.isColliding(enemy) && !this.character.isHurt() && !enemy.isDead) {
        this.character.hit();
        this.character.energy -= 15;
        this.statusBarHealth.setPercentage(this.character.energy);
      }
      if (this.character.energy <= 0 && !this.character.isdead) {
        this.character.isdead = true;
        this.character.currentImage = 0;
        soundManager.gameOver();
        soundManager.playEndScreenSound('dead');
        clearStoppableInterval(this.collisionInterval);
      }
    });
  }

  checkBottleCollisions() {
    this.throwableObjects.forEach((bottle) => {
      if (bottle.hit) return;
      this.level.enemies.forEach((enemy) => {
        if (bottle.isColliding(enemy) && !enemy.isDead) {
          bottle.hit = true;
          soundManager.playSound('bottleSplash');
          if (enemy.hit) {
            enemy.hit();
            if (enemy instanceof Endboss) {
              let percentage = (enemy.health / 5) * 100;
              this.statusBarEndboss.setPercentage(percentage);
            }
          } else if (enemy.die) {
            enemy.die();
          }
        }
      });
    });

    this.throwableObjects.forEach((bottle, index) => {
      if (bottle.splashAnimationComplete) {
        this.throwableObjects.splice(index, 1);
      }
    });
  }

  checkEndbossDefeated() {
    this.level.enemies.forEach((enemy) => {
      if (enemy instanceof Endboss && enemy.isDead && !this.levelCompleted) {
        let timeSinceDeath = (new Date().getTime() - enemy.deadTime) / 1000;
        if (timeSinceDeath > 1) {
          this.levelCompleted = true;
          soundManager.stopBackgroundMusic();
          soundManager.gameOver();
        }
      }
    });
  }

  draw() {
    this.clearCanvas();
    this.drawWorldObjects();
    this.drawStatusBars();
    if (this.shouldDrawEndScreen()) return;
    this.continueGameLoop();
  }

  clearCanvas() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  drawWorldObjects() {
    this.ctx.save();
    this.ctx.translate(this.camera_x, 0);
    this.drawBackgroundLayer();
    this.drawGameEntities();
    this.ctx.restore();
  }

  drawBackgroundLayer() {
    this.drawBackground();
    this.addObjectsToMap(this.level.clouds);
    this.drawCoins();
    this.drawCollectableBottles();
  }

  drawGameEntities() {
    this.ctx.translate(-this.camera_x, 0);
    this.ctx.translate(this.camera_x, 0);
    this.drawEnemies();
    this.drawThrowableBottles();
    this.addtoMap(this.character);
  }

  drawStatusBars() {
    this.addtoMap(this.statusBarCoin);
    this.addtoMap(this.statusBarHealth);
    this.addtoMap(this.statusBarBottle);
    this.drawEndbossStatusBar();
  }

  shouldDrawEndScreen() {
    if (this.levelCompleted) {
      this.drawYouWinScreen();
      return true;
    }
    return this.checkAndDrawGameOver();
  }

  checkAndDrawGameOver() {
    if (this.character.energy <= 0 && this.character.deathAnimationComplete) {
      this.drawGameOverScreen();
      return true;
    }
    return false;
  }

  continueGameLoop() {
    if (!this.isPaused) {
      requestAnimationFrame(() => this.draw());
    }
  }

  drawEndbossStatusBar() {
    this.level.enemies.forEach((enemy) => {
      if (enemy instanceof Endboss && enemy.isVisible) {
        this.addtoMap(this.statusBarEndboss);
      }
    });
  }

  drawEnemies() {
    this.level.enemies.forEach((enemy) => {
      if (enemy.isDead) {
        let timeSinceDeath = (new Date().getTime() - enemy.deadTime) / 1000;
        if (timeSinceDeath < 1) {
          this.addtoMap(enemy);
        }
      } else {
        this.addtoMap(enemy);
      }
    });
  }

  drawCoins() {
    this.level.coins.forEach((coin) => {
      if (!coin.collected) {
        this.addtoMap(coin);
      }
    });
  }

  drawCollectableBottles() {
    this.level.bottles.forEach((bottle) => {
      if (!bottle.collected) {
        this.addtoMap(bottle);
      }
    });
  }

  drawThrowableBottles() {
    this.throwableObjects.forEach((bottle) => {
      this.addtoMap(bottle);
    });
  }

  drawBackground() {
    for (let i = -1; i < 3; i++) {
      this.drawBackgroundObjects(this.level.backgroundObjects, i);
      this.drawBackgroundObjects(this.level.backgroundObjects2, i);
    }
  }

  drawBackgroundObjects(backgroundObjects, layerIndex) {
    backgroundObjects.forEach((backgroundObject) => {
      let originalX = backgroundObject.x;
      backgroundObject.x = originalX + layerIndex * 1440;
      this.addtoMap(backgroundObject);
      backgroundObject.x = originalX;
    });
  }

  addObjectsToMap(objects) {
    objects.forEach((o) => this.addtoMap(o));
  }

  addtoMap(mo) {
    mo.drawFrame(this.ctx);

    if (mo.OtherDirection) {
      mo.drawOtherDirection(this.ctx);
    } else {
      mo.drawOtherDirectionReset(this.ctx);
    }
  }

  showGameEndButtons() {
    document.getElementById('restartButton').classList.remove('d-none');
    document.getElementById('mainMenuButton').classList.remove('d-none');
    document.getElementById('soundButtonGameEnd').classList.remove('d-none');
    document.getElementById('soundButtonGame').classList.remove('show');
    toggleMobileControlsVisibility(false);
  }

  drawGameOverScreen() {
    this.ctx.drawImage(this.gameOverImage, 0, 0, this.canvas.width, this.canvas.height);

    if (this.gameOverStartTime === null) {
      this.gameOverStartTime = new Date().getTime();
      soundManager.stopBackgroundMusic();
      soundManager.playEndScreenSound('youLose');
      this.showGameEndButtons();
    }
  }

  drawYouWinScreen() {
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.ctx.drawImage(this.youWinImage, 0, 0, this.canvas.width, this.canvas.height);

    if (this.youWinStartTime === null) {
      this.youWinStartTime = new Date().getTime();
      soundManager.playEndScreenSound('youWin');
      this.showGameEndButtons();
    }
  }

}