"use client"

import { useEffect, useRef } from "react"
import * as d3 from "d3"

interface RotatingEarthProps {
  width?: number
  height?: number
  className?: string
}

// India-centric trade corridors matching the module data
const TRADE_ROUTES: Array<{ from: [number, number]; to: [number, number] }> = [
  { from: [72.83, 18.97], to: [9.95,    53.55] },  // Mumbai  → Hamburg
  { from: [72.83, 18.97], to: [55.27,   25.20] },  // Mumbai  → Dubai
  { from: [80.27, 13.08], to: [103.82,   1.35] },  // Chennai → Singapore
  { from: [88.36, 22.57], to: [-118.19, 33.77] },  // Kolkata → Los Angeles
  { from: [72.83, 18.97], to: [-73.78,  40.64] },  // Mumbai  → New York
  { from: [69.70, 22.84], to: [4.48,    51.92] },  // Mundra  → Rotterdam
]

// Indian origin ports — always shown with pulsing rings
const ORIGIN_PORTS: [number, number][] = [
  [72.83, 18.97], // Mumbai / INNSA
  [80.27, 13.08], // Chennai / INMAA
  [88.36, 22.57], // Kolkata / INCCU
  [69.70, 22.84], // Mundra  / INMUN
]

const ARC_STEPS    = 100   // interpolation resolution
const ARC_DURATION = 2400  // ms to draw one arc
const ARC_STAGGER  = 700   // ms between arc starts
const DOT_CYCLE    = 3200  // ms for one dot to travel full arc

export default function RotatingEarth({ width = 600, height = 600, className = "" }: RotatingEarthProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!canvasRef.current) return
    const canvas = canvasRef.current
    const context = canvas.getContext("2d")
    if (!context) return

    const size   = Math.min(width, height)
    const radius = size / 2.2

    const dpr = window.devicePixelRatio || 1
    canvas.width  = size * dpr
    canvas.height = size * dpr
    canvas.style.width  = `${size}px`
    canvas.style.height = `${size}px`
    context.scale(dpr, dpr)

    const projection = d3
      .geoOrthographic()
      .scale(radius)
      .translate([size / 2, size / 2])
      .clipAngle(90)

    const path = d3.geoPath().projection(projection).context(context)

    // ── point-in-polygon helpers ──────────────────────────────────────────
    const pointInPolygon = (pt: [number, number], ring: number[][]): boolean => {
      const [x, y] = pt
      let inside = false
      for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
        const [xi, yi] = ring[i], [xj, yj] = ring[j]
        if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi)
          inside = !inside
      }
      return inside
    }

    const pointInFeature = (pt: [number, number], feature: any): boolean => {
      const { type, coordinates } = feature.geometry
      if (type === "Polygon") {
        if (!pointInPolygon(pt, coordinates[0])) return false
        for (let i = 1; i < coordinates.length; i++)
          if (pointInPolygon(pt, coordinates[i])) return false
        return true
      }
      if (type === "MultiPolygon") {
        for (const poly of coordinates) {
          if (pointInPolygon(pt, poly[0])) {
            let inHole = false
            for (let i = 1; i < poly.length; i++)
              if (pointInPolygon(pt, poly[i])) { inHole = true; break }
            if (!inHole) return true
          }
        }
      }
      return false
    }

    // ── state ─────────────────────────────────────────────────────────────
    const allDots: [number, number][] = []
    let landFeatures: any
    const arcProgress = TRADE_ROUTES.map(() => 0)   // 0→1 draw-in
    let arcStartMs    = -1                           // set after data loads

    // ── render ────────────────────────────────────────────────────────────
    const render = (now: number) => {
      context.clearRect(0, 0, size, size)
      const sf = projection.scale() / radius        // scale factor for line widths

      // Globe sphere border
      context.beginPath()
      context.arc(size / 2, size / 2, projection.scale(), 0, 2 * Math.PI)
      context.fillStyle = "rgba(0,0,0,0)"
      context.fill()
      context.strokeStyle = "rgba(0,0,0,0.1)"
      context.lineWidth = 1
      context.stroke()

      if (!landFeatures) return

      // Graticule
      context.beginPath()
      path(d3.geoGraticule()())
      context.strokeStyle = "rgba(0,0,0,0.06)"
      context.lineWidth = 0.5
      context.stroke()

      // Land outlines
      context.beginPath()
      landFeatures.features.forEach((f: any) => path(f))
      context.strokeStyle = "rgba(26,28,28,0.45)"
      context.lineWidth = 0.7
      context.stroke()

      // Land dots
      context.fillStyle = "rgba(26,28,28,0.5)"
      allDots.forEach(([lng, lat]) => {
        const p = projection([lng, lat])
        if (p && p[0] >= 0 && p[0] <= size && p[1] >= 0 && p[1] <= size) {
          context.beginPath()
          context.arc(p[0], p[1], 1, 0, 2 * Math.PI)
          context.fill()
        }
      })

      // ── Trade arc lines ──────────────────────────────────────────────
      if (arcStartMs > 0) {
        const elapsed = now - arcStartMs

        TRADE_ROUTES.forEach((route, i) => {
          // Update draw-in progress
          const t = elapsed - i * ARC_STAGGER
          arcProgress[i] = t < 0 ? 0 : Math.min(1, t / ARC_DURATION)
          const prog = arcProgress[i]
          if (prog <= 0) return

          const interp    = d3.geoInterpolate(route.from, route.to)
          const drawSteps = Math.floor(prog * ARC_STEPS)

          // Draw arc line
          context.beginPath()
          let penDown = false
          for (let s = 0; s <= drawSteps; s++) {
            const proj = projection(interp(s / ARC_STEPS) as [number, number])
            if (!proj) { penDown = false; continue }
            if (!penDown) { context.moveTo(proj[0], proj[1]); penDown = true }
            else context.lineTo(proj[0], proj[1])
          }
          context.strokeStyle = "#D4AF37"
          context.lineWidth   = 1.1 * sf
          context.globalAlpha = 0.55
          context.stroke()
          context.globalAlpha = 1

          // Destination dot (appears when arc fully drawn)
          if (prog >= 1) {
            const ep = projection(route.to as [number, number])
            if (ep) {
              context.beginPath()
              context.arc(ep[0], ep[1], 2.2 * sf, 0, 2 * Math.PI)
              context.fillStyle   = "#D4AF37"
              context.globalAlpha = 0.85
              context.fill()
              context.globalAlpha = 1
            }
          }

          // Traveling dot — cycles along the arc after draw-in
          if (prog >= 1) {
            const cycleOffset = i * (DOT_CYCLE / TRADE_ROUTES.length)
            const dotT = ((elapsed - i * ARC_STAGGER + cycleOffset) % DOT_CYCLE) / DOT_CYCLE
            const dotPt = interp(dotT) as [number, number]
            const dp    = projection(dotPt)
            if (dp) {
              // Glow halo
              context.beginPath()
              context.arc(dp[0], dp[1], 4.5 * sf, 0, 2 * Math.PI)
              context.fillStyle   = "#D4AF37"
              context.globalAlpha = 0.15
              context.fill()
              // Core dot
              context.beginPath()
              context.arc(dp[0], dp[1], 2 * sf, 0, 2 * Math.PI)
              context.fillStyle   = "#D4AF37"
              context.globalAlpha = 0.9
              context.fill()
              context.globalAlpha = 1
            }
          } else {
            // Leading dot during draw-in
            const leadPt = interp(prog) as [number, number]
            const lp     = projection(leadPt)
            if (lp) {
              context.beginPath()
              context.arc(lp[0], lp[1], 2 * sf, 0, 2 * Math.PI)
              context.fillStyle   = "#D4AF37"
              context.globalAlpha = 0.85
              context.fill()
              context.globalAlpha = 1
            }
          }
        })

        // ── Origin port dots ─────────────────────────────────────────
        const pulseT = (Math.sin(now * 0.003) + 1) / 2   // 0→1 oscillation
        ORIGIN_PORTS.forEach(port => {
          const pp = projection(port)
          if (!pp) return
          // Outer pulse ring
          context.beginPath()
          context.arc(pp[0], pp[1], (4 + pulseT * 3) * sf, 0, 2 * Math.PI)
          context.strokeStyle = "#D4AF37"
          context.lineWidth   = 0.8 * sf
          context.globalAlpha = 0.2 + pulseT * 0.15
          context.stroke()
          // Inner solid dot
          context.beginPath()
          context.arc(pp[0], pp[1], 2.8 * sf, 0, 2 * Math.PI)
          context.fillStyle   = "#D4AF37"
          context.globalAlpha = 0.9
          context.fill()
          context.globalAlpha = 1
        })
      }
    }

    // ── Load geo data ─────────────────────────────────────────────────────
    fetch("https://raw.githubusercontent.com/martynafford/natural-earth-geojson/refs/heads/master/110m/physical/ne_110m_land.json")
      .then(r => r.json())
      .then(data => {
        landFeatures = data
        const step = 16 * 0.08
        data.features.forEach((feature: any) => {
          const [[minLng, minLat], [maxLng, maxLat]] = d3.geoBounds(feature)
          for (let lng = minLng; lng <= maxLng; lng += step)
            for (let lat = minLat; lat <= maxLat; lat += step)
              if (pointInFeature([lng, lat], feature)) allDots.push([lng, lat])
        })
        // Start arc animations 800ms after globe appears
        arcStartMs = Date.now() + 800
      })
      .catch(() => {})

    // ── Rotation + animation loop ─────────────────────────────────────────
    const rotation: [number, number] = [0, -20]
    let autoRotate = true

    const timer = d3.timer(() => {
      if (autoRotate) {
        rotation[0] += 0.3
        projection.rotate(rotation)
      }
      render(Date.now())
    })

    // ── Drag interaction ──────────────────────────────────────────────────
    const onMouseDown = (e: MouseEvent) => {
      autoRotate = false
      const sx = e.clientX, sy = e.clientY
      const sr: [number, number] = [...rotation]
      const onMove = (me: MouseEvent) => {
        rotation[0] = sr[0] + (me.clientX - sx) * 0.5
        rotation[1] = Math.max(-90, Math.min(90, sr[1] - (me.clientY - sy) * 0.5))
        projection.rotate(rotation)
      }
      const onUp = () => {
        document.removeEventListener("mousemove", onMove)
        document.removeEventListener("mouseup", onUp)
        setTimeout(() => { autoRotate = true }, 10)
      }
      document.addEventListener("mousemove", onMove)
      document.addEventListener("mouseup", onUp)
    }

    canvas.addEventListener("mousedown", onMouseDown)
    return () => {
      timer.stop()
      canvas.removeEventListener("mousedown", onMouseDown)
    }
  }, [width, height])

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ display: "block", background: "transparent" }}
    />
  )
}
