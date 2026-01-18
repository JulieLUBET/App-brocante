document.addEventListener("DOMContentLoaded", () => {
  // ---------- OPEN/CLOSE SEARCH POPUP ----------
  const openBtn = document.getElementById("open-search");
  const popup = document.getElementById("searchPopup");
  const overlay = document.getElementById("searchPopupOverlay");

  function openPopup() {
    if (!popup || !overlay) return;
    popup.classList.add("open");
    overlay.classList.add("active");
    popup.setAttribute("aria-hidden", "false");
  }

  function closePopup() {
    if (!popup || !overlay) return;
    popup.classList.remove("open");
    overlay.classList.remove("active");
    popup.setAttribute("aria-hidden", "true");
  }

  if (openBtn) openBtn.addEventListener("click", openPopup);
  if (overlay) overlay.addEventListener("click", closePopup);

  // ---------- CALENDAR  ----------
  const calGrid = document.getElementById("calGrid");
  const calMonthLabel = document.getElementById("calMonthLabel");
  const calPrev = document.getElementById("calPrev");
  const calNext = document.getElementById("calNext");
  const hiddenDateInput = document.getElementById("search-date");

  if (!calGrid || !calMonthLabel || !calPrev || !calNext || !hiddenDateInput) {
    return;
  }

  const monthNames = [
    "Janvier","Février","Mars","Avril","Mai","Juin",
    "Juillet","Août","Septembre","Octobre","Novembre","Décembre"
  ];

  // départ : Janvier 2026 (comme ta maquette)
  let view = new Date(2026, 0, 1);
  let selected = null;

  function pad2(n) {
    return String(n).padStart(2, "0");
  }

  function toISODate(d) {
    return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
  }

  // Lundi=0 ... Dimanche=6
  function mondayIndex(jsDay) {
    return (jsDay + 6) % 7;
  }

  function renderCalendar() {
    calGrid.innerHTML = "";

    const y = view.getFullYear();
    const m = view.getMonth();

    calMonthLabel.textContent = `${monthNames[m]} ${y}`;

    const first = new Date(y, m, 1);
    const last = new Date(y, m + 1, 0);

    const startOffset = mondayIndex(first.getDay());
    const daysInMonth = last.getDate();

    const totalCells = 42; 

    for (let i = 0; i < totalCells; i++) {
      const dayNum = i - startOffset + 1;

      if (dayNum < 1 || dayNum > daysInMonth) {
        const empty = document.createElement("div");
        empty.className = "cal-empty";
        calGrid.appendChild(empty);
        continue;
      }

      const cellDate = new Date(y, m, dayNum);

      const cell = document.createElement("div");
      cell.className = "cal-day";
      cell.textContent = String(dayNum);

      if (selected && toISODate(cellDate) === toISODate(selected)) {
        cell.classList.add("is-selected");
      }

      cell.addEventListener("click", () => {
        selected = cellDate;
        hiddenDateInput.value = toISODate(selected);
        renderCalendar();
      });

      calGrid.appendChild(cell);
    }
  }

  calPrev.addEventListener("click", () => {
    view = new Date(view.getFullYear(), view.getMonth() - 1, 1);
    renderCalendar();
  });

  calNext.addEventListener("click", () => {
    view = new Date(view.getFullYear(), view.getMonth() + 1, 1);
    renderCalendar();
  });

  renderCalendar();
});
