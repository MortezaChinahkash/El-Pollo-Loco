let canvas;
let world;
let keyboard = new Keyboard();
let soundManager;

let currentLevel;

function init(levelWidth = 5000, levelNumber = 1) {
  setupUI();
  currentLevel = initializeLevel(levelWidth, levelNumber);
  initializeGameWorld(currentLevel);
  setupAudio();
  setupInput();
  setupOverlayButtons();
  document.getElementById("overlay-buttons").style.display = "flex";
}

function setupUI() {
  canvas = document.getElementById("canvas");
  canvas.style.display = "block";
  document.getElementById("loading-screen").style.display = "none";

  const restartBtn = document.getElementById("restartBtn");
  const nextBtn = document.getElementById("nextLevelBtn");
  if (restartBtn) restartBtn.style.display = "none";
  if (nextBtn) nextBtn.style.display = "none";
}

function setupOverlayButtons() {
  setupMuteButton();
  setupFullscreenButton();
  setupHelpButton();
}

function setupMuteButton() {
  const muteBtn = document.getElementById("muteBtn");

  muteBtn.onclick = () => {
    if (soundManager) {
      soundManager.toggleMute();

      // 🔒 Zustand speichern
      localStorage.setItem("soundMuted", soundManager.isMuted ? "true" : "false");

      // Icon aktualisieren
      muteBtn.textContent = soundManager.isMuted ? "🔊" : "🔇";
    }
  };
}

function setupFullscreenButton() {
  const fullscreenBtn = document.getElementById("fullscreenBtn");
  fullscreenBtn.onclick = () => {
    const elem = document.documentElement;
    if (!document.fullscreenElement) {
      elem.requestFullscreen().catch(err =>
        alert("Vollbild-Modus fehlgeschlagen")
      );
    } else {
      document.exitFullscreen();
    }
  };
}

function setupHelpButton() {
  const helpBtn = document.getElementById("helpBtn");
  const helpOverlay = document.getElementById("helpOverlay");
  const closeHelp = document.getElementById("closeHelp");
  const helpContent = document.querySelector(".help-content");

  helpBtn.addEventListener("click", () => {
    helpOverlay.style.display = "flex";
  });

  closeHelp.addEventListener("click", () => {
    helpOverlay.style.display = "none";
  });

  helpOverlay.addEventListener("click", (event) => {
    if (!helpContent.contains(event.target)) {
      helpOverlay.style.display = "none";
    }
  });
}

function initializeLevel(levelWidth, levelNumber) {
  return createLevel(levelWidth, levelNumber);
}

function initializeGameWorld(currentLevel) {
  world = new World(canvas, keyboard, currentLevel);
}

function setupInput() {
  touchDetection();
  setupMobileControls();
}

function setupAudio() {
  if (!soundManager) {
    soundManager = new SoundManager();
  }
  soundManager.stopAll();
  soundManager.loadSound(
    "background",
    "audio/flamenco-guitar-duo-flamenco-spanish-guitar-music-1614.mp3",
    true
  );
  loadMuteStateFromLocalStorage();
} 

function loadMuteStateFromLocalStorage() {
  const isMuted = localStorage.getItem("soundMuted") === "true";
  soundManager.isMuted = isMuted;
  refreshMuteButton(isMuted);
  startMusicWhenNotMuted(isMuted);
}

function refreshMuteButton(isMuted) {
  const muteBtn = document.getElementById("muteBtn");
  if (muteBtn) {
    muteBtn.textContent = isMuted ? "🔊" : "🔇";
  }
}

function startMusicWhenNotMuted(isMuted) {
  if (!isMuted) {
    soundManager.playMusic("background", 0.1);
  }
}

function touchDetection() {
  if ("ontouchstart" in window || navigator.maxTouchPoints > 0) {
    document.getElementById("mobile-controls").style.display = "flex";
  } else {
    document.getElementById("mobile-controls").style.display = "none";
  }
}

window.addEventListener(
  "touchstart",
  () => {
    if (!world) {
      init();
      // Musik erst hier starten
      soundManager.playMusic("background", 0.1);
    }
  },
  { once: true }
);

window.addEventListener(
  "keydown",
  () => {
    if (!world) {
      init();
      // Musik erst hier starten
      soundManager.playMusic("background", 0.1);
    }
  },
  { once: true }
);

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

function createLevel(levelWidth, levelNumber) {
  return new Level([], [], [], levelWidth, levelNumber);
}
function setupMobileControls() {
  document
    .getElementById("btn-left")
    .addEventListener("touchstart", () => (keyboard.LEFT = true), { passive: true });
  document
    .getElementById("btn-left")
    .addEventListener("touchend", () => (keyboard.LEFT = false), { passive: true });

  document
    .getElementById("btn-right")
    .addEventListener("touchstart", () => (keyboard.RIGHT = true), { passive: true });
  document
    .getElementById("btn-right")
    .addEventListener("touchend", () => (keyboard.RIGHT = false), { passive: true });

  document
    .getElementById("btn-jump")
    .addEventListener("touchstart", () => (keyboard.UP = true), { passive: true });
  document
    .getElementById("btn-jump")
    .addEventListener("touchend", () => (keyboard.UP = false), { passive: true });

  document
    .getElementById("btn-throw")
    .addEventListener("touchstart", () => (keyboard.SPACE = true), { passive: true });
  document
    .getElementById("btn-throw")
    .addEventListener("touchend", () => (keyboard.SPACE = false), { passive: true });
}
