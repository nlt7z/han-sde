/*
 * Hero halftone ribbon.
 * Draws a flowing twisted ribbon as a halftone dot field on the hero canvas.
 * Dot density and size are modulated by:
 *   - distance from the ribbon centerline (denser at the spine)
 *   - "facing" angle (denser where the ribbon faces the viewer)
 *   - left/right edge falloff (so the ribbon enters and exits softly)
 *
 * The ribbon is static at rest. Moving the cursor over the hero pulls the
 * centerline toward the pointer with a localized gaussian bump; leaving
 * the hero eases it back. No autonomous waving.
 */
(function () {
  const canvas = document.getElementById('hero-fluid');
  if (!canvas) return;
  const hero = canvas.closest('.hero') || canvas.parentElement;
  const ctx = canvas.getContext('2d');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const DPR = Math.min(window.devicePixelRatio || 1, 2);

  let W = 0, H = 0;

  // Pointer-driven state.
  // target: where the pointer is (or rest values when not hovering).
  // view:   eased values actually used to draw.
  const target = { x: 0.5, y: 0.5, strength: 0 };
  const view   = { x: 0.5, y: 0.5, strength: 0 };
  let rafId = 0;
  let needsDraw = true;

  function resize() {
    const rect = canvas.getBoundingClientRect();
    W = Math.max(rect.width, 1);
    H = Math.max(rect.height, 1);
    canvas.width  = Math.floor(W * DPR);
    canvas.height = Math.floor(H * DPR);
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    needsDraw = true;
    schedule();
  }

  // Centerline at horizontal fraction t (0..1).
  // The base curve combines a few sines for the swoop/twist; the pointer adds
  // a localized gaussian pull centered at view.x, pulling toward view.y.
  function centerY(t) {
    const x = t * Math.PI * 2;
    const a = Math.sin(x * 1.05) * H * 0.18;
    const b = Math.sin(x * 0.55 + 1.3) * H * 0.12;
    const c = Math.sin(x * 1.70 + 0.4) * H * 0.05;
    const base = H * 0.55 + a + b + c;

    // Pointer pull
    const sigma = 0.18; // width of the pull, in t-units
    const d = (t - view.x) / sigma;
    const bump = Math.exp(-d * d);
    const pullY = (view.y - 0.5) * H * 0.55 * view.strength * bump;
    return base + pullY;
  }
  function thicknessAt(t) {
    const x = t * Math.PI * 2;
    return H * 0.22 + Math.sin(x * 1.3 + 0.8) * H * 0.07;
  }
  function slope(t) {
    const e = 0.002;
    return (centerY(t + e) - centerY(t - e)) / (2 * e * W);
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);

    const inkR = 20, inkG = 16, inkB = 8;

    const step = W < 720 ? 7 : 8;
    const jitter = 1.2;

    const cols = Math.ceil(W / step) + 2;
    const rows = Math.ceil(H / step) + 2;

    for (let i = 0; i < cols; i++) {
      const sx = i * step;
      const t  = sx / W;
      const cy = centerY(t);
      const th = thicknessAt(t);
      const sl = slope(t);

      const edgeFade = Math.pow(Math.sin(Math.max(0, Math.min(1, t)) * Math.PI), 0.6);
      const facing = 1 / (1 + Math.abs(sl) * 1.4);

      for (let j = 0; j < rows; j++) {
        const sy = j * step;
        const dy = sy - cy;
        const norm = dy / th;
        const absN = Math.abs(norm);
        if (absN > 1.05) continue;

        const side = (norm + 1) * 0.5;
        const crossDensity = (1 - absN) * (0.35 + side * 0.95);

        const density = crossDensity * facing * edgeFade;
        if (density <= 0.02) continue;
        if (Math.random() > density * 0.92) continue;

        const r = 0.55 + density * 2.6 + Math.random() * 0.4;
        const jx = (Math.random() - 0.5) * jitter;
        const jy = (Math.random() - 0.5) * jitter;
        const alpha = Math.min(0.92, 0.32 + density * 0.85);

        ctx.fillStyle = `rgba(${inkR},${inkG},${inkB},${alpha.toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(sx + jx, sy + jy, r, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }

  // Ease view toward target each frame. Stop when settled.
  function loop() {
    const k = reduced ? 1 : 0.16; // ease factor per frame (reduced-motion snaps)
    let moving = false;
    for (const key of ['x', 'y', 'strength']) {
      const dv = target[key] - view[key];
      if (Math.abs(dv) > 0.0008) {
        view[key] += dv * k;
        moving = true;
      } else {
        view[key] = target[key];
      }
    }

    if (moving || needsDraw) {
      draw();
      needsDraw = false;
      rafId = requestAnimationFrame(loop);
    } else {
      rafId = 0;
    }
  }
  function schedule() {
    if (!rafId) rafId = requestAnimationFrame(loop);
  }

  // Pointer handlers — attached to the hero so the hit area matches the visual.
  if (hero) {
    hero.addEventListener('pointermove', (e) => {
      const rect = hero.getBoundingClientRect();
      target.x = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
      target.y = Math.min(1, Math.max(0, (e.clientY - rect.top)  / rect.height));
      target.strength = 1;
      schedule();
    });
    hero.addEventListener('pointerleave', () => {
      target.strength = 0;
      target.x = 0.5;
      target.y = 0.5;
      schedule();
    });
  }

  window.addEventListener('resize', () => {
    clearTimeout(resize._t);
    resize._t = setTimeout(resize, 120);
  });

  resize();
})();
