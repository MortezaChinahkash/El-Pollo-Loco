class Character extends movableObject {
  x = 90;
  y = 60;
  width = 150;
  height = 300;
  speed = 5;
  IMAGES_WALKING = [
    "img/img_pollo_locco/img/2_character_pepe/2_walk/W-21.png",
    "img/img_pollo_locco/img/2_character_pepe/2_walk/W-22.png",
    "img/img_pollo_locco/img/2_character_pepe/2_walk/W-23.png",
    "img/img_pollo_locco/img/2_character_pepe/2_walk/W-24.png",
    "img/img_pollo_locco/img/2_character_pepe/2_walk/W-25.png",
    "img/img_pollo_locco/img/2_character_pepe/2_walk/W-26.png",
  ];
  IMAGES_JUMPING_UP = [];
  IMAGES_JUMPING_DOWN = [];

  world;
  camera_x = 0;
  constructor() {
    super().loadImage(
      "img/img_pollo_locco/img/2_character_pepe/2_walk/W-21.png"
    );
    this.loadImages(this.IMAGES_WALKING);
    this.animate();
    this.applyGravity();
  }

  animate() {
    setInterval(() => {
      if (
        this.world.keyboard.RIGHT &&
        this.x < this.world.level.levelWidth - this.width
      ) {
        this.x += this.speed;
        this.otherDirection = false;
      }
      if (this.world.keyboard.LEFT && this.x > 0) {
        this.x -= this.speed;
        this.otherDirection = true;
      }
      let camLimit = this.world.level.levelWidth - this.world.canvas.width;
      this.world.camera_x = Math.min(25, -(this.x - 25));
      this.world.camera_x = Math.max(this.world.camera_x, -camLimit);
    }, 1000 / 60);

    setInterval(() => {
      if (this.world.keyboard.RIGHT || this.world.keyboard.LEFT) {
        this.playAnimation(this.IMAGES_WALKING);
      }
    }, 100);
  }

  jump() {}
}
