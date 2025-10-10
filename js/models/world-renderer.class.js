class WorldRenderer {
  constructor(world) {
    this.world = world;
  }

  draw() {
    this.clearCanvas();
    this.drawWorldObjects();
    this.drawStatusBars();
    if (this.shouldDrawEndScreen()) return;
    this.continueGameLoop();
  }

  clearCanvas() {
    this.world.ctx.clearRect(0, 0, this.world.canvas.width, this.world.canvas.height);
  }

  drawWorldObjects() {
    this.world.ctx.save();
    this.world.ctx.translate(this.world.camera_x, 0);
    this.drawBackgroundLayer();
    this.drawGameEntities();
    this.world.ctx.restore();
  }

  drawBackgroundLayer() {
    this.drawBackground();
    this.addObjectsToMap(this.world.level.clouds);
    this.drawCoins();
    this.drawCollectableBottles();
  }

  drawGameEntities() {
    this.world.ctx.translate(-this.world.camera_x, 0);
    this.world.ctx.translate(this.world.camera_x, 0);
    this.drawEnemies();
    this.drawThrowableBottles();
    this.addtoMap(this.world.character);
  }

  drawStatusBars() {
    this.addtoMap(this.world.statusBarCoin);
    this.addtoMap(this.world.statusBarHealth);
    this.addtoMap(this.world.statusBarBottle);
    this.drawEndbossStatusBar();
  }

  shouldDrawEndScreen() {
    if (this.world.levelCompleted) {
      this.drawYouWinScreen();
      return true;
    }
    return this.checkAndDrawGameOver();
  }

  checkAndDrawGameOver() {
    if (this.world.character.energy <= 0 && this.world.character.deathAnimationComplete) {
      this.drawGameOverScreen();
      return true;
    }
    return false;
  }

  continueGameLoop() {
    if (!this.world.isPaused) {
      requestAnimationFrame(() => this.draw());
    }
  }

  drawEndbossStatusBar() {
    this.world.level.enemies.forEach((enemy) => {
      if (enemy instanceof Endboss && enemy.isVisible) {
        this.addtoMap(this.world.statusBarEndboss);
      }
    });
  }

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

  drawCoins() {
    this.world.level.coins.forEach((coin) => {
      if (!coin.collected) {
        this.addtoMap(coin);
      }
    });
  }

  drawCollectableBottles() {
    this.world.level.bottles.forEach((bottle) => {
      if (!bottle.collected) {
        this.addtoMap(bottle);
      }
    });
  }

  drawThrowableBottles() {
    this.world.throwableObjects.forEach((bottle) => {
      this.addtoMap(bottle);
    });
  }

  drawBackground() {
    for (let i = -1; i < 3; i++) {
      this.drawBackgroundObjects(this.world.level.backgroundObjects, i);
      this.drawBackgroundObjects(this.world.level.backgroundObjects2, i);
    }
  }

  drawBackgroundObjects(backgroundObjects, layerIndex) {
    backgroundObjects.forEach((backgroundObject) => {
      const originalX = backgroundObject.x;
      backgroundObject.x = originalX + layerIndex * 1440;
      this.addtoMap(backgroundObject);
      backgroundObject.x = originalX;
    });
  }

  addObjectsToMap(objects) {
    objects.forEach((o) => this.addtoMap(o));
  }

  addtoMap(mo) {
    mo.drawFrame(this.world.ctx);

    if (mo.OtherDirection) {
      mo.drawOtherDirection(this.world.ctx);
    } else {
      mo.drawOtherDirectionReset(this.world.ctx);
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
    this.world.ctx.drawImage(this.world.gameOverImage, 0, 0, this.world.canvas.width, this.world.canvas.height);

    if (this.world.gameOverStartTime === null) {
      this.world.gameOverStartTime = new Date().getTime();
      soundManager.stopBackgroundMusic();
      soundManager.playEndScreenSound('youLose');
      this.showGameEndButtons();
    }
  }

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
