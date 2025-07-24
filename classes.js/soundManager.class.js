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
   * Sets up background music reference without playing
   * @param {string} name - Name of the music file
   * @param {number} [volume=0.5] - Volume (0.0 to 1.0)
   */
  setupMusic(name, volume = 0.5) {
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
  }

  /**
   * Plays background music in continuous loop
   * Stops previous music and starts new
   * @param {string} name - Name of the music file
   * @param {number} [volume=0.5] - Volume (0.0 to 1.0)
   */
  playMusic(name, volume = 0.5) {
    this.setupMusic(name, volume);
    if (!this.isMuted) {
      this.music.play().catch(() => {});
    }  }

  /**
   * Pauses the currently playing background music
   */
  pauseMusic() {
    if (this.music) this.music.pause();  }

  /**
   * Toggles between mute and normal playback
   * Saves status in localStorage for persistence
   */
  toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.music) {
      if (!this.isMuted) {
        // Unmuting: continue from current position
        this.music.muted = false;
        this.music.play().catch(() => {});
      } else {
        // Muting: pause but keep current position
        this.music.pause();
        this.music.muted = true;
      }
    }
    localStorage.setItem("soundMuted", this.isMuted ? "true" : "false");  }

  /**
   * Sets the volume of the currently playing background music
   * @param {number} value - Volume between 0.0 and 1.0
   */
  setMusicVolume(value) {
    if (this.music) this.music.volume = Math.min(Math.max(value, 0), 1);  }

  /**
   * Sets the volume of a specific sound effect
   * @param {string} name - Name of the sound
   * @param {number} value - Volume between 0.0 and 1.0
   */
  setEffectVolume(name, value) {
    const sound = this.sounds[name];
    if (sound) sound.volume = Math.min(Math.max(value, 0), 1);
  }
}
