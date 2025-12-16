const btnOpenSearch = document.getElementById("open-search");
const searchPopup = document.getElementById("searchPopup");
const searchPopupOverlay = document.getElementById("searchPopupOverlay");
const btnGeoloc = document.getElementById("btn-geoloc");

// Ouvrir le popup
btnOpenSearch.addEventListener("click", () => {
  searchPopup.classList.add("open");
  searchPopupOverlay.classList.add("active");
});

// Fermer le popup en cliquant sur l'overlay
searchPopupOverlay.addEventListener("click", () => {
  searchPopup.classList.remove("open");
  searchPopupOverlay.classList.remove("active");
});

/* Géolocalisation
btnGeoloc.addEventListener("click", () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        map.setView([latitude, longitude], 13); // centrer la carte sur la position
        L.marker([latitude, longitude]).addTo(map).bindPopup("Vous êtes ici").openPopup();
      },
      (error) => {
        alert("Impossible d'obtenir votre position.");
      }
    );
  } else {
    alert("La géolocalisation n'est pas supportée par votre navigateur.");
  }
});*/
