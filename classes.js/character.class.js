class Character extends movableObject {
  x = 90;
  y = 138;
  width = 150;
  height = 300;
  speed = 5;
  energy = 100;
  damage = 100;
  isHurt = false;
  isDeadState = false;
  lastMovementTime = Date.now();
  idleThreshold = 10000;
  invulnerable = false;
  hasFullyDied = false;
  lastHurtSoundTime = 0;
  hurtSoundCooldown = 1000;
  lastJumpSoundTime = 0;
  jumpSoundCooldown = 500;
  hasPlayedOrale = false;
  runningSoundInstance = null;
  isRunningSoundPlaying = false;

  IMAGES_IDLE_LONG = [
    "img/img_pollo_locco/img/2_character_pepe/1_idle/long_idle/I-11.png",
    "img/img_pollo_locco/img/2_character_pepe/1_idle/long_idle/I-12.png",
    "img/img_pollo_locco/img/2_character_pepe/1_idle/long_idle/I-13.png",
    "img/img_pollo_locco/img/2_character_pepe/1_idle/long_idle/I-14.png",
    "img/img_pollo_locco/img/2_character_pepe/1_idle/long_idle/I-15.png",
    "img/img_pollo_locco/img/2_character_pepe/1_idle/long_idle/I-16.png",
    "img/img_pollo_locco/img/2_character_pepe/1_idle/long_idle/I-17.png",
    "img/img_pollo_locco/img/2_character_pepe/1_idle/long_idle/I-18.png",
    "img/img_pollo_locco/img/2_character_pepe/1_idle/long_idle/I-19.png",
    "img/img_pollo_locco/img/2_character_pepe/1_idle/long_idle/I-20.png",
  ];

  IMAGES_IDLE = [
    "img/img_pollo_locco/img/2_character_pepe/1_idle/idle/I-1.png",
    "img/img_pollo_locco/img/2_character_pepe/1_idle/idle/I-2.png",
    "img/img_pollo_locco/img/2_character_pepe/1_idle/idle/I-3.png",
    "img/img_pollo_locco/img/2_character_pepe/1_idle/idle/I-4.png",
    "img/img_pollo_locco/img/2_character_pepe/1_idle/idle/I-5.png",
    "img/img_pollo_locco/img/2_character_pepe/1_idle/idle/I-6.png",
    "img/img_pollo_locco/img/2_character_pepe/1_idle/idle/I-7.png",
    "img/img_pollo_locco/img/2_character_pepe/1_idle/idle/I-8.png",
    "img/img_pollo_locco/img/2_character_pepe/1_idle/idle/I-9.png",
    "img/img_pollo_locco/img/2_character_pepe/1_idle/idle/I-10.png",
  ];

  IMAGES_WALKING = [
    "img/img_pollo_locco/img/2_character_pepe/2_walk/W-21.png",
    "img/img_pollo_locco/img/2_character_pepe/2_walk/W-22.png",
    "img/img_pollo_locco/img/2_character_pepe/2_walk/W-23.png",
    "img/img_pollo_locco/img/2_character_pepe/2_walk/W-24.png",
    "img/img_pollo_locco/img/2_character_pepe/2_walk/W-25.png",
    "img/img_pollo_locco/img/2_character_pepe/2_walk/W-26.png",
  ];

  IMAGES_JUMPING = [
    "img/img_pollo_locco/img/2_character_pepe/3_jump/J-31.png",
    "img/img_pollo_locco/img/2_character_pepe/3_jump/J-32.png",
    "img/img_pollo_locco/img/2_character_pepe/3_jump/J-33.png",
    "img/img_pollo_locco/img/2_character_pepe/3_jump/J-34.png",
    "img/img_pollo_locco/img/2_character_pepe/3_jump/J-35.png",
    "img/img_pollo_locco/img/2_character_pepe/3_jump/J-36.png",
    "img/img_pollo_locco/img/2_character_pepe/3_jump/J-37.png",
    "img/img_pollo_locco/img/2_character_pepe/3_jump/J-38.png",
    "img/img_pollo_locco/img/2_character_pepe/3_jump/J-39.png",
  ];

  IMAGES_HURT = [
    "img/img_pollo_locco/img/2_character_pepe/4_hurt/H-41.png",
    "img/img_pollo_locco/img/2_character_pepe/4_hurt/H-42.png",
    "img/img_pollo_locco/img/2_character_pepe/4_hurt/H-43.png",
  ];

  IMAGES_DEAD = [
    "img/img_pollo_locco/img/2_character_pepe/5_dead/D-51.png",
    "img/img_pollo_locco/img/2_character_pepe/5_dead/D-52.png",
    "img/img_pollo_locco/img/2_character_pepe/5_dead/D-53.png",
    "img/img_pollo_locco/img/2_character_pepe/5_dead/D-54.png",
    "img/img_pollo_locco/img/2_character_pepe/5_dead/D-55.png",
    "img/img_pollo_locco/img/2_character_pepe/5_dead/D-56.png",
    "img/img_pollo_locco/img/2_character_pepe/5_dead/D-57.png",
  ];

  world;
  camera_x = 0;

  constructor() {
    super();
    this.offset = {
      top: 120,
      bottom: 10,
      left: 20,
      right: 30,
    };
    this.coins = 0;
    this.bottles = 0;
    this.loadImage("img/img_pollo_locco/img/2_character_pepe/2_walk/W-21.png");
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_JUMPING);
    this.loadImages(this.IMAGES_HURT);
    this.loadImages(this.IMAGES_DEAD);
    this.loadImages(this.IMAGES_IDLE);
    this.loadImages(this.IMAGES_IDLE_LONG);
    this.applyGravity();
  }

  hit(damage, source = null) {
    if (this.isHurt) return;

    this.energy -= damage;
    if (this.energy < 0) this.energy = 0;
    this.isHurt = true;
    this.resetMovementTimer();

    const now = Date.now();
    if (
      typeof soundManager !== "undefined" &&
      now - this.lastHurtSoundTime >= this.hurtSoundCooldown
    ) {
      soundManager.playSound("hurt", 0.3);
      this.lastHurtSoundTime = now;
    }

    if (
      typeof soundManager !== "undefined" &&
      source instanceof Endboss &&
      now - this.lastBossHitSoundTime >= this.ayDiosMioCooldown
    ) {
      soundManager.playSound("ay_dios_mio", 0.4);
      this.lastBossHitSoundTime = now;
    }

    this.playHurtAnimation();
    if (this.isDead()) {
      this.playDeadSequence();
    }

    this.stopRunningSound();

    setTimeout(() => (this.isHurt = false), 1000);
  }

  isJumpingOn(enemy) {
    return (
      this.speedY < 0 &&
      this.y + this.height - this.offset.bottom < enemy.y + enemy.height
    );
  }

  playDeadSequence() {
    this.isDeadState = true;
    this.currentImage = 0;
    let interval = setInterval(() => {
      if (this.currentImage < this.IMAGES_DEAD.length) {
        let path = this.IMAGES_DEAD[this.currentImage];
        this.img = this.imageCache[path];
        this.currentImage++;
      } else {
        clearInterval(interval);
        this.currentImage--;
        this.hasFullyDied = true;
      }
    }, 100);
    this.stopRunningSound();
  }

  animate() {
    setInterval(() => this.handleInput(), 1000 / 60);
    setInterval(() => this.charAnimations(), 120);
  }

  charAnimations() {
    if (this.isHurt || this.isDeadState) {
      this.stopRunningSound(); // 🛑 Stoppt den Sound bei Schaden oder Tod zuverlässig
      return;
    }

    const bossIsEntering = this.world.level.boss?.movingIn;
    const now = Date.now();
    const timeSinceLastMove = now - this.lastMovementTime;
    this.playAnimation(
      bossIsEntering
        ? this.IMAGES_IDLE
        : this.isAboveGround()
        ? this.IMAGES_JUMPING
        : this.world.keyboard.RIGHT || this.world.keyboard.LEFT
        ? this.IMAGES_WALKING
        : timeSinceLastMove >= this.idleThreshold
        ? this.IMAGES_IDLE_LONG
        : this.IMAGES_IDLE
    );
  }

  handleInput() {
    if (this.isDeadState || this.world?.level?.boss?.movingIn) return;
    let moved = false;
    const isRunning =
      (this.world.keyboard.RIGHT &&
        this.x < this.world.level.levelWidth - this.width) ||
      (this.world.keyboard.LEFT && this.x > 0);

    if (
      this.world.keyboard.RIGHT &&
      this.x < this.world.level.levelWidth - this.width
    ) {
      this.moveRight();
      moved = true;
    }
    if (this.world.keyboard.LEFT && this.x > 0) {
      this.moveLeft();
      this.otherDirection = true;
      moved = true;
    }
    if (this.world.keyboard.UP && !this.isAboveGround()) {
      this.jump();
      moved = true;
    }
    if (moved) {
      this.resetMovementTimer();

      if (!this.hasPlayedOrale && typeof soundManager !== "undefined") {
        soundManager.playSound("orale", 0.1);
        this.hasPlayedOrale = true;
      }
    }

    const isActuallyRunning =
      moved && !this.isAboveGround() && !this.isHurt && !this.isDeadState;

    if (
      isActuallyRunning &&
      !this.isAboveGround() &&
      !this.isHurt &&
      !this.isDeadState
    ) {
      this.startRunningSound();
    } else {
      this.stopRunningSound();
    }
    const camLimit = this.world.level.levelWidth - this.world.canvas.width;
    this.setLevelWidth(camLimit);
  }

  startRunningSound() {
    if (
      !this.runningSoundInstance &&
      !this.isRunningSoundPlaying &&
      typeof soundManager !== "undefined" &&
      !soundManager.isMuted
    ) {
      const sound = soundManager.sounds["running"];
      if (sound) {
        const instance = sound.cloneNode();
        instance.loop = true;
        instance.volume = 0.25;
        this.isRunningSoundPlaying = true;
        instance
          .play()
          .then(() => {
            this.runningSoundInstance = instance;
          })
          .catch((e) => {
            console.warn("❗ Laufgeräusch konnte nicht gestartet werden:", e);
            this.isRunningSoundPlaying = false;
          });
      }
    }
  }

  stopRunningSound() {
    if (this.runningSoundInstance) {
      try {
        this.runningSoundInstance.pause();
      } catch (e) {
        console.warn("❗ Fehler beim Stoppen des Laufgeräuschs:", e);
      }
      this.runningSoundInstance = null;
    }
    this.isRunningSoundPlaying = false;
  }

  jump() {
    this.speedY = 20;

    const now = Date.now();
    if (
      typeof soundManager !== "undefined" &&
      !soundManager.isMuted &&
      now - this.lastJumpSoundTime >= this.jumpSoundCooldown
    ) {
      const audio = soundManager.sounds["jump"]?.cloneNode();
      if (audio) {
        audio.currentTime = 0.3;
        audio.volume = 0.1;
        audio.play();
        this.lastJumpSoundTime = now;
      }
    }
  }

  resetMovementTimer() {
    return (this.lastMovementTime = Date.now());
  }

  setLevelWidth(camLimit) {
    const boss = this.world.level.boss;
    if (boss?.movingIn) {
      this.world.camera_x = Math.min(0, -(this.x - 25));
    } else {
      this.world.camera_x = Math.min(25, -(this.x - 25));
      this.world.camera_x = Math.max(this.world.camera_x, -camLimit);
    }
  }
}
