class StatusBarBottle extends StatusBar {
  IMAGES_BOTTLE = [
    'img_pollo_locco/img/7_statusbars/1_statusbar/3_statusbar_bottle/green/0.png',
    'img_pollo_locco/img/7_statusbars/1_statusbar/3_statusbar_bottle/green/20.png',
    'img_pollo_locco/img/7_statusbars/1_statusbar/3_statusbar_bottle/green/40.png',
    'img_pollo_locco/img/7_statusbars/1_statusbar/3_statusbar_bottle/green/60.png',
    'img_pollo_locco/img/7_statusbars/1_statusbar/3_statusbar_bottle/green/80.png',
    'img_pollo_locco/img/7_statusbars/1_statusbar/3_statusbar_bottle/green/100.png',
  ];

  constructor() {
    super();
    this.loadImages(this.IMAGES_BOTTLE);
    this.x = 20;
    this.y = 100;
    this.width = 200;
    this.height = 60;
    this.setPercentage(0);
  }

  setPercentage(percentage) {
    this.percentage = percentage;
    let path = this.IMAGES_BOTTLE[this.resolveImageIndex(percentage)];
    this.img = this.imageCache[path];
  }
}
