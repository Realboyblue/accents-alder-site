async function loadJSON(path){
  const r = await fetch(path, {cache:"no-store"});
  if(!r.ok) throw new Error("Failed to load " + path);
  return r.json();
}

(async function(){
  const mount = document.querySelector("[data-services]");
  if(!mount) return;

  const data = await loadJSON("content/services.json");
  mount.innerHTML = "";

  (data.services || []).forEach(s => {
    const card = document.createElement("div");
    card.className = "card";

    const highlights = (s.highlights || []).map(x => `<li>${x}</li>`).join("");

    card.innerHTML = `
      <div class="badge"><span class="badge-dot"></span>${s.name || "Service"}</div>
      <h2 class="card-title">${s.tagline || ""}</h2>
      <hr class="sep" />
      <div class="small" style="font-weight:900">Highlights</div>
      <ul class="list">${highlights}</ul>
      <div class="btn-row">
        <a class="btn btn-primary" href="consult.html">${s.cta || "Book a consult"}</a>
        <a class="btn" href="gallery.html">See examples</a>
      </div>
    `;

    mount.appendChild(card);
  });
})();
