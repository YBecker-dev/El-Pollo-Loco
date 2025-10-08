function showSteering() {
  document.getElementById('menuContainer').innerHTML = `
    <div id="steeringMenu" class="menu-screen">
      <div class="steering-container">
      <h2 class="menu-title">Steering</h2>
        <p class="steering-text">→ / D: Move right</p>
        <p class="steering-text">← / A: Move left</p>
        <p class="steering-text">↑ / W / Space: Jump</p>
        <p class="steering-text">F: Throw bottle</p>
        <p class="steering-text">Pause-Button: Pause game</p>
        <div class="steering-row-button">
        <button class="menu-button back-button" onclick="backToStartWithAnimation()">Back</button>
        </div>
      </div>
    </div>
  `;
}

function backToStartWithAnimation() {
  const steeringMenu = document.getElementById('steeringMenu');
  if (steeringMenu) {
    steeringMenu.style.animation = 'fadeOutSlide 0.3s ease-in forwards';
    setTimeout(() => {
      backToStart();
    }, 300);
  } else {
    backToStart();
  }
}
