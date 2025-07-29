/**
 * Base class for all movable objects in the game
 * Extends DrawableObject with movement, collision and physics
 */
class movableObject extends DrawableObject {
  speed = 1;
  otherDirection = false;
  speedY = 0;
  acceleration = 1.2;
  energy = 100;
  damage;
  offset = {
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  };

  /**
   * Applies gravity to the object
   * Continuously reduces vertical velocity
   */
  applyGravity() {
    setInterval(() => {
      if (this.isAboveGround() || this.speedY > 0) {
        this.y -= this.speedY;
        this.speedY -= this.acceleration;
      } else {
        this.speedY = 0;
      }
    }, 1000 / 25);
  }

  /**
   * Checks collision between this and another movable object
   * Uses offset values for precise collision detection
   * @param {movableObject} mo - The other movable object
   * @returns {boolean} True if collision is detected
   */
  isColliding(mo) {
    const buffer = 5;
    return (
      this.x + this.width - this.offset.right >
        mo.x + mo.offset.left + buffer &&
      this.x + this.offset.left < mo.x + mo.width - mo.offset.right - buffer &&
      this.y + this.height - this.offset.bottom >
        mo.y + mo.offset.top + buffer &&
      this.y + this.offset.top < mo.y + mo.height - mo.offset.bottom - buffer
    );
  }

  /**
   * Reduces the object's energy by the specified damage
   * @param {number} damage - The damage to be dealt
   */
  hit(damage) {
    this.energy -= damage;
    if (this.energy < 0) {
      this.energy = 0;
    }
  }

  /**
   * Checks if the object is dead (energy = 0)
   * @returns {boolean} True if the object is dead
   */
  isDead() {
    return this.energy == 0;
  }

  /**
   * Checks if the object is above ground level
   * @returns {boolean} True if object is above ground
   */
  isAboveGround() {
    if (this instanceof ThrowableObject) {
      return true;
    } else {
      return this.y < 135;
    }
  }

  /**
   * Plays an animation sequence from given images
   * @param {Array} images - Array of image paths for animation
   */
  playAnimation(images) {
    let i = this.currentImage % images.length;
    let path = images[i];
    this.img = this.imageCache[path];
    this.currentImage++;
  }

  /**
   * Plays the death animation sequence
   */
  playDeadAnimation() {
    this.playAnimation(this.IMAGES_DEAD);
    setTimeout(() => {}, this.IMAGES_DEAD.length * 10);
  }

  /**
   * Plays the hurt animation and sets hurt state temporarily
   */
  playHurtAnimation() {
    this.isHurt = true;
    this.playAnimation(this.IMAGES_HURT, false);
    setTimeout(() => {
      this.isHurt = false;
    }, this.IMAGES_HURT.length * 10);
  }

  /**
   * Moves the object to the right
   */
  moveRight() {
    this.x += this.speed;
    this.otherDirection = false;
  }

  /**
   * Moves the object to the left
   */
  moveLeft() {
    this.x -= this.speed;
  }

  /**
   * Makes the object jump by setting upward velocity
   */
  jump() {
    this.speedY = 20;
  }
}
