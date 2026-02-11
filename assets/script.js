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
    document.querySelectorAll('a[href^="#"]').forEach((a) => {
      a.addEventListener('click', (e) => {
        const href = a.getAttribute('href');
        if (!href || href === '#') return;
        const el = document.querySelector(href);
        if (!el) return;
        e.preventDefault();
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });
  };

  document.addEventListener('DOMContentLoaded', () => {
    const y = document.getElementById('year');
    if (y) y.textContent = String(new Date().getFullYear());

    setupMobileMenu();
    setupSmoothAnchors();
  });
})();
