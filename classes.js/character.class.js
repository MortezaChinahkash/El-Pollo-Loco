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

  IMAGES_JUMP_UP = [
  "img/img_pollo_locco/img/2_character_pepe/3_jump/J-31.png",
  "img/img_pollo_locco/img/2_character_pepe/3_jump/J-32.png",
  "img/img_pollo_locco/img/2_character_pepe/3_jump/J-33.png",
  "img/img_pollo_locco/img/2_character_pepe/3_jump/J-34.png",
  "img/img_pollo_locco/img/2_character_pepe/3_jump/J-35.png",
];

IMAGES_JUMP_DOWN = [
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

  /**
   * Erstellt eine neue Character-Instanz
   * Initialisiert alle Bilder, Eigenschaften und startet die Schwerkraft
   */
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
    this.loadImages(this.IMAGES_JUMP_UP);
    this.loadImages(this.IMAGES_JUMP_DOWN);
    this.loadImages(this.IMAGES_HURT);
    this.loadImages(this.IMAGES_DEAD);
    this.loadImages(this.IMAGES_IDLE);
      this.loadImages(this.IMAGES_IDLE_LONG);
      this.applyGravity();
    }

  /**
   * Verarbeitet Schaden am Charakter
   * Stoppt Laufgeräusche, reduziert Energie und startet Verletzungsanimation
   * @param {number} damage - Der zu verursachende Schaden
   * @param {Object} [source=null] - Die Quelle des Schadens (z.B. Endboss)
   */
  hit(damage, source=null) {
    if (this.isHurt) return; // Wenn bereits verletzt, ignorieren
    
    this.stopRunningSound(); // Laufgeräusch sofort stoppen bei Schaden
    
    this.energy -= damage; // Energie reduzieren
    if (this.energy < 0) this.energy = 0; // Nicht unter 0 gehen lassen
    this.isHurt = true; // Zustand setzen
    this.resetMovementTimer(); // Bewegungstimer zurücksetzen
    const now = Date.now();
    this.playHurtSoundWithCooldown(now); // Hurt-Sound abspielen
    this.playSoundWhenMeetingEndboss(now, source);
    this.playHurtAnimation(); // Verletzungs-Animation starten
    if (this.isDead()) {
      this.playDeadSequence(); // Todes-Sequenz starten
    }
    // Nach 1 Sekunde wieder verwundbar
    setTimeout(() => (this.isHurt = false), 1000);  }

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
   * Verwaltet alle Charakter-Animationen basierend auf dem aktuellen Zustand
   * Stoppt Laufgeräusche bei Verletzung, Boss-Eingang oder Tod
   */
  charAnimations() {
    if (this.isHurt || this.isDeadState) {
      this.stopRunningSound();
      return;
    }

    const bossIsEntering = this.world.level.boss?.movingIn;
    const now = Date.now();
    const timeSinceLastMove = now - this.lastMovementTime;

    if (bossIsEntering) {
      this.stopRunningSound(); // Laufsound sofort stoppen wenn Boss einläuft
      this.playAnimation(this.IMAGES_IDLE);
    } else if (this.isAboveGround()) {
      this.handleJumpAnimation();
    } else if (this.world.keyboard.RIGHT || this.world.keyboard.LEFT) {
      this.playAnimation(this.IMAGES_WALKING);
    } else if (timeSinceLastMove >= this.idleThreshold) {
      this.playAnimation(this.IMAGES_IDLE_LONG);
    } else {
      this.playAnimation(this.IMAGES_IDLE);
    }

    if (!this.isAboveGround()) {
      this.hasJumpedUp = false;
      this.hasJumpedDown = false;
    }  }

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
   * Verarbeitet Benutzereingaben und steuert Charakterbewegung
   * Stoppt Eingaben wenn Charakter tot ist oder Boss einläuft
   */
  handleInput() {
    if (this.isDeadState || this.world?.level?.boss?.movingIn) {
      this.stopRunningSound(); // Laufsound stoppen wenn Boss einläuft oder Charakter tot ist
      return; // Eingabe ignorieren, wenn Charakter tot ist oder Boss gerade einläuft
    }
    let moved = false;
    if (this.moveRightWhenSpace()) moved = true; // Bewegung nach rechts prüfen und ausführen
    if (this.moveLeftWhenSpace()) moved = true; // Bewegung nach links prüfen und ausführen
    if (this.jumpWhenSpace()) moved = true; // Springen prüfen und ausführen
    if (moved) {
      // Wenn sich der Charakter bewegt hat:
      this.resetMovementTimer(); // Idle-Timer zurücksetzen
      this.playOraleSound(); // "Orale!"-Sound abspielen
    }
   this.playRunningSound(moved);; // Laufgeräusch abspielen
    this.setCamLimit(); // Kamera innerhalb Level-Grenzen halten
    const camLimit = this.world.level.levelWidth - this.world.canvas.width;
    this.setLevelWidth(camLimit);  }

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
   * Startet das Laufgeräusch wenn es nicht bereits läuft
   * Erstellt eine neue Audio-Instanz und spielt sie in Schleife ab
   */
  startRunningSound() {
  if (
    !this.runningSoundInstance &&
    !this.isRunningSoundPlaying &&
    typeof soundManager !== "undefined" &&
    !soundManager.isMuted
  ) {
    const sound = soundManager.sounds["running"];
    if (sound && sound.paused) {
      this.runningSoundInstance = sound;
      sound.loop = true;
      sound.volume = 0.25;
      sound.currentTime = 0;

      sound.play()
        .then(() => {
          this.isRunningSoundPlaying = true;
        })
        .catch(() => {});
    }
  }
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
  jump() {
  this.speedY = 20;

  const now = Date.now();
  if (
    typeof soundManager !== "undefined" &&
    !soundManager.isMuted &&
    now - this.lastJumpSoundTime >= this.jumpSoundCooldown
  ) {
    const sound = soundManager.sounds["jump"];
    if (sound) {
      sound.pause();
      sound.currentTime = 0.3;
      sound.volume = 0.1;
      sound.play().catch(() => {});
      this.lastJumpSoundTime = now;
    }
  }
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
