/**
 * Character Input Manager
 * Manages all inputs for the character
 * @author Morteza Chinahkash
 * @version 1.0.0
 */
class CharacterInputManager {
  /**
   * Creates a new character input manager
   * @param {Character} character - The character to manage input for
   */
  constructor(character) {
    this.character = character;
  }

  /**
   * Processes user input and handles character movement
   */
  handleInput() {
    if (this.shouldIgnoreInput()) {
      this.character.audioManager.stopRunningSound();
      return;
    }
    const moved = this.processMovementInput();
    this.handleMovementEffects(moved);
    this.setCamLimit();
  }

  /**
   * Checks if input should be ignored
   */
  shouldIgnoreInput() {
    return this.character.isDeadState || this.character.world?.level?.boss?.movingIn;
  }

  /**
   * Processes all movement inputs
   * @returns {boolean} True if any movement occurred
   */
  processMovementInput() {
    let moved = false;
    if (this.moveRightWhenSpace()) moved = true;
    if (this.moveLeftWhenSpace()) moved = true;
    if (this.jumpWhenSpace()) moved = true;
    return moved;
  }

  /**
   * Handles effects during movement
   * @param {boolean} moved - Whether the character moved
   */
  handleMovementEffects(moved) {
    if (moved) {
      this.character.resetMovementTimer();
      this.character.audioManager.playOraleSound();
    }
    this.playRunningSound(moved);
  }

  /**
   * Moves character to the right
   * @returns {boolean} True if movement occurred
   */
  moveRightWhenSpace() {
    if (
      this.character.world.keyboard.RIGHT &&
      this.character.x < this.character.world.level.levelWidth - this.character.width
    ) {
      this.character.moveRight();
      return true;
    }
    return false;
  }

  /**
   * Moves character to the left
   * @returns {boolean} True if movement occurred
   */
  moveLeftWhenSpace() {
    if (this.character.world.keyboard.LEFT && this.character.x > 0) {
      this.character.moveLeft();
      this.character.otherDirection = true;
      return true;
    }
    return false;
  }

  /**
   * Makes character jump
   * @returns {boolean} True if jump occurred
   */
  jumpWhenSpace() {
    if (this.character.world.keyboard.UP && !this.character.isAboveGround()) {
      this.character.jump();
      return true;
    }
    return false;
  }

  /**
   * Manages running sound
   */
  playRunningSound(moved) {
    const isActuallyRunning =
      moved && !this.character.isAboveGround() && !this.character.isHurt && !this.character.isDeadState;
    if (isActuallyRunning) {
      this.character.audioManager.startRunningSound();
    } else {
      this.character.audioManager.stopRunningSound();
    }
  }

  /**
   * Sets camera limits
   */
  setCamLimit() {
    const camLimit = this.character.world.level.levelWidth - this.character.world.canvas.width;
    this.character.setLevelWidth(camLimit);
  }
}
