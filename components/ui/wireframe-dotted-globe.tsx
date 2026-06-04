"use client";

import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";

// ── Indian + key global trade ports ─────────────────────────────────────────
const PORTS = [
  { name: "Mumbai",      lng: 72.8,   lat: 19.1  },
  { name: "JNPT",        lng: 72.9,   lat: 18.9  },
  { name: "Chennai",     lng: 80.3,   lat: 13.1  },
  { name: "Mundra",      lng: 69.7,   lat: 22.9  },
  { name: "Kolkata",     lng: 88.3,   lat: 22.6  },
  { name: "Kochi",       lng: 76.3,   lat: 9.9   },
  { name: "Vizag",       lng: 83.3,   lat: 17.7  },
  { name: "Colombo",     lng: 79.8,   lat: 6.9   },
  { name: "Singapore",   lng: 103.8,  lat: 1.3   },
  { name: "Port Klang",  lng: 101.4,  lat: 3.0   },
  { name: "Hong Kong",   lng: 114.2,  lat: 22.3  },
  { name: "Shanghai",    lng: 121.5,  lat: 31.2  },
  { name: "Busan",       lng: 129.0,  lat: 35.1  },
  { name: "Dubai",       lng: 55.3,   lat: 25.2  },
  { name: "Jeddah",      lng: 39.2,   lat: 21.5  },
  { name: "Salalah",     lng: 57.0,   lat: 17.0  },
  { name: "Djibouti",    lng: 43.1,   lat: 11.6  },
  { name: "Mombasa",     lng: 39.7,   lat: -4.0  },
  { name: "Rotterdam",   lng: 4.5,    lat: 51.9  },
  { name: "Hamburg",     lng: 10.0,   lat: 53.5  },
  { name: "Antwerp",     lng: 4.4,    lat: 51.2  },
  { name: "Los Angeles", lng: -118.2, lat: 33.7  },
  { name: "New York",    lng: -74.0,  lat: 40.7  },
];

// ── Routes: [portIndex A, portIndex B] ──────────────────────────────────────
const ROUTES: [number, number][] = [
  [0, 8],   // Mumbai → Singapore
  [0, 13],  // Mumbai → Dubai
  [0, 18],  // Mumbai → Rotterdam
  [2, 8],   // Chennai → Singapore
  [2, 13],  // Chennai → Dubai
  [3, 13],  // Mundra → Dubai
  [4, 8],   // Kolkata → Singapore
  [7, 8],   // Colombo → Singapore
  [8, 11],  // Singapore → Shanghai
  [8, 18],  // Singapore → Rotterdam
  [10, 18], // Hong Kong → Rotterdam
  [11, 21], // Shanghai → Los Angeles
  [13, 14], // Dubai → Jeddah
  [14, 16], // Jeddah → Djibouti
  [16, 17], // Djibouti → Mombasa
  [18, 19], // Rotterdam → Hamburg
  [18, 22], // Rotterdam → New York
];

interface Props { width?: number; height?: number; className?: string; }

export default function RotatingEarth({ width = 800, height = 600, className = "" }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError]         = useState<string | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas  = canvasRef.current;
    const context = canvas.getContext("2d");
    if (!context) return;

    // ── Responsive sizing ──────────────────────────────────────────────────
    const containerWidth  = Math.min(width,  window.innerWidth - 40);
    const containerHeight = Math.min(height, window.innerHeight - 100);
    const radius = Math.min(containerWidth, containerHeight) / 2.5;

    // Cap DPR at 1.5 to avoid unnecessary GPU load
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    canvas.width  = containerWidth  * dpr;
    canvas.height = containerHeight * dpr;
    canvas.style.width  = `${containerWidth}px`;
    canvas.style.height = `${containerHeight}px`;
    context.scale(dpr, dpr);

    const cx = containerWidth  / 2;
    const cy = containerHeight / 2;

    // ── D3 projection ──────────────────────────────────────────────────────
    const projection = d3
      .geoOrthographic()
      .scale(radius)
      .translate([cx, cy])
      .clipAngle(90);

    const path = d3.geoPath().projection(projection).context(context);

    // ── Point-in-polygon helpers ───────────────────────────────────────────
    const pointInRing = (pt: [number, number], ring: number[][]): boolean => {
      const [x, y] = pt;
      let inside = false;
      for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
        const [xi, yi] = ring[i], [xj, yj] = ring[j];
        if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) inside = !inside;
      }
      return inside;
    };

    const pointInFeature = (pt: [number, number], f: { geometry: { type: string; coordinates: number[][][] | number[][][][] } }): boolean => {
      const g = f.geometry;
      if (g.type === "Polygon") {
        const coords = g.coordinates as number[][][];
        if (!pointInRing(pt, coords[0])) return false;
        for (let i = 1; i < coords.length; i++) if (pointInRing(pt, coords[i])) return false;
        return true;
      }
      if (g.type === "MultiPolygon") {
        const coords = g.coordinates as number[][][][];
        for (const poly of coords) {
          if (pointInRing(pt, poly[0])) {
            let hole = false;
            for (let i = 1; i < poly.length; i++) if (pointInRing(pt, poly[i])) { hole = true; break; }
            if (!hole) return true;
          }
        }
      }
      return false;
    };

    // ── Pre-compute route arc interpolators + animation state ──────────────
    const routeInterps = ROUTES.map(([a, b]) =>
      d3.geoInterpolate([PORTS[a].lng, PORTS[a].lat], [PORTS[b].lng, PORTS[b].lat])
    );
    const phases  = ROUTES.map((_, i) => i / ROUTES.length);
    const speeds  = ROUTES.map((_, i) => 0.0010 + (i % 6) * 0.00022);
    const TRAIL   = 3;
    const TRAIL_G = 0.028;

    const allDots: { lng: number; lat: number }[] = [];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let landFeatures: any = null;

    // ── Rotation state ─────────────────────────────────────────────────────
    const rotation: [number, number] = [0, -20];
    let autoRotate = true;

    // ── Render ─────────────────────────────────────────────────────────────
    const render = () => {
      context.clearRect(0, 0, containerWidth, containerHeight);
      const curScale = projection.scale();

      // Clip to sphere
      context.save();
      context.beginPath();
      context.arc(cx, cy, curScale, 0, 2 * Math.PI);
      context.clip();

      // Very subtle ocean tint
      context.beginPath();
      context.arc(cx, cy, curScale, 0, 2 * Math.PI);
      context.fillStyle = "rgba(212,175,55,0.03)";
      context.fill();

      if (landFeatures) {
        // Graticule
        context.beginPath();
        path(d3.geoGraticule()());
        context.strokeStyle = "rgba(180,140,30,0.14)";
        context.lineWidth   = 0.5;
        context.stroke();

        // Land fill
        context.beginPath();
        landFeatures.features.forEach((f: unknown) => path(f as Parameters<typeof path>[0]));
        context.fillStyle = "rgba(212,175,55,0.09)";
        context.fill();

        // Land outline
        context.beginPath();
        landFeatures.features.forEach((f: unknown) => path(f as Parameters<typeof path>[0]));
        context.strokeStyle = "rgba(180,140,30,0.35)";
        context.lineWidth   = 0.7;
        context.stroke();

        // Halftone dots on land
        allDots.forEach(d => {
          const pt = projection([d.lng, d.lat]);
          if (!pt) return;
          context.beginPath();
          context.arc(pt[0], pt[1], 1.05, 0, 2 * Math.PI);
          context.fillStyle = "rgba(212,175,55,0.55)";
          context.fill();
        });

        // Advance particle phases
        for (let i = 0; i < phases.length; i++) phases[i] = (phases[i] + speeds[i]) % 1;

        // Route dashed arcs
        ROUTES.forEach((_, idx) => {
          const interp = routeInterps[idx];
          context.beginPath();
          let started = false;
          for (let s = 0; s <= 60; s++) {
            const pt = projection(interp(s / 60) as [number, number]);
            if (!pt) { started = false; continue; }
            if (!started) { context.moveTo(pt[0], pt[1]); started = true; }
            else context.lineTo(pt[0], pt[1]);
          }
          context.strokeStyle = "rgba(212,165,20,0.4)";
          context.lineWidth   = 0.9;
          context.setLineDash([3, 7]);
          context.stroke();
          context.setLineDash([]);
        });

        // Particles + trails along routes
        ROUTES.forEach((_, idx) => {
          const interp = routeInterps[idx];
          const phase  = phases[idx];
          for (let t = TRAIL; t >= 0; t--) {
            const tp  = ((phase - t * TRAIL_G) + 10) % 1;
            const pos = projection(interp(tp) as [number, number]);
            if (!pos) continue;
            const alpha = t === 0 ? 1.0 : (1 - t / (TRAIL + 1)) * 0.7;
            const r     = t === 0 ? 3.8 : (1 - t / (TRAIL + 1)) * 2.5;
            if (t === 0) {
              // Glow halo
              const grd = context.createRadialGradient(pos[0], pos[1], 0, pos[0], pos[1], 11);
              grd.addColorStop(0,    "rgba(255,230,80,1.0)");
              grd.addColorStop(0.35, "rgba(255,200,40,0.6)");
              grd.addColorStop(0.7,  "rgba(212,175,55,0.2)");
              grd.addColorStop(1,    "rgba(212,175,55,0)");
              context.beginPath();
              context.arc(pos[0], pos[1], 11, 0, 2 * Math.PI);
              context.fillStyle = grd;
              context.fill();
              // Core dot
              context.beginPath();
              context.arc(pos[0], pos[1], r, 0, 2 * Math.PI);
              context.fillStyle = "#FFF176";
              context.fill();
            } else {
              context.beginPath();
              context.arc(pos[0], pos[1], r, 0, 2 * Math.PI);
              context.fillStyle = `rgba(255,215,50,${alpha})`;
              context.fill();
            }
          }
        });

        // Port markers
        PORTS.forEach(port => {
          const pt = projection([port.lng, port.lat]);
          if (!pt) return;
          // Soft glow
          const grd = context.createRadialGradient(pt[0], pt[1], 0, pt[0], pt[1], 6);
          grd.addColorStop(0, "rgba(212,175,55,0.85)");
          grd.addColorStop(1, "rgba(212,175,55,0)");
          context.beginPath();
          context.arc(pt[0], pt[1], 6, 0, 2 * Math.PI);
          context.fillStyle = grd;
          context.fill();
          // Solid core
          context.beginPath();
          context.arc(pt[0], pt[1], 2, 0, 2 * Math.PI);
          context.fillStyle = "#D4AF37";
          context.fill();
        });
      }

      context.restore();

      // Sphere ring
      context.beginPath();
      context.arc(cx, cy, curScale, 0, 2 * Math.PI);
      context.strokeStyle = "rgba(212,175,55,0.22)";
      context.lineWidth   = 1;
      context.stroke();
    };

    // ── D3 timer animation loop ─────────────────────────────────────────────
    const rotationTimer = d3.timer(() => {
      if (autoRotate) {
        rotation[0] += 0.22;
        projection.rotate(rotation);
        render();
      }
    });

    // ── Drag to rotate ─────────────────────────────────────────────────────
    const onMouseDown = (e: MouseEvent) => {
      autoRotate = false;
      const sx = e.clientX, sy = e.clientY;
      const sr: [number, number] = [rotation[0], rotation[1]];

      const onMove = (ev: MouseEvent) => {
        rotation[0] = sr[0] + (ev.clientX - sx) * 0.5;
        rotation[1] = Math.max(-90, Math.min(90, sr[1] - (ev.clientY - sy) * 0.5));
        projection.rotate(rotation);
        render();
      };
      const onUp = () => {
        document.removeEventListener("mousemove", onMove);
        document.removeEventListener("mouseup", onUp);
        setTimeout(() => { autoRotate = true; }, 1500);
      };
      document.addEventListener("mousemove", onMove);
      document.addEventListener("mouseup", onUp);
    };

    // ── Scroll to zoom ─────────────────────────────────────────────────────
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const factor  = e.deltaY > 0 ? 0.92 : 1.08;
      const newScale = Math.max(radius * 0.5, Math.min(radius * 2.5, projection.scale() * factor));
      projection.scale(newScale);
      render();
    };

    canvas.addEventListener("mousedown", onMouseDown);
    canvas.addEventListener("wheel", onWheel, { passive: false });

    // ── Load world data then chunk-generate land dots ───────────────────────
    fetch("/world-110m.json")
      .then(r => { if (!r.ok) throw new Error("fetch failed"); return r.json(); })
      .then(data => {
        landFeatures = data;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const features = data.features as any[];
        const CHUNK = 4;
        let i = 0;
        const tick = () => {
          const end = Math.min(i + CHUNK, features.length);
          for (; i < end; i++) {
            const [[mnLng, mnLat], [mxLng, mxLat]] = d3.geoBounds(features[i]);
            for (let lng = mnLng; lng <= mxLng; lng += 2.5) {
              for (let lat = mnLat; lat <= mxLat; lat += 2.5) {
                const p: [number, number] = [lng, lat];
                if (pointInFeature(p, features[i])) allDots.push({ lng, lat });
              }
            }
          }
          if (i < features.length) setTimeout(tick, 0);
          else setIsLoading(false);
        };
        setTimeout(tick, 0);
      })
      .catch(() => { setError("Failed to load globe data"); setIsLoading(false); });

    return () => {
      rotationTimer.stop();
      canvas.removeEventListener("mousedown", onMouseDown);
      canvas.removeEventListener("wheel", onWheel);
    };
  }, [width, height]);

  if (error) return (
    <div className={`flex items-center justify-center ${className}`}>
      <p className="text-sm" style={{ color: "rgba(212,175,55,0.5)" }}>Globe unavailable</p>
    </div>
  );

  return (
    <div className={`relative ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <div
            className="w-8 h-8 rounded-full border-2 animate-spin"
            style={{ borderColor: "rgba(212,175,55,0.25)", borderTopColor: "#D4AF37" }}
          />
        </div>
      )}
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{ background: "transparent", cursor: "grab" }}
      />
    </div>
  );
}
