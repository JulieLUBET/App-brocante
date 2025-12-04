document.addEventListener("DOMContentLoaded", () => {
  // --- Initialisation de la carte centrée sur Paris ---
  var map = L.map("maMap").setView([48.8566, 2.3522], 13);

  // Ajoute la couche OpenStreetMap
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "© OpenStreetMap contributors",
  }).addTo(map);

  // Tableau qui contiendra les brocantes
  let brocantes = [];
  let marqueursBrocantes = [];

  // --- Chargement du fichier JSON ---
  fetch("data/localisation.json")
    .then((response) => {
      if (!response.ok) {
        throw new Error("❌ JSON introuvable : " + response.status);
      }
      return response.json();
    })
    .then((data) => {
      console.log("JSON chargé :", data); // debug
      brocantes = data;
      afficherMarqueurs();
    })
    .catch((err) => console.error("Erreur JSON :", err));

  // --- Fonction qui affiche les marqueurs ---
  function afficherMarqueurs() {
    marqueursBrocantes.forEach((m) => map.removeLayer(m));
    marqueursBrocantes = [];

    brocantes.forEach((brocante) => {
      if (!brocante.coords) return;

      const marker = L.marker(brocante.coords)
        .addTo(map)
        .bindPopup(`<b>${brocante.nom}</b>`);

      marqueursBrocantes.push(marker);
    });

    console.log("Marqueurs affichés :", marqueursBrocantes.length);
  }
});
