class Statusbar extends DrawableObject {
  percentage = 100;
  type;
  maxValue = 100; // z. B. Anzahl aller Flaschen auf der Map
  IMAGES = {};

  constructor(type, linkedObject = null, maxValue = 100) {
    super();
    this.type = type;
    this.maxValue = maxValue;
    this.initImages(); // ✅ stellt sicher, dass IMAGES geladen sind
    this.loadImages(this.IMAGES[type]);
    this.setPercentage(100);

    this.x = this.getInitialX();
    this.y = this.getInitialY();
    this.width = 200;
    this.height = 60;

    if (linkedObject) {
      this.startSyncWithObject(linkedObject);
    }
  }

  initImages() {
    this.IMAGES = {
      health: [
        "img/img_pollo_locco/img/7_statusbars/1_statusbar/2_statusbar_health/blue/0.png",
        "img/img_pollo_locco/img/7_statusbars/1_statusbar/2_statusbar_health/blue/20.png",
        "img/img_pollo_locco/img/7_statusbars/1_statusbar/2_statusbar_health/blue/40.png",
        "img/img_pollo_locco/img/7_statusbars/1_statusbar/2_statusbar_health/blue/60.png",
        "img/img_pollo_locco/img/7_statusbars/1_statusbar/2_statusbar_health/blue/80.png",
        "img/img_pollo_locco/img/7_statusbars/1_statusbar/2_statusbar_health/blue/100.png",
      ],
      coins: [
        "img/img_pollo_locco/img/7_statusbars/1_statusbar/1_statusbar_coin/blue/0.png",
        "img/img_pollo_locco/img/7_statusbars/1_statusbar/1_statusbar_coin/blue/20.png",
        "img/img_pollo_locco/img/7_statusbars/1_statusbar/1_statusbar_coin/blue/40.png",
        "img/img_pollo_locco/img/7_statusbars/1_statusbar/1_statusbar_coin/blue/60.png",
        "img/img_pollo_locco/img/7_statusbars/1_statusbar/1_statusbar_coin/blue/80.png",
        "img/img_pollo_locco/img/7_statusbars/1_statusbar/1_statusbar_coin/blue/100.png",
      ],
      bottles: [
        "img/img_pollo_locco/img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/0.png",
        "img/img_pollo_locco/img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/20.png",
        "img/img_pollo_locco/img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/40.png",
        "img/img_pollo_locco/img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/60.png",
        "img/img_pollo_locco/img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/80.png",
        "img/img_pollo_locco/img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/100.png",
      ],
      endboss: [
        "img/img_pollo_locco/img/7_statusbars/1_statusbar/2_statusbar_health/orange/0.png",
        "img/img_pollo_locco/img/7_statusbars/1_statusbar/2_statusbar_health/orange/20.png",
        "img/img_pollo_locco/img/7_statusbars/1_statusbar/2_statusbar_health/orange/40.png",
        "img/img_pollo_locco/img/7_statusbars/1_statusbar/2_statusbar_health/orange/60.png",
        "img/img_pollo_locco/img/7_statusbars/1_statusbar/2_statusbar_health/orange/80.png",
        "img/img_pollo_locco/img/7_statusbars/1_statusbar/2_statusbar_health/orange/100.png",
      ],
    };
  }

  startSyncWithObject(obj) {
    setInterval(() => {
      let value = 0;
      if (this.type === "health" || this.type === "endboss") {
        value = obj.energy;
      } else if (this.type === "coins") {
        value = obj.coins;
      } else if (this.type === "bottles") {
        value = obj.bottles;
      }

      this.setPercentage(value);

      if (this.type === "endboss") {
        this.x = obj.x + obj.width / 2 - this.width / 2;
        this.y = obj.y - 30;
      }
    }, 100);
  }

  setPercentage(value) {
    const percent = Math.min(100, Math.round((value / this.maxValue) * 100));
    this.percentage = percent;
    const index = this.resolveImageIndex();
    const path = this.IMAGES[this.type][index];
    this.img = this.imageCache[path];
  }

  resolveImageIndex() {
    if (this.percentage >= 100) return 5;
    if (this.percentage >= 80) return 4;
    if (this.percentage >= 60) return 3;
    if (this.percentage >= 30) return 2;
    if (this.percentage > 0) return 1;
    return 0;
  }

  getInitialX() {
    switch (this.type) {
      case "coins":
        return 250;
      case "bottles":
        return 460;
      default:
        return 40;
    }
  }

  getInitialY() {
    return 0;
  }
}
