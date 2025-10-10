/**
 * Character Animation Module - Handles animation selection and playback
 * This file extends the Character class with animation-related methods.
 */

/**
 * Handles character animation selection
 */
Character.prototype.handleAnimation = function () {
  if (this.shouldStopAnimationForLevelComplete()) return;
  const idleTime = this.getIdleTime();
  this.selectAndPlayAnimation(idleTime);
};

/**
 * Checks if animation should stop for level completion
 * @returns {boolean} True if level is completed
 */
Character.prototype.shouldStopAnimationForLevelComplete = function () {
  if (this.world && this.world.levelCompleted) {
    this.stopSleepingIfActive();
    return true;
  }
  return false;
};

/**
 * Stops sleeping sound if character is sleeping
 */
Character.prototype.stopSleepingIfActive = function () {
  if (this.isSleeping) {
    soundManager.stopLoopingSound('sleeping');
    this.isSleeping = false;
  }
};

/**
 * Gets time elapsed since last movement
 * @returns {number} Idle time in milliseconds
 */
Character.prototype.getIdleTime = function () {
  const currentTime = new Date().getTime();
  return currentTime - this.lastMovementTime;
};

/**
 * Selects and plays appropriate animation based on state
 * @param {number} idleTime - Time since last movement
 */
Character.prototype.selectAndPlayAnimation = function (idleTime) {
  if (this.isdead) {
    this.handleDeathAnimation();
  } else if (this.isHurt()) {
    this.handleHurtAnimation();
  } else if (this.isAboveGround()) {
    this.handleJumpAnimation();
  } else {
    this.handleGroundAnimation(idleTime);
  }
};

/**
 * Handles death animation sequence
 */
Character.prototype.handleDeathAnimation = function () {
  if (this.currentImage >= this.IMAGES_DEAD.length) {
    this.finalizeDeathAnimation();
  } else {
    this.playAnimation(this.IMAGES_DEAD);
  }
};

/**
 * Finalizes death animation at last frame
 */
Character.prototype.finalizeDeathAnimation = function () {
  this.deathAnimationComplete = true;
  this.currentImage = this.IMAGES_DEAD.length - 1;
  this.img = this.imageCache[this.IMAGES_DEAD[this.currentImage]];
};

/**
 * Handles hurt animation
 */
Character.prototype.handleHurtAnimation = function () {
  this.playAnimation(this.IMAGES_HURT);
  this.lastMovementTime = new Date().getTime();
  this.stopSleepingIfActive();
};

/**
 * Handles jump animation
 */
Character.prototype.handleJumpAnimation = function () {
  this.playAnimation(this.IMAGES_JUMPING);
  this.stopSleepingIfActive();
};

/**
 * Handles ground animations including walking and idle
 * @param {number} idleTime - Time since last movement
 */
Character.prototype.handleGroundAnimation = function (idleTime) {
  if (this.world.keyboard.Right || this.world.keyboard.Left) {
    this.playAnimation(this.IMAGES_WALKING);
    this.lastMovementTime = new Date().getTime();
    if (this.isSleeping) {
      soundManager.stopLoopingSound('sleeping');
      this.isSleeping = false;
    }
  } else {
    this.handleIdleAnimation(idleTime);
  }
};

/**
 * Handles idle animation based on idle time
 * @param {number} idleTime - Time since last movement
 */
Character.prototype.handleIdleAnimation = function (idleTime) {
  if (idleTime < 15000) {
    this.playShortIdleAnimation();
  } else {
    this.playLongIdleAnimation();
  }
};

/**
 * Plays short idle animation
 */
Character.prototype.playShortIdleAnimation = function () {
  this.playAnimation(this.IMAGES_IDLE);
  this.stopSleepingIfActive();
};

/**
 * Plays long idle animation with sleeping sound
 */
Character.prototype.playLongIdleAnimation = function () {
  this.startSleepingIfNotActive();
  this.playAnimation(this.IMAGES_IDLE_LONG);
};

/**
 * Starts sleeping sound if not already sleeping
 */
Character.prototype.startSleepingIfNotActive = function () {
  if (!this.isSleeping) {
    soundManager.playLoopingSound('sleeping');
    this.isSleeping = true;
  }
};
