class SoundManager {
  /**
   * Erstellt einen neuen SoundManager zur Verwaltung aller Spiel-Audiodateien
   * Initialisiert Sounds-Dictionary, Musik-Referenz und Mute-Status
   */
  constructor() {
    this.sounds = {};
    this.music = null;
    this.isMuted = false;  }

  /**
   * Entsperrt Audio-Wiedergabe nach Benutzerinteraktion
   * Erforderlich für moderne Browser-Autoplay-Richtlinien
   */
  unlockAudio() {
    Object.values(this.sounds).forEach((audio) => {
      try {
        audio.muted = false;
        audio.play().then(() => audio.pause()).catch(() => {});
      } catch {}
    });  }

  /**
   * Lädt eine Audiodatei und fügt sie zur Sounds-Sammlung hinzu
   * @param {string} name - Name/ID für den Sound
   * @param {string} path - Pfad zur Audiodatei
   * @param {boolean} [loop=false] - Ob der Sound in Schleife abgespielt werden soll
   */
  loadSound(name, path, loop = false) {
    const audio = new Audio(path);
    audio.loop = loop;
    this.sounds[name] = audio;
  }

  stopAll() {
    for (const audio of Object.values(this.sounds)) {
      audio.pause();
      audio.currentTime = 0;
    }
  }

  playSound(name, volume = 1.0) {
    if (this.isMuted) return;
    const sound = this.sounds[name];
    if (!sound) return;

    try {
      sound.pause();
      sound.currentTime = 0;
      sound.volume = volume;
      sound.play().catch(() => {});
    } catch {}
  }

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
    }
  }

  pauseMusic() {
    if (this.music) this.music.pause();
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.music) {
      this.music.muted = this.isMuted;
      if (!this.isMuted && this.music.paused) {
        this.music.play().catch(() => {});
      }
    }
    localStorage.setItem("soundMuted", this.isMuted ? "true" : "false");
  }

  setMusicVolume(value) {
    if (this.music) this.music.volume = Math.min(Math.max(value, 0), 1);
  }

  setEffectVolume(name, value) {
    const sound = this.sounds[name];
    if (sound) sound.volume = Math.min(Math.max(value, 0), 1);
  }
}
