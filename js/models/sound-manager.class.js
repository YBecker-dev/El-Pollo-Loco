class SoundManager {
    constructor() {
        this.isMuted = false;
        this.sounds = {};
        this.backgroundMusic = null;
        this.isPaused = false;
        this.isGameOver = false;
    }

    addSound(name, path) {
        this.sounds[name] = new Audio(path);
    }

    playSound(name) {
        if (!this.isMuted && !this.isPaused && !this.isGameOver && this.sounds[name]) {
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
        if (!this.isMuted) {
            this.backgroundMusic.play().catch(() => {});
        }
    }

    stopBackgroundMusic() {
        if (this.backgroundMusic) {
            this.backgroundMusic.pause();
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
        this.pauseAllSounds();
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
}

// Globale Instanz
let soundManager = new SoundManager();