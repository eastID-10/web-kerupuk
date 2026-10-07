/* Mobile menu v2: hamburger + panel otomatis dari `nav .links`. Tidak perlu ubah HTML. */
(() => {
  const nav = document.querySelector('nav');
  const links = nav && nav.querySelector('.links');
  if (!nav || !links) return;

  const html = document.documentElement;
  const wrap = nav.querySelector('.wrap') || nav;

  /* Hamburger */
  const burger = document.createElement('button');
  burger.type = 'button';
  burger.className = 'burger';
  burger.setAttribute('aria-label', 'Buka menu');
  burger.setAttribute('aria-expanded', 'false');
  burger.setAttribute('aria-controls', 'm-menu');
  burger.innerHTML = '<span></span><span></span><span></span>';

  /* Overlay + panel */
  const overlay = document.createElement('div');
  overlay.className = 'm-overlay';
  const menu = document.createElement('div');
  menu.className = 'm-menu';
  menu.id = 'm-menu';
  // Biar Lenis (smooth scroll) tidak ikut menggulung halaman saat menu terbuka
  overlay.setAttribute('data-lenis-prevent', '');
  menu.setAttribute('data-lenis-prevent', '');

  const strip = el => { el.removeAttribute('id'); return el; };
  links.querySelectorAll('a').forEach(a => menu.appendChild(strip(a.cloneNode(true))));

  const cta = nav.querySelector('.btn');
  if (cta) {
    const c = strip(cta.cloneNode(true));
    cta.classList.add('nav-cta');
    c.classList.remove('nav-cta');
    c.classList.add('block');
    menu.appendChild(c);
  }

  wrap.appendChild(burger);
  document.body.append(overlay, menu);

  /* Buka / tutup (kunci scroll lewat class di <html>, bukan <body>) */
  const isOpen = () => html.classList.contains('m-open');
  const setOpen = open => {
    if (open) menu.style.setProperty('--m-top', Math.max(nav.getBoundingClientRect().bottom, 0) + 'px');
    html.classList.toggle('m-open', open);
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Tutup menu' : 'Buka menu');
  };

  burger.addEventListener('click', () => setOpen(!isOpen()));
  overlay.addEventListener('click', () => setOpen(false));

  // Capture di document: tetap jalan walau skrip lain memanggil stopPropagation() pada klik anchor
  document.addEventListener('click', e => {
    if (isOpen() && e.target.closest('.m-menu a')) setOpen(false);
  }, true);

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && isOpen()) { setOpen(false); burger.focus(); }
  });
  matchMedia('(min-width: 901px)').addEventListener('change', e => { if (e.matches) setOpen(false); });

  /* Highlight menu aktif saat scroll */
  const all = [...links.querySelectorAll('a'), ...menu.querySelectorAll('a:not(.btn)')];
  const ids = [...new Set(all.map(a => a.getAttribute('href')).filter(h => h && h.length > 1 && h[0] === '#'))];
  const io = new IntersectionObserver(entries => entries.forEach(e => {
    if (e.isIntersecting) all.forEach(a => a.classList.toggle('on', a.getAttribute('href') === '#' + e.target.id));
  }), { rootMargin: '-45% 0px -50% 0px' });
  ids.map(h => document.querySelector(h)).filter(Boolean).forEach(s => io.observe(s));
})();