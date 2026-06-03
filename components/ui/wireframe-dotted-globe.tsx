"use client";

/**
 * Rotating globe — d3 on main thread, but startup is deferred 600 ms
 * so the page renders and becomes interactive before any heavy work begins.
 * Dot generation is chunked (setTimeout 0) so it never blocks the UI thread.
 */

import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";

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

const ROUTES: [number, number][] = [
  [0,8],[0,14],[0,19],[0,18],
  [2,8],[3,15],[4,8],[7,8],
  [8,11],[8,19],[10,19],[11,23],
  [11,12],[12,23],[14,22],[15,22],
  [19,24],[19,20],[17,18],[23,24],
];

interface Props { width?: number; height?: number; className?: string; }

export default function RotatingEarth({ width = 600, height = 600, className = "" }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError]         = useState<string | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas  = canvasRef.current;
    const context = canvas.getContext("2d");
    if (!context) return;

    let rafId: number;
    let startDelayId: ReturnType<typeof setTimeout>;

    const init = () => {
      const cw = canvas.offsetWidth  || width;
      const ch = canvas.offsetHeight || height;

      // DPR capped at 1 — retina adds zero visual value on canvas but doubles GPU work
      canvas.width  = cw;
      canvas.height = ch;
      canvas.style.width  = `${cw}px`;
      canvas.style.height = `${ch}px`;

      const radius = Math.min(cw, ch) / 2.15;
      const cx = cw / 2;
      const cy = ch / 2;

      const projection = d3
        .geoOrthographic()
        .scale(radius)
        .translate([cx, cy])
        .clipAngle(90);

      const path = d3.geoPath().projection(projection).context(context);

      // ── Dot helpers ─────────────────────────────────────────────────
      const pointInRing = (pt: [number,number], ring: number[][]): boolean => {
        const [x,y] = pt;
        let inside = false;
        for (let i=0, j=ring.length-1; i<ring.length; j=i++) {
          const [xi,yi]=ring[i], [xj,yj]=ring[j];
          if (yi>y!==yj>y && x<((xj-xi)*(y-yi))/(yj-yi)+xi) inside=!inside;
        }
        return inside;
      };

      const pointInFeature = (pt: [number,number], f: any): boolean => {
        const g = f.geometry;
        if (g.type==="Polygon") {
          if (!pointInRing(pt,g.coordinates[0])) return false;
          for (let i=1;i<g.coordinates.length;i++) if (pointInRing(pt,g.coordinates[i])) return false;
          return true;
        }
        if (g.type==="MultiPolygon") {
          for (const poly of g.coordinates) {
            if (pointInRing(pt,poly[0])) {
              let hole=false;
              for (let i=1;i<poly.length;i++) if (pointInRing(pt,poly[i])){hole=true;break;}
              if (!hole) return true;
            }
          }
        }
        return false;
      };

      // ── Pre-compute route interpolators ─────────────────────────────
      const routeInterps = ROUTES.map(([a,b]) =>
        d3.geoInterpolate([PORTS[a].lng,PORTS[a].lat],[PORTS[b].lng,PORTS[b].lat])
      );
      const phases = ROUTES.map((_,i) => i/ROUTES.length);
      const speeds = ROUTES.map((_,i) => 0.0012+(i%6)*0.00025);
      const TRAIL_LEN=3, TRAIL_GAP=0.025;

      const allDots: {lng:number;lat:number}[] = [];
      let landFeatures: any = null;

      // ── Render function ──────────────────────────────────────────────
      const render = () => {
        context.clearRect(0, 0, cw, ch);
        for (let i=0;i<phases.length;i++) phases[i]=(phases[i]+speeds[i])%1;

        context.save();
        context.beginPath();
        context.arc(cx, cy, radius, 0, 2*Math.PI);
        context.clip();

        if (landFeatures) {
          // Graticule
          context.beginPath();
          path(d3.geoGraticule()());
          context.strokeStyle="rgba(26,28,28,0.16)";
          context.lineWidth=0.5;
          context.stroke();

          // Land fill
          context.beginPath();
          landFeatures.features.forEach((f:any)=>path(f));
          context.fillStyle="rgba(212,175,55,0.07)";
          context.fill();

          // Land outline
          context.beginPath();
          landFeatures.features.forEach((f:any)=>path(f));
          context.strokeStyle="rgba(26,28,28,0.32)";
          context.lineWidth=0.75;
          context.stroke();

          // Dots
          allDots.forEach(d=>{
            const pt=projection([d.lng,d.lat]);
            if (!pt) return;
            context.beginPath();
            context.arc(pt[0],pt[1],1.15,0,2*Math.PI);
            context.fillStyle="rgba(150,110,20,0.65)";
            context.fill();
          });

          // Arc guides
          ROUTES.forEach((_,idx)=>{
            const interp=routeInterps[idx];
            context.beginPath();
            let started=false;
            for (let s=0;s<=60;s++){
              const pt=projection(interp(s/60) as [number,number]);
              if (!pt){started=false;continue;}
              if (!started){context.moveTo(pt[0],pt[1]);started=true;}
              else context.lineTo(pt[0],pt[1]);
            }
            context.strokeStyle="rgba(212,160,20,0.55)";
            context.lineWidth=1.1;
            context.setLineDash([4,6]);
            context.stroke();
            context.setLineDash([]);
          });

          // Particles + trails
          ROUTES.forEach((_,idx)=>{
            const interp=routeInterps[idx];
            const phase=phases[idx];
            for (let t=TRAIL_LEN;t>=0;t--){
              const tp=((phase-t*TRAIL_GAP)+10)%1;
              const pos=projection(interp(tp) as [number,number]);
              if (!pos) continue;
              const alpha=t===0?1.0:(1-t/(TRAIL_LEN+1))*0.75;
              const r=t===0?4.0:(1-t/(TRAIL_LEN+1))*2.8;
              if (t===0){
                const grd=context.createRadialGradient(pos[0],pos[1],0,pos[0],pos[1],12);
                grd.addColorStop(0,"rgba(255,230,80,1.0)");
                grd.addColorStop(0.35,"rgba(255,200,40,0.65)");
                grd.addColorStop(0.7,"rgba(212,175,55,0.25)");
                grd.addColorStop(1,"rgba(212,175,55,0)");
                context.beginPath();
                context.arc(pos[0],pos[1],12,0,2*Math.PI);
                context.fillStyle=grd;
                context.fill();
                context.beginPath();
                context.arc(pos[0],pos[1],r,0,2*Math.PI);
                context.fillStyle="#FFF176";
                context.fill();
              } else {
                context.beginPath();
                context.arc(pos[0],pos[1],r,0,2*Math.PI);
                context.fillStyle=`rgba(255,210,50,${alpha})`;
                context.fill();
              }
            }
          });

          // Port markers
          PORTS.forEach(port=>{
            const pt=projection([port.lng,port.lat]);
            if (!pt) return;
            const grd=context.createRadialGradient(pt[0],pt[1],0,pt[0],pt[1],5);
            grd.addColorStop(0,"rgba(212,175,55,0.85)");
            grd.addColorStop(1,"rgba(212,175,55,0)");
            context.beginPath();
            context.arc(pt[0],pt[1],5,0,2*Math.PI);
            context.fillStyle=grd;
            context.fill();
            context.beginPath();
            context.arc(pt[0],pt[1],1.9,0,2*Math.PI);
            context.fillStyle="#D4AF37";
            context.fill();
          });
        }

        context.restore();

        // Sphere border
        context.beginPath();
        context.arc(cx,cy,radius,0,2*Math.PI);
        context.strokeStyle="rgba(212,175,55,0.2)";
        context.lineWidth=1;
        context.stroke();
      };

      // ── Animation loop: 24 fps, pauses on hidden tab + off-screen ───
      const rotation: [number,number] = [0,-20];
      let autoRotate=true, lastFrame=0, paused=false, offscreen=false;

      const onVisibility=()=>{paused=document.hidden;};
      document.addEventListener("visibilitychange",onVisibility);

      // Pause the whole render loop when the globe scrolls out of view —
      // this is what keeps the rest of the page scrolling buttery-smooth.
      const io = new IntersectionObserver(
        (entries) => { offscreen = !entries[0].isIntersecting; },
        { rootMargin: "120px" }
      );
      io.observe(canvas);

      const animate=(t:number)=>{
        rafId=requestAnimationFrame(animate);
        if (paused || offscreen) return;
        if (t-lastFrame<42) return;
        lastFrame=t;
        if (autoRotate){rotation[0]+=0.18;projection.rotate(rotation);}
        render();
      };
      rafId=requestAnimationFrame(animate);

      // ── Drag to rotate ───────────────────────────────────────────────
      const onMouseDown=(e:MouseEvent)=>{
        autoRotate=false;
        const sx=e.clientX,sy=e.clientY;
        const sr:[number,number]=[...rotation] as [number,number];
        const onMove=(ev:MouseEvent)=>{
          rotation[0]=sr[0]+(ev.clientX-sx)*0.5;
          rotation[1]=Math.max(-90,Math.min(90,sr[1]-(ev.clientY-sy)*0.5));
          projection.rotate(rotation);
        };
        const onUp=()=>{
          document.removeEventListener("mousemove",onMove);
          document.removeEventListener("mouseup",onUp);
          setTimeout(()=>{autoRotate=true;},1500);
        };
        document.addEventListener("mousemove",onMove);
        document.addEventListener("mouseup",onUp);
      };
      canvas.addEventListener("mousedown",onMouseDown);

      // ── Load world data, then generate dots in chunks ────────────────
      fetch("/world-110m.json")
        .then(r=>{ if (!r.ok) throw new Error("fetch failed"); return r.json(); })
        .then(data=>{
          landFeatures=data;
          const features=data.features as any[];
          const CHUNK=5;
          let i=0;
          const tick=()=>{
            const end=Math.min(i+CHUNK,features.length);
            for (;i<end;i++){
              const [[mnLng,mnLat],[mxLng,mxLat]]=d3.geoBounds(features[i]);
              for (let lng=mnLng;lng<=mxLng;lng+=2.4)
                for (let lat=mnLat;lat<=mxLat;lat+=2.4){
                  const p:[number,number]=[lng,lat];
                  if (pointInFeature(p,features[i])) allDots.push({lng,lat});
                }
            }
            if (i<features.length) setTimeout(tick,0);
            else setIsLoading(false);
          };
          setTimeout(tick,0);
        })
        .catch(()=>{setError("Failed to load globe data");setIsLoading(false);});

      return ()=>{
        cancelAnimationFrame(rafId);
        io.disconnect();
        canvas.removeEventListener("mousedown",onMouseDown);
        document.removeEventListener("visibilitychange",onVisibility);
      };
    };

    // ── Defer startup 600 ms so the page is interactive first ──────────
    let cleanup: (()=>void)|undefined;
    startDelayId = setTimeout(()=>{ cleanup=init(); },600);

    return ()=>{
      clearTimeout(startDelayId);
      cleanup?.();
      cancelAnimationFrame(rafId);
    };
  }, [width, height]);

  if (error) return (
    <div className={`flex items-center justify-center ${className}`}>
      <p className="text-sm" style={{color:"rgba(212,175,55,0.5)"}}>Globe unavailable</p>
    </div>
  );

  return (
    <div className={`relative ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <div
            className="w-8 h-8 rounded-full border-2 animate-spin"
            style={{borderColor:"rgba(212,175,55,0.25)",borderTopColor:"#D4AF37"}}
          />
        </div>
      )}
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{background:"transparent",cursor:"grab"}}
      />
    </div>
  );
}
