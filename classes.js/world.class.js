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
  gameWon = false;
  gameOver = false;

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
    this.maxBottles = this.collectableItems.filter(
      (i) => i.type === "bottle"
    ).length;
    this.END_BOSS_TRIGGER_X = this.level.levelWidth - 690;
    this.setWorld();
    this.healthBar = new Statusbar("health", this.character);
    this.coinBar = new Statusbar("coins", this.character, 10);
    this.bottleBar = new Statusbar("bottles", this.character, this.maxBottles);
    this.endbossBar = new Statusbar(
      "endboss",
      this.level.boss,
      this.level.boss.energy
    );
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
    const newBottle = new CollectableItem(x, y, "bottle");
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
    this.checkInventory(now);
  }

  checkInventory(now) {
    if (
      this.keyboard.SPACE &&
      now - this.lastBottleThrowTime >= 1000 &&
      this.character.bottles > 0
    ) {
      this.createNewBottle();
      this.character.bottles--;
      this.lastBottleThrowTime = now;
    }
  }

  createNewBottle() {
    this.character.resetMovementTimer();
    const bottle = new ThrowableObject(
      this.character.x + 100,
      this.character.y + 100
    );
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
      if (this.character.hasFullyDied && !this.gameOver) {
        this.showGameOverScreen();
      }
      if (this.level.boss.markedForDeletion && !this.gameWon) {
        this.showWinScreen();
      }
    }, 1000 / 60);
  }

  activateBoss() {
    const boss = this.level.enemies.find((e) => e instanceof Endboss);
    if (
      boss &&
      !boss.activated &&
      this.character.x >= this.END_BOSS_TRIGGER_X
    ) {
      boss.activate();
    }
  }

  checkCollision() {
    if (this.character.isDeadState || this.character.isHurt) return;

    this.enemies.forEach((enemy) => {
      if (this.character.isColliding(enemy)) {
        if (this.character.isJumpingOn(enemy)) {
          // Von oben getroffen → Gegner bekommt Schaden, Spieler nicht
          enemy.hit(this.character.damage);

          // Rückstoß
          this.character.speedY = 15;

          // Position leicht nach oben korrigieren, um Durchfallen zu vermeiden
          this.character.y = enemy.y - this.character.height + enemy.offset.top;
        } else {
          // KEIN Schaden durch Endboss, wenn dieser stirbt oder tot ist
          const isEndboss = enemy instanceof Endboss;
          const isBossDyingOrDead =
            isEndboss && (enemy.isDying || enemy.isDead());

          if (!isBossDyingOrDead) {
            // Seitliche Kollision → Schaden an Spieler
            this.character.hit(enemy.damage);
          }
        }
      }
    });
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
      this.respawnAfterSplash(bottle);
    });
  }

  respawnAfterSplash(bottle) {
    if (bottle.isSplashing && !bottle.respawnHandled) {
      this.spawnNewBottle();
      bottle.respawnHandled = true;
    }
  }

  draw() {
    if (this.gameWon || this.gameOver) return;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.translate(this.camera_x, 0);
    this.drawBackgroundAndGameElements();
    this.ctx.translate(-this.camera_x, 0);
    this.drawHUDElements();
    if (!this.level.boss.markedForDeletion) {
      this.ctx.translate(this.camera_x, 0);
      this.endbossBar.draw(this.ctx);
      this.ctx.translate(-this.camera_x, 0);
    }
    requestAnimationFrame(() => this.draw());
  }

  drawBackgroundAndGameElements() {
    this.addObjectsToMap(this.level.backgroundObjects);
    this.addObjectsToMap(this.clouds);
    let sortedEnemies = [...this.enemies].sort((a, b) => a.y - b.y);
    this.addObjectsToMap(sortedEnemies);
    this.addObjectsToMap(this.throwableObject);
    this.addToMap(this.character);
    this.addObjectsToMap(this.collectableItems);
  }

  drawHUDElements() {
  this.healthBar.draw(this.ctx);
  this.coinBar.draw(this.ctx);
  this.bottleBar.draw(this.ctx);
  this.ctx.font = "30px Arial";
  this.ctx.fillStyle = "#ffffff"; // weißer Text
  this.ctx.fillText("Level " + this.level.levelNumber, 40, 90);
} 

  addObjectsToMap(objects) {
    objects.forEach((o) => this.addToMap(o));
  }

  addToMap(mo) {
    if (mo.otherDirection) this.flipImage(mo);
    if (mo.img) {
      mo.draw(this.ctx);
      // mo.drawCollisionFrame(this.ctx);
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

  showWinScreen() {
    this.gameWon = true;
    const img = new Image();
    img.src = "img/img_pollo_locco/img/You won, you lost/You won A.png";

    img.onload = () => {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.ctx.drawImage(img, 0, 0, this.canvas.width, this.canvas.height);
      this.showRestartButton();
      this.showNextLevelButton();
    };
  }

  showGameOverScreen() {
    this.gameOver = true;
    const img = new Image();
    img.src = "img/img_pollo_locco/img/You won, you lost/Game Over.png";

    img.onload = () => {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.ctx.drawImage(img, 0, 0, this.canvas.width, this.canvas.height);
      this.showRestartButton();
    };
  }

  showRestartButton() {
    const btn = document.getElementById("restartBtn");
    btn.style.display = "block";
    btn.onclick = () => {
      init(currentLevel.levelWidth, currentLevel.levelNumber);
    };
  }

  showNextLevelButton() {
    const btn = document.getElementById("nextLevelBtn");
    btn.style.display = "block";
    btn.onclick = () => {
  init(currentLevel.levelWidth + 2000, currentLevel.levelNumber + 1);
};
}
}
