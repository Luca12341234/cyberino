/* === Paginazione client-side === */
document.addEventListener("DOMContentLoaded", () => {
  const ITEMS_PER_PAGE = 5;

  const list     = document.getElementById("news-list");
  const items    = Array.from(list.children);          // <li>…
  const pagerNav = document.getElementById("pagination");

  if (items.length <= ITEMS_PER_PAGE) {
    // abbastanza pochi: mostra tutto e niente numeri
    pagerNav.style.display = "none";
    return;
  }

  const totalPages = Math.ceil(items.length / ITEMS_PER_PAGE);
  let currentPage  = 1;

  function showPage(page) {
    currentPage = page;

    // 1. nascondi tutti
    items.forEach(el => el.style.display = "none");

    // 2. mostra solo quelli della pagina corrente
    const start = (page - 1) * ITEMS_PER_PAGE;
    const end   = start + ITEMS_PER_PAGE;
    items.slice(start, end).forEach(el => el.style.display = "");

    // 3. (ri)disegna i numeri
    drawPager();
  }

  function drawPager() {
    pagerNav.innerHTML = "";           // pulisci

    for (let i = 1; i <= totalPages; i++) {
      const link = document.createElement("a");
      link.href  = "#";
      link.textContent = i;
      if (i === currentPage) {
        link.classList.add("current");
        link.removeAttribute("href");  // niente click sulla pagina attuale
      } else {
        link.addEventListener("click", e => {
          e.preventDefault();
          showPage(i);
        });
      }
      pagerNav.appendChild(link);
    }
  }

  // prima visualizzazione
  showPage(1);
});
