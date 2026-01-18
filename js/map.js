document.addEventListener("DOMContentLoaded", () => {
  /* ============================
     INITIALISATION DE LA CARTE
     ============================ */
  window.map = L.map("maMap").setView([48.8566, 2.3522], 13);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "© OpenStreetMap contributors",
  }).addTo(map);

  /* ============================
     MODE : brocantes (default) / amis
     ============================ */
  let modeAffichage = "brocantes";

  const SWITCH_ICON_BROC_TO_AMIS = "images/icon_switch_map.png";
  const SWITCH_ICON_AMIS_TO_BROC = "images/icon_switch_map2.png";

  const switchMapBtn = document.getElementById("switchMapBtn");
  const switchMapIcon = document.getElementById("switchMapIcon");

  /* ============================
     VARIABLES BROCANTES
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

  if (brocLiveBadge) {
    brocLiveBadge.addEventListener("click", () => {
      window.location.href = "flux.html";
    });
  }

  function openBrocSheet() {
    if (!brocanteSheet || !brocanteSheetOverlay) return;
    brocanteSheet.classList.add("open");
    brocanteSheetOverlay.classList.add("active");
    brocanteSheet.setAttribute("aria-hidden", "false");
  }

  function closeBrocSheet() {
    if (!brocanteSheet || !brocanteSheetOverlay) return;
    brocanteSheet.classList.remove("open");
    brocanteSheetOverlay.classList.remove("active");
    brocanteSheet.setAttribute("aria-hidden", "true");
  }

  if (brocanteSheetOverlay) brocanteSheetOverlay.addEventListener("click", closeBrocSheet);

  /* ============================
     FILTRES (brocantes uniquement)
     ============================ */
  const filtres = {
    categorie: null,
    periode: null,
    tags: [],
    recherche: "",
  };

  /* ============================
     CHARGEMENT BROCANTES
     ============================ */
  fetch("data/localisation.json")
    .then((res) => res.json())
    .then((data) => {
      brocantes = data;
      afficherBrocantesFiltres();
    })
    .catch((err) => console.error("Erreur JSON :", err));

  function createIcon(imageUrl) {
    return L.icon({
      iconUrl: imageUrl,
      iconSize: [40, 40],
      iconAnchor: [20, 40],
    });
  }

  function clearBrocantesMarkers() {
    marqueursBrocantes.forEach((m) => map.removeLayer(m));
    marqueursBrocantes = [];
  }

  function afficherBrocantesFiltres() {
    if (modeAffichage !== "brocantes") return;

    clearBrocantesMarkers();

    let resultat = [...brocantes];

    if (filtres.categorie) {
      resultat = resultat.filter((b) => b.categorie === filtres.categorie);
    }

    if (filtres.periode) {
      resultat = resultat.filter((b) => b.tags && b.tags.includes(filtres.periode));
    }

    if (filtres.tags.length > 0) {
      resultat = resultat.filter((b) => b.tags && filtres.tags.every((tag) => b.tags.includes(tag)));
    }

    if (filtres.recherche) {
      resultat = resultat.filter((b) => {
        const texte = `${b.nom || ""} ${b.lieu || ""} ${b.description || ""}`.toLowerCase();
        return texte.includes(filtres.recherche);
      });
    }

    resultat.forEach((b) => {
      const iconUrl = b.markerImage || "./images/broc1.png";

      const marker = L.marker(b.coords, { icon: createIcon(iconUrl) }).addTo(map);

      marker.on("click", () => {
        if (modeAffichage !== "brocantes") return;

        if (b.presentationImage && brocSheetImage) {
          brocSheetImage.src = b.presentationImage;
          brocSheetImage.alt = b.nom || "Événement";
        }

        if (brocLiveBadge) {
          brocLiveBadge.style.display = b.live === false ? "none" : "inline-flex";
        }

        if (brocantePopupContent) {
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
        }

        if (brocLikeBtn) {
          brocLikeBtn.classList.remove("active");
          brocLikeBtn.textContent = "♡";
          brocLikeBtn.onclick = () => {
            const active = brocLikeBtn.classList.toggle("active");
            brocLikeBtn.textContent = active ? "♥" : "♡";
          };
        }

        if (brocGoBtn) {
          brocGoBtn.onclick = () => {
            if (b.coords && b.coords.length === 2) {
              const [lat, lng] = b.coords;
              window.open(
                `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`,
                "_blank"
              );
            }
          };
        }

        if (brocShareBtn) {
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
        }

        openBrocSheet();
      });

      marqueursBrocantes.push(marker);
    });
  }

  /* ============================
     AMIS (avatars)
     ============================ */
  let marqueursAmis = [];

  const friends = [
    { name: "Ami 1", coords: [48.869, 2.416], photo: "images/pp1.png" },
    { name: "Ami 2", coords: [48.858, 2.312], photo: "images/pp2.png" },
    { name: "Ami 3", coords: [48.846, 2.365], photo: "images/pp3.png" },
    { name: "Ami 4", coords: [48.878, 2.355], photo: "images/pp4.png" },
  ];

  function clearFriendsMarkers() {
    marqueursAmis.forEach((m) => map.removeLayer(m));
    marqueursAmis = [];
  }

  function createFriendDivIcon(photoUrl) {
    return L.divIcon({
      className: "friend-div-icon",
      html: `
        <div class="friend-marker">
          <div class="friend-avatar">
            <img src="${photoUrl}" alt="">
          </div>
          <div class="friend-dot"></div>
        </div>
      `,
      iconSize: [64, 76],
      iconAnchor: [32, 76],
    });
  }

  function afficherAmis() {
    clearFriendsMarkers();
    closeBrocSheet();

    friends.forEach((f) => {
      const marker = L.marker(f.coords, { icon: createFriendDivIcon(f.photo) }).addTo(map);
      marqueursAmis.push(marker);
    });
  }

  /* ============================
     SWITCH BUTTON
     ============================ */
  function setMode(nextMode) {
    modeAffichage = nextMode;

    if (modeAffichage === "brocantes") {
      clearFriendsMarkers();
      if (switchMapIcon) switchMapIcon.src = SWITCH_ICON_BROC_TO_AMIS;
      afficherBrocantesFiltres();
    } else {
      clearBrocantesMarkers();
      if (switchMapIcon) switchMapIcon.src = SWITCH_ICON_AMIS_TO_BROC;
      afficherAmis();
    }
  }

  if (switchMapBtn) {
    switchMapBtn.addEventListener("click", () => {
      setMode(modeAffichage === "brocantes" ? "amis" : "brocantes");
    });
  }

  /* ============================
     TAGS CLIQUABLES (brocantes uniquement)
     ============================ */
  document.querySelectorAll(".tag").forEach((tag) => {
    tag.addEventListener("click", () => {
      if (modeAffichage !== "brocantes") return;

      const value = tag.dataset.value;
      const type = tag.dataset.type;

      if (type === "categorie") {
        const isActive = tag.classList.contains("active");
        document
          .querySelectorAll('.tag[data-type="categorie"]')
          .forEach((t) => t.classList.remove("active"));

        filtres.categorie = isActive ? null : value;
        if (!isActive) tag.classList.add("active");
      }

      if (type === "periode") {
        const isActive = tag.classList.contains("active");
        document
          .querySelectorAll('.tag[data-type="periode"]')
          .forEach((t) => t.classList.remove("active"));

        filtres.periode = isActive ? null : value;
        if (!isActive) tag.classList.add("active");
      }

      if (type === "tag") {
        tag.classList.toggle("active");
        if (tag.classList.contains("active")) filtres.tags.push(value);
        else filtres.tags = filtres.tags.filter((t) => t !== value);
      }

      afficherBrocantesFiltres();
    });
  });

  /* ============================
     GÉOLOCALISATION 
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

  if (btnGeoloc) {
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

        userMarker = L.marker([latitude, longitude], { icon: geoIcon })
          .addTo(map)
          .bindPopup("Vous êtes ici");

        userCircle = L.circle([latitude, longitude], {
          radius: accuracy,
          color: "#225836",
          fillOpacity: 0.2,
        }).addTo(map);
      });
    });
  }

  /* ============================
     RECHERCHE (brocantes)
     ============================ */
  const searchInput = document.getElementById("search-city");
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      if (modeAffichage !== "brocantes") return;
      filtres.recherche = e.target.value.toLowerCase().trim();
      afficherBrocantesFiltres();
    });
  }

  /* Mode initial */
  setMode("brocantes");
});
