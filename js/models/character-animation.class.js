/**
 * CharacterAnimation - Handles animation logic for Character objects
 * @class
 */
class CharacterAnimation {
  /**
   * Creates a new CharacterAnimation instance
   * @param {Character} character - The Character object to animate
   */
  constructor(character) {
    this.character = character;
  }

  /**
   * Handles character animation selection and playback
   */
  handleAnimation() {
    if (this.shouldStopAnimationForLevelComplete()) return;
    const idleTime = this.getIdleTime();
    this.selectAndPlayAnimation(idleTime);
  }

  /**
   * Checks if animation should stop for level completion
   * @returns {boolean} True if level is completed
   */
  shouldStopAnimationForLevelComplete() {
    if (this.character.world && this.character.world.levelCompleted) {
      this.stopSleepingIfActive();
      return true;
    }
    return false;
  }

  /**
   * Stops sleeping sound if character is sleeping
   */
  stopSleepingIfActive() {
    if (this.character.isSleeping) {
      soundManager.stopLoopingSound('sleeping');
      this.character.isSleeping = false;
    }
  }

  /**
   * Gets time elapsed since last movement
   * @returns {number} Idle time in milliseconds
   */
  getIdleTime() {
    const currentTime = new Date().getTime();
    return currentTime - this.character.lastMovementTime;
  }

  /**
   * Selects and plays appropriate animation based on character state
   * @param {number} idleTime - Time since last movement
   */
  selectAndPlayAnimation(idleTime) {
    if (this.character.isdead) {
      this.handleDeathAnimation();
    } else if (this.character.isHurt()) {
      this.handleHurtAnimation();
    } else if (this.character.isAboveGround()) {
      this.handleJumpAnimation();
    } else {
      this.handleGroundAnimation(idleTime);
    }
  }

  /**
   * Handles death animation sequence
   */
  handleDeathAnimation() {
    if (this.character.currentImage >= this.character.IMAGES_DEAD.length) {
      this.finalizeDeathAnimation();
    } else {
      this.character.playAnimation(this.character.IMAGES_DEAD);
    }
  }

  /**
   * Finalizes death animation and sets character image
   */
  finalizeDeathAnimation() {
    this.character.deathAnimationComplete = true;
    this.character.currentImage = this.character.IMAGES_DEAD.length - 1;
    this.character.img = this.character.imageCache[this.character.IMAGES_DEAD[this.character.currentImage]];
  }

  /**
   * Handles hurt animation and resets movement time
   */
  handleHurtAnimation() {
    this.character.playAnimation(this.character.IMAGES_HURT);
    this.character.lastMovementTime = new Date().getTime();
    this.stopSleepingIfActive();
  }

  /**
   * Handles jump animation and sets jumping state
   */
  handleJumpAnimation() {
    if (!this.character.isJumping) {
      this.character.currentImage = 0;
      this.character.isJumping = true;
    }
    this.character.playAnimation(this.character.IMAGES_JUMPING);
    this.stopSleepingIfActive();
  }

  /**
   * Handles ground animation and movement logic
   * @param {number} idleTime - Time since last movement
   */
  handleGroundAnimation(idleTime) {
    this.character.isJumping = false;
    if (this.character.world.keyboard.Right || this.character.world.keyboard.Left) {
      this.character.playAnimation(this.character.IMAGES_WALKING);
      this.character.lastMovementTime = new Date().getTime();
      if (this.character.isSleeping) {
        soundManager.stopLoopingSound('sleeping');
        this.character.isSleeping = false;
      }
    } else {
      this.handleIdleAnimation(idleTime);
    }
  }

  /**
   * Handles idle and sleeping animations
   * @param {number} idleTime - Time since last movement
   */
  handleIdleAnimation(idleTime) {
    if (idleTime < 15000) {
      this.playShortIdleAnimation();
    } else {
      this.playLongIdleAnimation();
    }
  }

  /**
   * Handles regular idle animation
   */
  playShortIdleAnimation() {
    this.character.playAnimation(this.character.IMAGES_IDLE);
    this.stopSleepingIfActive();
  }

  /**
   * Handles long idle (sleeping) animation and sound
   */
  playLongIdleAnimation() {
    this.startSleepingIfNotActive();
    this.character.playAnimation(this.character.IMAGES_IDLE_LONG);
  }

  /**
   * Starts sleeping sound if not already active
   */
  startSleepingIfNotActive() {
    if (!this.character.isSleeping) {
      soundManager.playLoopingSound('sleeping');
      this.character.isSleeping = true;
    }
  }
}
