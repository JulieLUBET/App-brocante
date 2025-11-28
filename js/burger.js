const burger = document.getElementById("burgerBtn");
const navMenu = document.getElementById("navMenu");

if (burger && navMenu) {
  burger.addEventListener("click", () => {
    burger.classList.toggle("active");
    navMenu.classList.toggle("open");
  });
}
