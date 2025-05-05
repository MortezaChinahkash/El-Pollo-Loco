class movableObject {
  x = 90;
  y = 135;
  img;
  width = 150;
  height = 300;
  imageCache = [];
  currentImage = 0;
  speed = 1;
  otherDirection = false;
  speedY = 0;
  acceleration = 1.2;
  energy = 100;
  damage;

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

  draw(ctx) {
    ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
  }

  drawCollisionFrame(ctx) {
    if (this instanceof Character || this instanceof Chicken) {
      ctx.beginPath();
      ctx.lineWidth = "5";
      ctx.strokeStyle = "blue";
      ctx.rect(this.x, this.y, this.width, this.height);
      ctx.stroke();
    }
  }

  
  isColliding(mo) {
    return (
      this.x + this.width > mo.x &&
      this.y + this.height > mo.y &&
      this.x < mo.x &&
      this.y < mo.y + mo.height
    );
  }
  
  hit(damage) {
    this.energy -= damage;
    if (this.energy < 0){
      this.energy = 0 
    }
  }

  isDead(){
    return this.energy == 0;
  }

  isAboveGround() {
    return this.y < 135;
  }

  loadImage(path) {
    this.img = new Image();
    this.img.src = path;
  }

  loadImages(arr) {
    arr.forEach((path) => {
      let img = new Image();
      img.src = path;
      this.imageCache[path] = img;
    });
  }

  playAnimation(images) {
    let i = this.currentImage % images.length;
    let path = images[i];
    this.img = this.imageCache[path];
    this.currentImage++;
  }

  playDeadAnimation(){
    this.playAnimation(this.IMAGES_DEAD);
    setTimeout(() => {
    }, this.IMAGES_DEAD.length * 10); 
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
