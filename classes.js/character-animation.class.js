/**
 * Character Animation Manager
 * Verwaltet alle Animationen für den Character
 * @author Morteza Chinahkash
 * @version 1.0.0
 */

class CharacterAnimationManager {
  /**
   * Creates a new character animation manager
   * @param {Character} character - The character to manage animations for
   */

  constructor(character) {
    this.character = character;
    this.hasJumpedUp = false;
    this.hasJumpedDown = false;
    this.animationInterval = null;
  }

  /**
   * Verwaltet Character-Animationen
   */

  charAnimations() {
    if (this.shouldStopAnimations()) {
      this.character.audioManager.stopRunningSound();
      return;
    }
    this.handleMovementAnimations();
    this.resetJumpFlagsIfGrounded();
  }

  /**
   * Prüft ob Animationen gestoppt werden sollen
   */

  shouldStopAnimations() {
    return this.character.isHurt || this.character.isDeadState;
  }

  /**
   * Behandelt Bewegungsanimationen
   */

  handleMovementAnimations() {
    const bossIsEntering = this.character.world.level.boss?.movingIn;
    if (bossIsEntering) {
      this.handleBossEnteringAnimation();
    } else if (this.character.isAboveGround()) {
      this.handleJumpAnimation();
    } else if (this.isMoving()) {
      this.character.playAnimation(this.character.IMAGES_WALKING);
    } else {
      this.handleIdleAnimation();
    }
  }

  /**
   * Behandelt Animation während Boss-Eingang
   */

  handleBossEnteringAnimation() {
    this.character.audioManager.stopRunningSound();
    this.character.playAnimation(this.character.IMAGES_IDLE);
  }

  /**
   * Prüft ob Character sich bewegt
   */

  isMoving() {
    return this.character.world.keyboard.RIGHT || this.character.world.keyboard.LEFT;
  }

  /**
   * Behandelt Idle-Animationen
   */

  handleIdleAnimation() {
    const timeSinceLastMove = Date.now() - this.character.lastMovementTime;
    if (timeSinceLastMove >= this.character.idleThreshold) {
      this.character.playAnimation(this.character.IMAGES_IDLE_LONG);
    } else {
      this.character.playAnimation(this.character.IMAGES_IDLE);
    }
  }

  /**
   * Setzt Sprung-Flags zurück wenn am Boden
   */

  resetJumpFlagsIfGrounded() {
    if (!this.character.isAboveGround()) {
      this.hasJumpedUp = false;
      this.hasJumpedDown = false;
    }
  }

  /**
   * Verwaltet Sprunganimationen
   */

  handleJumpAnimation() {
    if (this.character.speedY > 0 && !this.hasJumpedUp) {
      this.playAnimationOnce(this.character.IMAGES_JUMP_UP);
      this.hasJumpedUp = true;
    } else if (this.character.speedY < 0 && this.hasJumpedUp && !this.hasJumpedDown) {
      this.playAnimationOnce(this.character.IMAGES_JUMP_DOWN);
      this.hasJumpedDown = true;
    }
  }

  /**
   * Spielt Animation einmalig ab
   */

  playAnimationOnce(images) {
    this.character.currentImage = 0;
    clearInterval(this.animationInterval);
    this.animationInterval = setInterval(() => {
      if (this.character.currentImage < images.length) {
        let path = images[this.character.currentImage];
        this.character.img = this.character.imageCache[path];
        this.character.currentImage++;
      } else {
        clearInterval(this.animationInterval);
      }
    }, 100);
  }

  /**
   * Startet Todesanimation
   */

  playDeadSequence() {
    this.character.isDeadState = true;
    this.character.currentImage = 0;
    let interval = setInterval(() => {
      if (this.character.currentImage < this.character.IMAGES_DEAD.length) {
        this.animateDeadSequence();
      } else {
        this.endDeadSequence(interval);
      }
    }, 100);
    this.character.audioManager.stopRunningSound();
  }

  /**
   * Animiert einzelnes Bild der Todessequenz
   */

  animateDeadSequence() {
    let path = this.character.IMAGES_DEAD[this.character.currentImage];
    this.character.img = this.character.imageCache[path];
    this.character.currentImage++;
  }

  /**
   * Beendet Todessequenz
   */

  endDeadSequence(interval) {
    clearInterval(interval);
    this.character.currentImage--;
    this.character.hasFullyDied = true;
  }
}
