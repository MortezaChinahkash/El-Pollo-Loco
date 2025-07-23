/**
 * Endboss-Klasse für den Hauptgegner des Spiels
 * Erweitert movableObject um komplexe KI, Angriffsverhalten und Animationen
 */
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
  speed = 25; // Reduziert von 35 auf 25 für bessere Balance

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
    "img/img_pollo_locco/img/4_enemie_boss_chicken/5_dead/G26.png",  ];

  /**
   * Erstellt einen neuen Endboss mit angegebenen Eigenschaften
   * @param {number} levelWidth - Breite des Levels für Positionierung
   * @param {number} damage - Schaden den der Boss verursacht
   * @param {number} energy - Lebenspunkte des Bosses
   */
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
    this.applyGravity();  }

  /**
   * Aktiviert den Endboss und startet dessen Eingangssequenz
   * Boss bewegt sich ins Level und beginnt dann mit Angriffen
   */
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

  /**
   * Starts the alert animation loop for the endboss
   */
  startAlert() {
    this.alertInterval = setInterval(() => {
      if (!this.isDead() && !this.isDying && !this.jumpingAttack && !this.isAnimating) {
        this.loopAnimation(this.IMAGES_ALERT, 160); // Erhöht von 120 auf 160 für langsamere Alert-Animation
      } else if (this.isDead() || this.isDying) {
        clearInterval(this.alertInterval);
        this.playDeathAnimation();
      }
    }, 400); // Erhöht von 300 auf 400 für weniger häufige Alert-Checks
  }

  /**
   * Starts the attack loop for boss behavior
   */
  startAttackLoop() {
    this.attackInterval = setInterval(() => {
      if (this.isDead() || this.isDying) {
        clearInterval(this.attackInterval);
        return;
      }
      const player = this.world?.character;
      if (!player) return;
      const distanceToPlayer = Math.abs(this.x - player.x);
      const step = 5; // Reduziert von 8 auf 5 für moderatere Geschwindigkeit
      this.otherDirection = player.x < this.x;
      this.walkToPlayer(player, step);
      this.handleJumpAttack(player, distanceToPlayer);
    }, 1000 / 45); // Reduziert von 60 auf 45 FPS für weniger aggressive Angriffe
  }

  /**
   * Makes the boss walk towards the player
   * @param {Object} player - The player character
   * @param {number} step - Movement step size
   */
  walkToPlayer(player,step){
    if (!this.jumpingAttack && !this.isAnimating) {
      this.loopAnimation(this.IMAGES_WALKING, 180); // Erhöht von 150 auf 180 für langsamere Animation
      if (this.x < player.x - 10) this.x += step;
      else if (this.x > player.x + 10) this.x -= step;
    }
  }

  /**
   * Handles jump attack behavior when player is close
   * @param {Object} player - The player character
   * @param {number} distanceToPlayer - Distance to the player
   */
  handleJumpAttack(player, distanceToPlayer) {
    if (distanceToPlayer < 180 && !this.jumpingAttack && !this.isAboveGround()) {
      this.jumpingAttack = true;
      this.speedY = 25;
      const direction = player.x < this.x ? -1 : 1;
      this.x += direction * 120; // Erhöht von 75 auf 120 für weitere Sprünge um den Character zu treffen
      this.playFullAnimationOnce(this.IMAGES_ATTACK, () => {
        this.jumpingAttack = false;
      }, 120);
    }
  }

  /**
   * Plays a looping animation with given images
   * @param {Array} images - Array of image paths for animation
   * @param {number} interval - Interval between animation frames
   */
  /**
   * Loops an animation continuously until stopped
   * @param {Array} images - Array of image paths for animation
   * @param {number} interval - Time between animation frames (default: 200)
   */
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

  /**
   * Plays a complete animation sequence once
   * @param {Array} images - Array of image paths for animation
   * @param {Function} onComplete - Callback function to execute when animation completes
   * @param {number} interval - Time between animation frames (default: 120)
   */
  playFullAnimationOnce(images, onComplete, interval = 120) {
    if (this.isAnimating) return;
    this.setupSingleAnimation(images, onComplete, interval);
  }

  /**
   * Bereitet eine einmalige Animation vor
   * @param {Array} images - Bilder für die Animation
   * @param {Function} onComplete - Callback nach Abschluss
   * @param {number} interval - Intervall zwischen Frames
   */
  setupSingleAnimation(images, onComplete, interval) {
    this.stopCurrentAnimation();
    this.isAnimating = true;
    this.currentImage = 0;
    this.startAnimationLoop(images, onComplete, interval);
  }

  /**
   * Startet den Animations-Loop
   * @param {Array} images - Bilder für die Animation  
   * @param {Function} onComplete - Callback nach Abschluss
   * @param {number} interval - Intervall zwischen Frames
   */
  startAnimationLoop(images, onComplete, interval) {
    this.currentAnimationInterval = setInterval(() => {
      if (this.currentImage < images.length) {
        const path = images[this.currentImage];
        this.img = this.imageCache[path];
        this.currentImage++;
      } else {
        this.finishAnimation(onComplete);
      }
    }, interval);
  }

  /**
   * Beendet die Animation und ruft Callback auf
   * @param {Function} onComplete - Callback nach Abschluss
   */
  finishAnimation(onComplete) {
    clearInterval(this.currentAnimationInterval);
    this.isAnimating = false;
    if (onComplete) onComplete();
  }

  /**
   * Stops the current animation and resets animation state
   */
  /**
   * Stops any currently running animation
   */
  stopCurrentAnimation() {
    if (this.currentAnimationInterval) {
      clearInterval(this.currentAnimationInterval);
      this.currentAnimationInterval = null;
    }
    this.isLooping = false;
    this.isAnimating = false;
  }

  /**
   * Plays the death animation sequence for the endboss
   */
  /**
   * Plays the death animation sequence for the boss
   */
  playDeathAnimation() {
    if (this.isDying) return;
    this.setupDeathAnimation();
    this.startDeathAnimationLoop();
  }

  /**
   * Bereitet die Tod-Animation vor
   */
  setupDeathAnimation() {
    this.isDying = true;
    this.currentImage = 0;
    this.opacity = 1;
    this.stopCurrentAnimation();
  }

  /**
   * Startet den Tod-Animations-Loop
   */
  startDeathAnimationLoop() {
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

  /**
   * Fades out the endboss and marks it for deletion
   */
  /**
   * Fades out the boss and marks it for deletion
   */
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

  /**
   * Draws the endboss with direction flipping and opacity support
   * @param {CanvasRenderingContext2D} ctx - The canvas rendering context
   */
  /**
   * Draws the boss with proper orientation and opacity
   * @param {CanvasRenderingContext2D} ctx - The canvas rendering context
   */
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
