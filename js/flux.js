document.addEventListener("DOMContentLoaded", () => {
  const grid = document.getElementById("fluxGrid");
  const tabs = document.querySelectorAll(".flux-tab");
  if (!grid) return;

  const data = {
    live: [
      {
        id: "p1",
        user: "Lucie",
        handle: "@Lucie",
        img: "images/flux1.png",
        avatar: "images/pp1.png",
        caption: "Trouvaille du jour !",
        stickers: ["images/point2.png"],
      },
      {
        id: "p2",
        user: "Maeva",
        handle: "@Maeva445",
        img: "images/flux2.png",
        avatar: "images/pp2.png",
        caption: "Brocante du dimanche",
        stickers: ["images/point3.png"],
      },
      {
        id: "p3",
        user: "Paul",
        handle: "@Paul23",
        img: "images/flux3.png",
        avatar: "images/pp3.png",
        caption: "Pour les amateurs de confort et de voiture ;)",
        stickers: ["images/point2.png"],
      },
      {
        id: "p4",
        user: "752",
        handle: "@752",
        img: "images/flux4.png",
        avatar: "images/pp4.png",
        caption: "Service à thé complet",
        stickers: ["images/broc1.png"],
      },
    ],

    following: [
      {
        id: "p5",
        user: "Tom",
        handle: "@Tom",
        img: "images/flux5.png",
        avatar: "images/pp6.png",
        caption: "Petit trésor du jour",
        stickers: ["images/point3.png"],
      },
      {
        id: "p6",
        user: "Batman",
        handle: "@Batman",
        img: "images/flux6.png",
        avatar: "images/pp7.png",
        caption: "Vintage vibes",
        stickers: ["images/point2.png", "images/point3.png"],
      },
    ],
  };

  let currentTab = "live";

  function render() {
    grid.innerHTML = "";
    const items = data[currentTab] || [];

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
          avatar: item.avatar || "",
          caption: item.caption || "",
          stickers: (item.stickers || []).join(","),
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
