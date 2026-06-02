"use client";

import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";

const PORTS = [
  { name: "Mumbai", lng: 72.8, lat: 19.1 },
  { name: "JNPT", lng: 72.9, lat: 18.9 },
  { name: "Chennai", lng: 80.3, lat: 13.1 },
  { name: "Mundra", lng: 69.7, lat: 22.9 },
  { name: "Singapore", lng: 103.8, lat: 1.3 },
  { name: "Shanghai", lng: 121.5, lat: 31.2 },
  { name: "Rotterdam", lng: 4.5, lat: 51.9 },
  { name: "Dubai", lng: 55.3, lat: 25.2 },
  { name: "Colombo", lng: 79.8, lat: 6.9 },
  { name: "Hong Kong", lng: 114.2, lat: 22.3 },
  { name: "Hamburg", lng: 10.0, lat: 53.5 },
  { name: "Los Angeles", lng: -118.2, lat: 33.7 },
  { name: "Busan", lng: 129.0, lat: 35.1 },
  { name: "Antwerp", lng: 4.4, lat: 51.2 },
  { name: "Port Klang", lng: 101.4, lat: 3.0 },
  { name: "Jeddah", lng: 39.2, lat: 21.5 },
];

const ROUTES = [
  [0, 4], [0, 6], [0, 7], [0, 3], [2, 4],
  [4, 5], [4, 9], [5, 11], [6, 12], [7, 1],
  [1, 8], [8, 4], [6, 13], [4, 14], [7, 15],
  [2, 7], [3, 7], [5, 14], [9, 11],
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
    const radius = Math.min(containerWidth, containerHeight) / 2.2;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = containerWidth * dpr;
    canvas.height = containerHeight * dpr;
    canvas.style.width = `${containerWidth}px`;
    canvas.style.height = `${containerHeight}px`;
    context.scale(dpr, dpr);

    const projection = d3
      .geoOrthographic()
      .scale(radius)
      .translate([containerWidth / 2, containerHeight / 2])
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

    const generateDotsInPolygon = (feature: any, dotSpacing = 16) => {
      const dots: [number, number][] = [];
      const bounds = d3.geoBounds(feature);
      const [[minLng, minLat], [maxLng, maxLat]] = bounds;
      const stepSize = dotSpacing * 0.14;
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
      const steps = 40;
      context.beginPath();
      for (let i = 0; i <= Math.floor(steps * progress); i++) {
        const t = i / steps;
        const pt = projection(interp(t));
        if (!pt) continue;
        if (i === 0) context.moveTo(pt[0], pt[1]);
        else context.lineTo(pt[0], pt[1]);
      }
      context.strokeStyle = "rgba(212,175,55,0.6)";
      context.lineWidth = 0.8;
      context.stroke();
    };

    const render = () => {
      context.clearRect(0, 0, containerWidth, containerHeight);
      animTime += 0.004;

      // Globe sphere
      context.beginPath();
      context.arc(containerWidth / 2, containerHeight / 2, radius, 0, 2 * Math.PI);
      context.fillStyle = "#0a0b0c";
      context.fill();
      context.strokeStyle = "rgba(212,175,55,0.3)";
      context.lineWidth = 1;
      context.stroke();

      if (landFeatures) {
        // Graticule
        const graticule = d3.geoGraticule();
        context.beginPath();
        path(graticule());
        context.strokeStyle = "rgba(255,255,255,0.06)";
        context.lineWidth = 0.5;
        context.stroke();

        // Land outlines
        context.beginPath();
        landFeatures.features.forEach((f: any) => path(f));
        context.strokeStyle = "rgba(212,175,55,0.25)";
        context.lineWidth = 0.6;
        context.stroke();

        // Land dots
        allDots.forEach((dot) => {
          const projected = projection([dot.lng, dot.lat]);
          if (!projected) return;
          if (projected[0] < 0 || projected[0] > containerWidth || projected[1] < 0 || projected[1] > containerHeight) return;
          context.beginPath();
          context.arc(projected[0], projected[1], 1.0, 0, 2 * Math.PI);
          context.fillStyle = "rgba(180,150,60,0.65)";
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

          // Check if on visible hemisphere
          const geoCoords = projection.invert ? projection.invert(projected) : null;
          if (!geoCoords) return;

          // Outer glow
          const gradient = context.createRadialGradient(projected[0], projected[1], 0, projected[0], projected[1], 6);
          gradient.addColorStop(0, "rgba(212,175,55,0.9)");
          gradient.addColorStop(1, "rgba(212,175,55,0)");
          context.beginPath();
          context.arc(projected[0], projected[1], 6, 0, 2 * Math.PI);
          context.fillStyle = gradient;
          context.fill();

          // Core dot
          context.beginPath();
          context.arc(projected[0], projected[1], 2.2, 0, 2 * Math.PI);
          context.fillStyle = "#D4AF37";
          context.fill();
        });
      }
    };

    const loadWorldData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(
          "https://raw.githubusercontent.com/martynafford/natural-earth-geojson/refs/heads/master/110m/physical/ne_110m_land.json"
        );
        if (!response.ok) throw new Error("Failed to load land data");
        landFeatures = await response.json();
        // Process features in chunks to avoid blocking the main thread
        const features = landFeatures.features;
        const chunkSize = 4;
        const processChunk = (startIdx: number) => {
          const end = Math.min(startIdx + chunkSize, features.length);
          for (let i = startIdx; i < end; i++) {
            const dots = generateDotsInPolygon(features[i], 16);
            dots.forEach(([lng, lat]) => allDots.push({ lng, lat }));
          }
          if (end < features.length) {
            setTimeout(() => processChunk(end), 0);
          } else {
            setIsLoading(false);
          }
        };
        processChunk(0);
      } catch (err) {
        setError("Failed to load globe data");
        setIsLoading(false);
      }
    };

    const rotation: [number, number] = [0, -20];
    let autoRotate = true;
    const rotationTimer = d3.timer(() => {
      if (autoRotate) {
        rotation[0] += 0.3;
        projection.rotate(rotation);
      }
      render();
    });

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
        setTimeout(() => { autoRotate = true; }, 50);
      };
      document.addEventListener("mousemove", onMove);
      document.addEventListener("mouseup", onUp);
    };

    canvas.addEventListener("mousedown", handleMouseDown);
    loadWorldData();

    return () => {
      rotationTimer.stop();
      canvas.removeEventListener("mousedown", handleMouseDown);
    };
  }, [width, height]);

  if (error) {
    return (
      <div className={`flex items-center justify-center rounded-full bg-[#0a0b0c] ${className}`}>
        <p className="text-sm text-yellow-500/60">Globe unavailable</p>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center rounded-full bg-[#0a0b0c] z-10">
          <div className="w-8 h-8 rounded-full border-2 border-[#D4AF37]/30 border-t-[#D4AF37] animate-spin" />
        </div>
      )}
      <canvas
        ref={canvasRef}
        className="w-full h-full rounded-full"
        style={{ background: "#0a0b0c", cursor: "grab" }}
      />
    </div>
  );
}
