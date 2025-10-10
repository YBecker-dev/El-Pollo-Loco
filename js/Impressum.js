/**
 * Shows the impressum menu by hiding all other menus and displaying the impressum menu.
 */
function showImpressum() {
  hideAllMenus();
  const impressumMenu = document.getElementById('impressumMenu');
  impressumMenu.style.animation = '';
  impressumMenu.classList.remove('d-none');
}
