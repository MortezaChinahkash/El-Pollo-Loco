/**
 * @fileoverview UI utilities for welcome messages and mobile controls
 * Contains functions for managing welcome screen display and mobile UI
 */

/**
 * Hides all welcome messages and start screens
 */

function hideWelcomeMessages() {
  hideWelcomeElementsById();
  hideWelcomeElementsByClass();
  hideAllStartMessages();
}

/**
 * Hides welcome elements by their IDs
 */

function hideWelcomeElementsById() {
  const desktopWelcome = document.getElementById("desktop-welcome");
  const mobileWelcome = document.getElementById("mobile-welcome");
  if (desktopWelcome) {
    desktopWelcome.style.display = "none";
  }

  if (mobileWelcome) {
    mobileWelcome.style.display = "none";
  }
}

/**
 * Hides welcome elements by their CSS classes
 */

function hideWelcomeElementsByClass() {
  const desktopWelcomeClass = document.querySelector(".desktop-welcome");
  const mobileWelcomeClass = document.querySelector(".mobile-welcome");
  if (desktopWelcomeClass) {
    desktopWelcomeClass.style.display = "none";
  }

  if (mobileWelcomeClass) {
    mobileWelcomeClass.style.display = "none";
  }
}

/**
 * Hides all start message elements
 */

function hideAllStartMessages() {
  const allStartMessages = document.querySelectorAll(".start-message");
  allStartMessages.forEach((message) => {
    const parent = message.parentElement;
    if (parent && isWelcomeParent(parent)) {
      parent.style.display = "none";
    }
  });
}

/**
 * Checks if element is a welcome parent container
 * @param {HTMLElement} parent - Parent element to check
 * @returns {boolean} True if element is a welcome parent
 */

function isWelcomeParent(parent) {
  return parent.id === 'desktop-welcome' ||
         parent.id === 'mobile-welcome' ||
         parent.classList.contains('desktop-welcome') ||
         parent.classList.contains('mobile-welcome');
}

/**
 * Enhanced touch device detection using multiple criteria
 * @returns {boolean} True if touch device is detected
 */

function isTouchDeviceDetected() {
  const touchIndicators = getTouchIndicators();
  const touchCount = touchIndicators.filter(Boolean).length;
  return touchCount >= 2 || (touchIndicators[0] && touchIndicators[1]);
}

/**
 * Gets array of touch detection indicators
 * @returns {Array<boolean>} Array of touch detection results
 */

function getTouchIndicators() {
  const hasTouchScreen = "ontouchstart" in window ||
    navigator.maxTouchPoints > 0 ||
    navigator.msMaxTouchPoints > 0;
  const isMobileUserAgent = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  const hasCoarsePointer = window.matchMedia && window.matchMedia("(pointer: coarse)").matches;
  const hasOrientation = window.orientation !== undefined;
  return [hasTouchScreen, isMobileUserAgent, hasCoarsePointer, hasOrientation];
}

/**
 * Emergency function to manually show mobile controls (for debugging)
 * @returns {boolean} True if controls were successfully activated
 */

function forceMobileControls() {
  const mobileControls = document.getElementById("mobile-controls");
  if (!isTouchDeviceDetected()) {
    logMobileControlsWarning();
  }

  if (mobileControls) {
    applyForcedMobileStyles(mobileControls);
    return true;
  }
  return false;
}

/**
 * Logs warning when mobile controls are forced on desktop
 */

function logMobileControlsWarning() {
  console.warn("⚠️ Warnung: Mobile Controls sollten nicht auf Desktop-Geräten aktiviert werden!");
}

/**
 * Applies forced styling to mobile controls
 * @param {HTMLElement} mobileControls - Mobile controls element
 */

function applyForcedMobileStyles(mobileControls) {
  mobileControls.style.setProperty("display", "flex", "important");
  mobileControls.style.setProperty("visibility", "visible", "important");
  mobileControls.style.setProperty("position", "fixed", "important");
  mobileControls.style.setProperty("bottom", "10px", "important");
  mobileControls.style.setProperty("z-index", "1000", "important");
  mobileControls.style.setProperty("width", "100%", "important");
  mobileControls.style.setProperty("justify-content", "space-between", "important");
}

/**
 * Shows mobile controls for touch devices during gameplay
 */

function showMobileControlsForGameplay() {
  const isTouchDevice = detectBasicTouchDevice();
  const mobileControls = getCachedElement("mobile-controls");
  if (isTouchDevice && mobileControls) {
    showMobileControlsForTouch(mobileControls);
  } else {
    hideMobileControlsForDesktop(mobileControls);
  }
}

/**
 * Detects basic touch device capabilities
 * @returns {boolean} True if basic touch device detected
 */

function detectBasicTouchDevice() {
  return "ontouchstart" in window ||
    navigator.maxTouchPoints > 0 ||
    navigator.msMaxTouchPoints > 0 ||
    (window.matchMedia && window.matchMedia("(pointer: coarse)").matches);
}

/**
 * Shows mobile controls for touch devices
 * @param {HTMLElement} mobileControls - Mobile controls element
 */

function showMobileControlsForTouch(mobileControls) {
  mobileControls.style.setProperty("display", "flex", "important");
  mobileControls.style.setProperty("visibility", "visible", "important");
  mobileControls.style.setProperty("position", "fixed", "important");
  mobileControls.style.setProperty("bottom", "10px", "important");
  mobileControls.style.setProperty("z-index", "1000", "important");
}

/**
 * Hides mobile controls for desktop devices
 * @param {HTMLElement} mobileControls - Mobile controls element
 */

function hideMobileControlsForDesktop(mobileControls) {
  if (mobileControls) {
    mobileControls.style.setProperty("display", "none", "important");
    mobileControls.style.setProperty("visibility", "hidden", "important");
  }
}
