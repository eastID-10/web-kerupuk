/* animations.js - GSAP + ScrollTrigger + Lenis + Lottie, disesuaikan dengan class halaman ini.
   Catatan: gambar hero & .rings digerakkan oleh hero-scroll.js, jadi GSAP TIDAK memberi transform ke keduanya. */
(() => {
  'use strict';
  if (!window.gsap || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  // Tunggu DOM siap: kartu produk dirender oleh script inline setelah file ini dimuat
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();

  function init() {
    gsap.registerPlugin(ScrollTrigger);
    const $ = (s, c = document) => c.querySelector(s);
    const $$ = (s, c = document) => [...c.querySelectorAll(s)];
    const fine = matchMedia('(pointer: fine)').matches;
    const nav = $('nav');

    /* ---------- Smooth scroll (Lenis) ---------- */
    if (window.Lenis) {
      const lenis = new Lenis({ duration: 1.15, smoothWheel: true });
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add(t => lenis.raf(t * 1000));
      gsap.ticker.lagSmoothing(0);

      document.addEventListener('click', e => {
        const a = e.target.closest('a[href^="#"]');
        const id = a && a.getAttribute('href');
        const target = id && id.length > 1 && $(id);
        if (!target) return;
        e.preventDefault(); e.stopPropagation();
        lenis.scrollTo(target, { offset: -(nav ? nav.offsetHeight : 0), duration: 1.4 });
      }, true);
    }

    /* ---------- Progress bar ---------- */
    const bar = Object.assign(document.createElement('div'), { className: 'scroll-progress' });
    document.body.appendChild(bar);
    gsap.to(bar, { scaleX: 1, ease: 'none', scrollTrigger: { start: 0, end: 'max', scrub: 0.2 } });

    /* ---------- Lottie (dibuat lewat kode, tanpa file JSON) ---------- */
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
      return lottie.loadAnimation({ container: el, renderer: 'svg', loop, autoplay: loop, animationData: lottieData(opts) });
    };
    const twinkle = c => ({ color: c, op: 80, rot: 180, scales: [[0, [0, 0, 100]], [40, [110, 110, 100]], [80, [0, 0, 100]]] });
    const burst = { color: [1, .8, .1], op: 45, rot: 120, scales: [[0, [0, 0, 100]], [20, [140, 140, 100]], [45, [0, 0, 100]]] };
    const pulse = { shape: 'ring', color: [.99, .76, .18], op: 75, scales: [[0, [84, 84, 100]], [75, [150, 150, 100]]], fade: [[0, [85]], [75, [0]]] };

    if (window.lottie) {
      const sparkles = (parent, list) => parent && list.forEach(({ w, c, ...pos }, i) => {
        const a = addLottie(parent, twinkle(c), { width: w + 'px', height: w + 'px', ...pos });
        a.goToAndStop(0, true);
        setTimeout(() => a.play(), i * 500);
      });
      sparkles($('.hero .visual'), [
        { top: '8%', left: '10%', w: 56, c: [1, .75, .1] },
        { top: '16%', right: '6%', w: 40, c: [1, .45, .15] },
        { bottom: '20%', left: '4%', w: 44, c: [1, .6, .2] },
        { bottom: '8%', right: '12%', w: 60, c: [1, .85, .3] }
      ]);
      sparkles($('.cta-band .wrap'), [
        { top: '-4%', left: '6%', w: 52, c: [1, .76, .18] },
        { bottom: '4%', right: '8%', w: 64, c: [1, .6, .75] }
      ]);
      $$('.why .ico').forEach(ic => addLottie(ic, pulse, { left: '-35%', top: '-35%', width: '170%', height: '170%' }));
      $$('.card').forEach(card => {
        const stage = $('.stage', card);
        if (!stage) return;
        const a = addLottie(stage, burst, { top: '8px', right: '8px', width: '70px', height: '70px' }, false);
        card.addEventListener('mouseenter', () => a.goToAndPlay(0, true));
      });
      $$('[data-lottie]').forEach(el => lottie.loadAnimation({ container: el, renderer: 'svg', loop: true, autoplay: true, path: el.dataset.lottie }));
    }

    /* ---------- Helpers ---------- */
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

    const CLEAR = 'transform,opacity';
    const group = (sel, from, extra = {}) => {
      const els = $$(sel);
      if (!els.length) return;
      gsap.from(els, {
        ...from, stagger: .12, duration: .8, ease: 'power3.out', clearProps: CLEAR,
        scrollTrigger: { trigger: els[0], start: 'top 88%' }, ...extra
      });
    };

    /* ---------- Hero intro (gambar & rings dibiarkan untuk hero-scroll.js) ---------- */
    const h1 = $('.hero h1');
    if (h1) splitWords(h1);
    gsap.timeline({ defaults: { ease: 'power3.out', clearProps: CLEAR } })
      .from($$('nav'), { yPercent: -100, duration: .7 })
      .from($$('.hero .visual'), { scale: .85, opacity: 0, duration: 1.1 }, .1)
      .from($$('.hero h1 .wi'), { yPercent: 110, rotate: 4, duration: .9, stagger: .08 }, .3)
      .from($$('.hero p'), { y: 24, opacity: 0, duration: .7 }, '-=.4')
      .from($$('.hero .cta .btn'), { y: 24, opacity: 0, stagger: .12, duration: .6 }, '-=.4');

    const heroText = $('.hero .wrap > div:first-child');
    if (heroText) gsap.to(heroText, { yPercent: -8, opacity: .25, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'center top', end: 'bottom top', scrub: true } });

    /* ---------- Judul section ---------- */
    $$('.why h2, .mood h2, .prod .head h2, .testi h2, .cta-band h2').forEach(t => {
      splitWords(t);
      gsap.from($$('.wi', t), {
        yPercent: 110, duration: .9, stagger: .06, ease: 'power3.out', clearProps: 'transform',
        scrollTrigger: { trigger: t, start: 'top 88%' }
      });
    });
    $$('.mood .sub, .prod .head p, .cta-band p').forEach(el =>
      gsap.from(el, { y: 30, opacity: 0, duration: .8, ease: 'power3.out', clearProps: CLEAR, scrollTrigger: { trigger: el, start: 'top 90%' } }));

    /* ---------- Kenapa memilih ---------- */
    group('.why .item', { y: 50, opacity: 0 });
    group('.why .ico', { scale: 0 }, { ease: 'back.out(2)', stagger: .15, clearProps: 'transform' });

    /* ---------- Section "mood" ---------- */
    const photo = $('.mood .photo');
    if (photo) {
      gsap.from(photo, { scale: .7, opacity: 0, rotate: -8, duration: 1.1, ease: 'power3.out', clearProps: CLEAR, scrollTrigger: { trigger: photo, start: 'top 85%' } });
      const pimg = $('img', photo);
      if (pimg) gsap.fromTo(pimg, { scale: 1.3 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: photo, start: 'top bottom', end: 'bottom top', scrub: true } });
    }
    group('.mood li', { x: -30, opacity: 0 }, { stagger: .1 });
    group('.mood .btn', { y: 20, opacity: 0 });
    const flt = $('.mood .float');
    if (flt) gsap.fromTo(flt, { yPercent: 30 }, { yPercent: -30, ease: 'none', scrollTrigger: { trigger: '.mood', start: 'top bottom', end: 'bottom top', scrub: true } });

    /* ---------- Kartu produk ---------- */
    $$('.card').forEach((card, i) => {
      const tl = gsap.timeline({ delay: (i % 3) * .1, defaults: { ease: 'power3.out' }, scrollTrigger: { trigger: card, start: 'top 88%' } });
      tl.from(card, { y: 60, opacity: 0, duration: .8, clearProps: CLEAR })
        .from($$('.arc', card), { scaleY: 0, transformOrigin: '50% 100%', duration: .9, clearProps: 'transform' }, .1)
        .from($$('.stage img', card), { y: 80, rotate: -8, opacity: 0, duration: 1, ease: 'back.out(1.6)', clearProps: CLEAR }, .2);

      const img = $('.stage img', card);
      if (fine && img) {
        card.addEventListener('mousemove', e => {
          const r = card.getBoundingClientRect();
          const px = (e.clientX - r.left) / r.width - .5, py = (e.clientY - r.top) / r.height - .5;
          gsap.to(img, { x: px * 16, y: py * 12, rotation: px * 6, scale: 1.05, duration: .5, ease: 'power3.out', overwrite: 'auto' });
        });
        card.addEventListener('mouseleave', () =>
          gsap.to(img, { x: 0, y: 0, rotation: 0, scale: 1, duration: .6, ease: 'power3.out', overwrite: 'auto' }));
      }
    });

    /* ---------- Testimoni, CTA, footer ---------- */
    group('.tcard', { y: 60, opacity: 0, scale: .94 }, { stagger: .15 });
    group('.cta-band .btn', { y: 30, opacity: 0 });
    group('footer .cols > div', { y: 40, opacity: 0 });
    group('footer .soc a', { scale: 0, opacity: 0 }, { ease: 'back.out(2)', stagger: .08 });
    group('footer .copy', { opacity: 0 });

    /* ---------- Tombol magnetik (properti `translate`, bukan transform) ---------- */
    if (fine) $$('.btn').forEach(btn => {
      btn.addEventListener('mousemove', e => {
        const r = btn.getBoundingClientRect();
        btn.style.translate = `${(e.clientX - r.left - r.width / 2) * .22}px ${(e.clientY - r.top - r.height / 2) * .3}px`;
      });
      btn.addEventListener('mouseleave', () => { btn.style.translate = ''; });
    });

    window.addEventListener('load', () => ScrollTrigger.refresh());
  }
})();