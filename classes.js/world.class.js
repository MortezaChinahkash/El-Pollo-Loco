class World{
    character = new Character();
    enemies = [
        new Chicken(),
        new Chicken(),
        new Chicken(),
    ];

    clouds =[
        new Cloud(),
    ];
    backgroundObjects =[
        
    ]
    ctx;
    constructor(canvas){
        this.ctx = canvas.getContext('2d');
        this.canvas = canvas
        this.draw()
    }




    draw(){
        this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height);
        this.enemies.forEach(chicken => {
            this.addToMap(chicken)
        });
        this.clouds.forEach(cloud => {
            this.addToMap(cloud)
        });
        this.addToMap(this.character)
        requestAnimationFrame(() => {
            this.draw();
        });
    }

    addToMap(mo){
        this.ctx.drawImage(mo.img,mo.x,mo.y,mo.width,mo.height)    
    }
}