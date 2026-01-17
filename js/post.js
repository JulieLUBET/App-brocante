document.addEventListener("DOMContentLoaded", () => {
  const qs = new URLSearchParams(window.location.search);

  const postId = qs.get("id") || "unknown";
  const user = qs.get("user") || "Utilisateur";
  const handle = qs.get("handle") || "@user";
  const img = qs.get("img") || "";
  const caption = qs.get("caption") || "";

  const postName = document.getElementById("postName");
  const postHandle = document.getElementById("postHandle");
  const postImage = document.getElementById("postImage");
  const postCaption = document.getElementById("postCaption");

  const postLikeBtn = document.getElementById("postLikeBtn");
  const postCommentBtn = document.getElementById("postCommentBtn");

  const cmtOverlay = document.getElementById("cmtOverlay");
  const cmtSheet = document.getElementById("cmtSheet");
  const cmtList = document.getElementById("cmtList");
  const cmtInput = document.getElementById("cmtInput");
  const cmtSendBtn = document.getElementById("cmtSendBtn");

  // Hydrate UI
  postName.textContent = user;
  postHandle.textContent = handle;
  postCaption.textContent = caption;
  if (img) postImage.src = img;

  // Storage helpers
  const LS_COMMENTS = `broc_comments_${postId}`;
  const LS_LIKE = `broc_like_${postId}`;

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

  cmtOverlay.addEventListener("click", closeComments);
  postCommentBtn.addEventListener("click", () => {
    renderComments();
    openComments();
  });

  // Likes (post)
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

  // Render comments
  function renderComments() {
    const comments = loadComments();
    cmtList.innerHTML = "";

    if (comments.length === 0) {
      cmtList.innerHTML = `<p style="opacity:.75;text-align:center;margin:20px 0;">Aucun commentaire pour le moment.</p>`;
      return;
    }

    comments.forEach((c, idx) => {
      const row = document.createElement("div");
      row.className = "cmt-item";
      row.innerHTML = `
        <div class="cmt-avatar"></div>
        <div>
          <div class="cmt-name">@${c.author}</div>
          <div class="cmt-text">${c.text}</div>
        </div>
        <button class="cmt-like" type="button" aria-label="Aimer">♡</button>
      `;
      // Like UI local (optionnel) : tu peux persister par commentaire si tu veux
      row.querySelector(".cmt-like").addEventListener("click", (e) => {
        e.currentTarget.textContent = e.currentTarget.textContent === "♡" ? "♥" : "♡";
      });

      cmtList.appendChild(row);
    });
  }

  // Add comment
  function addComment() {
    const text = (cmtInput.value || "").trim();
    if (!text) return;

    const comments = loadComments();
    comments.unshift({
      author: "Vous", // tu peux remplacer par username connecté
      text,
      createdAt: Date.now(),
    });

    saveComments(comments);
    cmtInput.value = "";
    renderComments();
  }

  cmtSendBtn.addEventListener("click", addComment);
  cmtInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") addComment();
  });
});
