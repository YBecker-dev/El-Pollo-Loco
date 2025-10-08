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
    let thisBox = this.getHitbox();
    let moBox = mo.getHitbox ? mo.getHitbox() : this.calculateHitbox(mo);
    return (
      thisBox.x + thisBox.width > moBox.x &&
      thisBox.y + thisBox.height > moBox.y &&
      thisBox.x < moBox.x + moBox.width &&
      thisBox.y < moBox.y + moBox.height
    );
  }

  calculateHitbox(obj) {
    let offsets = obj.getHitboxOffsets ? obj.getHitboxOffsets() : { xWidth: 0, yTop: 0, yBottom: 0 };
    return {
      x: obj.x + offsets.xWidth,
      y: obj.y + offsets.yTop,
      width: obj.width - 2 * offsets.xWidth,
      height: obj.height - offsets.yTop - offsets.yBottom,
    };
  }

  getHitbox() {
    let offsets = this.getHitboxOffsets();
    return {
      x: this.x + offsets.xWidth,
      y: this.y + offsets.yTop,
      width: this.width - 2 * offsets.xWidth,
      height: this.height - offsets.yTop - offsets.yBottom,
    };
  }

  getHitboxOffsets() {
    return {
      xWidth: this.width * 0.3,
      yTop: this.height * 0.3,
      yBottom: this.height * 0.3,
    };
  }
}
