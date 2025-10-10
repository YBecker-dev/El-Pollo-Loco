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
  const thisBox = this.getHitbox();
  const moBox = this.getMoBox(mo);
  return (
    thisBox.x + thisBox.width > moBox.x &&
    thisBox.y + thisBox.height > moBox.y &&
    thisBox.x < moBox.x + moBox.width &&
    thisBox.y < moBox.y + moBox.height
  );
}

getMoBox(mo) {
  if (mo.getHitbox) {
    return mo.getHitbox();
  } else {
    return this.calculateHitbox(mo);
  }
}

calculateHitbox(obj) {
  const offsets = this.getOffsetsForObj(obj);
  return {
    x: obj.x + offsets.offsetX,
    y: obj.y + offsets.offsetYTop,
    width: obj.width - 2 * offsets.offsetX,
    height: obj.height - offsets.offsetYTop - offsets.offsetYBottom,
  };
}

getOffsetsForObj(obj) {
  if (obj.getHitboxOffsets) {
    return obj.getHitboxOffsets();
  } else {
    return { offsetX: 0, offsetYTop: 0, offsetYBottom: 0 };
  }
}

  getHitbox() {
    const offsets = this.getHitboxOffsets();
    return {
      x: this.x + offsets.offsetX,
      y: this.y + offsets.offsetYTop,
      width: this.width - 2 * offsets.offsetX,
      height: this.height - offsets.offsetYTop - offsets.offsetYBottom,
    };
  }

  getHitboxOffsets() {
    return {
      offsetX: this.width * 0.3,
      offsetYTop: this.height * 0.3,
      offsetYBottom: this.height * 0.3,
    };
  }
}
