document.addEventListener("DOMContentLoaded", () => {
  const onboardingContainer = document.querySelector(".onboarding-container");
  const onboardingOverlay = document.querySelector(".onboarding-overlay");

  const stepsContainer = document.querySelector(".steps");
  const steps = document.querySelectorAll(".step");

  const dots = document.querySelectorAll(".dot");
  const replayBtn = document.querySelector(".onboarding-replay");

  // Sécurité
  if (!stepsContainer || steps.length === 0) return;

  let currentStep = 0;

  // -----------------------------
  // Helpers Onboarding
  // -----------------------------
  function setReplayVisible(isVisible) {
    if (!replayBtn) return;
    replayBtn.style.display = isVisible ? "flex" : "none";
  }

  function setActiveDots(stepIndex) {
    if (!dots || dots.length === 0) return;
    dots.forEach((d, i) => d.classList.toggle("active", i === stepIndex));
  }

  function getStepWidth() {
    return window.innerWidth;
  }

  function goToStep(stepIndex, animate = true) {
    const maxIndex = steps.length - 1;
    currentStep = Math.max(0, Math.min(stepIndex, maxIndex));

    const stepWidth = getStepWidth();
    stepsContainer.style.transition = animate ? "transform 0.35s ease" : "none";
    stepsContainer.style.transform = `translateX(-${stepWidth * currentStep}px)`;

    setActiveDots(currentStep);
  }

  function resizeSteps() {
    const stepWidth = getStepWidth();
    steps.forEach((step) => {
      step.style.minWidth = `${stepWidth}px`;
    });
    goToStep(currentStep, false);
  }

  function openOnboarding() {
    if (onboardingContainer) onboardingContainer.classList.remove("active");
    if (onboardingOverlay) onboardingOverlay.classList.remove("active");

    // cache bouton replay pendant onboarding
    setReplayVisible(false);

    currentStep = 0;
    resizeSteps();
    goToStep(0, false);
  }

  function closeOnboarding() {
    if (onboardingContainer) onboardingContainer.classList.add("active");
    if (onboardingOverlay) onboardingOverlay.classList.add("active");

    // affiche bouton replay sur login
    setReplayVisible(true);
  }

  function next() {
    if (currentStep >= steps.length - 1) {
      closeOnboarding();
    } else {
      goToStep(currentStep + 1, true);
    }
  }

  // -----------------------------
  // Init
  // -----------------------------
  openOnboarding();
  window.addEventListener("resize", resizeSteps);

  // Bouton relance onboarding (visible uniquement sur login)
  if (replayBtn) {
    replayBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      openOnboarding();
    });
  }

  // Tap n'importe où sur l'onboarding = suivant
  if (onboardingContainer) {
    onboardingContainer.addEventListener("click", (e) => {
      // si clique sur un dot => on ne fait pas next
      if (e.target && e.target.classList && e.target.classList.contains("dot")) return;
      next();
    });
  }

  // Clic sur dot = aller à la page
  if (dots && dots.length > 0) {
    dots.forEach((dot, index) => {
      dot.addEventListener("click", (e) => {
        e.stopPropagation();
        goToStep(index, true);
      });
    });
  }

  // Swipe mobile (horizontal)
  let startX = 0;
  let deltaX = 0;
  let isDragging = false;

  stepsContainer.addEventListener("touchstart", (e) => {
    if (!e.touches || e.touches.length !== 1) return;
    isDragging = true;
    startX = e.touches[0].clientX;
    deltaX = 0;
    stepsContainer.style.transition = "none";
  });

  stepsContainer.addEventListener(
    "touchmove",
    (e) => {
      if (!isDragging || !e.touches || e.touches.length !== 1) return;

      const currentX = e.touches[0].clientX;
      deltaX = currentX - startX;

      const stepWidth = getStepWidth();
      const baseTranslate = -stepWidth * currentStep;
      stepsContainer.style.transform = `translateX(${baseTranslate + deltaX}px)`;

      e.preventDefault();
    },
    { passive: false }
  );

  stepsContainer.addEventListener("touchend", () => {
    if (!isDragging) return;
    isDragging = false;

    const stepWidth = getStepWidth();
    const threshold = stepWidth * 0.2;

    if (deltaX < -threshold && currentStep < steps.length - 1) {
      goToStep(currentStep + 1, true);
    } else if (deltaX > threshold && currentStep > 0) {
      goToStep(currentStep - 1, true);
    } else {
      goToStep(currentStep, true);
    }
  });

  // =========================================================
  // ✅ PARTIE 2 : afficher le popup localisation uniquement
  //     quand on quitte index.html -> map.html via "Se connecter"
  // =========================================================
  const loginForm = document.querySelector(".login-section .form");
  const loginSubmitBtn = loginForm
    ? loginForm.querySelector('button[type="submit"]')
    : null;

  // Au clic sur le bouton (très fiable)
  if (loginSubmitBtn) {
    loginSubmitBtn.addEventListener("click", () => {
      sessionStorage.setItem("show_loc_popup", "1");
    });
  }

  // Au submit (sécurité)
  if (loginForm) {
    loginForm.addEventListener("submit", () => {
      sessionStorage.setItem("show_loc_popup", "1");
    });
  }
});
