let canvas;
let world;
let keyboard = new Keyboard();

function init(){
    canvas = document.getElementById("canvas");
    world = new World(canvas, keyboard)
    console.log('my Character is', world.character);
    
}

window.addEventListener("keydown", (button) => {
    if (button.keyCode == 39) keyboard.RIGHT = true;
    if (button.keyCode == 37) keyboard.LEFT = true;
    if (button.keyCode == 38) keyboard.UP = true;
    if (button.keyCode == 40) keyboard.DOWN = true;
    if (button.keyCode == 32) keyboard.SPACE = true;
});

window.addEventListener("keyup", (button) => {
    if (button.keyCode == 39) keyboard.RIGHT = false;
    if (button.keyCode == 37) keyboard.LEFT = false;
    if (button.keyCode == 38) keyboard.UP = false;
    if (button.keyCode == 40) keyboard.DOWN = false;
    if (button.keyCode == 32) keyboard.SPACE = false;
});
