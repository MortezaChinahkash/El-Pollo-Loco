class Level {
  enemies;
  clouds;
  backgroundObjects;
  levelWidth;
  levelNumber;

  /**
   * Creates a new level with all game elements
   * @param {Array} enemies - Array for enemies
   * @param {Array} clouds - Array for clouds
   * @param {Array} backgroundObjects - Array for background objects
   * @param {number} levelWidth - Width of the level
   * @param {number} levelNumber - Level number for difficulty adjustment
   */
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

  /**
   * Generates background objects for the entire level
   * Creates multiple layers of background images across the entire level width
   */
  generateBackground() {
    const config = this.setupBackgroundConfig();
    this.createBackgroundLoop(config);
  }

  /**
   * Configures parameters for background creation
   * @returns {Object} Configuration object with backgrounds and parameters
   */
  setupBackgroundConfig() {
    return {
      backgrounds: this.defineBG(),
      segmentWidth: 719,
      startX: -719,
      blockIndex: 0,
    };
  }

  /**
   * Creates the background loop across the entire level width
   * @param {Object} config - Configuration for background creation
   */
  createBackgroundLoop(config) {
    while (config.startX < this.levelWidth) {
      let block =
        config.backgrounds[config.blockIndex % config.backgrounds.length];
      this.addBackgroundLayers(block, config.startX);
      config.startX += config.segmentWidth;
      config.blockIndex++;
    }
  }

  /**
   * Adds all background layers for a position
   * @param {Object} block - Background block with all layers
   * @param {number} x - X position for the layers
   */
  addBackgroundLayers(block, x) {
    this.backgroundObjects.push(new BackgroundObject(block.air, x, 480));
    this.backgroundObjects.push(new BackgroundObject(block.third, x, 400));
    this.backgroundObjects.push(new BackgroundObject(block.second, x, 400));
    this.backgroundObjects.push(new BackgroundObject(block.first, x, 400));
  }

  /**
   * Defines the available background segments
   * @returns {Array} Array with background configurations for different layers
   */
  defineBG() {
    return [this.getBackgroundSet1(), this.getBackgroundSet2()];
  }

  /**
   * Returns the first background set
   * @returns {Object} First background set with all layers
   */
  getBackgroundSet1() {
    return {
      air: "img/img_pollo_locco/img/5_background/layers/air.png",
      third: "img/img_pollo_locco/img/5_background/layers/3_third_layer/1.png",
      second:
        "img/img_pollo_locco/img/5_background/layers/2_second_layer/1.png",
      first: "img/img_pollo_locco/img/5_background/layers/1_first_layer/1.png",
    };
  }

  /**
   * Returns the second background set
   * @returns {Object} Second background set with all layers
   */
  getBackgroundSet2() {
    return {
      air: "img/img_pollo_locco/img/5_background/layers/air.png",
      third: "img/img_pollo_locco/img/5_background/layers/3_third_layer/2.png",
      second:
        "img/img_pollo_locco/img/5_background/layers/2_second_layer/2.png",
      first: "img/img_pollo_locco/img/5_background/layers/1_first_layer/2.png",
    };
  }

  /**
   * Generates clouds for the level based on level width
   * Creates an appropriate number of clouds for background animation
   */
  generateClouds() {
    const numberOfClouds = Math.floor(this.levelWidth / 700);
    for (let i = 0; i < numberOfClouds; i++) {
      this.clouds.push(new Cloud(this.levelWidth));
    }
  }

  /**
   * Generates chicken enemies for the level
   * Count and damage are based on level size and number
   */
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

  /**
   * Generates the endboss for the level
   * Damage and energy are scaled based on level number
   */
  generateEndboss() {
    const bossDamage = 5 + this.levelNumber * 1;
    const energy = 200 + this.levelNumber * 50;
    const boss = new Endboss(this.levelWidth, bossDamage, energy);
    this.boss = boss;
    this.enemies.push(boss);
  }

  /**
   * Generates collectable objects (coins and bottles) for the level
   * Count is based on level size and number for balanced gameplay
   */
  generateCollectables() {
    const coinCount = Math.min(10, Math.floor(this.levelWidth / 400));
    const bottleCount = Math.ceil((200 + this.levelNumber * 50) / 100) + 2;
    for (let i = 0; i < coinCount; i++) {
      const x = 300 + Math.random() * (this.levelWidth - 600);
      const y = 250 + Math.random() * 50;
      this.collectableItems.push(new CollectableItem(x, y, "coin"));
    }
    for (let i = 0; i < bottleCount; i++) {
      const x = 300 + Math.random() * (this.levelWidth - 600);
      const y = 370;
      this.collectableItems.push(new CollectableItem(x, y, "bottle"));
    }
  }
}
