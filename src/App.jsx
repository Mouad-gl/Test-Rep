import { useState } from 'react'
import TicketForm from './components/TicketForm'
import TicketCard from './components/TicketCard'
import EventCard from './components/EventCard'
import EventModal from './components/EventModal'
import BackgroundPattern from './components/BackgroundPattern'
import { events, categories } from './data/events'
import './App.css'

export default function App() {
  const [view, setView] = useState('home') // 'home' | 'form' | 'ticket'
  const [modalEvent, setModalEvent] = useState(null)
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [formData, setFormData] = useState(null)
  const [activeCategory, setActiveCategory] = useState('All')

  const filteredEvents = activeCategory === 'All'
    ? events
    : events.filter((e) => e.category === activeCategory)

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

  return (
    <div className="relative min-h-screen bg-[#0d0d0d] overflow-hidden font-sans">
      <BackgroundPattern />

      <div className="relative z-10 flex flex-col items-center min-h-screen px-4 py-10">

        {/* Logo */}
        <div className="mb-10 flex items-center gap-3">
          <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-9 h-9">
            <polygon points="18,4 32,28 4,28" fill="none" stroke="#6ee7b7" strokeWidth="2.5" strokeLinejoin="round"/>
            <polygon points="18,11 27,25 9,25" fill="#6ee7b7" opacity="0.35"/>
            <line x1="18" y1="4" x2="18" y2="28" stroke="#6ee7b7" strokeWidth="1.5" opacity="0.6"/>
          </svg>
          <span className="text-white text-xl font-bold tracking-widest uppercase">coding conf</span>
        </div>

        {/* ── HOME VIEW ── */}
        {view === 'home' && (
          <div className="w-full max-w-6xl">
            {/* Hero */}
            <div className="text-center mb-10 px-2">
              <h1 className="text-white text-4xl sm:text-5xl font-extrabold leading-tight mb-4">
                Upcoming <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">Events</span>
              </h1>
              <p className="text-gray-500 text-base sm:text-lg max-w-xl mx-auto">
                Discover conferences, workshops, hackathons, and meetups for developers worldwide.
              </p>
            </div>

            {/* Category filters */}
            <div className="flex items-center gap-2 flex-wrap justify-center mb-8">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 border ${
                    activeCategory === cat
                      ? 'bg-emerald-500 border-emerald-500 text-white shadow-lg shadow-emerald-500/20'
                      : 'bg-white/[0.04] border-white/[0.08] text-gray-400 hover:border-white/20 hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Events grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredEvents.map((event) => (
                <EventCard key={event.id} event={event} onClick={setModalEvent} />
              ))}
            </div>

            {filteredEvents.length === 0 && (
              <div className="text-center py-20 text-gray-600">
                No events in this category yet.
              </div>
            )}
          </div>
        )}

        {/* ── FORM VIEW ── */}
        {view === 'form' && (
          <div className="w-full max-w-lg">
            {/* Back */}
            <button
              onClick={handleBack}
              className="flex items-center gap-1.5 text-gray-600 hover:text-gray-400 text-sm mb-6 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
              Back to events
            </button>

            {/* Event context banner */}
            {selectedEvent && (
              <div
                className="flex items-center gap-4 p-4 rounded-xl border mb-6"
                style={{
                  background: `${selectedEvent.color.from}cc`,
                  borderColor: `${selectedEvent.color.accent}25`,
                }}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border"
                  style={{ background: `${selectedEvent.color.accent}15`, borderColor: `${selectedEvent.color.accent}30` }}
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke={selectedEvent.color.accent} strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v3.026a2.999 2.999 0 010 5.198v3.026c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125v-3.026a2.999 2.999 0 010-5.198V6.375c0-.621-.504-1.125-1.125-1.125H3.375z" />
                  </svg>
                </div>
                <div className="min-w-0">
                  <p className="text-white text-sm font-semibold truncate">{selectedEvent.title}</p>
                  <p className="text-gray-500 text-xs">{selectedEvent.date} · {selectedEvent.location.split(',')[0]}</p>
                </div>
                <span
                  className="text-xs font-bold px-2.5 py-1 rounded-full shrink-0 ml-auto"
                  style={{ background: `${selectedEvent.color.accent}20`, color: selectedEvent.color.accent }}
                >
                  {selectedEvent.price}
                </span>
              </div>
            )}

            <div className="text-center mb-8 px-2">
              <h1 className="text-white text-3xl font-extrabold leading-tight mb-3">
                Register for your ticket
              </h1>
              <p className="text-gray-500 text-sm">
                Fill in your details to generate a personalized ticket.
              </p>
            </div>

            <TicketForm onSubmit={handleFormSubmit} />
          </div>
        )}

        {/* ── TICKET VIEW ── */}
        {view === 'ticket' && formData && (
          <div className="w-full max-w-2xl">
            <div className="text-center mb-10 px-2">
              <h1 className="text-white text-3xl sm:text-4xl font-extrabold leading-tight mb-4">
                Congrats,{' '}
                <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                  {formData.fullName}
                </span>
                !
              </h1>
              <p className="text-gray-500 text-base">
                Your ticket for{' '}
                <span className="text-emerald-400 font-semibold">{formData.event?.title ?? 'the event'}</span>{' '}
                is ready.
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
      </div>

      {/* Event Modal */}
      {modalEvent && (
        <EventModal
          event={modalEvent}
          onClose={() => setModalEvent(null)}
          onGetTicket={() => handleGetTicket(modalEvent)}
        />
      )}
    </div>
  )
}
