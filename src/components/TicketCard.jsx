import { useRef, useState } from 'react'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'

function GithubIcon({ className = '' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
    </svg>
  )
}

export default function TicketCard({ formData }) {
  const { fullName, email, github, avatarPreview } = formData
  const ticketNumber = useRef(
    Math.floor(Math.random() * 900000 + 100000).toString().padStart(6, '0')
  )
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0, brightness: 1 })
  const [downloading, setDownloading] = useState(false)
  const cardRef = useRef(null)

  const handleMouseMove = (e) => {
    const card = cardRef.current
    if (!card) return
    const rect = card.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    const x = (e.clientX - cx) / (rect.width / 2)
    const y = (e.clientY - cy) / (rect.height / 2)
    setTilt({
      rotateX: -y * 8,
      rotateY: x * 8,
      brightness: 1 + Math.abs(x) * 0.05,
    })
  }

  const handleMouseLeave = () => {
    setTilt({ rotateX: 0, rotateY: 0, brightness: 1 })
  }

  const handleDownloadPDF = async () => {
    const card = cardRef.current
    if (!card || downloading) return
    setDownloading(true)
    const prev = card.style.transform
    card.style.transform = 'none'
    try {
      const canvas = await html2canvas(card, { scale: 3, useCORS: true, backgroundColor: null })
      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF({ orientation: 'landscape', unit: 'px', format: [canvas.width / 3, canvas.height / 3] })
      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width / 3, canvas.height / 3)
      pdf.save(`coding-conf-2025-ticket-${ticketNumber.current}.pdf`)
    } finally {
      card.style.transform = prev
      setDownloading(false)
    }
  }

  const displayGithub = github.startsWith('@') ? github : `@${github}`

  return (
    <div
      className="perspective-[1200px] cursor-pointer select-none"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <article
        ref={cardRef}
        aria-label={`Conference ticket for ${fullName}`}
        className="relative w-full rounded-2xl overflow-hidden transition-transform duration-100 ease-out shadow-2xl"
        style={{
          transform: `rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg)`,
          filter: `brightness(${tilt.brightness})`,
          transformStyle: 'preserve-3d',
          background: 'linear-gradient(135deg, #2a1a3e 0%, #1e1030 40%, #0e0820 100%)',
          boxShadow: '0 25px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.07)',
        }}
      >
        {/* Background pattern inside ticket */}
        <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
          <svg className="absolute inset-0 w-full h-full opacity-[0.06]" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="ticket-squiggly" x="0" y="0" width="50" height="50" patternUnits="userSpaceOnUse">
                <path d="M0 25 Q6.25 15 12.5 25 Q18.75 35 25 25 Q31.25 15 37.5 25 Q43.75 35 50 25"
                  fill="none" stroke="#f97316" strokeWidth="1.5"/>
                <path d="M0 45 Q6.25 35 12.5 45 Q18.75 55 25 45 Q31.25 35 37.5 45 Q43.75 55 50 45"
                  fill="none" stroke="#f97316" strokeWidth="1.5"/>
                <path d="M0 5 Q6.25 -5 12.5 5 Q18.75 15 25 5 Q31.25 -5 37.5 5 Q43.75 15 50 5"
                  fill="none" stroke="#f97316" strokeWidth="1.5"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#ticket-squiggly)" />
          </svg>
          {/* Glow top-right */}
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-orange-500 rounded-full opacity-10 blur-3xl" />
        </div>

        <div className="relative z-10 p-6 sm:p-8">
          {/* Top row: event info + logo */}
          <div className="flex items-start justify-between mb-8 gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-7 h-7 shrink-0">
                  <polygon points="18,4 32,28 4,28" fill="none" stroke="#f97316" strokeWidth="2.5" strokeLinejoin="round"/>
                  <polygon points="18,11 27,25 9,25" fill="#f97316" opacity="0.4"/>
                  <line x1="18" y1="4" x2="18" y2="28" stroke="#f97316" strokeWidth="1.5" opacity="0.7"/>
                </svg>
                <span className="text-white text-lg font-bold tracking-widest uppercase">coding conf</span>
              </div>
              <p className="text-[#b8a9c9] text-sm">Jan 31, 2025 / Austin, TX</p>
            </div>

            <div
              className="text-[#4a3a5e] font-black text-6xl sm:text-7xl font-sans leading-none select-none"
              aria-hidden="true"
              style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)', letterSpacing: '0.05em' }}
            >
              #{ ticketNumber.current }
            </div>
          </div>

          {/* Dashed divider */}
          <div className="relative my-0" aria-hidden="true">
            <div className="border-t-2 border-dashed border-white/10 relative">
              <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-6 h-6 bg-[#1a1025] rounded-full" />
              <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-6 h-6 bg-[#1a1025] rounded-full" />
            </div>
          </div>

          {/* Bottom row: avatar + name + github */}
          <div className="mt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              {avatarPreview ? (
                <img
                  src={avatarPreview}
                  alt={`${fullName}'s avatar`}
                  className="w-14 h-14 rounded-xl object-cover border-2 border-orange-400/30 shrink-0"
                />
              ) : (
                <div className="w-14 h-14 rounded-xl bg-orange-500/20 border-2 border-orange-400/30 flex items-center justify-center shrink-0">
                  <span className="text-orange-400 text-xl font-bold">
                    {fullName.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
              <div>
                <p className="text-white text-lg font-bold leading-tight">{fullName}</p>
                <a
                  href={`https://github.com/${github.replace('@', '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-[#b8a9c9] text-sm hover:text-orange-400 transition-colors"
                  aria-label={`GitHub profile of ${displayGithub}`}
                >
                  <GithubIcon className="w-4 h-4" />
                  {displayGithub}
                </a>
              </div>
            </div>

            {/* Ticket number bottom-right for small screens */}
            <div className="hidden sm:block text-right">
              <p className="text-[#4a3a5e] text-xs uppercase tracking-widest mb-0.5">Ticket No.</p>
              <p className="text-[#7a6e8a] font-mono font-bold text-base">#{ticketNumber.current}</p>
            </div>
          </div>
        </div>
      </article>

      <p className="text-center text-[#7a6e8a] text-xs mt-4" aria-live="polite">
        Move your mouse over the ticket to see the 3D effect
      </p>

      <div className="flex justify-center mt-5">
        <button
          onClick={handleDownloadPDF}
          disabled={downloading}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-orange-500 hover:bg-orange-400 active:bg-orange-600 text-white font-semibold text-sm transition-colors duration-200 disabled:opacity-60 disabled:cursor-not-allowed shadow-lg shadow-orange-500/20"
        >
          {downloading ? (
            <>
              <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z"/>
              </svg>
              Generating PDF…
            </>
          ) : (
            <>
              <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd"/>
              </svg>
              Download Ticket PDF
            </>
          )}
        </button>
      </div>
    </div>
  )
}
