let canvas;
let world;
let keyboard = new Keyboard();
let soundManager;
let muteStateAlreadyLoaded = false;
let currentLevel;
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


/**
 * Initializes the game with specified level parameters
 * @param {number} levelWidth - Width of the game level (default: 5000)
 * @param {number} levelNumber - Level number to initialize (default: 1)
 */
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
  showMobileControlsForGame(); // Show mobile controls when game starts
}


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
    try {
      soundManager.setupMusic("background", 0.2);
      if (!soundManager.isMuted) {
        soundManager.music.currentTime = 0;
        soundManager.music.play().catch(() => {});
      } else {
        soundManager.music.currentTime = 0;
      }
    } catch (error) {
      console.warn("Audio playback failed:", error);
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
  const isTouchDevice = detectTouchDevice();
  adjustUIForDevice(isTouchDevice);
}


/**
 * Detects if the current device supports touch input
 * @returns {boolean} True if touch device, false otherwise
 */
function detectTouchDevice() {
  const hasTouchScreen = "ontouchstart" in window ||
    navigator.maxTouchPoints > 0 ||
    navigator.msMaxTouchPoints > 0;
  const isMobileUserAgent = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  const hasCoarsePointer = window.matchMedia && window.matchMedia("(pointer: coarse)").matches;
  const hasOrientation = window.orientation !== undefined;
  const isSmallScreen = window.innerWidth <= 768 || window.innerHeight <= 600;  
  return hasTouchScreen || isMobileUserAgent || hasCoarsePointer || hasOrientation || isSmallScreen;
}


/**
 * Gets UI elements for device adjustment
 * @returns {Object} Object containing UI elements
 */
function getUIElements() {
  return {
    desktop: document.getElementById("desktop-welcome"),
    mobile: document.getElementById("mobile-welcome"),
    controls: document.getElementById("mobile-controls"),
    impressum: document.getElementById("impressum-wrapper")
  };
}

/**
 * Sets element visibility based on device type
 * @param {Object} elements - UI elements object
 * @param {boolean} isTouchDevice - Whether device supports touch
 */
function setElementVisibility(elements, isTouchDevice) {
  elements.desktop.style.display = isTouchDevice ? "none" : "flex";
  elements.mobile.style.display = isTouchDevice ? "flex" : "none";
  elements.impressum.style.display = isTouchDevice ? "block" : "none";
}

/**
 * Adjusts UI elements based on device type
 * @param {boolean} isTouchDevice - Whether device supports touch
 */
function adjustUIForDevice(isTouchDevice) {
  const elements = getUIElements();
  setElementVisibility(elements, isTouchDevice);
  if (elements.controls) elements.controls.style.setProperty("display", "none", "important");
}
document.addEventListener('DOMContentLoaded', function() {
  touchDetection();
});
window.addEventListener('load', function() {
  touchDetection();
});
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', touchDetection);
} else {
  touchDetection();
}


/**
 * Checks if touch target is impressum related
 * @param {Event} e - Touch event
 * @returns {boolean} True if target is impressum related
 */
function isImpressumTarget(e) {
  return e.target.id === 'mobile-impressum-btn' || 
         e.target.id === 'impressum-wrapper' ||
         e.target.closest('#mobile-impressum-btn') ||
         e.target.closest('#impressum-wrapper') ||
         e.target.classList.contains('mobile-impressum-btn') ||
         e.target.classList.contains('impressum-wrapper');
}

/**
 * Starts the game and initializes audio
 */
function startGame() {
  if (!world) {
    hideWelcomeMessages();
    init();
    setTimeout(() => {
      if (soundManager && !soundManager.isMuted) {
        soundManager.playMusic("background", 0.2);
      }
    }, 100);
  }
}

/**
 * Sets up mobile touch listener for game start
 * @param {HTMLElement} startMessage - Mobile start message element
 */
function setupMobileTouchListener(startMessage) {
  startMessage.addEventListener("touchend", (e) => {
    if (isImpressumTarget(e)) {
      console.log("Impressum Button/Wrapper detected - preventing game start");
      e.preventDefault(); e.stopPropagation(); return false;
    }
    const impressumWrapper = document.getElementById('impressum-wrapper');
    if (impressumWrapper && impressumWrapper.contains(e.target)) {
      console.log("Touch inside Impressum Wrapper - preventing game start");
      e.preventDefault(); e.stopPropagation(); return false;
    }
    startGame();
  }, { once: true });
}

/**
 * Sets up keyboard listener for desktop game start
 */
function setupDesktopKeyboardListener() {
  window.addEventListener("keydown", () => {
    startGame();
  }, { once: true });
}

/**
 * Sets up game start listeners for mobile and desktop
 */
function setupGameStartListeners() {
  const mobileWelcome = document.getElementById("mobile-welcome");
  const mobileStartMessage = mobileWelcome ? mobileWelcome.querySelector(".start-message") : null;
  
  if (mobileStartMessage) {
    setupMobileTouchListener(mobileStartMessage);
  }
  setupDesktopKeyboardListener();
}



// Setup on DOMContentLoaded
document.addEventListener('DOMContentLoaded', function() {
  touchDetection();
  setupGameStartListeners();
  setupMobileImpressumButton();
});


/**
 * Event Listener for key press - sets keyboard state to true
 * Handles movement and action keys (arrow keys and spacebar)
 * @param {KeyboardEvent} button - The keyboard event
 */
window.addEventListener("keydown", (button) => {
  if (button.keyCode == 39) keyboard.RIGHT = true;
  if (button.keyCode == 37) keyboard.LEFT = true;
  if (button.keyCode == 38) keyboard.UP = true;
  if (button.keyCode == 40) keyboard.DOWN = true;
  if (button.keyCode == 32) keyboard.SPACE = true;
});


/**
 * Event Listener for key release - sets keyboard state to false
 * Handles movement and action keys (arrow keys and spacebar)
 * @param {KeyboardEvent} button - The keyboard event
 */
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
  
  btnLeft.addEventListener("touchstart", (e) => { e.preventDefault(); keyboard.LEFT = true; }, { passive: false });
  btnLeft.addEventListener("touchend", (e) => { e.preventDefault(); keyboard.LEFT = false; }, { passive: false });
  btnRight.addEventListener("touchstart", (e) => { e.preventDefault(); keyboard.RIGHT = true; }, { passive: false });
  btnRight.addEventListener("touchend", (e) => { e.preventDefault(); keyboard.RIGHT = false; }, { passive: false });
  btnJump.addEventListener("touchstart", (e) => { e.preventDefault(); keyboard.UP = true; }, { passive: false });
  btnJump.addEventListener("touchend", (e) => { e.preventDefault(); keyboard.UP = false; }, { passive: false });
  btnThrow.addEventListener("touchstart", (e) => { e.preventDefault(); keyboard.SPACE = true; }, { passive: false });
  btnThrow.addEventListener("touchend", (e) => { e.preventDefault(); keyboard.SPACE = false; }, { passive: false });
}
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', touchDetection);
} else {
  touchDetection();
}
