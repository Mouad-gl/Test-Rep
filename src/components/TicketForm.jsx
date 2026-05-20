import { useState, useRef, useCallback } from 'react'

const MAX_FILE_SIZE = 8 * 1024 * 1024
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/heic', 'image/heif', 'image/webp']

function compressImage(file) {
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const img = new Image()
      img.onload = () => {
        const MAX = 600
        const scale = Math.min(1, MAX / Math.max(img.width, img.height))
        const canvas = document.createElement('canvas')
        canvas.width = Math.round(img.width * scale)
        canvas.height = Math.round(img.height * scale)
        canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height)
        resolve(canvas.toDataURL('image/jpeg', 0.82))
      }
      img.onerror = () => resolve(e.target.result)
      img.src = e.target.result
    }
    reader.readAsDataURL(file)
  })
}

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
  const window = 60 * 60 * 1000
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

export default function TicketForm({ onSubmit, defaultEmail = '' }) {
  const [fields, setFields] = useState({ fullName: '', email: defaultEmail, github: '' })
  const [avatar, setAvatar] = useState(null)
  const [avatarPreview, setAvatarPreview] = useState(null)
  const [errors, setErrors] = useState({})
  const [dragOver, setDragOver] = useState(false)
  const [captcha, setCaptcha] = useState(generateCaptcha)
  const [captchaInput, setCaptchaInput] = useState('')
  const [honeypot, setHoneypot] = useState('')
  const fileInputRef = useRef(null)

  const processFile = async (file) => {
    if (!file) return
    const errs = { ...errors }
    const isImage = file.type.startsWith('image/') || file.name.match(/\.(heic|heif)$/i)
    if (!isImage) {
      setErrors({ ...errs, avatar: 'Please upload an image file.' })
      return
    }
    if (file.size > MAX_FILE_SIZE) {
      setErrors({ ...errs, avatar: 'File too large. Please upload an image under 8 MB.' })
      return
    }
    delete errs.avatar
    setErrors(errs)
    const dataUrl = await compressImage(file)
    setAvatarPreview(dataUrl)
    setAvatar(file)
  }

  const handleFileChange = (e) => processFile(e.target.files[0])

  const handleDrop = useCallback((e) => {
    e.preventDefault()
    setDragOver(false)
    processFile(e.dataTransfer.files[0])
  }, [])

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
    if (honeypot) return
    if (!checkRateLimit()) {
      setErrors({ form: 'Too many submissions. Please wait an hour before trying again.' })
      return
    }
    const errs = validate()
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
    w-full bg-white/[0.04] border rounded-xl px-4 py-3 text-white placeholder-gray-600 text-sm
    transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent
    ${errors[field] ? 'border-red-400 bg-red-500/5' : 'border-white/[0.08] hover:border-white/20'}
  `

  return (
    <form onSubmit={handleSubmit} noValidate
      className="bg-white/[0.04] backdrop-blur-sm border border-white/[0.08] rounded-2xl p-6 sm:p-8 shadow-2xl"
      aria-label="Conference ticket registration form">
      <div aria-hidden="true" style={{ position: 'absolute', left: '-9999px', opacity: 0, pointerEvents: 'none' }}>
        <label htmlFor="website">Website</label>
        <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off"
          value={honeypot} onChange={(e) => setHoneypot(e.target.value)} />
      </div>

      {errors.form && (
        <div role="alert" className="mb-5 p-3 rounded-xl bg-red-500/10 border border-red-400/30 text-red-400 text-sm text-center">
          {errors.form}
        </div>
      )}

      <div className="mb-6">
        <label className="block text-white text-sm font-semibold mb-2" htmlFor="avatar-upload">Upload Avatar</label>
        {!avatarPreview ? (
          <div role="button" tabIndex={0}
            aria-label="Upload avatar image."
            className={`relative border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all duration-200
              ${dragOver ? 'border-emerald-400 bg-emerald-500/10' : 'border-white/[0.12] bg-white/[0.03] hover:border-emerald-400/50 hover:bg-white/[0.06]'}
              ${errors.avatar ? 'border-red-400' : ''}`}
            onDrop={handleDrop} onDragOver={handleDragOver} onDragLeave={handleDragLeave}
            onClick={() => fileInputRef.current?.click()}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); fileInputRef.current?.click() } }}>
            <input ref={fileInputRef} id="avatar-upload" type="file" accept="image/*"
              className="sr-only" onChange={handleFileChange}
              aria-describedby={errors.avatar ? 'avatar-error' : 'avatar-hint'} />
            <div className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 bg-white/[0.06] rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                </svg>
              </div>
              <p className="text-gray-400 text-sm"><span className="text-emerald-400 font-semibold">Click to upload</span> or drag and drop</p>
              <p className="text-gray-600 text-xs">Any image — auto-compressed</p>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-4 bg-white/[0.04] border border-white/[0.08] rounded-xl p-4">
            <img src={avatarPreview} alt="Avatar preview" className="w-16 h-16 rounded-xl object-cover border-2 border-emerald-400/30 shrink-0" />
            <div className="flex flex-col gap-2">
              <p className="text-white text-sm font-medium">Avatar uploaded!</p>
              <div className="flex gap-3">
                <button type="button" onClick={handleRemoveAvatar} className="text-xs text-red-400 hover:text-red-300 underline underline-offset-2 transition-colors">Remove image</button>
                <button type="button" onClick={() => fileInputRef.current?.click()} className="text-xs text-emerald-400 hover:text-emerald-300 underline underline-offset-2 transition-colors">Change image</button>
              </div>
            </div>
            <input ref={fileInputRef} type="file" accept="image/*" className="sr-only" onChange={handleFileChange} aria-label="Replace avatar image" />
          </div>
        )}
        {errors.avatar
          ? <ErrorMsg id="avatar-error" msg={errors.avatar} />
          : <p id="avatar-hint" className="mt-1.5 text-gray-600 text-xs">Any photo — auto-compressed, works with iOS camera.</p>}
      </div>

      <div className="mb-5">
        <label htmlFor="fullName" className="block text-white text-sm font-semibold mb-1.5">Full Name</label>
        <input id="fullName" name="fullName" type="text" autoComplete="name"
          value={fields.fullName} onChange={handleChange}
          aria-describedby={errors.fullName ? 'fullName-error' : undefined}
          aria-invalid={!!errors.fullName} placeholder="e.g. John Doe" className={inputClass('fullName')} />
        {errors.fullName && <ErrorMsg id="fullName-error" msg={errors.fullName} />}
      </div>

      <div className="mb-5">
        <label htmlFor="email" className="block text-white text-sm font-semibold mb-1.5">Email Address</label>
        <input id="email" name="email" type="email" autoComplete="email"
          value={fields.email} onChange={handleChange}
          readOnly={!!defaultEmail}
          aria-describedby={errors.email ? 'email-error' : 'email-hint'}
          aria-invalid={!!errors.email} placeholder="example@email.com"
          className={`${inputClass('email')} ${defaultEmail ? 'opacity-60 cursor-not-allowed' : ''}`} />
        {errors.email
          ? <ErrorMsg id="email-error" msg={errors.email} />
          : <p id="email-hint" className="mt-1.5 text-gray-600 text-xs">
              {defaultEmail ? 'Email pre-filled from your account.' : "We'll send updates about the event to this address."}
            </p>}
      </div>

      <div className="mb-6">
        <label htmlFor="github" className="block text-white text-sm font-semibold mb-1.5">GitHub Username</label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600 text-sm select-none" aria-hidden="true">@</span>
          <input id="github" name="github" type="text" autoComplete="username"
            value={fields.github} onChange={handleChange}
            aria-describedby={errors.github ? 'github-error' : 'github-hint'}
            aria-invalid={!!errors.github} placeholder="yourusername"
            className={`${inputClass('github')} pl-8`} />
        </div>
        {errors.github
          ? <ErrorMsg id="github-error" msg={errors.github} />
          : <p id="github-hint" className="mt-1.5 text-gray-600 text-xs">Your GitHub handle — no @ needed.</p>}
      </div>

      <div className="mb-7 p-4 rounded-xl bg-white/[0.03] border border-white/[0.08]">
        <p className="text-white text-sm font-semibold mb-3">
          Quick check — what is <span className="text-emerald-400 font-bold">{captcha.a} + {captcha.b}</span>?
        </p>
        <input id="captcha" type="number" inputMode="numeric" value={captchaInput}
          onChange={(e) => { setCaptchaInput(e.target.value); if (errors.captcha) setErrors((p) => { const n = { ...p }; delete n.captcha; return n }) }}
          aria-label={`CAPTCHA: What is ${captcha.a} plus ${captcha.b}?`}
          aria-describedby={errors.captcha ? 'captcha-error' : undefined}
          aria-invalid={!!errors.captcha} placeholder="Enter your answer"
          className={`w-full bg-white/[0.04] border rounded-xl px-4 py-2.5 text-white placeholder-gray-600 text-sm
            focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all
            ${errors.captcha ? 'border-red-400 bg-red-500/5' : 'border-white/[0.08]'}`} />
        {errors.captcha && <ErrorMsg id="captcha-error" msg={errors.captcha} />}
      </div>

      <button type="submit"
        className="w-full bg-emerald-500 hover:bg-emerald-400 active:bg-emerald-600
          text-white font-bold text-sm rounded-xl py-3.5 px-6
          transition-all duration-200 shadow-lg shadow-emerald-500/20
          focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2 focus:ring-offset-[#0d0d0d]">
        Generate My Ticket
      </button>
    </form>
  )
}
