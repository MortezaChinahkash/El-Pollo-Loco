class Character extends movableObject {
  x = 90;
  y = 0;
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
  IMAGES_JUMPING_UP = [
    'img/img_pollo_locco/img/2_character_pepe/3_jump/J-31.png',
    'img/img_pollo_locco/img/2_character_pepe/3_jump/J-32.png',
    'img/img_pollo_locco/img/2_character_pepe/3_jump/J-33.png',
    'img/img_pollo_locco/img/2_character_pepe/3_jump/J-34.png',
    'img/img_pollo_locco/img/2_character_pepe/3_jump/J-35.png',
  ];
  IMAGES_JUMPING = [    
    'img/img_pollo_locco/img/2_character_pepe/3_jump/J-31.png',
    'img/img_pollo_locco/img/2_character_pepe/3_jump/J-32.png',
    'img/img_pollo_locco/img/2_character_pepe/3_jump/J-33.png',
    'img/img_pollo_locco/img/2_character_pepe/3_jump/J-34.png',
    'img/img_pollo_locco/img/2_character_pepe/3_jump/J-35.png',
    'img/img_pollo_locco/img/2_character_pepe/3_jump/J-36.png',
    'img/img_pollo_locco/img/2_character_pepe/3_jump/J-37.png',
    'img/img_pollo_locco/img/2_character_pepe/3_jump/J-38.png',
    'img/img_pollo_locco/img/2_character_pepe/3_jump/J-39.png',
  ];

  world;
  camera_x = 0;
  constructor() {
    super().loadImage(
      "img/img_pollo_locco/img/2_character_pepe/2_walk/W-21.png"
    );
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_JUMPING)
    this.animate();
    this.applyGravity();
  }

  animate() {
    setInterval(() => {
      if (this.world.keyboard.RIGHT && this.x < this.world.level.levelWidth - this.width) {
        
      }
      if (this.world.keyboard.LEFT && this.x > 0) {
        this.x -= this.speed;
        this.otherDirection = true;
      }
      if (this.world.keyboard.UP && !this.isAboveGround()){
        this.jump()
      }
      let camLimit = this.world.level.levelWidth - this.world.canvas.width;
      this.world.camera_x = Math.min(25, -(this.x - 25));
      this.world.camera_x = Math.max(this.world.camera_x, -camLimit);
    }, 1000 / 60);

    setInterval(() => {
      if (this.isAboveGround()) {
        this.playAnimation(this.IMAGES_JUMPING)
      } else { 
      if (this.world.keyboard.RIGHT || this.world.keyboard.LEFT) {
        this.playAnimation(this.IMAGES_WALKING);
      }
  }}, 120);
  }













}
