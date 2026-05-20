import { useState, useEffect, useRef } from 'react'

export default function FeaturedSlider({ events, onEventClick }) {
  const slides = events.slice(0, 3)
  const [current, setCurrent] = useState(0)
  const [paused, setPaused] = useState(false)
  const timerRef = useRef(null)

  const go = (idx) => setCurrent((idx + slides.length) % slides.length)

  useEffect(() => {
    if (paused || slides.length < 2) return
    timerRef.current = setInterval(() => setCurrent((c) => (c + 1) % slides.length), 4000)
    return () => clearInterval(timerRef.current)
  }, [paused, slides.length])

  if (slides.length === 0) return null

  return (
    <div
      className="relative w-full overflow-hidden rounded-2xl mb-8 aspect-[4/3] sm:aspect-[21/7]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Slides */}
      <div
        className="flex h-full transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {slides.map((event) => (
          <div key={event.id} className="relative w-full h-full shrink-0">
            {event.image_url ? (
              <img
                src={event.image_url}
                alt={event.title}
                className="absolute inset-0 w-full h-full object-cover"
              />
            ) : (
              <div
                className="absolute inset-0"
                style={{ background: `linear-gradient(135deg, ${event.color.from} 0%, ${event.color.to} 100%)` }}
              />
            )}

            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

            {/* Content */}
            <div className="absolute inset-0 flex flex-col justify-end p-4 sm:p-10">
              <span
                className="text-xs font-semibold px-2.5 py-1 rounded-full w-fit mb-2"
                style={{ background: `${event.color.accent}30`, color: event.color.accent }}
              >
                {event.category}
              </span>
              <h2 className="text-white font-extrabold text-xl sm:text-4xl leading-tight mb-1.5 drop-shadow-lg">
                {event.title}
              </h2>
              <p className="text-gray-300 text-xs sm:text-base mb-3">
                {event.date}{event.location ? ` · ${event.location.split(',')[0]}` : ''}
              </p>
              <button
                onClick={() => onEventClick(event)}
                className="px-4 py-2 sm:px-6 sm:py-2.5 rounded-xl font-bold text-xs sm:text-sm text-white w-fit transition-all duration-200 hover:opacity-90 active:scale-[0.98]"
                style={{ background: event.color.button, boxShadow: `0 6px 20px ${event.color.glow}` }}
              >
                View Event →
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Arrows */}
      {slides.length > 1 && (
        <>
          <button
            onClick={() => go(current - 1)}
            className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/40 hover:bg-black/70 backdrop-blur-sm flex items-center justify-center text-white transition-all"
            aria-label="Previous"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={() => go(current + 1)}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/40 hover:bg-black/70 backdrop-blur-sm flex items-center justify-center text-white transition-all"
            aria-label="Next"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}

      {/* Dots */}
      {slides.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => go(i)}
              className="rounded-full transition-all duration-300"
              style={{
                width: i === current ? '24px' : '8px',
                height: '8px',
                background: i === current ? 'white' : 'rgba(255,255,255,0.35)',
              }}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
