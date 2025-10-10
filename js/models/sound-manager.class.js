class SoundManager {
    constructor() {
        this.isMuted = false;
        this.sounds = {};
        this.backgroundMusic = null;
        this.isPaused = false;
        this.isGameOver = false;
        this.volume = this.loadVolumeFromStorage();
    }

    loadVolumeFromStorage() {
        const savedVolume = localStorage.getItem('gameVolume');
        return savedVolume !== null ? parseFloat(savedVolume) : 1.0;
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
        Object.values(this.sounds).forEach(sound => {
            sound.volume = this.volume;
        });
        if (this.backgroundMusic) {
            this.backgroundMusic.volume = this.volume;
        }
        this.saveVolumeToStorage();
    }

    playSound(name) {
        if (!this.isMuted && !this.isPaused && !this.isGameOver && this.sounds[name]) {
            this.sounds[name].currentTime = 0;
            this.sounds[name].play().catch(() => {});
        }
    }

    playEndScreenSound(name) {
        if (!this.isMuted && this.sounds[name]) {
            this.sounds[name].currentTime = 0;
            this.sounds[name].play().catch(() => {});
        }
    }

    playPauseSound(name) {
        if (!this.isMuted && this.sounds[name]) {
            this.sounds[name].currentTime = 0;
            this.sounds[name].play().catch(() => {});
        }
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
            this.pauseAllSounds();
            if (this.backgroundMusic) {
                this.backgroundMusic.pause();
            }
        } else {
            if (this.backgroundMusic) {
                this.backgroundMusic.play().catch(() => {});
            }
        }
        return this.isMuted;
    }

    pauseAllSounds() {
        Object.values(this.sounds).forEach(sound => {
            if (!sound.paused) {
                sound.pause();
            }
        });
    }

    resumeAllSounds() {
        Object.values(this.sounds).forEach(sound => {
            if (sound.currentTime > 0 && sound.paused && sound.currentTime < sound.duration) {
                sound.play().catch(() => {});
            }
        });
    }

    stopAllSounds() {
        Object.values(this.sounds).forEach(sound => {
            sound.pause();
            sound.currentTime = 0;
        });
    }

    pauseGame() {
        this.isPaused = true;
        this.pauseAllSoundsExceptPause();
    }

    pauseAllSoundsExceptPause() {
        Object.keys(this.sounds).forEach(name => {
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
}

let soundManager = new SoundManager();