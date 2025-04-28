class movableObject{
    x = 90;
    y = 135;
    img ;
    width = 150;
    height = 300;
    

    loadImage(path){
        this.img = new Image();
        this.img.src = path;
    }
    moveRight() {
        console.log("moving right");
    }
    moveleft(){
        console.log("moving left");
        
    }

}