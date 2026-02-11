// Shared UI helpers (nav, year, smooth scroll)
// v20260211: align with current markup (data-burger / data-mobile-menu)

(function () {
  const lockScroll = (lock) => {
    document.documentElement.classList.toggle('noScroll', !!lock);
    document.body.classList.toggle('noScroll', !!lock);
  };

  const setupMobileMenu = () => {
    // Markup across pages
    const burger = document.querySelector('[data-burger]');
    const menu = document.querySelector('[data-mobile-menu]');
    if (!burger || !menu) return;

    // Start closed
    menu.hidden = true;
    burger.setAttribute('aria-expanded', 'false');

    const open = () => {
      menu.hidden = false;
      burger.setAttribute('aria-expanded', 'true');
      lockScroll(true);
    };

    const close = () => {
      menu.hidden = true;
      burger.setAttribute('aria-expanded', 'false');
      lockScroll(false);
    };

    const toggle = () => {
      if (menu.hidden) open();
      else close();
    };

    burger.addEventListener('click', toggle);

    // Any link click inside menu closes it
    menu.addEventListener('click', (e) => {
      const link = e.target.closest('a');
      if (link) close();
    });

    // ESC closes
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !menu.hidden) close();
    });

    // Resize to desktop closes
    window.addEventListener('resize', () => {
      if (window.innerWidth > 860 && !menu.hidden) close();
    });
  };

  const setupSmoothAnchors = () => {
    const isSamePage = (link) => {
      // Supports: "#faq" and "services.html#faq" when already on services.html
      const href = link.getAttribute('href') || '';
      if (href.startsWith('#')) return true;
      try {
        const u = new URL(href, window.location.href);
        return u.pathname === window.location.pathname && !!u.hash;
      } catch {
        return false;
      }
    };

    document.querySelectorAll('a[href*="#"]').forEach((a) => {
      a.addEventListener('click', (e) => {
        if (!isSamePage(a)) return;
        const href = a.getAttribute('href') || '';
        const hash = href.includes('#') ? href.slice(href.indexOf('#')) : '';
        if (!hash || hash === '#') return;
        const el = document.querySelector(hash);
        if (!el) return;
        e.preventDefault();
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        // keep URL hash in sync without jumping
        if (hash) history.replaceState(null, '', hash);
      });
    });
  };

  const setupScrollSpy = () => {
    const navLinks = Array.from(document.querySelectorAll('.nav__link'));
    if (!navLinks.length) return;

    // Default active link (page-level)
    const defaultActive = navLinks.find((a) => a.classList.contains('active')) || null;

    const items = navLinks
      .map((link) => {
        const href = link.getAttribute('href') || '';
        if (!href.includes('#')) return null;
        const id = href.slice(href.indexOf('#') + 1);
        if (!id) return null;
        const section = document.getElementById(id);
        if (!section) return null;
        return { id, link, section };
      })
      .filter(Boolean);

    if (!items.length) return;

    const setActive = (id) => {
      navLinks.forEach((a) => a.classList.remove('active'));
      const hit = items.find((x) => x.id === id);
      if (hit) hit.link.classList.add('active');
      else if (defaultActive) defaultActive.classList.add('active');
    };

    // Initial hash
    if (window.location.hash) {
      const id = window.location.hash.replace('#', '');
      if (items.some((x) => x.id === id)) setActive(id);
    }

    const visible = new Map();
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const id = entry.target.id;
          if (!id) return;
          if (entry.isIntersecting) visible.set(id, entry.intersectionRatio);
          else visible.delete(id);
        });

        if (!visible.size) {
          setActive(null);
          return;
        }

        // Pick the most visible section
        let bestId = null;
        let bestRatio = -1;
        visible.forEach((ratio, id) => {
          if (ratio > bestRatio) {
            bestRatio = ratio;
            bestId = id;
          }
        });
        if (bestId) setActive(bestId);
      },
      {
        // prefer the section that sits around the top third of the viewport
        rootMargin: '-30% 0px -60% 0px',
        threshold: [0, 0.15, 0.3, 0.5, 0.75, 1],
      }
    );

    items.forEach((x) => obs.observe(x.section));
  };

  document.addEventListener('DOMContentLoaded', () => {
    const y = document.getElementById('year');
    if (y) y.textContent = String(new Date().getFullYear());

    setupMobileMenu();
    setupSmoothAnchors();
    setupScrollSpy();
  });
})();
