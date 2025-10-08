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
      let img = new Image();
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
    let hitboxX = this.x + offsets.offsetX;
    let hitboxY = this.y + offsets.offsetYTop;
    let hitboxWidth = this.width - 2 * offsets.offsetX;
    let hitboxHeight = this.height - offsets.offsetYTop - offsets.offsetYBottom;

    ctx.beginPath();
    ctx.lineWidth = '5';
    ctx.strokeStyle = 'red';
    ctx.rect(hitboxX, hitboxY, hitboxWidth, hitboxHeight);
    ctx.stroke();
  }

  drawFrame(ctx) {
    if (this instanceof Chicken || this instanceof Character || this instanceof Coin) {
      let offsets;

      if (this instanceof Character) {
        offsets = this.getCharacterHitboxOffsets();
      } else if (this instanceof Chicken) {
        offsets = this.getChickenHitboxOffsets();
      } else if (this instanceof Coin) {
        offsets = this.getCoinHitboxOffsets();
      }

      this.drawHitbox(ctx, offsets);
    }
  }

  drawOtherDirectionReset(ctx) {
    if (this.img && this.img.complete) {
      ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    }
  }
}
