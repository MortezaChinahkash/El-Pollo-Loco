/**
 * @fileoverview UI utilities for welcome messages and mobile controls
 * Contains functions for managing welcome screen display and mobile UI
 */

/**
 * Hides all welcome messages and start screens
 */
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
  }
  if (mobileWelcome) {
    mobileWelcome.style.display = "none";
  }
  if (desktopWelcomeClass) {
    desktopWelcomeClass.style.display = "none";
  }
  if (mobileWelcomeClass) {
    mobileWelcomeClass.style.display = "none";
  }
  
  // Sicherheit: Alle Start-Nachrichten verstecken
  allStartMessages.forEach((message, index) => {
    if (message.parentElement && (message.parentElement.id === 'desktop-welcome' || message.parentElement.id === 'mobile-welcome' || message.parentElement.classList.contains('desktop-welcome') || message.parentElement.classList.contains('mobile-welcome'))) {
      message.parentElement.style.display = "none";
    }
  });
}

/**
 * Enhanced touch device detection using multiple criteria
 * @returns {boolean} True if touch device is detected
 */
function isTouchDeviceDetected() {
  // Verbesserte Touch-Detection mit mehreren Prüfungen
  const hasTouchScreen = "ontouchstart" in window ||
    navigator.maxTouchPoints > 0 ||
    navigator.msMaxTouchPoints > 0;
    
  const isMobileUserAgent = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  
  const hasCoarsePointer = window.matchMedia && window.matchMedia("(pointer: coarse)").matches;
  
  const hasOrientation = window.orientation !== undefined;
  
  // Nur als Touch-Gerät erkennen wenn mindestens 2 Kriterien erfüllt sind
  const touchIndicators = [hasTouchScreen, isMobileUserAgent, hasCoarsePointer, hasOrientation];
  const touchCount = touchIndicators.filter(Boolean).length;
  
  return touchCount >= 2 || (hasTouchScreen && isMobileUserAgent);
}

/**
 * Emergency function to manually show mobile controls (for debugging)
 * @returns {boolean} True if controls were successfully activated
 */
function forceMobileControls() {
  const mobileControls = document.getElementById("mobile-controls");
  
  if (!isTouchDeviceDetected()) {
    console.warn("⚠️ Warnung: Mobile Controls sollten nicht auf Desktop-Geräten aktiviert werden!");
  }
  
  if (mobileControls) {
    mobileControls.style.setProperty("display", "flex", "important");
    mobileControls.style.setProperty("visibility", "visible", "important");
    mobileControls.style.setProperty("position", "fixed", "important");
    mobileControls.style.setProperty("bottom", "10px", "important");
    mobileControls.style.setProperty("z-index", "1000", "important");
    mobileControls.style.setProperty("width", "100%", "important");
    mobileControls.style.setProperty("justify-content", "space-between", "important");

    return true;
  }
  return false;
}

/**
 * Shows mobile controls for touch devices during gameplay
 */
function showMobileControlsForGameplay() {
  const isTouchDevice = 
    "ontouchstart" in window ||
    navigator.maxTouchPoints > 0 ||
    navigator.msMaxTouchPoints > 0 ||
    (window.matchMedia && window.matchMedia("(pointer: coarse)").matches);
    
  const mobileControls = getCachedElement("mobile-controls");
  
  // Nur auf Touch-Geräten anzeigen, auf Desktop IMMER versteckt lassen
  if (isTouchDevice && mobileControls) {
    // Explizite CSS-Übersteuerung für Touch-Geräte
    mobileControls.style.setProperty("display", "flex", "important");
    mobileControls.style.setProperty("visibility", "visible", "important");
    mobileControls.style.setProperty("position", "fixed", "important");
    mobileControls.style.setProperty("bottom", "10px", "important");
    mobileControls.style.setProperty("z-index", "1000", "important");
    
    console.log("Mobile Controls aktiviert für Touch-Gerät");
  } else {
    // Desktop: Mobile Controls explizit verstecken
    if (mobileControls) {
      mobileControls.style.setProperty("display", "none", "important");
      mobileControls.style.setProperty("visibility", "hidden", "important");
    }
    console.log("Desktop-Gerät erkannt - Mobile Controls bleiben versteckt");
  }
}
