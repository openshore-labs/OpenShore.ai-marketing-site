// Small, dependency-free page behaviors shared by every page. Each one is a
// progressive enhancement: with this script blocked the page still works (the
// download buttons go to the platform tiles, every list item shows, the
// header pins whole, the floating button simply stays put).
(() => {
  const root = document.documentElement;

  // ---- One download button for the visitor's own desktop ---------------
  // Fewer choices, faster decision: a desktop we recognize gets a single
  // "Download for <OS>" button; phones and anything unknown keep "Get
  // OpenShore", which scrolls to the tiles where every platform is listed.
  const ua = navigator.userAgent || '';
  const plat = (navigator.userAgentData && navigator.userAgentData.platform) || navigator.platform || '';
  const touchMac = /Mac/.test(plat) && navigator.maxTouchPoints > 1; // iPadOS reports as a Mac
  let os = null;
  if (/Android|iPhone|iPad|iPod/i.test(ua) || touchMac) os = null;
  else if (/Win/i.test(plat)) os = { id: 'windows', label: 'Windows' };
  else if (/Mac/i.test(plat)) os = { id: 'mac', label: 'Mac' };
  else if (/Linux/i.test(plat) || /Linux|X11/.test(ua)) os = { id: 'linux', label: 'Linux' };

  if (os) {
    document.querySelectorAll('.hero-cta[data-download-cta]').forEach((a) => {
      a.href = `/download/${os.id}`;
      a.innerHTML = `Download for ${os.label} <span aria-hidden="true">&darr;</span>`;
    });
    document.querySelectorAll('.nav-cta[data-download-cta]').forEach((a) => {
      a.href = `/download/${os.id}`;
      a.textContent = `Download for ${os.label}`;
    });
    document.querySelectorAll('[data-download-alt]').forEach((el) => {
      el.hidden = false;
    });
  }

  // ---- Copy button on code blocks ----------------------------------------
  document.querySelectorAll('[data-copy]').forEach((btn) => {
    const code = btn.parentElement.querySelector('code');
    if (!code || !navigator.clipboard) return;
    btn.hidden = false;
    btn.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(code.textContent);
        btn.textContent = 'Copied';
      } catch {
        btn.textContent = 'Select and copy';
      }
      setTimeout(() => (btn.textContent = 'Copy'), 1800);
    });
  });

  // ---- Long lists: first few, then "Show all" (phones only, via CSS) ------
  document.querySelectorAll('[data-expands]').forEach((btn) => {
    const list = document.getElementById(btn.dataset.expands);
    if (!list) return;
    list.classList.add('is-collapsed');
    btn.hidden = false;
    btn.addEventListener('click', () => {
      list.classList.remove('is-collapsed');
      btn.setAttribute('aria-expanded', 'true');
      btn.hidden = true;
    });
  });

  // ---- Pinned header: only the tab row stays ------------------------------
  // The header is position: sticky; a negative top equal to the brand row's
  // height lets the brand scroll away while the tabs (and the desktop
  // Download button) stay on screen.
  const nav = document.querySelector('.sitenav--oscode');
  const top = nav && nav.querySelector('.sitenav-top');
  if (nav && top) {
    const measure = () => {
      const row = nav.querySelector('.sitenav-row');
      const hide = row ? row.getBoundingClientRect().top - nav.getBoundingClientRect().top : 0;
      root.style.setProperty('--nav-hide', `${Math.max(0, Math.round(hide))}px`);
      root.style.setProperty('--nav-pinned', `${Math.round(nav.offsetHeight - hide)}px`);
    };
    measure();
    window.addEventListener('resize', measure, { passive: true });
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(measure);
  }

  // ---- Floating button waits until the hero is behind you -----------------
  const fab = document.querySelector('.consult-fab');
  const hero = document.querySelector('.masthead');
  if (fab && hero && 'IntersectionObserver' in window) {
    fab.classList.add('is-waiting');
    new IntersectionObserver(([e]) => {
      fab.classList.toggle('is-waiting', e.isIntersecting);
    }).observe(hero);
  }
})();
