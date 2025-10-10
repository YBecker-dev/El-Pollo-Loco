/**
 * Global variables for the game:
 * - world: Global game world instance.
 * - keyboard: Keyboard input handler instance.
 * - canvas: Canvas element for rendering the game.
 * - ctx: 2D rendering context of the canvas.
 * - joystickActive: Flag indicating if the virtual joystick is currently active.
 * - joystickTouchId: Identifier of the current joystick touch.
 * - joystickStartX: Starting X position of the joystick touch.
 * - joystickStartY: Starting Y position of the joystick touch.
 * - joystickMaxDistance: Maximum distance the joystick can move from its start position.
 */
let world;
let keyboard = new Keyboard();
let canvas;
let ctx;
let joystickActive = false;
let joystickTouchId = null;
let joystickStartX = 0;
let joystickStartY = 0;
let joystickMaxDistance = 60;

/**
 * Initializes the game by setting up the canvas, sounds, and creating the game world.
 * This function is called to start the game environment.
 */
function init() {
  canvas = document.getElementById('canvas');
  initializeSounds();
  soundManager.resetGameOver();
  world = new World(canvas, keyboard);
  ctx = canvas.getContext('2d');
}

/**
 * Initializes all character-related sound effects by registering them with the sound manager.
 * This includes sounds for jumping, getting hurt, dying, and sleeping.
 */
function initializeCharacterSounds() {
  soundManager.addSound('jump', 'audio/character/jump/jump.wav');
  soundManager.addSound('hurt', 'audio/character/hurt/hurt.wav');
  soundManager.addSound('dead', 'audio/character/dead/dead.wav');
  soundManager.addSound('sleeping', 'audio/character/sleeping/sleeping.wav');
}

/**
 * Initializes chicken-related sound effects by registering the death sound with the sound manager.
 */
function initializeChickenSounds() {
  soundManager.addSound('chickenDead', 'audio/chicken/dead/chicken-dead.mp3');
}

/**
 * Initializes endboss-related sound effects by registering alert, hurt, and death sounds with the sound manager.
 */
function initializeEndbossSounds() {
  soundManager.addSound('endbossAlert', 'audio/Endboss/alert/endboss-alert.mp3');
  soundManager.addSound('endbossHurt', 'audio/Endboss/hurt/endboss-hurt.mp3');
  soundManager.addSound('endbossDead', 'audio/Endboss/dead/endboss-dead.mp3');
}

/**
 * Initializes gameplay-related sound effects including coin collection, bottle actions, pause/unpause, and win/lose sounds.
 */
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

/**
 * Master function that initializes all game sound effects by calling individual sound initialization functions.
 */
function initializeSounds() {
  initializeCharacterSounds();
  initializeChickenSounds();
  initializeEndbossSounds();
  initializeGameplaySounds();
}

/**
 * Toggles the pause state of the game world if a world instance exists.
 */
function togglePause() {
  if (world) {
    world.togglePause();
  }
}

/**
 * Restarts the game by resetting the UI, cleaning up the game state, and restarting the game logic.
 */
function restartGame() {
  resetGameUI();
  cleanupGameState();
  restartGameLogic();
}

/**
 * Resets the game UI by hiding restart and main menu buttons, showing the sound button, and toggling mobile controls visibility.
 */
function resetGameUI() {
  document.getElementById('restartButton').classList.add('d-none');
  document.getElementById('mainMenuButton').classList.add('d-none');
  document.getElementById('soundButtonGameEnd').classList.add('d-none');
  document.getElementById('soundButtonGame').classList.add('show');
  toggleMobileControlsVisibility(true);
}

/**
 * Cleans up the current game state by stopping the game and clearing the canvas.
 */
function cleanupGameState() {
  stopGame();
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

/**
 * Restarts the game logic by initializing the level, resuming background music, and calling the init function.
 */
function restartGameLogic() {
  initLevel();
  soundManager.resumeBackgroundMusic();
  init();
}

/**
 * Mapping of keyboard keys to game actions for input handling.
 */
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

/**
 * Event handler for keydown events to set keyboard state based on key mappings.
 */
window.addEventListener('keydown', (event) => {
  const key = keyMap[event.key] || keyMap[event.key.toLowerCase()];
  if (key) {
    keyboard[key] = true;
  }
});

/**
 * Event handler for keyup events to reset keyboard state and handle special keys like Escape.
 */
window.addEventListener('keyup', (event) => {
  const key = keyMap[event.key] || keyMap[event.key.toLowerCase()];
  if (key) {
    keyboard[key] = false;
  }

  if (event.key === 'Escape' && world && world.character && !world.levelCompleted && !world.character.isdead) {
    togglePauseMenu();
  }
});

/**
 * Toggles the visibility of the pause menu overlay.
 * Shows the pause menu if hidden, hides it if visible.
 */
function togglePauseMenu() {
  const pauseOverlay = document.getElementById('pauseOverlay');
  if (pauseOverlay.classList.contains('d-none')) {
    showPauseMenu(pauseOverlay);
  } else {
    hidePauseMenu(pauseOverlay);
  }
}

/**
 * Shows the pause menu overlay and pauses the game if not already paused.
 * @param {HTMLElement} pauseOverlay - The pause overlay element to show
 */
function showPauseMenu(pauseOverlay) {
  pauseOverlay.classList.remove('d-none');
  toggleMobileControlsVisibility(false);
  if (world && !world.isPaused) {
    world.togglePause();
  }
}

/**
 * Hides the pause menu overlay and unpauses the game if currently paused.
 * @param {HTMLElement} pauseOverlay - The pause overlay element to hide
 */
function hidePauseMenu(pauseOverlay) {
  pauseOverlay.classList.add('d-none');
  toggleMobileControlsVisibility(true);
  if (world && world.isPaused) {
    world.togglePause();
  }
}

/**
 * Returns to the main menu from the pause screen by hiding the pause overlay and calling backToMainMenu.
 */
function backToMainMenuFromPause() {
  document.getElementById('pauseOverlay').classList.add('d-none');

  backToMainMenu();
}

/**
 * Binds touch event handlers to a mobile button for keyboard simulation.
 * @param {string} buttonId - The ID of the button element to bind
 * @param {string} keyboardProperty - The keyboard property to simulate (e.g., 'Space', 'F')
 */
function bindMobileButton(buttonId, keyboardProperty) {
  const button = document.getElementById(buttonId);
  bindTouchHandler(button, keyboardProperty, 'touchstart', true);
  bindTouchHandler(button, keyboardProperty, 'touchend', false);
}

/**
 * Binds a touch event handler to a button element for keyboard simulation.
 * @param {HTMLElement} button - The button element to bind the handler to
 * @param {string} keyboardProperty - The keyboard property to modify
 * @param {string} eventType - The touch event type ('touchstart' or 'touchend')
 * @param {boolean} value - The value to set for the keyboard property
 */
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

/**
 * Toggles the visibility of mobile controls based on screen width and show parameter.
 * @param {boolean} show - Whether to show or hide the mobile controls
 */
function toggleMobileControlsVisibility(show) {
  const mobileControls = document.getElementById('mobileControls');
  if (show && window.innerWidth <= 1370) {
    mobileControls.classList.remove('d-none');
  } else {
    mobileControls.classList.add('d-none');
  }
}

/**
 * Sets up mobile controls including virtual joystick and button bindings if screen width is small enough.
 */
function setupMobileControls() {
  if (window.innerWidth <= 1370) {
    setupVirtualJoystick();
    bindMobileButton('btnJump', 'Space');
    bindMobileButton('btnThrow', 'F');
  }
}

/**
 * Sets up event listeners for the virtual joystick touch interactions.
 */
function setupVirtualJoystick() {
  const joystickArea = document.getElementById('joystickArea');

  joystickArea.addEventListener('touchstart', handleJoystickTouchStart, { passive: false });
  joystickArea.addEventListener('touchmove', handleJoystickTouchMove, { passive: false });
  joystickArea.addEventListener('touchend', handleJoystickTouchEnd, { passive: false });
  joystickArea.addEventListener('touchcancel', handleJoystickTouchEnd, { passive: false });
}

/**
 * Handles the start of a joystick touch interaction.
 * @param {TouchEvent} event - The touch event
 */
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

/**
 * Handles joystick movement during touch interaction.
 * @param {TouchEvent} event - The touch event
 */
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

/**
 * Handles the end of a joystick touch interaction.
 * @param {TouchEvent} event - The touch event
 */
function handleJoystickTouchEnd(event) {
  event.preventDefault();
  if (!joystickActive) return;

  if (isCurrentTouchEnded(event)) {
    hideJoystick();
    resetJoystickState();
  }
}

/**
 * Calculates the touch position relative to a given area element.
 * @param {Touch} touch - The touch object
 * @param {HTMLElement} area - The area element to calculate position relative to
 * @returns {Object} Object with x and y coordinates
 */
function calculateTouchPosition(touch, area) {
  const rect = area.getBoundingClientRect();
  return {
    x: touch.clientX - rect.left,
    y: touch.clientY - rect.top,
  };
}

/**
 * Calculates the constrained stick position within the maximum distance from the start position.
 * @param {Object} touchPos - The current touch position with x and y coordinates
 * @returns {Object} The constrained stick position
 */
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

/**
 * Shows the virtual joystick at the specified position.
 * @param {Object} position - The position to show the joystick at with x and y coordinates
 */
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

/**
 * Updates the visual position of the joystick stick element.
 * @param {Object} position - The position to move the stick to with x and y coordinates
 */
function updateJoystickVisual(position) {
  const stick = document.getElementById('joystickStick');
  stick.style.left = position.x + 'px';
  stick.style.top = position.y + 'px';
}

/**
 * Updates keyboard state based on joystick touch position for movement controls.
 * @param {Object} touchPos - The current touch position with x and y coordinates
 */
function updateKeyboardFromJoystick(touchPos) {
  const deltaX = touchPos.x - joystickStartX;
  const threshold = 20;
  keyboard.Left = deltaX < -threshold;
  keyboard.Right = deltaX > threshold;
}

/**
 * Finds the current touch in the touches list by identifier.
 * @param {TouchList} touches - The list of current touches
 * @returns {Touch|null} The current touch or null if not found
 */
function findCurrentTouch(touches) {
  for (let i = 0; i < touches.length; i++) {
    if (touches[i].identifier === joystickTouchId) {
      return touches[i];
    }
  }
  return null;
}

/**
 * Checks if the current touch has ended in the touch event.
 * @param {TouchEvent} event - The touch event
 * @returns {boolean} True if the current touch has ended
 */
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

/**
 * Hides the virtual joystick elements by adding the 'd-none' class.
 */
function hideJoystick() {
  const base = document.getElementById('joystickBase');
  const stick = document.getElementById('joystickStick');
  base.classList.add('d-none');
  stick.classList.add('d-none');
}

/**
 * Resets the joystick state to default values, clearing keyboard inputs and deactivating the joystick.
 */
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

/**
 * Disables the context menu for specified elements to prevent right-click interactions.
 */
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

/**
 * Toggles the mute state of the sound manager and updates the sound button icons.
 */
function toggleSoundButton() {
  soundManager.toggleMute();
  updateSoundButtonIcons();
}

/**
 * Updates the source paths of sound button icons based on the current mute state.
 */
function updateSoundButtonIcons() {
  const iconPause = document.getElementById('soundIconPause');
  const iconGameEnd = document.getElementById('soundIconGameEnd');
  const iconGame = document.getElementById('soundIconGame');

  const iconSrc = getSoundIconPath();

  if (iconPause) iconPause.src = iconSrc;
  if (iconGameEnd) iconGameEnd.src = iconSrc;
  if (iconGame) iconGame.src = iconSrc;
}

/**
 * Gets the appropriate sound icon path based on whether sound is muted or not.
 * @returns {string} The path to the sound icon image
 */
function getSoundIconPath() {
  if (soundManager.isMuted) {
    return 'img_pollo_locco/img/homescreen-icons/mute.png';
  } else {
    return 'img_pollo_locco/img/homescreen-icons/volume.png';
  }
}
