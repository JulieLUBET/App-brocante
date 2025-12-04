window.addEventListener("load", () => {
  const overlay = document.getElementById("popupOverlay");
  const closeBtn = document.getElementById("popupCloseBtn");

  // Bouton "Continuer"
  closeBtn.addEventListener("click", () => {
    overlay.style.display = "none";
  });

  // Fermer en cliquant dehors
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) overlay.style.display = "none";
  });
});
