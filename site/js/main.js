(function () {
  var els = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { threshold: 0.12 });
    els.forEach(function (el) { io.observe(el); });
  } else els.forEach(function (el) { el.classList.add('in'); });

  /* Enquiry form: validates, then emails the details to events@redknot.co.in */
  var f = document.getElementById('enq');
  if (f) f.addEventListener('submit', function (e) {
    e.preventDefault();
    var ok = true;
    f.querySelectorAll('[required]').forEach(function (i) {
      var bad = !i.value.trim() || (i.type === 'email' && !/^\S+@\S+\.\S+$/.test(i.value));
      i.classList.toggle('err', bad); if (bad) ok = false;
    });
    var thanks = f.querySelector('.thanks'), fail = f.querySelector('.form-error');
    thanks.hidden = true; if (fail) fail.hidden = true;
    if (!ok) return;
    if (f.querySelector('[name="_honey"]').value) { thanks.hidden = false; f.reset(); return; } /* spam bot */
    var btn = f.querySelector('button[type="submit"]'), label = btn.textContent;
    btn.disabled = true; btn.textContent = 'SENDING…';
    var data = {
      name: f.name.value.trim(), email: f.email.value.trim(), phone: f.phone.value.trim(),
      wedding_date: f.date.value.trim(), location: f.location.value.trim(), message: f.message.value.trim(),
      _subject: 'New wedding enquiry – ' + f.name.value.trim() + ' (Luxury Weddings by RedKnot website)',
      _template: 'table', _captcha: 'false'
    };
    fetch('https://formsubmit.co/ajax/events@redknot.co.in', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(data)
    }).then(function (r) { return r.json().catch(function () { return {}; }).then(function (j) { return { ok: r.ok, j: j }; }); })
      .then(function (res) {
        if (res.ok && String(res.j.success) !== 'false') { thanks.hidden = false; f.reset(); }
        else { if (fail) fail.hidden = false; }
      })
      .catch(function () { if (fail) fail.hidden = false; })
      .then(function () { btn.disabled = false; btn.textContent = label; });
  });

  document.querySelectorAll('.faq').forEach(function (d) {
    d.addEventListener('toggle', function () {
      if (d.open) document.querySelectorAll('.faq').forEach(function (o) { if (o !== d) o.open = false; });
    });
  });

  /* About page ornaments: start the gold line-art animation when a section scrolls into view */
  (function () {
    var secs = document.querySelectorAll('.story, .drives');
    if (!secs.length) return;
    document.documentElement.classList.add('orn-js');
    if (!('IntersectionObserver' in window)) { secs.forEach(function (s) { s.classList.add('orn-on'); }); return; }
    var o = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('orn-on'); o.unobserve(e.target); } });
    }, { threshold: 0.2 });
    secs.forEach(function (s) { o.observe(s); });
  })();
})();
