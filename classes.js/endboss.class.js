class Endboss extends movableObject {
    isDeadState = false;
    isDying = false;
    activated = false;
    movingIn = false;
    opacity = 1;
    markedForDeletion = false;
  
    offset = {
      top: 70,
      bottom: 20,
      left: 20,
      right: 20,
    };
  
    IMAGES_ALERT = [
      "img/img_pollo_locco/img/4_enemie_boss_chicken/2_alert/G5.png",
      "img/img_pollo_locco/img/4_enemie_boss_chicken/2_alert/G6.png",
      "img/img_pollo_locco/img/4_enemie_boss_chicken/2_alert/G7.png",
      "img/img_pollo_locco/img/4_enemie_boss_chicken/2_alert/G8.png",
      "img/img_pollo_locco/img/4_enemie_boss_chicken/2_alert/G9.png",
      "img/img_pollo_locco/img/4_enemie_boss_chicken/2_alert/G10.png",
      "img/img_pollo_locco/img/4_enemie_boss_chicken/2_alert/G11.png",
      "img/img_pollo_locco/img/4_enemie_boss_chicken/2_alert/G12.png",
    ];
  
    IMAGES_DEAD = [
      "img/img_pollo_locco/img/4_enemie_boss_chicken/4_hurt/G21.png",
      "img/img_pollo_locco/img/4_enemie_boss_chicken/4_hurt/G22.png",
      "img/img_pollo_locco/img/4_enemie_boss_chicken/4_hurt/G23.png",
      "img/img_pollo_locco/img/4_enemie_boss_chicken/5_dead/G24.png",
      "img/img_pollo_locco/img/4_enemie_boss_chicken/5_dead/G25.png",
      "img/img_pollo_locco/img/4_enemie_boss_chicken/5_dead/G26.png",
    ];
  
    constructor(levelWidth, damage, energy) {
      super();
      this.levelWidth = levelWidth;
      this.damage = damage;
      this.energy = energy;
      this.width = 250;
      this.height = 300;
      this.x = this.levelWidth + 300;
      this.y = 110;
      this.speed = 0.15 + Math.random() * 0.25;
  
      this.loadImage(this.IMAGES_ALERT[0]);
      this.loadImages(this.IMAGES_ALERT);
      this.loadImages(this.IMAGES_DEAD);
  
      this.applyGravity();
    }
  
    activate() {
      this.activated = true;
      this.movingIn = true;
  
      this.moveInInterval = setInterval(() => {
        if (this.x > this.levelWidth - this.width) {
          this.x -= 5;
        } else {
          clearInterval(this.moveInInterval);
          this.movingIn = false;
          this.startAlert();
        }
      }, 30);
    }
  
    startAlert() {
      if (this.alertInterval) return; // Verhindere mehrfach
      this.alertInterval = setInterval(() => {
        if (!this.isDead() && !this.isDying) {
          this.playAnimation(this.IMAGES_ALERT);
        } else {
          clearInterval(this.alertInterval);
          this.playDeathAnimation();
        }
      }, 150);
    }
  
    playDeathAnimation() {
      if (this.isDying) return;
      this.isDying = true;
      this.currentImage = 0;
      this.opacity = 1;
  
      this.deathInterval = setInterval(() => {
        if (this.currentImage < this.IMAGES_DEAD.length) {
          let path = this.IMAGES_DEAD[this.currentImage];
          this.img = this.imageCache[path];
          this.currentImage++;
        } else {
          clearInterval(this.deathInterval);
          this.fadeOutAndRemove();
        }
      }, 150);
    }
  
    fadeOutAndRemove() {
      const fadeInterval = setInterval(() => {
        this.opacity -= 0.02;
        if (this.opacity <= 0) {
          clearInterval(fadeInterval);
          this.opacity = 0;
          this.markedForDeletion = true;
        }
      }, 1000 / 25);
    }
  
    draw(ctx) {
      if (!this.img) return;
      ctx.save();
      ctx.globalAlpha = this.opacity;
      ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
      ctx.globalAlpha = 1;
      ctx.restore();
    }
  }
  