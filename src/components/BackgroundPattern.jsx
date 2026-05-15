export default function BackgroundPattern() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {/* Top-right glow */}
      <div className="absolute -top-32 -right-32 w-96 h-96 bg-orange-500 rounded-full opacity-10 blur-3xl" />
      {/* Bottom-left glow */}
      <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-purple-600 rounded-full opacity-10 blur-3xl" />
      {/* Center subtle glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-900 rounded-full opacity-20 blur-3xl" />

      {/* Squiggly lines pattern using SVG */}
      <svg
        className="absolute inset-0 w-full h-full opacity-[0.07]"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern id="squiggly" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
            <path
              d="M0 30 Q7.5 20 15 30 Q22.5 40 30 30 Q37.5 20 45 30 Q52.5 40 60 30"
              fill="none"
              stroke="#f97316"
              strokeWidth="1.5"
            />
            <path
              d="M0 50 Q7.5 40 15 50 Q22.5 60 30 50 Q37.5 40 45 50 Q52.5 60 60 50"
              fill="none"
              stroke="#f97316"
              strokeWidth="1.5"
            />
            <path
              d="M0 10 Q7.5 0 15 10 Q22.5 20 30 10 Q37.5 0 45 10 Q52.5 20 60 10"
              fill="none"
              stroke="#f97316"
              strokeWidth="1.5"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#squiggly)" />
      </svg>

      {/* Top decorative line dots */}
      <div className="absolute top-0 left-0 right-0 h-px">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute top-0 w-px h-24 bg-gradient-to-b from-orange-500/30 to-transparent"
            style={{ left: `${(i + 1) * 5}%` }}
          />
        ))}
      </div>
    </div>
  )
}
