class World{
    character = new Character();
    
    backgroundObjects =[
        new BackgroundObject(''),
        new BackgroundObject('img/img_pollo_locco/img/5_background/layers/3_third_layer/1.png'),
        new BackgroundObject('img/img_pollo_locco/img/5_background/layers/2_second_layer/1.png'),
        new BackgroundObject('img/img_pollo_locco/img/5_background/layers/1_first_layer/1.png')
    ]
    enemies = [
        new Chicken(),
        new Chicken(),
        new Chicken(),
    ];

    clouds =[
        new Cloud(),
    ];
   
    ctx;
    constructor(canvas){
        this.ctx = canvas.getContext('2d');
        this.canvas = canvas
        this.draw()
    }




    draw(){
        this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height);
        this.addObjectsToMap(this.clouds)
        this.addObjectsToMap(this.backgroundObjects)
        this.addObjectsToMap(this.enemies)
        this.addToMap(this.character)
        requestAnimationFrame(() => {
            this.draw();
        });
    }   

    addObjectsToMap(objects){
        objects.forEach(o => {
            this.addToMap(o)
        })
    }

    addToMap(mo){
        this.ctx.drawImage(mo.img,mo.x,mo.y,mo.width,mo.height)    
    }
}