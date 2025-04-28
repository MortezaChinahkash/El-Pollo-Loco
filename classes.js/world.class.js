class World {
    character = new Character();
    enemies = [new Chicken(), new Chicken(), new Chicken()];
    canvas;
    clouds = [new Cloud()];
    keyboard;
    ctx;
    camera_x = 0;
    backgroundObjects = [];
  
    constructor(canvas, keyboard) {
      this.ctx = canvas.getContext("2d");
      this.canvas = canvas;
      this.keyboard = keyboard;
      this.setWorld();
      this.generateBackground();
      this.draw();
    }
  
    setWorld() {
      this.character.world = this;
    }
  
    generateBackground() {
        const backgrounds = [
          {
            air: "img/img_pollo_locco/img/5_background/layers/air.png",
            third: "img/img_pollo_locco/img/5_background/layers/3_third_layer/1.png",
            second: "img/img_pollo_locco/img/5_background/layers/2_second_layer/1.png",
            first: "img/img_pollo_locco/img/5_background/layers/1_first_layer/1.png",
          },
          {
            air: "img/img_pollo_locco/img/5_background/layers/air.png",
            third: "img/img_pollo_locco/img/5_background/layers/3_third_layer/2.png",
            second: "img/img_pollo_locco/img/5_background/layers/2_second_layer/2.png",
            first: "img/img_pollo_locco/img/5_background/layers/1_first_layer/2.png",
          },
        ];
    
        const segmentWidth = 719;
        const levelWidth = 5000; 
    
        let startX = -719;
        let blockIndex = 0;
    
        while (startX < levelWidth) {
          let block = backgrounds[blockIndex % backgrounds.length];
    
          this.backgroundObjects.push(new BackgroundObject(block.air, startX, 480));
          this.backgroundObjects.push(new BackgroundObject(block.third, startX, 400));
          this.backgroundObjects.push(new BackgroundObject(block.second, startX, 400));
          this.backgroundObjects.push(new BackgroundObject(block.first, startX, 400));
    
          startX += segmentWidth;
          blockIndex++;
        }
      }
  
    draw() {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.ctx.translate(this.camera_x, 0);
      this.addObjectsToMap(this.backgroundObjects);
      this.addObjectsToMap(this.clouds);
      this.addObjectsToMap(this.enemies);
      this.addToMap(this.character);
      this.ctx.translate(-this.camera_x, 0);
      requestAnimationFrame(() => this.draw());
    }
  
    addObjectsToMap(objects) {
      objects.forEach(o => this.addToMap(o));
    }
  
    addToMap(mo) {
      if (mo.otherDirection) {
        this.ctx.save();
        this.ctx.translate(mo.width, 0);
        this.ctx.scale(-1, 1);
        mo.x = mo.x * -1;
      }
      if (mo.img) {
        this.ctx.drawImage(mo.img, mo.x, mo.y, mo.width, mo.height);
      }
      if (mo.otherDirection) {
        mo.x = mo.x * -1;
        this.ctx.restore();
      }
    }
  }