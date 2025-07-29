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
    this.snoreSoundInstance = null;
    this.isSnoringSoundPlaying = false;
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
    return (
      !this.runningSoundInstance &&
      !this.isRunningSoundPlaying &&
      typeof soundManager !== "undefined" &&
      !soundManager.isMuted
    );
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
    sound
      .play()
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
    return (
      typeof soundManager !== "undefined" &&
      !soundManager.isMuted &&
      now - this.lastJumpSoundTime >= this.jumpSoundCooldown
    );
  }

  /**
   * Plays jump sound with settings
   * @param {number} now - Current timestamp
   */
  playJumpSoundWithSettings(now) {
    const sound = soundManager.sounds["jump"];
    if (sound) {
      this.configureAndPlayJumpSound(sound, now);
    }
  }

  /**
   * Configures and plays jump sound
   * @param {HTMLAudioElement} sound - The audio element to configure
   * @param {number} now - Current timestamp
   */
  configureAndPlayJumpSound(sound, now) {
    sound.pause();
    sound.currentTime = 0.3;
    sound.volume = 0.1;
    sound.play().catch(() => {});
    this.lastJumpSoundTime = now;
  }

  /**
   * Starts snoring sound for long idle state
   */
  startSnoreSound() {
    if (this.canStartSnoreSound()) {
      this.initializeSnoreSound();
    }
  }

  /**
   * Checks if snore sound can be started
   * @returns {boolean} True if snore sound can be started
   */
  canStartSnoreSound() {
    return (
      !this.snoreSoundInstance &&
      !this.isSnoringSoundPlaying &&
      typeof soundManager !== "undefined" &&
      !soundManager.isMuted
    );
  }

  /**
   * Initializes snore sound
   */
  initializeSnoreSound() {
    const sound = soundManager.sounds["snore"];
    if (sound && sound.paused) {
      this.setupSnoreSoundProperties(sound);
      this.playSnoreSoundWithCallback(sound);
    }
  }

  /**
   * Sets snore sound properties
   * @param {HTMLAudioElement} sound - The audio element to configure
   */
  setupSnoreSoundProperties(sound) {
    this.snoreSoundInstance = sound;
    sound.loop = true;
    sound.volume = 0.5;
    sound.currentTime = 0;
  }

  /**
   * Plays snore sound with callback
   * @param {HTMLAudioElement} sound - The audio element to play
   */
  playSnoreSoundWithCallback(sound) {
    sound
      .play()
      .then(() => {
        this.isSnoringSoundPlaying = true;
      })
      .catch(() => {});
  }

  /**
   * Stops snoring sound
   */
  stopSnoreSound() {
    if (this.snoreSoundInstance) {
      if (!this.snoreSoundInstance.paused) {
        this.snoreSoundInstance.pause();
      }
      this.snoreSoundInstance = null;
    }
    this.isSnoringSoundPlaying = false;
  }
}
