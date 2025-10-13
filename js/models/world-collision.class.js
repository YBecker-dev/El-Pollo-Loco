/**
 * World Collision Module - Handles collision detection and damage logic
 * This file extends the World class with collision-related methods.
 */

class WorldCollision {
  /**
   * @param {World} world - The World instance
   */
  constructor(world) {
    this.world = world;
  }

  /**
   * Checks if player can throw bottles and handles throwing
   */
  checkThrowableObjects() {
    const currentTime = new Date().getTime();
    const timeSinceLastThrow = currentTime - this.world.lastThrowTime;
    if (this.canThrowBottle(timeSinceLastThrow)) {
      this.throwBottle(currentTime);
    } else if (this.world.keyboard.F && this.world.collectedBottles === 0 && timeSinceLastThrow > 300) {
      this.world.lastThrowTime = currentTime;
    }
  }

  /**
   * Checks if bottle throwing conditions are met
   * @param {number} timeSinceLastThrow - Time since last bottle throw
   * @returns {boolean} True if bottle can be thrown
   */
  canThrowBottle(timeSinceLastThrow) {
    return (
      this.world.keyboard.F &&
      this.world.collectedBottles > 0 &&
      timeSinceLastThrow > 300 &&
      !this.world.character.isHurt()
    );
  }

  /**
   * Creates and throws a new bottle in character's facing direction
   * @param {number} currentTime - Current timestamp
   */
  throwBottle(currentTime) {
    const throwLeft = this.world.character.OtherDirection;
    const bottle = new ThrowableObject(this.world.character.x + 50, this.world.character.y + 50, throwLeft);
    this.world.throwableObjects.push(bottle);
    soundManager.playSound('bottleThrow');
    this.world.collectedBottles--;
    this.world.lastThrowTime = currentTime;
    const percentage = Math.min(this.world.collectedBottles * 20, 100);
    this.world.statusBarBottle.setPercentage(percentage);
  }

  /**
   * Checks collisions with coins and updates coin status bar
   */
  checkCollisionsforCoinsStatusBar() {
    this.world.level.coins.forEach((coin) => {
      if (this.world.character.collision.isColliding(coin) && !coin.collected) {
        coin.collect();
        soundManager.playSound('coin');
        let collectedCount = 0;
        this.world.level.coins.forEach((c) => {
          if (c.collected) collectedCount++;
        });
        const percentage = Math.min(collectedCount * 20, 100);
        this.world.statusBarCoin.setPercentage(percentage);
      }
    });
  }

  /**
   * Checks collisions with bottles and updates bottle status bar
   */
  checkCollisionsforBottlesStatusBar() {
    this.world.level.bottles.forEach((bottle) => {
      if (this.world.character.collision.isColliding(bottle) && !bottle.collected && this.world.collectedBottles < 5) {
        bottle.collect();
        soundManager.playSound('bottleCollect');
        this.world.collectedBottles++;
        const percentage = Math.min(this.world.collectedBottles * 20, 100);
        this.world.statusBarBottle.setPercentage(percentage);
      }
    });
  }

  /**
   * Checks enemy collisions and updates health status bar
   */
  checkCollisionsforHealthStatusBar() {
    this.world.level.enemies.forEach((enemy) => {
      if (this.world.character.collision.isJumpingOnEnemy(enemy)) {
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
    if (this.world.character.collision.isColliding(enemy) && !this.world.character.isHurt() && !enemy.isDead) {
      this.world.character.hit();
      this.world.character.energy -= 15;
      this.world.statusBarHealth.setPercentage(this.world.character.energy);
    }
  }

  /**
   * Handles character death when health reaches zero
   */
  handleCharacterDeath() {
    if (this.world.character.energy <= 0 && !this.world.character.isdead) {
      this.world.character.isdead = true;
      this.world.character.currentImage = 0;
      soundManager.gameOver();
      soundManager.playEndScreenSound('dead');
      clearStoppableInterval(this.world.collisionInterval);
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
    this.world.throwableObjects.forEach((bottle) => {
      if (bottle.hit) return;
      this.checkBottleAgainstEnemies(bottle);
    });
  }

  /**
   * Checks if a bottle hits any enemy
   * @param {ThrowableObject} bottle - Bottle to check
   */
  checkBottleAgainstEnemies(bottle) {
    this.world.level.enemies.forEach((enemy) => {
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
      this.world.statusBarEndboss.setPercentage(percentage);
    }
  }

  /**
   * Removes completed bottle splash animations
   */
  removeCompletedBottles() {
    this.world.throwableObjects.forEach((bottle, index) => {
      if (bottle.splashAnimationComplete) {
        this.world.throwableObjects.splice(index, 1);
      }
    });
  }

  /**
   * Checks if endboss is defeated and handles level completion
   */
  checkEndbossDefeated() {
    this.world.level.enemies.forEach((enemy) => {
      if (enemy instanceof Endboss && enemy.isDead && !this.world.levelCompleted) {
        const timeSinceDeath = (new Date().getTime() - enemy.deadTime) / 1000;
        if (timeSinceDeath > 1) {
          this.world.levelCompleted = true;
          soundManager.stopBackgroundMusic();
          soundManager.gameOver();
        }
      }
    });
  }
}
