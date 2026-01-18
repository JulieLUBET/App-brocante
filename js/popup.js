document.addEventListener("DOMContentLoaded", () => {
  const overlay = document.getElementById("popupOverlay");
  if (!overlay) return;

  const buttons = overlay.querySelectorAll("[data-loc-action]");

  function hidePopup() {
    overlay.classList.remove("is-open");
    overlay.setAttribute("aria-hidden", "true");
  }

  function showPopup() {
    overlay.classList.add("is-open");
    overlay.setAttribute("aria-hidden", "false");
  }

  function requestGeo() {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      () => {},
      () => {},
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 60000 }
    );
  }

  // ✅ Toujours caché au démarrage (pas de flash)
  hidePopup();

  // ✅ Afficher UNIQUEMENT quand on arrive de index.html (après connexion)
  const shouldShow = sessionStorage.getItem("show_loc_popup") === "1";

  if (shouldShow) {
    showPopup();

    // ✅ Important : on enlève le flag tout de suite
    // => si tu reviens sur map depuis une autre page : plus de popup
    sessionStorage.removeItem("show_loc_popup");
  }

  // ✅ Les 3 boutons ferment le popup
  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const action = btn.getAttribute("data-loc-action") || "deny";

      hidePopup();

      // Optionnel : déclencher la demande GPS seulement si autorisé
      if (action !== "deny") requestGeo();
    });
  });

  // (optionnel) clic sur le fond ferme aussi
  overlay.addEventListener("click", (e) => {
    if (e.target !== overlay) return;
    hidePopup();
  });
});
