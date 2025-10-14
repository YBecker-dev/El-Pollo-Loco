/**
 * Sound manager class for handling all game audio
 * @class
 */
class SoundManager {
  /**
   * Initializes the SoundManager with default settings
   * @constructor
   */
  constructor() {
    this.sounds = {};
    this.isPaused = false;
    this.isGameOver = false;
    this.volume = this.loadVolumeFromStorage();
    this.isMuted = this.loadMuteStateFromStorage();
    this.backgroundMusicSounds = ['background', 'sleeping', 'endbossAlert', 'youWin', 'youLose'];
    this.soundManagerFade = new SoundManagerFade(this);
    this.endbossMusicStarted = false;
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
   * Loads mute state from local storage
   * @returns {boolean} Saved mute state or default false
   */
  loadMuteStateFromStorage() {
    const savedMuteState = localStorage.getItem('gameMuted');
    if (savedMuteState !== null) {
      return savedMuteState === 'true';
    } else {
      return false;
    }
  }

  /**
   * Saves current mute state to local storage
   */
  saveMuteStateToStorage() {
    localStorage.setItem('gameMuted', this.isMuted.toString());
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
    this.saveVolumeToStorage();
  }

  /**
   * Plays a sound effect once
   * @param {string} name - Name of the sound to play
   */
  playSound(name) {
    const isPauseOrUnpauseSound = (name === 'pause' || name === 'unpause');
    const canPlaySound = isPauseOrUnpauseSound || (!this.isPaused && !this.isGameOver);

    if (canPlaySound && this.sounds[name]) {
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
   * Plays a looping sound
   * @param {string} name - Name of the sound to play
   */
  playLoopingSound(name) {
    if (!this.isMuted && this.sounds[name]) {
      const sound = this.sounds[name];
      sound.loop = true;
      sound.currentTime = 0;
      sound.volume = this.volume;
      sound.play().catch(() => {});
    }
  }

  /**
   * Stops a looping sound
   * @param {string} name - Name of the sound to stop
   */
  stopLoopingSound(name) {
    if (this.sounds[name]) {
      const sound = this.sounds[name];
      sound.pause();
      sound.currentTime = 0;
      sound.loop = false;
    }
  }

  /**
   * Toggles mute state for all sounds
   * @returns {boolean} New mute state
   */
  toggleMute() {
    this.isMuted = !this.isMuted;
    this.saveMuteStateToStorage();
    if (this.isMuted) {
      this.muteAllSounds();
    } else {
      this.unmuteAllSounds();
    }
    return this.isMuted;
  }

  /**
   * Mutes all sounds (sets volume to 0 for all sounds)
   */
  muteAllSounds() {
    this.setBackgroundMusicVolume(0);
    this.setEffectSoundsVolume(0);
  }

  /**
   * Unmutes all sounds (restores volume for all sounds)
   */
  unmuteAllSounds() {
    this.setBackgroundMusicVolume(this.volume);
    this.setEffectSoundsVolume(this.volume);
    this.startBackgroundMusicIfNotPlaying();
  }

  /**
   * Starts background music if it's not currently playing
   * and no other background music is playing
   * Only starts if the game is running (world exists)
   */
  startBackgroundMusicIfNotPlaying() {
    if (typeof world === 'undefined' || !world) return;
    const bgMusic = this.sounds['background'];
    if (!bgMusic) return;
    if (this.isAnyBackgroundMusicSoundPlaying()) return;
    if (bgMusic.paused && bgMusic.currentTime === 0) {
      bgMusic.play().catch(() => {});
    }
  }

  /**
   * Checks if any background music sound is currently playing
   * @returns {boolean} True if any background music sound is playing
   */
  isAnyBackgroundMusicSoundPlaying() {
    return this.backgroundMusicSounds.some((name) => {
      const sound = this.sounds[name];
      return sound && !sound.paused && sound.currentTime > 0;
    });
  }

  /**
   * Pauses all background music sounds
   */
  pauseAllBackgroundMusic() {
    this.backgroundMusicSounds.forEach((name) => {
      if (this.sounds[name] && !this.sounds[name].paused) {
        this.sounds[name].pause();
      }
    });
  }

  /**
   * Resumes all background music sounds
   */
  resumeAllBackgroundMusic() {
    this.backgroundMusicSounds.forEach((name) => {
      const sound = this.sounds[name];
      if (sound && sound.currentTime > 0 && sound.paused && sound.currentTime < sound.duration) {
        sound.play().catch(() => {});
      }
    });
  }

  /**
   * Sets volume for background music sounds
   * @param {number} volume - Volume level to set
   */
  setBackgroundMusicVolume(volume) {
    this.backgroundMusicSounds.forEach((name) => {
      if (this.sounds[name]) {
        this.sounds[name].volume = volume;
      }
    });
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
   * Stops all sounds and resets their position
   */
  stopAllSounds() {
    Object.values(this.sounds).forEach((sound) => {
      sound.pause();
      sound.currentTime = 0;
    });
  }

  /**
   * Pauses the game and all background music
   */
  pauseGame() {
    this.isPaused = true;
    this.pauseAllBackgroundMusic();
  }

  /**
   * Resumes the game and all background music
   */
  resumeGame() {
    this.isPaused = false;
    this.resumeAllBackgroundMusic();
  }

  /**
   * Handles game over state by stopping all sounds
   */
  gameOver() {
    this.isGameOver = true;
    this.stopAllSounds();
    this.stopBackgroundMusic();
  }

  /**
   * Resets game over state
   */
  resetGameOver() {
    this.isGameOver = false;
  }


  /**
   * Stops all background music sounds
   */
  stopBackgroundMusic() {
    this.backgroundMusicSounds.forEach((name) => {
      if (this.sounds[name]) {
        this.sounds[name].pause();
        this.sounds[name].currentTime = 0;
      }
    });
  }

  /**
   * Starts background music from the beginning
   */
  startBackgroundMusic() {
    const bgMusic = this.sounds['background'];
    if (!bgMusic) return;
    bgMusic.currentTime = 0;
    bgMusic.volume = this.volume;
    bgMusic.loop = true;
    if (!this.isMuted) {
      bgMusic.play().catch(() => {});
    }
  }

  /**
   * Resets endboss music flag
   */
  resetEndbossMusic() {
    this.endbossMusicStarted = false;
  }
}

let soundManager = new SoundManager();
