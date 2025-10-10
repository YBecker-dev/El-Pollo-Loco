class MovableObject extends DrawableObject {
  speed = 0.15;
  OtherDirection = false;
  speedY = 0;
  acceleration = 2.5;
  energy = 100;
  isdead = false;
  lastHit = 0;
  gravityInterval;

  applyGravity() {
    this.gravityInterval = setInterval(() => {
      if (this.isAboveGround() || this.speedY > 0) {
        this.y -= this.speedY;
        this.speedY -= this.acceleration;

        if (this.y > 100 && !(this instanceof ThrowableObject)) {
          this.y = 100;
          this.speedY = 0;
        }
      }
    }, 1000 / 25);
  }

  pauseGravity() {
    clearStoppableInterval(this.gravityInterval);
  }

  resumeGravity() {
    this.applyGravity();
  }

  isAboveGround() {
    if (this instanceof ThrowableObject) {
      return true;
    } else {
      return this.y < 100;
    }
  }

  moveRight() {
    this.x += this.speed;
  }

  moveLeft() {
    this.x -= this.speed;
  }

  jump() {
    this.speedY = 30;
    soundManager.playSound('jump');
  }

  hit() {
    this.energy -= 5;
    if (this.energy <= 0) {
      this.energy = 0;
    } else {
      this.lastHit = new Date().getTime();
      soundManager.playSound('hurt');
    }
  }

  isHurt() {
    let timepassed = new Date().getTime() - this.lastHit;
    timepassed = timepassed / 1000;
    return timepassed < 1;
  }

  isdead() {
    return this.energy == 0;
  }

  playAnimation(images) {
    const index = this.currentImage % images.length;
    const path = images[index];
    this.img = this.imageCache[path];
    this.currentImage++;
  }

  drawOtherDirection(ctx) {
    ctx.save();
    ctx.translate(this.x + this.width, this.y);
    ctx.scale(-1, 1);
    ctx.drawImage(this.img, 0, 0, this.width, this.height);
    ctx.restore();
  }

  isColliding(mo) {
    return (
      this.x + this.width > mo.x && this.y + this.height > mo.y && this.x < mo.x + mo.width && this.y < mo.y + mo.height
    );
  }

  getHitboxOffsets() {
    return {
      offsetX: 0,
      offsetYTop: 0,
      offsetYBottom: 0,
    };
  }
}
