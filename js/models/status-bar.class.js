class StatusBar extends DrawableObject {
  percentage = 100;

  resolveImageIndex(percentage) {
    this.percentage = percentage;
    return this.getImageIndexForPercentage();
  }

  getImageIndexForPercentage() {
    if (this.percentage === 100) return 5;
    if (this.percentage === 80) return 4;
    if (this.percentage === 60) return 3;
    if (this.percentage === 40) return 2;
    if (this.percentage === 20) return 1;
    return 0;
  }
}
