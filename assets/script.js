// Shared UI helpers (nav, year, smooth scroll)
// v20260211.2: mobile menu stability + hash-aware scroll + scrollspy

(function () {
  const BREAKPOINT = 980; // must match CSS breakpoint where burger appears

  // --- Scroll lock (mobile menu) ---
  let scrollLockY = 0;
  const lockScroll = (lock) => {
    const html = document.documentElement;
    const body = document.body;

    if (lock) {
      scrollLockY = window.scrollY || window.pageYOffset || 0;
      // Use overflow-based lock for better iOS stability
      html.classList.add('scrollLock');
      body.classList.add('scrollLock');
    } else {
      html.classList.remove('scrollLock');
      body.classList.remove('scrollLock');
      window.scrollTo(0, scrollLockY);
    }
  };

  // --- URL helpers ---
  const canonicalPath = (p) => {
    let path = (p || '').split('?')[0];
    if (path === '' || path === '/') return '/index.html';
    path = path.replace(/\/+$/, '');
    return path.toLowerCase();
  };

  const currentPath = canonicalPath(window.location.pathname || '');

  const getSamePageHashTarget = (a) => {
    const href = (a && a.getAttribute && a.getAttribute('href')) || '';
    if (!href || !href.includes('#')) return null;

    try {
      const url = new URL(href, window.location.href);
      const raw = (url.hash || '').replace('#', '');
      const id = decodeURIComponent(raw);
      if (!id) return null;

      const el = document.getElementById(id);
      if (!el) return null;

      return { id, hash: `#${id}`, el };
    } catch {
      return null;
    }
  };

  // --- Mobile menu ---
  const setupMobileMenu = () => {
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

    // Expose for other handlers (smooth anchors)
    window.__ksCloseMenu = close;
    window.__ksIsMenuOpen = () => !menu.hidden;

    burger.addEventListener('click', toggle);

    // Close BEFORE link handlers (capture phase) so smooth-scroll works with unlocked body
    menu.addEventListener(
      'click',
      (e) => {
        const link = e.target.closest('a');
        if (link) close();
      },
      true
    );

    // ESC closes
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !menu.hidden) close();
    });

    // Click outside closes
    document.addEventListener('click', (e) => {
      if (menu.hidden) return;
      if (menu.contains(e.target) || burger.contains(e.target)) return;
      close();
    });

    // Resize to desktop closes
    window.addEventListener('resize', () => {
      if (window.innerWidth > BREAKPOINT && !menu.hidden) close();
    });
  };

  // --- Smooth anchors (same-page only) ---
  const setupSmoothAnchors = () => {
    document.querySelectorAll('a[href*="#"]').forEach((a) => {
      a.addEventListener('click', (e) => {
        const hit = getSamePageHashTarget(a);
        if (!hit) return;

        // Ensure menu isn't locking scroll
        if (window.__ksIsMenuOpen && window.__ksIsMenuOpen()) {
          window.__ksCloseMenu && window.__ksCloseMenu();
        }

        // Open parent <details> if needed
        if (hit.el.tagName === 'DETAILS') hit.el.open = true;
        const parentDetails = hit.el.closest('details');
        if (parentDetails) parentDetails.open = true;

        e.preventDefault();

        hit.el.scrollIntoView({ behavior: 'smooth', block: 'start' });

        // Keep URL hash in sync without jumping
        history.replaceState(null, '', hit.hash);

        // Hint scrollspy immediately
        window.dispatchEvent(new CustomEvent('ks:scrollspy', { detail: { id: hit.id } }));
      });
    });
  };

  // --- Active link (page-level) ---
  const setupPageActiveLinks = () => {
    const links = Array.from(document.querySelectorAll('.nav__link, .mobileLink'));
    if (!links.length) return;

    const setActive = (link) => {
      if (!link) return;
      if (link.classList.contains('nav__link')) link.classList.add('nav__link--active');
      if (link.classList.contains('mobileLink')) link.classList.add('mobileLink--active');
    };

    const clearActive = () => {
      links.forEach((a) => {
        a.classList.remove('nav__link--active');
        a.classList.remove('mobileLink--active');
      });
    };

    // Mark the current page link as active (only for non-hash links)
    const currentFile = (currentPath.split('/').pop() || 'index.html').toLowerCase();
    const pageLink = links.find((a) => {
      const href = a.getAttribute('href') || '';
      if (!href || href.startsWith('#') || href.includes('#')) return false;
      try {
        const url = new URL(href, window.location.href);
        const file = (canonicalPath(url.pathname).split('/').pop() || '').toLowerCase();
        return file === currentFile;
      } catch {
        return false;
      }
    });

    if (pageLink) {
      clearActive();
      setActive(pageLink);
    }

    // Expose for scrollspy
    window.__ksClearNavActive = clearActive;
    window.__ksSetNavActive = setActive;
  };

  // --- Scrollspy for sections (same-page anchors only) ---
  const setupScrollSpy = () => {
    const links = Array.from(document.querySelectorAll('.nav__link, .mobileLink'));
    if (!links.length) return;

    const items = [];
    const map = new Map(); // id -> { el, links: [] }

    links.forEach((link) => {
      const hit = getSamePageHashTarget(link);
      if (!hit) return;

      if (!map.has(hit.id)) map.set(hit.id, { id: hit.id, el: hit.el, links: [] });
      map.get(hit.id).links.push(link);
    });

    map.forEach((v) => items.push(v));
    if (!items.length) return;

    const clearAll = () => {
      links.forEach((a) => {
        a.classList.remove('nav__link--active');
        a.classList.remove('mobileLink--active');
      });
    };

    const setActiveId = (id) => {
      if (!id) return;
      clearAll();
      const found = items.find((x) => x.id === id);
      if (!found) return;
      found.links.forEach((a) => {
        if (a.classList.contains('nav__link')) a.classList.add('nav__link--active');
        if (a.classList.contains('mobileLink')) a.classList.add('mobileLink--active');
      });
    };

    // Hash on load
    if (window.location.hash) {
      const id = decodeURIComponent(window.location.hash.replace('#', ''));
      if (items.some((x) => x.id === id)) setActiveId(id);
    }

    // Allow smooth-anchor to force update
    window.addEventListener('ks:scrollspy', (e) => {
      const id = e && e.detail && e.detail.id;
      if (id) setActiveId(id);
    });

    const visible = new Map();
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const id = entry.target && entry.target.id;
          if (!id) return;
          if (entry.isIntersecting) visible.set(id, entry.intersectionRatio);
          else visible.delete(id);
        });

        if (!visible.size) return;

        let bestId = null;
        let bestRatio = -1;
        visible.forEach((ratio, id) => {
          if (ratio > bestRatio) {
            bestRatio = ratio;
            bestId = id;
          }
        });

        if (bestId) setActiveId(bestId);
      },
      {
        rootMargin: '-25% 0px -60% 0px',
        threshold: [0, 0.15, 0.3, 0.5, 0.75, 1],
      }
    );

    items.forEach((x) => obs.observe(x.el));
  };

  // --- Compare section: open details when hash points into it ---
  const setupCompareAutopen = () => {
    const details = document.querySelector('.compareDetails');
    if (!details) return;

    const openIfHash = () => {
      const h = (window.location.hash || '').replace('#', '').toLowerCase();
      if (!h) return;
      if (['compare', 'formats', 'compare-table'].includes(h)) details.open = true;
    };

    openIfHash();
    window.addEventListener('hashchange', openIfHash);
  };

  document.addEventListener('DOMContentLoaded', () => {
    const y = document.getElementById('year');
    if (y) y.textContent = String(new Date().getFullYear());

    setupMobileMenu();
    setupSmoothAnchors();
    setupPageActiveLinks();
    setupScrollSpy();
    setupCompareAutopen();
  });
})();
