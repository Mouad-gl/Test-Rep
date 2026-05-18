import { useState } from 'react'
import { categories, tagsByCategory } from '../data/events'

export default function Header({
  view,
  onNavigateHome,
  searchQuery,
  onSearchChange,
  activeCategory,
  onCategoryChange,
  activeTag,
  onTagChange,
}) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const tags = tagsByCategory[activeCategory] ?? []

  return (
    <header className="sticky top-0 z-40 w-full bg-[#0d0d0d]/95 backdrop-blur-md border-b border-white/[0.07]">

      {/* ── Top row ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center gap-3">

        {/* Logo */}
        <button
          onClick={onNavigateHome}
          className="flex items-center gap-2.5 shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 rounded-lg"
          aria-label="Go to home"
        >
          <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-7 h-7">
            <polygon points="18,4 32,28 4,28" fill="none" stroke="#6ee7b7" strokeWidth="2.5" strokeLinejoin="round"/>
            <polygon points="18,11 27,25 9,25" fill="#6ee7b7" opacity="0.35"/>
            <line x1="18" y1="4" x2="18" y2="28" stroke="#6ee7b7" strokeWidth="1.5" opacity="0.6"/>
          </svg>
          <span className="text-white font-bold tracking-widest uppercase text-sm hidden sm:block">
            coding conf
          </span>
        </button>

        {/* Nav links (desktop) */}
        <nav className="hidden md:flex items-center gap-0.5 ml-2" aria-label="Main navigation">
          <button
            onClick={onNavigateHome}
            className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
              view === 'home'
                ? 'text-white bg-white/[0.08]'
                : 'text-gray-500 hover:text-white hover:bg-white/[0.05]'
            }`}
          >
            Home
          </button>
          <button className="px-3 py-1.5 rounded-lg text-sm text-gray-500 hover:text-white hover:bg-white/[0.05] transition-colors cursor-not-allowed opacity-50" disabled>
            About
          </button>
        </nav>

        {/* Search bar */}
        <div className="flex-1 min-w-0 mx-2">
          <div className="relative max-w-lg">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600 pointer-events-none"
              fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
            <input
              type="search"
              placeholder="Search events, topics, locations…"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              onFocus={() => view !== 'home' && onNavigateHome()}
              className="w-full bg-white/[0.05] border border-white/[0.08] rounded-xl pl-9 pr-4 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-emerald-400/50 focus:border-transparent transition-all"
            />
          </div>
        </div>

        {/* Mobile menu button */}
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

      {/* ── Mobile nav dropdown ── */}
      {mobileOpen && (
        <div className="md:hidden border-t border-white/[0.07] px-4 py-3 flex flex-col gap-1">
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

      {/* ── Category bar (home only) ── */}
      {view === 'home' && (
        <div className="border-t border-white/[0.05]">
          <div
            className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex items-center gap-2 overflow-x-auto"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            <span className="text-gray-600 text-xs font-medium shrink-0 mr-1 hidden sm:block">Categories</span>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => onCategoryChange(cat)}
                className={`whitespace-nowrap px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 border shrink-0 ${
                  activeCategory === cat
                    ? 'bg-emerald-500 border-emerald-500 text-white shadow-sm shadow-emerald-500/30'
                    : 'bg-transparent border-white/[0.08] text-gray-500 hover:text-white hover:border-white/20'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* ── Subcategory / tag bar ── */}
          {tags.length > 0 && (
            <div
              className="max-w-7xl mx-auto px-4 sm:px-6 pb-2.5 flex items-center gap-2 overflow-x-auto"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              <span className="text-gray-700 text-xs font-medium shrink-0 mr-1 hidden sm:block">Topics</span>
              {tags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => onTagChange(activeTag === tag ? null : tag)}
                  className={`whitespace-nowrap px-3 py-1 rounded-full text-xs font-medium transition-all duration-200 shrink-0 ${
                    activeTag === tag
                      ? 'bg-white/[0.12] text-white border border-white/20'
                      : 'text-gray-600 hover:text-gray-400 border border-transparent hover:border-white/[0.08]'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </header>
  )
}
