/**
 * Game Helper Functions - Safe UI Helpers
 * Contains only non-critical UI helper functions (NO touch detection)
 */

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
    window.location.reload();
  });
}

/**
 * Configures mobile controls based on device detection
 */
function configureMobileControls() {
  const mobileControls = getCachedElement("mobile-controls");
  const isTouchDevice = detectTouchDevice();
  
  if (!isTouchDevice && mobileControls) {
    mobileControls.style.setProperty("display", "none", "important");
    mobileControls.style.setProperty("visibility", "hidden", "important");
  }
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
      localStorage.setItem(
        "soundMuted",
        soundManager.isMuted ? "true" : "false"
      );
      muteBtn.textContent = soundManager.isMuted ? "🔊" : "🔇";
    }
  };
}

/**
 * Prevents event bubbling for impressum wrapper
 * @param {HTMLElement} wrapper - Impressum wrapper element
 */
function setupWrapperEvents(wrapper) {
  const preventBubbling = (e) => {
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();
  };
  
  wrapper.addEventListener("touchstart", (e) => {
    preventBubbling(e);
    console.log("Touch start on wrapper - preventing bubbling");
  }, { passive: false });
  
  wrapper.addEventListener("touchmove", preventBubbling, { passive: false });
  wrapper.addEventListener("touchend", (e) => {
    preventBubbling(e);
    console.log("Touch end on wrapper - preventing bubbling");
  }, { passive: false });
}

/**
 * Sets up button events for impressum navigation
 * @param {HTMLElement} btn - Impressum button element
 */
function setupButtonEvents(btn) {
  const preventBubbling = (e) => {
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();
  };
  
  btn.addEventListener("touchstart", (e) => {
    preventBubbling(e);
    console.log("Touch start on button");
  }, { passive: false });
  
  btn.addEventListener("touchend", (e) => {
    preventBubbling(e);
    console.log("Impressum Button clicked - opening impressum.html");
    window.location.href = "impressum.html";
  }, { passive: false });
  
  btn.addEventListener("click", (e) => {
    preventBubbling(e);
    console.log("Click event on button - opening impressum.html");
    window.location.href = "impressum.html";
  });
}

/**
 * Sets up mobile impressum button with event prevention
 */
function setupMobileImpressumButton() {
  const impressumWrapper = document.getElementById("impressum-wrapper");
  const impressumBtn = document.getElementById("mobile-impressum-btn");
  
  if (impressumWrapper && impressumBtn) {
    setupWrapperEvents(impressumWrapper);
    setupButtonEvents(impressumBtn);
  }
}