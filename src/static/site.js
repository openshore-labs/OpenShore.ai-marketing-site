// Small, dependency-free page behaviors shared by every page. Each one is a
// progressive enhancement: with this script blocked the page still works (the
// download buttons go to the platform tiles, every list item shows, the
// header pins whole).
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
})();

// ---- Launch film (home page) ----------------------------------------------
// Plays muted on arrival; browsers allow sound only after a tap, so a Sound on
// button carries the music. One button pauses, resumes, and replays at the
// end. With reduced motion asked for, it waits on its poster for a tap.
(() => {
  const section = document.querySelector('.film');
  const video = section && section.querySelector('[data-film]');
  const btn = section && section.querySelector('[data-film-toggle]');
  if (!video || !btn) return;
  const label = btn.querySelector('[data-film-label]');
  const icons = {
    pause: btn.querySelector('[data-icon="pause"]'),
    play: btn.querySelector('[data-icon="play"]'),
    replay: btn.querySelector('[data-icon="replay"]'),
  };
  const show = (state) => {
    const text = { pause: 'Pause', play: 'Play', replay: 'Replay' }[state];
    // SVG elements have no .hidden property, so toggle the attribute itself.
    Object.keys(icons).forEach((k) => { if (icons[k]) icons[k].toggleAttribute('hidden', k !== state); });
    if (label) label.textContent = text;
    btn.setAttribute('aria-label', `${text} film`);
    section.classList.toggle('is-ended', state === 'replay');
    section.classList.toggle('is-paused', state === 'play');
  };
  const play = () => {
    const p = video.play();
    if (p && p.catch) p.catch(() => show('play'));
  };
  video.addEventListener('play', () => show('pause'));
  video.addEventListener('pause', () => { if (!video.ended) show('play'); });
  video.addEventListener('ended', () => show('replay'));
  btn.addEventListener('click', () => {
    if (video.ended) { video.currentTime = 0; play(); }
    else if (video.paused) play();
    else video.pause();
  });
  const sound = section.querySelector('[data-film-sound]');
  if (sound) {
    const soundLabel = sound.querySelector('[data-film-sound-label]');
    const muted = sound.querySelector('[data-icon="muted"]');
    const loud = sound.querySelector('[data-icon="sound"]');
    const paint = () => {
      const on = !video.muted;
      if (muted) muted.toggleAttribute('hidden', on);
      if (loud) loud.toggleAttribute('hidden', !on);
      if (soundLabel) soundLabel.textContent = on ? 'Sound off' : 'Sound on';
      sound.setAttribute('aria-label', on ? 'Turn sound off' : 'Turn sound on');
      sound.setAttribute('aria-pressed', on ? 'true' : 'false');
    };
    sound.addEventListener('click', () => {
      video.muted = !video.muted;
      if (!video.muted && (video.paused || video.ended)) {
        if (video.ended) video.currentTime = 0;
        play();
      }
      paint();
    });
    video.addEventListener('volumechange', paint);
    paint();
  }
  const still = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (still) {
    // Waiting still, show the film's title card rather than its blank opening.
    if (video.dataset.titlePoster) video.poster = video.dataset.titlePoster;
    show('play');
  }
  else play();
})();
