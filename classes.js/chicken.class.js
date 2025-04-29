class Chicken extends movableObject {
  levelWidth;
  x;
  y;
  width;
  height;
  speed;
  IMAGES_WALKING = [
    "img/img_pollo_locco/img/3_enemies_chicken/chicken_normal/1_walk/1_w.png",
    "img/img_pollo_locco/img/3_enemies_chicken/chicken_normal/1_walk/2_w.png",
    "img/img_pollo_locco/img/3_enemies_chicken/chicken_normal/1_walk/3_w.png",
  ];

  constructor(levelWidth) {
    super();
    this.levelWidth = levelWidth;
    this.x = 250 + Math.random() * (this.levelWidth - 250);
    this.y = this.randomHeight();
    this.setRandomSize();
    this.speed = 0.15 + Math.random() * 0.25;
    this.loadImage(
      "img/img_pollo_locco/img/3_enemies_chicken/chicken_normal/1_walk/1_w.png"
    );
    this.loadImages(this.IMAGES_WALKING);
    this.animate();
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
      this.moveLeft();
    }, 1000 / 120);
    setInterval(() => {
      this.playAnimation(this.IMAGES_WALKING);
    }, 170);
  }
}
