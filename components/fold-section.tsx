"use client"

import { ReactNode, useEffect, useRef } from "react"

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}

type FoldSectionProps = {
  children: ReactNode
  className?: string
  index?: number
  preset?: "subtle" | "aggressive"
}

export default function FoldSection({ children, className = "", index = 0, preset = "subtle" }: FoldSectionProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const node = ref.current
    if (!node) return

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (reduced) return

    let rafId = 0

    const animate = () => {
      const el = ref.current
      if (!el) return

      const rect = el.getBoundingClientRect()
      const vh = window.innerHeight
      const offset = index * (preset === "aggressive" ? 0.065 : 0.035)

      // progress while entering viewport from below
      const enter = clamp(
        (vh * ((preset === "aggressive" ? 0.98 : 0.89) + offset) - rect.top) /
          (vh + rect.height * (preset === "aggressive" ? 0.38 : 0.48)),
        0,
        1,
      )
      // progress when leaving viewport at top
      const leave = clamp(
        (-rect.top + vh * (preset === "aggressive" ? 0.08 : 0.12)) /
          (rect.height * (preset === "aggressive" ? 0.95 : 1.22)),
        0,
        1,
      )

      const progress = clamp(enter - leave * 0.35, 0, 1)
      const scale = (preset === "aggressive" ? 0.93 : 0.965) + progress * (preset === "aggressive" ? 0.07 : 0.035)
      const opacity = (preset === "aggressive" ? 0.34 : 0.48) + progress * 0.66

      // Materialize in place (no "scrolling up" movement).
      el.style.opacity = `${clamp(opacity, preset === "aggressive" ? 0.3 : 0.45, 1)}`
      el.style.transform = `translate3d(0, 0, 0) scale(${scale})`
      el.style.filter = `saturate(${0.84 + progress * 0.18}) blur(${(1 - progress) * (preset === "aggressive" ? 1.1 : 0.6)}px)`
      el.style.setProperty("--fold-progress", progress.toFixed(4))
      el.style.setProperty("--build-progress", (1 - progress).toFixed(4))
      el.dataset.foldProgress = progress.toFixed(4)
      el.dataset.buildProgress = (1 - progress).toFixed(4)

      rafId = window.requestAnimationFrame(animate)
    }

    rafId = window.requestAnimationFrame(animate)
    return () => window.cancelAnimationFrame(rafId)
  }, [index, preset])

  return (
    <div
      ref={ref}
      className={`fold-stage will-change-transform transform-gpu [transform-style:preserve-3d] ${className}`}
    >
      {children}
    </div>
  )
}
