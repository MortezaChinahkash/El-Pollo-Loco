class World {
  character = new Character();
  enemies;
  canvas;
  clouds;
  keyboard;
  ctx;
  camera_x = 0;
  backgroundObjects;
  level;

  constructor(canvas, keyboard, level) {
    this.ctx = canvas.getContext("2d");
    this.canvas = canvas;
    this.keyboard = keyboard;
    this.level = level;
    this.enemies = level.enemies;
    this.clouds = level.clouds;
    this.backgroundObjects = level.backgroundObjects;
    this.setWorld();
    this.draw();
  }

  setWorld() {
    this.character.world = this;
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.translate(this.camera_x, 0);
    this.addObjectsToMap(this.level.backgroundObjects);
    this.addObjectsToMap(this.clouds);
    let sortedEnemies = [...this.enemies].sort((a, b) => a.y - b.y);
    this.addObjectsToMap(sortedEnemies);
    this.addToMap(this.character);
    this.ctx.translate(-this.camera_x, 0);
    requestAnimationFrame(() => this.draw());
  }

  addObjectsToMap(objects) {
    objects.forEach((o) => this.addToMap(o));
  }

  addToMap(mo) {
    if (mo.otherDirection) {
     
    }
    if (mo.img) {
      mo.draw(this.ctx);
      mo.drawCollisionFrame(this.ctx)
    }
    if (mo.otherDirection) {
      this.flipImageBack(mo)
    }
  }

  flipImage(mo){
    this.flipImage(mo)
    this.ctx.save();
    this.ctx.translate(mo.width, 0);
    this.ctx.scale(-1, 1);
    mo.x = mo.x * -1;
  }

  flipImageBack(mo){
    mo.x = mo.x * -1;
      this.ctx.restore();
  }
}
