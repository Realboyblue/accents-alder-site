(function(){
  // Year
  var y = new Date().getFullYear();
  var yearEl = document.querySelector('[data-year]');
  if (yearEl) yearEl.textContent = String(y);

  // Helpers
  function formatPhone(d){
    d = (d || '').replace(/\D/g, '');
    if (d.length === 11 && d.charAt(0) === '1') d = d.slice(1);
    if (d.length !== 10) return d;
    return '(' + d.slice(0,3) + ') ' + d.slice(3,6) + '-' + d.slice(6);
  }

  function keepLabel(el){
    var d = (el.getAttribute('data-display') || '').toLowerCase();
    return d === 'label';
  }

  // Email hydration (supports .js-email OR any element with data-email)
  var emailEls = document.querySelectorAll('.js-email, [data-email]');
  for (var i = 0; i < emailEls.length; i++) {
    (function(el){
      el.addEventListener('click', function(e){
        if (el.getAttribute('href') === '#') e.preventDefault();
      });

      var addr = (el.getAttribute('data-email') || '').trim();
      if (!addr) {
        var user = (el.getAttribute('data-user') || '').trim();
        var domain = (el.getAttribute('data-domain') || '').trim();
        var tld = (el.getAttribute('data-tld') || '').trim();
        if (user && domain && tld) addr = user + '@' + domain + '.' + tld;
      }
      if (!addr) return;

      el.href = 'mailto:' + addr;
      if (!keepLabel(el) || !el.textContent.trim()) el.textContent = addr;
    })(emailEls[i]);
  }

  // Phone hydration (supports .js-phone OR any element with data-phone)
  var phoneEls = document.querySelectorAll('.js-phone, [data-phone]');
  for (var j = 0; j < phoneEls.length; j++) {
    (function(el){
      el.addEventListener('click', function(e){
        if (el.getAttribute('href') === '#') e.preventDefault();
      });

      var digits = (el.getAttribute('data-phone') || '').replace(/\D/g, '');
      if (!digits) return;

      el.href = 'tel:' + digits;
      if (!keepLabel(el) || !el.textContent.trim()) el.textContent = formatPhone(digits);
    })(phoneEls[j]);
  }

  // Active nav link
  try{
    var path = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
    var nav = document.querySelectorAll('.navlinks a[href]');
    for (var k=0;k<nav.length;k++){
      var href = (nav[k].getAttribute('href')||'').toLowerCase();
      if (!href || href.indexOf('http')===0) continue;
      if (href === path){
        nav[k].className = (nav[k].className + ' active').trim();
      }
      if ((path==='' || path==='/') && href==='index.html'){
        nav[k].className = (nav[k].className + ' active').trim();
      }
    }
  }catch(e){}
})();
