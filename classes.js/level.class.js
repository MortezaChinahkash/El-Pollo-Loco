class Level {
  enemies;
  clouds;
  backgroundObjects;
  levelWidth;
  levelNumber;
  /**
   * Erstellt ein neues Level mit allen Spielelementen
   * @param {Array} enemies - Array für Gegner
   * @param {Array} clouds - Array für Wolken
   * @param {Array} backgroundObjects - Array für Hintergrundobjekte
   * @param {number} levelWidth - Breite des Levels
   * @param {number} levelNumber - Nummer des Levels für Schwierigkeitsanpassung
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
    this.generateCollectables();  }
  /**
   * Generiert die Hintergrundobjekte für das gesamte Level
   * Erstellt mehrere Schichten von Hintergrundbildern über die gesamte Levelbreite
   */

  generateBackground() {
    const config = this.setupBackgroundConfig();
    this.createBackgroundLoop(config);
  }

  /**
   * Konfiguriert die Parameter für die Hintergrunderstellung
   * @returns {Object} Konfigurationsobjekt mit Hintergründen und Parametern
   */

  setupBackgroundConfig() {
    return {
      backgrounds: this.defineBG(),
      segmentWidth: 719,
      startX: -719,
      blockIndex: 0
    };
  }

  /**
   * Erstellt die Hintergrund-Loop über die gesamte Levelbreite
   * @param {Object} config - Konfiguration für Hintergrunderstellung
   */

  createBackgroundLoop(config) {
    while (config.startX < this.levelWidth) {
      let block = config.backgrounds[config.blockIndex % config.backgrounds.length];
      this.addBackgroundLayers(block, config.startX);
      config.startX += config.segmentWidth;
      config.blockIndex++;
    }
  }

  /**
   * Fügt alle Hintergrund-Schichten für eine Position hinzu
   * @param {Object} block - Hintergrund-Block mit allen Schichten
   * @param {number} x - X-Position für die Schichten
   */

  addBackgroundLayers(block, x) {
    this.backgroundObjects.push(new BackgroundObject(block.air, x, 480));
    this.backgroundObjects.push(new BackgroundObject(block.third, x, 400));
    this.backgroundObjects.push(new BackgroundObject(block.second, x, 400));
    this.backgroundObjects.push(new BackgroundObject(block.first, x, 400));
  }

  /**
   * Definiert die verfügbaren Hintergrund-Segmente
   * @returns {Array} Array mit Hintergrund-Konfigurationen für verschiedene Schichten
   */

  defineBG() {
    return [
      this.getBackgroundSet1(),
      this.getBackgroundSet2()
    ];
  }

  /**
   * Liefert das erste Hintergrund-Set
   * @returns {Object} Erstes Hintergrund-Set mit allen Schichten
   */

  getBackgroundSet1() {
    return {
      air: "img/img_pollo_locco/img/5_background/layers/air.png",
      third: "img/img_pollo_locco/img/5_background/layers/3_third_layer/1.png",
      second: "img/img_pollo_locco/img/5_background/layers/2_second_layer/1.png",
      first: "img/img_pollo_locco/img/5_background/layers/1_first_layer/1.png",
    };
  }

  /**
   * Liefert das zweite Hintergrund-Set
   * @returns {Object} Zweites Hintergrund-Set mit allen Schichten
   */

  getBackgroundSet2() {
    return {
      air: "img/img_pollo_locco/img/5_background/layers/air.png",
      third: "img/img_pollo_locco/img/5_background/layers/3_third_layer/2.png",
      second: "img/img_pollo_locco/img/5_background/layers/2_second_layer/2.png",
      first: "img/img_pollo_locco/img/5_background/layers/1_first_layer/2.png",
    };
  }

  /**
   * Generiert Wolken für das Level basierend auf der Levelbreite
   * Erstellt eine angemessene Anzahl von Wolken für die Hintergrundanimation
   */

  generateClouds() {
    const numberOfClouds = Math.floor(this.levelWidth / 700);
    for (let i = 0; i < numberOfClouds; i++) {
      this.clouds.push(new Cloud(this.levelWidth));
    }  }
  /**
   * Generiert Hühner-Gegner für das Level
   * Anzahl und Schaden basieren auf Levelgröße und -nummer
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
    }  }
  /**
   * Generiert den Endboss für das Level
   * Schaden und Energie werden basierend auf der Levelnummer skaliert
   */

  generateEndboss() {
    const bossDamage = 5 + this.levelNumber * 1;
    const energy = 200 + this.levelNumber * 50;
    const boss = new Endboss(this.levelWidth, bossDamage, energy);
    this.boss = boss;
    this.enemies.push(boss);  }
  /**
   * Generiert sammelbare Objekte (Münzen und Flaschen) für das Level
   * Anzahl basiert auf Levelgröße und -nummer für ausgewogenes Gameplay
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
