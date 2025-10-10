class Cloud extends MovableObject {
  y = 20;
  width = 500;
  height = 250;
  movementInterval;

  constructor() {
    super();
    this.loadImage('img_pollo_locco/img/5_background/layers/4_clouds/1.png');
    this.x = Math.random() * 500;
    this.animate();
  }

  animate() {
    this.moveLeft();
  }

  moveLeft() {
    this.movementInterval = setStoppableInterval(() => {
      this.x -= this.speed;
    }, 1000 / 144);
  }

  pauseAnimations() {
    clearStoppableInterval(this.movementInterval);
  }

  resumeAnimations() {
    this.moveLeft();
  }
}
