class Level {
    enemies;
    backgroundObjects;
    backgroundObjects2;
    clouds;
    coins;
    bottles;
    level_end_x = 720 * 5 + 100;

    constructor(enemies, clouds, backgroundObjects, backgroundObjects2, coins, bottles) {
        this.enemies = enemies;
        this.clouds = clouds;
        this.backgroundObjects = backgroundObjects;
        this.backgroundObjects2 = backgroundObjects2;
        this.coins = coins || [];
        this.bottles = bottles || [];
    }
 }
