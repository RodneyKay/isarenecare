document.addEventListener('DOMContentLoaded', function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (window.AOS) AOS.init({ duration: 700, easing: 'ease-out-cubic', once: true, offset: 70, disable: reduce });

  /* Preloader */
  var preloader = document.getElementById('preloader');
  function hidePre() { if (preloader) preloader.classList.add('hide'); }
  window.addEventListener('load', function () { setTimeout(hidePre, 250); });
  setTimeout(hidePre, 2000);

  /* Scroll-to-top with progress ring + navbar state */
  var nav = document.getElementById('mainNav');
  var topBtn = document.getElementById('scrollTop');
  var ring = topBtn && topBtn.querySelector('.progress');
  var C = 2 * Math.PI * 23;
  if (ring) { ring.style.strokeDasharray = C; ring.style.strokeDashoffset = C; }
  function onScroll() {
    var y = window.scrollY;
    if (nav) nav.classList.toggle('scrolled', y > 40);
    if (topBtn) {
      var h = document.documentElement.scrollHeight - window.innerHeight;
      if (ring) ring.style.strokeDashoffset = C - (h > 0 ? y / h : 0) * C;
      topBtn.classList.toggle('show', y > 400);
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  function toTop() { window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' }); }
  if (topBtn) {
    topBtn.addEventListener('click', toTop);
    topBtn.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toTop(); } });
  }

  /* Close mobile menu after choosing a plain link */
  document.querySelectorAll('#navMenu .nav-link:not(.dropdown-toggle), #navMenu .dropdown-item').forEach(function (a) {
    a.addEventListener('click', function () {
      var el = document.getElementById('navMenu');
      var inst = window.bootstrap && bootstrap.Collapse.getInstance(el);
      if (inst) inst.hide();
    });
  });

  /* Counters */
  var counters = document.querySelectorAll('.counter');
  function run(el) {
    var target = parseInt(el.getAttribute('data-target'), 10);
    if (reduce) { el.textContent = target.toLocaleString(); return; }
    var start = null;
    (function step(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / 1400, 1);
      el.textContent = Math.floor((1 - Math.pow(1 - p, 3)) * target).toLocaleString();
      if (p < 1) requestAnimationFrame(step); else el.textContent = target.toLocaleString();
    })(performance.now());
  }
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { run(en.target); io.unobserve(en.target); } });
    }, { threshold: 0.5 });
    counters.forEach(function (c) { c.textContent = c.getAttribute('data-target'); io.observe(c); });
  } else counters.forEach(function (c) { c.textContent = c.getAttribute('data-target'); });

  /* Hero glow follows pointer */
  var hero = document.querySelector('.hero'), glow = document.querySelector('.hero-glow');
  if (hero && glow && !reduce && window.matchMedia('(pointer:fine)').matches) {
    hero.addEventListener('mousemove', function (e) {
      var r = hero.getBoundingClientRect();
      glow.style.transform = 'translate(' + (e.clientX - r.left - 260) * 0.15 + 'px,' + (e.clientY - r.top - 260) * 0.15 + 'px)';
    });
  }

  /* AJAX forms (contact, request care, careers, newsletter) */
  document.querySelectorAll('form[data-ajax-form]').forEach(function (form) {
    var box = form.querySelector('[data-form-status]') || form.parentElement.querySelector('[data-form-status]');
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!form.checkValidity()) { form.classList.add('was-validated'); form.reportValidity && form.reportValidity(); return; }
      var btn = form.querySelector('button[type=submit]');
      if (btn) btn.disabled = true;
      var body = {};
      new FormData(form).forEach(function (v, k) { body[k] = v; });
      fetch(form.action, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
        .then(function (r) { return r.json().catch(function () { return { ok: false, message: 'Unexpected response.' }; }); })
        .then(function (j) {
          if (box) { box.textContent = j.message; box.className = (j.ok ? 'form-status-ok' : 'form-status-err') + (box.classList.contains('newsletter-note') ? ' newsletter-note' : ''); }
          if (j.ok) { form.reset(); form.classList.remove('was-validated'); }
        })
        .catch(function () { if (box) { box.textContent = 'Network problem. Please call us instead.'; box.className = 'form-status-err'; } })
        .then(function () { if (btn) btn.disabled = false; });
    });
  });

  /* FAQ search + category filter */
  var search = document.getElementById('faqSearch');
  if (search) {
    var clear = document.getElementById('faqClear'), cats = document.querySelectorAll('.faq-cat-btn'),
      items = document.querySelectorAll('.faq-item'), groups = document.querySelectorAll('.faq-group'),
      empty = document.getElementById('faqEmpty'), active = 'all';
    var apply = function () {
      var term = search.value.trim().toLowerCase(), any = false;
      clear.classList.toggle('show', term.length > 0);
      items.forEach(function (it) {
        var vis = (active === 'all' || it.getAttribute('data-cat') === active) && (!term || it.textContent.toLowerCase().indexOf(term) !== -1);
        it.setAttribute('data-hidden', vis ? 'false' : 'true');
        if (vis) any = true;
      });
      groups.forEach(function (g) { g.style.display = g.querySelectorAll('.faq-item[data-hidden="false"]').length ? '' : 'none'; });
      empty.classList.toggle('show', !any);
    };
    search.addEventListener('input', apply);
    clear.addEventListener('click', function () { search.value = ''; apply(); search.focus(); });
    cats.forEach(function (b) { b.addEventListener('click', function () {
      cats.forEach(function (x) { x.classList.remove('active'); }); b.classList.add('active');
      active = b.getAttribute('data-cat'); apply();
    }); });
  }

  /* Legal page TOC scrollspy */
  var toc = document.querySelectorAll('#policyToc a');
  if (toc.length) {
    var secs = Array.prototype.map.call(toc, function (l) { return document.getElementById(l.getAttribute('href').slice(1)); }).filter(Boolean);
    var spy = function () {
      var pos = window.scrollY + 140, cur = secs[0];
      secs.forEach(function (s) { if (s.offsetTop <= pos) cur = s; });
      toc.forEach(function (l) { l.classList.toggle('active', l.getAttribute('href') === '#' + cur.id); });
    };
    window.addEventListener('scroll', spy, { passive: true }); spy();
    toc.forEach(function (l) { l.addEventListener('click', function (e) {
      e.preventDefault();
      var t = document.getElementById(l.getAttribute('href').slice(1));
      if (t) window.scrollTo({ top: t.offsetTop - 96, behavior: reduce ? 'auto' : 'smooth' });
    }); });
  }

  /* Video modal: play on open, pause on close */
  var vm = document.getElementById('storyModal');
  if (vm) {
    var vid = vm.querySelector('video');
    vm.addEventListener('shown.bs.modal', function () { if (vid) vid.play().catch(function () {}); });
    vm.addEventListener('hidden.bs.modal', function () { if (vid) vid.pause(); });
  }
});
