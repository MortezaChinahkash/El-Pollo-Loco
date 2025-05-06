class ThrowableObject extends movableObject {
  speedY;
  speedX;
  damage = 100 
  offset = {
    top: 10,
    bottom: 10,
    left: 25,
    right: 25
  };

  IMAGES_BOTTLE_ROTATION = [
    "img/img_pollo_locco/img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png",
    "img/img_pollo_locco/img/6_salsa_bottle/bottle_rotation/2_bottle_rotation.png",
    "img/img_pollo_locco/img/6_salsa_bottle/bottle_rotation/3_bottle_rotation.png",
    "img/img_pollo_locco/img/6_salsa_bottle/bottle_rotation/4_bottle_rotation.png"
  ];

  IMAGES_BOTTLE_SPLASH =[
    "img/img_pollo_locco/img/6_salsa_bottle/bottle_rotation/bottle_splash/1_bottle_splash.png",
    "img/img_pollo_locco/img/6_salsa_bottle/bottle_rotation/bottle_splash/2_bottle_splash.png",
    "img/img_pollo_locco/img/6_salsa_bottle/bottle_rotation/bottle_splash/3_bottle_splash.png",
    "img/img_pollo_locco/img/6_salsa_bottle/bottle_rotation/bottle_splash/4_bottle_splash.png",
    "img/img_pollo_locco/img/6_salsa_bottle/bottle_rotation/bottle_splash/5_bottle_splash.png",
    "img/img_pollo_locco/img/6_salsa_bottle/bottle_rotation/bottle_splash/6_bottle_splash.png"
  ];

  constructor(x, y) {
    super();
    this.x = x
    this.y = y
    this.width = 70
    this.height = 90 
    this.loadImages(this.IMAGES_BOTTLE_ROTATION)
    this.loadImages(this.IMAGES_BOTTLE_SPLASH)
    this.loadImage("img/img_pollo_locco/img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png");
    this.throw(100, 100)
  }

  throw() {

    this.speedY = 15
    this.applyGravity()
    setInterval(() => {
        this.x += 5
    }, 15);
  }
}
