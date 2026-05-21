import { useRef, useState, useEffect } from 'react'
import LuckyWheel from '../components/LuckyWheel'
import WheelPopup from '../components/WheelPopup'
import { useWheelConfig } from '../hooks/useWheelConfig'

export default function WheelPage({ onBack }) {
  const { segments, config, popup, loading } = useWheelConfig()
  const [isSpinning, setIsSpinning] = useState(false)
  const [reward,     setReward]     = useState(null)
  const [wheelSize,  setWheelSize]  = useState(380)
  const wheelRef    = useRef(null)
  const containerRef = useRef(null)

  useEffect(() => {
    const update = () => {
      if (containerRef.current) {
        setWheelSize(Math.min(380, containerRef.current.clientWidth - 32))
      }
    }
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  const canSpin = !isSpinning && !reward && !loading

  const handleSpin = () => {
    if (!canSpin) return
    setIsSpinning(true)
    wheelRef.current?.spin()
  }

  const handleResult = (segment) => {
    setIsSpinning(false)
    setReward(segment)
  }

  const handleClosePopup = () => setReward(null)

  return (
    <div
      className="relative min-h-screen flex flex-col items-center justify-between overflow-hidden select-none"
      style={
        config.background_image
          ? { backgroundImage: `url(${config.background_image})`, backgroundSize: 'cover', backgroundPosition: 'center' }
          : { backgroundColor: '#0d0d0d' }
      }
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/55 pointer-events-none" />

      {/* Back button */}
      {onBack && (
        <button
          onClick={onBack}
          className="absolute top-4 left-4 z-20 flex items-center gap-1.5 text-white/50
                     hover:text-white text-sm transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>
      )}

      {/* ── Main content ── */}
      <div
        ref={containerRef}
        className="relative z-10 flex flex-col items-center w-full flex-1 py-10 px-4 gap-8"
      >

        {/* Logo */}
        {config.logo_image ? (
          <img
            src={config.logo_image}
            alt="Logo"
            className="h-24 object-contain drop-shadow-2xl"
            draggable={false}
          />
        ) : (
          <div className="h-8" />
        )}

        {/* Wheel area */}
        {loading ? (
          <div
            className="rounded-full bg-white/5 animate-pulse border border-white/10"
            style={{ width: wheelSize, height: wheelSize }}
          />
        ) : (
          <div className="flex flex-col items-center gap-8">
            <LuckyWheel
              ref={wheelRef}
              segments={segments}
              config={config}
              onResult={handleResult}
              disabled={!canSpin}
              size={wheelSize}
            />

            {/* Spin button */}
            <button
              onClick={handleSpin}
              disabled={!canSpin}
              className="px-14 py-4 rounded-full font-extrabold text-white text-xl
                         uppercase tracking-widest transition-all
                         hover:scale-105 active:scale-95
                         disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              style={{
                background:  config.spin_button_color ?? '#22c55e',
                boxShadow:   `0 0 36px ${config.spin_button_color ?? '#22c55e'}55`,
              }}
            >
              {isSpinning ? '…' : (config.spin_button_text ?? 'SPIN')}
            </button>
          </div>
        )}
      </div>

      {/* ── Store buttons ── */}
      {config.show_store_buttons && !loading && (
        <div className="relative z-10 flex gap-3 pb-8 px-4 flex-wrap justify-center">

          {config.apple_store_url && (
            <a href={config.apple_store_url} target="_blank" rel="noopener noreferrer">
              <div className="flex items-center gap-3 px-5 py-3 rounded-xl border border-white/20
                              bg-black/60 text-white hover:bg-black/80 transition-colors">
                <svg className="w-7 h-7 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                </svg>
                <div className="text-right">
                  <div className="text-xs opacity-60">تنزيل من</div>
                  <div className="text-sm font-bold">App Store</div>
                </div>
              </div>
            </a>
          )}

          {config.google_play_url && (
            <a href={config.google_play_url} target="_blank" rel="noopener noreferrer">
              <div className="flex items-center gap-3 px-5 py-3 rounded-xl border border-white/20
                              bg-black/60 text-white hover:bg-black/80 transition-colors">
                <svg className="w-7 h-7 shrink-0" viewBox="0 0 512 512" fill="none">
                  <path d="M48 436V76a20 20 0 0132-16l352 180a20 20 0 010 36L80 452a20 20 0 01-32-16z" fill="#34A853"/>
                  <path d="M48 76l168 168L48 436V76z" fill="#4285F4"/>
                  <path d="M48 76l168 168-56 56L48 220V76z" fill="#FBBC04"/>
                  <path d="M216 244l-56 56 240 152-184-208z" fill="#EA4335"/>
                </svg>
                <div className="text-right">
                  <div className="text-xs opacity-60">احصل عليه من</div>
                  <div className="text-sm font-bold">Google Play</div>
                </div>
              </div>
            </a>
          )}
        </div>
      )}

      {/* ── Reward Popup ── */}
      {reward && (
        <WheelPopup reward={reward} popup={popup} onClose={handleClosePopup} />
      )}
    </div>
  )
}
