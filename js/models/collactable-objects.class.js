class CollectableObject extends DrawableObject {
  collected = false;

  collect() {
    this.collected = true;
  }

  getHitboxOffsets() {
    return {
      xWidth: 0,
      yTop: 0,
      yBottom: 0,
    };
  }
}
