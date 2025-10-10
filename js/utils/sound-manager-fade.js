/**
 * Sound Manager Fade Module - Handles crossfade and volume fade effects
 * This file extends the SoundManager class with fade-related methods.
 */

/**
 * Gets the appropriate starting volume based on mute state
 * @returns {number} Volume level to start with
 */
SoundManager.prototype.getStartVolume = function () {
  if (this.isMuted) {
    return 0;
  }
  return this.volume;
};

/**
 * Initializes a sound for fade out
 * @param {HTMLAudioElement} sound - Sound to initialize
 * @param {number} startVolume - Starting volume level
 */
SoundManager.prototype.initializeFadeOutSound = function (sound, startVolume) {
  if (sound && !this.isMuted) {
    sound.volume = startVolume;
  }
};

/**
 * Initializes a sound for fade in
 * @param {HTMLAudioElement} sound - Sound to initialize
 */
SoundManager.prototype.initializeFadeInSound = function (sound) {
  sound.volume = 0;
  sound.loop = true;
  sound.currentTime = 0;
  sound.play().catch(() => {});
};

/**
 * Updates volume during fade out
 * @param {HTMLAudioElement} sound - Sound being faded
 * @param {number} startVolume - Original volume
 * @param {number} volumeStep - Volume decrement per step
 * @param {number} step - Current step number
 */
SoundManager.prototype.updateFadeOutVolume = function (sound, startVolume, volumeStep, step) {
  if (sound && !this.isMuted) {
    sound.volume = Math.max(0, startVolume - volumeStep * step);
  }
};

/**
 * Updates volume during fade in
 * @param {HTMLAudioElement} sound - Sound being faded in
 * @param {number} volumeStep - Volume increment per step
 * @param {number} step - Current step number
 */
SoundManager.prototype.updateFadeInVolume = function (sound, volumeStep, step) {
  if (!this.isMuted) {
    sound.volume = Math.min(this.volume, volumeStep * step);
  }
};

/**
 * Finalizes fade out by stopping the sound
 * @param {HTMLAudioElement} sound - Sound to finalize
 */
SoundManager.prototype.finalizeFadeOut = function (sound) {
  if (sound) {
    sound.pause();
    sound.currentTime = 0;
  }
};

/**
 * Crossfades from background music to a sound effect
 * @param {string} toSoundName - Name of sound to fade to
 * @param {number} [duration=1000] - Duration of crossfade in milliseconds
 */
SoundManager.prototype.crossfadeBackgroundToSound = function (toSoundName, duration = 1000) {
  if (!this.sounds[toSoundName]) {
    return;
  }
  const params = this.setupCrossfadeParams(duration);
  this.executeCrossfade(this.backgroundMusic, this.sounds[toSoundName], params);
};

/**
 * Crossfades from a sound effect to background music
 * @param {string} fromSoundName - Name of sound to fade from
 * @param {number} [duration=1000] - Duration of crossfade in milliseconds
 */
SoundManager.prototype.crossfadeSoundToBackground = function (fromSoundName, duration = 1000) {
  if (!this.sounds[fromSoundName] || !this.backgroundMusic) {
    return;
  }
  const params = this.setupCrossfadeParams(duration);
  this.executeCrossfade(this.sounds[fromSoundName], this.backgroundMusic, params);
};

/**
 * Sets up parameters for crossfade operation
 * @param {number} duration - Duration of crossfade
 * @returns {Object} Crossfade parameters
 */
SoundManager.prototype.setupCrossfadeParams = function (duration) {
  const steps = 50;
  const stepTime = duration / steps;
  const startVolume = this.getStartVolume();
  const volumeStep = this.volume / steps;
  return { steps, stepTime, startVolume, volumeStep };
};

/**
 * Executes the crossfade between two sounds
 * @param {HTMLAudioElement} fromSound - Sound to fade out
 * @param {HTMLAudioElement} toSound - Sound to fade in
 * @param {Object} params - Crossfade parameters
 */
SoundManager.prototype.executeCrossfade = function (fromSound, toSound, params) {
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
};
