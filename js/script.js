const onboardingContainer = document.querySelector(".onboarding-container");
const onboardingOverlay = document.querySelector(".onboarding-overlay");
const skipBtn = document.querySelector(".skip-btn");
const steps = document.querySelectorAll(".step");
const stepsContainer = document.querySelector(".steps");
const nextBtn = document.querySelector(".arrow");
const circle = document.querySelector(".progress-circle .circle");

let currentStep = 0;

// Cercle
const radius = 15.9155;
const circumference = 2 * Math.PI * radius;
circle.style.strokeDasharray = circumference;
circle.style.strokeDashoffset = circumference * 0.99; // 1% visible

function updateProgressCircle(stepIndex) {
  const totalSteps = steps.length;
  const progress = stepIndex / (totalSteps - 1);
  const offset = circumference * (1 - progress);
  circle.style.strokeDashoffset = offset;
}

// Initialise slides et cercle
function init() {
  onboardingContainer.classList.remove("active");
  onboardingOverlay.classList.remove("active");

  currentStep = 0;

  const stepWidth = stepsContainer.getBoundingClientRect().width;
  steps.forEach(step => step.style.minWidth = `${stepWidth}px`);
  stepsContainer.style.transform = "translateX(0)";

  updateProgressCircle(currentStep);
}

document.addEventListener("DOMContentLoaded", init);

// Skip
skipBtn.addEventListener("click", () => {
  onboardingContainer.classList.add("active");
  onboardingOverlay.classList.add("active");
});

// Flèche Next
nextBtn.addEventListener("click", () => {
  currentStep++;
  if (currentStep >= steps.length) {
    onboardingContainer.classList.add("active");
    onboardingOverlay.classList.add("active");
    return;
  }

  const stepWidth = stepsContainer.getBoundingClientRect().width;
  stepsContainer.style.transition = "transform 0.4s ease";
  stepsContainer.style.transform = `translateX(-${stepWidth * currentStep}px)`;

  updateProgressCircle(currentStep);
});

// Resize
window.addEventListener("resize", () => {
  const stepWidth = stepsContainer.getBoundingClientRect().width;
  steps.forEach(step => step.style.minWidth = `${stepWidth}px`);
  stepsContainer.style.transform = `translateX(-${stepWidth * currentStep}px)`;
});
