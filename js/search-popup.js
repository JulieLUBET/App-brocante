const btnOpenSearch = document.getElementById("open-search");
const searchPopup = document.getElementById("searchPopup");
const searchPopupOverlay = document.getElementById("searchPopupOverlay");

btnOpenSearch.addEventListener("click", () => {
  searchPopup.classList.add("open");
  searchPopupOverlay.classList.add("active");
});

searchPopupOverlay.addEventListener("click", () => {
  searchPopup.classList.remove("open");
  searchPopupOverlay.classList.remove("active");
});
