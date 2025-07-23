let canvas;
let world;
let keyboard = new Keyboard();
let soundManager;
let muteStateAlreadyLoaded = false;
let currentLevel;

// Performance optimization: Cache DOM elements
let cachedElements = {};

/**
 * Gets cached DOM element by ID to improve performance
 * @param {string} id - Element ID to retrieve
 * @returns {HTMLElement} Cached DOM element
 */
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

/**
 * Sets up the main game UI and interface elements
 */
function setupUI() {
  setupGameCanvas();
  hideWelcomeElements();
  configureMobileControls();
  hideGameControlButtons();
}

/**
 * Sets up the game canvas and hides loading screen
 */
function setupGameCanvas() {
  canvas = getCachedElement("canvas");
  canvas.style.display = "block";
  getCachedElement("loading-screen").style.display = "none";
}

/**
 * Hides all welcome and intro elements
 */
function hideWelcomeElements() {
  hideWelcomeMessages();
  
  const introText = document.querySelector(".intro-text");
  if (introText) {
    introText.style.display = "none";
  }
}

/**
 * Configures mobile controls based on device detection
 */
function configureMobileControls() {
  showMobileControlsForGameplay();
  
  setTimeout(() => {
    const mobileControls = getCachedElement("mobile-controls");
    const isDisplayed = window.getComputedStyle(mobileControls).display !== "none";
    
    if (!isDisplayed && isTouchDeviceDetected()) {
      mobileControls.style.setProperty("display", "flex", "important");
      mobileControls.style.setProperty("visibility", "visible", "important");
    } else if (isDisplayed && !isTouchDeviceDetected()) {
      mobileControls.style.setProperty("display", "none", "important");
      mobileControls.style.setProperty("visibility", "hidden", "important");
    }
  }, 100);
}

/**
 * Hides game control buttons (restart, next level, home)
 */
function hideGameControlButtons() {
  const restartBtn = getCachedElement("restartBtn");
  const nextBtn = getCachedElement("nextLevelBtn");
  const homeBtn = getCachedElement("homeBtn");
  if (restartBtn) restartBtn.style.display = "none";
  if (nextBtn) nextBtn.style.display = "none";
  if (homeBtn) homeBtn.style.display = "none";
}

// Diese Funktionen sind in uiUtils.js ausgelagert

/**
 * Sets up all overlay button functionalities
 */
function setupOverlayButtons() {
  setupMuteButton();
  setupFullscreenButton();
  setupHelpButton();
  setupHomeButton();
}

/**
 * Sets up mute button functionality and state management
 */
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

/**
 * Sets up fullscreen toggle button functionality
 */
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

/**
 * Sets up help overlay button and click handlers
 */
function setupHelpButton() {
  const elements = getHelpElements();
  setupHelpClickHandlers(elements);
  setupHelpOverlayHandler(elements);
}

/**
 * Gets all help-related DOM elements
 * @returns {Object} Object containing help elements
 */
function getHelpElements() {
  return {
    helpBtn: getCachedElement("helpBtn"),
    helpOverlay: getCachedElement("helpOverlay"),
    closeHelp: getCachedElement("closeHelp"),
    helpContent: document.querySelector(".help-content")
  };
}

/**
 * Sets up click handlers for help button and close button
 * @param {Object} elements - Help elements object
 */
function setupHelpClickHandlers(elements) {
  elements.helpBtn.addEventListener("click", () => {
    elements.helpOverlay.style.display = "flex";
  });

  elements.closeHelp.addEventListener("click", () => {
    elements.helpOverlay.style.display = "none";
  });
}

/**
 * Sets up overlay click handler to close help when clicking outside
 * @param {Object} elements - Help elements object
 */
function setupHelpOverlayHandler(elements) {
  elements.helpOverlay.addEventListener("click", (event) => {
    if (!elements.helpContent.contains(event.target)) {
      elements.helpOverlay.style.display = "none";
    }
  });
}

/**
 * Sets up home button to reload the page
 */
function setupHomeButton() {
  const homeBtn = getCachedElement("homeBtn");
  
  homeBtn.addEventListener("click", () => {
    // Seite neu laden
    window.location.reload();
  });
}

/**
 * Initializes a level with specified dimensions
 * @param {number} levelWidth - Width of the level
 * @param {number} levelNumber - Level number
 * @returns {Level} Created level instance
 */
function initializeLevel(levelWidth, levelNumber) {
  return createLevel(levelWidth, levelNumber);
}

/**
 * Initializes the game world with the current level
 * @param {Level} currentLevel - Level to initialize world with
 */
function initializeGameWorld(currentLevel) {
  world = new World(canvas, keyboard, currentLevel);
}

/**
 * Sets up input handling for touch and mobile controls
 */
function setupInput() {
  touchDetection();
  setupMobileControls();
  // Mobile Controls werden in setupUI() aktiviert, nicht hier
}

// showMobileControlsForGameplay ist in uiUtils.js ausgelagert

/**
 * Hides mobile controls by setting display and visibility to hidden
 */
function hideMobileControls() {
  const mobileControls = getCachedElement("mobile-controls");
  if (mobileControls) {
    mobileControls.style.display = "none";
    mobileControls.style.visibility = "hidden";
  }
}

// Diese Funktionen sind in uiUtils.js ausgelagert

// Globale Verfügbarkeit für Debugging
window.forceMobileControls = forceMobileControls;

/**
 * Sets up the audio system and loads all game sounds
 */
function setupAudio() {
  initializeSoundManager();
  loadAllGameSounds();
  startBackgroundMusic();
}

/**
 * Initializes the sound manager and loads mute state
 */
function initializeSoundManager() {
  if (!soundManager) {
    soundManager = new SoundManager();

    if (!muteStateAlreadyLoaded) {
      const isMuted = localStorage.getItem("soundMuted") === "true";
      soundManager.isMuted = isMuted;
      muteStateAlreadyLoaded = true;
    }
  }
  soundManager.stopAll();
}

/**
 * Loads all game sounds into the sound manager
 */
function loadAllGameSounds() {
  const sounds = getSoundDefinitions();
  sounds.forEach(sound => {
    soundManager.loadSound(sound.key, sound.src, sound.loop || false);
  });
  refreshMuteButton(soundManager.isMuted);
}

/**
 * Starts background music with delay to prevent audio errors
 */
function startBackgroundMusic() {
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

/**
 * Loads mute state from localStorage if not already loaded
 */
function loadMuteStateFromLocalStorage() {
  if (muteStateAlreadyLoaded) return;

  const isMuted = localStorage.getItem("soundMuted") === "true";
  soundManager.isMuted = isMuted;
  refreshMuteButton(isMuted);
  startMusicWhenNotMuted(isMuted);

  muteStateAlreadyLoaded = true; 
}

/**
 * Updates mute button display based on current mute state
 * @param {boolean} isMuted - Current mute state
 */
function refreshMuteButton(isMuted) {
  const muteBtn = getCachedElement("muteBtn");
  if (muteBtn) {
    muteBtn.textContent = isMuted ? "🔊" : "🔇";
  }
}

/**
 * Starts background music if not muted
 * @param {boolean} isMuted - Current mute state
 */
function startMusicWhenNotMuted(isMuted) {
  if (!isMuted) {
    try {
      soundManager.playMusic("background", 0.2);
    } catch (error) {
      console.warn("Audio playback failed:", error);
    }
  }
}

/**
 * Detects touch devices and adjusts UI interface accordingly
 */
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
  
  if (isTouchDevice) {
    // Touch-Gerät: Desktop verstecken, Mobile anzeigen
    if (desktopWelcome) desktopWelcome.style.display = "none";
    if (mobileWelcome) mobileWelcome.style.display = "flex";
    // Mobile Controls NICHT hier anzeigen - nur im aktiven Spiel
  } else {
    // Desktop: Desktop anzeigen, Mobile verstecken
    if (desktopWelcome) desktopWelcome.style.display = "flex";
    if (mobileWelcome) mobileWelcome.style.display = "none";
    if (mobileControls) mobileControls.style.display = "none";
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

/**
 * Creates a new level with specified parameters
 * @param {number} levelWidth - Width of the level
 * @param {number} levelNumber - Level number
 * @returns {Level} New level instance
 */
function createLevel(levelWidth, levelNumber) {
  return new Level([], [], [], levelWidth, levelNumber);
}

/**
 * Sets up mobile control button event listeners
 */
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
