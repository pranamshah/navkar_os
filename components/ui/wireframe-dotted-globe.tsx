"use client"

import { useEffect, useRef } from "react"
import * as d3 from "d3"

interface RotatingEarthProps {
  width?: number
  height?: number
  className?: string
}

export default function RotatingEarth({ width = 600, height = 600, className = "" }: RotatingEarthProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const context = canvas.getContext("2d")
    if (!context) return

    const size = Math.min(width, height)
    const radius = size / 2.2

    const dpr = window.devicePixelRatio || 1
    canvas.width = size * dpr
    canvas.height = size * dpr
    canvas.style.width = `${size}px`
    canvas.style.height = `${size}px`
    context.scale(dpr, dpr)

    const projection = d3
      .geoOrthographic()
      .scale(radius)
      .translate([size / 2, size / 2])
      .clipAngle(90)

    const path = d3.geoPath().projection(projection).context(context)

    const pointInPolygon = (point: [number, number], polygon: number[][]): boolean => {
      const [x, y] = point
      let inside = false
      for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
        const [xi, yi] = polygon[i]
        const [xj, yj] = polygon[j]
        if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) inside = !inside
      }
      return inside
    }

    const pointInFeature = (point: [number, number], feature: any): boolean => {
      const { type, coordinates } = feature.geometry
      if (type === "Polygon") {
        if (!pointInPolygon(point, coordinates[0])) return false
        for (let i = 1; i < coordinates.length; i++)
          if (pointInPolygon(point, coordinates[i])) return false
        return true
      }
      if (type === "MultiPolygon") {
        for (const poly of coordinates) {
          if (pointInPolygon(point, poly[0])) {
            let inHole = false
            for (let i = 1; i < poly.length; i++)
              if (pointInPolygon(point, poly[i])) { inHole = true; break }
            if (!inHole) return true
          }
        }
      }
      return false
    }

    const allDots: [number, number][] = []
    let landFeatures: any

    const render = () => {
      context.clearRect(0, 0, size, size)

      // Ocean — transparent fill, very subtle border
      context.beginPath()
      context.arc(size / 2, size / 2, radius, 0, 2 * Math.PI)
      context.fillStyle = "rgba(249,249,249,0.0)"
      context.fill()
      context.strokeStyle = "rgba(0,0,0,0.1)"
      context.lineWidth = 1
      context.stroke()

      if (!landFeatures) return

      // Graticule
      context.beginPath()
      path(d3.geoGraticule()())
      context.strokeStyle = "rgba(0,0,0,0.07)"
      context.lineWidth = 0.5
      context.stroke()

      // Land outlines
      context.beginPath()
      landFeatures.features.forEach((f: any) => path(f))
      context.strokeStyle = "rgba(26,28,28,0.5)"
      context.lineWidth = 0.7
      context.stroke()

      // Dots
      context.fillStyle = "rgba(26,28,28,0.55)"
      allDots.forEach(([lng, lat]) => {
        const p = projection([lng, lat])
        if (p && p[0] >= 0 && p[0] <= size && p[1] >= 0 && p[1] <= size) {
          context.beginPath()
          context.arc(p[0], p[1], 1, 0, 2 * Math.PI)
          context.fill()
        }
      })
    }

    fetch("https://raw.githubusercontent.com/martynafford/natural-earth-geojson/refs/heads/master/110m/physical/ne_110m_land.json")
      .then(r => r.json())
      .then(data => {
        landFeatures = data
        const stepSize = 16 * 0.08
        data.features.forEach((feature: any) => {
          const [[minLng, minLat], [maxLng, maxLat]] = d3.geoBounds(feature)
          for (let lng = minLng; lng <= maxLng; lng += stepSize)
            for (let lat = minLat; lat <= maxLat; lat += stepSize)
              if (pointInFeature([lng, lat], feature)) allDots.push([lng, lat])
        })
        render()
      })
      .catch(() => {})

    const rotation: [number, number] = [0, -20]
    let autoRotate = true

    const timer = d3.timer(() => {
      if (autoRotate) {
        rotation[0] += 0.3
        projection.rotate(rotation)
        render()
      }
    })

    const onMouseDown = (e: MouseEvent) => {
      autoRotate = false
      const sx = e.clientX, sy = e.clientY
      const sr: [number, number] = [...rotation]

      const onMove = (me: MouseEvent) => {
        rotation[0] = sr[0] + (me.clientX - sx) * 0.5
        rotation[1] = Math.max(-90, Math.min(90, sr[1] - (me.clientY - sy) * 0.5))
        projection.rotate(rotation)
        render()
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
