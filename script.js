      (function () {
      var root = document.documentElement, S = document.getElementById('accessStatus');
      var STEPS = [87.5, 100, 112.5, 125, 137.5, 150], CON = ['רגילה', 'גבוהה', 'מרבית'];
      var f = 1, c = 0, o = 1;
      function store() { try { localStorage.setItem('access', f + ',' + c + ',' + o); } catch (e) { } }
      function say(t) { if (S) S.textContent = t; }
      function apply() {
        root.style.fontSize = STEPS[f] + '%';
        if (c === 0) root.removeAttribute('data-contrast'); else root.setAttribute('data-contrast', c);
      }
      try {
        var v = (localStorage.getItem('access') || '').split(','); if (v.length >= 2) {
          f = Math.min(STEPS.length - 1, Math.max(0, parseInt(v[0], 10) || 1));
          c = Math.min(2, Math.max(0, parseInt(v[1], 10) || 0));
          if (v.length > 2) o = (v[2] === '0') ? 0 : 1;
        }
      } catch (e) { }
      apply();
      function bind(id, fn) { var b = document.getElementById(id); if (b) b.addEventListener('click', fn); }
      bind('fontUp', function () { f = Math.min(STEPS.length - 1, f + 1); apply(); store(); say('גודל טקסט ' + STEPS[f] + ' אחוז'); });
      bind('fontDown', function () { f = Math.max(0, f - 1); apply(); store(); say('גודל טקסט ' + STEPS[f] + ' אחוז'); });
      bind('conUp', function () { c = Math.min(2, c + 1); apply(); store(); say('ניגודיות ' + CON[c]); });
      bind('conDown', function () { c = Math.max(0, c - 1); apply(); store(); say('ניגודיות ' + CON[c]); });
      var bar = document.getElementById('accessbar'), openBtn = document.getElementById('accessOpen');
      function setOpen(v, move) {
        o = v ? 1 : 0;
        if (bar) bar.hidden = !v;
        if (openBtn) { openBtn.hidden = v; openBtn.setAttribute('aria-expanded', v ? 'true' : 'false'); }
        if (move) { var t = v ? document.getElementById('fontUp') : openBtn; if (t && !t.hidden) t.focus({ preventScroll: true }); }
        try { update(); } catch (e) { }
      }
      bind('accessOpen', function () { setOpen(true, true); store(); say('סרגל הנגישות נפתח'); });
      bind('accessClose', function () { setOpen(false, true); store(); say('סרגל הנגישות נסגר'); });
      setOpen(o === 1, false);
      bind('accessReset', function () { f = 1; c = 0; apply(); store(); say('הגדרות התצוגה אופסו'); });

      // mark the section currently in view
      var links = [].slice.call(document.querySelectorAll('nav a[href^="#"]'));
      if (!links.length) return;
      var targets = links.map(function (a) { return document.getElementById(a.getAttribute('href').slice(1)); });
      var ticking = false;
      function update() {
        ticking = false;
        var hd = document.querySelector('header'), hh = hd ? hd.offsetHeight : 0;
        root.style.setProperty('--hdr', (hh + 24) + 'px');
        var line = hh + 24, cur = -1;
        targets.forEach(function (el, i) { if (el && el.getBoundingClientRect().top <= line) cur = i; });
        if (window.innerHeight + window.scrollY >= document.body.scrollHeight - 4) cur = targets.length - 1;
        links.forEach(function (a, i) { if (i === cur) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current'); });
      }
      addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
      addEventListener('resize', update); update();
    })();

    // Mobile menu toggle
    document.addEventListener('DOMContentLoaded', () => {
      const menuToggle = document.getElementById('menuToggle');
      const mainNav = document.getElementById('mainNav');
      const iconBurger = menuToggle.querySelector('.icon-burger');
      const iconClose = menuToggle.querySelector('.icon-close');
      const navLinks = mainNav.querySelectorAll('a');

      function toggleMenu(open) {
        const shouldOpen = open !== undefined ? open : !mainNav.classList.contains('is-open');

        mainNav.classList.toggle('is-open', shouldOpen);
        menuToggle.setAttribute('aria-expanded', String(shouldOpen));
        menuToggle.setAttribute('aria-label', shouldOpen ? 'סגירת תפריט ניווט' : 'פתיחת תפריט ניווט');

        iconBurger.toggleAttribute('hidden', shouldOpen);
        iconClose.toggleAttribute('hidden', !shouldOpen);
      }

      menuToggle.addEventListener('click', () => toggleMenu());

      // Close menu when a navigation item is selected (standard for single-page hash anchors)
      navLinks.forEach(link => {
        link.addEventListener('click', () => {
          if (window.innerWidth <= 768) {
            toggleMenu(false);
          }
        });
      });

      // Close with Esc key for keyboard accessibility
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && mainNav.classList.contains('is-open')) {
          toggleMenu(false);
          menuToggle.focus();
        }
      });

      // Close if clicking outside the menu dropdown
      document.addEventListener('click', (e) => {
        if (
          mainNav.classList.contains('is-open') &&
          !mainNav.contains(e.target) &&
          !menuToggle.contains(e.target)
        ) {
          toggleMenu(false);
        }
      });
    });