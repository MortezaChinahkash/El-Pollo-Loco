/**
 * World class manages the entire game world and its logic
 * Coordinates characters, enemies, collisions and game states
 */
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

  /**
   * Creates a new World instance and initializes all game elements
   * @param {HTMLCanvasElement} canvas - The canvas element for rendering
   * @param {Keyboard} keyboard - The keyboard object for input
   * @param {Level} level - The level object with all game elements
   */
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
    this.bottleSpawnCount = 0;  }
  /**
   * Connects the character to the world and starts its animation
   */
  setWorld() {
    this.character.world = this;
    this.character.animate();  }
  /**
   * Creates a new bottle at random position in the level
   * Limited by maxBottles count
   */
  spawnNewBottle() {
    if (this.bottleSpawnCount >= this.maxBottles) return;
    const x = 300 + Math.random() * (this.level.levelWidth - 600);
    const y = 370;
    const newBottle = new CollectableItem(x, y, "bottle");
    this.collectableItems.push(newBottle);
    this.bottleSpawnCount++;  }
  /**
   * Checks collisions between character and collectable items
   * Removes collected items from the list
   */
  checkCollectableItems() {
    this.collectableItems.forEach((item) => {
      if (!item.collected && this.character.isColliding(item)) {
        item.collect(this.character);
      }
    });
    this.collectableItems = this.collectableItems.filter(
      (item) => !item.markedForDeletion
    );  }
  /**
   * Checks if new bottles can be thrown
   * Prevents throwing during boss entrance
   */
  checkThrowObjects() {
    const now = Date.now();
    if (this.character.world.level.boss?.movingIn) return;
    this.checkInventory(now);  }
  /**
   * Checks inventory and allows bottle throwing with cooldown
   * @param {number} now - Current timestamp
   */
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

  /**
   * Creates a new bottle and adds it to the throwable objects
   * Called when the player throws a bottle
   */
  createNewBottle() {
    this.character.resetMovementTimer();
    const bottle = new ThrowableObject(
      this.character.x + 100,
      this.character.y + 100
    );
    this.throwableObject.push(bottle);
  }

  /**
   * Starts the main game loop at 60 FPS
   * Continuously executes game logic, cleanup and state checks
   */
  run() {
    setInterval(() => {
      this.runGameLogic();
      this.cleanupObjects();
      this.checkGameStates();
    }, 1000 / 60);
  }

  /**
   * Executes the main game logic
   */
  runGameLogic() {
    this.checkCollision();
    this.checkThrowObjects();
    this.bottleHitEnemy();
    this.activateBoss();
    this.checkCollectableItems();
  }

  /**
   * Cleans up marked objects
   */
  cleanupObjects() {
    this.throwableObject = this.throwableObject.filter(
      (obj) => !obj.markedForDeletion
    );
    this.enemies = this.enemies.filter((enemy) => !enemy.markedForDeletion);
  }

  /**
   * Überprüft Spiel-Endzustände
   */
  checkGameStates() {
    if (this.character.hasFullyDied && !this.gameOver) {
      this.showGameOverScreen();
    }
    if (this.level.boss.markedForDeletion && !this.gameWon) {
      this.showWinScreen();
    }
  }

  /**
   * Aktiviert den Endboss wenn der Spieler die Trigger-Position erreicht
   * Spielt auch den "Ay Dios Mio" Sound beim ersten Erscheinen ab
   */
  activateBoss() {
  const boss = this.level.enemies.find((e) => e instanceof Endboss);
  if (
    boss &&
    !boss.activated &&
    this.character.x >= this.END_BOSS_TRIGGER_X
  ) {
    boss.activate();
    if (typeof soundManager !== "undefined" && !soundManager.isMuted) {
      soundManager.playSound("ay_dios_mio", 0.3);
    }
  }
}

  /**
   * Überprüft alle Kollisionen im Spiel
   * Behandelt Kollisionen zwischen Spieler und Gegnern sowie Sammelobjekten
   */
  checkCollision() {
    if (this.character.isDeadState || this.character.isHurt) return;
    this.enemies.forEach((enemy) => {
      if (this.character.isColliding(enemy)) {
        this.handleCharacterEnemyCollision(enemy);
      }
    });
  }

  /**
   * Behandelt Kollision zwischen Charakter und Gegner
   * @param {Enemy} enemy - Der Gegner, mit dem kollidiert wurde
   */
  handleCharacterEnemyCollision(enemy) {
    if (this.character.isJumpingOn(enemy)) {
      this.handleJumpOnEnemy(enemy);
    } else {
      this.handleSideCollisionWithEnemy(enemy);
    }
  }

  /**
   * Behandelt das Springen auf einen Gegner
   * @param {Enemy} enemy - Der Gegner, auf den gesprungen wurde
   */
  handleJumpOnEnemy(enemy) {
    enemy.hit(this.character.damage);
    if (!(enemy instanceof Endboss) && typeof soundManager !== "undefined") {
      soundManager.playSound("jump_on_enemy", 0.3);
    }
    this.character.speedY = 15;
    this.character.y = enemy.y - this.character.height + enemy.offset.top;
    this.character.animationManager.hasJumpedDown = false;
    this.character.animationManager.hasJumpedUp = false;
    this.character.animationManager.handleJumpAnimation();
  }

  /**
   * Behandelt seitliche Kollision mit Gegner
   * @param {Enemy} enemy - Der Gegner bei seitlicher Kollision
   */
  handleSideCollisionWithEnemy(enemy) {
    const isEndboss = enemy instanceof Endboss;
    const isBossDyingOrDead = isEndboss && (enemy.isDying || enemy.isDead());
    if (!isBossDyingOrDead) {
      this.character.hit(enemy.damage);
    }
  }

  /**
   * Behandelt Kollisionen zwischen geworfenen Flaschen und Gegnern
   * Fügt Schaden zu und spielt entsprechende Sounds ab
   */
  bottleHitEnemy() {
    this.throwableObject.forEach((bottle) => {
      if (!bottle.isSplashing) {
        this.enemies.forEach((enemy) => {
          if (!enemy.markedForDeletion && bottle.isColliding(enemy)) {
            enemy.hit(this.character.damage);
            if (enemy instanceof Endboss && !soundManager.isMuted) {
              soundManager.playSound("bottle_hit_boss", 0.5);
            }
            bottle.splash();
          }
        });
      }
      this.respawnAfterSplash(bottle);
    });
  }

  /**
   * Behandelt das Respawning von Flaschen nach dem Aufprall
   * @param {ThrowableObject} bottle - Die Flasche die gespawnt werden soll
   */
  respawnAfterSplash(bottle) {
    if (bottle.isSplashing && !bottle.respawnHandled) {
      this.spawnNewBottle();
      bottle.respawnHandled = true;
    }
  }

  /**
   * Zeichnet die gesamte Spielwelt auf das Canvas
   * Rendert Hintergrund, Spielelemente und HUD-Elemente
   */
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

  /**
   * Zeichnet Hintergrundobjekte und Spielelemente in der richtigen Reihenfolge
   * Sortiert Gegner nach Y-Position für korrekte Tiefenwirkung
   */
  drawBackgroundAndGameElements() {
    this.addObjectsToMap(this.level.backgroundObjects);
    this.addObjectsToMap(this.clouds);
    this.addObjectsToMap(this.collectableItems);
    this.addObjectsToMap(this.throwableObject);
    let sortedEnemies = [...this.enemies].sort((a, b) => a.y - b.y);
    this.addObjectsToMap(sortedEnemies);
    this.addToMap(this.character);
  }

  /**
   * Zeichnet HUD-Elemente wie Statusbalken und Level-Anzeige
   * Wird außerhalb der Kamera-Translation gerendert
   */
  drawHUDElements() {
    this.healthBar.draw(this.ctx);
    this.coinBar.draw(this.ctx);
    this.bottleBar.draw(this.ctx);
    this.ctx.font = "30px Arial";
    this.ctx.fillStyle = "#ffffff";
    this.ctx.fillText("Level " + this.level.levelNumber, 40, 90);
  }

  /**
   * Fügt ein Array von Objekten zur Karte hinzu
   * @param {Array} objects - Array von Objekten die gezeichnet werden sollen
   */
  addObjectsToMap(objects) {
    objects.forEach((o) => this.addToMap(o));
  }

  /**
   * Fügt ein einzelnes Objekt zur Karte hinzu und behandelt Bildrichtung
   * @param {DrawableObject} mo - Das Objekt das gezeichnet werden soll
   */
  addToMap(mo) {
    if (mo.otherDirection) this.flipImage(mo);
    if (mo.img) {
      mo.draw(this.ctx);
    }
    if (mo.otherDirection) this.flipImageBack(mo);
  }

  /**
   * Dreht das Bild horizontal für Links-Bewegung
   * @param {DrawableObject} mo - Das Objekt dessen Bild gedreht werden soll
   */
  flipImage(mo) {
    this.ctx.save();
    this.ctx.translate(mo.width, 0);
    this.ctx.scale(-1, 1);
    mo.x = mo.x * -1;
  }

  /**
   * Stellt die normale Bildorientierung nach flipImage() wieder her
   * @param {MovableObject} mo - Das Objekt dessen Bild zurückgedreht werden soll
   */
  flipImageBack(mo) {
    mo.x = mo.x * -1;
    this.ctx.restore();
  }

 /**
  * Zeigt den Gewinn-Bildschirm an und startet die Gewinn-Sequenz
  * Versteckt UI-Elemente und lädt das Gewinn-Bild
  */
 showWinScreen() {
  this.gameWon = true;
  this.hideUIForWinScreen();
  this.loadWinImage();
 }

 /**
  * Versteckt UI-Elemente für den Gewinn-Bildschirm
  */
 hideUIForWinScreen() {
  const mobileControls = document.getElementById("mobile-controls");
  if (mobileControls) {
    mobileControls.style.display = "none";
  }
 }

 /**
  * Lädt und zeigt das Gewinn-Bild
  */
 loadWinImage() {
  const img = new Image();
  img.src = "img/img_pollo_locco/img/You won, you lost/You won A.png";
  if (typeof soundManager !== "undefined" && !soundManager.isMuted) {
    soundManager.playSound("won", 0.4);
  }
  img.onload = () => {
    this.displayWinScreen(img);
  };
 }

 /**
  * Zeigt den Gewinn-Bildschirm und Buttons
  * @param {Image} img - Das Gewinn-Bild
  */
 displayWinScreen(img) {
  this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  this.ctx.drawImage(img, 0, 0, this.canvas.width, this.canvas.height);
  this.showRestartButton();
  this.showNextLevelButton();
 }

  /**
   * Zeigt den Game-Over-Bildschirm an
   * Versteckt mobile Controls und spielt Game-Over-Sound ab
   */
  showGameOverScreen() {
  this.gameOver = true;
  const mobileControls = document.getElementById("mobile-controls");
  if (mobileControls) {
    mobileControls.style.display = "none";
  }
  const img = new Image();
  img.src = "img/img_pollo_locco/img/You won, you lost/Game Over.png";
  if (typeof soundManager !== "undefined" && !soundManager.isMuted) {
    soundManager.playSound("lost", 0.4);
  }
  img.onload = () => {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.drawImage(img, 0, 0, this.canvas.width, this.canvas.height);
    this.showRestartButton();
  };
}

  /**
   * Zeigt den Neustart-Button und Home-Button an
   * Konfiguriert Click-Handler für Spielneustart
   */
  showRestartButton() {
    const btn = document.getElementById("restartBtn");
    const homeBtn = document.getElementById("homeBtn");
    btn.style.display = "block";
    if (homeBtn) homeBtn.style.display = "block";
    btn.onclick = () => {
      init(currentLevel.levelWidth, currentLevel.levelNumber);
    };
  }

  /**
   * Zeigt den Nächstes-Level-Button und Home-Button an
   * Konfiguriert Click-Handler für nächstes Level
   */
  showNextLevelButton() {
    const btn = document.getElementById("nextLevelBtn");
    const homeBtn = document.getElementById("homeBtn");
    btn.style.display = "block";
    if (homeBtn) homeBtn.style.display = "block";
    btn.onclick = () => {
      init(currentLevel.levelWidth + 2000, currentLevel.levelNumber + 1);
    };
  }
}
