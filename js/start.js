function initStartScreen() {
  canvas = document.getElementById('canvas');
  ctx = canvas.getContext('2d');

  const startScreenImage = new Image();
  startScreenImage.src = 'img_pollo_locco/img/9_intro_outro_screens/start/startscreen_1.png';
  startScreenImage.onload = () => {
    ctx.drawImage(startScreenImage, 0, 0, canvas.width, canvas.height);
  };

  initBackgroundMusic();

  showStartMenu();
}

function initBackgroundMusic() {
  createBackgroundMusicIfNeeded();
  setupAutoplayWorkaround();
}

function createBackgroundMusicIfNeeded() {
  if (!soundManager.backgroundMusic) {
    soundManager.backgroundMusic = new Audio('audio/Gameplay/background/background.wav');
    soundManager.backgroundMusic.loop = true;
    soundManager.backgroundMusic.volume = soundManager.volume;
  }
}

function setupAutoplayWorkaround() {
  document.addEventListener('click', startBackgroundMusicOnInteraction, { once: true });
  document.addEventListener('keydown', startBackgroundMusicOnInteraction, { once: true });
}

function startBackgroundMusicOnInteraction() {
  if (!soundManager.isMuted && soundManager.backgroundMusic.paused) {
    soundManager.backgroundMusic.play().catch(() => {});
  }
  removeAutoplayListeners();
}

function removeAutoplayListeners() {
  document.removeEventListener('click', startBackgroundMusicOnInteraction);
  document.removeEventListener('keydown', startBackgroundMusicOnInteraction);
}

function showStartMenu() {
  hideAllMenus();
  const startMenu = document.getElementById('startMenu');
  startMenu.style.animation = '';
  startMenu.classList.remove('d-none');
}

function hideAllMenus() {
  document.getElementById('startMenu').classList.add('d-none');
  document.getElementById('optionsMenu').classList.add('d-none');
  document.getElementById('steeringMenu').classList.add('d-none');
  document.getElementById('impressumMenu').classList.add('d-none');
}

function startGame() {
  hideAllMenus();

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  toggleMobileControlsVisibility(true);
  document.getElementById('soundButtonGame').classList.add('show');
  updateSoundButtonIcons();

  initLevel();
  init();
}

function backToMainMenu() {
  hideGameEndUIElements();
  resetGameState();
  initStartScreen();
}

function hideGameEndUIElements() {
  document.getElementById('restartButton').classList.add('d-none');
  document.getElementById('mainMenuButton').classList.add('d-none');
  document.getElementById('soundButtonGameEnd').classList.add('d-none');
  document.getElementById('soundButtonGame').classList.remove('show');
  toggleMobileControlsVisibility(false);
}

function resetGameState() {
  stopGame();
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  initLevel();
  soundManager.resumeBackgroundMusic();
}
