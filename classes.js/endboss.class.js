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

    constructor(levelWidth, damage, energy) {
        super();
        this.offset = {
            top: 70,
            bottom: 20,
            left: 20,
            right: 20
          };
        this.levelWidth = levelWidth;
        this.damage = damage 
        this.energy = energy 
        this.width = 250;
        this.height = 300; 
        this.x = this.levelWidth - this.width; 
        this.y = 110
        this.speed = 0.15 + Math.random() * 0.25;
        this.loadImage('img/img_pollo_locco/img/4_enemie_boss_chicken/2_alert/G5.png');
        this.loadImages(this.IMAGES_WALKING);
        this.animate();
        this.applyGravity()
    }

    animate() {
        setInterval(() => {
            this.playAnimation(this.IMAGES_WALKING)
        }, 150); 
    }
}