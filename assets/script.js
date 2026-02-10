// Shared UI helpers (nav, year, smooth scroll)
// v20260210: fix mobile menu, close on resize/esc, keep pages consistent

(function () {
  const $ = (id) => document.getElementById(id);

  const lockScroll = (lock) => {
    document.documentElement.classList.toggle('noScroll', !!lock);
    document.body.classList.toggle('noScroll', !!lock);
  };

  const setupMobileMenu = () => {
    const toggle = $('navToggle');
    const menu = $('mobileMenu');
    const closeBtn = $('menuClose');

    if (!toggle || !menu) return;

    // Always start closed (prevents 'двойное меню' на десктопе)
    menu.setAttribute('hidden', '');
    menu.setAttribute('aria-hidden', 'true');
    toggle.setAttribute('aria-expanded', 'false');
    lockScroll(false);


    const open = () => {
      menu.removeAttribute('hidden');
      menu.setAttribute('aria-hidden', 'false');
      toggle.setAttribute('aria-expanded', 'true');
      lockScroll(true);
    };

    const close = () => {
      menu.setAttribute('hidden', '');
      menu.setAttribute('aria-hidden', 'true');
      toggle.setAttribute('aria-expanded', 'false');
      lockScroll(false);
    };

    const isOpen = () => !menu.hasAttribute('hidden');

    // Initial state
    toggle.setAttribute('aria-expanded', isOpen() ? 'true' : 'false');
    menu.setAttribute('aria-hidden', isOpen() ? 'false' : 'true');

    toggle.addEventListener('click', () => {
      if (isOpen()) close();
      else open();
    });

    if (closeBtn) closeBtn.addEventListener('click', close);

    // Click outside panel closes
    menu.addEventListener('click', (e) => {
      if (e.target === menu) close();
    });

    // ESC closes
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && isOpen()) close();
    });

    // If user resized to desktop, close the mobile overlay
    window.addEventListener('resize', () => {
      if (window.innerWidth > 860 && isOpen()) close();
    });
  };

  const setupSmoothAnchors = () => {
    document.querySelectorAll('a[href^="#"]').forEach((a) => {
      a.addEventListener('click', (e) => {
        const targetId = a.getAttribute('href');
        if (!targetId || targetId === '#') return;
        const el = document.querySelector(targetId);
        if (!el) return;
        e.preventDefault();
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });
  };

  document.addEventListener('DOMContentLoaded', () => {
    // year
    const y = $('year');
    if (y) y.textContent = String(new Date().getFullYear());

    setupMobileMenu();
    setupSmoothAnchors();
  });
})();
