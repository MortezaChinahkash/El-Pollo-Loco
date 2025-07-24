/**
 * Game Helper Functions - Safe UI Helpers
 * Contains non-critical UI helper functions that can be safely outsourced
 */

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
 * Sets up help overlay button and click handlers
 */
function setupHelpButton() {
  const elements = getHelpElements();
  setupHelpClickHandlers(elements);
  setupHelpOverlayHandler(elements);
}

/**
 * Sets up home button to reload the page
 */
function setupHomeButton() {
  const homeBtn = getCachedElement("homeBtn");
  homeBtn.addEventListener("click", () => {
    window.location.reload();
  });
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
