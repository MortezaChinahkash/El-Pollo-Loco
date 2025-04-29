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
  acceleration = 0.5;
  

  applyGravity() {
    setInterval(() => {
      if (this.isAboveGround()) {
        this.y -= this.speedY;
        this.speedY -= this.acceleration;
      }
    }, 1000 / 60);
  }

  isAboveGround(){
    return this.y < 135
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

  moveRight() {
    console.log("moving right");
  }

  moveleft() {
    setInterval(() => {
      this.x -= this.speed;
    }, 1000 / 120);
  }
}
