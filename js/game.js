/**
 * Global variables for the game:
 * - world: Global game world instance.
 * - keyboard: Keyboard input handler instance.
 * - canvas: Canvas element for rendering the game.
 * - ctx: 2D rendering context of the canvas.
 */
let world;
let keyboard = new Keyboard();
let canvas;
let ctx;


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

window.addEventListener('load', () => {
  setupMobileControls();
  disableContextMenu();
});
