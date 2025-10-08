let world;
let keyboard = new Keyboard();
let canvas;
let ctx;

function init() {
  canvas = document.getElementById('canvas');
  world = new World(canvas, keyboard);
  ctx = canvas.getContext('2d');
}

function togglePause() {
  if (world) {
    world.togglePause();
    const button = document.getElementById('pauseButton');
    button.textContent = world.isPaused ? '▶️ Resume' : '⏸️ Pause';
    button.blur();
  }
}

function restartGame() {
  document.getElementById('restartButton').classList.add('d-none');
  document.getElementById('mainMenuButton').classList.add('d-none');
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
    pauseOverlay.classList.remove('d-none');
    toggleMobileControlsVisibility(false);
    if (world && !world.isPaused) {
      world.togglePause();
    }
  } else {
    pauseOverlay.classList.add('d-none');
    toggleMobileControlsVisibility(true);
    if (world && world.isPaused) {
      world.togglePause();
    }
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
});
