// Optionen-Variablen
let soundEnabled = true;
let volume = 100;

function showOptions() {
  document.getElementById('menuContainer').innerHTML = `
    <div id="optionsMenu" class="menu-screen">
      <div class="options-container">
        <h2 class="menu-title">Options</h2>
        <div class="option-row">
          <label class="option-label">Sound:</label>
          <button id="soundToggle" class="toggle-button on" onclick="toggleSound()">ON</button>
        </div>
        <div class="option-row">
          <label class="option-label">Volume:</label>
          <input type="range" id="volumeSlider" class="volume-slider" min="0" max="100" value="100" oninput="updateVolume(this.value)">
          <span id="volumeValue" class="volume-value">100%</span>
        </div>
        <div class="option-row-button">
          <button class="menu-button back-button" onclick="backToStartWithAnimation()">Back</button>
        </div>
      </div>
    </div>
  `;
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
  if (soundEnabled) {
    toggleBtn.textContent = 'ON';
    toggleBtn.classList.remove('off');
    toggleBtn.classList.add('on');
  } else {
    toggleBtn.textContent = 'OFF';
    toggleBtn.classList.remove('on');
    toggleBtn.classList.add('off');
  }
}

function updateVolume(value) {
  volume = value;
  document.getElementById('volumeValue').textContent = value + '%';
}

function backToStart() {
  showStartMenu();
}

function backToStartWithAnimation() {
  const optionsMenu = document.getElementById('optionsMenu');
  if (optionsMenu) {
    optionsMenu.style.animation = 'fadeOutSlide 0.3s ease-in forwards';
    setTimeout(() => {
      backToStart();
    }, 300);
  } else {
    backToStart();
  }
}