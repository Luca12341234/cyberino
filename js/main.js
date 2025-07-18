/* ==== PAGINAZIONE + RICERCA ==== */
document.addEventListener("DOMContentLoaded", () => {
  const PER_PAGE = 5;

  const listEl  = document.getElementById("list");
  const items   = Array.from(listEl.children);   // tutti i <li>
  const pagerEl = document.getElementById("pager");
  const search  = document.getElementById("search");

  /* ---- piccolo Levenshtein ---- */
  const lev = (a, b) => {
    const al=a.length, bl=b.length;
    if (!al) return bl; if (!bl) return al;
    const m = Array.from({length: al+1}, (_,i)=>[i]);
    for (let j=1;j<=bl;j++) m[0][j]=j;
    for (let i=1;i<=al;i++)
      for (let j=1;j<=bl;j++)
        m[i][j] = a[i-1]==b[j-1] ? m[i-1][j-1]
                 : Math.min(m[i-1][j], m[i][j-1], m[i-1][j-1])+1;
    return m[al][bl];
  };

  /* ---- stato ---- */
  let view = items.slice();   // elementi da mostrare ora
  let page = 1;

  const pages = () => Math.ceil(view.length / PER_PAGE);

  const renderPage = (p=1) => {
    page = p;
    items.forEach(li => li.style.display="none");
    view.slice((p-1)*PER_PAGE, p*PER_PAGE).forEach(li => li.style.display="");
    renderPager();
  };

  const renderPager = () => {
    pagerEl.innerHTML="";
    if (pages()<=1) { pagerEl.style.display="none"; return; }
    pagerEl.style.display="flex";
    for (let i=1;i<=pages();i++){
      const a=document.createElement("a");
      a.textContent=i;
      if (i===page) a.className="current";
      else {
        a.href="#";
        a.onclick=e=>{e.preventDefault();renderPage(i);};
      }
      pagerEl.appendChild(a);
    }
  };

  /* ---- normalizza testo (minuscolo, senza accenti) ---- */
  const norm = s =>
    s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"");

  /* ---- ricerca live ---- */
  search.addEventListener("input", () => {
    const q = norm(search.value.trim());
    if (!q){
      view = items.slice();
      return renderPage(1);
    }

    view = items.filter(li => {
      const txt = norm(li.textContent.trim());
      return txt.includes(q) || lev(txt,q) <= 2;  // match “fuzzy”
    });

    // se più di PER_PAGE, paginiamo; altrimenti niente numeri
    if (view.length > PER_PAGE) renderPage(1);
    else {
      items.forEach(li => li.style.display="none");
      view.forEach(li  => li.style.display="");
      pagerEl.style.display="none";
    }
  });

  /* ---- prima render ---- */
  renderPage(1);
});
