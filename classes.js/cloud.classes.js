class Cloud extends movableObject {
    levelWidth;
    x;
    y;
    width = 400;
    speed = 0.06;

    /**
     * Creates a new cloud for the background
     * @param {number} levelWidth - The width of the level for positioning
     */
    constructor(levelWidth) {
        super();
        this.levelWidth = levelWidth;
        this.x = Math.random() * levelWidth;
        this.y = this.randomHeight();
        this.loadRandomCloudImage();
        this.animate();    }
    /**
     * Loads a random cloud image from the available cloud images
     * Provides variation in the appearance of clouds
     */
    loadRandomCloudImage() {
        const cloudImages = [
            'img/img_pollo_locco/img/5_background/layers/4_clouds/1.png',
            'img/img_pollo_locco/img/5_background/layers/4_clouds/2.png'
        ];
        const randomIndex = Math.floor(Math.random() * cloudImages.length);
        const selectedImage = cloudImages[randomIndex];
        this.loadImage(selectedImage);    }
    /**
     * Generates a random height for the cloud
     * @returns {number} Random Y-position between 20 and 100
     */
    randomHeight() {
        return 20 + Math.random() * 80;    }
    /**
     * Starts the cloud animation
     * Calls the movement to the left
     */
    animate() {
        this.moveLeft();    }
    /**
     * Moves the cloud continuously to the left
     * Creates slow, smooth movement for realistic cloud motion
     */
    moveLeft() {
        setInterval(() => {
            this.x -= this.speed;
        }, 1000 / 120);
    }
}
