/* Hero product follows the scroll (up or down), with a velocity tilt.
   No dependencies. Targets: .hero, .hero .visual img, .hero .rings */
(() => {
  const hero  = document.querySelector('.hero');
  const img   = document.querySelector('.hero .visual img');
  const rings = document.querySelector('.hero .rings');
  if (!hero || !img || matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const clamp = (v, a, b) => Math.min(Math.max(v, a), b);
  const lerp  = (a, b, t) => a + (b - a) * t;

  const MOVE  = 110;  // px the bag travels down while the hero scrolls away
  const TURN  = -7;   // deg of rotation across the hero
  const GROW  = 0.08; // extra scale across the hero
  const TILT  = 0.35; // how strongly scroll speed tilts the bag

  let p = 0, target = 0;      // scroll progress through hero (0..1)
  let vel = 0, lastY = scrollY;
  let running = false, visible = true;

  const frame = () => {
    const y = scrollY;
    const r = hero.getBoundingClientRect();
    target = clamp(-r.top / r.height, 0, 1);

    p   = lerp(p, target, 0.12);                  // smooth follow
    vel = lerp(vel, y - lastY, 0.12);             // smoothed scroll speed (+down / -up)
    lastY = y;

    const tilt = clamp(vel * TILT, -10, 10);

    // Individual transform properties, so they never overwrite your existing CSS transforms
    img.style.translate = `0 ${p * MOVE}px`;
    img.style.rotate    = `${p * TURN + tilt}deg`;
    img.style.scale     = 1 + p * GROW;

    if (rings) {
      rings.style.rotate = `${p * 90}deg`;        // rings spin as you scroll
      rings.style.scale  = 1 + p * 0.15;
    }

    const settled = Math.abs(p - target) < 0.0005 && Math.abs(vel) < 0.05;
    if (settled || !visible) { running = false; return; }
    requestAnimationFrame(frame);
  };

  const wake = () => { if (!running && visible) { running = true; requestAnimationFrame(frame); } };

  new IntersectionObserver(([e]) => { visible = e.isIntersecting; wake(); }, { threshold: 0 }).observe(hero);
  addEventListener('scroll', wake, { passive: true });
  addEventListener('resize', wake);
  wake();
})();