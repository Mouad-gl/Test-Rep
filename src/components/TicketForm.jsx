import { useState, useRef, useCallback } from 'react'

const MAX_FILE_SIZE = 500 * 1024
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif']

function generateCaptcha() {
  const a = Math.floor(Math.random() * 10) + 1
  const b = Math.floor(Math.random() * 10) + 1
  return { a, b, answer: a + b }
}

function generateTicketNumber() {
  return Math.floor(Math.random() * 900000 + 100000).toString().padStart(6, '0')
}

function checkRateLimit() {
  const key = 'cc_submissions'
  const now = Date.now()
  const window = 60 * 60 * 1000 // 1 hour
  const stored = JSON.parse(localStorage.getItem(key) || '[]')
  const recent = stored.filter((t) => now - t < window)
  if (recent.length >= 3) return false
  localStorage.setItem(key, JSON.stringify([...recent, now]))
  return true
}

function ErrorMsg({ id, msg }) {
  return (
    <p id={id} role="alert" className="mt-1.5 text-red-400 text-xs flex items-center gap-1">
      <svg className="w-3.5 h-3.5 shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
      </svg>
      {msg}
    </p>
  )
}

export default function TicketForm({ onSubmit }) {
  const [fields, setFields] = useState({ fullName: '', email: '', github: '' })
  const [avatar, setAvatar] = useState(null)
  const [avatarPreview, setAvatarPreview] = useState(null)
  const [errors, setErrors] = useState({})
  const [dragOver, setDragOver] = useState(false)
  const [captcha, setCaptcha] = useState(generateCaptcha)
  const [captchaInput, setCaptchaInput] = useState('')
  const [honeypot, setHoneypot] = useState('')
  const fileInputRef = useRef(null)

  const processFile = (file) => {
    if (!file) return
    const errs = { ...errors }
    if (!ALLOWED_TYPES.includes(file.type)) {
      setErrors({ ...errs, avatar: 'Please upload a JPG, PNG, or GIF image.' })
      return
    }
    if (file.size > MAX_FILE_SIZE) {
      setErrors({ ...errs, avatar: 'File too large. Please upload an image under 500KB.' })
      return
    }
    delete errs.avatar
    setErrors(errs)
    const reader = new FileReader()
    reader.onload = (e) => { setAvatarPreview(e.target.result); setAvatar(file) }
    reader.readAsDataURL(file)
  }

  const handleFileChange = (e) => processFile(e.target.files[0])

  const handleDrop = useCallback((e) => {
    e.preventDefault()
    setDragOver(false)
    processFile(e.dataTransfer.files[0])
  }, [errors])

  const handleDragOver = (e) => { e.preventDefault(); setDragOver(true) }
  const handleDragLeave = () => setDragOver(false)

  const handleRemoveAvatar = () => {
    setAvatar(null)
    setAvatarPreview(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFields((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors((prev) => { const n = { ...prev }; delete n[name]; return n })
  }

  const validate = () => {
    const errs = {}
    if (!fields.fullName.trim()) errs.fullName = 'Full name is required.'
    if (!fields.email.trim()) errs.email = 'Email address is required.'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)) errs.email = 'Please enter a valid email address.'
    if (!fields.github.trim()) errs.github = 'GitHub username is required.'
    if (!avatar) errs.avatar = 'Please upload an avatar image.'
    return errs
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    // Honeypot — silent drop if bot filled the hidden field
    if (honeypot) return

    // Rate limiting
    if (!checkRateLimit()) {
      setErrors({ form: 'Too many submissions. Please wait an hour before trying again.' })
      return
    }

    const errs = validate()

    // Math CAPTCHA
    if (captchaInput.trim() === '' || parseInt(captchaInput, 10) !== captcha.answer) {
      errs.captcha = 'Incorrect answer — please try again.'
      setCaptcha(generateCaptcha())
      setCaptchaInput('')
    }

    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      const firstKey = Object.keys(errs)[0]
      document.getElementById(firstKey)?.focus()
      return
    }

    const ticketNumber = generateTicketNumber()
    const github = fields.github.startsWith('@') ? fields.github : `@${fields.github}`
    onSubmit({ ...fields, github, avatarPreview, ticketNumber })
  }

  const inputClass = (field) => `
    w-full bg-white/5 border rounded-xl px-4 py-3 text-white placeholder-[#7a6e8a] text-sm
    transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent
    ${errors[field] ? 'border-red-400 bg-red-500/5' : 'border-white/10 hover:border-white/20'}
  `

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 sm:p-8 shadow-2xl"
      aria-label="Conference ticket registration form"
    >
      {/* Honeypot — hidden from real users, bots fill it */}
      <div aria-hidden="true" style={{ position: 'absolute', left: '-9999px', opacity: 0, pointerEvents: 'none' }}>
        <label htmlFor="website">Website</label>
        <input
          id="website"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
        />
      </div>

      {/* Global form error */}
      {errors.form && (
        <div role="alert" className="mb-5 p-3 rounded-xl bg-red-500/10 border border-red-400/30 text-red-400 text-sm text-center">
          {errors.form}
        </div>
      )}

      {/* Avatar Upload */}
      <div className="mb-6">
        <label className="block text-white text-sm font-semibold mb-2" htmlFor="avatar-upload">
          Upload Avatar
        </label>
        {!avatarPreview ? (
          <div
            role="button"
            tabIndex={0}
            aria-label="Upload avatar image. Click or drag and drop a JPG, PNG, or GIF under 500KB."
            className={`relative border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all duration-200
              ${dragOver ? 'border-orange-400 bg-orange-500/10' : 'border-white/20 bg-white/5 hover:border-orange-400/60 hover:bg-white/10'}
              ${errors.avatar ? 'border-red-400' : ''}`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => fileInputRef.current?.click()}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); fileInputRef.current?.click() } }}
          >
            <input ref={fileInputRef} id="avatar-upload" type="file" accept="image/jpeg,image/png,image/gif"
              className="sr-only" onChange={handleFileChange}
              aria-describedby={errors.avatar ? 'avatar-error' : 'avatar-hint'} />
            <div className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-[#b8a9c9]" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                </svg>
              </div>
              <p className="text-[#b8a9c9] text-sm">
                <span className="text-orange-400 font-semibold">Click to upload</span> or drag and drop
              </p>
              <p className="text-[#7a6e8a] text-xs">JPG, PNG, GIF — max 500KB</p>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-xl p-4">
            <img src={avatarPreview} alt="Avatar preview" className="w-16 h-16 rounded-xl object-cover border-2 border-orange-400/40" />
            <div className="flex flex-col gap-2">
              <p className="text-white text-sm font-medium">Avatar uploaded!</p>
              <div className="flex gap-3">
                <button type="button" onClick={handleRemoveAvatar} className="text-xs text-red-400 hover:text-red-300 underline underline-offset-2 transition-colors">Remove image</button>
                <button type="button" onClick={() => fileInputRef.current?.click()} className="text-xs text-orange-400 hover:text-orange-300 underline underline-offset-2 transition-colors">Change image</button>
              </div>
            </div>
            <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/gif" className="sr-only" onChange={handleFileChange} aria-label="Replace avatar image" />
          </div>
        )}
        {errors.avatar
          ? <ErrorMsg id="avatar-error" msg={errors.avatar} />
          : <p id="avatar-hint" className="mt-1.5 text-[#7a6e8a] text-xs">Upload your photo (JPG, PNG, GIF — max 500KB).</p>}
      </div>

      {/* Full Name */}
      <div className="mb-5">
        <label htmlFor="fullName" className="block text-white text-sm font-semibold mb-1.5">Full Name</label>
        <input id="fullName" name="fullName" type="text" autoComplete="name"
          value={fields.fullName} onChange={handleChange}
          aria-describedby={errors.fullName ? 'fullName-error' : undefined}
          aria-invalid={!!errors.fullName} placeholder="e.g. John Doe" className={inputClass('fullName')} />
        {errors.fullName && <ErrorMsg id="fullName-error" msg={errors.fullName} />}
      </div>

      {/* Email */}
      <div className="mb-5">
        <label htmlFor="email" className="block text-white text-sm font-semibold mb-1.5">Email Address</label>
        <input id="email" name="email" type="email" autoComplete="email"
          value={fields.email} onChange={handleChange}
          aria-describedby={errors.email ? 'email-error' : 'email-hint'}
          aria-invalid={!!errors.email} placeholder="example@email.com" className={inputClass('email')} />
        {errors.email
          ? <ErrorMsg id="email-error" msg={errors.email} />
          : <p id="email-hint" className="mt-1.5 text-[#7a6e8a] text-xs">We'll send your ticket confirmation to this address.</p>}
      </div>

      {/* GitHub Username */}
      <div className="mb-6">
        <label htmlFor="github" className="block text-white text-sm font-semibold mb-1.5">GitHub Username</label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7a6e8a] text-sm select-none" aria-hidden="true">@</span>
          <input id="github" name="github" type="text" autoComplete="username"
            value={fields.github} onChange={handleChange}
            aria-describedby={errors.github ? 'github-error' : 'github-hint'}
            aria-invalid={!!errors.github} placeholder="yourusername"
            className={`${inputClass('github')} pl-8`} />
        </div>
        {errors.github
          ? <ErrorMsg id="github-error" msg={errors.github} />
          : <p id="github-hint" className="mt-1.5 text-[#7a6e8a] text-xs">Your GitHub handle — no @ needed.</p>}
      </div>

      {/* Math CAPTCHA */}
      <div className="mb-7 p-4 rounded-xl bg-white/5 border border-white/10">
        <p className="text-white text-sm font-semibold mb-3">
          Quick check — what is{' '}
          <span className="text-orange-400 font-bold">{captcha.a} + {captcha.b}</span>?
        </p>
        <input
          id="captcha"
          type="number"
          inputMode="numeric"
          value={captchaInput}
          onChange={(e) => { setCaptchaInput(e.target.value); if (errors.captcha) setErrors((p) => { const n = { ...p }; delete n.captcha; return n }) }}
          aria-label={`CAPTCHA: What is ${captcha.a} plus ${captcha.b}?`}
          aria-describedby={errors.captcha ? 'captcha-error' : undefined}
          aria-invalid={!!errors.captcha}
          placeholder="Enter your answer"
          className={`w-full bg-white/5 border rounded-xl px-4 py-2.5 text-white placeholder-[#7a6e8a] text-sm
            focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all
            ${errors.captcha ? 'border-red-400 bg-red-500/5' : 'border-white/10'}`}
        />
        {errors.captcha && <ErrorMsg id="captcha-error" msg={errors.captcha} />}
      </div>

      <button
        type="submit"
        className="w-full bg-orange-500 hover:bg-orange-400 active:bg-orange-600
          text-white font-bold text-base rounded-xl py-3.5 px-6
          transition-all duration-200 shadow-lg shadow-orange-500/20
          focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2 focus:ring-offset-[#1a1025]"
      >
        Generate My Ticket
      </button>
    </form>
  )
}
