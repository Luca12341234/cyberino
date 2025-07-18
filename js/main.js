/* ===== Paginazione + Ricerca ===== */
document.addEventListener("DOMContentLoaded", () => {
  const ITEMS_PER_PAGE = 5;

  const listEl   = document.getElementById("news-list");
  const allItems = Array.from(listEl.children);   // array di <li>
  const pagerEl  = document.getElementById("pagination");
  const searchEl = document.getElementById("search-input");

  /* ---------- PAGINAZIONE ---------- */
  let viewItems   = allItems.slice();             // array filtrato corrente
  let currentPage = 1;

  function calcTotalPages() {
    return Math.ceil(viewItems.length / ITEMS_PER_PAGE);
  }

  function renderPage(page = 1) {
    currentPage = page;

    // nascondi tutto
    allItems.forEach(li => li.style.display = "none");

    // mostra solo gli elementi della vista corrente
    if (viewItems.length) {
      const start = (page - 1) * ITEMS_PER_PAGE;
      const end   = start + ITEMS_PER_PAGE;
      viewItems.slice(start, end).forEach(li => li.style.display = "");
    }

    renderPager();
  }

  function renderPager() {
    const totalPages = calcTotalPages();

    // nascondi barra se inutile
    if (totalPages <= 1) {
      pagerEl.style.display = "none";
      pagerEl.innerHTML = "";
      return;
    }

    pagerEl.style.display = "flex";
    pagerEl.innerHTML = "";

    for (let p = 1; p <= totalPages; p++) {
      const link = document.createElement("a");
      link.textContent = p;

      if (p === currentPage) {
        link.classList.add("current");
      } else {
        link.href = "#";
        link.addEventListener("click", e => {
          e.preventDefault();
          renderPage(p);
        });
      }
      pagerEl.appendChild(link);
    }
  }

  /* ---------- RICERCA LIVE ---------- */
  searchEl.addEventListener("input", () => {
    const q = searchEl.value.trim().toLowerCase();

    if (q === "") {
      viewItems = allItems.slice();         // reset
      renderPage(1);
      return;
    }

    viewItems = allItems.filter(li =>
      li.textContent.toLowerCase().includes(q)
    );

    // Mostra tutto il risultato in un'unica "pagina" (niente numeri)
    allItems.forEach(li => li.style.display = "none");
    viewItems.forEach(li => li.style.display = "");
    pagerEl.style.display = "none";
  });

  // prima visualizzazione
  renderPage(1);
});
