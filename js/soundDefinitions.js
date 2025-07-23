/**
 * @fileoverview Sound definitions and audio setup utilities
 * Contains sound configuration for the El Pollo Loco game
 */

/**
 * Gets array of all game sound definitions
 * @returns {Array} Array of sound objects with key, src and loop properties
 */

function getSoundDefinitions() {
  return [
    ...getBackgroundSounds(),
    ...getPlayerSounds(),
    ...getGameSounds()
  ];
}

/**
 * Gets background and music sound definitions
 * @returns {Array} Background sounds array
 */

function getBackgroundSounds() {
  return [
    { key: "background", src: "audio/flamenco-guitar-duo-flamenco-spanish-guitar-music-1614.mp3", loop: true }
  ];
}

/**
 * Gets player action sound definitions
 * @returns {Array} Player sounds array
 */

function getPlayerSounds() {
  return [
    { key: "hurt", src: "audio/Hurt.mp3" },
    { key: "jump", src: "audio/Jump.mp3" },
    { key: "orale", src: "audio/Orale.mp3" },
    { key: "ay_dios_mio", src: "audio/Ay Dios Mio.mp3" },
    { key: "running", src: "audio/running-on-gravel-301880.mp3" },
    { key: "jump_on_enemy", src: "audio/jump-up-245782.mp3" },
    { key: "snore", src: "audio/snoring-8486.mp3" }
  ];
}

/**
 * Gets game object sound definitions
 * @returns {Array} Game object sounds array
 */

function getGameSounds() {
  return [
    { key: "coin", src: "audio/coin-recieved-230517.mp3" },
    { key: "bottle", src: "audio/glass-bottle-clink-90671.mp3" },
    { key: "throw_fly", src: "audio/flying-blade-103343.mp3" },
    { key: "throw_splash", src: "audio/bottle-break-39916.mp3" },
    { key: "bottle_hit_boss", src: "audio/bottle-hit-boss.mp3" },
    { key: "won", src: "audio/won.mp3" },
    { key: "lost", src: "audio/Lost.mp3" }
  ];
}
