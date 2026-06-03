"use client";

import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";

const PORTS = [
  // Indian ports (0-8)
  { name: "Mumbai",     lng: 72.8,   lat: 19.1  },  // 0
  { name: "JNPT",       lng: 72.9,   lat: 18.9  },  // 1
  { name: "Chennai",    lng: 80.3,   lat: 13.1  },  // 2
  { name: "Mundra",     lng: 69.7,   lat: 22.9  },  // 3
  { name: "Kolkata",    lng: 88.3,   lat: 22.6  },  // 4
  { name: "Kochi",      lng: 76.3,   lat: 9.9   },  // 5
  { name: "Vizag",      lng: 83.3,   lat: 17.7  },  // 6
  { name: "Colombo",    lng: 79.8,   lat: 6.9   },  // 7
  { name: "Haldia",     lng: 87.9,   lat: 22.1  },  // 8
  // SE Asia / East Asia (9-16)
  { name: "Singapore",  lng: 103.8,  lat: 1.3   },  // 9
  { name: "Port Klang", lng: 101.4,  lat: 3.0   },  // 10
  { name: "Hong Kong",  lng: 114.2,  lat: 22.3  },  // 11
  { name: "Shanghai",   lng: 121.5,  lat: 31.2  },  // 12
  { name: "Shenzhen",   lng: 114.1,  lat: 22.5  },  // 13
  { name: "Tianjin",    lng: 117.7,  lat: 39.1  },  // 14
  { name: "Busan",      lng: 129.0,  lat: 35.1  },  // 15
  { name: "Tokyo",      lng: 139.7,  lat: 35.7  },  // 16
  // Middle East / Africa (17-21)
  { name: "Dubai",      lng: 55.3,   lat: 25.2  },  // 17
  { name: "Jeddah",     lng: 39.2,   lat: 21.5  },  // 18
  { name: "Salalah",    lng: 57.0,   lat: 17.0  },  // 19
  { name: "Djibouti",   lng: 43.1,   lat: 11.6  },  // 20
  { name: "Mombasa",    lng: 39.7,   lat: -4.0  },  // 21
  // Europe (22-26)
  { name: "Rotterdam",  lng: 4.5,    lat: 51.9  },  // 22
  { name: "Hamburg",    lng: 10.0,   lat: 53.5  },  // 23
  { name: "Antwerp",    lng: 4.4,    lat: 51.2  },  // 24
  { name: "Felixstowe", lng: 1.35,   lat: 51.95 },  // 25
  { name: "Le Havre",   lng: 0.1,    lat: 49.5  },  // 26
  { name: "Piraeus",    lng: 23.6,   lat: 37.9  },  // 27
  // Americas (28-29)
  { name: "Los Angeles",lng: -118.2, lat: 33.7  },  // 28
  { name: "New York",   lng: -74.0,  lat: 40.7  },  // 29
];

const ROUTES = [
  // Indian ports → global hubs
  [0, 9], [0, 17], [0, 22], [0, 3],
  [1, 7], [1, 17], [1, 9],
  [2, 9], [2, 17], [2, 6],
  [3, 17], [3, 19],
  [4, 9], [4, 17],
  [5, 7], [5, 18],
  [6, 9], [6, 2],
  [7, 9], [7, 10],
  [8, 4],
  // Indian ports → Africa / Middle East
  [0, 21], [0, 20],
  [17, 20], [18, 27], [20, 21],
  [19, 17],
  // SE Asia connections
  [9, 12], [9, 11], [9, 10], [9, 13],
  [10, 11], [11, 12], [11, 15],
  [12, 14], [12, 15], [12, 16],
  [13, 9], [15, 16], [15, 28],
  // Trans-Pacific
  [12, 28], [12, 29], [11, 28],
  [28, 29],
  // Europe connections
  [22, 23], [22, 24], [22, 25], [22, 26],
  [24, 25], [27, 22],
  // Asia → Europe
  [9, 22], [17, 22], [18, 27],
  [12, 22],
  // Americas ↔ Europe
  [29, 22], [28, 22],
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

    const containerWidth = canvas.offsetWidth || width;
    const containerHeight = canvas.offsetHeight || height;
    const radius = Math.min(containerWidth, containerHeight) / 2.15;

    const dpr = Math.min(window.devicePixelRatio || 1, 2); // cap at 2x for perf
    canvas.width = containerWidth * dpr;
    canvas.height = containerHeight * dpr;
    canvas.style.width = `${containerWidth}px`;
    canvas.style.height = `${containerHeight}px`;
    context.scale(dpr, dpr);

    const cx = containerWidth / 2;
    const cy = containerHeight / 2;

    const projection = d3
      .geoOrthographic()
      .scale(radius)
      .translate([cx, cy])
      .clipAngle(90);

    const path = d3.geoPath().projection(projection).context(context);

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
      const geometry = feature.geometry;
      if (geometry.type === "Polygon") {
        if (!pointInPolygon(point, geometry.coordinates[0])) return false;
        for (let i = 1; i < geometry.coordinates.length; i++) {
          if (pointInPolygon(point, geometry.coordinates[i])) return false;
        }
        return true;
      } else if (geometry.type === "MultiPolygon") {
        for (const polygon of geometry.coordinates) {
          if (pointInPolygon(point, polygon[0])) {
            let inHole = false;
            for (let i = 1; i < polygon.length; i++) {
              if (pointInPolygon(point, polygon[i])) { inHole = true; break; }
            }
            if (!inHole) return true;
          }
        }
      }
      return false;
    };

    const generateDotsInPolygon = (feature: any) => {
      const dots: [number, number][] = [];
      const bounds = d3.geoBounds(feature);
      const [[minLng, minLat], [maxLng, maxLat]] = bounds;
      const stepSize = 1.8; // fixed degrees — coarser = fewer dots = faster
      for (let lng = minLng; lng <= maxLng; lng += stepSize) {
        for (let lat = minLat; lat <= maxLat; lat += stepSize) {
          const point: [number, number] = [lng, lat];
          if (pointInFeature(point, feature)) dots.push(point);
        }
      }
      return dots;
    };

    const allDots: { lng: number; lat: number }[] = [];
    let landFeatures: any;
    let animTime = 0;

    const drawArc = (from: [number, number], to: [number, number], progress: number) => {
      const interp = d3.geoInterpolate(from, to);
      const steps = 32;
      context.beginPath();
      for (let i = 0; i <= Math.floor(steps * progress); i++) {
        const t = i / steps;
        const pt = projection(interp(t));
        if (!pt) continue;
        if (i === 0) context.moveTo(pt[0], pt[1]);
        else context.lineTo(pt[0], pt[1]);
      }
      context.strokeStyle = "rgba(180,130,10,0.82)";
      context.lineWidth = 1.2;
      context.stroke();
    };

    const render = () => {
      context.clearRect(0, 0, containerWidth, containerHeight);
      animTime += 0.004;

      // Clip everything to the sphere circle
      context.save();
      context.beginPath();
      context.arc(cx, cy, radius, 0, 2 * Math.PI);
      context.clip();

      if (landFeatures) {
        // Graticule — dark lines
        const graticule = d3.geoGraticule();
        context.beginPath();
        path(graticule());
        context.strokeStyle = "rgba(26,28,28,0.18)";
        context.lineWidth = 0.5;
        context.stroke();

        // Land outlines — clearly visible
        context.beginPath();
        landFeatures.features.forEach((f: any) => path(f));
        context.strokeStyle = "rgba(26,28,28,0.38)";
        context.lineWidth = 0.8;
        context.stroke();

        // Land fill — subtle gold tint
        context.beginPath();
        landFeatures.features.forEach((f: any) => path(f));
        context.fillStyle = "rgba(212,175,55,0.07)";
        context.fill();

        // Land dots
        allDots.forEach((dot) => {
          const projected = projection([dot.lng, dot.lat]);
          if (!projected) return;
          context.beginPath();
          context.arc(projected[0], projected[1], 1.2, 0, 2 * Math.PI);
          context.fillStyle = "rgba(150,110,20,0.68)";
          context.fill();
        });

        // Trade route arcs (animated)
        ROUTES.forEach(([a, b], idx) => {
          const from: [number, number] = [PORTS[a].lng, PORTS[a].lat];
          const to: [number, number] = [PORTS[b].lng, PORTS[b].lat];
          const phase = (animTime + idx * 0.3) % 2;
          const progress = phase < 1 ? phase : 2 - phase;
          drawArc(from, to, Math.max(0.05, progress));
        });

        // Port dots
        PORTS.forEach((port) => {
          const projected = projection([port.lng, port.lat]);
          if (!projected) return;
          const geoCoords = projection.invert ? projection.invert(projected) : null;
          if (!geoCoords) return;

          // Outer glow
          const gradient = context.createRadialGradient(projected[0], projected[1], 0, projected[0], projected[1], 5);
          gradient.addColorStop(0, "rgba(212,175,55,0.85)");
          gradient.addColorStop(1, "rgba(212,175,55,0)");
          context.beginPath();
          context.arc(projected[0], projected[1], 5, 0, 2 * Math.PI);
          context.fillStyle = gradient;
          context.fill();

          // Core dot
          context.beginPath();
          context.arc(projected[0], projected[1], 2, 0, 2 * Math.PI);
          context.fillStyle = "#D4AF37";
          context.fill();
        });
      }

      context.restore();

      // Sphere border — gold ring (drawn outside clip)
      context.beginPath();
      context.arc(cx, cy, radius, 0, 2 * Math.PI);
      context.strokeStyle = "rgba(212,175,55,0.22)";
      context.lineWidth = 1;
      context.stroke();
    };

    const loadWorldData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/world-110m.json");
        if (!response.ok) throw new Error("Failed to load land data");
        landFeatures = await response.json();

        // Chunked async dot generation to avoid blocking
        const features = landFeatures.features;
        const chunkSize = 5;
        const processChunk = (startIdx: number) => {
          const end = Math.min(startIdx + chunkSize, features.length);
          for (let i = startIdx; i < end; i++) {
            const dots = generateDotsInPolygon(features[i]);
            dots.forEach(([lng, lat]) => allDots.push({ lng, lat }));
          }
          if (end < features.length) {
            setTimeout(() => processChunk(end), 0);
          } else {
            setIsLoading(false);
          }
        };
        processChunk(0);
      } catch {
        setError("Failed to load globe data");
        setIsLoading(false);
      }
    };

    const rotation: [number, number] = [0, -20];
    let autoRotate = true;

    // 30fps throttle using rAF
    let rafId: number;
    let lastFrameTime = 0;
    const animate = (time: number) => {
      if (time - lastFrameTime >= 33) {
        lastFrameTime = time;
        if (autoRotate) {
          rotation[0] += 0.25;
          projection.rotate(rotation);
        }
        render();
      }
      rafId = requestAnimationFrame(animate);
    };
    rafId = requestAnimationFrame(animate);

    const handleMouseDown = (event: MouseEvent) => {
      autoRotate = false;
      const startX = event.clientX;
      const startY = event.clientY;
      const startRot: [number, number] = [...rotation] as [number, number];
      const onMove = (e: MouseEvent) => {
        rotation[0] = startRot[0] + (e.clientX - startX) * 0.5;
        rotation[1] = Math.max(-90, Math.min(90, startRot[1] - (e.clientY - startY) * 0.5));
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
      <div className={`flex items-center justify-center ${className}`} style={{ background: "transparent" }}>
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
