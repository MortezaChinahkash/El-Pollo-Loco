class Statusbar extends DrawableObject {
  percentage = 100;
  type;
  maxValue = 100;
  IMAGES = {};

  /**
   * Creates a new status bar for various game values
   * @param {string} type - Type of status bar ('health', 'coins', 'bottles', 'endboss')
   * @param {Object} [linkedObject=null] - Object with which the status bar is synchronized
   * @param {number} [maxValue=100] - Maximum value of the status bar
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
   * Initializes the image paths for all status bar types
   * Defines the corresponding images for different fill levels for each type
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
   * Returns the image paths for the health status bar
   * @returns {Object} Health bar image paths
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
   * Returns the image paths for the coin status bar
   * @returns {Object} Coin bar image paths
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
   * Returns the image paths for the bottle status bar
   * @returns {Object} Bottle bar image paths
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
   * Returns the image paths for the endboss status bar
   * @returns {Object} Endboss bar image paths
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
   * Starts synchronization of the status bar with a linked object
   * Continuously updates the display based on object values
   * @param {Object} obj - The object to synchronize with
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
   * Determines the current value of the linked object based on the status bar type
   * @param {Object} obj - The linked object
   * @returns {number} The corresponding value for the status bar
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
   * Updates the position of the endboss status bar
   * Positions it above the endboss and centers it
   * @param {Endboss} obj - The endboss whose position is tracked
   */
  updateEndbossBarPosition(obj) {
    this.x = obj.x + obj.width / 2 - this.width / 2;
    this.y = obj.y - 30;  }
  /**
   * Sets the percentage of the status bar and updates the displayed image
   * @param {number} value - The new value for the status bar
   */
  setPercentage(value) {
    const percent = Math.min(100, Math.round((value / this.maxValue) * 100));
    this.percentage = percent;
    const index = this.resolveImageIndex();
    const path = this.IMAGES[this.type][index];
    this.img = this.imageCache[path];  }
  /**
   * Determines the index of the image to display based on the percentage
   * @returns {number} Index of the corresponding image in the IMAGES array
   */
  resolveImageIndex() {
    if (this.percentage >= 100) return 5;
    if (this.percentage >= 80) return 4;
    if (this.percentage >= 60) return 3;
    if (this.percentage >= 30) return 2;
    if (this.percentage > 0) return 1;
    return 0;  }
  /**
   * Determines the initial X position based on the status bar type
   * @returns {number} X position for the status bar
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
   * Returns the initial Y position for all status bars
   * @returns {number} Y position (always 0, as all are displayed at top)
   */
  getInitialY() {
    return 0;
  }
}
