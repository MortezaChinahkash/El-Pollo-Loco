class Endboss extends movableObject {
    IMAGES_WALKING = [
        'img/img_pollo_locco/img/4_enemie_boss_chicken/2_alert/G5.png',
        'img/img_pollo_locco/img/4_enemie_boss_chicken/2_alert/G6.png',
        'img/img_pollo_locco/img/4_enemie_boss_chicken/2_alert/G7.png',
        'img/img_pollo_locco/img/4_enemie_boss_chicken/2_alert/G8.png',
        'img/img_pollo_locco/img/4_enemie_boss_chicken/2_alert/G9.png',
        'img/img_pollo_locco/img/4_enemie_boss_chicken/2_alert/G10.png',
        'img/img_pollo_locco/img/4_enemie_boss_chicken/2_alert/G11.png',
        'img/img_pollo_locco/img/4_enemie_boss_chicken/2_alert/G12.png',
    ];

    constructor(levelWidth) {
        super();
        this.levelWidth = levelWidth;
        this.width = 250;    // <-- Breite setzen
        this.height = 300;   // <-- Höhe setzen
        this.x = this.levelWidth - this.width;   // <-- Jetzt korrekt
        this.y = 150; // etwas über dem Boden (anpassen falls nötig)
        this.speed = 0.15 + Math.random() * 0.25;
        this.loadImage('img/img_pollo_locco/img/4_enemie_boss_chicken/2_alert/G5.png');
        this.loadImages(this.IMAGES_WALKING);
        this.animate();
    }

    animate() {
        setInterval(() => {
            let i = this.currentImage % this.IMAGES_WALKING.length;
            let path = this.IMAGES_WALKING[i];
            this.img = this.imageCache[path];
            this.currentImage++;
        }, 150); 
    }
}