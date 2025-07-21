/**
 * Character Audio Manager
 * Verwaltet alle Audio-Funktionen für den Character
 * @author Morteza Chinahkash
 * @version 1.0.0
 */

class CharacterAudioManager {
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
   * Spielt Verletzungsgeräusch mit Cooldown ab
   * @param {number} now - Aktueller Zeitstempel
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
   * Spielt Sound ab wenn vom Endboss getroffen
   * @param {number} now - Aktueller Zeitstempel
   * @param {Object} source - Schadenquelle
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
   * Spielt Orale-Sound einmalig ab
   */
  playOraleSound() {
    if (!this.hasPlayedOrale && typeof soundManager !== "undefined") {
      soundManager.playSound("orale", 0.1);
      this.hasPlayedOrale = true;
    }
  }

  /**
   * Startet Laufgeräusch
   */
  startRunningSound() {
    if (this.canStartRunningSound()) {
      this.initializeRunningSound();
    }
  }

  /**
   * Prüft ob Laufgeräusch gestartet werden kann
   */
  canStartRunningSound() {
    return !this.runningSoundInstance && 
           !this.isRunningSoundPlaying && 
           typeof soundManager !== "undefined" && 
           !soundManager.isMuted;
  }

  /**
   * Initialisiert Laufgeräusch
   */
  initializeRunningSound() {
    const sound = soundManager.sounds["running"];
    if (sound && sound.paused) {
      this.setupRunningSoundProperties(sound);
      this.playRunningSoundWithCallback(sound);
    }
  }

  /**
   * Setzt Sound-Eigenschaften
   */
  setupRunningSoundProperties(sound) {
    this.runningSoundInstance = sound;
    sound.loop = true;
    sound.volume = 0.25;
    sound.currentTime = 0;
  }

  /**
   * Spielt Sound mit Callback ab
   */
  playRunningSoundWithCallback(sound) {
    sound.play()
      .then(() => {
        this.isRunningSoundPlaying = true;
      })
      .catch(() => {});
  }

  /**
   * Stoppt Laufgeräusch
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
   * Spielt Sprunggeräusch mit Cooldown ab
   */
  playJumpSoundWithCooldown() {
    const now = Date.now();
    if (this.shouldPlayJumpSound(now)) {
      this.playJumpSoundWithSettings(now);
    }
  }

  /**
   * Prüft ob Sprunggeräusch abgespielt werden soll
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
