class Chicken extends movableObject{
    
    levelWidth;
    x 
    y = 350
    width = 75
    height = 75 
    speed = 0.15 + Math.random() * 0.25
    IMAGES_WALKING = [
        'img/img_pollo_locco/img/3_enemies_chicken/chicken_normal/1_walk/1_w.png',
        'img/img_pollo_locco/img/3_enemies_chicken/chicken_normal/1_walk/2_w.png',
        'img/img_pollo_locco/img/3_enemies_chicken/chicken_normal/1_walk/3_w.png',
    ];

    constructor(levelWidth){
        super().loadImage('img/img_pollo_locco/img/3_enemies_chicken/chicken_normal/1_walk/1_w.png')
        this.levelWidth = levelWidth
        this.x = 250 + Math.random() * (this.levelWidth - 250);
        this.loadImages(this.IMAGES_WALKING);
        this.animate()
    }

    animate() {
        this.moveleft()
        setInterval(() => {
          let i = this.currentImage % this.IMAGES_WALKING.length;
          let path = this.IMAGES_WALKING[i];
          this.img = this.imageCache[path];
          this.currentImage++;
        }, 170);
      }
    




}

