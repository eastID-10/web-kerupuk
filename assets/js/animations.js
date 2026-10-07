(() => {
  'use strict';
  if (matchMedia('(prefers-reduced-motion: reduce)').matches || !window.gsap) return;
  gsap.registerPlugin(ScrollTrigger);

  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const fine = matchMedia('(pointer: fine)').matches;

  /* ---------- Smooth scroll (Lenis, same engine as Locomotive v5) ---------- */
  const lenis = new Lenis({ duration: 1.15, smoothWheel: true });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add(t => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);

  // Take over anchor links (capture phase beats the old scrollIntoView handler)
  document.addEventListener('click', e => {
    const a = e.target.closest('a[href^="#"]');
    const id = a && a.getAttribute('href');
    const target = id && id.length > 1 && $(id);
    if (!target) return;
    e.preventDefault(); e.stopPropagation();
    lenis.scrollTo(target, { offset: -70, duration: 1.4 });
  }, true);

  // Pause smooth scroll while modal / mobile menu lock the body
  new MutationObserver(() =>
    document.body.style.overflow === 'hidden' ? lenis.stop() : lenis.start()
  ).observe(document.body, { attributes: true, attributeFilter: ['style'] });
  $$('.product-modal, .navbar-nav').forEach(el => el.setAttribute('data-lenis-prevent', ''));

  /* ---------- Scroll progress bar ---------- */
  const bar = Object.assign(document.createElement('div'), { className: 'scroll-progress' });
  document.body.appendChild(bar);
  gsap.to(bar, { scaleX: 1, ease: 'none', scrollTrigger: { start: 0, end: 'max', scrub: 0.2 } });

  /* ---------- Lottie (procedurally generated, so no extra files needed) ---------- */
  const kf = frames => {
    const n = frames[0][1].length, fill = v => Array(n).fill(v);
    return frames.map((f, i) => i < frames.length - 1
      ? { t: f[0], s: f[1], e: frames[i + 1][1], i: { x: fill(.5), y: fill(1) }, o: { x: fill(.5), y: fill(0) } }
      : { t: f[0], s: f[1] });
  };
  const lottieData = ({ shape = 'star', color = [1, .65, .1], op = 60, scales, rot = 0, fade = null }) => ({
    v: '5.7.0', fr: 30, ip: 0, op, w: 100, h: 100, nm: 'gen', ddd: 0, assets: [],
    layers: [{
      ddd: 0, ind: 1, ty: 4, nm: 'l', sr: 1, ao: 0, ip: 0, op, st: 0, bm: 0,
      ks: {
        o: fade ? { a: 1, k: kf(fade) } : { a: 0, k: 100 },
        r: rot ? { a: 1, k: kf([[0, [0]], [op, [rot]]]) } : { a: 0, k: 0 },
        p: { a: 0, k: [50, 50, 0] }, a: { a: 0, k: [0, 0, 0] }, s: { a: 1, k: kf(scales) }
      },
      shapes: [{
        ty: 'gr', nm: 'g', it: [
          shape === 'star'
            ? { ty: 'sr', sy: 1, d: 1, pt: { a: 0, k: 4 }, p: { a: 0, k: [0, 0] }, r: { a: 0, k: 0 }, ir: { a: 0, k: 9 }, is: { a: 0, k: 0 }, or: { a: 0, k: 40 }, os: { a: 0, k: 0 } }
            : { ty: 'el', d: 1, s: { a: 0, k: [70, 70] }, p: { a: 0, k: [0, 0] } },
          shape === 'ring'
            ? { ty: 'st', c: { a: 0, k: [...color, 1] }, o: { a: 0, k: 100 }, w: { a: 0, k: 6 }, lc: 2, lj: 2 }
            : { ty: 'fl', c: { a: 0, k: [...color, 1] }, o: { a: 0, k: 100 }, r: 1 },
          { ty: 'tr', p: { a: 0, k: [0, 0] }, a: { a: 0, k: [0, 0] }, s: { a: 0, k: [100, 100] }, r: { a: 0, k: 0 }, o: { a: 0, k: 100 }, sk: { a: 0, k: 0 }, sa: { a: 0, k: 0 } }
        ]
      }]
    }]
  });

  const addLottie = (parent, opts, style = {}, loop = true) => {
    const el = document.createElement('div');
    el.className = 'lot';
    Object.assign(el.style, style);
    parent.appendChild(el);
    return lottie.loadAnimation({
      container: el, renderer: 'svg', loop, autoplay: loop,
      animationData: lottieData(opts)
    });
  };

  const twinkle = (c, delay = 0) => ({
    color: c, op: 80, rot: 180,
    scales: [[0, [0, 0, 100]], [40, [110, 110, 100]], [80, [0, 0, 100]]]
  });
  const burst = { color: [1, .8, .1], op: 45, rot: 120, scales: [[0, [0, 0, 100]], [20, [140, 140, 100]], [45, [0, 0, 100]]] };
  const pulse = { shape: 'ring', color: [1, .55, .1], op: 75, scales: [[0, [40, 40, 100]], [75, [150, 150, 100]]], fade: [[0, [80]], [75, [0]]] };

  if (window.lottie) {
    // Hero sparkles
    const hv = $('.hero-visual');
    if (hv) [
      { top: '6%', left: '8%', w: 56, c: [1, .8, .1] },
      { top: '14%', right: '6%', w: 40, c: [1, .45, .15] },
      { bottom: '16%', left: '2%', w: 44, c: [1, .6, .2] },
      { bottom: '6%', right: '14%', w: 60, c: [1, .85, .3] }
    ].forEach(({ w, c, ...pos }, i) => {
      const a = addLottie(hv, twinkle(c), { width: w + 'px', height: w + 'px', ...pos });
      setTimeout(() => a.play(), i * 500);
      a.stop();
    });

    // Pulsing ring behind feature icons
    $$('.feature-icon').forEach(ic => addLottie(ic, pulse, { inset: '-35%', width: '170%', height: '170%', zIndex: 0 }));

    // Sparkle burst on product card hover
    $$('.product-card').forEach(card => {
      const holder = $('.product-card-image', card);
      const a = addLottie(holder, burst, { top: '8px', right: '8px', width: '70px', height: '70px' }, false);
      card.addEventListener('mouseenter', () => a.goToAndPlay(0, true));
    });

    // Bring-your-own Lottie: <div data-lottie="path/to/anim.json" style="width:120px"></div>
    $$('[data-lottie]').forEach(el => lottie.loadAnimation({
      container: el, renderer: 'svg', loop: true, autoplay: true, path: el.dataset.lottie
    }));
  }

  /* ---------- Word-split helper ---------- */
  const splitWords = root => (function walk(node) {
    [...node.childNodes].forEach(n => {
      if (n.nodeType === 3) {
        const t = n.textContent;
        if (!t.trim()) return;
        const frag = document.createDocumentFragment();
        if (/^\s/.test(t)) frag.append(' ');
        t.trim().split(/\s+/).forEach((word, i, arr) => {
          const o = document.createElement('span'); o.className = 'w';
          const inner = document.createElement('span'); inner.className = 'wi'; inner.textContent = word;
          o.append(inner); frag.append(o);
          if (i < arr.length - 1) frag.append(' ');
        });
        if (/\s$/.test(t)) frag.append(' ');
        n.replaceWith(frag);
      } else if (n.nodeType === 1 && n.tagName !== 'BR') walk(n);
    });
  })(root);

  /* ---------- Hero intro ---------- */
  const title = $('.hero-title');
  if (title) splitWords(title);

  gsap.timeline({ defaults: { ease: 'power3.out', clearProps: 'transform,opacity' } })
    .from('.navbar', { yPercent: -100, opacity: 0, duration: .8 })
    .from('.hero-decorative-circle', { scale: 0, opacity: 0, duration: 1.1 }, .2)
    .from('.hero-product-wrapper', { scale: .6, rotate: -12, opacity: 0, duration: 1.3, ease: 'elastic.out(1,.6)' }, .3)
    .from('.hero-badge', { y: 20, opacity: 0, duration: .6 }, .5)
    .from('.hero-title .wi', { yPercent: 110, rotate: 4, duration: .9, stagger: .08 }, .6)
    .from('.hero-description', { y: 24, opacity: 0, duration: .7 }, '-=.5')
    .from('.hero-actions .btn', { y: 24, opacity: 0, stagger: .12, duration: .6 }, '-=.5')
    .from('.hero-stat', { y: 30, opacity: 0, stagger: .12, duration: .6 }, '-=.4')
    .from('.hero-floating-badge', { scale: 0, opacity: 0, stagger: .2, duration: .7, ease: 'back.out(2)' }, '-=.6');

  // Count-up stats
  $$('.hero-stat-number').forEach(el => {
    const node = el.firstChild, end = parseInt(node && node.textContent, 10);
    if (isNaN(end)) return;
    const o = { v: 0 }; node.textContent = '0';
    gsap.to(o, { v: end, duration: 2, delay: 1.3, ease: 'power2.out', onUpdate: () => (node.textContent = Math.round(o.v)) });
  });

  // Hero parallax
  gsap.to('.hero-visual', { yPercent: 12, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
  gsap.to('.hero-content', { yPercent: -8, opacity: .25, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'center top', end: 'bottom top', scrub: true } });

  /* ---------- Section titles ---------- */
  $$('.section-title').forEach(t => {
    splitWords(t);
    gsap.from($$('.wi', t), {
      yPercent: 110, duration: .9, stagger: .06, ease: 'power3.out', clearProps: 'transform',
      scrollTrigger: { trigger: t, start: 'top 88%' }
    });
  });

  /* ---------- Product cards: image parallax tilt ---------- */
  if (fine) $$('.product-card').forEach(card => {
    const img = $('.product-card-image img', card);
    if (!img) return;
    const xTo = gsap.quickTo(img, 'x', { duration: .5, ease: 'power3' });
    const yTo = gsap.quickTo(img, 'y', { duration: .5, ease: 'power3' });
    const rTo = gsap.quickTo(img, 'rotation', { duration: .6, ease: 'power3' });
    card.addEventListener('mouseenter', () => gsap.to(img, { scale: 1.1, duration: .5, ease: 'power3.out' }));
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - .5, py = (e.clientY - r.top) / r.height - .5;
      xTo(px * 18); yTo(py * 18); rTo(px * 6);
    });
    card.addEventListener('mouseleave', () => { xTo(0); yTo(0); rTo(0); gsap.to(img, { scale: 1, duration: .5 }); });
  });

  /* ---------- About, gallery, contact, footer ---------- */
  $$('.about-image-grid .img-wrapper').forEach((el, i) =>
    gsap.to(el, { yPercent: (i % 2 ? -1 : 1) * 8, ease: 'none', scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true } }));

  $$('.gallery-item').forEach((el, i) => {
    gsap.from(el, {
      clipPath: 'inset(100% 0% 0% 0%)', duration: 1.1, ease: 'power4.out', delay: (i % 4) * .1, clearProps: 'clipPath',
      scrollTrigger: { trigger: el, start: 'top 90%' }
    });
    const img = $('img', el);
    if (img) gsap.fromTo(img, { scale: 1.3 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true } });
  });

  gsap.fromTo('.contact-visual img', { scale: 1.15, rotate: 3 }, { scale: 1, rotate: 0, ease: 'none', scrollTrigger: { trigger: '.contact', start: 'top bottom', end: 'center center', scrub: true } });
  gsap.from('.contact-channel', { x: -30, opacity: 0, stagger: .12, duration: .7, ease: 'power3.out', clearProps: 'transform,opacity', scrollTrigger: { trigger: '.contact-channels', start: 'top 85%' } });
  gsap.from('.footer-grid > *', { y: 40, opacity: 0, stagger: .12, duration: .8, ease: 'power3.out', clearProps: 'transform,opacity', scrollTrigger: { trigger: '.footer', start: 'top 90%' } });

  /* ---------- Magnetic buttons ---------- */
  if (fine) $$('.btn').forEach(btn => {
    const xt = gsap.quickTo(btn, 'x', { duration: .4, ease: 'power3' });
    const yt = gsap.quickTo(btn, 'y', { duration: .4, ease: 'power3' });
    btn.addEventListener('mousemove', e => {
      const r = btn.getBoundingClientRect();
      xt((e.clientX - r.left - r.width / 2) * .25);
      yt((e.clientY - r.top - r.height / 2) * .35);
    });
    btn.addEventListener('mouseleave', () => { xt(0); yt(0); });
  });

  window.addEventListener('load', () => ScrollTrigger.refresh());
})();
