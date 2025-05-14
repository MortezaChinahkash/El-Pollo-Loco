class SoundManager {
  constructor() {
    this.sounds = {};
    this.music = null;
    this.isMuted = false;
  }

  unlockAudio() {
    Object.values(this.sounds).forEach((audio) => {
      audio.muted = false;
      audio.play().then(() => audio.pause());
    });
  }

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

  const baseSound = this.sounds[name];
  if (!baseSound) return;

  try {
    const effect = baseSound.cloneNode(); // clone = neue unabhängige Instanz
    effect.volume = volume;
    effect.play().catch(() => {});
  } catch (e) {
    console.warn("Soundfehler bei", name, e);
  }
}

unlockAudio() {
  Object.values(this.sounds).forEach((audio) => {
    try {
      audio.play().then(() => audio.pause()).catch(() => {});
    } catch {}
  });
}

  playMusic(name, volume = 0.5) {
  const music = this.sounds[name];
  if (!music) return;

  // Setze Musik neu
  if (this.music && this.music !== music && !this.music.paused) {
    try {
      this.music.pause();
    } catch (e) {
      console.warn("Fehler beim Pausieren alter Musik:", e);
    }
  }

  this.music = music;
  this.music.loop = true;
  this.music.volume = volume;
  this.music.currentTime = 0;

  if (!this.isMuted) {
    // nur versuchen, wenn nicht bereits abgespielt wird
    if (this.music.paused) {
      this.music.play().catch((e) => {
        console.warn("🎵 Musik konnte nicht abgespielt werden:", e);
      });
    }
  }
}

  pauseMusic() {
    if (this.music) this.music.pause();
  }

  toggleMute() {
  this.isMuted = !this.isMuted;

  if (this.music) {
    this.music.muted = this.isMuted;

    // NEU: Wenn Musik pausiert war und jetzt entmutet → spiele Musik ab
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
