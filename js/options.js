// Optionen-Variablen
let soundEnabled = true;
let volume = 100;

function showOptions() {
  hideAllMenus();
  document.getElementById('optionsMenu').classList.remove('d-none');
  adjustOptionsContainerWidth();
  window.addEventListener('resize', adjustOptionsContainerWidth);
}

function adjustOptionsContainerWidth() {
  const canvas = document.getElementById('canvas');
  const optionsContainer = document.querySelector('.options-container');

  if (canvas && optionsContainer) {
    const canvasWidth = canvas.getBoundingClientRect().width;
    optionsContainer.style.width = `${canvasWidth - 32}px`;
  }
}

function toggleSound() {
  soundEnabled = !soundEnabled;
  const toggleBtn = document.getElementById('soundToggle');
  updateSoundButton(toggleBtn);
}

function updateSoundButton(toggleBtn) {
  if (soundEnabled) {
    setSoundButtonState(toggleBtn, 'ON', 'on', 'off');
  } else {
    setSoundButtonState(toggleBtn, 'OFF', 'off', 'on');
  }
}

function setSoundButtonState(toggleBtn, text, addClassName, removeClassName) {
  toggleBtn.textContent = text;
  toggleBtn.classList.remove(removeClassName);
  toggleBtn.classList.add(addClassName);
}

function updateVolume(value) {
  volume = value;
  document.getElementById('volumeValue').textContent = value + '%';
}

function backToStart() {
  showStartMenu();
}

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