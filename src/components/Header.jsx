import { useState, useRef, useEffect } from 'react'
import { categories } from '../data/events'

function CatIcon({ category }) {
  const p = { className: 'w-4 h-4', fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor', strokeWidth: 1.8 }
  if (category === 'All')
    return <svg {...p}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" /></svg>
  if (category === 'Conference')
    return <svg {...p}><path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" /></svg>
  if (category === 'Summit')
    return <svg {...p}><path strokeLinecap="round" strokeLinejoin="round" d="M3 3l7.5 15 3-6 6 3L3 3z" /></svg>
  if (category === 'Hackathon')
    return <svg {...p}><path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" /></svg>
  if (category === 'Workshop')
    return <svg {...p}><path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437l1.745-1.437m6.615 8.206L15.75 15.75" /></svg>
  return <svg {...p}><path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" /></svg>
}

function FavoritesMenu({ favorites, onEventClick, onRemove }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="relative p-2 rounded-lg text-gray-500 hover:text-rose-400 hover:bg-white/[0.05] transition-colors"
        aria-label="Favorites"
      >
        <svg className="w-5 h-5" fill={favorites.length > 0 ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}
          style={{ color: favorites.length > 0 ? '#f43f5e' : undefined }}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
        </svg>
        {favorites.length > 0 && (
          <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center">
            {favorites.length}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-[#1a1a1a] border border-white/[0.08] rounded-2xl shadow-2xl overflow-hidden z-50">
          <div className="px-4 py-3 border-b border-white/[0.06] flex items-center justify-between">
            <span className="text-white text-sm font-semibold">Saved Events</span>
            <span className="text-gray-600 text-xs">{favorites.length} saved</span>
          </div>

          {favorites.length === 0 ? (
            <div className="py-10 flex flex-col items-center gap-2 text-gray-600">
              <svg className="w-8 h-8 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
              </svg>
              <p className="text-xs">No saved events yet</p>
            </div>
          ) : (
            <ul className="max-h-72 overflow-y-auto divide-y divide-white/[0.04]">
              {favorites.map((ev) => (
                <li key={ev.id} className="flex items-center gap-3 px-4 py-3 hover:bg-white/[0.03] transition-colors">
                  <button
                    className="flex items-center gap-3 flex-1 min-w-0 text-left"
                    onClick={() => { onEventClick(ev); setOpen(false) }}
                  >
                    <div
                      className="w-9 h-9 rounded-lg shrink-0 flex items-center justify-center border"
                      style={{ background: `${ev.color.accent}15`, borderColor: `${ev.color.accent}30` }}
                    >
                      {ev.image_url
                        ? <img src={ev.image_url} alt="" className="w-full h-full object-cover rounded-lg" />
                        : <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke={ev.color.accent} strokeWidth={1.8}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v3.026a2.999 2.999 0 010 5.198v3.026c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125v-3.026a2.999 2.999 0 010-5.198V6.375c0-.621-.504-1.125-1.125-1.125H3.375z" />
                          </svg>
                      }
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-white text-sm font-semibold truncate">{ev.title}</p>
                      <p className="text-gray-600 text-xs truncate">{ev.date}</p>
                    </div>
                  </button>
                  <button
                    onClick={() => onRemove(ev)}
                    className="shrink-0 p-1 text-gray-600 hover:text-rose-400 transition-colors"
                    aria-label="Remove from favorites"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                    </svg>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}

export default function Header({
  view,
  onNavigateHome,
  searchQuery,
  onSearchChange,
  activeCategory,
  onCategoryChange,
  activeTag,
  onTagChange,
  tagsByCategory = {},
  favorites = [],
  onFavoriteClick,
  onFavoriteRemove,
}) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const tags = tagsByCategory[activeCategory] ?? []

  return (
    <header className="sticky top-0 z-40 w-full bg-[#0d0d0d]/95 backdrop-blur-md border-b border-white/[0.07]">

      {/* ── Row 1: Logo + right utilities ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        <button
          onClick={onNavigateHome}
          className="flex items-center gap-2.5 shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30 rounded-lg"
          aria-label="Go to home"
        >
          <img src="/Test-Rep/logo.svg" alt="Coding Conf" className="h-8 w-auto" />
        </button>

        <div className="flex items-center gap-1">
          <button
            className="hidden sm:flex p-2 rounded-lg text-gray-500 hover:text-white hover:bg-white/[0.05] transition-colors"
            aria-label="My tickets"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v3.026a2.999 2.999 0 010 5.198v3.026c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125v-3.026a2.999 2.999 0 010-5.198V6.375c0-.621-.504-1.125-1.125-1.125H3.375z" />
            </svg>
          </button>

          <FavoritesMenu
            favorites={favorites}
            onEventClick={onFavoriteClick}
            onRemove={onFavoriteRemove}
          />

          <button
            onClick={() => setMobileOpen((o) => !o)}
            className="md:hidden p-2 rounded-lg text-gray-500 hover:text-white hover:bg-white/[0.05] transition-colors"
            aria-label="Toggle menu"
          >
            {mobileOpen ? (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* ── Row 2: Category tabs + search ── */}
      <div className="border-t border-white/[0.05]">
        <div
          className="max-w-7xl mx-auto px-4 sm:px-6 h-11 flex items-center gap-1"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {/* Category tabs — scrollable on narrow screens */}
          <div
            className="flex items-center gap-0.5 flex-1 min-w-0 overflow-x-auto"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => { onCategoryChange(cat); view !== 'home' && onNavigateHome() }}
                className={`flex items-center gap-1.5 whitespace-nowrap px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 shrink-0 ${
                  activeCategory === cat
                    ? 'bg-white text-[#0d0d0d] font-semibold shadow-sm'
                    : 'text-gray-400 hover:text-white hover:bg-white/[0.07]'
                }`}
              >
                <CatIcon category={cat} />
                <span className="hidden xs:inline sm:inline">{cat}</span>
              </button>
            ))}
          </div>

          {/* Vertical divider */}
          <div className="hidden sm:block w-px h-5 bg-white/[0.08] shrink-0 mx-2" />

          {/* Search — desktop only, mobile is in drawer */}
          <div className="hidden sm:block shrink-0">
            <div className="relative">
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600 pointer-events-none"
                fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
              <input
                type="search"
                placeholder="Search events…"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                onFocus={() => view !== 'home' && onNavigateHome()}
                className="w-48 bg-white/[0.05] border border-white/[0.08] rounded-lg pl-9 pr-3 py-1.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-emerald-400/50 focus:border-transparent focus:w-64 transition-all duration-300"
              />
            </div>
          </div>
        </div>

        {/* ── Topic tag bar (home only, when tags exist) ── */}
        {view === 'home' && tags.length > 0 && (
          <div
            className="max-w-7xl mx-auto px-4 sm:px-6 pb-2 flex items-center gap-1.5 overflow-x-auto"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {tags.map((tag) => (
              <button
                key={tag}
                onClick={() => onTagChange(activeTag === tag ? null : tag)}
                className={`whitespace-nowrap px-2.5 py-0.5 rounded-full text-xs font-medium transition-all duration-200 shrink-0 border ${
                  activeTag === tag
                    ? 'bg-white/[0.12] text-white border-white/20'
                    : 'text-gray-600 border-transparent hover:text-gray-400 hover:border-white/[0.08]'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ── Mobile drawer ── */}
      {mobileOpen && (
        <div className="md:hidden border-t border-white/[0.07] px-4 py-3 flex flex-col gap-2">
          <div className="relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
            <input
              type="search"
              placeholder="Search events…"
              value={searchQuery}
              onChange={(e) => { onSearchChange(e.target.value); setMobileOpen(false) }}
              onFocus={() => view !== 'home' && onNavigateHome()}
              className="w-full bg-white/[0.05] border border-white/[0.08] rounded-xl pl-9 pr-4 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-emerald-400/50"
            />
          </div>
          <button
            onClick={() => { onNavigateHome(); setMobileOpen(false) }}
            className="text-left px-3 py-2 rounded-lg text-sm text-gray-300 hover:bg-white/[0.05] transition-colors"
          >
            Home
          </button>
          <button className="text-left px-3 py-2 rounded-lg text-sm text-gray-600 cursor-not-allowed" disabled>
            About
          </button>
        </div>
      )}
    </header>
  )
}
