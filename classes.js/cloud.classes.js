class Cloud extends movableObject {
    levelWidth;
    x;
    y;
    width = 400;
    speed = 0.06;

    constructor(levelWidth) {
        super();
        this.levelWidth = levelWidth;
        this.x = Math.random() * levelWidth;
        this.y = this.randomHeight(); 
        this.loadRandomCloudImage();
        this.animate();
    }

    loadRandomCloudImage() {
        const cloudImages = [
            'img/img_pollo_locco/img/5_background/layers/4_clouds/1.png',
            'img/img_pollo_locco/img/5_background/layers/4_clouds/2.png'
        ];
        const randomIndex = Math.floor(Math.random() * cloudImages.length);
        const selectedImage = cloudImages[randomIndex];
        this.loadImage(selectedImage);
    }

    randomHeight() {
        return 20 + Math.random() * 80; 
    }

    animate() {
        this.moveLeft();
    }

    moveLeft() {
        setInterval(() => {
            this.x -= this.speed;
        }, 1000 / 120);
    }
}