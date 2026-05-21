/* ── Hero Halftone Wave ─────────────────────────────────────────────
   Animated dot-grid wave rendered to <canvas id="hero-fluid">.
   Canvas 2D. Each dot's size/alpha modulated by:
     wave(x, y, t)  ×  horizontal spotlight  ×  vertical falloff
   Mouse lifts a gaussian bump in the field for an interactive crest.
   ─────────────────────────────────────────────────────────────── */
(function () {
  'use strict';

  const config = {
    // Grid resolution
    GRID_X: 120,
    GRID_Y: 36,
    // Wave shape
    WAVE_AMP: 22,            // px vertical amplitude
    WAVE_FREQ_X: 0.12,
    WAVE_FREQ_Y: 0.085,
    SECONDARY_FREQ: 0.06,
    SPEED: 0.55,             // rad/s base
    // Wave band placement inside hero
    WAVE_CENTER_Y: 0.62,     // 0..1
    WAVE_HEIGHT: 0.55,       // 0..1
    // Dot appearance
    DOT_MIN_SIZE: 0.4,
    DOT_MAX_SIZE: 2.4,
    DOT_MIN_ALPHA: 0.05,
    DOT_MAX_ALPHA: 0.78,
    DOT_COLOR: '15, 23, 42', // dark slate ink
    // Edge falloff
    SPOTLIGHT_SHARP: 1.6,    // higher → tighter horizontal center
    VERTICAL_FALLOFF: 1.4,   // higher → harder top/bottom edges
    // Spine — slow-varying envelope that swells & shrinks the band along x,
    //         producing peaks (wide, tall) and troughs (narrow, low)
    SPINE_FREQ: 0.022,       // slow phase per column
    SPINE_SPEED: 0.18,       // how fast the spine pattern drifts
    BAND_WIDTH_MIN: 0.32,    // narrowest envelope (where spine is low)
    BAND_WIDTH_MAX: 1.25,    // widest envelope (where spine is high)
    SPINE_LIFT: 14,          // px the band rises at peaks
    SPINE_AMP_MOD: 0.7,      // 0..1 — how much wave amplitude grows at peaks
    // Mouse interaction
    MOUSE_RADIUS: 110,       // px
    MOUSE_LIFT: 32,          // px peak vertical lift at cursor
    MOUSE_LERP: 0.12,        // pointer smoothing
    // Click ripple — expanding ring that lifts dots as it passes
    RIPPLE_SPEED: 380,       // px/s outward propagation
    RIPPLE_AMP: 42,          // px peak vertical lift
    RIPPLE_WIDTH: 60,        // px width of the wave ring
    RIPPLE_LIFE: 1.6,        // seconds before fully decayed
  };

  const canvas = document.getElementById('hero-fluid');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  if (!ctx) { canvas.style.display = 'none'; return; }

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── Sizing ─────────────────────────────────────────────────── */
  let dpr = 1, W = 0, H = 0;
  function resize () {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = canvas.clientWidth;
    H = canvas.clientHeight;
    canvas.width  = Math.floor(W * dpr);
    canvas.height = Math.floor(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  resize();
  window.addEventListener('resize', resize);

  /* ── Mouse tracking ─────────────────────────────────────────── */
  let mx = -9999, my = -9999;   // raw
  let mxs = -9999, mys = -9999; // smoothed
  const target = canvas.parentElement || canvas;
  target.addEventListener('mousemove', e => {
    const r = canvas.getBoundingClientRect();
    mx = e.clientX - r.left;
    my = e.clientY - r.top;
    if (mxs < -1000) { mxs = mx; mys = my; }
  });
  target.addEventListener('mouseleave', () => { mx = -9999; });
  target.addEventListener('touchmove', e => {
    const r = canvas.getBoundingClientRect();
    mx = e.targetTouches[0].clientX - r.left;
    my = e.targetTouches[0].clientY - r.top;
    if (mxs < -1000) { mxs = mx; mys = my; }
  }, { passive: true });
  target.addEventListener('touchend', () => { mx = -9999; });

  /* ── Click ripples ──────────────────────────────────────────── */
  const ripples = [];
  function spawnRipple (clientX, clientY) {
    const r = canvas.getBoundingClientRect();
    const x = clientX - r.left;
    const y = clientY - r.top;
    if (x < 0 || y < 0 || x > r.width || y > r.height) return;
    ripples.push({ x, y, t0: performance.now() / 1000 });
    if (ripples.length > 8) ripples.shift(); // cap pool
  }
  target.addEventListener('click', e => spawnRipple(e.clientX, e.clientY));
  target.addEventListener('touchstart', e => {
    const t = e.targetTouches[0];
    if (t) spawnRipple(t.clientX, t.clientY);
  }, { passive: true });

  /* ── Draw buckets — batch by alpha quantization for perf ───── */
  const N_BUCKETS = 12;
  const cap = config.GRID_X * config.GRID_Y;
  const bucketCount = new Int32Array(N_BUCKETS);
  const bucketX = new Array(N_BUCKETS).fill(null).map(() => new Float32Array(cap));
  const bucketY = new Array(N_BUCKETS).fill(null).map(() => new Float32Array(cap));
  const bucketS = new Array(N_BUCKETS).fill(null).map(() => new Float32Array(cap));

  // Per-column spine cache: encodes the wave's silhouette envelope
  const spineWidth = new Float32Array(config.GRID_X);
  const spineLift  = new Float32Array(config.GRID_X);
  const spineAmp   = new Float32Array(config.GRID_X);

  function drawHalftone (t, nowSec) {
    ctx.clearRect(0, 0, W, H);
    for (let i = 0; i < N_BUCKETS; i++) bucketCount[i] = 0;

    const Gx = config.GRID_X, Gy = config.GRID_Y;
    const spacingX = W / (Gx - 1);
    const spacingY = (H * config.WAVE_HEIGHT) / (Gy - 1);
    const baseY = H * config.WAVE_CENTER_Y;
    const cx = W * 0.5;
    const mouseActive = mx > -1000;
    const mr2 = config.MOUSE_RADIUS * config.MOUSE_RADIUS;
    const aRange = config.DOT_MAX_ALPHA - config.DOT_MIN_ALPHA;
    const sRange = config.DOT_MAX_SIZE  - config.DOT_MIN_SIZE;

    // Prune expired ripples, precompute current ring state for live ones
    for (let i = ripples.length - 1; i >= 0; i--) {
      if (nowSec - ripples[i].t0 > config.RIPPLE_LIFE) ripples.splice(i, 1);
    }
    const rw2 = config.RIPPLE_WIDTH * config.RIPPLE_WIDTH;
    const NR = ripples.length;

    // Precompute spine per column — wide/narrow envelope along x
    const widthRange = config.BAND_WIDTH_MAX - config.BAND_WIDTH_MIN;
    for (let gx = 0; gx < Gx; gx++) {
      const sp = gx * config.SPINE_FREQ + t * config.SPINE_SPEED;
      // Layered sine produces hills of varying width (rather than a pure sine grid)
      const s = Math.sin(sp) * 0.6
              + Math.cos(sp * 1.7 + t * 0.12) * 0.32
              + Math.sin(sp * 0.55 - t * 0.08) * 0.22;
      // Normalize roughly to [0..1] (raw range is ~[-1.14..1.14])
      const sn = Math.max(0, Math.min(1, (s + 1.14) * 0.44));
      spineWidth[gx] = config.BAND_WIDTH_MIN + sn * widthRange;
      spineLift[gx]  = sn * config.SPINE_LIFT;
      spineAmp[gx]   = 1.0 + (sn - 0.5) * config.SPINE_AMP_MOD;
    }

    for (let gy = 0; gy < Gy; gy++) {
      const yNorm = gy / (Gy - 1);
      const dyc = Math.abs(yNorm - 0.5) * 2;
      const rowDriftX = Math.sin(gy * 0.15 + t * 0.4) * 5;
      const rowYOff = (gy - (Gy - 1) / 2) * spacingY;

      for (let gx = 0; gx < Gx; gx++) {
        // Spine modulation — this column's local envelope shape
        const sw = spineWidth[gx];
        const sl = spineLift[gx];
        const sa = spineAmp[gx];

        // Per-column variable band width: narrow trough, wide crest
        const verticalFade = Math.max(0, 1 - Math.pow(dyc / sw, config.VERTICAL_FALLOFF));
        if (verticalFade < 0.01) continue;

        const x = gx * spacingX + rowDriftX;
        const wx = gx * config.WAVE_FREQ_X;
        const wy = gy * config.WAVE_FREQ_Y;
        const wave = Math.sin(wx + t)             * Math.cos(wy * 0.9 + t * 0.6)
                   + Math.cos(wx * 0.7 + t * 0.8) * Math.sin(wy * 1.3 + t * 0.5) * 0.7
                   + Math.sin((wx + wy) * config.SECONDARY_FREQ + t * 0.4) * 0.4;

        let py = baseY + rowYOff - sl + wave * config.WAVE_AMP * sa;

        // Mouse bump — lifts dots toward cursor
        let mouseBump = 0;
        if (mouseActive) {
          const ddx = x   - mxs;
          const ddy = py  - mys;
          mouseBump = Math.exp(-(ddx*ddx + ddy*ddy) / mr2) * config.MOUSE_LIFT;
          py -= mouseBump;
        }

        // Click ripples — expanding rings that lift dots as they pass
        let rippleLift = 0;
        for (let ri = 0; ri < NR; ri++) {
          const rp = ripples[ri];
          const age = nowSec - rp.t0;
          const ringR = age * config.RIPPLE_SPEED;
          const decay = 1 - age / config.RIPPLE_LIFE;
          if (decay <= 0) continue;
          const ddx = x  - rp.x;
          const ddy = py - rp.y;
          const d = Math.sqrt(ddx * ddx + ddy * ddy);
          const dr = d - ringR;
          rippleLift += Math.exp(-dr * dr / rw2) * config.RIPPLE_AMP * decay * decay;
        }
        py -= rippleLift;

        // Spotlight (horizontal centerness)
        const dxs = (x - cx) / (W * 0.5);
        const spotlight = Math.exp(-dxs * dxs * config.SPOTLIGHT_SHARP);

        // Combined intensity — center × edges × wave crest boost
        let intensity = spotlight * verticalFade * (0.55 + Math.max(0, wave) * 0.35);
        if (mouseBump > 0.1)  intensity = Math.min(1, intensity + mouseBump  / config.MOUSE_LIFT  * 0.25);
        if (rippleLift > 0.1) intensity = Math.min(1, intensity + rippleLift / config.RIPPLE_AMP  * 0.45);
        if (intensity < 0.015) continue;

        const size  = config.DOT_MIN_SIZE  + intensity * sRange;
        const alpha = config.DOT_MIN_ALPHA + intensity * aRange;

        const b = Math.min(N_BUCKETS - 1, (alpha * N_BUCKETS) | 0);
        const i = bucketCount[b];
        bucketX[b][i] = x;
        bucketY[b][i] = py;
        bucketS[b][i] = size;
        bucketCount[b] = i + 1;
      }
    }

    // Flush each bucket: one fillStyle + one fill() per bucket
    const TAU = 6.283185307;
    for (let b = 0; b < N_BUCKETS; b++) {
      const n = bucketCount[b];
      if (n === 0) continue;
      const a = ((b + 0.5) / N_BUCKETS) * config.DOT_MAX_ALPHA;
      ctx.fillStyle = `rgba(${config.DOT_COLOR}, ${a.toFixed(3)})`;
      ctx.beginPath();
      const xs = bucketX[b], ys = bucketY[b], ss = bucketS[b];
      for (let k = 0; k < n; k++) {
        const s = ss[k];
        ctx.moveTo(xs[k] + s, ys[k]);
        ctx.arc(xs[k], ys[k], s, 0, TAU);
      }
      ctx.fill();
    }
  }

  /* ── Main loop ──────────────────────────────────────────────── */
  let running = true;
  document.addEventListener('visibilitychange', () => { running = !document.hidden; });

  if (reduced) {
    drawHalftone(0, performance.now() / 1000);
    return;
  }

  const start = performance.now();
  function frame (now) {
    if (running) {
      if (mx > -1000) {
        mxs += (mx - mxs) * config.MOUSE_LERP;
        mys += (my - mys) * config.MOUSE_LERP;
      }
      const t = (now - start) / 1000 * config.SPEED;
      drawHalftone(t, now / 1000);
    }
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
})();
