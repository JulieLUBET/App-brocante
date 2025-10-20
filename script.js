// ---------- Page accueil / navigation ----------
const buttons = document.querySelectorAll('.footer button');
const sections = document.querySelectorAll('.section');

buttons.forEach(btn => {
  btn.addEventListener('click', () => {
    sections.forEach(sec => sec.classList.add('hidden'));
    const sectionToShow = document.getElementById(btn.dataset.section);
    sectionToShow.classList.remove('hidden');
  });
});