let canvas;
let world;
let keyboard = new Keyboard();
let soundManager;

function init() {
  canvas = document.getElementById("canvas");
  canvas.style.display = "block";
  document.getElementById("loading-screen").style.display = "none";

  world = new World(canvas, keyboard, level1);
  console.log("my Character is", world.character);

  soundManager = new SoundManager();
  soundManager.loadSound("background", "audio/flamenco-guitar-duo-flamenco-spanish-guitar-music-1614.mp3", true);
  soundManager.playMusic("background", 0.2);
}


window.addEventListener("keydown", () => {
  if (!world) {
    init();
  }
}, { once: true }); 


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
