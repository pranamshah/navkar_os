"use client";

/**
 * Rotating globe — animation runs entirely in a Web Worker via OffscreenCanvas.
 * The main thread only does:
 *   1. Fetch world-110m.json once
 *   2. Pre-process polygon rings + land dots (chunked, non-blocking)
 *   3. Forward mouse/visibility events to the worker
 *
 * Zero canvas work on the main thread → no jank, no cursor lag.
 */

import { useEffect, useRef, useState, useCallback } from "react";

/* ── Port & route data (kept here so we don't re-fetch) ─────────────── */
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
  { name: "Tokyo",       lng: 139.7,  lat: 35.7  },
  { name: "Dubai",       lng: 55.3,   lat: 25.2  },
  { name: "Jeddah",      lng: 39.2,   lat: 21.5  },
  { name: "Salalah",     lng: 57.0,   lat: 17.0  },
  { name: "Djibouti",    lng: 43.1,   lat: 11.6  },
  { name: "Mombasa",     lng: 39.7,   lat: -4.0  },
  { name: "Rotterdam",   lng: 4.5,    lat: 51.9  },
  { name: "Hamburg",     lng: 10.0,   lat: 53.5  },
  { name: "Antwerp",     lng: 4.4,    lat: 51.2  },
  { name: "Piraeus",     lng: 23.6,   lat: 37.9  },
  { name: "Los Angeles", lng: -118.2, lat: 33.7  },
  { name: "New York",    lng: -74.0,  lat: 40.7  },
];

const ROUTE_INDICES: [number, number][] = [
  [0, 8],  [0, 14], [0, 19], [0, 18],
  [2, 8],  [3, 15], [4, 8],  [7, 8],
  [8, 11], [8, 19], [10, 19],[11, 23],
  [11, 12],[12, 23],[14, 22],[15, 22],
  [19, 24],[19, 20],[17, 18],[23, 24],
];

/* ── Geo helpers (run once on main thread) ──────────────────────────── */

function pointInRing(lng: number, lat: number, ring: number[][]): boolean {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i], [xj, yj] = ring[j];
    if (yi > lat !== yj > lat && lng < ((xj - xi) * (lat - yi)) / (yj - yi) + xi) {
      inside = !inside;
    }
  }
  return inside;
}

function getBounds(geo: any): [[number, number], [number, number]] {
  let minLng = Infinity, maxLng = -Infinity;
  let minLat = Infinity, maxLat = -Infinity;
  const scan = (ring: number[][]) => {
    for (const [lng, lat] of ring) {
      if (lng < minLng) minLng = lng; if (lng > maxLng) maxLng = lng;
      if (lat < minLat) minLat = lat; if (lat > maxLat) maxLat = lat;
    }
  };
  if (geo.type === "Polygon") geo.coordinates.forEach(scan);
  else if (geo.type === "MultiPolygon") geo.coordinates.forEach((p: number[][][]) => p.forEach(scan));
  return [[minLng, minLat], [maxLng, maxLat]];
}

function isOnLand(lng: number, lat: number, geo: any): boolean {
  if (geo.type === "Polygon") {
    if (!pointInRing(lng, lat, geo.coordinates[0])) return false;
    for (let i = 1; i < geo.coordinates.length; i++)
      if (pointInRing(lng, lat, geo.coordinates[i])) return false;
    return true;
  }
  if (geo.type === "MultiPolygon") {
    for (const poly of geo.coordinates) {
      if (pointInRing(lng, lat, poly[0])) {
        let inHole = false;
        for (let i = 1; i < poly.length; i++)
          if (pointInRing(lng, lat, poly[i])) { inHole = true; break; }
        if (!inHole) return true;
      }
    }
  }
  return false;
}

/** Extract exterior ring of every polygon as a flat Float32Array. */
function extractLandRings(features: any[]): Float32Array[] {
  const rings: Float32Array[] = [];
  for (const feat of features) {
    const geo = feat.geometry;
    const addRing = (ring: number[][]) => {
      const buf = new Float32Array(ring.length * 2);
      for (let i = 0; i < ring.length; i++) {
        buf[i * 2]     = ring[i][0];
        buf[i * 2 + 1] = ring[i][1];
      }
      rings.push(buf);
    };
    if (geo.type === "Polygon")      addRing(geo.coordinates[0]);
    else if (geo.type === "MultiPolygon")
      geo.coordinates.forEach((p: number[][][]) => addRing(p[0]));
  }
  return rings;
}

/** Chunked dot generation — yields control between chunks to stay non-blocking. */
function generateDotsChunked(
  features: any[],
  onProgress: (dots: number[]) => void,
  onDone: (all: Float32Array) => void
) {
  const accumulated: number[] = [];
  const STEP = 2.4;
  const CHUNK = 4;
  let i = 0;

  const tick = () => {
    const end = Math.min(i + CHUNK, features.length);
    for (; i < end; i++) {
      const g = features[i].geometry;
      const [[minLng, minLat], [maxLng, maxLat]] = getBounds(g);
      for (let lng = minLng; lng <= maxLng; lng += STEP) {
        for (let lat = minLat; lat <= maxLat; lat += STEP) {
          if (isOnLand(lng, lat, g)) { accumulated.push(lng, lat); }
        }
      }
    }
    onProgress(accumulated);
    if (i < features.length) {
      setTimeout(tick, 0);
    } else {
      onDone(new Float32Array(accumulated));
    }
  };
  setTimeout(tick, 0);
}

/* ── Component ──────────────────────────────────────────────────────── */

interface Props { width?: number; height?: number; className?: string; }

export default function RotatingEarth({ width = 600, height = 600, className = "" }: Props) {
  const canvasRef  = useRef<HTMLCanvasElement>(null);
  const workerRef  = useRef<Worker | null>(null);
  const [loading, setLoading]   = useState(true);
  const [error,   setError]     = useState<string | null>(null);

  // Initialise worker once canvas + data are both ready
  const initWorker = useCallback((
    canvas: HTMLCanvasElement,
    landRings: Float32Array[],
    dots: Float32Array
  ) => {
    // OffscreenCanvas moves ALL drawing to the worker thread
    const offscreen = canvas.transferControlToOffscreen();
    const w = canvas.offsetWidth  || width;
    const h = canvas.offsetHeight || height;

    const routes = ROUTE_INDICES.map(([a, b]) => ({
      from: [PORTS[a].lng, PORTS[a].lat],
      to:   [PORTS[b].lng, PORTS[b].lat],
    }));
    const portCoords = PORTS.map(p => [p.lng, p.lat]);

    const worker = new Worker("/globe.worker.js");
    workerRef.current = worker;

    worker.onmessage = (e) => {
      if (e.data.type === "ready") setLoading(false);
    };

    // Transfer canvas ownership + all data in one message
    // landRings are Float32Arrays — transfer their underlying ArrayBuffers
    const transferables: Transferable[] = [offscreen as unknown as Transferable];
    landRings.forEach(r => transferables.push(r.buffer));
    transferables.push(dots.buffer);

    worker.postMessage(
      { type: "init", canvas: offscreen, width: w, height: h, landRings, dots, ports: portCoords, routes },
      transferables
    );

    // Visibility API — pause animation when tab is hidden
    const onVisibility = () => worker.postMessage({ type: "visibility", hidden: document.hidden });
    document.addEventListener("visibilitychange", onVisibility);

    // Forward mouse events for drag-to-rotate
    const onMouseDown = (e: MouseEvent) => {
      worker.postMessage({ type: "dragstart", x: e.clientX, y: e.clientY });
      const onMove = (ev: MouseEvent) => worker.postMessage({ type: "dragmove", x: ev.clientX, y: ev.clientY });
      const onUp   = () => {
        worker.postMessage({ type: "dragend" });
        document.removeEventListener("mousemove", onMove);
        document.removeEventListener("mouseup",   onUp);
      };
      document.addEventListener("mousemove", onMove);
      document.addEventListener("mouseup",   onUp);
    };
    canvas.addEventListener("mousedown", onMouseDown);

    return () => {
      worker.terminate();
      canvas.removeEventListener("mousedown", onMouseDown);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [width, height]);

  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    let cleanup: (() => void) | undefined;

    // Check OffscreenCanvas support
    if (typeof canvas.transferControlToOffscreen !== "function") {
      setError("Your browser doesn't support OffscreenCanvas. Please update Chrome/Edge.");
      return;
    }

    const run = async () => {
      try {
        const res = await fetch("/world-110m.json");
        if (!res.ok) throw new Error("Failed to load world data");
        const geojson = await res.json();
        const features: any[] = geojson.features;

        const landRings = extractLandRings(features);

        generateDotsChunked(
          features,
          () => {}, // progress — could update a progress bar here
          (dots) => {
            cleanup = initWorker(canvas, landRings, dots);
          }
        );
      } catch (err) {
        console.error("Globe init failed:", err);
        setError("Globe failed to load");
        setLoading(false);
      }
    };

    run();

    return () => { cleanup?.(); workerRef.current?.terminate(); };
  }, [initWorker]);

  if (error) {
    return (
      <div className={`flex items-center justify-center ${className}`}>
        <p className="text-sm" style={{ color: "rgba(212,175,55,0.5)" }}>Globe unavailable</p>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {loading && (
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
