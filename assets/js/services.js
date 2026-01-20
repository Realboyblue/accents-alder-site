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

  data.services.forEach(s => {
    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
      <div class="badge"><span class="badge-dot"></span>${s.name}</div>
      <h2 style="margin:10px 0 8px; font-family:inherit;">${s.tagline}</h2>
      <hr class="sep" />
      <div class="small" style="font-weight:900;color:var(--text)">Highlights</div>
      <ul style="margin:10px 0 0;padding-left:18px;color:var(--muted); font-family:system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif;">
        ${(s.highlights||[]).map(x => `<li>${x}</li>`).join("")}
      </ul>
      <div style="margin-top:14px;display:flex;gap:10px;flex-wrap:wrap">
        <a class="btn btn-primary" href="consult.html">${s.cta || "Book consult"}</a>
        <a class="btn" href="gallery.html">See examples</a>
      </div>
    `;
    mount.appendChild(card);
  });
})();
