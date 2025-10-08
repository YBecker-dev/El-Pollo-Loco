class Bottle extends CollectableObject {
  constructor() {
    super();
    this.loadImage('img_pollo_locco/img/6_salsa_bottle/1_salsa_bottle_on_ground.png');
    this.x = 200 + Math.random() * 3250;
    this.y = 350;
    this.width = 80;
    this.height = 80;
  }
}

