function showSteering() {
  hideAllMenus();
  const steeringMenu = document.getElementById('steeringMenu');
  steeringMenu.style.animation = '';
  steeringMenu.classList.remove('d-none');
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
