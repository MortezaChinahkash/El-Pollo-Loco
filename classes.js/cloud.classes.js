class Cloud extends movableObject{

    x = 0 + Math.random() * 500
    y = 25
    width = 400
    speed = 0.06
    constructor(){
        super().loadImage('img/img_pollo_locco/img/5_background/layers/4_clouds/1.png')
        this.animate()
    }

    animate(){
       this.moveLeft()
    }
    moveLeft(){
                setInterval(()=>{
            this.x -= this.speed;
        },1000/120)
    }
}