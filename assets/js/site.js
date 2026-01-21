(function(){
  // Year
  var y = new Date().getFullYear();
  var yearEl = document.querySelector("[data-year]");
  if (yearEl) yearEl.textContent = String(y);

  // Email hydration (simple obfuscation to reduce scraping)
  var emailEls = document.querySelectorAll(".js-email");
  for (var i = 0; i < emailEls.length; i++) {
    (function(el){
      var user = el.getAttribute("data-user") || "";
      var domain = el.getAttribute("data-domain") || "";
      var tld = el.getAttribute("data-tld") || "";
      if (!user || !domain || !tld) return;

      var addr = user + "@" + domain + "." + tld;
      el.textContent = addr;
      el.href = "mailto:" + addr;

      el.addEventListener("click", function(e){
        if (el.getAttribute("href") === "#") e.preventDefault();
      });
    })(emailEls[i]);
  }

  // Phone hydration
  function formatPhone(d){
    // Expect 10 digits; allow leading 1
    d = (d || "").replace(/\D/g, "");
    if (d.length === 11 && d.charAt(0) === "1") d = d.slice(1);
    if (d.length !== 10) return d;
    return "(" + d.slice(0,3) + ") " + d.slice(3,6) + "-" + d.slice(6);
  }

  var phoneEls = document.querySelectorAll(".js-phone");
  for (var j = 0; j < phoneEls.length; j++) {
    (function(el){
      el.addEventListener("click", function(e){
        if (el.getAttribute("href") === "#") e.preventDefault();
      });

      var digits = (el.getAttribute("data-phone") || "");
      digits = digits.replace(/\D/g, "");
      if (!digits) return;

      el.textContent = formatPhone(digits);
      el.href = "tel:" + digits;
    })(phoneEls[j]);
  }

  // Active nav link
  try{
    var path = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
    var nav = document.querySelectorAll('.navlinks a[href]');
    for (var i=0;i<nav.length;i++){
      var href = (nav[i].getAttribute('href')||'').toLowerCase();
      if (!href || href.indexOf('http')===0) continue;
      if (href === path){
        nav[i].className = (nav[i].className + ' active').trim();
      }
      // Special case: root -> index.html
      if ((path==='' || path==='/' ) && href==='index.html'){
        nav[i].className = (nav[i].className + ' active').trim();
      }
    }
  }catch(e){}

})();
