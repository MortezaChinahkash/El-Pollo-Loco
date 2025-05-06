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
  statusbar = new Statusbar(this.character);
  throwableObject = [];

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
    this.run();
  }

  setWorld() {
    this.character.world = this;
  }

  run() {
    setInterval(() => {
      this.checkCollision();
      this.checkThrowObjects();
    }, 100);
  }

  checkThrowObjects() {
    if (this.keyboard.SPACE) {
      this.character.resetMovementTimer()
      let bottle = new ThrowableObject(this.character.x + 100, this.character.y + 100);
      this.throwableObject.push(bottle)
    }
  }

  checkCollision() {
    if (this.character.isDeadState || this.character.isHurt) return;
    let jumpedOnEnemy = false;
    this.enemies.forEach((enemy) => {
      if (this.character.isColliding(enemy) && this.character.isJumpingOn(enemy)) {
        enemy.hit(this.character.damage);
        this.character.speedY = 15;
        jumpedOnEnemy = true;
      }
    });
    if (!jumpedOnEnemy) {
      const enemy = this.enemies.find((e) => this.character.isColliding(e));
      if (enemy) {
        this.character.hit(enemy.damage);
      }
    }
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.translate(this.camera_x, 0);
    this.addObjectsToMap(this.level.backgroundObjects);
    this.addObjectsToMap(this.clouds);
    let sortedEnemies = [...this.enemies].sort((a, b) => a.y - b.y);
    this.addObjectsToMap(sortedEnemies);
    this.addObjectsToMap(this.throwableObject)
    this.addToMap(this.character);
    this.ctx.translate(-this.camera_x, 0);
    this.addToMap(this.statusbar);
    requestAnimationFrame(() => this.draw());
  }

  addObjectsToMap(objects) {
    objects.forEach((o) => this.addToMap(o));
  }

  addToMap(mo) {
    if (mo.otherDirection) this.flipImage(mo);
    if (mo.img) {
      mo.draw(this.ctx);
      mo.drawCollisionFrame(this.ctx);
    }
    if (mo.otherDirection) this.flipImageBack(mo);
  }

  flipImage(mo) {
    this.ctx.save();
    this.ctx.translate(mo.width, 0);
    this.ctx.scale(-1, 1);
    mo.x = mo.x * -1;
  }

  flipImageBack(mo) {
    mo.x = mo.x * -1;
    this.ctx.restore();
  }
}
