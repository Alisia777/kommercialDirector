(function(){
  const nav = document.querySelector('[data-nav]');
  const btn = document.querySelector('[data-nav-toggle]');
  if(nav && btn){
    btn.addEventListener('click', ()=>{
      const open = nav.classList.toggle('open');
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    document.addEventListener('click', (e)=>{
      if(!nav.contains(e.target) && nav.classList.contains('open')) nav.classList.remove('open');
    });
  }

  // --- Lightbox for screenshots (mobile-friendly) ---
  // Usage:
  //  - add class="figure" (gallery cards) OR data-lightbox (any link)
  const figureLinks = Array.from(document.querySelectorAll('a.figure[href], a[data-lightbox][href]'));
  if(figureLinks.length){
    const pageLang = (document.documentElement.getAttribute('lang') || 'ru').toLowerCase();
    const isEn = pageLang.startsWith('en');
    let lb;
    let prevOverflowHtml = '';
    let prevOverflowBody = '';

    const ensureLightbox = () => {
      if(lb) return lb;

      const root = document.createElement('div');
      root.className = 'lightbox';
      root.setAttribute('role', 'dialog');
      root.setAttribute('aria-modal', 'true');
      root.setAttribute('aria-label', isEn ? 'Image preview' : 'Просмотр изображения');

      root.innerHTML = `
        <div class="lightbox__inner">
          <button class="lightbox__close" type="button" aria-label="${isEn ? 'Close' : 'Закрыть'}">×</button>
          <img class="lightbox__img" alt="" src="" />
          <div class="lightbox__cap">
            <div class="lightbox__title"></div>
            <div class="lightbox__hint">${isEn ? 'Tap outside the image to close' : 'Нажмите вне картинки, чтобы закрыть'}</div>
          </div>
        </div>
      `;

      document.body.appendChild(root);

      const img = root.querySelector('.lightbox__img');
      const title = root.querySelector('.lightbox__title');
      const closeBtn = root.querySelector('.lightbox__close');

      const close = () => {
        root.classList.remove('open');
        // restore scroll
        document.documentElement.style.overflow = prevOverflowHtml;
        document.body.style.overflow = prevOverflowBody;
      };

      closeBtn.addEventListener('click', close);
      root.addEventListener('click', (e)=>{
        // click outside inner panel closes
        if(e.target === root) close();
      });
      document.addEventListener('keydown', (e)=>{
        if(e.key === 'Escape' && root.classList.contains('open')) close();
      });

      lb = {root, img, title, close};
      return lb;
    };

    const openLightbox = (src, titleText) => {
      const {root, img, title} = ensureLightbox();

      prevOverflowHtml = document.documentElement.style.overflow || '';
      prevOverflowBody = document.body.style.overflow || '';
      document.documentElement.style.overflow = 'hidden';
      document.body.style.overflow = 'hidden';

      img.src = src;
      img.alt = titleText || '';
      title.textContent = titleText || '';
      root.classList.add('open');
    };

    figureLinks.forEach((a)=>{
      // Only intercept links that look like images
      const href = a.getAttribute('href') || '';
      if(!/\.(png|jpe?g|webp)(\?.*)?$/i.test(href)) return;

      a.addEventListener('click', (e)=>{
        e.preventDefault();
        const explicitTitle = a.getAttribute('data-lightbox-title');
        const titleEl = a.querySelector('.figcap strong');
        const titleText = (explicitTitle || (titleEl ? titleEl.textContent.trim() : '') || a.textContent.trim()).trim();
        openLightbox(href, titleText);
      });
    });
  }
})();