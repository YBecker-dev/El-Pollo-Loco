let offsetX;
let offsetYTop;
let offsetYBottom;

class DrawableObject {
  img;
  imageCache = {};
  currentImage = 0;
  x = 100;
  y = 200;
  height = 250;
  width = 150;

  loadImage(path) {
    this.img = new Image();
    this.img.src = path;
  }

  loadImages(arr) {
    arr.forEach((path) => {
      const img = new Image();
      img.src = path;
      this.imageCache[path] = img;
    });
  }

  getCharacterHitboxOffsets() {
    return {
      offsetX: this.width * 0.1,
      offsetYTop: this.height * 0.35,
      offsetYBottom: this.height * 0.03,
    };
  }

  getChickenHitboxOffsets() {
    return {
      offsetX: this.width * 0,
      offsetYTop: this.height * 0.05,
      offsetYBottom: this.height * 0,
    };
  }

  getCoinHitboxOffsets() {
    return {
      offsetX: this.width * 0.3,
      offsetYTop: this.height * 0.3,
      offsetYBottom: this.height * 0.3,
    };
  }

  drawHitbox(ctx, offsets) {
    const hitboxX = this.x + offsets.offsetX;
    const hitboxY = this.y + offsets.offsetYTop;
    const hitboxWidth = this.width - 2 * offsets.offsetX;
    const hitboxHeight = this.height - offsets.offsetYTop - offsets.offsetYBottom;

    ctx.beginPath();
    ctx.lineWidth = '5';
    ctx.strokeStyle = 'red';
    ctx.rect(hitboxX, hitboxY, hitboxWidth, hitboxHeight);
    ctx.stroke();
  }

  drawFrame(ctx) {
    if (this.shouldDrawHitbox()) {
      const offsets = this.getHitboxOffsets();
      this.drawHitbox(ctx, offsets);
    }
  }

  shouldDrawHitbox() {
    return this instanceof Chicken || this instanceof Character || this instanceof Coin;
  }

  getHitboxOffsets() {
    if (this instanceof Character) {
      return this.getCharacterHitboxOffsets();
    } else if (this instanceof Chicken) {
      return this.getChickenHitboxOffsets();
    } else if (this instanceof Coin) {
      return this.getCoinHitboxOffsets();
    }
  }

  drawOtherDirectionReset(ctx) {
    if (this.img && this.img.complete) {
      ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    }
  }
}
