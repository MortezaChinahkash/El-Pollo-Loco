class Level{
    enemies;
    clouds;
    backgroundObjects;
    levelWidth = 0;
    
    constructor(enemies, clouds, backgroundObjects, levelWidth) {
        this.enemies = enemies;
        this.clouds = clouds;
        this.backgroundObjects = backgroundObjects;
        this.levelWidth = levelWidth;
        this.generateBackground();
        this.generateClouds();
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
        let startX = -719;
        let blockIndex = 0;
        while (startX < this.levelWidth) {
          let block = backgrounds[blockIndex % backgrounds.length];
    
          this.backgroundObjects.push(new BackgroundObject(block.air, startX, 480));
          this.backgroundObjects.push(new BackgroundObject(block.third, startX, 400));
          this.backgroundObjects.push(new BackgroundObject(block.second, startX, 400));
          this.backgroundObjects.push(new BackgroundObject(block.first, startX, 400));
    
          startX += segmentWidth;
          blockIndex++;
        }
      }
        generateClouds() {
            const numberOfClouds = Math.floor(this.levelWidth / 700);
            for (let i = 0; i < numberOfClouds; i++) {
                this.clouds.push(new Cloud(this.levelWidth));
            }
        }


}