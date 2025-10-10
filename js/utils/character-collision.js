/**
 * Character Collision Module - Handles collision detection and jump attacks
 * This file extends the Character class with collision-related methods.
 */

/**
 * Checks collision with another object using precise hitboxes
 * @param {MovableObject} mo - Object to check collision with
 * @returns {boolean} True if objects are colliding
 */
Character.prototype.isColliding = function (mo) {
  const thisBox = this.getHitbox();
  const moBox = this.getMoBox(mo);
  return (
    thisBox.x + thisBox.width > moBox.x &&
    thisBox.y + thisBox.height > moBox.y &&
    thisBox.x < moBox.x + moBox.width &&
    thisBox.y < moBox.y + moBox.height
  );
};

/**
 * Gets hitbox of another object
 * @param {MovableObject} mo - Object to get hitbox from
 * @returns {Object} Hitbox dimensions and position
 */
Character.prototype.getMoBox = function (mo) {
  if (mo.getHitbox) {
    return mo.getHitbox();
  } else {
    return this.calculateHitbox(mo);
  }
};

/**
 * Calculates hitbox for an object
 * @param {Object} obj - Object to calculate hitbox for
 * @returns {Object} Hitbox with x, y, width, and height
 */
Character.prototype.calculateHitbox = function (obj) {
  const offsets = this.getOffsetsForObj(obj);
  return {
    x: obj.x + offsets.offsetX,
    y: obj.y + offsets.offsetYTop,
    width: obj.width - 2 * offsets.offsetX,
    height: obj.height - offsets.offsetYTop - offsets.offsetYBottom,
  };
};

/**
 * Gets hitbox offsets for an object
 * @param {Object} obj - Object to get offsets from
 * @returns {Object} Offset values
 */
Character.prototype.getOffsetsForObj = function (obj) {
  if (obj.getHitboxOffsets) {
    return obj.getHitboxOffsets();
  } else {
    return { offsetX: 0, offsetYTop: 0, offsetYBottom: 0 };
  }
};

/**
 * Gets the character's hitbox
 * @returns {Object} Hitbox with x, y, width, and height
 */
Character.prototype.getHitbox = function () {
  const offsets = this.getHitboxOffsets();
  return {
    x: this.x + offsets.offsetX,
    y: this.y + offsets.offsetYTop,
    width: this.width - 2 * offsets.offsetX,
    height: this.height - offsets.offsetYTop - offsets.offsetYBottom,
  };
};

/**
 * Gets character-specific hitbox offsets
 * @returns {Object} Offset values for character
 */
Character.prototype.getHitboxOffsets = function () {
  return {
    offsetX: this.width * 0.1,
    offsetYTop: this.height * 0.35,
    offsetYBottom: this.height * 0.03,
  };
};

/**
 * Checks if character is jumping on an enemy
 * @param {MovableObject} enemy - Enemy to check
 * @returns {boolean} True if valid jump attack
 */
Character.prototype.isJumpingOnEnemy = function (enemy) {
  if (!this.isColliding(enemy) || enemy.isDead) {
    return false;
  }
  return this.isCharacterLandingOnEnemy(enemy);
};

/**
 * Checks if character is landing on enemy from above
 * @param {MovableObject} enemy - Enemy to check
 * @returns {boolean} True if landing on enemy
 */
Character.prototype.isCharacterLandingOnEnemy = function (enemy) {
  const characterBottom = this.getCharacterBottom();
  const enemyTop = this.getEnemyTop(enemy);
  const tolerance = enemy.height * 0.3;
  return this.isValidJumpAttack(characterBottom, enemyTop, tolerance);
};

/**
 * Gets the bottom position of the character
 * @returns {number} Y coordinate of character bottom
 */
Character.prototype.getCharacterBottom = function () {
  const offsets = this.getHitboxOffsets();
  return this.y + this.height - offsets.offsetYBottom;
};

/**
 * Gets the top position of an enemy
 * @param {MovableObject} enemy - Enemy object
 * @returns {number} Y coordinate of enemy top
 */
Character.prototype.getEnemyTop = function (enemy) {
  const offsets = enemy.getHitboxOffsets();
  return enemy.y + offsets.offsetYTop;
};

/**
 * Validates if jump attack is successful
 * @param {number} characterBottom - Character's bottom Y position
 * @param {number} enemyTop - Enemy's top Y position
 * @param {number} tolerance - Collision tolerance value
 * @returns {boolean} True if valid jump attack
 */
Character.prototype.isValidJumpAttack = function (characterBottom, enemyTop, tolerance) {
  const isInAir = this.isAboveGround();
  const isFalling = this.speedY < 10;
  const isAboveEnemy = characterBottom < enemyTop + tolerance;
  return isInAir && isFalling && isAboveEnemy;
};

/**
 * Performs jump attack on enemy
 * @param {MovableObject} enemy - Enemy to attack
 */
Character.prototype.jumpOnEnemy = function (enemy) {
  enemy.die();
  this.speedY = 20;
};

/**
 * Checks and handles jump attacks on all enemies
 */
Character.prototype.checkJumpOnEnemies = function () {
  if (!this.world || !this.world.level) return;

  this.world.level.enemies.forEach((enemy) => {
    if (this.isJumpingOnEnemy(enemy)) {
      this.jumpOnEnemy(enemy);
    }
  });
};

/**
 * Handles collision detection and camera positioning
 */
Character.prototype.handleCollisionsAndCamera = function () {
  this.checkJumpOnEnemies();
  this.world.camera_x = -this.x + 100;
};
