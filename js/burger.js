const friendsPanel = document.getElementById("friendsPanel");
const friendsToggle = document.getElementById("friendsToggle");

friendsToggle.addEventListener("click", () => {
  friendsPanel.classList.toggle("open");

  // Change flèche ← / →
  if (friendsPanel.classList.contains("open")) {
    friendsToggle.textContent = "→";
  } else {
    friendsToggle.textContent = "←";
  }
});
