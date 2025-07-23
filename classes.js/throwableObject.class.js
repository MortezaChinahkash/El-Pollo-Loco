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

  /**
   * Creates a new throwable object (bottle)
   * @param {number} x - Initial x position
   * @param {number} y - Initial y position
   */
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

  /**
   * Applies gravity physics to the throwable object
   */
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

  /**
   * Throws the object with physics and sound effects
   */
  throw() {
    this.initializeThrowPhysics();
    this.playThrowSound();
    this.startHorizontalMovement();
  }

  /**
   * Initialisiert die Wurf-Physik
   */
  initializeThrowPhysics() {
    this.speedY = 15;
    this.applyGravity();
    this.animateRotation();
  }

  /**
   * Spielt den Wurf-Sound ab
   */
  playThrowSound() {
    if (!soundManager.isMuted) {
      const sound = soundManager.sounds["throw_fly"];
      if (sound) {
        this.flySoundInstance = sound.cloneNode();
        this.flySoundInstance.loop = true;
        this.flySoundInstance.volume = 0.3;
        this.flySoundInstance.play();
      }
    }
  }

  /**
   * Startet die horizontale Bewegung
   */
  startHorizontalMovement() {
    this.moveXInterval = setInterval(() => {
      if (!this.isSplashing) {
        this.x += 5;
      }
    }, 20);
  }

  /**
   * Animates the rotation of the bottle during flight
   */
  animateRotation() {
    this.rotationInterval = setInterval(() => {
      this.playAnimation(this.IMAGES_BOTTLE_ROTATION);
    }, 100);
  }

  /**
   * Triggers splash effect when bottle hits ground or enemy
   */
  splash() {
    if (this.isSplashing) return;
    this.setSplashState();
    this.handleSplashSounds();
    this.startSplashAnimation();
  }

  /**
   * Setzt den Splash-Zustand und stoppt Bewegung
   */
  setSplashState() {
    this.isSplashing = true;
    clearInterval(this.gravityInterval);
    clearInterval(this.rotationInterval);
    this.speedY = 0;
    this.speedX = 0;
  }

  /**
   * Behandelt Sound-Effekte beim Splash
   */
  handleSplashSounds() {
    if (this.flySoundInstance) {
      this.flySoundInstance.pause();
      this.flySoundInstance.currentTime = 0;
      this.flySoundInstance = null;
    }

    if (!soundManager.isMuted) {
      soundManager.playSound("throw_splash", 0.4);
    }
  }

  /**
   * Startet die Splash-Animation und plant Entfernung
   */
  startSplashAnimation() {
    this.playAnimation(this.IMAGES_BOTTLE_SPLASH);
    setTimeout(() => this.fadeOutAndRemove(), 1000);
  }

  /**
   * Draws the throwable object with opacity support
   * @param {CanvasRenderingContext2D} ctx - The canvas rendering context
   */
  draw(ctx) {
    if (this.img && this.opacity > 0) {
      ctx.save();
      ctx.globalAlpha = this.opacity;
      ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
      ctx.globalAlpha = 1.0;
      ctx.restore();
    }
  }

  /**
   * Starts fade out animation and removes object from game
   */
  fadeOutAndRemove() {
    this.startFallingAnimation();
    this.scheduleOpacityFade();
  }

  /**
   * Startet die Fall-Animation des Objekts
   */
  startFallingAnimation() {
    const targetY = 370;
    const fallSpeed = 0.5;

    const fallInterval = setInterval(() => {
      if (this.y < targetY) {
        this.y += fallSpeed;
      } else {
        clearInterval(fallInterval);
      }
    }, 1000 / 25);
  }

  /**
   * Plant das Ausblenden des Objekts nach einer Verzögerung
   */
  scheduleOpacityFade() {
    setTimeout(() => {
      this.startOpacityFade();
    }, 1000);
  }

  /**
   * Startet das Ausblenden und markiert das Objekt zur Löschung
   */
  startOpacityFade() {
    const fadeSpeed = 0.02;

    const fadeInterval = setInterval(() => {
      this.opacity -= fadeSpeed;
      if (this.opacity <= 0) {
        this.opacity = 0;
        clearInterval(fadeInterval);
        this.markedForDeletion = true;
      }
    }, 1000 / 25);
  }
}
