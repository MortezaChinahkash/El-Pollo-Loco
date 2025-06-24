class BackgroundObject extends movableObject{
    width = 720
    height = 480
    
    /**
     * Erstellt ein neues Hintergrundobjekt
     * @param {string} imagePath - Pfad zum Hintergrundbild
     * @param {number} x - X-Position des Hintergrundobjekts
     */
    constructor(imagePath, x){
        super().loadImage(imagePath);
        this.x = x;
        this.y = 480 - this.height 
    }

}