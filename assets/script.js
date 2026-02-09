(() => {
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  const burger = document.querySelector('.burger');
  const menu = document.getElementById('mobileMenu');
  if (burger && menu) {
    const closeMenu = () => {
      burger.setAttribute('aria-expanded', 'false');
      menu.hidden = true;
    };

    burger.addEventListener('click', () => {
      const expanded = burger.getAttribute('aria-expanded') === 'true';
      burger.setAttribute('aria-expanded', String(!expanded));
      menu.hidden = expanded;
    });

    // Close on navigation click
    menu.addEventListener('click', (e) => {
      const t = e.target;
      if (t && t.matches('a')) closeMenu();
    });

    // Close on Escape
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeMenu();
    });
  }

  // If user clicks a Telegram CTA, prefill message for quicker lead conversion.
  // Safe: simply adds ?text=... to t.me links.
  const tgLinks = document.querySelectorAll('a[data-cta="tg"], a[href^="https://t.me/"], a[href^="http://t.me/"]');
  const msg = encodeURIComponent('Привет! Хочу разбор и план 30/60/90. Вот мой магазин/артикулы: ...');
  tgLinks.forEach(a => {
    try {
      const href = a.getAttribute('href') || '';
      if (!href.includes('t.me')) return;
      // Only add for direct user links or groups; if already has query, keep it.
      if (href.includes('?')) return;
      a.setAttribute('href', href + '?text=' + msg);
    } catch (_e) {}
  });
})();
