/**
 * Game level class containing all level objects and layout
 * @class
 */
class Level {
  enemies;
  backgroundObjects;
  backgroundObjects2;
  clouds;
  coins;
  bottles;
  level_end_x = 720 * 5 + 100;

  /**
   * Creates an instance of Level
   * @constructor
   * @param {Array} enemies - Array of enemy objects
   * @param {Array} clouds - Array of cloud objects
   * @param {Array} backgroundObjects - Array of background layer 1 objects
   * @param {Array} backgroundObjects2 - Array of background layer 2 objects
   * @param {Array} coins - Array of coin objects
   * @param {Array} bottles - Array of bottle objects
   */
  constructor(enemies, clouds, backgroundObjects, backgroundObjects2, coins, bottles) {
    this.enemies = enemies;
    this.clouds = clouds;
    this.backgroundObjects = backgroundObjects;
    this.backgroundObjects2 = backgroundObjects2;
    this.coins = coins || [];
    this.bottles = bottles || [];
  }
}
