/**
 * Globe Web Worker — all canvas drawing runs off the main thread.
 * Receives: OffscreenCanvas + pre-processed geo data via postMessage.
 * Sends: nothing (draws directly to the transferred canvas).
 */

/* ── State ─────────────────────────────────────────────────────────── */
let canvas, ctx;
let W, H, CX, CY, RADIUS;

let rotLng = 0;
let rotLat = -20;
let autoRotate = true;
let paused = false;
let lastFrameTime = 0;
let rafId;

// Geo data (sent from main thread)
let landRings = [];   // Array of Float32Array [lng,lat, lng,lat, ...]
let holeRings = [];   // Array of Float32Array (polygon holes)
let dots = null;      // Float32Array [lng,lat, lng,lat, ...]
let ports = [];       // Array of [lng, lat]
let routes = [];      // Array of {from:[lng,lat], to:[lng,lat]}

// Particles
let particlePhases = [];
let particleSpeeds  = [];
const TRAIL_LEN = 3;
const TRAIL_GAP = 0.025;

// Drag
let dragging      = false;
let dragStart     = { x: 0, y: 0 };
let rotAtDrag     = [0, -20];

/* ── Projection ────────────────────────────────────────────────────── */
function project(lng, lat) {
  const λ  = (lng - rotLng) * Math.PI / 180;
  const φ  = lat * Math.PI / 180;
  const φ0 = rotLat * Math.PI / 180;

  const cosφ  = Math.cos(φ),  sinφ  = Math.sin(φ);
  const cosφ0 = Math.cos(φ0), sinφ0 = Math.sin(φ0);
  const cosλ  = Math.cos(λ);

  // Dot product — negative means point is behind the globe
  const dot = sinφ0 * sinφ + cosφ0 * cosφ * cosλ;
  if (dot < 0) return null;

  const x = CX + RADIUS * cosφ * Math.sin(λ);
  const y = CY - RADIUS * (cosφ0 * sinφ - sinφ0 * cosφ * cosλ);
  return [x, y];
}

/* ── Great-circle interpolation (slerp) ────────────────────────────── */
function slerp(from, to, t) {
  const φ1 = from[1] * Math.PI / 180, φ2 = to[1] * Math.PI / 180;
  const λ1 = from[0] * Math.PI / 180, λ2 = to[0] * Math.PI / 180;

  const dot = Math.max(-1, Math.min(1,
    Math.sin(φ1) * Math.sin(φ2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.cos(λ2 - λ1)
  ));
  const Δσ = Math.acos(dot);
  if (Δσ < 1e-6) return from;

  const sinΔσ = Math.sin(Δσ);
  const A = Math.sin((1 - t) * Δσ) / sinΔσ;
  const B = Math.sin(t * Δσ) / sinΔσ;

  const x = A * Math.cos(φ1) * Math.cos(λ1) + B * Math.cos(φ2) * Math.cos(λ2);
  const y = A * Math.cos(φ1) * Math.sin(λ1) + B * Math.cos(φ2) * Math.sin(λ2);
  const z = A * Math.sin(φ1)                 + B * Math.sin(φ2);

  return [
    Math.atan2(y, x) * 180 / Math.PI,
    Math.atan2(z, Math.sqrt(x * x + y * y)) * 180 / Math.PI,
  ];
}

/* ── Draw helpers ──────────────────────────────────────────────────── */
function traceRings(rings) {
  for (let r = 0; r < rings.length; r++) {
    const ring = rings[r];
    let started = false;
    for (let i = 0; i < ring.length; i += 2) {
      const pt = project(ring[i], ring[i + 1]);
      if (!pt) { if (started) { ctx.closePath(); started = false; } continue; }
      if (!started) { ctx.moveTo(pt[0], pt[1]); started = true; }
      else ctx.lineTo(pt[0], pt[1]);
    }
    if (started) ctx.closePath();
  }
}

function drawGraticule() {
  ctx.beginPath();
  // Meridians every 30°
  for (let lng = -180; lng <= 180; lng += 30) {
    let started = false;
    for (let lat = -90; lat <= 90; lat += 3) {
      const pt = project(lng, lat);
      if (!pt) { started = false; continue; }
      if (!started) { ctx.moveTo(pt[0], pt[1]); started = true; }
      else ctx.lineTo(pt[0], pt[1]);
    }
  }
  // Parallels every 30°
  for (let lat = -60; lat <= 60; lat += 30) {
    let started = false;
    for (let lng = -180; lng <= 180; lng += 3) {
      const pt = project(lng, lat);
      if (!pt) { started = false; continue; }
      if (!started) { ctx.moveTo(pt[0], pt[1]); started = true; }
      else ctx.lineTo(pt[0], pt[1]);
    }
  }
  ctx.strokeStyle = 'rgba(26,28,28,0.13)';
  ctx.lineWidth   = 0.5;
  ctx.stroke();
}

function drawLand() {
  ctx.beginPath();
  traceRings(landRings);
  ctx.fillStyle   = 'rgba(212,175,55,0.07)';
  ctx.fill('evenodd');

  ctx.beginPath();
  traceRings(landRings);
  ctx.strokeStyle = 'rgba(26,28,28,0.30)';
  ctx.lineWidth   = 0.75;
  ctx.stroke();
}

function drawDots() {
  if (!dots) return;
  ctx.fillStyle = 'rgba(150,110,20,0.62)';
  for (let i = 0; i < dots.length; i += 2) {
    const pt = project(dots[i], dots[i + 1]);
    if (!pt) continue;
    ctx.beginPath();
    ctx.arc(pt[0], pt[1], 1.15, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawRoutes() {
  ctx.setLineDash([4, 6]);
  ctx.strokeStyle = 'rgba(212,160,20,0.52)';
  ctx.lineWidth   = 1.1;

  for (let idx = 0; idx < routes.length; idx++) {
    const { from, to } = routes[idx];
    ctx.beginPath();
    let started = false;
    for (let s = 0; s <= 60; s++) {
      const [lng, lat] = slerp(from, to, s / 60);
      const pt = project(lng, lat);
      if (!pt) { started = false; continue; }
      if (!started) { ctx.moveTo(pt[0], pt[1]); started = true; }
      else ctx.lineTo(pt[0], pt[1]);
    }
    ctx.stroke();
  }
  ctx.setLineDash([]);
}

function drawParticles() {
  for (let idx = 0; idx < routes.length; idx++) {
    const { from, to } = routes[idx];
    const phase = particlePhases[idx];

    for (let t = TRAIL_LEN; t >= 0; t--) {
      const tPhase = ((phase - t * TRAIL_GAP) % 1 + 1) % 1;
      const [lng, lat] = slerp(from, to, tPhase);
      const pos = project(lng, lat);
      if (!pos) continue;

      if (t === 0) {
        // Glow halo
        const grd = ctx.createRadialGradient(pos[0], pos[1], 0, pos[0], pos[1], 12);
        grd.addColorStop(0,    'rgba(255,230,80,1.0)');
        grd.addColorStop(0.35, 'rgba(255,200,40,0.65)');
        grd.addColorStop(0.7,  'rgba(212,175,55,0.25)');
        grd.addColorStop(1,    'rgba(212,175,55,0)');
        ctx.beginPath();
        ctx.arc(pos[0], pos[1], 12, 0, Math.PI * 2);
        ctx.fillStyle = grd;
        ctx.fill();
        // Core dot
        ctx.beginPath();
        ctx.arc(pos[0], pos[1], 4.0, 0, Math.PI * 2);
        ctx.fillStyle = '#FFF176';
        ctx.fill();
      } else {
        const alpha = (1 - t / (TRAIL_LEN + 1)) * 0.75;
        const r     = (1 - t / (TRAIL_LEN + 1)) * 2.8;
        ctx.beginPath();
        ctx.arc(pos[0], pos[1], r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,210,50,${alpha.toFixed(2)})`;
        ctx.fill();
      }
    }
  }
}

function drawPorts() {
  for (let i = 0; i < ports.length; i++) {
    const pt = project(ports[i][0], ports[i][1]);
    if (!pt) continue;
    // Glow ring
    const grd = ctx.createRadialGradient(pt[0], pt[1], 0, pt[0], pt[1], 5);
    grd.addColorStop(0, 'rgba(212,175,55,0.85)');
    grd.addColorStop(1, 'rgba(212,175,55,0)');
    ctx.beginPath();
    ctx.arc(pt[0], pt[1], 5, 0, Math.PI * 2);
    ctx.fillStyle = grd;
    ctx.fill();
    // Core
    ctx.beginPath();
    ctx.arc(pt[0], pt[1], 1.9, 0, Math.PI * 2);
    ctx.fillStyle = '#D4AF37';
    ctx.fill();
  }
}

/* ── Main render ───────────────────────────────────────────────────── */
function render() {
  ctx.clearRect(0, 0, W, H);

  // Advance particles
  for (let i = 0; i < particlePhases.length; i++) {
    particlePhases[i] = (particlePhases[i] + particleSpeeds[i]) % 1;
  }

  // Clip to globe circle
  ctx.save();
  ctx.beginPath();
  ctx.arc(CX, CY, RADIUS, 0, Math.PI * 2);
  ctx.clip();

  drawGraticule();
  drawLand();
  drawDots();
  drawRoutes();
  drawParticles();
  drawPorts();

  ctx.restore();

  // Globe border ring
  ctx.beginPath();
  ctx.arc(CX, CY, RADIUS, 0, Math.PI * 2);
  ctx.strokeStyle = 'rgba(212,175,55,0.22)';
  ctx.lineWidth   = 1;
  ctx.stroke();
}

/* ── Animation loop ────────────────────────────────────────────────── */
function animate(time) {
  rafId = requestAnimationFrame(animate);
  if (paused) return;
  if (time - lastFrameTime < 42) return; // ~24 fps cap
  lastFrameTime = time;

  if (autoRotate) {
    rotLng += 0.18;
    if (rotLng > 180) rotLng -= 360;
  }
  render();
}

/* ── Message handler ───────────────────────────────────────────────── */
self.onmessage = function (e) {
  const { type } = e.data;

  if (type === 'init') {
    canvas = e.data.canvas;
    ctx    = canvas.getContext('2d');
    W      = e.data.width;
    H      = e.data.height;
    CX     = W / 2;
    CY     = H / 2;
    RADIUS = Math.min(W, H) / 2.15;

    landRings       = e.data.landRings;
    dots            = e.data.dots;
    ports           = e.data.ports;
    routes          = e.data.routes;
    particlePhases  = routes.map((_, i) => i / routes.length);
    particleSpeeds  = routes.map((_, i) => 0.0012 + (i % 6) * 0.00025);

    rafId = requestAnimationFrame(animate);
    self.postMessage({ type: 'ready' });
    return;
  }

  if (type === 'visibility') {
    paused = e.data.hidden;
    return;
  }

  if (type === 'dragstart') {
    autoRotate    = false;
    dragging      = true;
    dragStart     = { x: e.data.x, y: e.data.y };
    rotAtDrag     = [rotLng, rotLat];
    return;
  }

  if (type === 'dragmove') {
    if (!dragging) return;
    rotLng = rotAtDrag[0] + (e.data.x - dragStart.x) * 0.5;
    rotLat = Math.max(-90, Math.min(90, rotAtDrag[1] - (e.data.y - dragStart.y) * 0.5));
    return;
  }

  if (type === 'dragend') {
    dragging = false;
    // Resume auto-rotate after 1.5 s of inactivity
    const id = setTimeout(() => { autoRotate = true; }, 1500);
    return;
  }

  if (type === 'resize') {
    W      = e.data.width;
    H      = e.data.height;
    CX     = W / 2;
    CY     = H / 2;
    RADIUS = Math.min(W, H) / 2.15;
    canvas.width  = W;
    canvas.height = H;
    return;
  }
};
