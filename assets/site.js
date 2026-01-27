(() => {
  // ===== Helpers =====
  const ymId = (() => {
    const raw = document.documentElement.getAttribute('data-ym-id') || '';
    const n = Number(raw);
    return Number.isFinite(n) && n > 0 ? n : null;
  })();

  function reachGoal(name) {
    if (!ymId) return;
    if (typeof window.ym === 'function') {
      try { window.ym(ymId, 'reachGoal', name); } catch (_) {}
    }
  }

  // ===== Mobile nav =====
  const nav = document.querySelector('.nav');
  const btn = document.querySelector('[data-nav-toggle]');
  if (nav && btn) {
    btn.addEventListener('click', () => {
      nav.classList.toggle('open');
      const expanded = nav.classList.contains('open');
      btn.setAttribute('aria-expanded', expanded ? 'true' : 'false');
    });
  }

  // ===== Trackable clicks (Yandex Metrika goals) =====
  // Usage: add data-track="goal_name" to any link/button.
  document.addEventListener('click', (e) => {
    const el = e.target.closest('[data-track]');
    if (!el) return;
    const goal = el.getAttribute('data-track');
    if (goal) reachGoal(goal);
  });

  // ===== Scroll reveal (cards appear smoothly while scrolling) =====
  const revealEls = Array.from(document.querySelectorAll('[data-reveal]'));

  // Optional stagger: wrap a grid/container with data-stagger="70" (ms).
  document.querySelectorAll('[data-stagger]').forEach((wrap) => {
    const step = Number(wrap.getAttribute('data-stagger')) || 70;
    const items = Array.from(wrap.querySelectorAll('[data-reveal]'));
    items.forEach((el, i) => {
      if (el.style.transitionDelay) return;
      const delay = Math.min(i * step, 420);
      el.style.transitionDelay = `${delay}ms`;
    });
  });

  if (revealEls.length) {
    const enable = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!enable || !('IntersectionObserver' in window)) {
      revealEls.forEach((el) => el.classList.add('in-view'));
    } else {
      const obs = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('in-view');
          obs.unobserve(entry.target);
        });
      }, { threshold: 0.14, rootMargin: '0px 0px -10% 0px' });

      revealEls.forEach((el) => obs.observe(el));
    }
  }

  // ===== Lightbox for case images =====
  const lb = document.querySelector('[data-lightbox]');
  const lbImg = lb ? lb.querySelector('img') : null;
  const lbCap = lb ? lb.querySelector('[data-lightbox-caption]') : null;
  if (lb && lbImg) {
    const close = () => {
      lb.classList.remove('open');
      lb.setAttribute('aria-hidden', 'true');
      lbImg.removeAttribute('src');
      if (lbCap) lbCap.textContent = '';
    };

    document.addEventListener('click', (e) => {
      const a = e.target.closest('[data-case-image]');
      if (a) {
        e.preventDefault();
        const src = a.getAttribute('href');
        const cap = a.getAttribute('data-caption') || '';
        lbImg.src = src;
        if (lbCap) lbCap.textContent = cap;
        lb.classList.add('open');
        lb.setAttribute('aria-hidden', 'false');
        reachGoal('case_open');
        return;
      }
      if (e.target.closest('[data-lightbox-close]') || e.target === lb) close();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && lb.classList.contains('open')) close();
    });
  }
})();

// ---- v7: nav active state (no more "нет подсветки" + items don't jump) ----
(function(){
  const links = Array.from(document.querySelectorAll('.nav-links a[href]'));
  if (!links.length) return;

  const current = (location.pathname.split('/').pop() || 'index.html').toLowerCase();

  function setActive(target){
    links.forEach(a => {
      a.classList.remove('active');
      a.removeAttribute('aria-current');
    });
    if (!target) return;
    target.classList.add('active');
    // Only set aria-current for real pages (not hash on index)
    const href = (target.getAttribute('href') || '').split('#')[0].toLowerCase();
    if (href && href !== '' && href !== 'index.html#contact') {
      target.setAttribute('aria-current','page');
    }
  }

  // Initial active based on pathname
  let matched = null;
  for (const a of links) {
    const href = (a.getAttribute('href') || '').trim();
    if (!href || href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('tel:')) continue;
    const page = href.split('#')[0].toLowerCase();
    if (!page) continue;
    if (page === current) { matched = a; break; }
    // Treat "index.html" as default for root
    if (current === '' && page === 'index.html') { matched = a; break; }
  }
  if (matched) setActive(matched);

  // If we're on index and there is a hash, highlight "Контакты" when appropriate
  if (current === 'index.html' && location.hash) {
    const h = location.hash.toLowerCase();
    if (h === '#contact') {
      const c = links.find(a => (a.getAttribute('href')||'').toLowerCase().includes('#contact'));
      if (c) setActive(c);
    }
  }

  // Click highlight for in-page anchors
  links.forEach(a => {
    a.addEventListener('click', () => {
      const href = (a.getAttribute('href') || '');
      if (href.includes('#')) setActive(a);
    });
  });
})();
