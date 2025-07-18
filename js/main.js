/* ===== Paginazione + Ricerca fuzzy con Fuse.js ===== */
document.addEventListener("DOMContentLoaded", () => {
  const ITEMS_PER_PAGE = 5;

  const listEl   = document.getElementById("news-list");
  const allItems = Array.from(listEl.children);          // <li>…
  const pagerEl  = document.getElementById("pagination");
  const searchEl = document.getElementById("search-input");

  /* ---------- Prepariamo Fuse ---------- */
  const fuse = new Fuse(
    allItems.map(li => ({ li, text: li.textContent.trim() })),
    {
      keys: ["text"],
      threshold: 0.4,     // 0 = match perfetto, 1 = qualsiasi cosa
      ignoreLocation:true,
      minMatchCharLength:2
    }
  );

  /* ---------- Stato corrente ---------- */
  let viewItems   = allItems.slice();   // quello che stiamo mostrando
  let currentPage = 1;

  /* ---------- Funzioni di utilità ---------- */
  const totalPages = () => Math.ceil(viewItems.length / ITEMS_PER_PAGE);

  function renderPage(page = 1) {
    currentPage = page;

    // nascondi tutti
    allItems.forEach(li => (li.style.display = "none"));

    // mostra solo quelli della pagina corrente
    if (viewItems.length) {
      const start = (page - 1) * ITEMS_PER_PAGE;
      const end   = start + ITEMS_PER_PAGE;
      viewItems.slice(start, end).forEach(li => (li.style.display = ""));
    }

    renderPager();
  }

  function renderPager() {
    const pages = totalPages();

    if (pages <= 1) {
      pagerEl.style.display = "none";
      pagerEl.innerHTML = "";
      return;
    }

    pagerEl.style.display = "flex";
    pagerEl.innerHTML = "";

    for (let p = 1; p <= pages; p++) {
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

  /* ---------- Ricerca ---------- */
  searchEl.addEventListener("input", () => {
    const q = searchEl.value.trim();

    if (q === "") {
      // reset completo
      viewItems = allItems.slice();
      renderPage(1);
      return;
    }

    // otteniamo li dal risultato Fuse
    viewItems = fuse.search(q).map(res => res.item.li);

    // mostra tutti quelli trovati in un'unica "pagina"
    allItems.forEach(li => (li.style.display = "none"));
    viewItems.forEach(li => (li.style.display = ""));

    // se > ITEMS_PER_PAGE, attiva la paginazione sui risultati
    if (viewItems.length > ITEMS_PER_PAGE) {
      renderPage(1);
    } else {
      pagerEl.style.display = "none";
      pagerEl.innerHTML = "";
    }
  });

  // prima render
  renderPage(1);
});
