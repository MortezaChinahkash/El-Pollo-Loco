class Endboss extends movableObject {
  isDeadState = false;
  isDying = false;
  activated = false;
  movingIn = false;
  opacity = 1;
  markedForDeletion = false;
  offset = { top: 70, bottom: 20, left: 20, right: 20 };
  currentAnimationInterval = null;
  currentAnimationImages = [];
  jumpingAttack = false;
  isLooping = false;
  isAnimating = false;
  width = 250;
  height = 300;
  y = 110;
  speed = 20;

  IMAGES_WALKING = [
    "img/img_pollo_locco/img/4_enemie_boss_chicken/1_walk/G1.png",
    "img/img_pollo_locco/img/4_enemie_boss_chicken/1_walk/G2.png",
    "img/img_pollo_locco/img/4_enemie_boss_chicken/1_walk/G3.png",
    "img/img_pollo_locco/img/4_enemie_boss_chicken/1_walk/G4.png",
  ];

  IMAGES_ATTACK = [
    "img/img_pollo_locco/img/4_enemie_boss_chicken/3_attack/G13.png",
    "img/img_pollo_locco/img/4_enemie_boss_chicken/3_attack/G14.png",
    "img/img_pollo_locco/img/4_enemie_boss_chicken/3_attack/G15.png",
    "img/img_pollo_locco/img/4_enemie_boss_chicken/3_attack/G16.png",
    "img/img_pollo_locco/img/4_enemie_boss_chicken/3_attack/G17.png",
    "img/img_pollo_locco/img/4_enemie_boss_chicken/3_attack/G18.png",
    "img/img_pollo_locco/img/4_enemie_boss_chicken/3_attack/G19.png",
    "img/img_pollo_locco/img/4_enemie_boss_chicken/3_attack/G20.png",
  ];

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
    this.x = this.levelWidth + 300;
    this.loadImage(this.IMAGES_ALERT[0]);
    this.loadImages(this.IMAGES_ALERT);
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_ATTACK);
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
        this.startAttackLoop();
      }
    }, 30);
  }

  startAlert() {
    this.alertInterval = setInterval(() => {
      if (!this.isDead() && !this.isDying && !this.jumpingAttack && !this.isAnimating) {
        this.loopAnimation(this.IMAGES_ALERT, 200);
      } else if (this.isDead() || this.isDying) {
        clearInterval(this.alertInterval);
        this.playDeathAnimation();
      }
    }, 500);
  }

  startAttackLoop() {
    this.attackInterval = setInterval(() => {
      if (this.isDead() || this.isDying) {
        clearInterval(this.attackInterval);
        return;
      }
      const player = this.world?.character;
      if (!player) return;
      const distanceToPlayer = Math.abs(this.x - player.x);
      const step = 3;
      this.otherDirection = player.x < this.x;
      this.walkToPlayer(player, step);
      this.handleJumpAttack(player, distanceToPlayer);
    }, 1000 / 30);
  }

  walkToPlayer(player,step){
    if (!this.jumpingAttack && !this.isAnimating) {
      this.loopAnimation(this.IMAGES_WALKING, 200);
      if (this.x < player.x - 10) this.x += step;
      else if (this.x > player.x + 10) this.x -= step;
    }
  }

  handleJumpAttack(player, distanceToPlayer) {
    if (distanceToPlayer < 150 && !this.jumpingAttack && !this.isAboveGround()) {
      this.jumpingAttack = true;
      this.speedY = 20;
      const direction = player.x < this.x ? -1 : 1;
      this.x += direction * 50;
      this.playFullAnimationOnce(this.IMAGES_ATTACK, () => {
        this.jumpingAttack = false;
      }, 140);
    }
  }

  loopAnimation(images, interval = 200) {
    if (this.currentAnimationImages === images && this.isLooping) return;
    this.stopCurrentAnimation();
    this.currentAnimationImages = images;
    this.currentImage = 0;
    this.isLooping = true;
    this.currentAnimationInterval = setInterval(() => {
      const path = images[this.currentImage];
      this.img = this.imageCache[path];
      this.currentImage = (this.currentImage + 1) % images.length;
    }, interval);
  }

  playFullAnimationOnce(images, onComplete, interval = 120) {
    if (this.isAnimating) return;
    this.stopCurrentAnimation();
    this.isAnimating = true;
    this.currentImage = 0;
    this.currentAnimationInterval = setInterval(() => {
      if (this.currentImage < images.length) {
        const path = images[this.currentImage];
        this.img = this.imageCache[path];
        this.currentImage++;
      } else {
        clearInterval(this.currentAnimationInterval);
        this.isAnimating = false;
        if (onComplete) onComplete();
      }
    }, interval);
  }

  stopCurrentAnimation() {
    if (this.currentAnimationInterval) {
      clearInterval(this.currentAnimationInterval);
      this.currentAnimationInterval = null;
    }
    this.isLooping = false;
    this.isAnimating = false;
  }

  playDeathAnimation() {
    if (this.isDying) return;
    this.isDying = true;
    this.currentImage = 0;
    this.opacity = 1;
    this.stopCurrentAnimation();
    this.deathInterval = setInterval(() => {
      if (this.currentImage < this.IMAGES_DEAD.length) {
        const path = this.IMAGES_DEAD[this.currentImage];
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
    if (this.otherDirection) {
      ctx.translate(this.x + this.width, 0);
      ctx.scale(-1, 1);
      ctx.drawImage(this.img, 0, this.y, this.width, this.height);
    } else {
      ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    }
    ctx.globalAlpha = 1;
    ctx.restore();
  }
}
