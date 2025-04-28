class movableObject{
    x = 90;
    y = 135;
    img ;
    width = 150;
    height = 300;
    imageCache =[]

    loadImage(path){
        this.img = new Image();
        this.img.src = path;
    }

    loadImages(arr){
        arr.forEach(path => {
        let img = new Image();
        img.src= path;
        this.imageCache[path] = img;
    });
    }

    moveRight() {
        console.log("moving right");
    }

    moveleft(){
        console.log("moving left");
        
    }

}