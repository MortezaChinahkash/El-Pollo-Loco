/**
 * Character Audio Manager
 * Verwaltet alle Audio-Funktionen für den Character
 * @author Morteza Chinahkash
 * @version 1.0.0
 */
class CharacterAudioManager {
  /**
   * Creates a new character audio manager
   * @param {Character} character - The character to manage audio for
   */
  constructor(character) {
    this.character = character;
    this.lastHurtSoundTime = 0;
    this.hurtSoundCooldown = 1000;
    this.lastJumpSoundTime = 0;
    this.jumpSoundCooldown = 500;
    this.hasPlayedOrale = false;
    this.runningSoundInstance = null;
    this.isRunningSoundPlaying = false;
    this.lastBossHitSoundTime = 0;
    this.ayDiosMioCooldown = 2000;
  }

  /**
   * Plays hurt sound with cooldown
   * @param {number} now - Current timestamp
   */
  playHurtSoundWithCooldown(now) {
    if (
      typeof soundManager !== "undefined" &&
      now - this.lastHurtSoundTime >= this.hurtSoundCooldown
    ) {
      soundManager.playSound("hurt", 0.3);
      this.lastHurtSoundTime = now;
    }
  }

  /**
   * Plays sound when hit by endboss
   * @param {number} now - Current timestamp
   * @param {Object} source - Damage source
   */
  playSoundWhenMeetingEndboss(now, source) {
    if (
      typeof soundManager !== "undefined" &&
      source instanceof Endboss &&
      now - this.lastBossHitSoundTime >= this.ayDiosMioCooldown
    ) {
      soundManager.playSound("ay_dios_mio", 0.4);
      this.lastBossHitSoundTime = now;
    }
  }

  /**
   * Plays Orale sound once
   */
  playOraleSound() {
    if (!this.hasPlayedOrale && typeof soundManager !== "undefined") {
      soundManager.playSound("orale", 0.1);
      this.hasPlayedOrale = true;
    }
  }

  /**
   * Starts running sound
   */
  startRunningSound() {
    if (this.canStartRunningSound()) {
      this.initializeRunningSound();
    }
  }

  /**
   * Checks if running sound can be started
   * @returns {boolean} True if running sound can be started
   */
  canStartRunningSound() {
    return !this.runningSoundInstance &&
           !this.isRunningSoundPlaying &&
           typeof soundManager !== "undefined" &&
           !soundManager.isMuted;
  }

  /**
   * Initializes running sound
   */
  initializeRunningSound() {
    const sound = soundManager.sounds["running"];
    if (sound && sound.paused) {
      this.setupRunningSoundProperties(sound);
      this.playRunningSoundWithCallback(sound);
    }
  }

  /**
   * Sets sound properties
   * @param {HTMLAudioElement} sound - The audio element to configure
   */
  setupRunningSoundProperties(sound) {
    this.runningSoundInstance = sound;
    sound.loop = true;
    sound.volume = 0.25;
    sound.currentTime = 0;
  }

  /**
   * Plays sound with callback
   * @param {HTMLAudioElement} sound - The audio element to play
   */
  playRunningSoundWithCallback(sound) {
    sound.play()
      .then(() => {
        this.isRunningSoundPlaying = true;
      })
      .catch(() => {});
  }

  /**
   * Stops running sound
   */
  stopRunningSound() {
    if (this.runningSoundInstance) {
      if (!this.runningSoundInstance.paused) {
        this.runningSoundInstance.pause();
      }
      this.runningSoundInstance = null;
    }
    this.isRunningSoundPlaying = false;
  }

  /**
   * Plays jump sound with cooldown
   */
  playJumpSoundWithCooldown() {
    const now = Date.now();
    if (this.shouldPlayJumpSound(now)) {
      this.playJumpSoundWithSettings(now);
    }
  }

  /**
   * Checks if jump sound should be played
   * @param {number} now - Current timestamp
   * @returns {boolean} True if jump sound should be played
   */
  shouldPlayJumpSound(now) {
    return typeof soundManager !== "undefined" &&
           !soundManager.isMuted &&
           now - this.lastJumpSoundTime >= this.jumpSoundCooldown;
  }

  /**
   * Spielt Sprunggeräusch mit Einstellungen ab
   */
  playJumpSoundWithSettings(now) {
    const sound = soundManager.sounds["jump"];
    if (sound) {
      this.configureAndPlayJumpSound(sound, now);
    }
  }

  /**
   * Konfiguriert und spielt Sprunggeräusch ab
   */
  configureAndPlayJumpSound(sound, now) {
    sound.pause();
    sound.currentTime = 0.3;
    sound.volume = 0.1;
    sound.play().catch(() => {});
    this.lastJumpSoundTime = now;
  }
}
