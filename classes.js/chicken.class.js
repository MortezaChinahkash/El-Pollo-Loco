/**
 * Chicken-Klasse für die normalen Gegner-Hühner
 * Erweitert movableObject um KI-Verhalten und Zufallseigenschaften
 */

class Chicken extends movableObject {
  levelWidth;
  energy = 100;
  damage;
  isVisible = true;
  opacity = 1;
  markedForDeletion = false;
  offset = {
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  };
  IMAGES_WALKING = [
    "img/img_pollo_locco/img/3_enemies_chicken/chicken_normal/1_walk/1_w.png",
    "img/img_pollo_locco/img/3_enemies_chicken/chicken_normal/1_walk/2_w.png",
    "img/img_pollo_locco/img/3_enemies_chicken/chicken_normal/1_walk/3_w.png",
  ];
  IMAGES_DEAD = [
    "img/img_pollo_locco/img/3_enemies_chicken/chicken_normal/2_dead/dead.png",  ];
  /**
   * Erstellt ein neues Chicken mit zufälligen Eigenschaften
   * @param {number} levelWidth - Breite des Levels für Positionierung
   * @param {number} damage - Schaden den das Huhn verursacht
   */

  constructor(levelWidth, damage) {
    super();
    this.levelWidth = levelWidth;
    this.damage = damage;
    this.x = 250 + Math.random() * (this.levelWidth - 250);
    this.y = this.randomHeight();
    this.setRandomSize();
    this.speed = 0.15 + Math.random() * 0.25;
    this.markedForDeletion = false;
    this.loadImage(this.IMAGES_WALKING[0]);
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_DEAD);
    this.opacity = 1;
    this.animate();
    this.checkDeathLoop();
  }

  /**
   * Checks continuously if chicken should die and triggers death
   */

  checkDeathLoop() {
    setInterval(() => {
      if (this.energy <= 0 && !this.markedForDeletion) {
        this.die();
      }
    }, 100);
  }

  /**
   * Handles chicken death sequence and cleanup
   */

  die() {
    this.offset.top = 100;
    this.speed = 0;
    this.damage = 0;
    this.energy = 0;
    this.opacity = 1;
    this.loadImage(this.IMAGES_DEAD[0]);
    clearInterval(this.moveInterval);
    clearInterval(this.animationInterval);
    this.fadeOutAndRemove();
  }

  /**
   * Fades out the chicken and marks it for deletion
   */

  fadeOutAndRemove() {
    const fadeInterval = setInterval(() => {
      this.opacity -= 0.05;
      if (this.opacity <= 0) {
        this.opacity = 0;
        clearInterval(fadeInterval);
        this.markedForDeletion = true;
      }
    }, 100);
  }

  /**
   * Returns a random height for chicken placement
   * @returns {number} Random height value
   */

  randomHeight() {
    return 350 + Math.random() * 30;
  }

  /**
   * Sets random size and speed for chicken variation
   */

  setRandomSize() {
    const baseSize = 75;
    const variation = Math.random() * 20;
    this.width = baseSize + variation;
    this.height = baseSize + variation;
    this.speed = 0.25 - variation / 100;
  }

  /**
   * Starts movement and walking animation for the chicken
   */

  animate() {
    setInterval(() => {
      if (this.energy > 0) {
        this.moveLeft();
      }
    }, 1000 / 120);
    setInterval(() => {
      if (this.energy > 0) {
        this.playAnimation(this.IMAGES_WALKING);
      }
    }, 170);
  }

  /**
   * Draws the chicken with opacity support
   * @param {CanvasRenderingContext2D} ctx - The canvas rendering context
   */

  draw(ctx) {
    if (!this.img) return;
    ctx.save();
    ctx.globalAlpha = this.opacity ?? 1;
    ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    ctx.globalAlpha = 1;
    ctx.restore();
  }
}
