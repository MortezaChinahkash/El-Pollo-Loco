class Chicken extends movableObject {
  levelWidth;
  x;
  y;
  width;
  height;
  speed;
  energy = 100;
  damage;
  isVisible = true;
  offset = {
    top: 0,
    bottom: 0,
    left: 0,
    right: 0
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
    this.loadImage(
      "img/img_pollo_locco/img/3_enemies_chicken/chicken_normal/1_walk/1_w.png"
    );
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_DEAD);
    this.animate();
    setInterval(() => this.checkDeath(), 100);
  }
  checkDeath() {
    if (this.energy <= 0 && this.isVisible) {
      this.die();
    }
  }

  die() {
    this.offset.top =100 
    this.speed = 0;
    this.damage = 0;
    this.loadImage(this.IMAGES_DEAD);
    this.startBlinking();
    setTimeout(() => {
      this.x = -1000
      this.y = 1000
    }, 3000);
  }

  startBlinking() {
    let blinkTime = 0;
    const blinkInterval = setInterval(() => {
      this.isVisible = !this.isVisible;
      blinkTime += 300;
      if (blinkTime >= 3000) {
        clearInterval(blinkInterval);
        this.isVisible = false;
      }
    }, 300);
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
}
