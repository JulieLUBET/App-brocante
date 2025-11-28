const onboardingContainer = document.querySelector(".onboarding-container");
const onboardingOverlay = document.querySelector(".onboarding-overlay");
const skipBtn = document.querySelector(".onboarding-container .skip-btn");
const steps = document.querySelectorAll(".onboarding-container .step");
const stepsContainer = document.querySelector(".onboarding-container .steps");
const nextBtn = document.querySelector(".onboarding-container .next-btn");
const dots = document.querySelectorAll(".onboarding-container .dot");


let stepPosition = 0;
let currentStep = 0;

const init = () => {

  stepsContainer.style.transition = "unset";

  // Afficher l'onboarding
  onboardingContainer.classList.remove("active");
  onboardingOverlay.classList.remove("active");

  currentStep = 0;
  stepPosition = 0;
  stepsContainer.style.transform = `translateX(0px)`;

  dots.forEach(dot => dot.classList.remove("active"));
  dots[0].classList.add("active");

  nextBtn.textContent = "Suivant";
};

// Démarrage automatique
document.addEventListener("DOMContentLoaded", init);

// Bouton Skip
skipBtn.addEventListener("click", () => {
  onboardingContainer.classList.add("active");
  onboardingOverlay.classList.add("active");
});

// Bouton Next
nextBtn.addEventListener("click", () => {
  stepsContainer.style.transition = "all 400ms ease";
  currentStep++;

  // Fin des steps → fermer l'onboarding
  if (currentStep >= steps.length) {
    onboardingContainer.classList.add("active");
    onboardingOverlay.classList.add("active");
    return;
  }

  // Décalage horizontal
  stepPosition = steps[0].offsetWidth * currentStep;
  stepsContainer.style.transform = `translateX(-${stepPosition}px)`;

  // Mise à jour des dots
  dots.forEach(dot => dot.classList.remove("active"));
  dots[currentStep].classList.add("active");

  // Dernier slide → bouton Finish
  nextBtn.textContent = currentStep === steps.length - 1 ? "fin" : "Suivant";
});



