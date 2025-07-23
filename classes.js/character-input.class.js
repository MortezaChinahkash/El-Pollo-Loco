/**
 * Character Input Manager
 * Verwaltet alle Eingaben für den Character
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
   * Verarbeitet Benutzereingaben
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
   * Verarbeitet alle Bewegungseingaben
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
   */
  handleMovementEffects(moved) {
    if (moved) {
      this.character.resetMovementTimer();
      this.character.audioManager.playOraleSound();
    }
    this.playRunningSound(moved);
  }

  /**
   * Bewegt Character nach rechts
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
   * Bewegt Character nach links
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
   * Lässt Character springen
   */
  jumpWhenSpace() {
    if (this.character.world.keyboard.UP && !this.character.isAboveGround()) {
      this.character.jump();
      return true;
    }
    return false;
  }

  /**
   * Verwaltet Laufgeräusch
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
   * Setzt Kamera-Grenzen
   */
  setCamLimit() {
    const camLimit = this.character.world.level.levelWidth - this.character.world.canvas.width;
    this.character.setLevelWidth(camLimit);
  }
}
