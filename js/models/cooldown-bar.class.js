/**
 * Cooldown bar that displays next to character during throw cooldown
 * @class
 */
class CooldownBar {
  cooldownDuration = 1500;
  cooldownStartTime = 0;
  hideDelay = 1000;
  isActive = false;
  updateInterval = null;

  /**
   * Creates an instance of CooldownBar
   * @constructor
   */
  constructor() {
    this.barElement = document.getElementById('cooldownBar');
    this.fillElement = document.getElementById('cooldownBarFill');
  }

  /**
   * Starts the cooldown animation
   */
  startCooldown() {
    this.isActive = true;
    this.cooldownStartTime = Date.now();
    this.show();
    this.startUpdateLoop();
  }

  /**
   * Shows the cooldown bar
   */
  show() {
    this.barElement.classList.remove('d-none');
    this.fillElement.style.width = '0%';
  }

  /**
   * Hides the cooldown bar with fade-out animation
   */
  hide() {
    this.barElement.classList.add('cooldown-bar-fadeout');
    this.isActive = false;
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
      this.updateInterval = null;
    }
    // Remove from DOM after animation
    setTimeout(() => {
      this.barElement.classList.add('d-none');
      this.barElement.classList.remove('cooldown-bar-fadeout');
    }, 400);
  }

  /**
   * Starts the update loop for animation
   */
  startUpdateLoop() {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
    }
    this.updateInterval = setInterval(() => {
      this.updateProgress();
      this.checkIfShouldHide();
    }, 50);
  }

  /**
   * Updates the fill bar width based on progress
   */
  updateProgress() {
    const progress = this.getProgress();
    this.fillElement.style.width = `${progress * 100}%`;
  }

  /**
   * Updates cooldown bar position by toggling a fixed CSS class
   * The bar will always be shown at the same position, regardless of character movement.
   */
  update() {
    if (!this.isActive) return;
    this.barElement.classList.add('cooldown-bar-fixed');
  }

  /**
   * Checks if cooldown bar should be hidden
   */
  checkIfShouldHide() {
    const elapsed = Date.now() - this.cooldownStartTime;
    if (elapsed > this.cooldownDuration + this.hideDelay) {
      this.hide();
    }
  }

  /**
   * Calculates current cooldown progress (0 to 1)
   * @returns {number} Progress value between 0 and 1
   */
  getProgress() {
    const elapsed = Date.now() - this.cooldownStartTime;
    return Math.min(elapsed / this.cooldownDuration, 1);
  }
}
