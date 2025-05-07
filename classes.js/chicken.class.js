class Chicken extends movableObject {
  levelWidth;
  energy = 100;
  damage;
  isVisible = true;
  opacity = 1; // ✅ Sichtbarkeit starten bei voll sichtbar
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
    "img/img_pollo_locco/img/3_enemies_chicken/chicken_normal/2_dead/dead.png",
  ];

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

  checkDeathLoop() {
    setInterval(() => {
      if (this.energy <= 0 && !this.markedForDeletion) {
        this.die();
      }
    }, 100);
  }

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

  randomHeight() {
    return 350 + Math.random() * 30;
  }

  setRandomSize() {
    const baseSize = 75;
    const variation = Math.random() * 20;
    this.width = baseSize + variation;
    this.height = baseSize + variation;
    this.speed = 0.25 - variation / 100;
  }

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

  draw(ctx) {
    if (!this.img) return;
    ctx.save();
    ctx.globalAlpha = this.opacity ?? 1;
    ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    ctx.globalAlpha = 1;
    ctx.restore();
  }
}