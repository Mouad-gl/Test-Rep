import { useState, useEffect } from 'react'

function getTarget(dateRaw, time) {
  if (!dateRaw) return null
  const timeStr = time && /^\d{2}:\d{2}/.test(time) ? time : '00:00:00'
  const dt = new Date(`${dateRaw}T${timeStr}`)
  return isNaN(dt.getTime()) ? null : dt
}

function getCountdown(target) {
  const diff = target - Date.now()
  if (diff <= 0) return null
  const d = Math.floor(diff / 86400000)
  const h = Math.floor((diff % 86400000) / 3600000)
  const m = Math.floor((diff % 3600000) / 60000)
  const s = Math.floor((diff % 60000) / 1000)
  return { d, h, m, s }
}

export default function CountdownTimer({ dateRaw, time, accent }) {
  const target = getTarget(dateRaw, time)
  const [countdown, setCountdown] = useState(target ? getCountdown(target) : null)

  useEffect(() => {
    if (!target) return
    const id = setInterval(() => setCountdown(getCountdown(target)), 1000)
    return () => clearInterval(id)
  }, [target])

  if (!target || !countdown) return null

  const pad = (n) => String(n).padStart(2, '0')
  const color = accent ?? '#6ee7b7'

  const units = [
    { label: 'DAYS', value: countdown.d },
    { label: 'HRS',  value: countdown.h },
    { label: 'MIN',  value: countdown.m },
    { label: 'SEC',  value: countdown.s },
  ]

  return (
    <div className="flex flex-col items-center gap-1">
      <p className="text-gray-600 text-[10px] uppercase tracking-widest mb-1">Event starts in</p>
      <div className="flex items-center gap-1">
        {units.map(({ label, value }, i) => (
          <div key={label} className="flex items-center gap-1">
            <div className="flex flex-col items-center">
              <span
                className="font-mono font-bold text-lg leading-none tabular-nums"
                style={{ color }}
              >
                {pad(value)}
              </span>
              <span className="text-gray-600 text-[9px] tracking-widest mt-0.5">{label}</span>
            </div>
            {i < units.length - 1 && (
              <span className="font-mono font-bold text-lg leading-none mb-3" style={{ color, opacity: 0.5 }}>:</span>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
