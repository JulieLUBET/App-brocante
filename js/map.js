document.addEventListener("DOMContentLoaded", () => {
  /* ============================
     INITIALISATION DE LA CARTE
     ============================ */
  window.map = L.map("maMap").setView([48.8566, 2.3522], 13);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "© OpenStreetMap contributors",
  }).addTo(map);

  /* ============================
     VARIABLES GLOBALES
     ============================ */
  let brocantes = [];
  let marqueursBrocantes = [];

  const brocantePopup = document.getElementById("brocantePopup");
  const brocantePopupOverlay = document.getElementById("brocantePopupOverlay");
  const brocantePopupContent = document.getElementById("brocantePopupContent");

  /* ============================
     FILTRES
     ============================ */
  const filtres = {
    categorie: null, // Brocante / Marché aux Puces
    periode: null, // permanente / temporaire
    tags: [], // puces, vintage, etc.
    recherche: "" // Recherche par texte
  };

  /* ============================
     CHARGEMENT DES DONNÉES
     ============================ */
  fetch("data/localisation.json")
    .then((res) => res.json())
    .then((data) => {
      brocantes = data;
      afficherMarqueursFiltres();
    })
    .catch((err) => console.error("Erreur JSON :", err));

  /* ============================
     ICÔNES
     ============================ */
  function createIcon(imageUrl) {
    return L.icon({
      iconUrl: imageUrl,
      iconSize: [40, 40],
      iconAnchor: [20, 40],
    });
  }

  /* ============================
     AFFICHAGE DES MARQUEURS
     ============================ */
  function afficherMarqueursFiltres() {
    marqueursBrocantes.forEach((m) => map.removeLayer(m));
    marqueursBrocantes = [];

    let resultat = [...brocantes];

    /* =========================
     FILTRE CATEGORIE (exclusif)
     ========================= */
    if (filtres.categorie) {
      resultat = resultat.filter((b) => b.categorie === filtres.categorie);
    }

    /* =========================
     FILTRE PERIODE (exclusif)
     ========================= */
    if (filtres.periode) {
      resultat = resultat.filter(
        (b) => b.tags && b.tags.includes(filtres.periode)
      );
    }

    /* =========================
     FILTRE TAGS (cumulables)
     ========================= */
    if (filtres.tags.length > 0) {
      resultat = resultat.filter(
        (b) => b.tags && filtres.tags.every((tag) => b.tags.includes(tag))
      );
    }

    /* =========================
     FILTRE RECHERCHE TEXTE (lieu, nom, description)
     ========================= */
    if (filtres.recherche) {
      resultat = resultat.filter((b) => {
        const texte =
          `${b.nom || ""} ${b.lieu || ""} ${b.description || ""}`.toLowerCase();

        return texte.includes(filtres.recherche);
      });
    }

    /* =========================
     AFFICHAGE
     ========================= */
    resultat.forEach((b) => {
      const iconUrl = b.markerImage || "./images/broc1.png";
      const marker = L.marker(b.coords, {
        icon: createIcon(iconUrl),
      }).addTo(map);

      marker.on("click", () => {
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

  /* ============================
     POPUP BROCANTE
     ============================ */
  brocantePopupOverlay.addEventListener("click", () => {
    brocantePopup.classList.remove("open");
    brocantePopupOverlay.classList.remove("active");
  });

  /* ============================
     TAGS CLIQUABLES (RECHERCHE)
     ============================ */
  document.querySelectorAll(".tag").forEach((tag) => {
    tag.addEventListener("click", () => {
      const value = tag.dataset.value;
      const type = tag.dataset.type;

      /* =========================
       CATEGORIE (exclusif)
       ========================= */
      if (type === "categorie") {
        const isActive = tag.classList.contains("active");

        document
          .querySelectorAll('.tag[data-type="categorie"]')
          .forEach((t) => t.classList.remove("active"));

        filtres.categorie = isActive ? null : value;

        if (!isActive) tag.classList.add("active");
      }

      /* =========================
       PERIODE (exclusif)
       ========================= */
      if (type === "periode") {
        const isActive = tag.classList.contains("active");

        document
          .querySelectorAll('.tag[data-type="periode"]')
          .forEach((t) => t.classList.remove("active"));

        filtres.periode = isActive ? null : value;

        if (!isActive) tag.classList.add("active");
      }

      /* =========================
       TAGS LIBRES (cumulables)
       ========================= */
      if (type === "tag") {
        tag.classList.toggle("active");

        if (tag.classList.contains("active")) {
          filtres.tags.push(value);
        } else {
          filtres.tags = filtres.tags.filter((t) => t !== value);
        }
      }

      afficherMarqueursFiltres();
    });
  });

  /* ============================
     GÉOLOCALISATION (UNIQUE)
     ============================ */
  const btnGeoloc = document.getElementById("btn-geoloc");
  let userMarker, userCircle;

  const geoIcon = L.icon({
    iconUrl:
      "data:image/svg+xml;utf8," +
      encodeURIComponent(`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 48">
          <path d="M16 0C7.163 0 0 7.163 0 16c0 11.264 16 32 16 32s16-20.736 16-32C32 7.163 24.837 0 16 0z" fill="#225836"/>
          <circle cx="16" cy="16" r="6" fill="white"/>
        </svg>
      `),
    iconSize: [32, 48],
    iconAnchor: [16, 48],
  });

  btnGeoloc.addEventListener("click", () => {
    if (!navigator.geolocation) {
      alert("Géolocalisation indisponible");
      return;
    }

    navigator.geolocation.getCurrentPosition((pos) => {
      const { latitude, longitude, accuracy } = pos.coords;

      map.setView([latitude, longitude], 15);

      if (userMarker) map.removeLayer(userMarker);
      if (userCircle) map.removeLayer(userCircle);

      userMarker = L.marker([latitude, longitude], {
        icon: geoIcon,
      })
        .addTo(map)
        .bindPopup("Vous êtes ici")
        .openPopup();

      userCircle = L.circle([latitude, longitude], {
        radius: accuracy,
        color: "#225836",
        fillOpacity: 0.2,
      }).addTo(map);
    });
  });

  /* ============================
     RECHERCHE EN TEMPS RÉEL
     ============================ */
  const searchInput = document.getElementById("search-city");

  searchInput.addEventListener("input", (e) => {
    filtres.recherche = e.target.value.toLowerCase().trim();
    afficherMarqueursFiltres();
  });
});
