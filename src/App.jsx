import { useState, useEffect, useMemo } from 'react'
import Header from './components/Header'
import TicketForm from './components/TicketForm'
import TicketCard from './components/TicketCard'
import EventCard from './components/EventCard'
import EventModal from './components/EventModal'
import BackgroundPattern from './components/BackgroundPattern'
import FeaturedSlider from './components/FeaturedSlider'
import { supabase } from './lib/supabase'
import { fallbackEvents, colorForCategory, categories } from './data/events'
import './App.css'

export default function App() {
  const [view, setView] = useState('home')
  const [modalEvent, setModalEvent] = useState(null)
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [formData, setFormData] = useState(null)
  const [activeCategory, setActiveCategory] = useState('All')
  const [activeTag, setActiveTag] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [events, setEvents] = useState(fallbackEvents)
  const [loading, setLoading] = useState(true)
  const [favorites, setFavorites] = useState([])

  useEffect(() => {
    supabase
      .from('events')
      .select('*')
      .order('created_at', { ascending: true })
      .then(({ data, error }) => {
        if (!error && data && data.length > 0) {
          setEvents(data.map((e) => ({
            ...e,
            color: colorForCategory(e.category),
            date: e.date
              ? new Date(e.date + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
              : '',
            date_raw: e.date ?? null,
          })))
        }
        setLoading(false)
      })
  }, [])

  const tagsByCategory = useMemo(() => {
    const map = {}
    events.forEach((e) => {
      const tags = Array.isArray(e.tags) ? e.tags : []
      tags.forEach((t) => {
        if (!map[e.category]) map[e.category] = new Set()
        map[e.category].add(t)
      })
    })
    const result = { All: new Set() }
    Object.entries(map).forEach(([cat, tags]) => {
      result[cat] = [...tags]
      tags.forEach((t) => result.All.add(t))
    })
    result.All = [...result.All]
    return result
  }, [events])

  const filteredEvents = events.filter((e) => {
    const matchCat = activeCategory === 'All' || e.category === activeCategory
    const tags = Array.isArray(e.tags) ? e.tags : []
    const matchTag = !activeTag || tags.includes(activeTag)
    const q = searchQuery.toLowerCase()
    const matchSearch =
      !q ||
      e.title?.toLowerCase().includes(q) ||
      e.location?.toLowerCase().includes(q) ||
      tags.some((t) => t.toLowerCase().includes(q)) ||
      e.description?.toLowerCase().includes(q)
    return matchCat && matchTag && matchSearch
  })

  const handleGetTicket = (event) => {
    setSelectedEvent(event)
    setModalEvent(null)
    setView('form')
  }

  const handleFormSubmit = (data) => {
    setFormData({ ...data, event: selectedEvent })
    setView('ticket')
  }

  const handleBack = () => {
    setView('home')
    setSelectedEvent(null)
    setFormData(null)
  }

  const handleCategoryChange = (cat) => {
    setActiveCategory(cat)
    setActiveTag(null)
  }

  const handleToggleFavorite = (event) => {
    setFavorites((prev) =>
      prev.some((f) => f.id === event.id)
        ? prev.filter((f) => f.id !== event.id)
        : [...prev, event]
    )
  }

  return (
    <div className="relative min-h-screen bg-[#0d0d0d] font-sans">
      <BackgroundPattern />

      <Header
        view={view}
        onNavigateHome={handleBack}
        searchQuery={searchQuery}
        onSearchChange={(q) => { setSearchQuery(q); if (view !== 'home') handleBack() }}
        activeCategory={activeCategory}
        onCategoryChange={handleCategoryChange}
        activeTag={activeTag}
        onTagChange={setActiveTag}
        tagsByCategory={tagsByCategory}
        favorites={favorites}
        onFavoriteClick={(ev) => setModalEvent(ev)}
        onFavoriteRemove={handleToggleFavorite}
      />

      <main className="relative z-10">

        {/* ── HOME ── */}
        {view === 'home' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">

            {!searchQuery && activeCategory === 'All' && !activeTag && (
              <FeaturedSlider events={events} onEventClick={setModalEvent} />
            )}

            <div className="flex items-end justify-between mb-6 gap-4">
              <div>
                <h1 className="text-white text-[28px] sm:text-[36px] font-extrabold leading-tight">
                  {searchQuery
                    ? <>Results for <span className="text-emerald-400">"{searchQuery}"</span></>
                    : activeCategory === 'All'
                    ? <>Upcoming <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">Events</span></>
                    : <>{activeCategory} <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">Events</span></>}
                </h1>
                <p className="text-gray-600 text-sm mt-1">
                  {loading ? 'Loading…' : `${filteredEvents.length} event${filteredEvents.length !== 1 ? 's' : ''}`}
                  {activeTag && <> · <span className="text-gray-500">{activeTag}</span></>}
                </p>
              </div>
              <div className="shrink-0 hidden sm:flex items-center gap-2 text-gray-600 text-sm">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 7.5L7.5 3m0 0L12 7.5M7.5 3v13.5m13.5 0L16.5 21m0 0L12 16.5m4.5 4.5V7.5" />
                </svg>
                <span>Soonest first</span>
              </div>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="rounded-2xl bg-white/[0.03] border border-white/[0.05] animate-pulse" style={{ aspectRatio: '3/4' }} />
                ))}
              </div>
            ) : filteredEvents.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {filteredEvents.map((event) => (
                  <EventCard key={event.id} event={event} onClick={setModalEvent} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <div className="w-14 h-14 rounded-2xl bg-white/[0.04] border border-white/[0.07] flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                  </svg>
                </div>
                <p className="text-gray-500 text-sm">No events match your search.</p>
                <button
                  onClick={() => { setSearchQuery(''); setActiveCategory('All'); setActiveTag(null) }}
                  className="mt-3 text-emerald-400 text-sm hover:underline underline-offset-4"
                >
                  Clear filters
                </button>
              </div>
            )}
          </div>
        )}

        {/* ── FORM ── */}
        {view === 'form' && (
          <div className="max-w-lg mx-auto px-4 sm:px-6 py-8">
            <button
              onClick={handleBack}
              className="flex items-center gap-1.5 text-gray-600 hover:text-gray-400 text-sm mb-6 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
              Back to events
            </button>

            {selectedEvent && (
              <div
                className="flex items-center gap-3 p-3.5 rounded-xl border mb-6"
                style={{ background: `${selectedEvent.color.from}cc`, borderColor: `${selectedEvent.color.accent}25` }}
              >
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 border overflow-hidden"
                  style={{ background: `${selectedEvent.color.accent}15`, borderColor: `${selectedEvent.color.accent}30` }}
                >
                  {selectedEvent.image_url
                    ? <img src={selectedEvent.image_url} alt="" className="w-full h-full object-cover" />
                    : <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke={selectedEvent.color.accent} strokeWidth={1.8}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v3.026a2.999 2.999 0 010 5.198v3.026c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125v-3.026a2.999 2.999 0 010-5.198V6.375c0-.621-.504-1.125-1.125-1.125H3.375z" />
                      </svg>
                  }
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-white text-sm font-semibold truncate">{selectedEvent.title}</p>
                  <p className="text-gray-500 text-xs">{selectedEvent.date} · {selectedEvent.location?.split(',')[0]}</p>
                </div>
                <span
                  className="text-xs font-bold px-2.5 py-1 rounded-full shrink-0"
                  style={{ background: `${selectedEvent.color.accent}20`, color: selectedEvent.color.accent }}
                >
                  {selectedEvent.price}
                </span>
              </div>
            )}

            <div className="mb-6">
              <h1 className="text-white text-[28px] font-extrabold leading-tight">Register for your ticket</h1>
              <p className="text-gray-500 text-sm mt-1">Fill in your details to generate a personalized ticket.</p>
            </div>

            <TicketForm onSubmit={handleFormSubmit} />
          </div>
        )}

        {/* ── TICKET ── */}
        {view === 'ticket' && formData && (
          <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
            <div className="text-center mb-10">
              <h1 className="text-white text-3xl sm:text-4xl font-extrabold leading-tight mb-3">
                Congrats,{' '}
                <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                  {formData.fullName}
                </span>!
              </h1>
              <p className="text-gray-500 text-sm">
                Your ticket for{' '}
                <span className="text-emerald-400 font-semibold">{formData.event?.title ?? 'the event'}</span>{' '}
                is ready. Download or print it below.
              </p>
            </div>
            <TicketCard formData={formData} />
            <div className="flex justify-center mt-8">
              <button
                onClick={handleBack}
                className="text-sm text-gray-600 hover:text-gray-400 underline underline-offset-4 transition-colors"
              >
                ← Browse more events
              </button>
            </div>
          </div>
        )}
      </main>

      {modalEvent && (
        <EventModal
          event={modalEvent}
          onClose={() => setModalEvent(null)}
          onGetTicket={() => handleGetTicket(modalEvent)}
          isFavorited={favorites.some((f) => f.id === modalEvent.id)}
          onToggleFavorite={() => handleToggleFavorite(modalEvent)}
        />
      )}
    </div>
  )
}
