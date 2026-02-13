// Minimal lightbox for screenshots
// Usage: <a href="full.png" data-lightbox data-caption="..."> <img ...> </a>

(function () {
  const selector = 'a[data-lightbox]';

  const build = () => {
    const root = document.createElement('div');
    root.className = 'lightbox';
    root.setAttribute('role', 'dialog');
    root.setAttribute('aria-modal', 'true');
    root.innerHTML = `
      <div class="lightbox__inner" role="document">
        <button type="button" class="lightbox__close" aria-label="Закрыть">×</button>
        <img class="lightbox__img" alt="" />
        <div class="lightbox__caption" aria-live="polite"></div>
      </div>
    `;
    document.body.appendChild(root);

    const img = root.querySelector('.lightbox__img');
    const cap = root.querySelector('.lightbox__caption');
    const closeBtn = root.querySelector('.lightbox__close');

    const close = () => {
      root.classList.remove('is-open');
      root.setAttribute('aria-hidden', 'true');
      document.documentElement.classList.remove('noScroll');
      document.body.classList.remove('noScroll');
      // prevent flash of old image
      img.src = '';
      img.alt = '';
      cap.textContent = '';
    };

    const open = ({ src, alt, caption }) => {
      img.alt = alt || '';
      cap.textContent = 'Загрузка…';

      img.onload = () => {
        cap.textContent = caption || alt || '';
      };
      img.onerror = () => {
        cap.textContent = (caption || alt || '') + ' — не удалось загрузить изображение';
      };

      img.src = src;
      root.classList.add('is-open');
      root.removeAttribute('aria-hidden');
      document.documentElement.classList.add('noScroll');
      document.body.classList.add('noScroll');
      closeBtn.focus();
    };

    root.addEventListener('click', (e) => {
      if (e.target === root) close();
    });
    closeBtn.addEventListener('click', close);
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && root.classList.contains('is-open')) close();
    });

    return { open, close, root };
  };

  document.addEventListener('DOMContentLoaded', () => {
    const links = Array.from(document.querySelectorAll(selector));
    if (!links.length) return;

    const lb = build();

    links.forEach((a) => {
      a.addEventListener('click', (e) => {
        // allow opening in new tab with modifier keys
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
        e.preventDefault();

        const img = a.querySelector('img');
        const alt = (img && img.getAttribute('alt')) || '';
        const caption = a.getAttribute('data-caption') || alt || '';
        const src = a.getAttribute('href');
        lb.open({ src, alt, caption });
      });
    });
  });
})();
