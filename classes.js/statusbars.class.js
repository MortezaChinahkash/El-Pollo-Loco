class Statusbar extends DrawableObject {
  percentage = 100;
  type;
  maxValue = 100; 
  IMAGES = {};

  /**
   * Erstellt eine neue Statusleiste für verschiedene Spielwerte
   * @param {string} type - Typ der Statusleiste ('health', 'coins', 'bottles', 'endboss')
   * @param {Object} [linkedObject=null] - Objekt mit dem die Statusleiste synchronisiert wird
   * @param {number} [maxValue=100] - Maximaler Wert der Statusleiste
   */
  constructor(type, linkedObject = null, maxValue = 100) {
    super();
    this.type = type;
    this.maxValue = maxValue;
    this.initImages();
    this.loadImages(this.IMAGES[type]);
    this.setPercentage(maxValue);
    this.x = this.getInitialX();
    this.y = this.getInitialY();
    this.width = 200;
    this.height = 60;
    if (linkedObject) {
      this.startSyncWithObject(linkedObject);
    }  }

  /**
   * Initialisiert die Bildpfade für alle Statusleisten-Typen
   * Definiert für jeden Typ die entsprechenden Bilder für verschiedene Füllstände
   */
  initImages() {
    this.IMAGES = {
      ...this.getHealthBarImages(),
      ...this.getCoinBarImages(),
      ...this.getBottleBarImages(),
      ...this.getEndbossBarImages()
    };
  }

  /**
   * Liefert die Bildpfade für die Gesundheits-Statusleiste
   * @returns {Object} Gesundheitsleisten-Bildpfade
   */
  getHealthBarImages() {
    return {
      health: [
        "img/img_pollo_locco/img/7_statusbars/1_statusbar/2_statusbar_health/blue/0.png",
        "img/img_pollo_locco/img/7_statusbars/1_statusbar/2_statusbar_health/blue/20.png",
        "img/img_pollo_locco/img/7_statusbars/1_statusbar/2_statusbar_health/blue/40.png",
        "img/img_pollo_locco/img/7_statusbars/1_statusbar/2_statusbar_health/blue/60.png",
        "img/img_pollo_locco/img/7_statusbars/1_statusbar/2_statusbar_health/blue/80.png",
        "img/img_pollo_locco/img/7_statusbars/1_statusbar/2_statusbar_health/blue/100.png",
      ]
    };
  }

  /**
   * Liefert die Bildpfade für die Münzen-Statusleiste
   * @returns {Object} Münzleisten-Bildpfade
   */
  getCoinBarImages() {
    return {
      coins: [
        "img/img_pollo_locco/img/7_statusbars/1_statusbar/1_statusbar_coin/blue/0.png",
        "img/img_pollo_locco/img/7_statusbars/1_statusbar/1_statusbar_coin/blue/20.png",
        "img/img_pollo_locco/img/7_statusbars/1_statusbar/1_statusbar_coin/blue/40.png",
        "img/img_pollo_locco/img/7_statusbars/1_statusbar/1_statusbar_coin/blue/60.png",
        "img/img_pollo_locco/img/7_statusbars/1_statusbar/1_statusbar_coin/blue/80.png",
        "img/img_pollo_locco/img/7_statusbars/1_statusbar/1_statusbar_coin/blue/100.png",
      ]
    };
  }

  /**
   * Liefert die Bildpfade für die Flaschen-Statusleiste
   * @returns {Object} Flaschenleisten-Bildpfade
   */
  getBottleBarImages() {
    return {
      bottles: [
        "img/img_pollo_locco/img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/0.png",
        "img/img_pollo_locco/img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/20.png",
        "img/img_pollo_locco/img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/40.png",
        "img/img_pollo_locco/img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/60.png",
        "img/img_pollo_locco/img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/80.png",
        "img/img_pollo_locco/img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/100.png",
      ]
    };
  }

  /**
   * Liefert die Bildpfade für die Endboss-Statusleiste
   * @returns {Object} Endboss-Leisten-Bildpfade
   */
  getEndbossBarImages() {
    return {
      endboss: [
        "img/img_pollo_locco/img/7_statusbars/1_statusbar/2_statusbar_health/orange/0.png",
        "img/img_pollo_locco/img/7_statusbars/1_statusbar/2_statusbar_health/orange/20.png",
        "img/img_pollo_locco/img/7_statusbars/1_statusbar/2_statusbar_health/orange/40.png",
        "img/img_pollo_locco/img/7_statusbars/1_statusbar/2_statusbar_health/orange/60.png",
        "img/img_pollo_locco/img/7_statusbars/1_statusbar/2_statusbar_health/orange/80.png",
        "img/img_pollo_locco/img/7_statusbars/1_statusbar/2_statusbar_health/orange/100.png",
      ]
    };
  }

  /**
   * Startet die Synchronisation der Statusleiste mit einem verknüpften Objekt
   * Aktualisiert kontinuierlich die Anzeige basierend auf den Objektwerten
   * @param {Object} obj - Das Objekt mit dem synchronisiert werden soll
   */
  startSyncWithObject(obj) {
    setInterval(() => {
      const value = this.getLinkedValue(obj);
      this.setPercentage(value);

      if (this.type === "endboss") {
        this.updateEndbossBarPosition(obj);
      }
    }, 100);  }

  /**
   * Ermittelt den aktuellen Wert des verknüpften Objekts basierend auf dem Statusleisten-Typ
   * @param {Object} obj - Das verknüpfte Objekt
   * @returns {number} Der entsprechende Wert für die Statusleiste
   */
  getLinkedValue(obj) {
    let value = 0;
    if (this.type === "health" || this.type === "endboss") {
      value = obj.energy;
    } else if (this.type === "coins") {
      value = obj.coins;
    } else if (this.type === "bottles") {
      value = obj.bottles;
    }
    return value;  }

  /**
   * Aktualisiert die Position der Endboss-Statusleiste
   * Positioniert sie über dem Endboss und zentriert sie
   * @param {Endboss} obj - Der Endboss dessen Position verfolgt wird
   */
  updateEndbossBarPosition(obj) {
    this.x = obj.x + obj.width / 2 - this.width / 2;
    this.y = obj.y - 30;  }

  /**
   * Setzt den Prozentsatz der Statusleiste und aktualisiert das angezeigte Bild
   * @param {number} value - Der neue Wert für die Statusleiste
   */
  setPercentage(value) {
    const percent = Math.min(100, Math.round((value / this.maxValue) * 100));
    this.percentage = percent;
    const index = this.resolveImageIndex();
    const path = this.IMAGES[this.type][index];
    this.img = this.imageCache[path];  }

  /**
   * Ermittelt den Index des anzuzeigenden Bildes basierend auf dem Prozentsatz
   * @returns {number} Index des entsprechenden Bildes im IMAGES Array
   */
  resolveImageIndex() {
    if (this.percentage >= 100) return 5;
    if (this.percentage >= 80) return 4;
    if (this.percentage >= 60) return 3;
    if (this.percentage >= 30) return 2;
    if (this.percentage > 0) return 1;
    return 0;  }

  /**
   * Ermittelt die initiale X-Position basierend auf dem Statusleisten-Typ
   * @returns {number} X-Position für die Statusleiste
   */
  getInitialX() {
    switch (this.type) {
      case "coins":
        return 250;
      case "bottles":
        return 460;
      default:
        return 40;
    }  }

  /**
   * Gibt die initiale Y-Position für alle Statusleisten zurück
   * @returns {number} Y-Position (immer 0, da alle oben angezeigt werden)
   */
  getInitialY() {
    return 0;
  }
}
