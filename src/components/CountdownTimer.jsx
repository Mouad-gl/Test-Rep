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
    <div className="flex items-center gap-1">
      {units.map(({ value }, i) => (
        <div key={i} className="flex items-center gap-1">
          <div className="bg-[#222] rounded-lg px-2 py-1.5 sm:px-3 sm:py-2 min-w-[36px] sm:min-w-[52px] flex items-center justify-center">
            <span className="font-sans font-bold text-base sm:text-2xl leading-none tabular-nums text-gray-300">
              {pad(value)}
            </span>
          </div>
          {i < units.length - 1 && (
            <span className="font-sans font-bold text-base sm:text-xl text-gray-600 leading-none">:</span>
          )}
        </div>
      ))}
    </div>
  )
}
