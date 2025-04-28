class BackgroundObject extends movableObject{
    x = 0
    y = 380 - this.height
    width = 720
    height = 400
    constructor(imagePath){
        super().loadImage(imagePath);
    }

}