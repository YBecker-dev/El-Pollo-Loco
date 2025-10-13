/**
 * Character Collision Module - Handles collision detection and jump attacks
 * This file extends the Character class with collision-related methods.
 */
class CharacterCollision {
  /**
   * @param {Character} character - The Character instance
   */
  constructor(character) {
    this.character = character;
  }

  /**
   * Checks collision with another object using precise hitboxes
   * @param {MovableObject} mo - Object to check collision with
   * @returns {boolean} True if objects are colliding
   */
  isColliding(mo) {
    const thisBox = this.getHitbox();
    const moBox = this.getMoBox(mo);
    return (
      thisBox.x + thisBox.width > moBox.x &&
      thisBox.y + thisBox.height > moBox.y &&
      thisBox.x < moBox.x + moBox.width &&
      thisBox.y < moBox.y + moBox.height
    );
  }

  /**
   * Gets hitbox of another object
   * @param {MovableObject} mo - Object to get hitbox from
   * @returns {Object} Hitbox dimensions and position
   */
  getMoBox(mo) {
    if (mo.getHitbox) {
      return mo.getHitbox();
    } else {
      return this.calculateHitbox(mo);
    }
  }

  /**
   * Calculates hitbox for an object
   * @param {Object} obj - Object to calculate hitbox for
   * @returns {Object} Hitbox with x, y, width, and height
   */
  calculateHitbox(obj) {
    const offsets = this.getOffsetsForObj(obj);
    return {
      x: obj.x + offsets.offsetX,
      y: obj.y + offsets.offsetYTop,
      width: obj.width - 2 * offsets.offsetX,
      height: obj.height - offsets.offsetYTop - offsets.offsetYBottom,
    };
  }

  /**
   * Gets hitbox offsets for an object
   * @param {Object} obj - Object to get offsets from
   * @returns {Object} Offset values
   */
  getOffsetsForObj(obj) {
    if (obj.getHitboxOffsets) {
      return obj.getHitboxOffsets();
    } else {
      return { offsetX: 0, offsetYTop: 0, offsetYBottom: 0 };
    }
  }

  /**
   * Gets the character's hitbox
   * @returns {Object} Hitbox with x, y, width, and height
   */
  getHitbox() {
    const offsets = this.getHitboxOffsets();
    return {
      x: this.character.x + offsets.offsetX,
      y: this.character.y + offsets.offsetYTop,
      width: this.character.width - 2 * offsets.offsetX,
      height: this.character.height - offsets.offsetYTop - offsets.offsetYBottom,
    };
  }

  /**
   * Gets character-specific hitbox offsets
   * @returns {Object} Offset values for character
   */
  getHitboxOffsets() {
    return {
      offsetX: this.character.width * 0.1,
      offsetYTop: this.character.height * 0.35,
      offsetYBottom: this.character.height * 0.03,
    };
  }

  /**
   * Checks if character is jumping on an enemy
   * @param {MovableObject} enemy - Enemy to check
   * @returns {boolean} True if valid jump attack
   */
  isJumpingOnEnemy(enemy) {
    if (!this.isColliding(enemy) || enemy.isDead) {
      return false;
    }
    return this.isCharacterLandingOnEnemy(enemy);
  }

  /**
   * Checks if character is landing on enemy from above
   * @param {MovableObject} enemy - Enemy to check
   * @returns {boolean} True if landing on enemy
   */
  isCharacterLandingOnEnemy(enemy) {
    const characterBottom = this.getCharacterBottom();
    const enemyTop = this.getEnemyTop(enemy);
    const tolerance = enemy.height * 0.3;
    return this.isValidJumpAttack(characterBottom, enemyTop, tolerance);
  }

  /**
   * Gets the bottom position of the character
   * @returns {number} Y coordinate of character bottom
   */
  getCharacterBottom() {
    const offsets = this.getHitboxOffsets();
    return this.character.y + this.character.height - offsets.offsetYBottom;
  }

  /**
   * Gets the top position of an enemy
   * @param {MovableObject} enemy - Enemy object
   * @returns {number} Y coordinate of enemy top
   */
  getEnemyTop(enemy) {
    const offsets = enemy.getHitboxOffsets();
    return enemy.y + offsets.offsetYTop;
  }

  /**
   * Validates if jump attack is successful
   * @param {number} characterBottom - Character's bottom Y position
   * @param {number} enemyTop - Enemy's top Y position
   * @param {number} tolerance - Collision tolerance value
   * @returns {boolean} True if valid jump attack
   */
  isValidJumpAttack(characterBottom, enemyTop, tolerance) {
    const isInAir = this.character.isAboveGround();
    const isFalling = this.character.speedY < 10;
    const isAboveEnemy = characterBottom < enemyTop + tolerance;
    return isInAir && isFalling && isAboveEnemy;
  }

  /**
   * Performs jump attack on enemy
   * @param {MovableObject} enemy - Enemy to attack
   */
  jumpOnEnemy(enemy) {
    enemy.die();
    this.character.speedY = 20;
  }

  /**
   * Checks and handles jump attacks on all enemies
   */
  checkJumpOnEnemies() {
    if (!this.character.world || !this.character.world.level) return;

    this.character.world.level.enemies.forEach((enemy) => {
      if (this.isJumpingOnEnemy(enemy)) {
        this.jumpOnEnemy(enemy);
      }
    });
  }

  /**
   * Handles collision detection and camera positioning
   */
  handleCollisionsAndCamera() {
    this.checkJumpOnEnemies();
    this.character.world.camera_x = -this.character.x + 100;
  }
}
