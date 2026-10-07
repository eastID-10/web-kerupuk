/* Mobile menu: otomatis membuat hamburger + panel dari `nav .links` yang sudah ada.
   Tidak perlu mengubah HTML. */
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

  /* Panel + overlay */
  const overlay = document.createElement('div');
  overlay.className = 'm-overlay';

  const menu = document.createElement('div');
  menu.className = 'm-menu';
  menu.id = 'm-menu';

  const strip = el => { el.removeAttribute('id'); return el; }; // hindari id ganda
  links.querySelectorAll('a').forEach(a => menu.appendChild(strip(a.cloneNode(true))));

  const cta = nav.querySelector('.btn');
  if (cta) {
    const c = strip(cta.cloneNode(true));
    cta.classList.add('nav-cta');           // disembunyikan di layar kecil
    c.classList.add('block');
    menu.appendChild(c);
  }

  wrap.appendChild(burger);
  document.body.append(overlay, menu);

  /* Buka / tutup */
  const setOpen = open => {
    menu.style.top = nav.getBoundingClientRect().bottom + 'px';
    html.classList.toggle('m-open', open);
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Tutup menu' : 'Buka menu');
    document.body.style.overflow = open ? 'hidden' : '';
  };
  const isOpen = () => html.classList.contains('m-open');

  burger.addEventListener('click', () => setOpen(!isOpen()));
  overlay.addEventListener('click', () => setOpen(false));
  menu.addEventListener('click', e => { if (e.target.closest('a')) setOpen(false); });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && isOpen()) { setOpen(false); burger.focus(); }
  });
  matchMedia('(min-width: 901px)').addEventListener('change', e => { if (e.matches) setOpen(false); });

  /* Highlight menu aktif saat scroll (desktop + mobile) */
  const all = [...links.querySelectorAll('a'), ...menu.querySelectorAll('a:not(.btn)')];
  const ids = [...new Set(all.map(a => a.getAttribute('href')).filter(h => h && h.length > 1 && h[0] === '#'))];
  const io = new IntersectionObserver(entries => entries.forEach(e => {
    if (e.isIntersecting) all.forEach(a => a.classList.toggle('on', a.getAttribute('href') === '#' + e.target.id));
  }), { rootMargin: '-45% 0px -50% 0px' });
  ids.map(h => document.querySelector(h)).filter(Boolean).forEach(s => io.observe(s));
})();