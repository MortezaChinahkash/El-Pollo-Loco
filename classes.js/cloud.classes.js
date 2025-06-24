class Cloud extends movableObject {
    levelWidth;
    x;
    y;
    width = 400;
    speed = 0.06;

    /**
     * Erstellt eine neue Wolke für den Hintergrund
     * @param {number} levelWidth - Die Breite des Levels für die Positionierung
     */
    constructor(levelWidth) {
        super();
        this.levelWidth = levelWidth;
        this.x = Math.random() * levelWidth;
        this.y = this.randomHeight(); 
        this.loadRandomCloudImage();
        this.animate();    }

    /**
     * Lädt ein zufälliges Wolkenbild aus den verfügbaren Wolkenbildern
     * Sorgt für Variation im Aussehen der Wolken
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
     * Generiert eine zufällige Höhe für die Wolke
     * @returns {number} Zufällige Y-Position zwischen 20 und 100
     */
    randomHeight() {
        return 20 + Math.random() * 80;    }

    /**
     * Startet die Wolkenanimation
     * Ruft die Bewegung nach links auf
     */
    animate() {
        this.moveLeft();    }

    /**
     * Bewegt die Wolke kontinuierlich nach links
     * Erstellt eine langsame, sanfte Bewegung für realistische Wolkenbewegung
     */
    moveLeft() {
        setInterval(() => {
            this.x -= this.speed;
        }, 1000 / 120);
    }
}