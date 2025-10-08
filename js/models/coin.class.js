class Coin extends CollectableObject {
  constructor() {
    super();
    this.loadImage('img_pollo_locco/img/8_coin/coin_1.png');
    this.x = 200 + Math.random() * 3250;
    this.y = 50;
    this.width = 175;
    this.height = 175;
  }

  isColliding(mo) {
    // Coin-Hitbox Offsets
    let thisOffsets = this.getHitboxOffsets();
    let moOffsets = mo.getHitboxOffsets();

    let thisX = this.x + thisOffsets.xWidth;
    let thisY = this.y + thisOffsets.yTop;
    let thisWidth = this.width - 2 * thisOffsets.xWidth;
    let thisHeight = this.height - thisOffsets.yTop - thisOffsets.yBottom;

    let moX = mo.x + moOffsets.xWidth;
    let moY = mo.y + moOffsets.yTop;
    let moWidth = mo.width - 2 * moOffsets.xWidth;
    let moHeight = mo.height - moOffsets.yTop - moOffsets.yBottom;

    return thisX + thisWidth > moX && thisY + thisHeight > moY && thisX < moX + moWidth && thisY < moY + moHeight;
  }

  getHitboxOffsets() {
    return {
      xWidth: this.width * 0.3,
      yTop: this.height * 0.3,
      yBottom: this.height * 0.3,
    };
  }
}
