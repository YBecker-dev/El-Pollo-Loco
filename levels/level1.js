let level1;

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

function createEnemies() {
  return [
    new Chicken('normal'),
    new Chicken('normal'),
    new Chicken('normal'),
    new Chicken('small'),
    new Chicken('small'),
    new Endboss(),
  ];
}

function createClouds() {
  return [new Cloud(), new Cloud()];
}

function createBackgroundLayer1() {
  return [
    new BackgroundObject('img_pollo_locco/img/5_background/layers/air.png', 0),
    new BackgroundObject('img_pollo_locco/img/5_background/layers/3_third_layer/1.png', 0),
    new BackgroundObject('img_pollo_locco/img/5_background/layers/2_second_layer/1.png', 0),
    new BackgroundObject('img_pollo_locco/img/5_background/layers/1_first_layer/1.png', 0),
  ];
}

function createBackgroundLayer2() {
  return [
    new BackgroundObject('img_pollo_locco/img/5_background/layers/air.png', 720),
    new BackgroundObject('img_pollo_locco/img/5_background/layers/3_third_layer/2.png', 720),
    new BackgroundObject('img_pollo_locco/img/5_background/layers/2_second_layer/2.png', 720),
    new BackgroundObject('img_pollo_locco/img/5_background/layers/1_first_layer/2.png', 720),
  ];
}

function createCoins() {
  return [new Coin(300, 100), new Coin(500, 100), new Coin(700, 100), new Coin(900, 150), new Coin(1200, 100)];
}

function createBottles() {
  return [
    new Bottle(400, 350),
    new Bottle(600, 350),
    new Bottle(800, 350),
    new Bottle(1000, 350),
    new Bottle(1200, 350),
    new Bottle(1400, 350),
    new Bottle(1600, 350),
    new Bottle(1800, 350),
    new Bottle(2000, 350),
    new Bottle(2200, 350),
  ];
}
