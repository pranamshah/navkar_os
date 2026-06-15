"use client"

import { useEffect, useRef, useCallback } from "react"
import createGlobe, { COBEOptions } from "cobe"

interface Marker { id: string; location: [number, number]; size?: number }
interface Arc    { id: string; from: [number, number]; to: [number, number] }

interface GlobeProps {
  markers?  : Marker[]
  arcs?     : Arc[]
  className?: string
}

// NavkarOS palette  #1E40AF → rgb(212,175,55) → [0.831, 0.686, 0.216]
const GOLD : [number,number,number] = [0.831, 0.686, 0.216]
const CREAM: [number,number,number] = [0.97,  0.93,  0.84 ]
const LAND : [number,number,number] = [0.96,  0.94,  0.89 ]   // warm off-white land

const BASE_OPTS: Partial<COBEOptions> = {
  phi:            0.6,     // start facing Indian-Ocean side
  theta:          0.18,
  dark:           0,       // light mode — white ocean
  diffuse:        1.3,
  mapSamples:     24000,
  mapBrightness:  4.5,     // lower = more ocean contrast so arcs pop
  mapBaseBrightness: 0.05,
  baseColor:      LAND,
  markerColor:    GOLD,
  glowColor:      CREAM,
  arcColor:       GOLD,
  arcWidth:       0.9,     // thick enough to see clearly
  arcHeight:      0.32,    // nicely curved arcs
  markerElevation:0.012,
  opacity:        0.92,
  scale:          1.18,    // slightly larger globe on the canvas
}

export function CobeGlobe({ markers = [], arcs = [], className = "" }: GlobeProps) {
  const canvasRef          = useRef<HTMLCanvasElement>(null)
  const pointerDown        = useRef<{ x: number; y: number } | null>(null)
  const lastPtr            = useRef<{ x: number; y: number; t: number } | null>(null)
  const drag               = useRef({ phi: 0, theta: 0 })
  const vel                = useRef({ phi: 0, theta: 0 })
  const phiOff             = useRef(0)
  const thetaOff           = useRef(0)
  const paused             = useRef(false)

  const onDown = useCallback((e: React.PointerEvent) => {
    pointerDown.current = { x: e.clientX, y: e.clientY }
    paused.current = true
    ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
  }, [])

  const onMove = useCallback((e: PointerEvent) => {
    if (!pointerDown.current) return
    drag.current = {
      phi:   (e.clientX - pointerDown.current.x) / 250,
      theta: (e.clientY - pointerDown.current.y) / 900,
    }
    const now = Date.now()
    if (lastPtr.current) {
      const dt  = Math.max(now - lastPtr.current.t, 1)
      const cap = 0.12
      vel.current = {
        phi:   Math.max(-cap, Math.min(cap, ((e.clientX - lastPtr.current.x) / dt) * 0.28)),
        theta: Math.max(-cap, Math.min(cap, ((e.clientY - lastPtr.current.y) / dt) * 0.07)),
      }
    }
    lastPtr.current = { x: e.clientX, y: e.clientY, t: now }
  }, [])

  const onUp = useCallback(() => {
    if (pointerDown.current) {
      phiOff.current   += drag.current.phi
      thetaOff.current += drag.current.theta
      drag.current = { phi: 0, theta: 0 }
      lastPtr.current  = null
    }
    pointerDown.current = null
    paused.current = false
  }, [])

  useEffect(() => {
    window.addEventListener("pointermove", onMove, { passive: true })
    window.addEventListener("pointerup",   onUp,   { passive: true })
    return () => {
      window.removeEventListener("pointermove", onMove)
      window.removeEventListener("pointerup",   onUp)
    }
  }, [onMove, onUp])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    let globe  : ReturnType<typeof createGlobe> | null = null
    let rafId  : number
    let phi = 0.6

    const cobeMarkers = markers.map((m) => ({ location: m.location, size: m.size ?? 0.045, id: m.id }))
    const cobeArcs    = arcs.map((a) => ({ from: a.from, to: a.to, id: a.id }))

    function init() {
      if (!canvas || globe) return
      const w   = canvas.offsetWidth
      if (w === 0) return
      const dpr = Math.min(window.devicePixelRatio || 1, 2)

      globe = createGlobe(canvas, {
        ...BASE_OPTS,
        devicePixelRatio: dpr,
        width:   w * dpr,
        height:  w * dpr,
        markers: cobeMarkers,
        arcs:    cobeArcs,
      } as COBEOptions)

      function animate() {
        if (!paused.current) {
          phi += 0.0026   // auto-rotate speed

          // apply inertia from fling
          if (Math.abs(vel.current.phi) > 0.0001 || Math.abs(vel.current.theta) > 0.0001) {
            phiOff.current   += vel.current.phi
            thetaOff.current += vel.current.theta
            vel.current.phi   *= 0.93
            vel.current.theta *= 0.93
          }
          // clamp vertical tilt
          const tMin = -0.32, tMax = 0.32
          if (thetaOff.current < tMin) thetaOff.current += (tMin - thetaOff.current) * 0.1
          if (thetaOff.current > tMax) thetaOff.current += (tMax - thetaOff.current) * 0.1
        }

        // Only update the rotating params — let cobe handle arc animation internally
        globe!.update({
          phi:   phi + phiOff.current   + drag.current.phi,
          theta: 0.18 + thetaOff.current + drag.current.theta,
        })

        rafId = requestAnimationFrame(animate)
      }

      animate()
      // fade in once rendered
      requestAnimationFrame(() => requestAnimationFrame(() => {
        if (canvas) canvas.style.opacity = "1"
      }))
    }

    // Pause RAF when tab is not visible — saves GPU when user switches tabs
    const onVisibility = () => { paused.current = document.hidden; }
    document.addEventListener("visibilitychange", onVisibility)

    if (canvas.offsetWidth > 0) {
      init()
    } else {
      const ro = new ResizeObserver((entries) => {
        if (entries[0]?.contentRect.width > 0) { ro.disconnect(); init() }
      })
      ro.observe(canvas)
      return () => { ro.disconnect(); document.removeEventListener("visibilitychange", onVisibility) }
    }

    return () => {
      cancelAnimationFrame(rafId)
      globe?.destroy()
      document.removeEventListener("visibilitychange", onVisibility)
    }
  // markers/arcs are static config; eslint-disable is intentional
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className={`relative aspect-square select-none ${className}`}>
      <canvas
        ref={canvasRef}
        onPointerDown={onDown}
        style={{
          width:      "100%",
          height:     "100%",
          opacity:    0,
          transition: "opacity 1.4s ease",
          touchAction:"none",
          /* Let the global cursor handling work; no override here */
        }}
      />
    </div>
  )
}
