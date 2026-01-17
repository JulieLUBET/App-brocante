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

  const brocanteSheet = document.getElementById("brocanteSheet");
  const brocanteSheetOverlay = document.getElementById("brocanteSheetOverlay");
  const brocantePopupContent = document.getElementById("brocantePopupContent");

  const brocSheetImage = document.getElementById("brocSheetImage");
  const brocLiveBadge = document.getElementById("brocLiveBadge");
  const brocLikeBtn = document.getElementById("brocLikeBtn");

  const brocGoBtn = document.getElementById("brocGoBtn");
  const brocShareBtn = document.getElementById("brocShareBtn");

  brocLiveBadge.addEventListener("click", () => {
    window.location.href = "flux.html";
  });

  function openBrocSheet() {
    brocanteSheet.classList.add("open");
    brocanteSheetOverlay.classList.add("active");
    brocanteSheet.setAttribute("aria-hidden", "false");
  }

  function closeBrocSheet() {
    brocanteSheet.classList.remove("open");
    brocanteSheetOverlay.classList.remove("active");
    brocanteSheet.setAttribute("aria-hidden", "true");
  }

  brocanteSheetOverlay.addEventListener("click", closeBrocSheet);

  /* ============================
     FILTRES
     ============================ */
  const filtres = {
    categorie: null, // Brocante / Marché aux Puces
    periode: null, // permanente / temporaire
    tags: [], // puces, vintage, etc.
    recherche: "", // Recherche par texte
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
        const texte = `${b.nom || ""} ${b.lieu || ""} ${
          b.description || ""
        }`.toLowerCase();

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
        // 1) Image
        if (b.presentationImage) {
          brocSheetImage.src = b.presentationImage;
          brocSheetImage.alt = b.nom || "Événement";
        } else {
          brocSheetImage.removeAttribute("src");
          brocSheetImage.alt = "";
        }

        // 2) Badge live (optionnel)
        // Si tu veux gérer par JSON: b.live === true/false
        if (b.live === false) {
          brocLiveBadge.style.display = "none";
        } else {
          brocLiveBadge.style.display = "inline-flex";
        }

        // 3) Contenu
        brocantePopupContent.innerHTML = `
    <h3 class="broc-title">${b.nom || ""}</h3>
    <p class="broc-sub">${b.lieu || ""}</p>
    ${b.date ? `<p class="broc-date">${b.date}</p>` : ""}
    ${b.description ? `<p class="broc-desc">${b.description}</p>` : ""}
    ${
      b.tags && b.tags.length
        ? `<div class="broc-tags">${b.tags
            .map((t) => `<span class="broc-tag">${t}</span>`)
            .join("")}</div>`
        : ""
    }
  `;

        // 4) Like (simple UI)
        brocLikeBtn.classList.remove("active");
        brocLikeBtn.textContent = "♡";
        brocLikeBtn.onclick = () => {
          const active = brocLikeBtn.classList.toggle("active");
          brocLikeBtn.textContent = active ? "♥" : "♡";
        };

        // 5) Bouton "M'y rendre"
        brocGoBtn.onclick = () => {
          if (b.coords && b.coords.length === 2) {
            const [lat, lng] = b.coords;
            window.open(
              `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`,
              "_blank"
            );
          }
        };

        // 6) Bouton "Partager"
        brocShareBtn.onclick = async () => {
          const txt = `${b.nom || ""}\n${b.lieu || ""}\n${b.date || ""}`;
          if (navigator.share) {
            try {
              await navigator.share({ title: b.nom || "Événement", text: txt });
            } catch (e) {}
          } else {
            try {
              await navigator.clipboard.writeText(txt);
              alert("Infos copiées dans le presse-papier.");
            } catch (e) {
              alert(txt);
            }
          }
        };

        openBrocSheet();
      });

      marqueursBrocantes.push(marker);
    });
  }

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
