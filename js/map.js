document.addEventListener("DOMContentLoaded", () => {
  // --- Initialisation de la carte centrée sur Paris ---
  const map = L.map("maMap").setView([48.8566, 2.3522], 13);

  // Ajoute la couche OpenStreetMap
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "© OpenStreetMap contributors",
  }).addTo(map);

  // --- Variables pour les brocantes ---
  let brocantes = [];
  let marqueursBrocantes = [];

  // --- Chargement du fichier JSON ---
  fetch("data/localisation.json")
    .then((response) => {
      if (!response.ok) throw new Error("❌ JSON introuvable : " + response.status);
      return response.json();
    })
    .then((data) => {
      console.log("JSON chargé :", data);
      brocantes = data;
      afficherMarqueurs();
    })
    .catch((err) => console.error("Erreur JSON :", err));

  // --- Fonction qui affiche les marqueurs ---
  function afficherMarqueurs() {
    // Supprime les anciens marqueurs
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

  // --- Bouton "A proximité" pour géolocaliser l'utilisateur ---
  const geolocBtn = document.getElementById("btn-geoloc");
  let userMarker;
  let userCircle;

  geolocBtn.addEventListener("click", () => {
    if (!navigator.geolocation) {
      alert("La géolocalisation n'est pas disponible sur votre navigateur.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        const accuracy = position.coords.accuracy; // précision en mètres

        // Centre la carte sur la position de l'utilisateur
        map.setView([lat, lng], 15);

        // Supprime le marqueur et cercle précédent si nécessaire
        if (userMarker) map.removeLayer(userMarker);
        if (userCircle) map.removeLayer(userCircle);

        // Ajoute un marqueur pour l'utilisateur
        userMarker = L.marker([lat, lng])
          .addTo(map)
          .bindPopup("Vous êtes ici")
          .openPopup();

        // Ajoute un cercle de précision autour de l'utilisateur
        userCircle = L.circle([lat, lng], {
          radius: accuracy,
          color: "#007AFF",
          fillColor: "#007AFF",
          fillOpacity: 0.2,
        }).addTo(map);
      },
      (err) => {
        alert("Impossible de récupérer la position : " + err.message);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  });
});
