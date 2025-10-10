/**
 * Status bar for displaying coin count
 * @class
 * @extends StatusBar
 */
class StatusBarCoin extends StatusBar {
  IMAGES_COIN = [
    'img_pollo_locco/img/7_statusbars/1_statusbar/1_statusbar_coin/green/0.png',
    'img_pollo_locco/img/7_statusbars/1_statusbar/1_statusbar_coin/green/20.png',
    'img_pollo_locco/img/7_statusbars/1_statusbar/1_statusbar_coin/green/40.png',
    'img_pollo_locco/img/7_statusbars/1_statusbar/1_statusbar_coin/green/60.png',
    'img_pollo_locco/img/7_statusbars/1_statusbar/1_statusbar_coin/green/80.png',
    'img_pollo_locco/img/7_statusbars/1_statusbar/1_statusbar_coin/green/100.png',
  ];

  /**
   * Creates an instance of StatusBarCoin
   * @constructor
   */
  constructor() {
    super();
    this.loadImages(this.IMAGES_COIN);
    this.x = 20;
    this.y = 50;
    this.width = 200;
    this.height = 60;
    this.setPercentage(0);
  }

  /**
   * Sets the percentage and updates the displayed image
   * @param {number} percentage - Coin count percentage (0-100)
   */
  setPercentage(percentage) {
    this.percentage = percentage;
    const path = this.IMAGES_COIN[this.resolveImageIndex(percentage)];
    this.img = this.imageCache[path];
  }
}
