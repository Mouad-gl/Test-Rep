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

  const units = [
    { value: countdown.d },
    { value: countdown.h },
    { value: countdown.m },
    { value: countdown.s },
  ]

  return (
    <div className="flex items-center gap-1.5">
      {units.map(({ value }, i) => (
        <div key={i} className="flex items-center gap-1.5">
          <div className="bg-[#222] rounded-lg px-3 py-2 min-w-[52px] flex items-center justify-center">
            <span className="font-sans font-bold text-2xl leading-none tabular-nums text-gray-300">
              {pad(value)}
            </span>
          </div>
          {i < units.length - 1 && (
            <span className="font-sans font-bold text-xl text-gray-600 leading-none">:</span>
          )}
        </div>
      ))}
    </div>
  )
}
