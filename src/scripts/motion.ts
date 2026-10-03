// All page behaviour. Re-initialised after every (view-transition) navigation.
const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = () => window.matchMedia('(hover: hover) and (pointer: fine)').matches;

let teardown: AbortController | null = null;

function init() {
  teardown?.abort();
  teardown = new AbortController();
  const { signal } = teardown;
  const root = document.documentElement;
  root.classList.add('js');

  // Entrance animation for the first screen.
  requestAnimationFrame(() => requestAnimationFrame(() => document.body.classList.add('is-loaded')));

  // --- scroll reveals -----------------------------------------------------
  const revealTargets = document.querySelectorAll<HTMLElement>('[data-reveal], .lines[data-inview]');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add('is-in');
          io.unobserve(entry.target);
        }
      },
      { rootMargin: '0px 0px -12% 0px', threshold: 0.08 },
    );
    revealTargets.forEach((el) => io.observe(el));
    signal.addEventListener('abort', () => io.disconnect());
  } else {
    revealTargets.forEach((el) => el.classList.add('is-in'));
  }

  // --- scroll-linked values (one rAF-throttled listener) ------------------
  const header = document.querySelector<HTMLElement>('[data-header]');
  const progress = document.querySelector<HTMLElement>('[data-progress]');
  const fills = [...document.querySelectorAll<HTMLElement>('[data-fill]')];
  const parallax = reduced() ? [] : [...document.querySelectorAll<HTMLElement>('[data-parallax]')];
  let ticking = false;

  const update = () => {
    ticking = false;
    const y = window.scrollY;
    const vh = window.innerHeight;
    header?.classList.toggle('is-scrolled', y > 24);

    if (progress) {
      const max = document.documentElement.scrollHeight - vh;
      progress.style.setProperty('--p', max > 0 ? Math.min(1, y / max).toFixed(4) : '0');
    }
    // how far the viewport's 60% line has travelled through each element
    for (const el of fills) {
      const r = el.getBoundingClientRect();
      const p = (vh * 0.6 - r.top) / r.height;
      el.style.setProperty('--fill', Math.max(0, Math.min(1, p)).toFixed(4));
    }
    for (const el of parallax) {
      const r = el.getBoundingClientRect();
      const offset = (r.top + r.height / 2 - vh / 2) / vh; // -1 … 1
      const strength = Number(el.dataset.parallax) || 20;
      el.style.setProperty('--py', `${(-offset * strength).toFixed(1)}px`);
    }
  };
  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(update);
  };
  window.addEventListener('scroll', onScroll, { passive: true, signal });
  window.addEventListener('resize', onScroll, { passive: true, signal });
  update();

  // --- scroll-spy for section links and the chapter rail ------------------
  const spyLinks = [...document.querySelectorAll<HTMLAnchorElement>('[data-spy]')];
  const spied = spyLinks
    .map((link) => document.getElementById(link.dataset.spy!))
    .filter((el): el is HTMLElement => !!el);
  if (spied.length && 'IntersectionObserver' in window) {
    const spy = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          for (const link of spyLinks) {
            if (link.getAttribute('aria-current') === 'page') continue;
            if (link.dataset.spy === entry.target.id) link.setAttribute('aria-current', 'true');
            else link.removeAttribute('aria-current');
          }
        }
      },
      { rootMargin: '-45% 0px -50% 0px' },
    );
    spied.forEach((el) => spy.observe(el));
    signal.addEventListener('abort', () => spy.disconnect());
  }

  // --- mobile menu --------------------------------------------------------
  const menuBtn = document.querySelector<HTMLButtonElement>('[data-menu-btn]');
  const nav = document.querySelector<HTMLElement>('[data-nav]');
  if (menuBtn && nav) {
    const setOpen = (open: boolean) => {
      nav.classList.toggle('is-open', open);
      menuBtn.setAttribute('aria-expanded', String(open));
      menuBtn.setAttribute('aria-label', (open ? menuBtn.dataset.labelClose : menuBtn.dataset.labelOpen) ?? '');
    };
    menuBtn.addEventListener('click', () => setOpen(menuBtn.getAttribute('aria-expanded') !== 'true'), { signal });
    nav.addEventListener('click', (e) => (e.target as HTMLElement).closest('a') && setOpen(false), { signal });
    document.addEventListener(
      'keydown',
      (e) => {
        if (e.key !== 'Escape' || menuBtn.getAttribute('aria-expanded') !== 'true') return;
        setOpen(false);
        menuBtn.focus();
      },
      { signal },
    );
    document.addEventListener(
      'click',
      (e) => !(e.target as HTMLElement).closest('[data-header]') && setOpen(false),
      { signal },
    );
  }

  // --- pointer tilt on feature cards (desktop only) -----------------------
  if (finePointer() && !reduced()) {
    document.querySelectorAll<HTMLElement>('[data-tilt]').forEach((el) => {
      const max = Number(el.dataset.tilt) || 4;
      el.addEventListener(
        'pointermove',
        (e) => {
          const r = el.getBoundingClientRect();
          const x = (e.clientX - r.left) / r.width - 0.5;
          const y = (e.clientY - r.top) / r.height - 0.5;
          el.style.setProperty('--rx', `${(-y * max).toFixed(2)}deg`);
          el.style.setProperty('--ry', `${(x * max).toFixed(2)}deg`);
          el.style.setProperty('--mx', `${((x + 0.5) * 100).toFixed(1)}%`);
          el.style.setProperty('--my', `${((y + 0.5) * 100).toFixed(1)}%`);
        },
        { signal },
      );
      el.addEventListener(
        'pointerleave',
        () => {
          el.style.setProperty('--rx', '0deg');
          el.style.setProperty('--ry', '0deg');
        },
        { signal },
      );
    });
  }

  // --- drag to scroll the screen gallery (mouse only; touch scrolls natively)
  document.querySelectorAll<HTMLElement>('[data-drag-scroll]').forEach((el) => {
    let startX = 0;
    let startLeft = 0;
    let dragging = false;
    let moved = false;
    el.addEventListener(
      'pointerdown',
      (e) => {
        if (e.pointerType !== 'mouse' || e.button !== 0) return;
        dragging = true;
        moved = false;
        startX = e.clientX;
        startLeft = el.scrollLeft;
      },
      { signal },
    );
    window.addEventListener(
      'pointermove',
      (e) => {
        if (!dragging) return;
        const dx = e.clientX - startX;
        if (!moved && Math.abs(dx) < 6) return; // threshold avoids accidental drags
        moved = true;
        el.classList.add('is-dragging');
        el.scrollLeft = startLeft - dx;
      },
      { signal },
    );
    window.addEventListener(
      'pointerup',
      () => {
        dragging = false;
        el.classList.remove('is-dragging');
      },
      { signal },
    );
  });
}

document.addEventListener('astro:page-load', init);
// The swapped-in <html> loses runtime classes; restore before first paint.
document.addEventListener('astro:after-swap', () => document.documentElement.classList.add('js'));
