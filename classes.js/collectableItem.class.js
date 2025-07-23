class CollectableItem extends movableObject {
  offset = {
    top: 15,
    bottom: 5,
    left: 20,
    right: 10,
  };

  /**
   * Creates a new collectable object (coin or bottle)
   * @param {number} x - X position of the object
   * @param {number} y - Y position of the object
   * @param {string} type - Type of object ('coin' or 'bottle')
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
   * Sets the size of the object based on its type
   * Coins are larger than bottles
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
   * Returns the image path for the respective object type
   * @returns {string} Path to the object's image
   */
  getImagePath() {
    const images = {
      coin: 'img/img_pollo_locco/img/8_coin/coin_1.png',
      bottle: 'img/img_pollo_locco/img/6_salsa_bottle/1_salsa_bottle_on_ground.png'
    };
    return images[this.type];  }
  /**
   * Collects the object and adds it to the character's inventory
   * Plays appropriate sounds and marks the object for deletion
   * @param {Character} character - The character collecting the object
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
   * Draws the collectable object on the canvas
   * Takes transparency into account and shows nothing if already collected
   * @param {CanvasRenderingContext2D} ctx - The canvas rendering context
   */
  draw(ctx) {
    if (!this.img || this.collected) return;
    ctx.save();
    ctx.globalAlpha = this.opacity;
    ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    ctx.globalAlpha = 1;
    ctx.restore();  }
  /**
   * Starts the floating animation for coins
   * Makes coins float up and down between two Y positions
   */
  startFloating() {
    let direction = 1;
    setInterval(() => {
      this.y += direction * 0.5;
      if (this.y > 300 || this.y < 250) direction *= -1;
    }, 30);
  }
  }
