"use client"

import { useEffect, useRef } from "react"

type Point = { x: number; y: number }
type Stroke = { points: Point[]; weight: number; closed?: boolean }
type Shape = { name: string; strokes: Stroke[] }
type MeshData = {
  points: Point[]
  edges: Array<[number, number]>
  outline_count: number
  total_points: number
  total_edges: number
}

const MORPH_DURATION_MS = 6800
const HOLD_DURATION_MS = 1500
const PACKET_SIZE = 2.05
const CURSOR_LINK_WIDTH = 1.0
const RENDER_QUALITY_MULTIPLIER = 2
const SHAPE_TILT_PRESETS = [
  { rotX: -0.08, rotY: 0.2 },
  { rotX: -0.05, rotY: -0.16 },
  { rotX: -0.03, rotY: 0.14 },
  { rotX: 0.12, rotY: 0.1 },
]

const MESH_FILES = [
  "/meshdata/koenigsegg_mesh.json",
  "/meshdata/f22_mesh.json",
  "/meshdata/helicopter_mesh.json",
  "/meshdata/thinker_mesh.json",
]

const FALLBACK_SHAPES: Shape[] = [
  {
    name: "Fallback Infinity",
    strokes: [
      {
        weight: 10,
        closed: true,
        points: [
          { x: -1.0, y: 0.0 },
          { x: -0.6, y: -0.35 },
          { x: -0.2, y: -0.05 },
          { x: 0.0, y: 0.0 },
          { x: 0.2, y: -0.05 },
          { x: 0.6, y: -0.35 },
          { x: 1.0, y: 0.0 },
          { x: 0.6, y: 0.35 },
          { x: 0.2, y: 0.05 },
          { x: 0.0, y: 0.0 },
          { x: -0.2, y: 0.05 },
          { x: -0.6, y: 0.35 },
        ],
      },
    ],
  },
  {
    name: "Fallback Atom",
    strokes: [
      {
        weight: 10,
        closed: true,
        points: [
          { x: -0.95, y: 0.0 },
          { x: -0.55, y: -0.3 },
          { x: 0.0, y: -0.42 },
          { x: 0.55, y: -0.3 },
          { x: 0.95, y: 0.0 },
          { x: 0.55, y: 0.3 },
          { x: 0.0, y: 0.42 },
          { x: -0.55, y: 0.3 },
        ],
      },
    ],
  },
  {
    name: "Fallback Diamond",
    strokes: [
      {
        weight: 10,
        closed: true,
        points: [
          { x: 0.0, y: -1.0 },
          { x: 0.5, y: -0.35 },
          { x: 1.0, y: 0.0 },
          { x: 0.5, y: 0.35 },
          { x: 0.0, y: 1.0 },
          { x: -0.5, y: 0.35 },
          { x: -1.0, y: 0.0 },
          { x: -0.5, y: -0.35 },
        ],
      },
    ],
  },
  {
    name: "Fallback Helix",
    strokes: [
      {
        weight: 10,
        closed: false,
        points: [
          { x: -0.9, y: -0.85 },
          { x: -0.35, y: -0.5 },
          { x: 0.35, y: -0.15 },
          { x: 0.85, y: 0.15 },
          { x: 0.35, y: 0.5 },
          { x: -0.35, y: 0.85 },
        ],
      },
    ],
  },
]

function clamp(v: number, min: number, max: number) {
  return Math.min(max, Math.max(min, v))
}

function easeInOutCubic(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t
}

function dist(a: Point, b: Point) {
  return Math.hypot(a.x - b.x, a.y - b.y)
}

function sampleStroke(stroke: Stroke, count: number): Point[] {
  const pts = stroke.points
  if (pts.length < 2 || count <= 0) return []

  const segments: { a: Point; b: Point; d: number }[] = []
  let total = 0
  for (let i = 0; i < pts.length - 1; i++) {
    const a = pts[i]
    const b = pts[i + 1]
    const d = dist(a, b)
    segments.push({ a, b, d })
    total += d
  }
  if (stroke.closed) {
    const a = pts[pts.length - 1]
    const b = pts[0]
    const d = dist(a, b)
    segments.push({ a, b, d })
    total += d
  }

  if (total <= 0) return []

  const out: Point[] = []
  for (let i = 0; i < count; i++) {
    const target = (i / count) * total
    let acc = 0
    let chosen = segments[0]
    for (const seg of segments) {
      if (acc + seg.d >= target) {
        chosen = seg
        break
      }
      acc += seg.d
    }
    const local = chosen.d === 0 ? 0 : (target - acc) / chosen.d
    out.push({ x: lerp(chosen.a.x, chosen.b.x, local), y: lerp(chosen.a.y, chosen.b.y, local) })
  }

  return out
}

function sampleShape(shape: Shape, count: number): Point[] {
  const totalWeight = shape.strokes.reduce((sum, s) => sum + s.weight, 0)
  if (totalWeight <= 0) return []

  const allocations = shape.strokes.map((s) => Math.max(2, Math.round((s.weight / totalWeight) * count)))
  let allocated = allocations.reduce((a, b) => a + b, 0)

  while (allocated > count) {
    const idx = allocations.findIndex((n) => n > 2)
    if (idx === -1) break
    allocations[idx] -= 1
    allocated -= 1
  }
  while (allocated < count) {
    allocations[allocated % allocations.length] += 1
    allocated += 1
  }

  const points: Point[] = []
  for (let i = 0; i < shape.strokes.length; i++) points.push(...sampleStroke(shape.strokes[i], allocations[i]))

  if (points.length > count) return points.slice(0, count)
  while (points.length < count) points.push(points[points.length - 1] || { x: 0, y: 0 })
  return points
}

function padPoints(points: Point[], target: number, outlineCount: number): Point[] {
  if (points.length >= target) return points.slice(0, target)
  const result = [...points]
  const interiorStart = clamp(outlineCount, 0, Math.max(0, points.length - 1))

  while (result.length < target) {
    const hasInterior = points.length > interiorStart + 1
    const srcIndex = hasInterior
      ? interiorStart + Math.floor(Math.random() * Math.max(1, points.length - interiorStart))
      : Math.floor(Math.random() * Math.max(1, points.length))
    const src = points[srcIndex] ?? { x: 0, y: 0 }
    result.push({
      x: src.x + (Math.random() - 0.5) * 0.02,
      y: src.y + (Math.random() - 0.5) * 0.02,
    })
  }
  return result
}

function depthForNode(index: number, outlineCount: number, totalPoints: number): number {
  if (index < outlineCount) return 0.08
  const interiorIndex = index - outlineCount
  const interiorTotal = totalPoints - outlineCount
  return 0.2 + (interiorIndex / Math.max(1, interiorTotal)) * 0.74
}

export default function NeuralNetworkBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const meshDataRef = useRef<Array<MeshData | undefined>>([])

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const shouldAnimate = !reduced

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const fallbackCount = 336
    let shapePoints = FALLBACK_SHAPES.map((shape) => sampleShape(shape, fallbackCount))

    let dpr = 1
    let width = 0
    let height = 0
    let rafId = 0
    let lastTs = 0
    let frameInterval = 1000 / 45

    let fromShape = 0
    let toShape = 1
    let phaseStart = performance.now()
    let inHold = true

    const cursor = { x: 0, y: 0, active: false }
    let active = true

    const loadMeshData = async () => {
      const results = await Promise.allSettled(
        MESH_FILES.map(async (url) => {
          const res = await fetch(url)
          if (!res.ok) throw new Error(`Failed to load ${url}: ${res.status}`)
          return (await res.json()) as MeshData
        }),
      )

      results.forEach((result, index) => {
        if (result.status === "fulfilled") {
          meshDataRef.current[index] = result.value
        }
      })

      const maxPoints = Math.max(
        1,
        ...shapePoints.map((pts) => pts.length),
        ...meshDataRef.current.map((m) => m?.total_points ?? 0),
      )

      const next = [...shapePoints]
      for (let i = 0; i < next.length; i++) {
        const mesh = meshDataRef.current[i]
        if (mesh) {
          next[i] = padPoints(mesh.points, maxPoints, mesh.outline_count)
        } else {
          next[i] = padPoints(next[i], maxPoints, Math.floor(next[i].length * 0.66))
        }
      }
      shapePoints = next
    }

    const resize = () => {
      width = window.innerWidth
      height = window.innerHeight
      const maxDpr = width < 768 ? 3 : 4
      dpr = Math.min((window.devicePixelRatio || 1) * RENDER_QUALITY_MULTIPLIER, maxDpr)
      frameInterval = 1000 / (width < 768 ? 30 : 45)

      canvas.width = Math.floor(width * dpr)
      canvas.height = Math.floor(height * dpr)
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    const onMove = (event: PointerEvent) => {
      cursor.x = event.clientX
      cursor.y = event.clientY
      cursor.active = true
    }

    const onLeave = () => {
      cursor.active = false
    }

    const stepMorphState = (ts: number) => {
      const elapsed = ts - phaseStart
      if (inHold) {
        if (elapsed > HOLD_DURATION_MS) {
          inHold = false
          phaseStart = ts
        }
        return 0
      }

      const t = clamp(elapsed / MORPH_DURATION_MS, 0, 1)
      if (t >= 1) {
        fromShape = toShape
        toShape = (toShape + 1) % shapePoints.length
        inHold = true
        phaseStart = ts
      }
      return easeInOutCubic(t)
    }

    const renderFrame = (ts: number) => {
      if (!active) {
        if (shouldAnimate) rafId = window.requestAnimationFrame(renderFrame)
        return
      }
      if (lastTs && ts - lastTs < frameInterval) {
        if (shouldAnimate) rafId = window.requestAnimationFrame(renderFrame)
        return
      }
      lastTs = ts

      const t = stepMorphState(ts)
      const from = shapePoints[fromShape]
      const to = shapePoints[toShape]
      const fromMesh = meshDataRef.current[fromShape]
      const toMesh = meshDataRef.current[toShape]

      const fromTilt = SHAPE_TILT_PRESETS[fromShape] ?? SHAPE_TILT_PRESETS[0]
      const toTilt = SHAPE_TILT_PRESETS[toShape] ?? SHAPE_TILT_PRESETS[0]
      const tiltX = lerp(fromTilt.rotX, toTilt.rotX, t)
      const tiltY = lerp(fromTilt.rotY, toTilt.rotY, t)

      const floatX = Math.cos(ts * 0.00026) * 14
      const floatY = Math.sin(ts * 0.0002) * 12
      const floatRot = Math.sin(ts * 0.00015) * 0.08

      const base = Math.min(width, height)
      const scale = base * (width < 768 ? 0.5 : 0.58)
      const cx = width * 0.5
      const cy = height * 0.5

      const pointCount = Math.max(1, from.length, to.length)
      const fromOutline = fromMesh?.outline_count ?? Math.floor(from.length * 0.66)
      const toOutline = toMesh?.outline_count ?? Math.floor(to.length * 0.66)

      const world: Point[] = []
      const depths: number[] = []
      const transformPoint = (x: number, y: number) => {
        const pitchX = x
        const pitchY = y * Math.cos(tiltX)
        const pitchZ = y * Math.sin(tiltX)

        const yawX = pitchX * Math.cos(tiltY) + pitchZ * Math.sin(tiltY)
        const yawZ = -pitchX * Math.sin(tiltY) + pitchZ * Math.cos(tiltY)

        const proj = 1 + yawZ * 0.32
        const px = yawX * proj
        const py = pitchY * proj

        const rx = px * Math.cos(floatRot) - py * Math.sin(floatRot)
        const ry = px * Math.sin(floatRot) + py * Math.cos(floatRot)
        return { x: cx + rx * scale + floatX, y: cy + ry * scale + floatY }
      }

      ctx.clearRect(0, 0, width, height)

      for (let i = 0; i < pointCount; i++) {
        const fp = from[i] ?? from[from.length - 1] ?? { x: 0, y: 0 }
        const tp = to[i] ?? to[to.length - 1] ?? fp
        const fx = lerp(fp.x, tp.x, t)
        const fy = lerp(fp.y, tp.y, t)
        const transformed = transformPoint(fx, fy)

        const fromDepth = depthForNode(i, fromOutline, from.length)
        const toDepth = depthForNode(i, toOutline, to.length)
        const depth = lerp(fromDepth, toDepth, t)

        let tx = transformed.x + Math.cos(ts * 0.0012 + i * 0.37) * (1.3 - depth * 0.55)
        let ty = transformed.y + Math.sin(ts * 0.001 + i * 0.27) * (1.3 - depth * 0.55)

        const pointerNX = cursor.active ? clamp((cursor.x - cx) / Math.max(1, width * 0.5), -1, 1) : Math.cos(ts * 0.00035) * 0.24
        const pointerNY = cursor.active ? clamp((cursor.y - cy) / Math.max(1, height * 0.5), -1, 1) : Math.sin(ts * 0.00027) * 0.24
        const parallaxAmp = (1 - depth) * 44
        tx += pointerNX * parallaxAmp
        ty += pointerNY * parallaxAmp * 0.72

        const perspective = 0.9 + (1 - depth) * 0.34
        tx = cx + (tx - cx) * perspective
        ty = cy + (ty - cy) * perspective

        if (cursor.active) {
          const dx = cursor.x - tx
          const dy = cursor.y - ty
          const d = Math.hypot(dx, dy)
          if (d < 160 && d > 0) {
            const pull = (1 - d / 160) * 6 * (1 - depth * 0.55)
            tx += (dx / d) * pull
            ty += (dy / d) * pull
          }
        }

        world.push({ x: tx, y: ty })
        depths.push(depth)
      }

      const fromEdges = fromMesh?.edges ?? []
      const toEdges = toMesh?.edges ?? []
      const activeEdges = fromEdges.length >= toEdges.length ? fromEdges : toEdges

      for (let e = 0; e < activeEdges.length; e++) {
        const [ai, bi] = activeEdges[e]
        if (ai >= world.length || bi >= world.length) continue
        const a = world[ai]
        const b = world[bi]
        const screenDist = Math.hypot(a.x - b.x, a.y - b.y)
        if (screenDist > 180) continue

        const avgDepth = (depths[ai] + depths[bi]) * 0.5
        const depthGain = 1 - avgDepth * 0.8
        const alpha = (e % 4 === 0 ? 0.18 : 0.08) * depthGain
        ctx.strokeStyle = `rgba(196, 90, 60, ${alpha})`
        ctx.lineWidth = (e % 4 === 0 ? 1.35 : 0.9) * (0.7 + depthGain)
        ctx.beginPath()
        ctx.moveTo(a.x, a.y)
        ctx.lineTo(b.x, b.y)
        ctx.stroke()

        if (e % 2 === 0 || e % 7 === 0) {
          const packet = (ts * 0.00022 + ((ai * 17 + bi * 29) % 97) / 97) % 1
          const px = a.x + (b.x - a.x) * packet
          const py = a.y + (b.y - a.y) * packet
          const glow = 0.3 + Math.sin(ts * 0.008 + ai * 0.2) * 0.2
          ctx.fillStyle = `rgba(245, 200, 186, ${Math.max(0.1, glow)})`
          ctx.beginPath()
          ctx.arc(px, py, PACKET_SIZE * (1 - avgDepth * 0.42), 0, Math.PI * 2)
          ctx.fill()
        }
      }

      // Light interior weave to preserve coated surface feel with precomputed meshes.
      const interiorEdges = activeEdges.filter(([ai, bi]) => ai >= fromOutline && bi >= fromOutline)
      for (let i = 0; i < interiorEdges.length; i += 6) {
        const [ai, bi] = interiorEdges[i]
        if (ai >= world.length || bi >= world.length) continue
        const a = world[ai]
        const b = world[bi]
        const d = Math.hypot(a.x - b.x, a.y - b.y)
        if (d > 120) continue
        const avgDepth = (depths[ai] + depths[bi]) * 0.5
        const alpha = 0.03 + (1 - avgDepth) * 0.06
        ctx.strokeStyle = `rgba(232, 229, 224, ${alpha})`
        ctx.lineWidth = 0.8
        ctx.beginPath()
        ctx.moveTo(a.x, a.y)
        ctx.lineTo(b.x, b.y)
        ctx.stroke()
      }

      const buildTargets = document.querySelectorAll<HTMLElement>(".fold-stage[data-build-progress]")
      buildTargets.forEach((el, targetIndex) => {
        const rect = el.getBoundingClientRect()
        if (rect.bottom < -80 || rect.top > height + 80) return

        const visible = clamp((Math.min(height, rect.bottom) - Math.max(0, rect.top)) / Math.max(1, rect.height), 0, 1)
        const buildProgress = clamp(Number(el.dataset.buildProgress || "0"), 0, 1)
        const activity = clamp(buildProgress * (0.8 + visible * 1.05), 0, 1)
        if (activity < 0.03) return

        const tx = rect.left + rect.width * 0.5
        const ty = rect.top + rect.height * 0.5
        const w = rect.width * 0.88
        const h = rect.height * 0.84

        // Removed module framing boxes; keep only network-to-module assembly links.

        // Removed module connection lines/packets entirely per request.
      })

      const drawOrder = world.map((_, i) => i).sort((a, b) => depths[b] - depths[a])
      const activeOutline = Math.round(lerp(fromOutline, toOutline, t))

      for (const i of drawOrder) {
        const p = world[i]
        const depth = depths[i]
        const depthGain = 1 - depth * 0.58
        const isOutline = i < activeOutline
        const baseAlpha = (isOutline ? 0.9 : 0.66) * depthGain
        ctx.fillStyle = i % 9 === 0 ? `rgba(233, 149, 126, ${baseAlpha + 0.1})` : `rgba(216, 126, 102, ${baseAlpha})`
        ctx.beginPath()
        const radius = i % 9 === 0 ? (isOutline ? 2.35 : 2.0) : isOutline ? 1.65 : 1.45
        ctx.arc(p.x, p.y, radius * (0.75 + depthGain), 0, Math.PI * 2)
        ctx.fill()

        if (cursor.active) {
          const d = Math.hypot(p.x - cursor.x, p.y - cursor.y)
          if (d < 120) {
            const alpha = (1 - d / 120) * 0.25
            ctx.strokeStyle = `rgba(196, 90, 60, ${alpha})`
            ctx.lineWidth = CURSOR_LINK_WIDTH
            ctx.beginPath()
            ctx.moveTo(p.x, p.y)
            ctx.lineTo(cursor.x, cursor.y)
            ctx.stroke()
          }
        }
      }

      if (shouldAnimate) rafId = window.requestAnimationFrame(renderFrame)
    }

    const onVisibility = () => {
      active = document.visibilityState === "visible"
    }

    resize()
    void loadMeshData()
    if (!shouldAnimate) {
      renderFrame(performance.now())
    } else {
      rafId = window.requestAnimationFrame(renderFrame)
    }

    window.addEventListener("resize", resize)
    if (shouldAnimate) {
      window.addEventListener("pointermove", onMove)
      window.addEventListener("pointerleave", onLeave)
      document.addEventListener("visibilitychange", onVisibility)
    }

    return () => {
      window.cancelAnimationFrame(rafId)
      window.removeEventListener("resize", resize)
      if (shouldAnimate) {
        window.removeEventListener("pointermove", onMove)
        window.removeEventListener("pointerleave", onLeave)
        document.removeEventListener("visibilitychange", onVisibility)
      }
    }
  }, [])

  return <canvas ref={canvasRef} className="pointer-events-none fixed inset-0 z-0 opacity-100" aria-hidden="true" />
}
