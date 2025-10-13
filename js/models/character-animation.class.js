/**
 * CharacterAnimation - Animation-Logik für Character-Objekte
 * @class
 */
class CharacterAnimation {
  /**
   * @param {Character} character - The Character object
   */
  constructor(character) {
    this.character = character;
  }

  handleAnimation() {
    if (this.shouldStopAnimationForLevelComplete()) return;
    const idleTime = this.getIdleTime();
    this.selectAndPlayAnimation(idleTime);
  }

  shouldStopAnimationForLevelComplete() {
    if (this.character.world && this.character.world.levelCompleted) {
      this.stopSleepingIfActive();
      return true;
    }
    return false;
  }

  stopSleepingIfActive() {
    if (this.character.isSleeping) {
      soundManager.stopLoopingSound('sleeping');
      this.character.isSleeping = false;
    }
  }

  getIdleTime() {
    const currentTime = new Date().getTime();
    return currentTime - this.character.lastMovementTime;
  }

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

  handleDeathAnimation() {
    if (this.character.currentImage >= this.character.IMAGES_DEAD.length) {
      this.finalizeDeathAnimation();
    } else {
      this.character.playAnimation(this.character.IMAGES_DEAD);
    }
  }

  finalizeDeathAnimation() {
    this.character.deathAnimationComplete = true;
    this.character.currentImage = this.character.IMAGES_DEAD.length - 1;
    this.character.img = this.character.imageCache[this.character.IMAGES_DEAD[this.character.currentImage]];
  }

  handleHurtAnimation() {
    this.character.playAnimation(this.character.IMAGES_HURT);
    this.character.lastMovementTime = new Date().getTime();
    this.stopSleepingIfActive();
  }

  handleJumpAnimation() {
    if (!this.character.isJumping) {
      this.character.currentImage = 0;
      this.character.isJumping = true;
    }
    this.character.playAnimation(this.character.IMAGES_JUMPING);
    this.stopSleepingIfActive();
  }

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

  handleIdleAnimation(idleTime) {
    if (idleTime < 15000) {
      this.playShortIdleAnimation();
    } else {
      this.playLongIdleAnimation();
    }
  }

  playShortIdleAnimation() {
    this.character.playAnimation(this.character.IMAGES_IDLE);
    this.stopSleepingIfActive();
  }

  playLongIdleAnimation() {
    this.startSleepingIfNotActive();
    this.character.playAnimation(this.character.IMAGES_IDLE_LONG);
  }

  startSleepingIfNotActive() {
    if (!this.character.isSleeping) {
      soundManager.playLoopingSound('sleeping');
      this.character.isSleeping = true;
    }
  }
}
