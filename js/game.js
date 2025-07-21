let canvas;
let world;
let keyboard = new Keyboard();
let soundManager;
let muteStateAlreadyLoaded = false;
let currentLevel;

// Performance optimization: Cache DOM elements
let cachedElements = {};

function getCachedElement(id) {
  if (!cachedElements[id]) {
    cachedElements[id] = document.getElementById(id);
  }
  return cachedElements[id];
}

function init(levelWidth = 5000, levelNumber = 1) {
  setupUI();
  currentLevel = initializeLevel(levelWidth, levelNumber);
  initializeGameWorld(currentLevel);  setupAudio();
  setupInput();
  setupOverlayButtons();
  getCachedElement("overlay-buttons").style.display = "flex";
}

function setupUI() {
  canvas = getCachedElement("canvas");
  canvas.style.display = "block";
  getCachedElement("loading-screen").style.display = "none";

  // Beide Willkommensnachrichten verstecken wenn Spiel startet
  hideWelcomeMessages();
  
  // Zusätzliche Sicherheit: Verstecke alle intro-related Elemente
  const introText = document.querySelector(".intro-text");
  if (introText) {
    introText.style.display = "none";
  }

  const restartBtn = getCachedElement("restartBtn");
  const nextBtn = getCachedElement("nextLevelBtn");
  const homeBtn = getCachedElement("homeBtn");
  if (restartBtn) restartBtn.style.display = "none";
  if (nextBtn) nextBtn.style.display = "none";
  if (homeBtn) homeBtn.style.display = "none";
}

function hideWelcomeMessages() {
  // Alle Willkommensnachrichten mit verschiedenen Selektoren verstecken
  const desktopWelcome = document.getElementById("desktop-welcome");
  const mobileWelcome = document.getElementById("mobile-welcome");
  
  // Zusätzlich nach Klassen suchen
  const desktopWelcomeClass = document.querySelector(".desktop-welcome");
  const mobileWelcomeClass = document.querySelector(".mobile-welcome");
  const allStartMessages = document.querySelectorAll(".start-message");
  
  if (desktopWelcome) {
    desktopWelcome.style.display = "none";
    console.log("Desktop Welcome (ID) versteckt beim Spielstart");
  }
  if (mobileWelcome) {
    mobileWelcome.style.display = "none";
    console.log("Mobile Welcome (ID) versteckt beim Spielstart");
  }
  if (desktopWelcomeClass) {
    desktopWelcomeClass.style.display = "none";
    console.log("Desktop Welcome (Class) versteckt beim Spielstart");
  }
  if (mobileWelcomeClass) {
    mobileWelcomeClass.style.display = "none";
    console.log("Mobile Welcome (Class) versteckt beim Spielstart");
  }
  
  // Sicherheit: Alle Start-Nachrichten verstecken
  allStartMessages.forEach((message, index) => {
    if (message.parentElement && (message.parentElement.id === 'desktop-welcome' || message.parentElement.id === 'mobile-welcome' || message.parentElement.classList.contains('desktop-welcome') || message.parentElement.classList.contains('mobile-welcome'))) {
      message.parentElement.style.display = "none";
      console.log(`Start Message ${index + 1} versteckt`);
    }
  });
}

function setupOverlayButtons() {
  setupMuteButton();
  setupFullscreenButton();
  setupHelpButton();
  setupHomeButton();
}

function setupMuteButton() {
  const muteBtn = getCachedElement("muteBtn");

  muteBtn.onclick = () => {
    if (soundManager) {
      soundManager.toggleMute();

      // 🔒 Zustand speichern
      localStorage.setItem(
        "soundMuted",
        soundManager.isMuted ? "true" : "false"
      );

      // Icon aktualisieren
      muteBtn.textContent = soundManager.isMuted ? "🔊" : "🔇";
    }
  };
}

function setupFullscreenButton() {
  const fullscreenBtn = getCachedElement("fullscreenBtn");
  fullscreenBtn.onclick = () => {
    const elem = document.documentElement;
    if (!document.fullscreenElement) {
      elem
        .requestFullscreen()
        .catch((err) => console.warn("Vollbild-Modus fehlgeschlagen:", err));
    } else {
      document.exitFullscreen();
    }
  };
}

function setupHelpButton() {
  const helpBtn = getCachedElement("helpBtn");
  const helpOverlay = getCachedElement("helpOverlay");
  const closeHelp = getCachedElement("closeHelp");
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

function setupHomeButton() {
  const homeBtn = getCachedElement("homeBtn");
  
  homeBtn.addEventListener("click", () => {
    // Seite neu laden
    window.location.reload();
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

    if (!muteStateAlreadyLoaded) {
      const isMuted = localStorage.getItem("soundMuted") === "true";
      soundManager.isMuted = isMuted;
      muteStateAlreadyLoaded = true;
    }
  }

  soundManager.stopAll();
  
  // Load sounds with better error handling and performance
  const sounds = [
    { key: "background", src: "audio/flamenco-guitar-duo-flamenco-spanish-guitar-music-1614.mp3", loop: true },
    { key: "coin", src: "audio/coin-recieved-230517.mp3" },
    { key: "bottle", src: "audio/glass-bottle-clink-90671.mp3" },
    { key: "throw_fly", src: "audio/flying-blade-103343.mp3" },
    { key: "throw_splash", src: "audio/bottle-break-39916.mp3" },
    { key: "bottle_hit_boss", src: "audio/bottle-hit-boss.mp3" },
    { key: "hurt", src: "audio/Hurt.mp3" },
    { key: "jump", src: "audio/Jump.mp3" },
    { key: "orale", src: "audio/Orale.mp3" },
    { key: "ay_dios_mio", src: "audio/Ay Dios Mio.mp3" },
    { key: "won", src: "audio/won.mp3" },
    { key: "lost", src: "audio/Lost.mp3" },
    { key: "running", src: "audio/running-on-gravel-301880.mp3" },
    { key: "jump_on_enemy", src: "audio/jump-up-245782.mp3" },
    { key: "snore", src: "audio/snoring-8486.mp3" }
  ];

  // Load sounds efficiently
  sounds.forEach(sound => {
    soundManager.loadSound(sound.key, sound.src, sound.loop || false);
  });
  refreshMuteButton(soundManager.isMuted);

  // 👉 Wichtig: Musik wird immer nur gestartet, wenn gerade **nicht gemutet**
  // Add timeout to prevent audio interruption errors
  setTimeout(() => {
    if (!soundManager.isMuted) {
      try {
        soundManager.playMusic("background", 0.2);
      } catch (error) {
        console.warn("Audio playback failed:", error);
      }
    }
  }, 200);
}

function loadMuteStateFromLocalStorage() {
  if (muteStateAlreadyLoaded) return;

  const isMuted = localStorage.getItem("soundMuted") === "true";
  soundManager.isMuted = isMuted;
  refreshMuteButton(isMuted);
  startMusicWhenNotMuted(isMuted);

  muteStateAlreadyLoaded = true; 
}

function refreshMuteButton(isMuted) {
  const muteBtn = getCachedElement("muteBtn");
  if (muteBtn) {
    muteBtn.textContent = isMuted ? "🔊" : "🔇";
  }
}

function startMusicWhenNotMuted(isMuted) {
  if (!isMuted) {
    try {
      soundManager.playMusic("background", 0.2);
    } catch (error) {
      console.warn("Audio playback failed:", error);
    }
  }
}

function touchDetection() {
  // Einfache Touch-Gerät-Erkennung
  const isTouchDevice = 
    (navigator.maxTouchPoints > 0) ||
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
    (window.orientation !== undefined) ||
    ("ontouchstart" in window);
  
  const desktopWelcome = document.getElementById("desktop-welcome");
  const mobileWelcome = document.getElementById("mobile-welcome");
  const mobileControls = document.getElementById("mobile-controls");
  
  console.log("Touch-Detection:", isTouchDevice);
  
  if (isTouchDevice) {
    // Touch-Gerät: Desktop verstecken, Mobile anzeigen
    if (desktopWelcome) desktopWelcome.style.display = "none";
    if (mobileWelcome) mobileWelcome.style.display = "flex";
    if (mobileControls) mobileControls.style.display = "flex";
    console.log("Touch-Gerät: Mobile Welcome aktiviert");
  } else {
    // Desktop: Desktop anzeigen, Mobile verstecken
    if (desktopWelcome) desktopWelcome.style.display = "flex";
    if (mobileWelcome) mobileWelcome.style.display = "none";
    if (mobileControls) mobileControls.style.display = "none";
    console.log("Desktop: Desktop Welcome aktiviert");
  }
}

// Touch-Detection beim Laden der Seite ausführen
document.addEventListener('DOMContentLoaded', function() {
  touchDetection();
});

// Fallback: Auch beim window.load Event
window.addEventListener('load', function() {
  touchDetection();
});

// Direkte Ausführung falls Scripts bereits geladen sind
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', touchDetection);
} else {
  touchDetection();
}

window.addEventListener(
  "touchend",
  () => {
    if (!world) {
      hideWelcomeMessages(); // Explizit Willkommensnachrichten verstecken
      init();
      // Add delay to prevent audio interruption
      setTimeout(() => {
        if (soundManager && !soundManager.isMuted) {
          soundManager.playMusic("background", 0.2);
        }
      }, 100);
    }
  },
  { once: true }
);

window.addEventListener(
  "keydown",
  () => {
    if (!world) {
      hideWelcomeMessages(); // Explizit Willkommensnachrichten verstecken
      init();
      // Add delay to prevent audio interruption
      setTimeout(() => {
        if (soundManager && !soundManager.isMuted) {
          soundManager.playMusic("background", 0.2);
        }
      }, 100);
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
  const btnLeft = getCachedElement("btn-left");
  const btnRight = getCachedElement("btn-right");
  const btnJump = getCachedElement("btn-jump");
  const btnThrow = getCachedElement("btn-throw");

  btnLeft.addEventListener("touchstart", () => (keyboard.LEFT = true), { passive: true });
  btnLeft.addEventListener("touchend", () => (keyboard.LEFT = false), { passive: true });

  btnRight.addEventListener("touchstart", () => (keyboard.RIGHT = true), { passive: true });
  btnRight.addEventListener("touchend", () => (keyboard.RIGHT = false), { passive: true });

  btnJump.addEventListener("touchstart", () => (keyboard.UP = true), { passive: true });
  btnJump.addEventListener("touchend", () => (keyboard.UP = false), { passive: true });

  btnThrow.addEventListener("touchstart", () => (keyboard.SPACE = true), { passive: true });
  btnThrow.addEventListener("touchend", () => (keyboard.SPACE = false), { passive: true });
}

// Touch-Erkennung beim Laden der Seite ausführen
document.addEventListener('DOMContentLoaded', function() {
  touchDetection();
});

// Fallback für den Fall, dass DOMContentLoaded bereits ausgelöst wurde
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', touchDetection);
} else {
  touchDetection();
}
