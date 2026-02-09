// Small UX helpers for the static site.

(function () {
  // 1) Burger menu
  const burger = document.getElementById('burger');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileClose = document.getElementById('mobileClose');

  function openMenu() {
    if (!mobileMenu) return;
    mobileMenu.classList.add('isOpen');
    mobileMenu.setAttribute('aria-hidden', 'false');
  }

  function closeMenu() {
    if (!mobileMenu) return;
    mobileMenu.classList.remove('isOpen');
    mobileMenu.setAttribute('aria-hidden', 'true');
  }

  if (burger) burger.addEventListener('click', openMenu);
  if (mobileClose) mobileClose.addEventListener('click', closeMenu);

  // Close menu on link click
  if (mobileMenu) {
    mobileMenu.addEventListener('click', (e) => {
      const a = e.target && e.target.closest ? e.target.closest('a') : null;
      if (a && a.getAttribute('href')) closeMenu();
    });
  }

  // 2) Telegram prefill: ONLY for links explicitly marked with data-prefill="true"
  // (Important: do not add ?text to group links.)
  const msg = encodeURIComponent(
    'Привет! Хочу обсудить разбор/план 30/60/90 и варианты сопровождения.\n' +
      'Ссылка на мой магазин/ЛК: '
  );

  document.querySelectorAll('a[data-prefill="true"]').forEach((a) => {
    try {
      const url = new URL(a.href);
      if (url.hostname !== 't.me') return;
      if (url.searchParams.has('text')) return;
      url.searchParams.set('text', decodeURIComponent(msg));
      a.href = url.toString();
    } catch (_) {
      // ignore
    }
  });
})();
