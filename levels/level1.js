/**
 * Global level1 instance.
 */
let level1;

/**
 * Initializes level1 with enemies, clouds, background layers, coins, and bottles.
 */
function initLevel() {
  level1 = new Level(
    createEnemies(),
    createClouds(),
    createBackgroundLayer1(),
    createBackgroundLayer2(),
    createCoins(),
    createBottles()
  );
}

/**
 * Creates and returns an array of chicken enemies and one endboss for level1.
 * @returns {Array} Array of enemy objects.
 */
function createEnemies() {
  const enemyTypes = ['normal', 'normal', 'normal', 'normal', 'small', 'small', 'small', 'small'];
  return enemyTypes.map((type) => new Chicken(type)).concat([new Endboss()]);
}

/**
 * Creates and returns an array of two cloud objects for level1.
 * @returns {Array} Array of cloud objects.
 */
function createClouds() {
  const clouds = [];
  for (let i = 0; i < 2; i++) {
    clouds.push(new Cloud());
  }
  return clouds;
}

/**
 * Creates and returns the first background layer for level1.
 * @returns {Array} Array of background objects.
 */
function createBackgroundLayer1() {
  const layerPaths = [
    'img_pollo_locco/img/5_background/layers/air.png',
    'img_pollo_locco/img/5_background/layers/3_third_layer/1.png',
    'img_pollo_locco/img/5_background/layers/2_second_layer/1.png',
    'img_pollo_locco/img/5_background/layers/1_first_layer/1.png',
  ];
  return layerPaths.map((path) => new BackgroundObject(path, 0));
}

/**
 * Creates and returns the second background layer for level1.
 * @returns {Array} Array of background objects.
 */
function createBackgroundLayer2() {
  const layerPaths = [
    'img_pollo_locco/img/5_background/layers/air.png',
    'img_pollo_locco/img/5_background/layers/3_third_layer/2.png',
    'img_pollo_locco/img/5_background/layers/2_second_layer/2.png',
    'img_pollo_locco/img/5_background/layers/1_first_layer/2.png',
  ];
  return layerPaths.map((path) => new BackgroundObject(path, 720));
}

/**
 * Creates and returns an array of coin objects positioned at specific locations for level1.
 * @returns {Array} Array of coin objects.
 */
function createCoins() {
  const coinPositions = [
    [300, 100],
    [500, 100],
    [700, 100],
    [900, 150],
    [1200, 100],
  ];
  return coinPositions.map(([x, y]) => new Coin(x, y));
}

/**
 * Creates and returns an array of bottle objects spaced evenly across level1.
 * @returns {Array} Array of bottle objects.
 */
function createBottles() {
  const bottles = [];
  for (let x = 400; x <= 2800; x += 200) {
    bottles.push(new Bottle(x, 350));
  }
  return bottles;
}
