function initStartScreen() {
  canvas = document.getElementById('canvas');
  ctx = canvas.getContext('2d');

  let startScreenImage = new Image();
  startScreenImage.src = 'img_pollo_locco/img/9_intro_outro_screens/start/startscreen_1.png';
  startScreenImage.onload = () => {
    ctx.drawImage(startScreenImage, 0, 0, canvas.width, canvas.height);
  };

  showStartMenu();
}

function showStartMenu() {
  document.getElementById('menuContainer').innerHTML = `
    <div id="startMenu" class="menu-screen">
      <!-- Top Left Buttons -->
      <div class="corner-buttons top-left">
        <button class="icon-button" onclick="showImpressum()" title="Impressum">
          <span class="front">
            <span class="icon-text">i</span>
          </span>
        </button>
        <button class="icon-button" onclick="showSteering()" title="Steering">
          <span class="front">
            <span class="icon-text">⌨</span>
          </span>
        </button>
      </div>

      <!-- Top Right Button -->
      <div class="corner-buttons top-right">
        <button class="icon-button" onclick="showOptions()" title="Options">
          <span class="front">
            <span class="icon-text">🔊</span>
          </span>
        </button>
      </div>

      <!-- Center Play Button -->
      <button class="play-button" onclick="startGame()">
        <span class="front">
          <span class="play-icon">▶</span>
        </span>
      </button>
    </div>
  `;
}

function startGame() {
  document.getElementById('menuContainer').innerHTML = '';

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  document.getElementById('pauseButton').classList.remove('d-none');
  toggleMobileControlsVisibility(true);

  init();
}

function backToMainMenu() {
  document.getElementById('restartButton').classList.add('d-none');
  document.getElementById('mainMenuButton').classList.add('d-none');
  document.getElementById('pauseButton').classList.add('d-none');
  toggleMobileControlsVisibility(false);

  stopGame();

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  initLevel();

  initStartScreen();
}
