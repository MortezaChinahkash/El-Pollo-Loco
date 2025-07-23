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
    this.sounds[name] = audio;  }
  /**
   * Stoppt alle aktuell abspielenden Sounds und setzt sie zurück
   * Nützlich beim Pausieren oder Neustarten des Spiels
   */

  stopAll() {
    for (const audio of Object.values(this.sounds)) {
      audio.pause();
      audio.currentTime = 0;
    }  }
  /**
   * Spielt einen Sound-Effekt einmalig ab
   * @param {string} name - Name des Sounds
   * @param {number} [volume=1.0] - Lautstärke (0.0 bis 1.0)
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
   * Spielt Hintergrundmusik in Dauerschleife ab
   * Stoppt vorherige Musik und startet neue
   * @param {string} name - Name der Musikdatei
   * @param {number} [volume=0.5] - Lautstärke (0.0 bis 1.0)
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
   * Pausiert die aktuell abspielende Hintergrundmusik
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
