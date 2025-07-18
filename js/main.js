/* === PAGINAZIONE + RICERCA “FUZZY” SENZA LIBRERIE === */
document.addEventListener("DOMContentLoaded", () => {
  const PER_PAGE = 5;

  const listEl  = document.getElementById("news-list");
  const pagerEl = document.getElementById("pagination");
  const search  = document.getElementById("search");

  if (!listEl || !pagerEl || !search) {
    console.error("Mancano gli id richiesti (news-list, pagination, search)");
    return;
  }

  const items = Array.from(listEl.children);     // tutti i <li>

  /* --- distanza Levenshtein minima --- */
  const lev = (a, b) => {
    const al = a.length, bl = b.length;
    if (!al) return bl; if (!bl) return al;
    const m = Array.from({ length: al + 1 }, (_, i) => [i]);
    for (let j = 1; j <= bl; j++) m[0][j] = j;
    for (let i = 1; i <= al; i++)
      for (let j = 1; j <= bl; j++)
        m[i][j] = a[i - 1] === b[j - 1]
          ? m[i - 1][j - 1]
          : Math.min(m[i - 1][j], m[i][j - 1], m[i - 1][j - 1]) + 1;
    return m[al][bl];
  };

  /* --- normalizza (niente accenti, tutto minuscolo) --- */
  const norm = s => s.toLowerCase()
                     .normalize("NFD")
                     .replace(/[\u0300-\u036f]/g, "");

  /* --- stato --- */
  let view = [...items];
  let page = 1;

  const pages = () => Math.ceil(view.length / PER_PAGE);

  function renderPage(p = 1) {
    page = p;
    items.forEach(li => li.style.display = "none");
    view
      .slice((p - 1) * PER_PAGE, p * PER_PAGE)
      .forEach(li => li.style.display = "");
    renderPager();
  }

  function renderPager() {
    pagerEl.innerHTML = "";
    if (pages() <= 1) { pagerEl.style.display = "none"; return; }

    pagerEl.style.display = "flex";
    for (let i = 1; i <= pages(); i++) {
      const a = document.createElement("a");
      a.textContent = i;
      if (i === page) a.className = "current";
      else {
        a.href = "#";
        a.onclick = e => { e.preventDefault(); renderPage(i); };
      }
      pagerEl.appendChild(a);
    }
  }

  /* --- ricerca live --- */
  search.addEventListener("input", () => {
    const q = norm(search.value.trim());

    if (!q) {
      view = [...items];
      return renderPage(1);
    }

    view = items.filter(li => {
      const txt = norm(li.textContent.trim());
      return txt.includes(q) || lev(txt, q) <= 2;  // “pishing” ≈ “phishing”
    });

    if (view.length > PER_PAGE) {
      renderPage(1);
    } else {
      items.forEach(li => li.style.display = "none");
      view.forEach(li  => li.style.display = "");
      pagerEl.style.display = "none";
    }
  });

  /* --- prima visualizzazione --- */
  renderPage(1);
});
