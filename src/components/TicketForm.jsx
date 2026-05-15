import { useState, useRef, useCallback } from 'react'

const MAX_FILE_SIZE = 500 * 1024 // 500KB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif']

export default function TicketForm({ onSubmit }) {
  const [fields, setFields] = useState({
    fullName: '',
    email: '',
    github: '',
  })
  const [avatar, setAvatar] = useState(null)
  const [avatarPreview, setAvatarPreview] = useState(null)
  const [errors, setErrors] = useState({})
  const [dragOver, setDragOver] = useState(false)
  const fileInputRef = useRef(null)

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

  const processFile = (file) => {
    if (!file) return
    const newErrors = { ...errors }

    if (!ALLOWED_TYPES.includes(file.type)) {
      newErrors.avatar = 'Please upload a JPG, PNG, or GIF image.'
      setErrors(newErrors)
      return
    }
    if (file.size > MAX_FILE_SIZE) {
      newErrors.avatar = 'File too large. Please upload an image under 500KB.'
      setErrors(newErrors)
      return
    }

    delete newErrors.avatar
    setErrors(newErrors)

    const reader = new FileReader()
    reader.onload = (e) => {
      setAvatarPreview(e.target.result)
      setAvatar(file)
    }
    reader.readAsDataURL(file)
  }

  const handleFileChange = (e) => {
    processFile(e.target.files[0])
  }

  const handleDrop = useCallback((e) => {
    e.preventDefault()
    setDragOver(false)
    processFile(e.dataTransfer.files[0])
  }, [errors])

  const handleDragOver = (e) => {
    e.preventDefault()
    setDragOver(true)
  }

  const handleDragLeave = () => setDragOver(false)

  const handleRemoveAvatar = () => {
    setAvatar(null)
    setAvatarPreview(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFields((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev }
        delete next[name]
        return next
      })
    }
  }

  const validate = () => {
    const newErrors = {}
    if (!fields.fullName.trim()) newErrors.fullName = 'Full name is required.'
    if (!fields.email.trim()) {
      newErrors.email = 'Email address is required.'
    } else if (!validateEmail(fields.email)) {
      newErrors.email = 'Please enter a valid email address.'
    }
    if (!fields.github.trim()) {
      newErrors.github = 'GitHub username is required.'
    }
    if (!avatar) newErrors.avatar = 'Please upload an avatar image.'
    return newErrors
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const newErrors = validate()
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      const firstErrorKey = Object.keys(newErrors)[0]
      const el = document.getElementById(firstErrorKey)
      if (el) el.focus()
      return
    }
    onSubmit({ ...fields, avatarPreview })
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 sm:p-8 shadow-2xl"
      aria-label="Conference ticket registration form"
    >
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
            className={`
              relative border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all duration-200
              ${dragOver
                ? 'border-orange-400 bg-orange-500/10'
                : 'border-white/20 bg-white/5 hover:border-orange-400/60 hover:bg-white/10'
              }
              ${errors.avatar ? 'border-red-400' : ''}
            `}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => fileInputRef.current?.click()}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                fileInputRef.current?.click()
              }
            }}
          >
            <input
              ref={fileInputRef}
              id="avatar-upload"
              type="file"
              accept="image/jpeg,image/png,image/gif"
              className="sr-only"
              onChange={handleFileChange}
              aria-describedby={errors.avatar ? 'avatar-error' : 'avatar-hint'}
            />
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
            <img
              src={avatarPreview}
              alt="Avatar preview"
              className="w-16 h-16 rounded-xl object-cover border-2 border-orange-400/40"
            />
            <div className="flex flex-col gap-2">
              <p className="text-white text-sm font-medium">Avatar uploaded!</p>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={handleRemoveAvatar}
                  className="text-xs text-red-400 hover:text-red-300 underline underline-offset-2 transition-colors"
                >
                  Remove image
                </button>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-xs text-orange-400 hover:text-orange-300 underline underline-offset-2 transition-colors"
                >
                  Change image
                </button>
              </div>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/gif"
              className="sr-only"
              onChange={handleFileChange}
              aria-label="Replace avatar image"
            />
          </div>
        )}

        {errors.avatar && (
          <p id="avatar-error" role="alert" className="mt-2 text-red-400 text-xs flex items-center gap-1">
            <svg className="w-3.5 h-3.5 shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
            </svg>
            {errors.avatar}
          </p>
        )}
        {!errors.avatar && (
          <p id="avatar-hint" className="mt-1.5 text-[#7a6e8a] text-xs">
            Upload your photo (JPG, PNG, GIF — max 500KB).
          </p>
        )}
      </div>

      {/* Full Name */}
      <div className="mb-5">
        <label htmlFor="fullName" className="block text-white text-sm font-semibold mb-1.5">
          Full Name
        </label>
        <input
          id="fullName"
          name="fullName"
          type="text"
          autoComplete="name"
          value={fields.fullName}
          onChange={handleChange}
          aria-describedby={errors.fullName ? 'fullName-error' : undefined}
          aria-invalid={!!errors.fullName}
          placeholder="e.g. John Doe"
          className={`
            w-full bg-white/5 border rounded-xl px-4 py-3 text-white placeholder-[#7a6e8a] text-sm
            transition-all duration-200
            focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent
            ${errors.fullName ? 'border-red-400 bg-red-500/5' : 'border-white/10 hover:border-white/20'}
          `}
        />
        {errors.fullName && (
          <p id="fullName-error" role="alert" className="mt-1.5 text-red-400 text-xs flex items-center gap-1">
            <svg className="w-3.5 h-3.5 shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
            </svg>
            {errors.fullName}
          </p>
        )}
      </div>

      {/* Email */}
      <div className="mb-5">
        <label htmlFor="email" className="block text-white text-sm font-semibold mb-1.5">
          Email Address
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          value={fields.email}
          onChange={handleChange}
          aria-describedby={errors.email ? 'email-error' : 'email-hint'}
          aria-invalid={!!errors.email}
          placeholder="example@email.com"
          className={`
            w-full bg-white/5 border rounded-xl px-4 py-3 text-white placeholder-[#7a6e8a] text-sm
            transition-all duration-200
            focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent
            ${errors.email ? 'border-red-400 bg-red-500/5' : 'border-white/10 hover:border-white/20'}
          `}
        />
        {errors.email ? (
          <p id="email-error" role="alert" className="mt-1.5 text-red-400 text-xs flex items-center gap-1">
            <svg className="w-3.5 h-3.5 shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
            </svg>
            {errors.email}
          </p>
        ) : (
          <p id="email-hint" className="mt-1.5 text-[#7a6e8a] text-xs">
            We'll send your ticket confirmation to this address.
          </p>
        )}
      </div>

      {/* GitHub Username */}
      <div className="mb-7">
        <label htmlFor="github" className="block text-white text-sm font-semibold mb-1.5">
          GitHub Username
        </label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7a6e8a] text-sm select-none" aria-hidden="true">@</span>
          <input
            id="github"
            name="github"
            type="text"
            autoComplete="username"
            value={fields.github}
            onChange={handleChange}
            aria-describedby={errors.github ? 'github-error' : 'github-hint'}
            aria-invalid={!!errors.github}
            placeholder="yourusername"
            className={`
              w-full bg-white/5 border rounded-xl pl-8 pr-4 py-3 text-white placeholder-[#7a6e8a] text-sm
              transition-all duration-200
              focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent
              ${errors.github ? 'border-red-400 bg-red-500/5' : 'border-white/10 hover:border-white/20'}
            `}
          />
        </div>
        {errors.github ? (
          <p id="github-error" role="alert" className="mt-1.5 text-red-400 text-xs flex items-center gap-1">
            <svg className="w-3.5 h-3.5 shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
            </svg>
            {errors.github}
          </p>
        ) : (
          <p id="github-hint" className="mt-1.5 text-[#7a6e8a] text-xs">
            Your GitHub handle — no @ needed.
          </p>
        )}
      </div>

      <button
        type="submit"
        className="
          w-full bg-orange-500 hover:bg-orange-400 active:bg-orange-600
          text-white font-bold text-base rounded-xl py-3.5 px-6
          transition-all duration-200 shadow-lg shadow-orange-500/20
          focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2 focus:ring-offset-[#1a1025]
        "
      >
        Generate My Ticket
      </button>
    </form>
  )
}
