import { useState } from 'react'
import TicketForm from './components/TicketForm'
import TicketCard from './components/TicketCard'
import BackgroundPattern from './components/BackgroundPattern'
import './App.css'

export default function App() {
  const [submitted, setSubmitted] = useState(false)
  const [formData, setFormData] = useState(null)

  const handleSubmit = (data) => {
    setFormData(data)
    setSubmitted(true)
  }

  return (
    <div className="relative min-h-screen bg-[#0d0d0d] overflow-hidden font-sans">
      <BackgroundPattern />

      <div className="relative z-10 flex flex-col items-center justify-start min-h-screen px-4 py-10">
        {/* Logo */}
        <div className="mb-8 flex items-center gap-3">
          <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-9 h-9">
            <polygon points="18,4 32,28 4,28" fill="none" stroke="#6ee7b7" strokeWidth="2.5" strokeLinejoin="round"/>
            <polygon points="18,11 27,25 9,25" fill="#6ee7b7" opacity="0.35"/>
            <line x1="18" y1="4" x2="18" y2="28" stroke="#6ee7b7" strokeWidth="1.5" opacity="0.6"/>
          </svg>
          <span className="text-white text-xl font-bold tracking-widest uppercase">coding conf</span>
        </div>

        {!submitted ? (
          <div className="w-full max-w-lg">
            <div className="text-center mb-8 px-2">
              <h1 className="text-white text-3xl sm:text-4xl font-extrabold leading-tight mb-4">
                Your Journey to Coding Conf 2025 Starts Here!
              </h1>
              <p className="text-gray-400 text-base sm:text-lg">
                Secure your spot at next year's biggest coding conference.
              </p>
            </div>
            <TicketForm onSubmit={handleSubmit} />
          </div>
        ) : (
          <div className="w-full max-w-2xl">
            <div className="text-center mb-10 px-2">
              <h1 className="text-white text-3xl sm:text-4xl font-extrabold leading-tight mb-4">
                Congrats,{' '}
                <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                  {formData.fullName}
                </span>
                ! Your ticket is ready.
              </h1>
              <p className="text-gray-400 text-base sm:text-lg">
                We'll send updates in the run up to the event.
              </p>
            </div>
            <TicketCard formData={formData} />
          </div>
        )}
      </div>
    </div>
  )
}
