window.addEventListener("load", () => {
  const overlay = document.getElementById("popupOverlay");
  if (!overlay) return;

  const buttons = overlay.querySelectorAll("[data-loc-action]");
  const KEY = "trove_location_choice";

  function closePopup() {
    overlay.style.display = "none";
  }

  function requestGeo() {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      () => {},
      () => {},
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 60000 }
    );
  }

  // Afficher le popup (mode maquette/test)
  overlay.style.display = "flex";

  // Les 3 boutons ferment TOUJOURS le popup
  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const action = btn.getAttribute("data-loc-action");
      localStorage.setItem(KEY, action);

      // ✅ ferme immédiatement dans tous les cas
      closePopup();

      // Si l'utilisateur autorise, on déclenche la vraie demande navigateur
      if (action !== "deny") requestGeo();
    });
  });

  // Fermer si on clique hors de la carte
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) closePopup();
  });
});
