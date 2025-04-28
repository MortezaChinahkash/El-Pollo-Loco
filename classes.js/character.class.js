class Character extends movableObject {
  x = 90;
  y = 135;
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
  world;
  constructor() {
    super().loadImage(
      "img/img_pollo_locco/img/2_character_pepe/2_walk/W-21.png"
    );
    this.loadImages(this.IMAGES_WALKING);
    this.animate();
  }

  animate() {
    setInterval(() => {
      if (this.world.keyboard.RIGHT) {
        this.x += this.speed;
      }
      if (this.world.keyboard.LEFT) {
        this.x -= this.speed;
      }
    }, 1000 / 60);

    setInterval(() => {
      if (this.world.keyboard.RIGHT || this.world.keyboard.LEFT) {
        let i = this.currentImage % this.IMAGES_WALKING.length;
        let path = this.IMAGES_WALKING[i];
        this.img = this.imageCache[path];
        this.currentImage++;
      }
    }, 100);
  }

  jump() {}
}
