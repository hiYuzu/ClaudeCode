<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref } from 'vue'

const canvasRef = ref<HTMLCanvasElement | null>(null)

onMounted(() => {
  const canvas = canvasRef.value
  if (!canvas) return
  if (!window.matchMedia('(hover: hover)').matches) return

  const ctx = canvas.getContext('2d')
  if (!ctx) return

  const MASK_RGB = '13, 13, 13'
  const R_START = 6
  const R_END = 100
  const R_VARY = 0.45
  const LIFETIME = 650
  const STAMP_STEP = 10
  const MAX_STAMPS = 200
  const DPR = Math.min(window.devicePixelRatio || 1, 2)

  let w = 0
  let h = 0
  const stamps: { x: number; y: number; born: number; seed: number; rmax: number }[] = []
  let lastX: number | null = null
  let lastY: number | null = null
  let running = false

  function resize() {
    w = window.innerWidth
    h = window.innerHeight
    canvas!.width = Math.round(w * DPR)
    canvas!.height = Math.round(h * DPR)
    canvas!.style.width = w + 'px'
    canvas!.style.height = h + 'px'
    ctx!.setTransform(DPR, 0, 0, DPR, 0, 0)
    fillMask()
  }

  function fillMask() {
    ctx!.globalCompositeOperation = 'source-over'
    ctx!.fillStyle = `rgb(${MASK_RGB})`
    ctx!.fillRect(0, 0, w, h)
  }

  function addStamp(x: number, y: number) {
    if (stamps.length >= MAX_STAMPS) stamps.shift()
    stamps.push({
      x,
      y,
      born: performance.now(),
      seed: Math.random() * Math.PI * 2,
      rmax: R_END * (1 - R_VARY + Math.random() * R_VARY),
    })
  }

  function stampAlong(x: number, y: number) {
    if (lastX === null || lastY === null) {
      addStamp(x, y)
    } else {
      const dx = x - lastX
      const dy = y - lastY
      const dist = Math.hypot(dx, dy)
      const steps = Math.max(1, Math.ceil(dist / STAMP_STEP))
      for (let i = 1; i <= steps; i++) {
        addStamp(lastX + (dx * i) / steps, lastY + (dy * i) / steps)
      }
    }
    lastX = x
    lastY = y
  }

  function carveInk(x: number, y: number, r: number, alpha: number, seed: number) {
    const g = ctx!.createRadialGradient(x, y, r * 0.2, x, y, r)
    g.addColorStop(0, `rgba(0, 0, 0, ${0.95 * alpha})`)
    g.addColorStop(0.5, `rgba(0, 0, 0, ${0.85 * alpha})`)
    g.addColorStop(1, 'rgba(0, 0, 0, 0)')
    ctx!.fillStyle = g
    ctx!.beginPath()
    const segs = 28
    for (let i = 0; i <= segs; i++) {
      const a = (i / segs) * Math.PI * 2
      const wob =
        0.78 +
        0.14 * Math.sin(a * 3 + seed) +
        0.08 * Math.sin(a * 7 + seed * 2.1) +
        0.05 * Math.sin(a * 13 + seed * 0.7)
      const rr = r * wob
      const px = x + Math.cos(a) * rr
      const py = y + Math.sin(a) * rr
      if (i === 0) ctx!.moveTo(px, py)
      else ctx!.lineTo(px, py)
    }
    ctx!.closePath()
    ctx!.fill()
  }

  function loop() {
    const now = performance.now()
    fillMask()
    ctx!.globalCompositeOperation = 'destination-out'
    for (let i = stamps.length - 1; i >= 0; i--) {
      const t = (now - stamps[i].born) / LIFETIME
      if (t >= 1) { stamps.splice(i, 1); continue }
      const ease = 1 - Math.pow(1 - t, 3)
      const r = R_START + (stamps[i].rmax - R_START) * ease
      const alpha = 1 - t * t
      carveInk(stamps[i].x, stamps[i].y, r, alpha, stamps[i].seed)
    }
    if (stamps.length) {
      requestAnimationFrame(loop)
    } else {
      running = false
    }
  }

  function start() {
    if (!running) { running = true; requestAnimationFrame(loop) }
  }

  function onMouseMove(e: MouseEvent) {
    stampAlong(e.clientX, e.clientY)
    start()
  }

  function onMouseLeave() {
    lastX = null
    lastY = null
  }

  resize()
  window.addEventListener('resize', resize)
  document.addEventListener('mousemove', onMouseMove)
  document.addEventListener('mouseleave', onMouseLeave)

  onBeforeUnmount(() => {
    window.removeEventListener('resize', resize)
    document.removeEventListener('mousemove', onMouseMove)
    document.removeEventListener('mouseleave', onMouseLeave)
  })
})
</script>

<template>
  <div class="ink-reveal">
    <div class="ink-reveal__bg" />
    <canvas ref="canvasRef" class="ink-reveal__mask" aria-hidden="true" />
  </div>
</template>

<style scoped>
.ink-reveal {
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
}
.ink-reveal__bg {
  position: absolute;
  inset: 0;
  background-image: url('/bg.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}
.ink-reveal__mask {
  position: absolute;
  inset: 0;
  display: block;
}
</style>
