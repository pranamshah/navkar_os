"use client"

import { useEffect, useRef, useCallback } from "react"
import createGlobe from "cobe"

interface Marker {
  id: string
  location: [number, number]
  size?: number
}

interface Arc {
  id: string
  from: [number, number]
  to: [number, number]
}

interface GlobeProps {
  markers?: Marker[]
  arcs?: Arc[]
  className?: string
}

// NavkarOS colour palette
// Gold: #D4AF37 → rgb(212,175,55) → [0.831, 0.686, 0.216]
const GOLD: [number, number, number]  = [0.831, 0.686, 0.216]
const WHITE: [number, number, number] = [1, 1, 1]
const CREAM: [number, number, number] = [0.96, 0.92, 0.82]

export function CobeGlobe({ markers = [], arcs = [], className = "" }: GlobeProps) {
  const canvasRef              = useRef<HTMLCanvasElement>(null)
  const pointerInteracting     = useRef<{ x: number; y: number } | null>(null)
  const lastPointer            = useRef<{ x: number; y: number; t: number } | null>(null)
  const dragOffset             = useRef({ phi: 0, theta: 0 })
  const velocity               = useRef({ phi: 0, theta: 0 })
  const phiOffsetRef           = useRef(0)
  const thetaOffsetRef         = useRef(0)
  const isPausedRef            = useRef(false)

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    pointerInteracting.current = { x: e.clientX, y: e.clientY }
    if (canvasRef.current) canvasRef.current.style.cursor = "grabbing"
    isPausedRef.current = true
  }, [])

  const handlePointerMove = useCallback((e: PointerEvent) => {
    if (!pointerInteracting.current) return
    const deltaX = e.clientX - pointerInteracting.current.x
    const deltaY = e.clientY - pointerInteracting.current.y
    dragOffset.current = { phi: deltaX / 250, theta: deltaY / 900 }
    const now = Date.now()
    if (lastPointer.current) {
      const dt = Math.max(now - lastPointer.current.t, 1)
      const cap = 0.12
      velocity.current = {
        phi:   Math.max(-cap, Math.min(cap, ((e.clientX - lastPointer.current.x) / dt) * 0.28)),
        theta: Math.max(-cap, Math.min(cap, ((e.clientY - lastPointer.current.y) / dt) * 0.07)),
      }
    }
    lastPointer.current = { x: e.clientX, y: e.clientY, t: now }
  }, [])

  const handlePointerUp = useCallback(() => {
    if (pointerInteracting.current) {
      phiOffsetRef.current   += dragOffset.current.phi
      thetaOffsetRef.current += dragOffset.current.theta
      dragOffset.current = { phi: 0, theta: 0 }
      lastPointer.current = null
    }
    pointerInteracting.current = null
    if (canvasRef.current) canvasRef.current.style.cursor = "grab"
    isPausedRef.current = false
  }, [])

  useEffect(() => {
    window.addEventListener("pointermove", handlePointerMove, { passive: true })
    window.addEventListener("pointerup",   handlePointerUp,   { passive: true })
    return () => {
      window.removeEventListener("pointermove", handlePointerMove)
      window.removeEventListener("pointerup",   handlePointerUp)
    }
  }, [handlePointerMove, handlePointerUp])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    let globe: ReturnType<typeof createGlobe> | null = null
    let animationId: number
    let phi = 0.6  // start facing Indian Ocean

    function init() {
      if (!canvas || globe) return
      const w   = canvas.offsetWidth
      if (w === 0) return
      const dpr = Math.min(window.devicePixelRatio || 1, 2)

      globe = createGlobe(canvas, {
        devicePixelRatio: dpr,
        width:  w * dpr,
        height: w * dpr,
        phi:    0.6,
        theta:  0.18,
        dark:   0,                    // light globe
        diffuse: 1.2,
        mapSamples: 20000,
        mapBrightness: 6,
        baseColor: WHITE,             // white land
        markerColor: GOLD,            // gold dots
        glowColor: CREAM,             // warm cream glow
        arcColor: GOLD,
        arcWidth: 0.6,
        arcHeight: 0.28,
        markerElevation: 0.01,
        markers: markers.map((m) => ({ location: m.location, size: m.size ?? 0.04 })),
        arcs: arcs.map((a) => ({ from: a.from, to: a.to })),
        opacity: 0.85,
      })

      function animate() {
        if (!isPausedRef.current) {
          phi += 0.0028

          if (Math.abs(velocity.current.phi) > 0.0001 || Math.abs(velocity.current.theta) > 0.0001) {
            phiOffsetRef.current   += velocity.current.phi
            thetaOffsetRef.current += velocity.current.theta
            velocity.current.phi   *= 0.94
            velocity.current.theta *= 0.94
          }

          const tMin = -0.35, tMax = 0.35
          if (thetaOffsetRef.current < tMin) thetaOffsetRef.current += (tMin - thetaOffsetRef.current) * 0.1
          if (thetaOffsetRef.current > tMax) thetaOffsetRef.current += (tMax - thetaOffsetRef.current) * 0.1
        }

        globe!.update({
          phi:   phi + phiOffsetRef.current   + dragOffset.current.phi,
          theta: 0.18 + thetaOffsetRef.current + dragOffset.current.theta,
          dark:  0,
          mapBrightness: 6,
          markerColor: GOLD,
          baseColor:   WHITE,
          glowColor:   CREAM,
          arcColor:    GOLD,
          markerElevation: 0.01,
          markers: markers.map((m) => ({ location: m.location, size: m.size ?? 0.04 })),
          arcs: arcs.map((a) => ({ from: a.from, to: a.to })),
        })

        animationId = requestAnimationFrame(animate)
      }

      animate()
      setTimeout(() => { if (canvas) canvas.style.opacity = "1" })
    }

    if (canvas.offsetWidth > 0) {
      init()
    } else {
      const ro = new ResizeObserver((entries) => {
        if (entries[0]?.contentRect.width > 0) { ro.disconnect(); init() }
      })
      ro.observe(canvas)
    }

    return () => {
      if (animationId) cancelAnimationFrame(animationId)
      if (globe) globe.destroy()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className={`relative aspect-square select-none ${className}`}>
      <canvas
        ref={canvasRef}
        onPointerDown={handlePointerDown}
        style={{
          width: "100%",
          height: "100%",
          cursor: "grab",
          opacity: 0,
          transition: "opacity 1.4s ease",
          touchAction: "none",
        }}
      />
    </div>
  )
}
