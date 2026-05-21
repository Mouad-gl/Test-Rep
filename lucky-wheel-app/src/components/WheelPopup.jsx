import { useEffect, useRef } from 'react'

export default function WheelPopup({ reward, popup, onClose }) {
  const cardRef = useRef(null)

  useEffect(() => {
    cardRef.current?.focus()
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const message = (popup.win_message ?? 'Congratulations! You have won {reward}!')
    .replace('{reward}', reward?.label ?? '')

  const hasExternalLink = popup.button_url && popup.button_url !== '#'

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/75 backdrop-blur-md" onClick={onClose} />

      {/* Card */}
      <div
        ref={cardRef}
        tabIndex={-1}
        className="relative z-10 w-full max-w-sm rounded-2xl overflow-hidden outline-none
                   animate-[fadeUp_0.3s_ease]"
        style={{
          background: popup.background_image
            ? `url(${popup.background_image}) center/cover no-repeat`
            : (popup.background_color ?? '#111827'),
        }}
      >
        {/* Readability overlay when bg image is set */}
        {popup.background_image && (
          <div className="absolute inset-0 bg-black/55 pointer-events-none" />
        )}

        {/* Top glow bar */}
        <div
          className="absolute top-0 left-0 right-0 h-1"
          style={{ background: popup.button_color ?? '#22c55e' }}
        />

        <div className="relative z-10 flex flex-col items-center px-8 py-10 text-center gap-5">

          {/* Trophy icon */}
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center text-4xl
                       ring-4 ring-white/10"
            style={{ background: `${popup.button_color ?? '#22c55e'}22` }}
          >
            🏆
          </div>

          {/* Title */}
          <h2 className="text-white text-3xl font-extrabold leading-tight drop-shadow-lg">
            {popup.win_title ?? 'You Won!'}
          </h2>

          {/* Message */}
          <p className="text-gray-200 text-base leading-relaxed">
            {message}
          </p>

          {/* Reward badge */}
          {reward?.label && (
            <div
              className="px-6 py-2.5 rounded-full font-bold text-white text-xl tracking-wide"
              style={{
                background:  `${popup.button_color ?? '#22c55e'}33`,
                border:      `2px solid ${popup.button_color ?? '#22c55e'}88`,
                color:       popup.button_color ?? '#22c55e',
              }}
            >
              {reward.label}
            </div>
          )}

          {/* CTA button */}
          <a
            href={popup.button_url ?? '#'}
            target={hasExternalLink ? '_blank' : undefined}
            rel="noopener noreferrer"
            className="w-full py-4 rounded-xl font-extrabold text-white text-lg tracking-wide
                       uppercase transition-all hover:scale-105 active:scale-95 shadow-xl"
            style={{
              background:  popup.button_color ?? '#22c55e',
              boxShadow:   `0 8px 32px ${popup.button_color ?? '#22c55e'}44`,
            }}
          >
            {popup.button_text ?? 'Claim Reward'}
          </a>

          <button
            onClick={onClose}
            className="text-gray-500 text-sm hover:text-gray-300 transition-colors"
          >
            Maybe later
          </button>
        </div>
      </div>

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px) scale(0.96); }
          to   { opacity: 1; transform: translateY(0)    scale(1);    }
        }
      `}</style>
    </div>
  )
}
