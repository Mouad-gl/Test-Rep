import { useRef, useEffect, useState, useCallback, forwardRef, useImperativeHandle } from 'react'

const easeOut = (t) => 1 - Math.pow(1 - t, 4)

function seededRand(seed) {
  const s = Math.sin(seed * 9301 + 49297) * 233280
  return s - Math.floor(s)
}

function drawWheel(canvas, segments, config) {
  const ctx = canvas.getContext('2d')
  const size = canvas.width
  const cx = size / 2
  const cy = size / 2
  const r  = size / 2 - 6

  ctx.clearRect(0, 0, size, size)

  const totalProb = segments.reduce((s, seg) => s + Math.max(1, seg.probability ?? 1), 0)

  // ── 1. Fill segments ──────────────────────────────────────────────────────
  let angle = -Math.PI / 2  // start at 12 o'clock
  segments.forEach((seg) => {
    const arc = (Math.max(1, seg.probability ?? 1) / totalProb) * Math.PI * 2

    ctx.beginPath()
    ctx.moveTo(cx, cy)
    ctx.arc(cx, cy, r, angle, angle + arc)
    ctx.closePath()
    ctx.fillStyle = seg.color || '#22c55e'
    ctx.fill()

    angle += arc
  })

  // ── 2. Ragged divider lines ───────────────────────────────────────────────
  angle = -Math.PI / 2
  segments.forEach((seg, idx) => {
    const arc = (Math.max(1, seg.probability ?? 1) / totalProb) * Math.PI * 2
    const NUM  = 16
    const perp = angle + Math.PI / 2

    ctx.beginPath()
    ctx.moveTo(cx, cy)
    for (let i = 1; i <= NUM; i++) {
      const t    = i / NUM
      const dist = r * t
      const bx   = cx + Math.cos(angle) * dist
      const by   = cy + Math.sin(angle) * dist
      const rand = seededRand(idx * 100 + i) - 0.5
      const off  = rand * 12 * Math.sin(Math.PI * t)
      ctx.lineTo(bx + Math.cos(perp) * off, by + Math.sin(perp) * off)
    }
    ctx.strokeStyle = 'rgba(0,0,0,0.88)'
    ctx.lineWidth   = 4
    ctx.lineJoin    = 'round'
    ctx.stroke()

    angle += arc
  })

  // ── 3. Labels ─────────────────────────────────────────────────────────────
  angle = -Math.PI / 2
  segments.forEach((seg) => {
    const arc     = (Math.max(1, seg.probability ?? 1) / totalProb) * Math.PI * 2
    const midAngle = angle + arc / 2
    const dist     = r * 0.67

    ctx.save()
    ctx.translate(cx + Math.cos(midAngle) * dist, cy + Math.sin(midAngle) * dist)
    ctx.rotate(midAngle + Math.PI / 2)
    ctx.textAlign    = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillStyle    = '#ffffff'
    ctx.font         = `bold ${Math.max(10, size / 26)}px Inter, ui-sans-serif, sans-serif`
    ctx.shadowColor  = 'rgba(0,0,0,0.9)'
    ctx.shadowBlur   = 8
    ctx.fillText(seg.label ?? '', 0, 0)
    ctx.restore()

    angle += arc
  })

  // ── 4. Outer ring ─────────────────────────────────────────────────────────
  ctx.beginPath()
  ctx.arc(cx, cy, r, 0, Math.PI * 2)
  ctx.strokeStyle = config?.wheel_border_color ?? '#ffffff'
  ctx.lineWidth   = 6
  ctx.stroke()

  // ── 5. Center hub ─────────────────────────────────────────────────────────
  const hubR = size / 16
  ctx.beginPath()
  ctx.arc(cx, cy, hubR, 0, Math.PI * 2)
  ctx.fillStyle = config?.wheel_center_color ?? '#ffffff'
  ctx.fill()
  ctx.strokeStyle = 'rgba(0,0,0,0.25)'
  ctx.lineWidth   = 2
  ctx.stroke()
}

// ─────────────────────────────────────────────────────────────────────────────

const LuckyWheel = forwardRef(function LuckyWheel(
  { segments, config, onResult, disabled, size = 380 },
  ref,
) {
  const canvasRef  = useRef(null)
  const wrapperRef = useRef(null)
  const rotRef     = useRef(0)
  const animRef    = useRef(null)
  const [spinning, setSpinning] = useState(false)

  useEffect(() => {
    const canvas = canvasRef.current
    if (canvas && segments.length) drawWheel(canvas, segments, config)
  }, [segments, config])

  const pickWinner = useCallback(() => {
    const total = segments.reduce((s, seg) => s + Math.max(1, seg.probability ?? 1), 0)
    let r = Math.random() * total
    for (let i = 0; i < segments.length; i++) {
      r -= Math.max(1, segments[i].probability ?? 1)
      if (r <= 0) return i
    }
    return segments.length - 1
  }, [segments])

  const spin = useCallback(() => {
    if (spinning || disabled || !segments.length) return

    const winIndex = pickWinner()
    const total    = segments.reduce((s, seg) => s + Math.max(1, seg.probability ?? 1), 0)

    // Center angle of winning segment from 12 o'clock (degrees, clockwise)
    let angleToWin = 0
    for (let i = 0; i < winIndex; i++) {
      angleToWin += (Math.max(1, segments[i].probability ?? 1) / total) * 360
    }
    angleToWin += (Math.max(1, segments[winIndex].probability ?? 1) / total) * 360 / 2

    // Bring winning segment to 12 o'clock pointer
    const currentMod = ((rotRef.current % 360) + 360) % 360
    const targetMod  = (360 - angleToWin % 360 + 360) % 360
    const delta      = (targetMod - currentMod + 360) % 360
    const extraSpins = (5 + Math.floor(Math.random() * 4)) * 360
    const target     = rotRef.current + extraSpins + delta

    const duration  = 5000 + Math.random() * 1500
    const startTime = performance.now()
    const startRot  = rotRef.current

    setSpinning(true)

    const animate = (now) => {
      const t   = Math.min((now - startTime) / duration, 1)
      const cur = startRot + (target - startRot) * easeOut(t)
      rotRef.current = cur
      if (wrapperRef.current) wrapperRef.current.style.transform = `rotate(${cur}deg)`

      if (t < 1) {
        animRef.current = requestAnimationFrame(animate)
      } else {
        rotRef.current = target
        setSpinning(false)
        onResult?.(segments[winIndex])
      }
    }

    animRef.current = requestAnimationFrame(animate)
  }, [spinning, disabled, segments, pickWinner, onResult])

  useEffect(() => () => cancelAnimationFrame(animRef.current), [])

  useImperativeHandle(ref, () => ({ spin }), [spin])

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>

      {/* ── Pointer ── */}
      <div className="absolute left-1/2 -translate-x-1/2 z-20" style={{ top: -22 }}>
        <svg
          width="38" height="46" viewBox="0 0 38 46"
          style={{ filter: 'drop-shadow(0 3px 6px rgba(0,0,0,0.6))' }}
        >
          <polygon points="19,46 1,6 37,6" fill="#4b5563" />
          <polygon points="19,40 7,12 31,12" fill="#9ca3af" />
        </svg>
      </div>

      {/* ── Spinning wheel ── */}
      <div
        ref={wrapperRef}
        style={{
          width:       size,
          height:      size,
          willChange:  'transform',
          borderRadius: '50%',
          filter:      spinning
            ? 'drop-shadow(0 0 28px rgba(34,197,94,0.5))'
            : 'drop-shadow(0 6px 24px rgba(0,0,0,0.6))',
          transition:  'filter 0.4s ease',
        }}
      >
        <canvas ref={canvasRef} width={size} height={size} style={{ display: 'block' }} />
      </div>

    </div>
  )
})

export default LuckyWheel
