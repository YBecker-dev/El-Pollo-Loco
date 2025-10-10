class CollectableObject extends DrawableObject {
  collected = false;

  collect() {
    this.collected = true;
  }

  getHitboxOffsets() {
    return {
      offsetX: 0,
      offsetYTop: 0,
      offsetYBottom: 0,
    };
  }
}
