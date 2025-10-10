/**
 * Initializes the start screen by setting up the canvas, drawing the start image, initializing background music, and showing the start menu.
 */
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
  setupClickOutsideMenus();
}

/**
 * Initializes the background music for the game.
 */
function initBackgroundMusic() {
  createBackgroundMusicIfNeeded();
  setupAutoplayWorkaround();
}

/**
 * Creates the background music audio object if it doesn't already exist.
 */
function createBackgroundMusicIfNeeded() {
  if (!soundManager.backgroundMusic) {
    soundManager.backgroundMusic = new Audio('audio/Gameplay/background/background.wav');
    soundManager.backgroundMusic.loop = true;
    soundManager.backgroundMusic.volume = soundManager.volume;
  }
}

/**
 * Sets up event listeners to handle autoplay restrictions for background music.
 */
function setupAutoplayWorkaround() {
  document.addEventListener('click', startBackgroundMusicOnInteraction, { once: true });
  document.addEventListener('keydown', startBackgroundMusicOnInteraction, { once: true });
}

/**
 * Starts the background music on user interaction if not muted and paused.
 */
function startBackgroundMusicOnInteraction() {
  if (!soundManager.isMuted && soundManager.backgroundMusic.paused) {
    soundManager.backgroundMusic.play().catch(() => {});
  }
  removeAutoplayListeners();
}

/**
 * Removes the autoplay workaround event listeners.
 */
function removeAutoplayListeners() {
  document.removeEventListener('click', startBackgroundMusicOnInteraction);
  document.removeEventListener('keydown', startBackgroundMusicOnInteraction);
}

/**
 * Shows the start menu by hiding all other menus and displaying the start menu.
 */
function showStartMenu() {
  hideAllMenus();
  const startMenu = document.getElementById('startMenu');
  startMenu.style.animation = '';
  startMenu.classList.remove('d-none');
}

/**
 * Hides all menu screens by adding the 'd-none' class.
 */
function hideAllMenus() {
  document.getElementById('startMenu').classList.add('d-none');
  document.getElementById('optionsMenu').classList.add('d-none');
  document.getElementById('steeringMenu').classList.add('d-none');
  document.getElementById('impressumMenu').classList.add('d-none');
}

/**
 * Starts the game by hiding menus, clearing the canvas, showing controls, and initializing the game.
 */
function startGame() {
  hideAllMenus();

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  toggleMobileControlsVisibility(true);
  document.getElementById('soundButtonGame').classList.add('show');
  updateSoundButtonIcons();

  initLevel();
  init();
}

/**
 * Navigates back to the main menu by hiding game end UI, resetting state, and reinitializing the start screen.
 */
function backToMainMenu() {
  hideGameEndUIElements();
  resetGameState();
  initStartScreen();
}

/**
 * Hides UI elements related to game end, such as restart and main menu buttons.
 */
function hideGameEndUIElements() {
  document.getElementById('restartButton').classList.add('d-none');
  document.getElementById('mainMenuButton').classList.add('d-none');
  document.getElementById('soundButtonGameEnd').classList.add('d-none');
  document.getElementById('soundButtonGame').classList.remove('show');
  toggleMobileControlsVisibility(false);
}

/**
 * Resets the game state by stopping intervals, clearing canvas, reinitializing level, and resuming background music.
 */
function resetGameState() {
  stopGame();
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  initLevel();
  soundManager.resumeBackgroundMusic();
}

/**
 * Sets up click-outside functionality for all menu screens.
 * Clicking outside a menu container will close the menu and return to start screen.
 */
function setupClickOutsideMenus() {
  const menuContainer = document.getElementById('menuContainer');
  menuContainer.addEventListener('click', handleMenuOutsideClick);
}

/**
 * Handles clicks outside menu containers to close them.
 * @param {Event} event - The click event.
 */
function handleMenuOutsideClick(event) {
  if (event.target.closest('button') || event.target.closest('.icon-button')) {
    return;
  }
  const menus = getMenuVisibility();
  if (menus.isOptionsVisible && !event.target.closest('.options-container')) {
    backToStartWithAnimation();
  } else if (menus.isSteeringVisible && !event.target.closest('.steering-container')) {
    backToStartWithAnimation();
  } else if (menus.isImpressumVisible && !event.target.closest('.impressum-container')) {
    showStartMenu();
  }
}

/**
 * Gets the visibility state of all menu screens.
 * @returns {Object} Object containing visibility flags for each menu.
 */
function getMenuVisibility() {
  return {
    isOptionsVisible: !document.getElementById('optionsMenu').classList.contains('d-none'),
    isSteeringVisible: !document.getElementById('steeringMenu').classList.contains('d-none'),
    isImpressumVisible: !document.getElementById('impressumMenu').classList.contains('d-none'),
  };
}
