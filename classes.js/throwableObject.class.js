class ThrowableObject extends movableObject {
  speedY;
  speedX;
  damage = 100 
  offset = {
    top: 20,
    bottom: 20,
    left: 30,
    right: 30
  };
  isSplashing = false 
  respawnHandled = false;
  flySoundInstance = null;

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
    this.x = x;
    this.y = y;
    this.width = 70;
    this.height = 90;
    this.acceleration = 1;
    this.loadImages(this.IMAGES_BOTTLE_ROTATION);
    this.loadImages(this.IMAGES_BOTTLE_SPLASH);
    this.loadImage(this.IMAGES_BOTTLE_ROTATION[0]);
    this.throw();
    this.opacity = 1;
  }

  applyGravity() {
    this.gravityInterval = setInterval(() => {
      if (this.isSplashing) return;
      this.y -= this.speedY;
      this.speedY -= this.acceleration;
      if (this.y >= 350) {
        this.y = 350;
        this.splash();
      }
    }, 1000 / 25);
  }

  throw() {
  this.speedY = 15;
  this.applyGravity();
  this.animateRotation();

  if (!soundManager.isMuted) {
    const sound = soundManager.sounds["throw_fly"];
    if (sound) {
      this.flySoundInstance = sound.cloneNode();
      this.flySoundInstance.loop = true; // Optional, wenn du möchtest, dass es durchgehend klingt
      this.flySoundInstance.volume = 0.3;
      this.flySoundInstance.play();
    }
  }

  this.moveXInterval = setInterval(() => {
    if (!this.isSplashing) {
      this.x += 5;
    }
  }, 20);
}

  animateRotation() {
    this.rotationInterval = setInterval(() => {
      this.playAnimation(this.IMAGES_BOTTLE_ROTATION);
    }, 100);
  }

  splash() {
  if (this.isSplashing) return;
  this.isSplashing = true;

  clearInterval(this.gravityInterval);
  clearInterval(this.rotationInterval);
  this.speedY = 0;
  this.speedX = 0;

  // ❌ Flug-Sound stoppen
  if (this.flySoundInstance) {
    this.flySoundInstance.pause();
    this.flySoundInstance.currentTime = 0;
    this.flySoundInstance = null;
  }

  // 💥 Splash-Sound abspielen
  if (!soundManager.isMuted) {
    soundManager.playSound("throw_splash", 0.4);
  }

  this.playAnimation(this.IMAGES_BOTTLE_SPLASH);
  setTimeout(() => this.fadeOutAndRemove(), 1000);
}
  

  draw(ctx) {
    if (this.img && this.opacity > 0) {
      ctx.save();
      ctx.globalAlpha = this.opacity;
      ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
      ctx.globalAlpha = 1.0;
      ctx.restore();
    }
  }

  fadeOutAndRemove() { 
    const targetY = 370;  
    const fallSpeed = 0.5;
    const fadeSpeed = 0.02;
  
    const fallInterval = setInterval(() => {
      if (this.y < targetY) {
        this.y += fallSpeed;
      } else {
        clearInterval(fallInterval); 
      }
    }, 1000 / 25);
  
    setTimeout(() => {
      const fadeInterval = setInterval(() => {
        this.opacity -= fadeSpeed;
  
        if (this.opacity <= 0) {
          this.opacity = 0;
          clearInterval(fadeInterval);
          this.markedForDeletion = true;
        }
      }, 1000 / 25);
    }, 1000);
  }
  
}
