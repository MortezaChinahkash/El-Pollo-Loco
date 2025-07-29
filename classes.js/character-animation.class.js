/**
 * Character Animation Manager
 * Manages all animations for the character
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
   * Manages character animations
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
   * Checks if animations should be stopped
   */
  shouldStopAnimations() {
    return this.character.isHurt || this.character.isDeadState;
  }

  /**
   * Handles movement animations
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
   * Handles animation during boss entrance
   */
  handleBossEnteringAnimation() {
    this.character.audioManager.stopRunningSound();
    this.character.playAnimation(this.character.IMAGES_IDLE);
  }

  /**
   * Checks if character is moving
   */
  isMoving() {
    return this.character.world.keyboard.RIGHT || this.character.world.keyboard.LEFT;
  }

  /**
   * Handles idle animations
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
   * Resets jump flags when on ground
   */
  resetJumpFlagsIfGrounded() {
    if (!this.character.isAboveGround()) {
      this.hasJumpedUp = false;
      this.hasJumpedDown = false;
    }
  }

  /**
   * Manages jump animations
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
   * Plays animation once
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
   * Starts death animation
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
   * Animates single frame of death sequence
   */
  animateDeadSequence() {
    let path = this.character.IMAGES_DEAD[this.character.currentImage];
    this.character.img = this.character.imageCache[path];
    this.character.currentImage++;
  }

  /**
   * Ends death sequence
   */
  endDeadSequence(interval) {
    clearInterval(interval);
    this.character.currentImage--;
    this.character.hasFullyDied = true;
  }
}
