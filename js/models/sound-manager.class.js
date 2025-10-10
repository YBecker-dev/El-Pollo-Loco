class SoundManager {
  constructor() {
    this.isMuted = false;
    this.sounds = {};
    this.backgroundMusic = null;
    this.isPaused = false;
    this.isGameOver = false;
    this.volume = this.loadVolumeFromStorage();
    // Track which sounds are background music (should pause/resume on mute/unmute)
    this.backgroundMusicSounds = ['sleeping', 'endbossAlert', 'youWin', 'youLose'];
  }

  loadVolumeFromStorage() {
    const savedVolume = localStorage.getItem('gameVolume');
    if (savedVolume !== null) {
      return parseFloat(savedVolume);
    } else {
      return 1.0;
    }
  }

  saveVolumeToStorage() {
    localStorage.setItem('gameVolume', this.volume.toString());
  }

  addSound(name, path) {
    this.sounds[name] = new Audio(path);
    this.sounds[name].volume = this.volume;
  }

  setVolume(volumePercent) {
    this.volume = volumePercent / 100;
    Object.values(this.sounds).forEach((sound) => {
      sound.volume = this.volume;
    });
    if (this.backgroundMusic) {
      this.backgroundMusic.volume = this.volume;
    }
    this.saveVolumeToStorage();
  }

  playSound(name) {
    if (!this.isPaused && !this.isGameOver && this.sounds[name]) {
      const sound = this.sounds[name];
      sound.currentTime = 0;
      if (this.isMuted) {
        sound.volume = 0;
      } else {
        sound.volume = this.volume;
      }
      sound.play().catch(() => {});
    }
  }

  playEndScreenSound(name) {
    if (!this.isMuted && this.sounds[name]) {
      this.sounds[name].currentTime = 0;
      this.sounds[name].play().catch(() => {});
    }
  }

  playPauseSound(name) {
    this.playSound(name);
  }

  playLoopingSound(name) {
    if (!this.isMuted && !this.isPaused && !this.isGameOver && this.sounds[name]) {
      const sound = this.sounds[name];
      if (sound.paused || sound.currentTime === 0) {
        sound.loop = true;
        sound.play().catch(() => {});
      }
    }
  }

  stopLoopingSound(name) {
    if (this.sounds[name]) {
      const sound = this.sounds[name];
      sound.loop = false;
      sound.pause();
      sound.currentTime = 0;
    }
  }

  playBackgroundMusic(path) {
    if (!this.backgroundMusic) {
      this.backgroundMusic = new Audio(path);
      this.backgroundMusic.loop = true;
    }
    this.backgroundMusic.volume = this.volume;
    if (!this.isMuted) {
      this.backgroundMusic.play().catch(() => {});
    }
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.isMuted) {
      this.muteAllSounds();
    } else {
      this.unmuteAllSounds();
    }
    return this.isMuted;
  }

  muteAllSounds() {
    this.pauseBackgroundMusicSounds();
    this.pauseMainBackgroundMusic();
    this.setEffectSoundsVolume(0);
  }

  unmuteAllSounds() {
    this.resumeBackgroundMusicSounds();
    this.resumeMainBackgroundMusic();
    this.setEffectSoundsVolume(this.volume);
  }

  pauseBackgroundMusicSounds() {
    this.backgroundMusicSounds.forEach((name) => {
      if (this.sounds[name] && !this.sounds[name].paused) {
        this.sounds[name].pause();
      }
    });
  }

  resumeBackgroundMusicSounds() {
    this.backgroundMusicSounds.forEach((name) => {
      const sound = this.sounds[name];
      if (sound && sound.currentTime > 0 && sound.paused && sound.currentTime < sound.duration) {
        sound.play().catch(() => {});
      }
    });
  }

  pauseMainBackgroundMusic() {
    if (this.backgroundMusic && !this.backgroundMusic.paused) {
      this.backgroundMusic.pause();
    }
  }

  resumeMainBackgroundMusic() {
    if (this.backgroundMusic && this.backgroundMusic.currentTime > 0 && this.backgroundMusic.paused) {
      this.backgroundMusic.play().catch(() => {});
    }
  }

  setEffectSoundsVolume(volume) {
    Object.keys(this.sounds).forEach((name) => {
      if (!this.backgroundMusicSounds.includes(name)) {
        this.sounds[name].volume = volume;
      }
    });
  }

  pauseAllSounds() {
    Object.values(this.sounds).forEach((sound) => {
      if (!sound.paused) {
        sound.pause();
      }
    });
  }

  resumeAllSounds() {
    Object.values(this.sounds).forEach((sound) => {
      if (sound.currentTime > 0 && sound.paused && sound.currentTime < sound.duration) {
        sound.play().catch(() => {});
      }
    });
  }

  stopAllSounds() {
    Object.values(this.sounds).forEach((sound) => {
      sound.pause();
      sound.currentTime = 0;
    });
  }

  pauseGame() {
    this.isPaused = true;
    this.pauseAllSoundsExceptPause();
  }

  pauseAllSoundsExceptPause() {
    Object.keys(this.sounds).forEach((name) => {
      const sound = this.sounds[name];
      if (!sound.paused && name !== 'pause') {
        sound.pause();
      }
    });
  }

  resumeGame() {
    this.isPaused = false;
    this.resumeAllSounds();
  }

  gameOver() {
    this.isGameOver = true;
    this.stopAllSounds();
  }

  resetGameOver() {
    this.isGameOver = false;
  }

  pauseBackgroundMusic() {
    if (this.backgroundMusic && !this.isMuted) {
      this.backgroundMusic.pause();
    }
  }

  resumeBackgroundMusic() {
    if (this.backgroundMusic && !this.isMuted) {
      this.backgroundMusic.play().catch(() => {});
    }
  }

  stopBackgroundMusic() {
    if (this.backgroundMusic) {
      this.backgroundMusic.pause();
      this.backgroundMusic.currentTime = 0;
    }
  }

  getStartVolume() {
    if (this.isMuted) {
      return 0;
    }
    return this.volume;
  }

  initializeFadeOutSound(sound, startVolume) {
    if (sound && !this.isMuted) {
      sound.volume = startVolume;
    }
  }

  initializeFadeInSound(sound) {
    sound.volume = 0;
    sound.loop = true;
    sound.currentTime = 0;
    sound.play().catch(() => {});
  }

  updateFadeOutVolume(sound, startVolume, volumeStep, step) {
    if (sound && !this.isMuted) {
      sound.volume = Math.max(0, startVolume - (volumeStep * step));
    }
  }

  updateFadeInVolume(sound, volumeStep, step) {
    if (!this.isMuted) {
      sound.volume = Math.min(this.volume, volumeStep * step);
    }
  }

  finalizeFadeOut(sound) {
    if (sound) {
      sound.pause();
      sound.currentTime = 0;
    }
  }

  crossfadeBackgroundToSound(toSoundName, duration = 1000) {
    if (!this.sounds[toSoundName]) {
      return;
    }
    const params = this.setupCrossfadeParams(duration);
    this.executeCrossfade(this.backgroundMusic, this.sounds[toSoundName], params);
  }

  crossfadeSoundToBackground(fromSoundName, duration = 1000) {
    if (!this.sounds[fromSoundName] || !this.backgroundMusic) {
      return;
    }
    const params = this.setupCrossfadeParams(duration);
    this.executeCrossfade(this.sounds[fromSoundName], this.backgroundMusic, params);
  }

  setupCrossfadeParams(duration) {
    const steps = 50;
    const stepTime = duration / steps;
    const startVolume = this.getStartVolume();
    const volumeStep = this.volume / steps;
    return { steps, stepTime, startVolume, volumeStep };
  }

  executeCrossfade(fromSound, toSound, params) {
    this.initializeFadeOutSound(fromSound, params.startVolume);
    this.initializeFadeInSound(toSound);
    let currentStep = 0;
    const interval = setInterval(() => {
      currentStep++;
      this.updateFadeOutVolume(fromSound, params.startVolume, params.volumeStep, currentStep);
      this.updateFadeInVolume(toSound, params.volumeStep, currentStep);
      if (currentStep >= params.steps) {
        clearInterval(interval);
        this.finalizeFadeOut(fromSound);
      }
    }, params.stepTime);
  }
}

let soundManager = new SoundManager();
