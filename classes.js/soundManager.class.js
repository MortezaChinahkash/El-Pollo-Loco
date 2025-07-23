class SoundManager {
  /**
   * Creates a new SoundManager to manage all game audio files
   * Initializes sounds dictionary, music reference and mute status
   */
  constructor() {
    this.sounds = {};
    this.music = null;
    this.isMuted = false;  }
  /**
   * Unlocks audio playback after user interaction
   * Required for modern browser autoplay policies
   */
  unlockAudio() {
    Object.values(this.sounds).forEach((audio) => {
      try {
        audio.muted = false;
        audio.play().then(() => audio.pause()).catch(() => {});
      } catch {}
    });  }
  /**
   * Loads an audio file and adds it to the sounds collection
   * @param {string} name - Name/ID for the sound
   * @param {string} path - Path to the audio file
   * @param {boolean} [loop=false] - Whether the sound should loop
   */
  loadSound(name, path, loop = false) {
    const audio = new Audio(path);
    audio.loop = loop;
    this.sounds[name] = audio;  }
  /**
   * Stops all currently playing sounds and resets them
   * Useful when pausing or restarting the game
   */
  stopAll() {
    for (const audio of Object.values(this.sounds)) {
      audio.pause();
      audio.currentTime = 0;
    }  }
  /**
   * Plays a sound effect once
   * @param {string} name - Name of the sound
   * @param {number} [volume=1.0] - Volume (0.0 to 1.0)
   */
  playSound(name, volume = 1.0) {
    if (this.isMuted) return;
    const sound = this.sounds[name];
    if (!sound) return;
    try {
      sound.pause();
      sound.currentTime = 0;
      sound.volume = volume;
      sound.play().catch(() => {});
    } catch {}  }
  /**
   * Plays background music in continuous loop
   * Stops previous music and starts new
   * @param {string} name - Name of the music file
   * @param {number} [volume=0.5] - Volume (0.0 to 1.0)
   */
  playMusic(name, volume = 0.5) {
    const music = this.sounds[name];
    if (!music) return;
    if (this.music && this.music !== music && !this.music.paused) {
      try {
        this.music.pause();
      } catch {}
    }
    this.music = music;
    this.music.loop = true;
    this.music.volume = volume;
    this.music.currentTime = 0;
    if (!this.isMuted && this.music.paused) {
      this.music.play().catch(() => {});
    }  }
  /**
   * Pauses the currently playing background music
   */
  pauseMusic() {
    if (this.music) this.music.pause();  }
  /**
   * Schaltet zwischen Stummschaltung und normaler Wiedergabe um
   * Speichert den Status im localStorage für Persistenz
   */
  toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.music) {
      this.music.muted = this.isMuted;
      if (!this.isMuted && this.music.paused) {
        this.music.play().catch(() => {});
      }
    }
    localStorage.setItem("soundMuted", this.isMuted ? "true" : "false");  }
  /**
   * Setzt die Lautstärke der aktuell abspielenden Hintergrundmusik
   * @param {number} value - Lautstärke zwischen 0.0 und 1.0
   */
  setMusicVolume(value) {
    if (this.music) this.music.volume = Math.min(Math.max(value, 0), 1);  }
  /**
   * Setzt die Lautstärke eines spezifischen Sound-Effekts
   * @param {string} name - Name des Sounds
   * @param {number} value - Lautstärke zwischen 0.0 und 1.0
   */
  setEffectVolume(name, value) {
    const sound = this.sounds[name];
    if (sound) sound.volume = Math.min(Math.max(value, 0), 1);
  }
}
