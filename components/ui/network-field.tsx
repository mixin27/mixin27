"use client"

import { useEffect, useRef } from "react"
import { cn } from "@/lib/utils"

type NetworkFieldProps = {
  className?: string
  connectionDistance?: number
  glowOpacity?: number
  lineOpacityScale?: number
  particleCount?: number
  particleOpacityScale?: number
  speed?: number
}

type Particle = {
  life: number
  opacity: number
  size: number
  speedX: number
  speedY: number
  x: number
  y: number
}

export function NetworkField({
  className,
  connectionDistance = 84,
  glowOpacity = 0.8,
  lineOpacityScale = 1,
  particleCount = 44,
  particleOpacityScale = 1,
  speed = 0.22,
}: NetworkFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext("2d")

    if (!canvas || !ctx) {
      return
    }

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches

    let particles: Particle[] = []
    let animationFrameId = 0
    let viewportWidth = 0
    let viewportHeight = 0

    const getParticleColor = () =>
      getComputedStyle(document.documentElement)
        .getPropertyValue("--app-particle-color")
        .trim() || "#9b59f5"

    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      const dpr = window.devicePixelRatio || 1

      viewportWidth = rect.width
      viewportHeight = rect.height
      canvas.width = Math.max(1, Math.floor(rect.width * dpr))
      canvas.height = Math.max(1, Math.floor(rect.height * dpr))
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    const createParticle = (): Particle => ({
      x: Math.random() * viewportWidth,
      y: Math.random() * viewportHeight,
      size: Math.random() * 1.8 + 0.6,
      speedX: (Math.random() - 0.5) * speed * 2,
      speedY: (Math.random() - 0.5) * speed * 2,
      opacity: Math.random() * 0.45 + 0.18,
      life: Math.random() * 220 + 100,
    })

    const initParticles = () => {
      particles = Array.from({ length: particleCount }, createParticle)
    }

    const drawStatic = () => {
      ctx.clearRect(0, 0, viewportWidth, viewportHeight)
      const color = getParticleColor()

      particles.forEach((particle) => {
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        ctx.fillStyle = color
        ctx.globalAlpha = Math.min(1, particle.opacity * particleOpacityScale)
        ctx.shadowBlur = 10
        ctx.shadowColor = color
        ctx.fill()
      })

      for (let i = 0; i < particles.length; i += 1) {
        for (let j = i + 1; j < particles.length; j += 1) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < connectionDistance) {
            ctx.beginPath()
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.strokeStyle = color
            ctx.globalAlpha = Math.min(
              1,
              (1 - distance / connectionDistance) * 0.12 * lineOpacityScale
            )
            ctx.lineWidth = 0.45
            ctx.shadowBlur = 0
            ctx.stroke()
          }
        }
      }

      ctx.shadowBlur = 0
      ctx.globalAlpha = 1
    }

    const draw = () => {
      ctx.clearRect(0, 0, viewportWidth, viewportHeight)
      const color = getParticleColor()

      particles.forEach((particle, index) => {
        particle.x += particle.speedX
        particle.y += particle.speedY
        particle.life -= 1

        if (
          particle.life <= 0 ||
          particle.x < 0 ||
          particle.x > viewportWidth ||
          particle.y < 0 ||
          particle.y > viewportHeight
        ) {
          particles[index] = createParticle()
          return
        }

        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        ctx.fillStyle = color
        ctx.globalAlpha = Math.min(1, particle.opacity * particleOpacityScale)
        ctx.shadowBlur = 12
        ctx.shadowColor = color
        ctx.fill()
      })

      for (let i = 0; i < particles.length; i += 1) {
        for (let j = i + 1; j < particles.length; j += 1) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < connectionDistance) {
            ctx.beginPath()
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.strokeStyle = color
            ctx.globalAlpha = Math.min(
              1,
              (1 - distance / connectionDistance) * 0.16 * lineOpacityScale
            )
            ctx.lineWidth = 0.55
            ctx.shadowBlur = 0
            ctx.stroke()
          }
        }
      }

      ctx.shadowBlur = 0
      ctx.globalAlpha = 1
      animationFrameId = window.requestAnimationFrame(draw)
    }

    resize()
    initParticles()

    if (prefersReducedMotion) {
      drawStatic()
    } else {
      draw()
    }

    const resizeObserver = new ResizeObserver(() => {
      resize()
      initParticles()

      if (prefersReducedMotion) {
        drawStatic()
      }
    })

    resizeObserver.observe(canvas)

    return () => {
      resizeObserver.disconnect()

      if (!prefersReducedMotion) {
        window.cancelAnimationFrame(animationFrameId)
      }
    }
  }, [
    connectionDistance,
    lineOpacityScale,
    particleCount,
    particleOpacityScale,
    speed,
  ])

  return (
    <div
      className={cn("pointer-events-none absolute overflow-hidden", className)}
      aria-hidden="true"
    >
      <div
        className="absolute inset-0 blur-3xl"
        style={{ opacity: glowOpacity }}
      />
      <canvas ref={canvasRef} className="absolute inset-0 size-full" />
    </div>
  )
}
