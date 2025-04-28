class Chicken extends movableObject{
    
    x = 250 + Math.random() * 500
    y = 375
    width = 75
    height = 75 

    constructor(){
        super().loadImage('img/img_pollo_locco/img/3_enemies_chicken/chicken_normal/1_walk/1_w.png')
    }


}