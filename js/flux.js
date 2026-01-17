document.addEventListener("DOMContentLoaded", () => {
  const grid = document.getElementById("fluxGrid");
  const tabs = document.querySelectorAll(".flux-tab");

  // Données demo (tu peux remplacer par fetch("data/flux.json"))
  const data = {
    live: [
      {
        id: "p1",
        user: "Lucie",
        handle: "@Lucie",
        img: "images/flux1.png",
        caption: "Trouvaille du jour !",
      },
      {
        id: "p2",
        user: "Maeva",
        handle: "@Maeva445",
        img: "images/flux2.png",
        caption: "Brocante du dimanche",
      },
      {
        id: "p3",
        user: "Paul",
        handle: "@Paul11",
        img: "images/flux3.png",
        caption: "Pour les amateurs...",
      },
      {
        id: "p4",
        user: "752",
        handle: "@752",
        img: "images/flux4.png",
        caption: "Service à thé complet",
      },
    ],
    following: [
      {
        id: "p5",
        user: "Tom",
        handle: "@Tom",
        img: "images/flux5.png",
        caption: "Appareil photo vintage",
      },
      {
        id: "p6",
        user: "Batman",
        handle: "@Batman",
        img: "images/flux6.png",
        caption: "Vinyles et cadres",
      },
      {
        id: "p7",
        user: "Thomas",
        handle: "@Thomas81",
        img: "images/flux7.png",
        caption: "CD rare",
      },
      {
        id: "p4",
        user: "752",
        handle: "@752",
        img: "images/flux4.png",
        caption: "Service à thé complet",
      },
    ],
  };

  let currentTab = "live";

  function render() {
    grid.innerHTML = "";
    const items = data[currentTab];

    items.forEach((item) => {
      const card = document.createElement("article");
      card.className = "card";
      card.innerHTML = `
        <img src="${item.img}" alt="${item.user}" />
        <div class="handle">${item.handle}</div>
      `;
      card.addEventListener("click", () => {
        const params = new URLSearchParams({
          id: item.id,
          user: item.user,
          handle: item.handle,
          img: item.img,
          caption: item.caption,
        });
        window.location.href = `post.html?${params.toString()}`;
      });
      grid.appendChild(card);
    });
  }

  tabs.forEach((t) => {
    t.addEventListener("click", () => {
      tabs.forEach((x) => {
        x.classList.remove("active");
        x.setAttribute("aria-selected", "false");
      });
      t.classList.add("active");
      t.setAttribute("aria-selected", "true");
      currentTab = t.dataset.tab;
      render();
    });
  });

  render();
});
