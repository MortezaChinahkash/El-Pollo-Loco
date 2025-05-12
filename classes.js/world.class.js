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
  throwableObject = [];
  lastBottleThrowTime = 0;

  constructor(canvas, keyboard, level) {
    this.ctx = canvas.getContext("2d");
    this.canvas = canvas;
    this.keyboard = keyboard;
    this.level = level;
    this.character = new Character();
    this.enemies = level.enemies;
    this.clouds = level.clouds;
    this.backgroundObjects = level.backgroundObjects;
    this.collectableItems = level.collectableItems || [];
    this.maxBottles = this.collectableItems.filter((i) => i.type === "bottle").length;
    this.END_BOSS_TRIGGER_X = this.level.levelWidth - 690;
    this.setWorld();
    this.healthBar = new Statusbar("health", this.character);
    this.coinBar = new Statusbar("coins", this.character, 10);
    this.bottleBar = new Statusbar("bottles", this.character, this.maxBottles);
    this.endbossBar = new Statusbar("endboss", this.level.boss);
    this.level.boss.world = this;
    this.draw();
    this.run();
    this.bottleSpawnCount = 0;
  }

  setWorld() {
    this.character.world = this;
    this.character.animate();
  }

  spawnNewBottle() {
  if (this.bottleSpawnCount >= this.maxBottles) return;
  const x = 300 + Math.random() * (this.level.levelWidth - 600);
  const y = 370;
  const newBottle = new CollectableItem(x, y, 'bottle');
  this.collectableItems.push(newBottle);
  this.bottleSpawnCount++;
}

  checkCollectableItems() {
    this.collectableItems.forEach((item) => {
      if (!item.collected && this.character.isColliding(item)) {
        item.collect(this.character);
      }
    });
    this.collectableItems = this.collectableItems.filter(
      (item) => !item.markedForDeletion
    );
  }

  checkThrowObjects() {
    const now = Date.now();
    if (this.character.world.level.boss?.movingIn) return;
    this.checkInventory(now)
    {
      this.character.bottles--; 
      this.lastBottleThrowTime = now;
    }
  }

  checkInventory(now){
    if (this.keyboard.SPACE && now - this.lastBottleThrowTime >= 1000 && this.character.bottles > 0 )
       {this.createNewBottle()}
  }

  createNewBottle(){
    this.character.resetMovementTimer();
      let bottle = new ThrowableObject(this.character.x + 100, this.character.y + 100);
      this.throwableObject.push(bottle);
  }

  run() {
    setInterval(() => {
      this.checkCollision();
      this.checkThrowObjects();
      this.bottleHitEnemy();
      this.activateBoss();
      this.checkCollectableItems();
      this.throwableObject = this.throwableObject.filter(
        (obj) => !obj.markedForDeletion
      );
      this.enemies = this.enemies.filter((enemy) => !enemy.markedForDeletion);
    }, 10);
  }

  activateBoss() {
    const boss = this.level.enemies.find((e) => e instanceof Endboss);
    if (
      boss &&
      !boss.activated &&
      this.character.x >= this.END_BOSS_TRIGGER_X
    ) {
      console.log("Boss aktiviert!");
      boss.activate();
    }
  }

  checkCollision() {
    if (this.character.isDeadState || this.character.isHurt) return;
    let jumpedOnEnemy = false;
    this.enemies.forEach((enemy) => {
      if (
        this.character.isColliding(enemy) &&
        this.character.isJumpingOn(enemy)
      ) {
        enemy.hit(this.character.damage);
        this.character.speedY = 15;
        jumpedOnEnemy = true;
      }
    });
    if (!jumpedOnEnemy) {
      const enemy = this.enemies.find((e) => this.character.isColliding(e));
    
      if (enemy && !(enemy instanceof Chicken && this.character.isJumpingOn(enemy))) {
        this.character.hit(enemy.damage);
      }
    }
  }

  bottleHitEnemy() {
    this.throwableObject.forEach((bottle) => {
      if (!bottle.isSplashing) {
        this.enemies.forEach((enemy) => {
          if (!enemy.markedForDeletion && bottle.isColliding(enemy)) {
            enemy.hit(this.character.damage);  
            bottle.splash();                   
          }
        });
      }
      this.respawnAfterSplash(bottle)
    });
  }

  respawnAfterSplash(bottle){
    if (bottle.isSplashing && !bottle.respawnHandled) {
      this.spawnNewBottle();
      bottle.respawnHandled = true;
    }
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.translate(this.camera_x, 0);
    this.drawBackgroundAndGameElements();
    this.ctx.translate(-this.camera_x, 0);
    this.drawHUDElements();
    this.ctx.translate(this.camera_x, 0);
    this.endbossBar.draw(this.ctx);
    this.ctx.translate(-this.camera_x, 0);
    requestAnimationFrame(() => this.draw());
  }

  drawBackgroundAndGameElements(){
    this.addObjectsToMap(this.level.backgroundObjects);
    this.addObjectsToMap(this.clouds);
    let sortedEnemies = [...this.enemies].sort((a, b) => a.y - b.y);
    this.addObjectsToMap(sortedEnemies);
    this.addObjectsToMap(this.throwableObject);
    this.addToMap(this.character);
    this.addObjectsToMap(this.collectableItems);
  }

  drawHUDElements(){
    this.healthBar.draw(this.ctx);
    this.coinBar.draw(this.ctx);
    this.bottleBar.draw(this.ctx);
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
