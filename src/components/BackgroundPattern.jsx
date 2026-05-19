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

    </div>
  )
}
