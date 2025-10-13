/**
 * Character Animator - Handles animation selection and playback for Character instances
 * @class
 */
class CharacterAnimator {
  /**
   * Creates a new CharacterAnimator instance
   * @param {Character} character - The character instance to animate
   */
  constructor(character) {
    this.character = character;
  }

  /**
   * Handles character animation selection
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
   * Selects and plays appropriate animation based on state
   * @param {number} idleTime - Time since last movement
   */
  selectAndPlayAnimation(idleTime) {
    if (this.character.isdead) {
      this.character.playAnimation(this.character.IMAGES_DEAD);
    } else if (this.character.isHurt()) {
      this.character.playAnimation(this.character.IMAGES_HURT);
    } else if (this.character.isAboveGround()) {
      this.character.playAnimation(this.character.IMAGES_JUMPING);
    } else if (this.character.world.keyboard.Right || this.character.world.keyboard.Left) {
      this.character.playAnimation(this.character.IMAGES_WALKING);
    } else {
      this.handleIdleAnimation(idleTime);
    }
  }

  /**
   * Handles idle and sleeping animations
   * @param {number} idleTime - Time since last movement
   */
  handleIdleAnimation(idleTime) {
    if (idleTime > 10000) {
      this.handleSleepingAnimation();
    } else {
      this.handleRegularIdleAnimation();
    }
  }

  /**
   * Handles sleeping animation and sound
   */
  handleSleepingAnimation() {
    this.character.playAnimation(this.character.IMAGES_IDLE_LONG);
    if (!this.character.isSleeping) {
      soundManager.playLoopingSound('sleeping');
      this.character.isSleeping = true;
    }
  }

  /**
   * Handles regular idle animation
   */
  handleRegularIdleAnimation() {
    this.character.playAnimation(this.character.IMAGES_IDLE);
    if (this.character.isSleeping) {
      soundManager.stopLoopingSound('sleeping');
      this.character.isSleeping = false;
    }
  }
}
