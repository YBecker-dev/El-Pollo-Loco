function showImpressum() {
  document.getElementById('menuContainer').innerHTML = `
    <div id="impressumMenu" class="menu-screen">
      <div class="impressum-container">
        <h2 class="menu-title">Impressum</h2>

        <div class="impressum-content">
            <div class="impressum-row">
              <h3 class="impressum-section-title">Entwickler:</h3>
              <p class="impressum-text">Yannick Becker</p>
            </div>

            <div class="impressum-row">
              <h3 class="impressum-section-title">E-Mail:</h3>
              <p class="impressum-text">beckeryanick18@gmail.com</p>
            </div>

            <div class="impressum-row">
              <h3 class="impressum-section-title">Adresse:</h3>
              <p class="impressum-text">Hitzkirchenerstraße 22, 63699 Kefenrod</p>
            </div>
        </div>
        <button class="menu-button" onclick="showStartMenu()">Back</button>
      </div>
    </div>
  `;
}
