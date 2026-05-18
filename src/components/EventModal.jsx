import { useEffect } from 'react'

function CategoryIcon({ category, color }) {
  const cls = 'w-8 h-8'
  if (category === 'Conference')
    return (
      <svg className={cls} fill="none" viewBox="0 0 24 24" stroke={color} strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
      </svg>
    )
  if (category === 'Summit')
    return (
      <svg className={cls} fill="none" viewBox="0 0 24 24" stroke={color} strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 3l7.5 15 3-6 6 3L3 3z" />
      </svg>
    )
  if (category === 'Hackathon')
    return (
      <svg className={cls} fill="none" viewBox="0 0 24 24" stroke={color} strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
      </svg>
    )
  if (category === 'Workshop')
    return (
      <svg className={cls} fill="none" viewBox="0 0 24 24" stroke={color} strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437l1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008z" />
      </svg>
    )
  return (
    <svg className={cls} fill="none" viewBox="0 0 24 24" stroke={color} strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
    </svg>
  )
}

export default function EventModal({ event, onClose, onGetTicket }) {
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8"
      role="dialog"
      aria-modal="true"
      aria-label={event.title}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-3xl bg-[#131313] border border-white/[0.08] rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">

        {/* Close button */}
        <button
          onClick={onClose}
          aria-label="Close event details"
          className="absolute top-4 right-4 z-20 w-8 h-8 bg-white/[0.08] hover:bg-white/[0.15] rounded-lg flex items-center justify-center text-gray-400 hover:text-white transition-all"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="flex flex-col sm:flex-row overflow-y-auto">

          {/* Left: Square banner */}
          <div
            className="w-full sm:w-64 shrink-0 relative"
            style={{
              background: `linear-gradient(145deg, ${event.color.from} 0%, ${event.color.to} 100%)`,
              minHeight: '240px',
            }}
          >
            {/* SVG pattern */}
            <svg className="absolute inset-0 w-full h-full opacity-[0.1]" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="mp" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M0 20 Q5 12 10 20 Q15 28 20 20 Q25 12 30 20 Q35 28 40 20" fill="none" stroke={event.color.accent} strokeWidth="1.2"/>
                  <path d="M0 36 Q5 28 10 36 Q15 44 20 36 Q25 28 30 36 Q35 44 40 36" fill="none" stroke={event.color.accent} strokeWidth="1.2"/>
                  <path d="M0 4 Q5 -4 10 4 Q15 12 20 4 Q25 -4 30 4 Q35 12 40 4" fill="none" stroke={event.color.accent} strokeWidth="1.2"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#mp)" />
            </svg>

            {/* Glow */}
            <div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-36 h-36 rounded-full blur-3xl"
              style={{ background: event.color.glow }}
            />

            {/* Center icon */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div
                className="w-20 h-20 rounded-2xl flex items-center justify-center border"
                style={{ background: `${event.color.accent}12`, borderColor: `${event.color.accent}35` }}
              >
                <CategoryIcon category={event.category} color={event.color.accent} />
              </div>
            </div>

            {/* Category badge bottom */}
            <div className="absolute bottom-4 left-0 right-0 flex justify-center">
              <span
                className="text-xs font-semibold px-3 py-1 rounded-full"
                style={{ background: `${event.color.accent}20`, color: event.color.accent }}
              >
                {event.category}
              </span>
            </div>
          </div>

          {/* Right: Details */}
          <div className="flex-1 p-6 sm:p-8 flex flex-col">

            {/* Back link */}
            <button
              onClick={onClose}
              className="flex items-center gap-1.5 text-gray-600 hover:text-gray-400 text-xs mb-5 transition-colors w-fit"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
              Back to events
            </button>

            <h2 className="text-white text-2xl font-extrabold leading-tight mb-5">{event.title}</h2>

            {/* Meta */}
            <div className="space-y-2.5 mb-5">
              <div className="flex items-start gap-3 text-gray-400 text-sm">
                <svg className="w-4 h-4 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                </svg>
                <span>{event.date} &nbsp;·&nbsp; {event.time}</span>
              </div>
              <div className="flex items-start gap-3 text-gray-400 text-sm">
                <svg className="w-4 h-4 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                </svg>
                <span>{event.location}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v3.026a2.999 2.999 0 010 5.198v3.026c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125v-3.026a2.999 2.999 0 010-5.198V6.375c0-.621-.504-1.125-1.125-1.125H3.375z" />
                </svg>
                <span className="font-bold" style={{ color: event.color.accent }}>{event.price}</span>
              </div>
            </div>

            {/* Description */}
            <p className="text-gray-400 text-sm leading-relaxed mb-5">{event.description}</p>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-7">
              {event.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs px-2.5 py-1 rounded-lg bg-white/[0.05] border border-white/[0.07] text-gray-500"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* CTA */}
            <button
              onClick={onGetTicket}
              className="mt-auto w-full py-3.5 px-6 rounded-xl font-bold text-sm text-white transition-all duration-200 hover:opacity-90 active:scale-[0.98]"
              style={{
                background: event.color.button,
                boxShadow: `0 8px 24px ${event.color.glow}`,
              }}
            >
              Get Your Ticket →
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
