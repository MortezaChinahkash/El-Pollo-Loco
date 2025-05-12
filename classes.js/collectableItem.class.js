class CollectableItem extends movableObject {

  offset = {
    top: 15,
    bottom: 5,
    left: 20,
    right: 10,
  };
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
  
    setSizeByType() {
      if (this.type === 'coin') {
        this.width = 100;
        this.height = 100;
      } else {
        this.width = 60;
        this.height = 60;
      }
    }
  
    getImagePath() {
      const images = {
        coin: 'img/img_pollo_locco/img/8_coin/coin_1.png',
        bottle: 'img/img_pollo_locco/img/6_salsa_bottle/1_salsa_bottle_on_ground.png'
      };
      return images[this.type];
    }
  
    collect(character) {
      if (this.collected) return;
      this.collected = true;
  
      if (this.type === 'coin') character.coins++;
      if (this.type === 'bottle') character.bottles++;
  
      this.markedForDeletion = true;
    }
  
    draw(ctx) {
      if (!this.img || this.collected) return;
      ctx.save();
      ctx.globalAlpha = this.opacity;
      ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
      ctx.globalAlpha = 1;
      ctx.restore();
    }
  
    startFloating() {
      let direction = 1;
      setInterval(() => {
        this.y += direction * 0.5;
        if (this.y > 300 || this.y < 250) direction *= -1;
      }, 30);
    }
  }

  