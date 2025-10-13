/**
 * Global variables for options:
 * - soundEnabled: Flag indicating if sound is enabled.
 * - volume: Current volume level (0-100).
 */
let soundEnabled = true;
let volume = 100;

/**
 * Shows the options menu by hiding all other menus and displaying the options menu.
 */
function showOptions() {
  hideAllMenus();
  const optionsMenu = document.getElementById('optionsMenu');
  optionsMenu.style.animation = '';
  optionsMenu.classList.remove('d-none');
  adjustOptionsContainerWidth();
  window.addEventListener('resize', adjustOptionsContainerWidth);
  syncOptionsWithSoundManager();
}

/**
 * Syncs the options UI with the current sound manager state.
 */
function syncOptionsWithSoundManager() {
  const toggleBtn = document.getElementById('soundToggle');
  const volumeSlider = document.getElementById('volumeSlider');
  const volumeValue = document.getElementById('volumeValue');

  soundEnabled = !soundManager.isMuted;
  updateSoundButton(toggleBtn);

  const currentVolume = Math.round(soundManager.volume * 100);
  volumeSlider.value = currentVolume;
  volumeValue.textContent = currentVolume + '%';
}

/**
 * Adjusts the width of the options container to match the canvas width.
 */
function adjustOptionsContainerWidth() {
  const canvas = document.getElementById('canvas');
  const optionsContainer = document.querySelector('.options-container');

  if (canvas && optionsContainer) {
    const canvasWidth = canvas.getBoundingClientRect().width;
    optionsContainer.style.width = `${canvasWidth - 32}px`;
  }
}

/**
 * Toggles the sound enabled state and updates the UI accordingly.
 */
function toggleSound() {
  soundEnabled = !soundEnabled;
  soundManager.toggleMute();
  const toggleBtn = document.getElementById('soundToggle');
  updateSoundButton(toggleBtn);
  updateSoundButtonIcons();
}

/**
 * Updates the sound toggle button based on the current sound state.
 * @param {HTMLElement} toggleBtn - The toggle button element to update.
 */
function updateSoundButton(toggleBtn) {
  if (soundEnabled) {
    setSoundButtonState(toggleBtn, 'ON', 'on', 'off');
  } else {
    setSoundButtonState(toggleBtn, 'OFF', 'off', 'on');
  }
}

/**
 * Sets the state of the sound toggle button by updating text and classes.
 * @param {HTMLElement} toggleBtn - The toggle button element.
 * @param {string} text - The text to set on the button.
 * @param {string} addClassName - The class to add.
 * @param {string} removeClassName - The class to remove.
 */
function setSoundButtonState(toggleBtn, text, addClassName, removeClassName) {
  toggleBtn.textContent = text;
  toggleBtn.classList.remove(removeClassName);
  toggleBtn.classList.add(addClassName);
}

/**
 * Updates the volume level and reflects it in the UI.
 * @param {number} value - The new volume value (0-100).
 */
function updateVolume(value) {
  volume = value;
  soundManager.setVolume(value);
  document.getElementById('volumeValue').textContent = value + '%';
  playHoverSound();
}

/**
 * Navigates back to the start menu.
 */
function backToStart() {
  showStartMenu();
}

/**
 * Navigates back to the start menu with a fade-out animation.
 */
function backToStartWithAnimation() {
  const currentMenu = document.querySelector('.menu-screen:not(.d-none)');
  if (currentMenu) {
    currentMenu.style.animation = 'fadeOutSlide 0.3s ease-in forwards';
    setTimeout(() => {
      backToStart();
    }, 300);
  } else {
    backToStart();
  }
}
