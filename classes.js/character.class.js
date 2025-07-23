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
  world;
  camera_x = 0;

  /**
   * Creates a new Character instance
   * Initializes all images, properties and starts gravity
   */
  constructor() {
    super();
    this.initializeImageArrays();
    this.setupManagers();
    this.setupOffsets();
    this.setupInventory();
    this.loadAllImages();
    this.applyGravity();
  }

  /**
   * Sets up all manager classes
   */
  setupManagers() {
    this.audioManager = new CharacterAudioManager(this);
    this.animationManager = new CharacterAnimationManager(this);
    this.inputManager = new CharacterInputManager(this);
  }

  /**
   * Sets collision offsets
   */
  setupOffsets() {
    this.offset = {
      top: 120,
      bottom: 10,
      left: 20,
      right: 30,
    };
  }

  /**
   * Initializes inventory
   */
  setupInventory() {
    this.coins = 0;
    this.bottles = 0;
  }

  /**
   * Loads all character images
   */
  loadAllImages() {
    this.loadImage("img/img_pollo_locco/img/2_character_pepe/2_walk/W-21.png");
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_JUMP_UP);
    this.loadImages(this.IMAGES_JUMP_DOWN);
    this.loadImages(this.IMAGES_HURT);
    this.loadImages(this.IMAGES_DEAD);
    this.loadImages(this.IMAGES_IDLE);
    this.loadImages(this.IMAGES_IDLE_LONG);
  }

  /**
   * Initializes all image arrays from the CharacterImages class
   */
  initializeImageArrays() {
    this.IMAGES_IDLE_LONG = CharacterImages.IMAGES_IDLE_LONG;
    this.IMAGES_IDLE = CharacterImages.IMAGES_IDLE;
    this.IMAGES_WALKING = CharacterImages.IMAGES_WALKING;
    this.IMAGES_JUMP_UP = CharacterImages.IMAGES_JUMP_UP;
    this.IMAGES_JUMP_DOWN = CharacterImages.IMAGES_JUMP_DOWN;
    this.IMAGES_HURT = CharacterImages.IMAGES_HURT;
    this.IMAGES_DEAD = CharacterImages.IMAGES_DEAD;
  }

  /**
   * Processes damage to the character
   * @param {number} damage - The damage to be dealt
   * @param {Object} [source=null] - The source of damage (e.g. Endboss)
   */
  hit(damage, source=null) {
    if (this.isHurt) return;
    this.processHitDamage(damage);
    this.handleHitEffects();
    this.playHitSounds(Date.now(), source);
    this.checkForDeath();
  }

  /**
   * Processes the damage value
   * @param {number} damage - Damage value
   */
  processHitDamage(damage) {
    this.audioManager.stopRunningSound();
    this.energy -= damage;
    if (this.energy < 0) this.energy = 0;
  }

  /**
   * Handles hit effects
   */
  handleHitEffects() {
    this.isHurt = true;
    this.resetMovementTimer();
    this.playHurtAnimation();
    setTimeout(() => (this.isHurt = false), 1000);
  }

  /**
   * Plays hit sounds
   * @param {number} now - Current timestamp
   * @param {Object} source - Damage source
   */
  playHitSounds(now, source) {
    this.audioManager.playHurtSoundWithCooldown(now);
    this.audioManager.playSoundWhenMeetingEndboss(now, source);
  }

  /**
   * Checks for death and starts sequence
   */
  checkForDeath() {
    if (this.isDead()) {
      this.animationManager.playDeadSequence();
    }
  }

  /**
   * Checks if the character is jumping on an enemy
   * @param {Object} enemy - The enemy object
   * @returns {boolean} True if the character is jumping on the enemy
   */
  isJumpingOn(enemy) {
    return (
      this.speedY < 0 &&
      this.y + this.height - this.offset.bottom < enemy.y + enemy.height
    );
  }

  /**
   * Starts the main animation of the character
   * Initializes input handling and character animations
   */
  animate() {
    setInterval(() => this.inputManager.handleInput(), 1000 / 60);
    setInterval(() => this.animationManager.charAnimations(), 120);
  }

  /**
   * Führt einen Sprung aus
   */
  jump() {
    this.executeJumpMechanics();
    this.audioManager.playJumpSoundWithCooldown();
  }

  /**
   * Führt die Sprungmechanik aus
   */
  executeJumpMechanics() {
    this.speedY = 20;
  }

  /**
   * Setzt den Bewegungstimer zurück auf die aktuelle Zeit
   * @returns {number} Der aktuelle Zeitstempel
   */
  resetMovementTimer() {
    return (this.lastMovementTime = Date.now());
  }

  /**
   * Setzt die Kameraposition basierend auf Charakterposition und Level-Grenzen
   * Spezielle Behandlung wenn Boss einläuft
   * @param {number} camLimit - Die maximale Kamera-Position
   */
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
