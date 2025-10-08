class StatusBarEndboss extends StatusBar {
  IMAGES_ENDBOSS = [
    'img_pollo_locco/img/7_statusbars/2_statusbar_endboss/orange/orange0.png',
    'img_pollo_locco/img/7_statusbars/2_statusbar_endboss/orange/orange20.png',
    'img_pollo_locco/img/7_statusbars/2_statusbar_endboss/orange/orange40.png',
    'img_pollo_locco/img/7_statusbars/2_statusbar_endboss/orange/orange60.png',
    'img_pollo_locco/img/7_statusbars/2_statusbar_endboss/orange/orange80.png',
    'img_pollo_locco/img/7_statusbars/2_statusbar_endboss/orange/orange100.png',
  ];

  constructor() {
    super();
    this.loadImages(this.IMAGES_ENDBOSS);
    this.x = 500;
    this.y = 10;
    this.width = 200;
    this.height = 60;
    this.setPercentage(100);
  }

  setPercentage(percentage) {
    this.percentage = percentage;
    let path = this.IMAGES_ENDBOSS[this.resolveImageIndex(percentage)];
    this.img = this.imageCache[path];
  }
}