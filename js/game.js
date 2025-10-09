let world;
let keyboard = new Keyboard();
let canvas;
let ctx;

function init() {
  canvas = document.getElementById('canvas');
  initializeSounds();
  soundManager.resetGameOver();
  world = new World(canvas, keyboard);
  ctx = canvas.getContext('2d');
}

function initializeSounds() {
  soundManager.addSound('jump', 'audio/character/jump/jump.wav');
  soundManager.addSound('hurt', 'audio/character/hurt/hurt.wav');
  soundManager.addSound('dead', 'audio/character/dead/dead.wav');
  soundManager.addSound('sleeping', 'audio/character/sleeping/sleeping.wav');
  soundManager.addSound('coin', 'audio/Gameplay/items/coin.wav');
  soundManager.addSound('bottleCollect', 'audio/Gameplay/collect-bottle/collect-bottle.wav');
  soundManager.addSound('bottleThrow', 'audio/Gameplay/throw-bottle/throw-bottle.wav');
  soundManager.addSound('bottleSplash', 'audio/Gameplay/splash-bottle/splash-bottle.mp3');
}

function togglePause() {
  if (world) {
    world.togglePause();
  }
}

function restartGame() {
  document.getElementById('restartButton').classList.add('d-none');
  document.getElementById('mainMenuButton').classList.add('d-none');
  document.getElementById('soundButtonGameEnd').classList.add('d-none');
  document.getElementById('soundButtonGame').classList.add('show');
  toggleMobileControlsVisibility(true);

  stopGame();
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  initLevel();

  init();
}

const keyMap = {
  ArrowRight: 'Right',
  d: 'Right',
  ArrowLeft: 'Left',
  a: 'Left',
  ArrowUp: 'Space',
  w: 'Space',
  ArrowDown: 'Down',
  s: 'Down',
  ' ': 'Space',
  f: 'F',
};

window.addEventListener('keydown', (e) => {
  const key = keyMap[e.key] || keyMap[e.key.toLowerCase()];
  if (key) {
    keyboard[key] = true;
  }
});

window.addEventListener('keyup', (e) => {
  const key = keyMap[e.key] || keyMap[e.key.toLowerCase()];
  if (key) {
    keyboard[key] = false;
  }

  if (e.key === 'Escape' && world && world.character && !world.levelCompleted && !world.character.isdead) {
    togglePauseMenu();
  }
});

function togglePauseMenu() {
  const pauseOverlay = document.getElementById('pauseOverlay');
  if (pauseOverlay.classList.contains('d-none')) {
    showPauseMenu(pauseOverlay);
  } else {
    hidePauseMenu(pauseOverlay);
  }
}

function showPauseMenu(pauseOverlay) {
  pauseOverlay.classList.remove('d-none');
  toggleMobileControlsVisibility(false);
  if (world && !world.isPaused) {
    world.togglePause();
  }
}

function hidePauseMenu(pauseOverlay) {
  pauseOverlay.classList.add('d-none');
  toggleMobileControlsVisibility(true);
  if (world && world.isPaused) {
    world.togglePause();
  }
}

function backToMainMenuFromPause() {
  document.getElementById('pauseOverlay').classList.add('d-none');

  backToMainMenu();
}

function bindMobileButton(buttonId, keyboardProperty) {
  const button = document.getElementById(buttonId);
  button.addEventListener('touchstart', (e) => {
    e.preventDefault();
    keyboard[keyboardProperty] = true;
  }, { passive: false });
  button.addEventListener('touchend', (e) => {
    e.preventDefault();
    keyboard[keyboardProperty] = false;
  }, { passive: false });
}

function toggleMobileControlsVisibility(show) {
  const mobileControls = document.getElementById('mobileControls');
  if (show && window.innerWidth <= 1370) {
    mobileControls.classList.remove('d-none');
  } else {
    mobileControls.classList.add('d-none');
  }
}

function setupMobileControls() {
  if (window.innerWidth <= 1370) {
    bindMobileButton('btnLeft', 'Left');
    bindMobileButton('btnRight', 'Right');
    bindMobileButton('btnJump', 'Space');
    bindMobileButton('btnThrow', 'F');
  }
}

window.addEventListener('load', () => {
  setupMobileControls();
  disableContextMenu();
});

function disableContextMenu() {
  const canvas = document.getElementById('canvas');
  const gameContainer = document.getElementById('gameContainer');
  const title = document.getElementById('title');

  [canvas, gameContainer, title, document.body].forEach(element => {
    element.addEventListener('contextmenu', (e) => {
      e.preventDefault();
    });
  });
}

function toggleSoundButton() {
  soundManager.toggleMute();
  updateSoundButtonIcons();
}

function updateSoundButtonIcons() {
  const iconPause = document.getElementById('soundIconPause');
  const iconGameEnd = document.getElementById('soundIconGameEnd');
  const iconGame = document.getElementById('soundIconGame');

  const iconSrc = soundManager.isMuted
    ? 'img_pollo_locco/img/homescreen-icons/mute.png'
    : 'img_pollo_locco/img/homescreen-icons/volume.png';

  if (iconPause) iconPause.src = iconSrc;
  if (iconGameEnd) iconGameEnd.src = iconSrc;
  if (iconGame) iconGame.src = iconSrc;
}
