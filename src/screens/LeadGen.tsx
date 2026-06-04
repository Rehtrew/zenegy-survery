import { useState } from 'react'
import type { SurveyAnswers, Track } from '../types'
import { submitSurvey } from '../lib/supabase'

interface Props {
  answers: SurveyAnswers
  onSubmitted: () => void
}

export function LeadGen({ answers, onSubmitted }: Props) {
  const [email, setEmail] = useState('')
  const [newsletter, setNewsletter] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

  const handleSubmit = async () => {
    if (!isValidEmail) { setError('Indtast venligst en gyldig email.'); return }
    setLoading(true)
    setError('')
    try {
      await submitSurvey({
        ...answers,
        track: answers.track as Track,
        email,
        newsletter_opt_in: newsletter,
      })
      onSubmitted()
    } catch {
      setError('Noget gik galt. Prøv igen.')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-app-bg flex items-start justify-center px-6 py-16">
      <div className="w-full max-w-[580px] bg-gradient-to-br from-[#1a1a2e] to-[#0f2027] rounded-2xl p-11 text-white">
        <div className="inline-flex items-center gap-2 bg-primary/15 border border-primary/30 rounded-full px-4 py-1.5 text-xs font-bold text-primary mb-5">
          🎁 Du er næsten i mål!
        </div>

        <h2 className="text-[28px] font-black leading-snug mb-2">
          Tak — dine svar hjælper os med at gøre løn nemmere for alle.
        </h2>
        <p className="text-sm text-white/60 leading-relaxed mb-8">
          Indtast din email for at deltage i lodtrækningen om en iPad. Vi trækker en vinder d. 1. august 2025.
        </p>

        <div className="mb-3.5">
          <label className="block text-[13px] font-semibold text-white/75 mb-2">
            Email <span className="text-primary">✱</span>
          </label>
          <input
            type="email"
            value={email}
            onChange={e => { setEmail(e.target.value); setError('') }}
            placeholder="din@email.dk"
            className="w-full px-4 py-3 rounded-xl border-[1.5px] border-white/15 bg-white/[0.07] text-white placeholder:text-white/35 outline-none focus:border-primary transition-colors text-sm"
          />
          {error && <p className="text-red-400 text-xs mt-1.5">{error}</p>}
        </div>

        <label className="flex items-start gap-3 cursor-pointer mb-7">
          <input
            type="checkbox"
            checked={newsletter}
            onChange={e => setNewsletter(e.target.checked)}
            className="mt-0.5 accent-primary w-4 h-4 cursor-pointer flex-shrink-0"
          />
          <span className="text-[13px] text-white/60 leading-relaxed">
            Ja tak, jeg vil gerne modtage Zenegys nyhedsbrev med tips, nyheder og produktopdateringer.{' '}
            <span className="text-white/40">(Helt valgfrit — du er med i konkurrencen uanset.)</span>
          </span>
        </label>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={loading || !isValidEmail}
          className="w-full py-4 rounded-xl bg-primary text-white font-bold text-base mb-3 hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : 'Send svar og deltag i konkurrencen 🎁'}
        </button>

        <a
          href="https://zenegy.com/book-demo"
          target="_blank"
          rel="noopener noreferrer"
          className="w-full py-3.5 rounded-xl border border-white/20 text-white font-semibold text-[15px] hover:bg-white/[0.07] transition-colors flex items-center justify-center"
        >
          📅 Book en gratis demo med Zenegy
        </a>

        <p className="text-[11px] text-white/30 text-center mt-5 leading-relaxed">
          Din email bruges udelukkende til konkurrencen og evt. nyhedsbrev.<br />
          Vi deler ikke dine data med tredjepart.
        </p>
      </div>
    </div>
  )
}
