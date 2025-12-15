document.addEventListener("DOMContentLoaded", () => {
  // --- Initialisation carte ---
  const map = L.map("maMap").setView([48.8566, 2.3522], 13);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "© OpenStreetMap contributors",
  }).addTo(map);

  // --- Variables ---
  let brocantes = [];
  let marqueursBrocantes = [];

  const brocantePopup = document.getElementById("brocantePopup");
  const brocantePopupOverlay = document.getElementById("brocantePopupOverlay");
  const brocantePopupContent = document.getElementById("brocantePopupContent");

  // --- Chargement JSON brocantes ---
  fetch("data/localisation.json")
    .then((res) => res.json())
    .then((data) => {
      brocantes = data;
      afficherMarqueurs();
    })
    .catch((err) => console.error("Erreur JSON :", err));

  // --- Icône personnalisée ---
  function createIcon(imageUrl) {
    return L.icon({
      iconUrl: imageUrl,
      iconSize: [40, 40],
      iconAnchor: [20, 40],
    });
  }

  // --- Affichage des marqueurs ---
  function afficherMarqueurs() {
    marqueursBrocantes.forEach((m) => map.removeLayer(m));
    marqueursBrocantes = [];

    brocantes.forEach((b) => {
      // Utiliser l'image du JSON ou une par défaut
      const iconUrl = b.markerImage || "./images/broc1.png";
      const marker = L.marker(b.coords, { icon: createIcon(iconUrl) }).addTo(map);

      marker.on("click", () => {
        // Contenu dynamique du popup fixe
        brocantePopupContent.innerHTML = `
          ${b.presentationImage ? `<img src="${b.presentationImage}" alt="${b.nom}" style="width:100%; border-radius:15px; margin-bottom:10px;">` : ""}
          <h3>${b.nom}</h3>
          ${b.lieu ? `<p> ${b.lieu}</p>` : ""}
          ${b.date ? `<p> ${b.date}</p>` : ""}
          ${b.description ? `<p>${b.description}</p>` : ""}
          ${b.tags ? `<div class="tags">${b.tags.map(tag => `<span>${tag}</span>`).join("")}</div>` : ""}
          <button class="btn-main">M'y rendre</button>
        `;

        brocantePopup.classList.add("open");
        brocantePopupOverlay.classList.add("active");
      });

      marqueursBrocantes.push(marker);
    });
  }

  // --- Fermer le popup brocante en cliquant sur overlay ---
  brocantePopupOverlay.addEventListener("click", () => {
    brocantePopup.classList.remove("open");
    brocantePopupOverlay.classList.remove("active");
  });

  // --- Géolocalisation ---
  const geolocBtn = document.getElementById("btn-geoloc");
  let userMarker, userCircle;

  const geoIcon = L.icon({
    iconUrl: 'data:image/svg+xml;utf8,' + encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 48">
        <path d="M16 0C7.163 0 0 7.163 0 16c0 11.264 16 32 16 32s16-20.736 16-32C32 7.163 24.837 0 16 0z" fill="#225836"/>
        <circle cx="16" cy="16" r="6" fill="white"/>
      </svg>
    `),
    iconSize: [32, 48],
    iconAnchor: [16, 48],
    popupAnchor: [0, -48]
  });

  geolocBtn.addEventListener("click", () => {
    if (!navigator.geolocation) {
      alert("La géolocalisation n'est pas disponible sur votre navigateur.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        const accuracy = pos.coords.accuracy;

        map.setView([lat, lng], 15);

        if (userMarker) map.removeLayer(userMarker);
        if (userCircle) map.removeLayer(userCircle);

        userMarker = L.marker([lat, lng], { icon: geoIcon }).addTo(map)
          .bindPopup("Vous êtes ici").openPopup();

        userCircle = L.circle([lat, lng], {
          radius: accuracy,
          color: "#225836",
          fillColor: "#225836",
          fillOpacity: 0.2,
        }).addTo(map);
      },
      (err) => alert("Impossible de récupérer la position : " + err.message),
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  });
});
