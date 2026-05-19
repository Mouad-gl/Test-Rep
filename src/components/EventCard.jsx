function CategoryIcon({ category, color }) {
  const props = { fill: 'none', viewBox: '0 0 24 24', stroke: color, strokeWidth: 1.8, className: 'w-5 h-5' }
  if (category === 'Conference')
    return <svg {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" /></svg>
  if (category === 'Summit')
    return <svg {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M3 3l7.5 15 3-6 6 3L3 3z" /></svg>
  if (category === 'Hackathon')
    return <svg {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" /></svg>
  if (category === 'Workshop')
    return <svg {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437l1.745-1.437m6.615 8.206L15.75 15.75" /></svg>
  return <svg {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" /></svg>
}

export default function EventCard({ event, onClick }) {
  const color = event.color
  const hasImage = !!event.image_url

  return (
    <button
      onClick={() => onClick(event)}
      className="group w-full text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 rounded-2xl"
      aria-label={`View details for ${event.title}`}
    >
      {/* ── Category row ── */}
      <div className="flex items-center gap-2.5 mb-3 px-0.5">
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 border"
          style={{ background: `${color.accent}18`, borderColor: `${color.accent}40` }}
        >
          <CategoryIcon category={event.category} color={color.accent} />
        </div>
        <span className="text-white text-sm font-bold tracking-wide uppercase truncate">
          {event.category}
        </span>
      </div>

      {/* ── Poster / banner ── */}
      <div
        className="relative w-full overflow-hidden rounded-xl mb-4"
        style={{
          aspectRatio: '3 / 2',
          background: hasImage
            ? '#111'
            : `linear-gradient(145deg, ${color.from} 0%, ${color.to} 100%)`,
        }}
      >
        {hasImage ? (
          <img
            src={event.image_url}
            alt={event.title}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <>
            <svg className="absolute inset-0 w-full h-full opacity-[0.1]" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id={`pc-${event.id}`} x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M0 20 Q5 12 10 20 Q15 28 20 20 Q25 12 30 20 Q35 28 40 20" fill="none" stroke={color.accent} strokeWidth="1.2"/>
                  <path d="M0 36 Q5 28 10 36 Q15 44 20 36 Q25 28 30 36 Q35 44 40 36" fill="none" stroke={color.accent} strokeWidth="1.2"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill={`url(#pc-${event.id})`} />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center" aria-hidden="true">
              <div className="w-32 h-32 rounded-full blur-3xl transition-transform duration-500 group-hover:scale-125" style={{ background: color.glow }} />
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center border transition-transform duration-300 group-hover:scale-110"
                style={{ background: `${color.accent}15`, borderColor: `${color.accent}35` }}
              >
                <CategoryIcon category={event.category} color={color.accent} />
              </div>
            </div>
          </>
        )}

        {/* Price badge */}
        <div className="absolute top-3 right-3">
          <span className="bg-black/50 backdrop-blur-sm text-white text-xs font-bold px-2.5 py-1 rounded-full">
            {event.price}
          </span>
        </div>
      </div>

      {/* ── Title ── */}
      <h3 className="text-white font-bold text-[20px] leading-snug mb-3 line-clamp-1 px-0.5">
        {event.title}
      </h3>

      {/* ── Meta ── */}
      <div className="space-y-1.5 px-0.5 mb-4">
        <div className="flex items-center gap-2 text-gray-400 text-base">
          <svg className="w-4 h-4 shrink-0 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
          </svg>
          <span className="truncate">{event.location}</span>
        </div>
        <div className="flex items-start gap-2 text-gray-400 text-base">
          <svg className="w-4 h-4 shrink-0 text-gray-600 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
          </svg>
          <div>
            <span>{event.date} · {event.time}</span>
            <div className="mt-0.5">
              <span className="text-gray-500 text-xs">starting from </span>
              <span className="text-[20px] font-bold text-emerald-400">{event.price}</span>
            </div>
          </div>
        </div>
      </div>
    </button>
  )
}
