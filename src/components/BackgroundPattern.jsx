export default function BackgroundPattern() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {/* Gradient mesh — kept as-is */}
      <div className="absolute -top-32 -right-32 w-96 h-96 bg-emerald-500 rounded-full opacity-[0.06] blur-3xl" />
      <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-cyan-500 rounded-full opacity-[0.06] blur-3xl" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-emerald-950 rounded-full opacity-20 blur-3xl" />

      {/* Dot grid */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.06]" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="dots" x="0" y="0" width="28" height="28" patternUnits="userSpaceOnUse">
            <circle cx="1" cy="1" r="1" fill="#6ee7b7" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#dots)" />
      </svg>

      {/* Wave pattern — layered on top of dots */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.05]" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
        <defs>
          <pattern id="waves" x="0" y="0" width="200" height="80" patternUnits="userSpaceOnUse">
            <path
              d="M0 40 C25 20 50 20 75 40 C100 60 125 60 150 40 C175 20 187.5 20 200 40"
              fill="none" stroke="#6ee7b7" strokeWidth="1.2"
            />
            <path
              d="M0 60 C25 42 50 42 75 60 C100 78 125 78 150 60 C175 42 187.5 42 200 60"
              fill="none" stroke="#6ee7b7" strokeWidth="0.7" strokeOpacity="0.5"
            />
            <path
              d="M0 20 C25 4 50 4 75 20 C100 36 125 36 150 20 C175 4 187.5 4 200 20"
              fill="none" stroke="#34d399" strokeWidth="0.5" strokeOpacity="0.35"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#waves)" />
      </svg>
    </div>
  )
}
