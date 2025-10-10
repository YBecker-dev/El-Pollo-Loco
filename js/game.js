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
  soundManager.addSound('chickenDead', 'audio/chicken/dead/chicken-dead.mp3');
  soundManager.addSound('endbossAlert', 'audio/Endboss/alert/endboss-alert.mp3');
  soundManager.addSound('endbossHurt', 'audio/Endboss/hurt/endboss-hurt.mp3');
  soundManager.addSound('endbossDead', 'audio/Endboss/dead/endboss-dead.mp3');
  soundManager.addSound('pause', 'audio/Gameplay/pause/pause.wav');
  soundManager.addSound('unpause', 'audio/Gameplay/unpause/unpause.wav');
  soundManager.addSound('youWin', 'audio/Gameplay/you-win/you-win.wav');
  soundManager.addSound('youLose', 'audio/Gameplay/you-lose/you-lose,wav.mp3');
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

  soundManager.resumeBackgroundMusic();

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

// Virtual Joystick State
let joystickActive = false;
let joystickTouchId = null;
let joystickStartX = 0;
let joystickStartY = 0;
let joystickMaxDistance = 60; // Max distance the stick can move from base

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
    setupVirtualJoystick();
    bindMobileButton('btnJump', 'Space');
    bindMobileButton('btnThrow', 'F');
  }
}

function setupVirtualJoystick() {
  const joystickArea = document.getElementById('joystickArea');
  const joystickBase = document.getElementById('joystickBase');
  const joystickStick = document.getElementById('joystickStick');

  joystickArea.addEventListener('touchstart', (e) => {
    e.preventDefault();
    if (joystickActive) return; // Only one joystick touch at a time

    const touch = e.touches[0];
    joystickTouchId = touch.identifier;
    joystickStartX = touch.clientX;
    joystickStartY = touch.clientY;

    // Show joystick at touch position
    joystickBase.style.left = joystickStartX + 'px';
    joystickBase.style.top = joystickStartY + 'px';
    joystickStick.style.left = joystickStartX + 'px';
    joystickStick.style.top = joystickStartY + 'px';

    joystickBase.classList.remove('d-none');
    joystickStick.classList.remove('d-none');

    joystickActive = true;
  }, { passive: false });

  joystickArea.addEventListener('touchmove', (e) => {
    e.preventDefault();
    if (!joystickActive) return;

    // Find the touch that started the joystick
    let touch = null;
    for (let i = 0; i < e.touches.length; i++) {
      if (e.touches[i].identifier === joystickTouchId) {
        touch = e.touches[i];
        break;
      }
    }
    if (!touch) return;

    const deltaX = touch.clientX - joystickStartX;
    const deltaY = touch.clientY - joystickStartY;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

    // Clamp stick position to max distance
    let stickX, stickY;
    if (distance > joystickMaxDistance) {
      const angle = Math.atan2(deltaY, deltaX);
      stickX = joystickStartX + Math.cos(angle) * joystickMaxDistance;
      stickY = joystickStartY + Math.sin(angle) * joystickMaxDistance;
    } else {
      stickX = touch.clientX;
      stickY = touch.clientY;
    }

    // Update stick position
    joystickStick.style.left = stickX + 'px';
    joystickStick.style.top = stickY + 'px';

    // Update keyboard state based on joystick direction
    const threshold = 20; // Minimum distance to trigger movement
    keyboard.Left = deltaX < -threshold;
    keyboard.Right = deltaX > threshold;
  }, { passive: false });

  const endJoystick = (e) => {
    e.preventDefault();
    if (!joystickActive) return;

    // Check if the released touch is the joystick touch
    let touchEnded = false;
    if (e.type === 'touchend' || e.type === 'touchcancel') {
      for (let i = 0; i < e.changedTouches.length; i++) {
        if (e.changedTouches[i].identifier === joystickTouchId) {
          touchEnded = true;
          break;
        }
      }
    }
    if (!touchEnded) return;

    // Hide joystick
    joystickBase.classList.add('d-none');
    joystickStick.classList.add('d-none');

    // Reset keyboard state
    keyboard.Left = false;
    keyboard.Right = false;

    joystickActive = false;
    joystickTouchId = null;
  };

  joystickArea.addEventListener('touchend', endJoystick, { passive: false });
  joystickArea.addEventListener('touchcancel', endJoystick, { passive: false });
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
