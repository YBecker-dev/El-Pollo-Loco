/**
 * World Collision Module - Handles collision detection and damage logic
 * This file extends the World class with collision-related methods.
 */

/**
 * Checks if player can throw bottles and handles throwing
 */
World.prototype.checkThrowableObjects = function () {
  const currentTime = new Date().getTime();
  const timeSinceLastThrow = currentTime - this.lastThrowTime;

  if (this.canThrowBottle(timeSinceLastThrow)) {
    this.throwBottle(currentTime);
  } else if (this.keyboard.F && this.collectedBottles === 0 && timeSinceLastThrow > 300) {
    this.lastThrowTime = currentTime;
  }
};

/**
 * Checks if bottle throwing conditions are met
 * @param {number} timeSinceLastThrow - Time since last bottle throw
 * @returns {boolean} True if bottle can be thrown
 */
World.prototype.canThrowBottle = function (timeSinceLastThrow) {
  return this.keyboard.F && this.collectedBottles > 0 && timeSinceLastThrow > 300 && !this.character.isHurt();
};

/**
 * Creates and throws a new bottle
 * @param {number} currentTime - Current timestamp
 */
World.prototype.throwBottle = function (currentTime) {
  const bottle = new ThrowableObject(this.character.x + 50, this.character.y + 50);
  this.throwableObjects.push(bottle);
  soundManager.playSound('bottleThrow');
  this.collectedBottles--;
  this.lastThrowTime = currentTime;
  const percentage = Math.min(this.collectedBottles * 20, 100);
  this.statusBarBottle.setPercentage(percentage);
};

/**
 * Checks collisions with coins and updates coin status bar
 */
World.prototype.checkCollisionsforCoinsStatusBar = function () {
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
};

/**
 * Checks collisions with bottles and updates bottle status bar
 */
World.prototype.checkCollisionsforBottlesStatusBar = function () {
  this.level.bottles.forEach((bottle) => {
    if (this.character.isColliding(bottle) && !bottle.collected && this.collectedBottles < 5) {
      bottle.collect();
      soundManager.playSound('bottleCollect');
      this.collectedBottles++;
      const percentage = Math.min(this.collectedBottles * 20, 100);
      this.statusBarBottle.setPercentage(percentage);
    }
  });
};

/**
 * Checks enemy collisions and updates health status bar
 */
World.prototype.checkCollisionsforHealthStatusBar = function () {
  this.level.enemies.forEach((enemy) => {
    if (this.character.isJumpingOnEnemy(enemy)) {
      return;
    }
    this.handleEnemyCollision(enemy);
    this.handleCharacterDeath();
  });
};

/**
 * Handles collision between character and enemy
 * @param {MovableObject} enemy - Enemy that collided with character
 */
World.prototype.handleEnemyCollision = function (enemy) {
  if (this.character.isColliding(enemy) && !this.character.isHurt() && !enemy.isDead) {
    this.character.hit();
    this.character.energy -= 15;
    this.statusBarHealth.setPercentage(this.character.energy);
  }
};

/**
 * Handles character death when health reaches zero
 */
World.prototype.handleCharacterDeath = function () {
  if (this.character.energy <= 0 && !this.character.isdead) {
    this.character.isdead = true;
    this.character.currentImage = 0;
    soundManager.gameOver();
    soundManager.playEndScreenSound('dead');
    clearStoppableInterval(this.collisionInterval);
  }
};

/**
 * Processes bottle collisions with enemies
 */
World.prototype.checkBottleCollisions = function () {
  this.processBottleHits();
  this.removeCompletedBottles();
};

/**
 * Processes hits for all throwable bottles
 */
World.prototype.processBottleHits = function () {
  this.throwableObjects.forEach((bottle) => {
    if (bottle.hit) return;
    this.checkBottleAgainstEnemies(bottle);
  });
};

/**
 * Checks if a bottle hits any enemy
 * @param {ThrowableObject} bottle - Bottle to check
 */
World.prototype.checkBottleAgainstEnemies = function (bottle) {
  this.level.enemies.forEach((enemy) => {
    if (this.isBottleHittingEnemy(bottle, enemy)) {
      this.handleBottleHit(bottle, enemy);
    }
  });
};

/**
 * Checks if bottle is hitting a specific enemy
 * @param {ThrowableObject} bottle - Bottle object
 * @param {MovableObject} enemy - Enemy object
 * @returns {boolean} True if bottle hits enemy
 */
World.prototype.isBottleHittingEnemy = function (bottle, enemy) {
  return bottle.isColliding(enemy) && !enemy.isDead;
};

/**
 * Handles bottle hitting an enemy
 * @param {ThrowableObject} bottle - Bottle that hit
 * @param {MovableObject} enemy - Enemy that was hit
 */
World.prototype.handleBottleHit = function (bottle, enemy) {
  bottle.hit = true;
  soundManager.playSound('bottleSplash');
  this.applyDamageToEnemy(enemy);
};

/**
 * Applies damage to enemy based on enemy type
 * @param {MovableObject} enemy - Enemy to damage
 */
World.prototype.applyDamageToEnemy = function (enemy) {
  if (enemy.hit) {
    enemy.hit();
    this.updateEndbossHealthBar(enemy);
  } else if (enemy.die) {
    enemy.die();
  }
};

/**
 * Updates endboss health bar if enemy is endboss
 * @param {MovableObject} enemy - Enemy to check
 */
World.prototype.updateEndbossHealthBar = function (enemy) {
  if (enemy instanceof Endboss) {
    const percentage = (enemy.health / 5) * 100;
    this.statusBarEndboss.setPercentage(percentage);
  }
};

/**
 * Removes completed bottle splash animations
 */
World.prototype.removeCompletedBottles = function () {
  this.throwableObjects.forEach((bottle, index) => {
    if (bottle.splashAnimationComplete) {
      this.throwableObjects.splice(index, 1);
    }
  });
};

/**
 * Checks if endboss is defeated and handles level completion
 */
World.prototype.checkEndbossDefeated = function () {
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
};
