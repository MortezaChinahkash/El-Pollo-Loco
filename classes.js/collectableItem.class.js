class CollectableItem extends movableObject {
  offset = {
    top: 15,
    bottom: 5,
    left: 20,
    right: 10,
  };
  /**
   * Erstellt ein neues sammelbarebares Objekt (Münze oder Flasche)
   * @param {number} x - X-Position des Objekts
   * @param {number} y - Y-Position des Objekts
   * @param {string} type - Typ des Objekts ('coin' oder 'bottle')
   */
  constructor(x, y, type) {
    super();
    this.x = x;
    this.y = y;
    this.type = type;
    this.collected = false;
    this.opacity = 1;
    this.markedForDeletion = false;
    this.setSizeByType();
    this.loadImage(this.getImagePath());
    if (this.type === 'coin') {
      this.startFloating();
      this.offset = {
        top: 30,
        bottom:30,
        left:30,
        right:30
      }
    }
  }

  /**
   * Setzt die Größe des Objekts basierend auf seinem Typ
   * Münzen sind größer als Flaschen
   */
  setSizeByType() {
    if (this.type === 'coin') {
      this.width = 100;
      this.height = 100;
    } else {
      this.width = 60;
      this.height = 60;
    }
  }

  /**
   * Gibt den Bildpfad für den jeweiligen Objekttyp zurück
   * @returns {string} Pfad zum Bild des Objekts
   */
  getImagePath() {
    const images = {
      coin: 'img/img_pollo_locco/img/8_coin/coin_1.png',
      bottle: 'img/img_pollo_locco/img/6_salsa_bottle/1_salsa_bottle_on_ground.png'
    };
    return images[this.type];  }
  /**
   * Sammelt das Objekt ein und fügt es zum Charakter-Inventar hinzu
   * Spielt entsprechende Sounds ab und markiert das Objekt zum Löschen
   * @param {Character} character - Der Charakter, der das Objekt sammelt
   */
  collect(character) {
    if (this.collected) return;
    this.collected = true;
    if (this.type === 'coin') {
      character.coins++;
      soundManager?.playSound("coin", 0.1);
    }
    if (this.type === 'bottle') {
      character.bottles++;
      soundManager?.playSound("bottle", 0.1);
    }
    this.markedForDeletion = true;  }
  /**
   * Zeichnet das sammelbare Objekt auf den Canvas
   * Berücksichtigt Transparenz und zeigt nichts an wenn bereits gesammelt
   * @param {CanvasRenderingContext2D} ctx - Der Canvas-Rendering-Kontext
   */
  draw(ctx) {
    if (!this.img || this.collected) return;
    ctx.save();
    ctx.globalAlpha = this.opacity;
    ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    ctx.globalAlpha = 1;
    ctx.restore();  }
  /**
   * Startet die Schwebanimation für Münzen
   * Lässt Münzen auf und ab schweben zwischen zwei Y-Positionen
   */
  startFloating() {
    let direction = 1;
    setInterval(() => {
      this.y += direction * 0.5;
      if (this.y > 300 || this.y < 250) direction *= -1;
    }, 30);
  }
  }
