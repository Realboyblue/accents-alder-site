async function loadJSON(path){
  const r = await fetch(path, {cache:"no-store"});
  if(!r.ok) throw new Error("Failed to load " + path);
  return r.json();
}

function qs(sel){ return document.querySelector(sel); }
function el(tag, attrs = {}, children = []){
  const node = document.createElement(tag);
  Object.entries(attrs).forEach(([k,v]) => {
    if (k === "class") node.className = v;
    else if (k.startsWith("on") && typeof v === "function") node.addEventListener(k.slice(2), v);
    else node.setAttribute(k, v);
  });
  children.forEach(c => node.appendChild(typeof c === "string" ? document.createTextNode(c) : c));
  return node;
}

(async function(){
  const root = qs("[data-gallery]");
  if(!root) return;

  const data = await loadJSON("content/gallery.json");
  const filters = qs("[data-filters]");
  const grid = qs("[data-grid]");
  const lightbox = qs("[data-lightbox]");
  const lbImg = qs("[data-lb-img]");
  const lbTitle = qs("[data-lb-title]");
  const lbDesc = qs("[data-lb-desc]");

  let active = "all";

  function renderFilters(){
    filters.innerHTML = "";
    data.categories.forEach(c => {
      const b = el("button", {
        class: "pill",
        type: "button",
        "aria-pressed": c.key === active ? "true" : "false",
        onclick: () => { active = c.key; render(); }
      }, [c.label]);
      filters.appendChild(b);
    });
  }

  function openLightbox(item){
    lbImg.src = item.image;
    lbImg.alt = item.title;
    lbTitle.textContent = item.title;
    lbDesc.textContent = item.desc || "";
    lightbox.setAttribute("open", "");
  }

  function closeLightbox(){
    lightbox.removeAttribute("open");
    lbImg.src = "";
  }

  function render(){
    renderFilters();
    grid.innerHTML = "";

    const items = data.items.filter(i => active === "all" ? true : i.category === active);
    if(items.length === 0){
      grid.appendChild(el("div", {class:"card"}, ["No projects in this category yet."]));
      return;
    }

    items.forEach(item => {
      const tile = el("div", {class:"tile", role:"button", tabindex:"0"});
      tile.appendChild(el("img", {src:item.image, alt:item.title, loading:"lazy"}));
      tile.appendChild(el("div", {class:"meta"}, [
        el("div", {class:"t"}, [item.title]),
        el("div", {class:"d"}, [item.desc || ""])
      ]));
      tile.addEventListener("click", () => openLightbox(item));
      tile.addEventListener("keydown", (e) => { if(e.key === "Enter") openLightbox(item); });
      grid.appendChild(tile);
    });
  }

  qs("[data-lb-close]").addEventListener("click", closeLightbox);
  lightbox.addEventListener("click", (e) => { if(e.target === lightbox) closeLightbox(); });
  window.addEventListener("keydown", (e) => { if(e.key === "Escape") closeLightbox(); });

  render();
})();
