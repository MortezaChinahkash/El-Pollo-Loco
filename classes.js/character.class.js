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
  jumpSoundCooldown = 500;  hasPlayedOrale = false;
  runningSoundInstance = null;
  isRunningSoundPlaying = false;
  hasJumpedUp = false;
  hasJumpedDown = false;
  lastBossHitSoundTime = 0;
  ayDiosMioCooldown = 2000;


  world;
  camera_x = 0;

  /**
   * Erstellt eine neue Character-Instanz
   * Initialisiert alle Bilder, Eigenschaften und startet die Schwerkraft
   */
  constructor() {
    super();
    this.initializeImageArrays();
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
    this.loadImages(this.IMAGES_JUMP_UP);
    this.loadImages(this.IMAGES_JUMP_DOWN);
    this.loadImages(this.IMAGES_HURT);
    this.loadImages(this.IMAGES_DEAD);
    this.loadImages(this.IMAGES_IDLE);
    this.loadImages(this.IMAGES_IDLE_LONG);
    this.applyGravity();
  }

  /**
   * Initialisiert alle Bild-Arrays von der CharacterImages-Klasse
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
   * Verarbeitet Schaden am Charakter
   * @param {number} damage - Der zu verursachende Schaden
   * @param {Object} [source=null] - Die Quelle des Schadens (z.B. Endboss)
   */
  hit(damage, source=null) {
    if (this.isHurt) return;
    
    this.processHitDamage(damage);
    this.handleHitEffects();
    this.playHitSounds(Date.now(), source);
    this.checkForDeath();
  }

  /**
   * Verarbeitet den Schadenswert
   * @param {number} damage - Schadenswert
   */
  processHitDamage(damage) {
    this.stopRunningSound();
    this.energy -= damage;
    if (this.energy < 0) this.energy = 0;
  }

  /**
   * Behandelt Treffer-Effekte
   */
  handleHitEffects() {
    this.isHurt = true;
    this.resetMovementTimer();
    this.playHurtAnimation();
    setTimeout(() => (this.isHurt = false), 1000);
  }

  /**
   * Spielt Treffer-Sounds ab
   * @param {number} now - Aktueller Zeitstempel
   * @param {Object} source - Schadenquelle
   */
  playHitSounds(now, source) {
    this.playHurtSoundWithCooldown(now);
    this.playSoundWhenMeetingEndboss(now, source);
  }

  /**
   * Prüft auf Tod und startet Sequenz
   */
  checkForDeath() {
    if (this.isDead()) {
      this.playDeadSequence();
    }
  }

  /**
   * Spielt Verletzungsgeräusch mit Cooldown ab
   * Verhindert zu häufiges Abspielen des Hurt-Sounds
   * @param {number} now - Aktueller Zeitstempel
   */
  playHurtSoundWithCooldown(now) {
    if (
      typeof soundManager !== "undefined" &&
      now - this.lastHurtSoundTime >= this.hurtSoundCooldown
    ) {
      soundManager.playSound("hurt", 0.3);
      this.lastHurtSoundTime = now;
    }  }

  /**
   * Spielt speziellen Sound ab, wenn der Charakter vom Endboss getroffen wird
   * @param {number} now - Aktueller Zeitstempel
   * @param {Object} source - Die Schadenquelle
   */
  playSoundWhenMeetingEndboss(now, source) {
    if (
      typeof soundManager !== "undefined" &&
      source instanceof Endboss &&
      now - this.lastBossHitSoundTime >= this.ayDiosMioCooldown
    ) {
      soundManager.playSound("ay_dios_mio", 0.4);
      this.lastBossHitSoundTime = now;
    }  }

  /**
   * Prüft ob der Charakter auf einen Gegner springt
   * @param {Object} enemy - Der Gegner-Objekt
   * @returns {boolean} True wenn der Charakter auf den Gegner springt
   */
  isJumpingOn(enemy) {
    return (
      this.speedY < 0 &&
      this.y + this.height - this.offset.bottom < enemy.y + enemy.height
    );  }

  /**
   * Startet die Todessequenz des Charakters
   * Setzt Todes-Zustand, startet Animation und stoppt alle Geräusche
   */
  playDeadSequence() {
    this.isDeadState = true; // Zustand tot setzen
    this.currentImage = 0; // Startbild setzen
    let interval = setInterval(() => {
      if (this.currentImage < this.IMAGES_DEAD.length) {
        this.animateDeadSequence();
      } else {
        this.endDeadSequence(interval); // Animation beenden
      }
    }, 100);
      this.stopRunningSound(); // Laufgeräusch beenden;  
    }

  /**
   * Animiert ein einzelnes Bild der Todessequenz
   * Lädt das nächste Bild aus dem IMAGES_DEAD Array
   */
  animateDeadSequence() {
    let path = this.IMAGES_DEAD[this.currentImage];
    this.img = this.imageCache[path];
    this.currentImage++;  }

  /**
   * Beendet die Todessequenz
   * Stoppt den Animations-Interval und markiert den Charakter als vollständig tot
   * @param {number} interval - Der zu stoppende Interval
   */
  endDeadSequence(interval) {
    clearInterval(interval);
    this.currentImage--; // Letztes Bild behalten
    this.hasFullyDied = true; // Totenzustand abschließen  
  }

  /**
   * Startet die Hauptanimation des Charakters
   * Initialisiert Input-Handling und Charakter-Animationen
   */
  animate() {
    setInterval(() => this.handleInput(), 1000 / 60);
    setInterval(() => this.charAnimations(), 120);  }

  /**
   * Verwaltet Character-Animationen
   */
  charAnimations() {
    if (this.shouldStopAnimations()) {
      this.stopRunningSound();
      return;
    }

    this.handleMovementAnimations();
    this.resetJumpFlagsIfGrounded();
  }

  /**
   * Prüft ob Animationen gestoppt werden sollen
   * @returns {boolean} True wenn Animationen stoppen sollen
   */
  shouldStopAnimations() {
    return this.isHurt || this.isDeadState;
  }

  /**
   * Behandelt Bewegungsanimationen
   */
  handleMovementAnimations() {
    const bossIsEntering = this.world.level.boss?.movingIn;
    
    if (bossIsEntering) {
      this.handleBossEnteringAnimation();
    } else if (this.isAboveGround()) {
      this.handleJumpAnimation();
    } else if (this.isMoving()) {
      this.playAnimation(this.IMAGES_WALKING);
    } else {
      this.handleIdleAnimation();
    }
  }

  /**
   * Behandelt Animation während Boss-Eingang
   */
  handleBossEnteringAnimation() {
    this.stopRunningSound();
    this.playAnimation(this.IMAGES_IDLE);
  }

  /**
   * Prüft ob Character sich bewegt
   * @returns {boolean} True wenn Character sich bewegt
   */
  isMoving() {
    return this.world.keyboard.RIGHT || this.world.keyboard.LEFT;
  }

  /**
   * Behandelt Idle-Animationen
   */
  handleIdleAnimation() {
    const timeSinceLastMove = Date.now() - this.lastMovementTime;
    
    if (timeSinceLastMove >= this.idleThreshold) {
      this.playAnimation(this.IMAGES_IDLE_LONG);
    } else {
      this.playAnimation(this.IMAGES_IDLE);
    }
  }

  /**
   * Setzt Sprung-Flags zurück wenn am Boden
   */
  resetJumpFlagsIfGrounded() {
    if (!this.isAboveGround()) {
      this.hasJumpedUp = false;
      this.hasJumpedDown = false;
    }
  }

  /**
   * Verwaltet Sprunganimationen basierend auf der Sprunggeschwindigkeit
   * Wechselt zwischen Aufwärts- und Abwärts-Sprunganimationen
   */
  handleJumpAnimation() {
    if (this.speedY > 0 && !this.hasJumpedUp) {
      this.playAnimationOnce(this.IMAGES_JUMP_UP);
      this.hasJumpedUp = true;
    } else if (this.speedY < 0 && this.hasJumpedUp && !this.hasJumpedDown) {
      this.playAnimationOnce(this.IMAGES_JUMP_DOWN);
      this.hasJumpedDown = true;
    }  }

  /**
   * Spielt eine Animation einmalig ab
   * Verwendet für Sprunganimationen, die nur einmal durchlaufen sollen
   * @param {string[]} images - Array mit Bildpfaden für die Animation
   */
  playAnimationOnce(images) {
    this.currentImage = 0;
    clearInterval(this.animationInterval);

    this.animationInterval = setInterval(() => {
      if (this.currentImage < images.length) {
        let path = images[this.currentImage];
        this.img = this.imageCache[path];
        this.currentImage++;
      } else {
        clearInterval(this.animationInterval);
      }
    }, 100);  }

  /**
   * Verarbeitet Benutzereingaben
   */
  handleInput() {
    if (this.shouldIgnoreInput()) {
      this.stopRunningSound();
      return;
    }
    
    const moved = this.processMovementInput();
    this.handleMovementEffects(moved);
    this.setCamLimit();
  }

  /**
   * Prüft ob Eingaben ignoriert werden sollen
   * @returns {boolean} True wenn Eingaben ignoriert werden sollen
   */
  shouldIgnoreInput() {
    return this.isDeadState || this.world?.level?.boss?.movingIn;
  }

  /**
   * Verarbeitet alle Bewegungseingaben
   * @returns {boolean} True wenn Bewegung stattgefunden hat
   */
  processMovementInput() {
    let moved = false;
    
    if (this.moveRightWhenSpace()) moved = true;
    if (this.moveLeftWhenSpace()) moved = true;
    if (this.jumpWhenSpace()) moved = true;
    
    return moved;
  }

  /**
   * Behandelt Effekte bei Bewegung
   * @param {boolean} moved - Ob Bewegung stattgefunden hat
   */
  handleMovementEffects(moved) {
    if (moved) {
      this.resetMovementTimer();
      this.playOraleSound();
    }
    this.playRunningSound(moved);
  }

  /**
   * Bewegt den Charakter nach rechts wenn entsprechende Taste gedrückt wird
   * @returns {boolean} True wenn Bewegung nach rechts ausgeführt wurde
   */
  moveRightWhenSpace() {
    // Prüft ob nach rechts gegangen werden kann, führt Bewegung aus, gibt true zurück wenn bewegt
    if (
      this.world.keyboard.RIGHT &&
      this.x < this.world.level.levelWidth - this.width
    ) {
      this.moveRight();
      return true;
    }
    return false;  }

  /**
   * Bewegt den Charakter nach links wenn entsprechende Taste gedrückt wird
   * @returns {boolean} True wenn Bewegung nach links ausgeführt wurde
   */
  moveLeftWhenSpace() {
    // Prüft ob nach links gegangen werden kann, führt Bewegung aus, gibt true zurück wenn bewegt
    if (this.world.keyboard.LEFT && this.x > 0) {
      this.moveLeft();
      this.otherDirection = true;
      return true;
    }
    return false;  }

  /**
   * Lässt den Charakter springen wenn entsprechende Taste gedrückt wird
   * @returns {boolean} True wenn Sprung ausgeführt wurde
   */
  jumpWhenSpace() {
    // Prüft ob ein Sprung möglich ist und führt ihn aus, gibt true zurück wenn gesprungen
    if (this.world.keyboard.UP && !this.isAboveGround()) {
      this.jump();
      return true;
    }
    return false;  }

  /**
   * Spielt den "Orale!" Sound beim ersten Mal ab
   * Verhindert mehrfaches Abspielen des Sounds
   */
  playOraleSound() {
    if (!this.hasPlayedOrale && typeof soundManager !== "undefined") {
      soundManager.playSound("orale", 0.1);
      this.hasPlayedOrale = true;
    }  }

  /**
   * Verwaltet das Abspielen und Stoppen des Laufgeräuschs
   * @param {boolean} moved - Ob sich der Charakter bewegt hat
   */
  playRunningSound(moved) {
    // Laufgeräusch abspielen
    const isActuallyRunning =
      moved && !this.isAboveGround() && !this.isHurt && !this.isDeadState;

    if (isActuallyRunning) {
      this.startRunningSound();
    } else {
      this.stopRunningSound();
    }  }

  /**
   * Setzt die Kamera-Grenzen basierend auf der Level-Breite
   */
  setCamLimit() {
    // Kamera innerhalb Level-Grenzen halten
    const camLimit = this.world.level.levelWidth - this.world.canvas.width;
    this.setLevelWidth(camLimit);  }

  /**
   * Startet das Laufgeräusch
   */
  startRunningSound() {
    if (this.canStartRunningSound()) {
      this.initializeRunningSound();
    }
  }

  /**
   * Prüft ob Laufgeräusch gestartet werden kann
   * @returns {boolean} True wenn Sound gestartet werden kann
   */
  canStartRunningSound() {
    return !this.runningSoundInstance && 
           !this.isRunningSoundPlaying && 
           typeof soundManager !== "undefined" && 
           !soundManager.isMuted;
  }

  /**
   * Initialisiert das Laufgeräusch
   */
  initializeRunningSound() {
    const sound = soundManager.sounds["running"];
    if (sound && sound.paused) {
      this.setupRunningSoundProperties(sound);
      this.playRunningSoundWithCallback(sound);
    }
  }

  /**
   * Setzt Sound-Eigenschaften
   * @param {Object} sound - Sound-Objekt
   */
  setupRunningSoundProperties(sound) {
    this.runningSoundInstance = sound;
    sound.loop = true;
    sound.volume = 0.25;
    sound.currentTime = 0;
  }

  /**
   * Spielt Sound ab mit Callback
   * @param {Object} sound - Sound-Objekt
   */
  playRunningSoundWithCallback(sound) {
    sound.play()
      .then(() => {
        this.isRunningSoundPlaying = true;
      })
      .catch(() => {});
  }

  /**
   * Stoppt das Laufgeräusch und setzt alle Audio-Referenzen zurück
   */
  stopRunningSound() {
  if (this.runningSoundInstance) {
    if (!this.runningSoundInstance.paused) {
      this.runningSoundInstance.pause();
    }
    this.runningSoundInstance = null;
  }
  this.isRunningSoundPlaying = false;
}

  /**
   * Lässt den Charakter springen und spielt Sprunggeräusch ab
   * Setzt vertikale Geschwindigkeit und spielt Jump-Sound mit Cooldown
   */
  /**
   * Führt einen Sprung aus
   */
  jump() {
    this.executeJumpMechanics();
    this.playJumpSoundWithCooldown();
  }

  /**
   * Führt die Sprungmechanik aus
   */
  executeJumpMechanics() {
    this.speedY = 20;
  }

  /**
   * Spielt Sprunggeräusch mit Cooldown ab
   */
  playJumpSoundWithCooldown() {
    const now = Date.now();
    if (this.shouldPlayJumpSound(now)) {
      this.playJumpSoundWithSettings(now);
    }
  }

  /**
   * Prüft ob Sprunggeräusch abgespielt werden soll
   * @param {number} now - Aktueller Zeitstempel
   * @returns {boolean} True wenn Sound abgespielt werden soll
   */
  shouldPlayJumpSound(now) {
    return typeof soundManager !== "undefined" &&
           !soundManager.isMuted &&
           now - this.lastJumpSoundTime >= this.jumpSoundCooldown;
  }

  /**
   * Spielt Sprunggeräusch mit Einstellungen ab
   * @param {number} now - Aktueller Zeitstempel
   */
  playJumpSoundWithSettings(now) {
    const sound = soundManager.sounds["jump"];
    if (sound) {
      this.configureAndPlayJumpSound(sound, now);
    }
  }

  /**
   * Konfiguriert und spielt Sprunggeräusch ab
   * @param {Object} sound - Sound-Objekt
   * @param {number} now - Aktueller Zeitstempel
   */
  configureAndPlayJumpSound(sound, now) {
    sound.pause();
    sound.currentTime = 0.3;
    sound.volume = 0.1;
    sound.play().catch(() => {});
    this.lastJumpSoundTime = now;
  }

  /**
   * Setzt den Bewegungstimer zurück auf die aktuelle Zeit
   * @returns {number} Der aktuelle Zeitstempel
   */
  resetMovementTimer() {
    return (this.lastMovementTime = Date.now());  }

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
