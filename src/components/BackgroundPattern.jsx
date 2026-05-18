export default function BackgroundPattern() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      <div className="absolute -top-32 -right-32 w-96 h-96 bg-emerald-500 rounded-full opacity-[0.06] blur-3xl" />
      <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-cyan-500 rounded-full opacity-[0.06] blur-3xl" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-emerald-950 rounded-full opacity-20 blur-3xl" />

      <svg className="absolute inset-0 w-full h-full opacity-[0.04]" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="squiggly" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M0 30 Q7.5 20 15 30 Q22.5 40 30 30 Q37.5 20 45 30 Q52.5 40 60 30"
              fill="none" stroke="#6ee7b7" strokeWidth="1.5"/>
            <path d="M0 50 Q7.5 40 15 50 Q22.5 60 30 50 Q37.5 40 45 50 Q52.5 60 60 50"
              fill="none" stroke="#6ee7b7" strokeWidth="1.5"/>
            <path d="M0 10 Q7.5 0 15 10 Q22.5 20 30 10 Q37.5 0 45 10 Q52.5 20 60 10"
              fill="none" stroke="#6ee7b7" strokeWidth="1.5"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#squiggly)" />
      </svg>
    </div>
  )
}
