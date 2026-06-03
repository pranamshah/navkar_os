"use client";

import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";

const PORTS = [
  { name: "Mumbai",      lng: 72.8,   lat: 19.1  },  // 0
  { name: "JNPT",        lng: 72.9,   lat: 18.9  },  // 1
  { name: "Chennai",     lng: 80.3,   lat: 13.1  },  // 2
  { name: "Mundra",      lng: 69.7,   lat: 22.9  },  // 3
  { name: "Kolkata",     lng: 88.3,   lat: 22.6  },  // 4
  { name: "Kochi",       lng: 76.3,   lat: 9.9   },  // 5
  { name: "Vizag",       lng: 83.3,   lat: 17.7  },  // 6
  { name: "Colombo",     lng: 79.8,   lat: 6.9   },  // 7
  { name: "Singapore",   lng: 103.8,  lat: 1.3   },  // 8
  { name: "Port Klang",  lng: 101.4,  lat: 3.0   },  // 9
  { name: "Hong Kong",   lng: 114.2,  lat: 22.3  },  // 10
  { name: "Shanghai",    lng: 121.5,  lat: 31.2  },  // 11
  { name: "Busan",       lng: 129.0,  lat: 35.1  },  // 12
  { name: "Tokyo",       lng: 139.7,  lat: 35.7  },  // 13
  { name: "Dubai",       lng: 55.3,   lat: 25.2  },  // 14
  { name: "Jeddah",      lng: 39.2,   lat: 21.5  },  // 15
  { name: "Salalah",     lng: 57.0,   lat: 17.0  },  // 16
  { name: "Djibouti",    lng: 43.1,   lat: 11.6  },  // 17
  { name: "Mombasa",     lng: 39.7,   lat: -4.0  },  // 18
  { name: "Rotterdam",   lng: 4.5,    lat: 51.9  },  // 19
  { name: "Hamburg",     lng: 10.0,   lat: 53.5  },  // 20
  { name: "Antwerp",     lng: 4.4,    lat: 51.2  },  // 21
  { name: "Piraeus",     lng: 23.6,   lat: 37.9  },  // 22
  { name: "Los Angeles", lng: -118.2, lat: 33.7  },  // 23
  { name: "New York",    lng: -74.0,  lat: 40.7  },  // 24
];

// 20 clean, non-congested key trade corridors
const ROUTES: [number, number][] = [
  [0,  8],  // Mumbai → Singapore (Indian Ocean eastbound)
  [0,  14], // Mumbai → Dubai (Arabian Sea)
  [0,  19], // Mumbai → Rotterdam (via Suez)
  [0,  18], // Mumbai → Mombasa (East Africa)
  [2,  8],  // Chennai → Singapore (Bay of Bengal)
  [3,  15], // Mundra → Jeddah (Arabian Sea)
  [4,  8],  // Kolkata → Singapore (Bay of Bengal)
  [7,  8],  // Colombo → Singapore
  [8,  11], // Singapore → Shanghai (South China Sea)
  [8,  19], // Singapore → Rotterdam (via Suez)
  [10, 19], // Hong Kong → Rotterdam
  [11, 23], // Shanghai → Los Angeles (Trans-Pacific)
  [11, 12], // Shanghai → Busan (East Asia)
  [12, 23], // Busan → Los Angeles (North Pacific)
  [14, 22], // Dubai → Piraeus (via Suez)
  [15, 22], // Jeddah → Piraeus (Red Sea)
  [19, 24], // Rotterdam → New York (North Atlantic)
  [19, 20], // Rotterdam → Hamburg (North Sea)
  [17, 18], // Djibouti → Mombasa (East Africa coast)
  [23, 24], // LA → New York (Americas)
];

interface RotatingEarthProps {
  width?: number;
  height?: number;
  className?: string;
}

export default function RotatingEarth({ width = 600, height = 600, className = "" }: RotatingEarthProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    if (!context) return;

    const containerWidth  = canvas.offsetWidth  || width;
    const containerHeight = canvas.offsetHeight || height;
    const radius = Math.min(containerWidth, containerHeight) / 2.15;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width  = containerWidth  * dpr;
    canvas.height = containerHeight * dpr;
    canvas.style.width  = `${containerWidth}px`;
    canvas.style.height = `${containerHeight}px`;
    context.scale(dpr, dpr);

    const cx = containerWidth  / 2;
    const cy = containerHeight / 2;

    const projection = d3
      .geoOrthographic()
      .scale(radius)
      .translate([cx, cy])
      .clipAngle(90);

    const path = d3.geoPath().projection(projection).context(context);

    // ── Dot generation ──────────────────────────────────────────────
    const pointInPolygon = (point: [number, number], polygon: number[][]): boolean => {
      const [x, y] = point;
      let inside = false;
      for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
        const [xi, yi] = polygon[i];
        const [xj, yj] = polygon[j];
        if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) inside = !inside;
      }
      return inside;
    };

    const pointInFeature = (point: [number, number], feature: any): boolean => {
      const geo = feature.geometry;
      if (geo.type === "Polygon") {
        if (!pointInPolygon(point, geo.coordinates[0])) return false;
        for (let i = 1; i < geo.coordinates.length; i++)
          if (pointInPolygon(point, geo.coordinates[i])) return false;
        return true;
      }
      if (geo.type === "MultiPolygon") {
        for (const polygon of geo.coordinates) {
          if (pointInPolygon(point, polygon[0])) {
            let inHole = false;
            for (let i = 1; i < polygon.length; i++)
              if (pointInPolygon(point, polygon[i])) { inHole = true; break; }
            if (!inHole) return true;
          }
        }
      }
      return false;
    };

    const generateDotsInPolygon = (feature: any) => {
      const dots: [number, number][] = [];
      const [[minLng, minLat], [maxLng, maxLat]] = d3.geoBounds(feature);
      const step = 1.8;
      for (let lng = minLng; lng <= maxLng; lng += step)
        for (let lat = minLat; lat <= maxLat; lat += step) {
          const p: [number, number] = [lng, lat];
          if (pointInFeature(p, feature)) dots.push(p);
        }
      return dots;
    };

    const allDots: { lng: number; lat: number }[] = [];
    let landFeatures: any;

    // ── Pre-compute route interpolators ────────────────────────────
    const routeInterps = ROUTES.map(([a, b]) =>
      d3.geoInterpolate(
        [PORTS[a].lng, PORTS[a].lat],
        [PORTS[b].lng, PORTS[b].lat]
      )
    );

    // Each particle has its own phase (0-1) and speed
    const particlePhases  = ROUTES.map((_, i) => i / ROUTES.length);          // staggered start
    const particleSpeeds  = ROUTES.map((_, i) => 0.0012 + (i % 6) * 0.00025); // slight variation

    // Pre-bake static arc paths (40 points each) — only needs to be recomputed on rotation
    // We rebuild them inside render since projection changes with rotation
    const TRAIL_LEN   = 5;   // number of trail dots behind the particle
    const TRAIL_GAP   = 0.022; // spacing between trail dots (in 0-1 arc units)

    const render = () => {
      context.clearRect(0, 0, containerWidth, containerHeight);

      // Advance all particle phases
      for (let i = 0; i < particlePhases.length; i++)
        particlePhases[i] = (particlePhases[i] + particleSpeeds[i]) % 1;

      // Clip to globe circle
      context.save();
      context.beginPath();
      context.arc(cx, cy, radius, 0, 2 * Math.PI);
      context.clip();

      if (landFeatures) {
        // Graticule
        const graticule = d3.geoGraticule();
        context.beginPath();
        path(graticule());
        context.strokeStyle = "rgba(26,28,28,0.16)";
        context.lineWidth = 0.5;
        context.stroke();

        // Land fill
        context.beginPath();
        landFeatures.features.forEach((f: any) => path(f));
        context.fillStyle = "rgba(212,175,55,0.07)";
        context.fill();

        // Land outlines
        context.beginPath();
        landFeatures.features.forEach((f: any) => path(f));
        context.strokeStyle = "rgba(26,28,28,0.35)";
        context.lineWidth = 0.75;
        context.stroke();

        // Land dots
        allDots.forEach((dot) => {
          const pt = projection([dot.lng, dot.lat]);
          if (!pt) return;
          context.beginPath();
          context.arc(pt[0], pt[1], 1.15, 0, 2 * Math.PI);
          context.fillStyle = "rgba(150,110,20,0.65)";
          context.fill();
        });

        // ── Static arc guides ─────────────────────────────────────
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
          context.strokeStyle = "rgba(212,160,20,0.55)";
          context.lineWidth = 1.1;
          context.setLineDash([4, 6]);
          context.stroke();
          context.setLineDash([]);
        });

        // ── Moving particles with trails ──────────────────────────
        ROUTES.forEach((_, idx) => {
          const interp  = routeInterps[idx];
          const phase   = particlePhases[idx];

          // Trail dots (drawn back-to-front so main dot is on top)
          for (let t = TRAIL_LEN; t >= 0; t--) {
            const tPhase = (phase - t * TRAIL_GAP + 10) % 1;
            const pos = projection(interp(tPhase) as [number, number]);
            if (!pos) continue;

            const alpha = t === 0 ? 1.0 : (1 - t / (TRAIL_LEN + 1)) * 0.75;
            const r     = t === 0 ? 4.0 : (1 - t / (TRAIL_LEN + 1)) * 2.8;

            if (t === 0) {
              // Main dot: bright glow
              const grd = context.createRadialGradient(pos[0], pos[1], 0, pos[0], pos[1], 12);
              grd.addColorStop(0, "rgba(255,230,80,1.0)");
              grd.addColorStop(0.35, "rgba(255,200,40,0.65)");
              grd.addColorStop(0.7, "rgba(212,175,55,0.25)");
              grd.addColorStop(1, "rgba(212,175,55,0)");
              context.beginPath();
              context.arc(pos[0], pos[1], 12, 0, 2 * Math.PI);
              context.fillStyle = grd;
              context.fill();

              context.beginPath();
              context.arc(pos[0], pos[1], r, 0, 2 * Math.PI);
              context.fillStyle = "#FFF176";
              context.fill();
            } else {
              // Trail dot
              context.beginPath();
              context.arc(pos[0], pos[1], r, 0, 2 * Math.PI);
              context.fillStyle = `rgba(255,210,50,${alpha})`;
              context.fill();
            }
          }
        });

        // ── Port markers ──────────────────────────────────────────
        PORTS.forEach((port) => {
          const pt = projection([port.lng, port.lat]);
          if (!pt) return;
          if (!projection.invert?.(pt)) return;

          // Glow ring
          const grd = context.createRadialGradient(pt[0], pt[1], 0, pt[0], pt[1], 5);
          grd.addColorStop(0, "rgba(212,175,55,0.85)");
          grd.addColorStop(1, "rgba(212,175,55,0)");
          context.beginPath();
          context.arc(pt[0], pt[1], 5, 0, 2 * Math.PI);
          context.fillStyle = grd;
          context.fill();

          // Core dot
          context.beginPath();
          context.arc(pt[0], pt[1], 1.9, 0, 2 * Math.PI);
          context.fillStyle = "#D4AF37";
          context.fill();
        });
      }

      context.restore();

      // Sphere border
      context.beginPath();
      context.arc(cx, cy, radius, 0, 2 * Math.PI);
      context.strokeStyle = "rgba(212,175,55,0.2)";
      context.lineWidth = 1;
      context.stroke();
    };

    // ── Load world data ──────────────────────────────────────────────
    const loadWorldData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/world-110m.json");
        if (!response.ok) throw new Error("Failed");
        landFeatures = await response.json();

        const features  = landFeatures.features;
        const chunkSize = 5;
        const processChunk = (start: number) => {
          for (let i = start; i < Math.min(start + chunkSize, features.length); i++) {
            generateDotsInPolygon(features[i]).forEach(([lng, lat]) => allDots.push({ lng, lat }));
          }
          if (start + chunkSize < features.length)
            setTimeout(() => processChunk(start + chunkSize), 0);
          else
            setIsLoading(false);
        };
        processChunk(0);
      } catch {
        setError("Failed to load globe data");
        setIsLoading(false);
      }
    };

    // ── Animation loop (30 fps) ──────────────────────────────────────
    const rotation: [number, number] = [0, -20];
    let autoRotate = true;
    let rafId: number;
    let lastFrameTime = 0;

    const animate = (time: number) => {
      if (time - lastFrameTime >= 33) {
        lastFrameTime = time;
        if (autoRotate) {
          rotation[0] += 0.22;
          projection.rotate(rotation);
        }
        render();
      }
      rafId = requestAnimationFrame(animate);
    };
    rafId = requestAnimationFrame(animate);

    // ── Drag to rotate ───────────────────────────────────────────────
    const handleMouseDown = (e: MouseEvent) => {
      autoRotate = false;
      const startX = e.clientX, startY = e.clientY;
      const startRot: [number, number] = [...rotation] as [number, number];
      const onMove = (ev: MouseEvent) => {
        rotation[0] = startRot[0] + (ev.clientX - startX) * 0.5;
        rotation[1] = Math.max(-90, Math.min(90, startRot[1] - (ev.clientY - startY) * 0.5));
        projection.rotate(rotation);
      };
      const onUp = () => {
        document.removeEventListener("mousemove", onMove);
        document.removeEventListener("mouseup", onUp);
        setTimeout(() => { autoRotate = true; }, 1500);
      };
      document.addEventListener("mousemove", onMove);
      document.addEventListener("mouseup", onUp);
    };

    canvas.addEventListener("mousedown", handleMouseDown);
    loadWorldData();

    return () => {
      cancelAnimationFrame(rafId);
      canvas.removeEventListener("mousedown", handleMouseDown);
    };
  }, [width, height]);

  if (error) {
    return (
      <div className={`flex items-center justify-center ${className}`}>
        <p className="text-sm" style={{ color: "rgba(212,175,55,0.5)" }}>Globe unavailable</p>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <div className="w-8 h-8 rounded-full border-2 border-[#D4AF37]/30 border-t-[#D4AF37] animate-spin" />
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
