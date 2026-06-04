import { useState } from 'react'
import type { SurveyAnswers } from '../types'
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
      if (!answers.track) throw new Error('track is required')
      await submitSurvey({ ...answers, track: answers.track, email, newsletter_opt_in: newsletter })
      onSubmitted()
    } catch {
      setError('Noget gik galt. Prøv igen.')
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-surface-page)', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '64px 24px' }}>
      <div style={{ width: '100%', maxWidth: 560, background: '#120c2b', borderRadius: 16, padding: '44px 44px', color: 'white' }}>

        {/* Badge */}
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.08)', borderRadius: 9999, padding: '6px 14px', fontSize: 13, fontWeight: 500, color: 'rgba(255,255,255,0.75)', marginBottom: 24 }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#9d94ff', flexShrink: 0 }} />
          Du er næsten i mål!
        </div>

        <h2 style={{ fontSize: 26, fontWeight: 500, lineHeight: 1.25, marginBottom: 10, color: 'white' }}>
          Tak — dine svar hjælper os med at gøre løn nemmere for alle.
        </h2>
        <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.55)', lineHeight: 1.6, marginBottom: 32 }}>
          Indtast din email for at deltage i lodtrækningen om en iPad. Vi trækker en vinder d. 1. august 2025.
        </p>

        {/* Email */}
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'rgba(255,255,255,0.7)', marginBottom: 8 }}>
            Email <span style={{ color: '#9d94ff' }}>*</span>
          </label>
          <input
            type="email"
            value={email}
            onChange={e => { setEmail(e.target.value); setError('') }}
            placeholder="din@email.dk"
            style={{
              width: '100%',
              padding: '12px 16px',
              borderRadius: 8,
              background: 'rgba(255,255,255,0.08)',
              border: '1.5px solid rgba(255,255,255,0.12)',
              color: 'white',
              fontSize: 14,
              fontWeight: 500,
              outline: 'none',
              fontFamily: 'var(--font-sans)',
              boxSizing: 'border-box',
            }}
          />
          {error && <p style={{ color: '#ff6b6b', fontSize: 12, marginTop: 6 }}>{error}</p>}
        </div>

        {/* Newsletter */}
        <label style={{ display: 'flex', alignItems: 'flex-start', gap: 12, cursor: 'pointer', marginBottom: 32 }}>
          <input
            type="checkbox"
            checked={newsletter}
            onChange={e => setNewsletter(e.target.checked)}
            style={{ marginTop: 2, accentColor: '#6e30fd', width: 16, height: 16, cursor: 'pointer', flexShrink: 0 }}
          />
          <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)', lineHeight: 1.55 }}>
            Ja tak, jeg vil gerne modtage Zenegys nyhedsbrev med tips, nyheder og produktopdateringer.{' '}
            <span style={{ color: 'rgba(255,255,255,0.35)' }}>(Helt valgfrit — du er med i konkurrencen uanset.)</span>
          </span>
        </label>

        {/* Submit */}
        <button
          type="button"
          onClick={handleSubmit}
          disabled={loading || !isValidEmail}
          style={{
            width: '100%',
            padding: '14px',
            borderRadius: 8,
            background: '#6e30fd',
            color: 'white',
            fontWeight: 500,
            fontSize: 15,
            border: 'none',
            cursor: loading || !isValidEmail ? 'not-allowed' : 'pointer',
            opacity: loading || !isValidEmail ? 0.5 : 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            marginBottom: 12,
            fontFamily: 'var(--font-sans)',
            transition: 'background 0.12s ease',
          }}
        >
          {loading ? (
            <span style={{ display: 'inline-block', width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.75s linear infinite' }} />
          ) : 'Send svar og deltag i konkurrencen'}
        </button>

        {/* Book demo */}
        <a
          href="https://zenegy.com/book-demo"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            padding: '13px',
            borderRadius: 8,
            border: '1.5px solid rgba(255,255,255,0.18)',
            color: 'white',
            fontWeight: 500,
            fontSize: 14,
            textDecoration: 'none',
            transition: 'background 0.12s ease',
          }}
        >
          Book en gratis demo med Zenegy
        </a>

        <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', textAlign: 'center', marginTop: 20, lineHeight: 1.6 }}>
          Din email bruges udelukkende til konkurrencen og evt. nyhedsbrev.<br />
          Vi deler ikke dine data med tredjepart.
        </p>
      </div>
    </div>
  )
}
