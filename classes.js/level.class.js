class Level {
  enemies;
  clouds;
  backgroundObjects;
  levelWidth;
  levelNumber;

  constructor(enemies, clouds, backgroundObjects, levelWidth, levelNumber) {
    this.enemies = enemies;
    this.clouds = clouds;
    this.backgroundObjects = backgroundObjects;
    this.levelWidth = levelWidth;
    this.levelNumber = levelNumber;
    this.collectableItems = [];
    this.generateBackground();
    this.generateClouds();
    this.generateChickens();
    this.generateEndboss();
    this.generateCollectables();
  }

  generateBackground() {
    const backgrounds = this.defineBG();
    const segmentWidth = 719;
    let startX = -719;
    let blockIndex = 0;
    while (startX < this.levelWidth) {
      let block = backgrounds[blockIndex % backgrounds.length];
      this.backgroundObjects.push(new BackgroundObject(block.air, startX, 480));
      this.backgroundObjects.push(
        new BackgroundObject(block.third, startX, 400)
      );
      this.backgroundObjects.push(
        new BackgroundObject(block.second, startX, 400)
      );
      this.backgroundObjects.push(
        new BackgroundObject(block.first, startX, 400)
      );
      startX += segmentWidth;
      blockIndex++;
    }
  }

  defineBG() {
    return [
      {
        air: "img/img_pollo_locco/img/5_background/layers/air.png",
        third:
          "img/img_pollo_locco/img/5_background/layers/3_third_layer/1.png",
        second:
          "img/img_pollo_locco/img/5_background/layers/2_second_layer/1.png",
        first:
          "img/img_pollo_locco/img/5_background/layers/1_first_layer/1.png",
      },
      {
        air: "img/img_pollo_locco/img/5_background/layers/air.png",
        third:
          "img/img_pollo_locco/img/5_background/layers/3_third_layer/2.png",
        second:
          "img/img_pollo_locco/img/5_background/layers/2_second_layer/2.png",
        first:
          "img/img_pollo_locco/img/5_background/layers/1_first_layer/2.png",
      },
    ];
  }
  generateClouds() {
    const numberOfClouds = Math.floor(this.levelWidth / 700);
    for (let i = 0; i < numberOfClouds; i++) {
      this.clouds.push(new Cloud(this.levelWidth));
    }
  }

  generateChickens() {
    const minChicken = Math.floor(this.levelWidth / 500);
    const maxChicken = Math.floor(this.levelWidth / 200);
    const count =
      minChicken + Math.floor(Math.random() * (maxChicken - minChicken + 1));
    for (let i = 0; i < count; i++) {
      const chickenDamage = 1 + this.levelNumber * 0.1;
      const chicken = new Chicken(this.levelWidth, chickenDamage);
      this.enemies.push(chicken);
    }
  }

  generateEndboss() {
    const bossDamage = 5 + this.levelNumber * 1;
    const energy = 200 + this.levelNumber * 50;
    const boss = new Endboss(this.levelWidth, bossDamage, energy);
    this.boss = boss;
    this.enemies.push(boss);
  }

  generateCollectables() {
    const coinCount = Math.min(10, Math.floor(this.levelWidth / 400));
    const bottleCount = Math.ceil((200 + this.levelNumber * 50) / 100) + 2;

    // ➕ Coins an verschiedenen Höhen schwebend
    for (let i = 0; i < coinCount; i++) {
      const x = 300 + Math.random() * (this.levelWidth - 600);
      const y = 250 + Math.random() * 50; // schweben zwischen 250 und 300
      this.collectableItems.push(new CollectableItem(x, y, "coin"));
    }

    // ➕ Bottles am Boden verteilt
    for (let i = 0; i < bottleCount; i++) {
      const x = 300 + Math.random() * (this.levelWidth - 600);
      const y = 370; // Bodenhöhe
      this.collectableItems.push(new CollectableItem(x, y, "bottle"));
    }
  }
}
