/**
 * Sound manager class for handling all game audio
 * @class
 */
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

  /**
   * Loads volume setting from local storage
   * @returns {number} Saved volume or default 1.0
   */
  loadVolumeFromStorage() {
    const savedVolume = localStorage.getItem('gameVolume');
    if (savedVolume !== null) {
      return parseFloat(savedVolume);
    } else {
      return 1.0;
    }
  }

  /**
   * Saves current volume to local storage
   */
  saveVolumeToStorage() {
    localStorage.setItem('gameVolume', this.volume.toString());
  }

  /**
   * Adds a sound to the sound manager
   * @param {string} name - Name identifier for the sound
   * @param {string} path - Path to the audio file
   */
  addSound(name, path) {
    this.sounds[name] = new Audio(path);
    this.sounds[name].volume = this.volume;
  }

  /**
   * Sets the master volume for all sounds
   * @param {number} volumePercent - Volume as percentage (0-100)
   */
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

  /**
   * Plays a sound effect once
   * @param {string} name - Name of the sound to play
   */
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

  /**
   * Plays end screen sounds regardless of game state
   * @param {string} name - Name of the end screen sound
   */
  playEndScreenSound(name) {
    if (!this.isMuted && this.sounds[name]) {
      this.sounds[name].currentTime = 0;
      this.sounds[name].play().catch(() => {});
    }
  }

  /**
   * Plays pause sound (alias for playSound)
   * @param {string} name - Name of the pause sound
   */
  playPauseSound(name) {
    this.playSound(name);
  }

  /**
   * Plays a sound in a continuous loop
   * @param {string} name - Name of the sound to loop
   */
  playLoopingSound(name) {
    if (!this.isMuted && !this.isPaused && !this.isGameOver && this.sounds[name]) {
      const sound = this.sounds[name];
      if (sound.paused || sound.currentTime === 0) {
        sound.loop = true;
        sound.play().catch(() => {});
      }
    }
  }

  /**
   * Stops a looping sound
   * @param {string} name - Name of the sound to stop
   */
  stopLoopingSound(name) {
    if (this.sounds[name]) {
      const sound = this.sounds[name];
      sound.loop = false;
      sound.pause();
      sound.currentTime = 0;
    }
  }

  /**
   * Starts playing background music
   * @param {string} path - Path to the background music file
   */
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

  /**
   * Toggles mute state for all sounds
   * @returns {boolean} New mute state
   */
  toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.isMuted) {
      this.muteAllSounds();
    } else {
      this.unmuteAllSounds();
    }
    return this.isMuted;
  }

  /**
   * Mutes all currently playing sounds
   */
  muteAllSounds() {
    this.pauseBackgroundMusicSounds();
    this.pauseMainBackgroundMusic();
    this.setEffectSoundsVolume(0);
  }

  /**
   * Unmutes all sounds and resumes playback
   */
  unmuteAllSounds() {
    this.resumeBackgroundMusicSounds();
    this.resumeMainBackgroundMusic();
    this.setEffectSoundsVolume(this.volume);
  }

  /**
   * Pauses all background music sounds
   */
  pauseBackgroundMusicSounds() {
    this.backgroundMusicSounds.forEach((name) => {
      if (this.sounds[name] && !this.sounds[name].paused) {
        this.sounds[name].pause();
      }
    });
  }

  /**
   * Resumes all background music sounds
   */
  resumeBackgroundMusicSounds() {
    this.backgroundMusicSounds.forEach((name) => {
      const sound = this.sounds[name];
      if (sound && sound.currentTime > 0 && sound.paused && sound.currentTime < sound.duration) {
        sound.play().catch(() => {});
      }
    });
  }

  /**
   * Pauses the main background music
   */
  pauseMainBackgroundMusic() {
    if (this.backgroundMusic && !this.backgroundMusic.paused) {
      this.backgroundMusic.pause();
    }
  }

  /**
   * Resumes the main background music
   */
  resumeMainBackgroundMusic() {
    if (this.backgroundMusic && this.backgroundMusic.currentTime > 0 && this.backgroundMusic.paused) {
      this.backgroundMusic.play().catch(() => {});
    }
  }

  /**
   * Sets volume for effect sounds (non-background music)
   * @param {number} volume - Volume level to set
   */
  setEffectSoundsVolume(volume) {
    Object.keys(this.sounds).forEach((name) => {
      if (!this.backgroundMusicSounds.includes(name)) {
        this.sounds[name].volume = volume;
      }
    });
  }

  /**
   * Pauses all sounds
   */
  pauseAllSounds() {
    Object.values(this.sounds).forEach((sound) => {
      if (!sound.paused) {
        sound.pause();
      }
    });
  }

  /**
   * Resumes all sounds that were playing
   */
  resumeAllSounds() {
    Object.values(this.sounds).forEach((sound) => {
      if (sound.currentTime > 0 && sound.paused && sound.currentTime < sound.duration) {
        sound.play().catch(() => {});
      }
    });
  }

  /**
   * Stops all sounds and resets their position
   */
  stopAllSounds() {
    Object.values(this.sounds).forEach((sound) => {
      sound.pause();
      sound.currentTime = 0;
    });
  }

  /**
   * Pauses the game and all sounds
   */
  pauseGame() {
    this.isPaused = true;
    this.pauseAllSoundsExceptPause();
  }

  /**
   * Pauses all sounds except the pause sound itself
   */
  pauseAllSoundsExceptPause() {
    Object.keys(this.sounds).forEach((name) => {
      const sound = this.sounds[name];
      if (!sound.paused && name !== 'pause') {
        sound.pause();
      }
    });
  }

  /**
   * Resumes the game and all sounds
   */
  resumeGame() {
    this.isPaused = false;
    this.resumeAllSounds();
  }

  /**
   * Handles game over state by stopping all sounds
   */
  gameOver() {
    this.isGameOver = true;
    this.stopAllSounds();
  }

  /**
   * Resets game over state
   */
  resetGameOver() {
    this.isGameOver = false;
  }

  /**
   * Pauses background music
   */
  pauseBackgroundMusic() {
    if (this.backgroundMusic && !this.isMuted) {
      this.backgroundMusic.pause();
    }
  }

  /**
   * Resumes background music
   */
  resumeBackgroundMusic() {
    if (this.backgroundMusic && !this.isMuted) {
      this.backgroundMusic.play().catch(() => {});
    }
  }

  /**
   * Stops background music and resets position
   */
  stopBackgroundMusic() {
    if (this.backgroundMusic) {
      this.backgroundMusic.pause();
      this.backgroundMusic.currentTime = 0;
    }
  }

  /**
   * Gets the appropriate starting volume based on mute state
   * @returns {number} Volume level to start with
   */
  getStartVolume() {
    if (this.isMuted) {
      return 0;
    }
    return this.volume;
  }

  /**
   * Initializes a sound for fade out
   * @param {HTMLAudioElement} sound - Sound to initialize
   * @param {number} startVolume - Starting volume level
   */
  initializeFadeOutSound(sound, startVolume) {
    if (sound && !this.isMuted) {
      sound.volume = startVolume;
    }
  }

  /**
   * Initializes a sound for fade in
   * @param {HTMLAudioElement} sound - Sound to initialize
   */
  initializeFadeInSound(sound) {
    sound.volume = 0;
    sound.loop = true;
    sound.currentTime = 0;
    sound.play().catch(() => {});
  }

  /**
   * Updates volume during fade out
   * @param {HTMLAudioElement} sound - Sound being faded
   * @param {number} startVolume - Original volume
   * @param {number} volumeStep - Volume decrement per step
   * @param {number} step - Current step number
   */
  updateFadeOutVolume(sound, startVolume, volumeStep, step) {
    if (sound && !this.isMuted) {
      sound.volume = Math.max(0, startVolume - volumeStep * step);
    }
  }

  /**
   * Updates volume during fade in
   * @param {HTMLAudioElement} sound - Sound being faded in
   * @param {number} volumeStep - Volume increment per step
   * @param {number} step - Current step number
   */
  updateFadeInVolume(sound, volumeStep, step) {
    if (!this.isMuted) {
      sound.volume = Math.min(this.volume, volumeStep * step);
    }
  }

  /**
   * Finalizes fade out by stopping the sound
   * @param {HTMLAudioElement} sound - Sound to finalize
   */
  finalizeFadeOut(sound) {
    if (sound) {
      sound.pause();
      sound.currentTime = 0;
    }
  }

  /**
   * Crossfades from background music to a sound effect
   * @param {string} toSoundName - Name of sound to fade to
   * @param {number} [duration=1000] - Duration of crossfade in milliseconds
   */
  crossfadeBackgroundToSound(toSoundName, duration = 1000) {
    if (!this.sounds[toSoundName]) {
      return;
    }
    const params = this.setupCrossfadeParams(duration);
    this.executeCrossfade(this.backgroundMusic, this.sounds[toSoundName], params);
  }

  /**
   * Crossfades from a sound effect to background music
   * @param {string} fromSoundName - Name of sound to fade from
   * @param {number} [duration=1000] - Duration of crossfade in milliseconds
   */
  crossfadeSoundToBackground(fromSoundName, duration = 1000) {
    if (!this.sounds[fromSoundName] || !this.backgroundMusic) {
      return;
    }
    const params = this.setupCrossfadeParams(duration);
    this.executeCrossfade(this.sounds[fromSoundName], this.backgroundMusic, params);
  }

  /**
   * Sets up parameters for crossfade operation
   * @param {number} duration - Duration of crossfade
   * @returns {Object} Crossfade parameters
   */
  setupCrossfadeParams(duration) {
    const steps = 50;
    const stepTime = duration / steps;
    const startVolume = this.getStartVolume();
    const volumeStep = this.volume / steps;
    return { steps, stepTime, startVolume, volumeStep };
  }

  /**
   * Executes the crossfade between two sounds
   * @param {HTMLAudioElement} fromSound - Sound to fade out
   * @param {HTMLAudioElement} toSound - Sound to fade in
   * @param {Object} params - Crossfade parameters
   */
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
