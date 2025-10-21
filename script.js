document.addEventListener("DOMContentLoaded", function() {
  // Initialisation carte si on est sur map.html
  const mapContainer = document.querySelector('.map-container');
  if (mapContainer) {
    const map = L.map(mapContainer).setView([48.8566, 2.3522], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map);
  }
});

var map = L.map('maMap').setView([48.8566, 2.3522], 13);

// Ajoute la couche OpenStreetMap
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap contributors'
}).addTo(map);
