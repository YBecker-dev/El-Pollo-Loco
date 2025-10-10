/**
 * Base status bar class for displaying game status information
 * @class
 * @extends DrawableObject
 */
class StatusBar extends DrawableObject {
  percentage = 100;

  /**
   * Resolves image index based on percentage value
   * @param {number} percentage - Current percentage value (0-100)
   * @returns {number} Image index for the status bar
   */
  resolveImageIndex(percentage) {
    this.percentage = percentage;
    return this.getImageIndexForPercentage();
  }

  /**
   * Gets image index based on current percentage
   * @returns {number} Image index (0-5)
   */
  getImageIndexForPercentage() {
    if (this.percentage === 100) return 5;
    if (this.percentage === 80) return 4;
    if (this.percentage === 60) return 3;
    if (this.percentage === 40) return 2;
    if (this.percentage === 20) return 1;
    return 0;
  }
}
