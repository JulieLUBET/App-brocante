document.addEventListener("DOMContentLoaded", () => {
  const qs = new URLSearchParams(window.location.search);

  const postId = qs.get("id") || "unknown";
  const user = qs.get("user") || "Utilisateur";
  const handle = qs.get("handle") || "@user";
  const img = qs.get("img") || "";
  const avatar = qs.get("avatar") || "";
  const caption = qs.get("caption") || "";
  const stickersCSV = qs.get("stickers") || "";

  const postName = document.getElementById("postName");
  const postHandle = document.getElementById("postHandle");
  const postImage = document.getElementById("postImage");
  const postCaption = document.getElementById("postCaption");
  const postAvatar = document.getElementById("postAvatar");
  const stickersRow = document.getElementById("stickersRow");

  const postLikeBtn = document.getElementById("postLikeBtn");
  const postCommentBtn = document.getElementById("postCommentBtn");

  const cmtOverlay = document.getElementById("cmtOverlay");
  const cmtSheet = document.getElementById("cmtSheet");
  const cmtList = document.getElementById("cmtList");
  const cmtInput = document.getElementById("cmtInput");
  const cmtSendBtn = document.getElementById("cmtSendBtn");

  if (!postName || !postImage) return;

  function normalizePath(p) {
    if (!p) return "";
    return p.replace(/^(\.\.\/)+/, "");
  }

  // ---- Hydrate post ----
  postName.textContent = user;
  postHandle.textContent = handle;
  postCaption.textContent = caption;

  const fixedImg = normalizePath(img);
  if (fixedImg) postImage.src = fixedImg;

  const fixedAvatar = normalizePath(avatar);
  if (fixedAvatar && postAvatar) {
    postAvatar.style.backgroundImage = `url("${fixedAvatar}")`;
    postAvatar.style.backgroundSize = "cover";
    postAvatar.style.backgroundPosition = "center";
  }

  // ---- Stickers (images) ----
  const stickers = stickersCSV
    ? stickersCSV
        .split(",")
        .map((s) => normalizePath(s.trim()))
        .filter(Boolean)
    : [];

  if (stickersRow) {
    stickersRow.innerHTML = "";
    if (stickers.length === 0) {
      stickersRow.innerHTML = `<div style="opacity:.65;">Aucun sticker</div>`;
    } else {
      stickers.forEach((src) => {
        const img = document.createElement("img");
        img.src = src;
        img.alt = "";
        img.className = "sticker-img";
        stickersRow.appendChild(img);
      });
    }
  }

  // ---- Comments storage ----
  const LS_COMMENTS = "broc_comments_global";
  const LS_SEEDED = "broc_comments_seeded_global";
  const LS_LIKE = `broc_like_${postId}`;

  // ✅ Mêmes commentaires pour tous les posts (comme tu veux)
  // ✅ Avec PP (tu remplaces pp1/pp2/pp3 si tu veux)
  const DEFAULT_COMMENTS_ALL = [
    {
      author: "Cyril",
      text: "J’adore, super original !",
      avatar: "images/pp7.png",
    },
    {
      author: "Emilija7",
      text: "Super rare ! Bonne trouvaille 👌",
      avatar: "images/pp2.png",
    },
    {
      author: "Lola99",
      text: "Trop stylé franchement 🔥",
      avatar: "images/pp5.png",
    },
    {
      author: "Théo_8",
      text: "Je l’ai déjà vu en brocante, incroyable !",
      avatar: "images/pp4.png",
    },
  ];

  function loadComments() {
    try {
      return JSON.parse(localStorage.getItem(LS_COMMENTS) || "[]");
    } catch {
      return [];
    }
  }

  function saveComments(list) {
    localStorage.setItem(LS_COMMENTS, JSON.stringify(list));
  }

  function seedCommentsIfNeeded() {
    const already = localStorage.getItem(LS_SEEDED) === "1";
    const existing = loadComments();
    if (already || existing.length > 0) return;

    saveComments(
      DEFAULT_COMMENTS_ALL.map((c) => ({
        ...c,
        avatar: normalizePath(c.avatar),
        createdAt: Date.now(),
      }))
    );
    localStorage.setItem(LS_SEEDED, "1");
  }

  function openComments() {
    cmtOverlay.classList.add("active");
    cmtSheet.classList.add("open");
    cmtSheet.setAttribute("aria-hidden", "false");
  }

  function closeComments() {
    cmtOverlay.classList.remove("active");
    cmtSheet.classList.remove("open");
    cmtSheet.setAttribute("aria-hidden", "true");
  }

  function renderComments() {
    const comments = loadComments();
    cmtList.innerHTML = "";

    if (comments.length === 0) {
      cmtList.innerHTML = `<p style="opacity:.75;text-align:center;margin:20px 0;">Aucun commentaire pour le moment.</p>`;
      return;
    }

    comments.forEach((c) => {
      const row = document.createElement("div");
      row.className = "cmt-item";

      const av = normalizePath(c.avatar || "images/pp1.png");

      row.innerHTML = `
        <div class="cmt-avatar" style="background-image:url('${av}')"></div>
        <div class="cmt-body">
          <div class="cmt-name">@${c.author}</div>
          <div class="cmt-text">${c.text}</div>
        </div>
        <button class="cmt-like" type="button" aria-label="Aimer">♡</button>
      `;

      const likeBtn = row.querySelector(".cmt-like");
      likeBtn.addEventListener("click", () => {
        likeBtn.textContent = likeBtn.textContent === "♡" ? "♥" : "♡";
        likeBtn.classList.toggle("active");
      });

      cmtList.appendChild(row);
    });
  }

  function addComment() {
    const text = (cmtInput.value || "").trim();
    if (!text) return;

    const comments = loadComments();
    comments.unshift({
      author: "Vous",
      text,
      avatar: fixedAvatar || "images/pp1.png",
      createdAt: Date.now(),
    });

    saveComments(comments);
    cmtInput.value = "";
    renderComments();
  }

  // ---- Init ----
  seedCommentsIfNeeded();

  // overlay click close
  cmtOverlay.addEventListener("click", closeComments);

  // open comments
  postCommentBtn.addEventListener("click", () => {
    renderComments();
    openComments();
  });

  // like post (persist)
  const liked = localStorage.getItem(LS_LIKE) === "1";
  if (liked) {
    postLikeBtn.classList.add("active");
    postLikeBtn.textContent = "♥";
  }

  postLikeBtn.addEventListener("click", () => {
    const isActive = postLikeBtn.classList.toggle("active");
    postLikeBtn.textContent = isActive ? "♥" : "♡";
    localStorage.setItem(LS_LIKE, isActive ? "1" : "0");
  });

  cmtSendBtn.addEventListener("click", addComment);
  cmtInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") addComment();
  });
});
