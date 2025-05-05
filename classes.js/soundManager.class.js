class SoundManager {
    constructor() {
      this.sounds = {};
      this.music = null;
      this.isMuted = false;
    }
  
    loadSound(name, path, loop = false) {
      const audio = new Audio(path);
      audio.loop = loop;
      this.sounds[name] = audio;
    }
  
    playSound(name, volume = 1.0) {
      const sound = this.sounds[name];
      if (this.isMuted) return;
      const clonedSound = sound.cloneNode();
      clonedSound.volume = volume;
      clonedSound.play();
    }
  
    playMusic(name, volume = 0.5) {
      if (this.music) {
        this.music.pause();
      }
  
      const music = this.sounds[name];
      if (!music) {
        console.warn(`Musik "${name}" nicht geladen.`);
        return;
      }
  
      this.music = music;
      this.music.volume = volume;
      this.music.currentTime = 0;
      if (!this.isMuted) this.music.play();
    }
  
    pauseMusic() {
      if (this.music) this.music.pause();
    }
  
    toggleMute() {
      this.isMuted = !this.isMuted;
      if (this.music) this.music.muted = this.isMuted;
    }
  
    setMusicVolume(value) {
      if (this.music) this.music.volume = Math.min(Math.max(value, 0), 1);
    }
  
    setEffectVolume(name, value) {
      const sound = this.sounds[name];
      if (sound) sound.volume = Math.min(Math.max(value, 0), 1);
    }
  }
  