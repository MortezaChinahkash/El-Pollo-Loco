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

  isColliding(mo) {
  const buffer = 5; // ← 5 Pixel Puffer, kannst du anpassen

  return (
    this.x + this.width - this.offset.right > mo.x + mo.offset.left + buffer &&
    this.x + this.offset.left < mo.x + mo.width - mo.offset.right - buffer &&
    this.y + this.height - this.offset.bottom > mo.y + mo.offset.top + buffer &&
    this.y + this.offset.top < mo.y + mo.height - mo.offset.bottom - buffer
  );
}

  hit(damage) {
    this.energy -= damage;
    if (this.energy < 0) {
      this.energy = 0;
    }
  }

  isDead() {
    return this.energy == 0;
  }

  isAboveGround() {
    if (this instanceof ThrowableObject) {
      return true;
    } else {
      return this.y < 135;
    }
  }

  playAnimation(images) {
    let i = this.currentImage % images.length;
    let path = images[i];
    this.img = this.imageCache[path];
    this.currentImage++;
  }

  playDeadAnimation() {
    this.playAnimation(this.IMAGES_DEAD);
    setTimeout(() => {}, this.IMAGES_DEAD.length * 10);
  }

  playHurtAnimation() {
    this.isHurt = true;
    this.playAnimation(this.IMAGES_HURT, false);
    setTimeout(() => {
      this.isHurt = false;
    }, this.IMAGES_HURT.length * 10);
  }

  moveRight() {
    this.x += this.speed;
    this.otherDirection = false;
  }

  moveLeft() {
    this.x -= this.speed;
  }

  jump() {
    this.speedY = 20;
  }
}
