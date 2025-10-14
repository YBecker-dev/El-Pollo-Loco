/**
 * Keyboard Input Module - Handles keyboard event listeners and mappings
 */

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

  if (event.key === 'Escape' && world && world.character && !world.levelCompleted && !world.character.isdead && !isEndbossDefeated()) {
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
