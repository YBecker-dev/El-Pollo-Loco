class StatusBarHealth extends StatusBar {
  IMAGES_HEALTH = [
    'img_pollo_locco/img/7_statusbars/1_statusbar/2_statusbar_health/green/0.png',
    'img_pollo_locco/img/7_statusbars/1_statusbar/2_statusbar_health/green/20.png',
    'img_pollo_locco/img/7_statusbars/1_statusbar/2_statusbar_health/green/40.png',
    'img_pollo_locco/img/7_statusbars/1_statusbar/2_statusbar_health/green/60.png',
    'img_pollo_locco/img/7_statusbars/1_statusbar/2_statusbar_health/green/80.png',
    'img_pollo_locco/img/7_statusbars/1_statusbar/2_statusbar_health/green/100.png',
  ];

  constructor() {
    super();
    this.loadImages(this.IMAGES_HEALTH);
    this.x = 20;
    this.y = 0;
    this.width = 200;
    this.height = 60;
    this.setPercentage(100);
  }

  setPercentage(percentage) {
    this.percentage = percentage;
    const path = this.IMAGES_HEALTH[this.resolveImageIndex(percentage)];
    this.img = this.imageCache[path];
  }
}
