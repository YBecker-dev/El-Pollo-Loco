/**
 * World renderer class handling all game drawing operations
 * @class
 */
class WorldRenderer {
  /**
   * Creates an instance of WorldRenderer
   * @constructor
   */
  constructor(world) {
    this.world = world;
  }

  /**
   * Main draw function called each frame
   */
  draw() {
    this.clearCanvas();
    this.drawWorldObjects();
    this.drawStatusBars();
    if (this.shouldDrawEndScreen()) return;
    this.continueGameLoop();
  }

  /**
   * Clears the entire canvas
   */
  clearCanvas() {
    this.world.ctx.clearRect(0, 0, this.world.canvas.width, this.world.canvas.height);
  }

  /**
   * Draws all world objects with camera translation
   */
  drawWorldObjects() {
    this.world.ctx.save();
    this.world.ctx.translate(this.world.camera_x, 0);
    this.drawBackgroundLayer();
    this.drawGameEntities();
    this.world.ctx.restore();
  }

  /**
   * Draws background layer objects
   */
  drawBackgroundLayer() {
    this.drawBackground();
    this.addObjectsToMap(this.world.level.clouds);
    this.drawCoins();
    this.drawCollectableBottles();
  }

  /**
   * Draws game entities (enemies, character, projectiles)
   */
  drawGameEntities() {
    this.world.ctx.translate(-this.world.camera_x, 0);
    this.world.ctx.translate(this.world.camera_x, 0);
    this.drawEnemies();
    this.drawThrowableBottles();
    this.addtoMap(this.world.character);
  }

  /**
   * Draws all status bars
   */
  drawStatusBars() {
    this.addtoMap(this.world.statusBarCoin);
    this.addtoMap(this.world.statusBarHealth);
    this.addtoMap(this.world.statusBarBottle);
    this.drawEndbossStatusBar();
  }

  /**
   * Checks if end screen should be drawn
   * @returns {boolean} True if end screen is drawn
   */
  shouldDrawEndScreen() {
    if (this.world.levelCompleted) {
      this.drawYouWinScreen();
      return true;
    }
    return this.checkAndDrawGameOver();
  }

  /**
   * Checks and draws game over screen if needed
   * @returns {boolean} True if game over screen is drawn
   */
  checkAndDrawGameOver() {
    if (this.world.character.energy <= 0 && this.world.character.deathAnimationComplete) {
      this.drawGameOverScreen();
      return true;
    }
    return false;
  }

  /**
   * Continues the game loop if not paused
   */
  continueGameLoop() {
    if (!this.world.isPaused) {
      requestAnimationFrame(() => this.draw());
    }
  }

  /**
   * Draws endboss status bar when endboss is visible
   */
  drawEndbossStatusBar() {
    this.world.level.enemies.forEach((enemy) => {
      if (enemy instanceof Endboss && enemy.isVisible) {
        this.addtoMap(this.world.statusBarEndboss);
      }
    });
  }

  /**
   * Draws all enemies with death timing
   */
  drawEnemies() {
    this.world.level.enemies.forEach((enemy) => {
      if (enemy.isDead) {
        const timeSinceDeath = (new Date().getTime() - enemy.deadTime) / 1000;
        if (timeSinceDeath < 1) {
          this.addtoMap(enemy);
        }
      } else {
        this.addtoMap(enemy);
      }
    });
  }

  /**
   * Draws uncollected coins
   */
  drawCoins() {
    this.world.level.coins.forEach((coin) => {
      if (!coin.collected) {
        this.addtoMap(coin);
      }
    });
  }

  /**
   * Draws uncollected bottles
   */
  drawCollectableBottles() {
    this.world.level.bottles.forEach((bottle) => {
      if (!bottle.collected) {
        this.addtoMap(bottle);
      }
    });
  }

  /**
   * Draws throwable bottles
   */
  drawThrowableBottles() {
    this.world.throwableObjects.forEach((bottle) => {
      this.addtoMap(bottle);
    });
  }

  /**
   * Draws background with parallax scrolling
   */
  drawBackground() {
    for (let i = -1; i < 3; i++) {
      this.drawBackgroundObjects(this.world.level.backgroundObjects, i);
      this.drawBackgroundObjects(this.world.level.backgroundObjects2, i);
    }
  }

  /**
   * Draws background objects for parallax layers
   * @param {BackgroundObject[]} backgroundObjects - Background objects array
   * @param {number} layerIndex - Layer index for parallax
   */
  drawBackgroundObjects(backgroundObjects, layerIndex) {
    backgroundObjects.forEach((backgroundObject) => {
      const originalX = backgroundObject.x;
      backgroundObject.x = originalX + layerIndex * 1440;
      this.addtoMap(backgroundObject);
      backgroundObject.x = originalX;
    });
  }

  /**
   * Adds multiple objects to the map
   * @param {MovableObject[]} objects - Array of objects to draw
   */
  addObjectsToMap(objects) {
    objects.forEach((o) => this.addtoMap(o));
  }

  /**
   * Adds a single object to the map with proper orientation
   * @param {MovableObject} mo - Object to draw
   */
  addtoMap(mo) {
    if (mo.OtherDirection) {
      mo.drawOtherDirection(this.world.ctx);
    } else {
      mo.drawOtherDirectionReset(this.world.ctx);
    }

    mo.drawFrame(this.world.ctx);
  }

  /**
   * Shows game end buttons (restart, main menu, sound)
   */
  showGameEndButtons() {
    document.getElementById('restartButton').classList.remove('d-none');
    document.getElementById('mainMenuButton').classList.remove('d-none');
    document.getElementById('soundButtonGameEnd').classList.remove('d-none');
    document.getElementById('soundButtonGame').classList.remove('show');
    toggleMobileControlsVisibility(false);
  }

  /**
   * Draws the game over screen
   */
  drawGameOverScreen() {
    this.world.ctx.drawImage(this.world.gameOverImage, 0, 0, this.world.canvas.width, this.world.canvas.height);

    if (this.world.gameOverStartTime === null) {
      this.world.gameOverStartTime = new Date().getTime();
      soundManager.stopBackgroundMusic();
      soundManager.playEndScreenSound('youLose');
      this.showGameEndButtons();
    }
  }

  /**
   * Draws the you win screen
   */
  drawYouWinScreen() {
    this.world.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    this.world.ctx.fillRect(0, 0, this.world.canvas.width, this.world.canvas.height);

    this.world.ctx.drawImage(this.world.youWinImage, 0, 0, this.world.canvas.width, this.world.canvas.height);

    if (this.world.youWinStartTime === null) {
      this.world.youWinStartTime = new Date().getTime();
      soundManager.playEndScreenSound('youWin');
      this.showGameEndButtons();
    }
  }
}
