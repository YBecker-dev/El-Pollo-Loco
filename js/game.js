let world;
let keyboard = new Keyboard();
let canvas;
let ctx;
let joystickActive = false;
let joystickTouchId = null;
let joystickStartX = 0;
let joystickStartY = 0;
let joystickMaxDistance = 60;

function init() {
  canvas = document.getElementById('canvas');
  initializeSounds();
  soundManager.resetGameOver();
  world = new World(canvas, keyboard);
  ctx = canvas.getContext('2d');
}

function initializeCharacterSounds() {
  soundManager.addSound('jump', 'audio/character/jump/jump.wav');
  soundManager.addSound('hurt', 'audio/character/hurt/hurt.wav');
  soundManager.addSound('dead', 'audio/character/dead/dead.wav');
  soundManager.addSound('sleeping', 'audio/character/sleeping/sleeping.wav');
}

function initializeChickenSounds() {
  soundManager.addSound('chickenDead', 'audio/chicken/dead/chicken-dead.mp3');
}

function initializeEndbossSounds() {
  soundManager.addSound('endbossAlert', 'audio/Endboss/alert/endboss-alert.mp3');
  soundManager.addSound('endbossHurt', 'audio/Endboss/hurt/endboss-hurt.mp3');
  soundManager.addSound('endbossDead', 'audio/Endboss/dead/endboss-dead.mp3');
}

function initializeGameplaySounds() {
  soundManager.addSound('coin', 'audio/Gameplay/items/coin.wav');
  soundManager.addSound('bottleCollect', 'audio/Gameplay/collect-bottle/collect-bottle.wav');
  soundManager.addSound('bottleThrow', 'audio/Gameplay/throw-bottle/throw-bottle.wav');
  soundManager.addSound('bottleSplash', 'audio/Gameplay/splash-bottle/splash-bottle.mp3');
  soundManager.addSound('pause', 'audio/Gameplay/pause/pause.wav');
  soundManager.addSound('unpause', 'audio/Gameplay/unpause/unpause.wav');
  soundManager.addSound('youWin', 'audio/Gameplay/you-win/you-win.wav');
  soundManager.addSound('youLose', 'audio/Gameplay/you-lose/you-lose,wav.mp3');
}

function initializeSounds() {
  initializeCharacterSounds();
  initializeChickenSounds();
  initializeEndbossSounds();
  initializeGameplaySounds();
}

function togglePause() {
  if (world) {
    world.togglePause();
  }
}

function restartGame() {
  resetGameUI();
  cleanupGameState();
  restartGameLogic();
}

function resetGameUI() {
  document.getElementById('restartButton').classList.add('d-none');
  document.getElementById('mainMenuButton').classList.add('d-none');
  document.getElementById('soundButtonGameEnd').classList.add('d-none');
  document.getElementById('soundButtonGame').classList.add('show');
  toggleMobileControlsVisibility(true);
}

function cleanupGameState() {
  stopGame();
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function restartGameLogic() {
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

window.addEventListener('keydown', (event) => {
  const key = keyMap[event.key] || keyMap[event.key.toLowerCase()];
  if (key) {
    keyboard[key] = true;
  }
});

window.addEventListener('keyup', (event) => {
  const key = keyMap[event.key] || keyMap[event.key.toLowerCase()];
  if (key) {
    keyboard[key] = false;
  }

  if (event.key === 'Escape' && world && world.character && !world.levelCompleted && !world.character.isdead) {
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
  bindTouchHandler(button, keyboardProperty, 'touchstart', true);
  bindTouchHandler(button, keyboardProperty, 'touchend', false);
}

function bindTouchHandler(button, keyboardProperty, eventType, value) {
  button.addEventListener(
    eventType,
    (event) => {
      event.preventDefault();
      keyboard[keyboardProperty] = value;
    },
    { passive: false }
  );
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

  joystickArea.addEventListener('touchstart', handleJoystickTouchStart, { passive: false });
  joystickArea.addEventListener('touchmove', handleJoystickTouchMove, { passive: false });
  joystickArea.addEventListener('touchend', handleJoystickTouchEnd, { passive: false });
  joystickArea.addEventListener('touchcancel', handleJoystickTouchEnd, { passive: false });
}

function handleJoystickTouchStart(event) {
  event.preventDefault();
  if (joystickActive) return;

  const touch = event.touches[0];
  joystickTouchId = touch.identifier;
  const startPos = calculateTouchPosition(touch, document.getElementById('joystickArea'));

  joystickStartX = startPos.x;
  joystickStartY = startPos.y;

  showJoystick(startPos);
  joystickActive = true;
}

function handleJoystickTouchMove(event) {
  event.preventDefault();
  if (!joystickActive) return;

  const touch = findCurrentTouch(event.touches);
  if (!touch) return;

  const touchPos = calculateTouchPosition(touch, document.getElementById('joystickArea'));
  const stickPos = calculateStickPosition(touchPos);

  updateJoystickVisual(stickPos);
  updateKeyboardFromJoystick(touchPos);
}

function handleJoystickTouchEnd(event) {
  event.preventDefault();
  if (!joystickActive) return;

  if (isCurrentTouchEnded(event)) {
    hideJoystick();
    resetJoystickState();
  }
}

function calculateTouchPosition(touch, area) {
  const rect = area.getBoundingClientRect();
  return {
    x: touch.clientX - rect.left,
    y: touch.clientY - rect.top,
  };
}

function calculateStickPosition(touchPos) {
  const deltaX = touchPos.x - joystickStartX;
  const deltaY = touchPos.y - joystickStartY;
  const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

  if (distance > joystickMaxDistance) {
    const angle = Math.atan2(deltaY, deltaX);
    return {
      x: joystickStartX + Math.cos(angle) * joystickMaxDistance,
      y: joystickStartY + Math.sin(angle) * joystickMaxDistance,
    };
  }
  return touchPos;
}

function showJoystick(position) {
  const base = document.getElementById('joystickBase');
  const stick = document.getElementById('joystickStick');

  base.style.left = position.x + 'px';
  base.style.top = position.y + 'px';
  stick.style.left = position.x + 'px';
  stick.style.top = position.y + 'px';

  base.classList.remove('d-none');
  stick.classList.remove('d-none');
}

function updateJoystickVisual(position) {
  const stick = document.getElementById('joystickStick');
  stick.style.left = position.x + 'px';
  stick.style.top = position.y + 'px';
}

function updateKeyboardFromJoystick(touchPos) {
  const deltaX = touchPos.x - joystickStartX;
  const threshold = 20;
  keyboard.Left = deltaX < -threshold;
  keyboard.Right = deltaX > threshold;
}

function findCurrentTouch(touches) {
  for (let i = 0; i < touches.length; i++) {
    if (touches[i].identifier === joystickTouchId) {
      return touches[i];
    }
  }
  return null;
}

function isCurrentTouchEnded(event) {
  if (event.type === 'touchend' || event.type === 'touchcancel') {
    for (let i = 0; i < event.changedTouches.length; i++) {
      if (event.changedTouches[i].identifier === joystickTouchId) {
        return true;
      }
    }
  }
  return false;
}

function hideJoystick() {
  const base = document.getElementById('joystickBase');
  const stick = document.getElementById('joystickStick');
  base.classList.add('d-none');
  stick.classList.add('d-none');
}

function resetJoystickState() {
  keyboard.Left = false;
  keyboard.Right = false;
  joystickActive = false;
  joystickTouchId = null;
}

window.addEventListener('load', () => {
  setupMobileControls();
  disableContextMenu();
});

function disableContextMenu() {
  const canvas = document.getElementById('canvas');
  const gameContainer = document.getElementById('gameContainer');
  const title = document.getElementById('title');

  [canvas, gameContainer, title, document.body].forEach((element) => {
    element.addEventListener('contextmenu', (event) => {
      event.preventDefault();
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

  const iconSrc = getSoundIconPath();

  if (iconPause) iconPause.src = iconSrc;
  if (iconGameEnd) iconGameEnd.src = iconSrc;
  if (iconGame) iconGame.src = iconSrc;
}

function getSoundIconPath() {
  if (soundManager.isMuted) {
    return 'img_pollo_locco/img/homescreen-icons/mute.png';
  } else {
    return 'img_pollo_locco/img/homescreen-icons/volume.png';
  }
}