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
    <div>
      {/* Badge */}
      <div style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        background: 'var(--color-surface-brand-subtle)',
        borderRadius: 9999,
        padding: '6px 14px',
        fontSize: 13,
        fontWeight: 500,
        color: 'var(--color-action-primary)',
        marginBottom: 24,
      }}>
        <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#6e30fd', flexShrink: 0 }} />
        Dine svar er registreret
      </div>

      <h2 style={{ fontSize: 24, fontWeight: 500, lineHeight: 1.25, marginBottom: 10, color: 'var(--color-text-primary)' }}>
        Vil du modtage resultaterne?
      </h2>
      <p style={{ fontSize: 14, color: 'var(--color-text-secondary)', lineHeight: 1.6, marginBottom: 28 }}>
        Indtast din email, og vi sender dig resultaterne, når undersøgelsen lukker. Det er helt frivilligt.
      </p>

      {/* Email */}
      <div style={{ marginBottom: 16 }}>
        <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--color-text-secondary)', marginBottom: 8 }}>
          Email
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
            background: 'var(--color-surface-subtle)',
            border: `1.5px solid ${error ? 'var(--color-feedback-error)' : 'var(--color-border-default)'}`,
            color: 'var(--color-text-primary)',
            fontSize: 14,
            fontWeight: 500,
            outline: 'none',
            fontFamily: 'var(--font-sans)',
            boxSizing: 'border-box',
            transition: 'border-color 0.12s ease',
          }}
        />
        {error && <p style={{ color: 'var(--color-feedback-error)', fontSize: 12, marginTop: 6 }}>{error}</p>}
      </div>

      {/* Newsletter */}
      <label style={{ display: 'flex', alignItems: 'flex-start', gap: 12, cursor: 'pointer', marginBottom: 28 }}>
        <input
          type="checkbox"
          checked={newsletter}
          onChange={e => setNewsletter(e.target.checked)}
          style={{ marginTop: 2, accentColor: '#6e30fd', width: 16, height: 16, cursor: 'pointer', flexShrink: 0 }}
        />
        <span style={{ fontSize: 13, color: 'var(--color-text-secondary)', lineHeight: 1.55 }}>
          Ja tak, jeg vil gerne modtage Zenegys nyhedsbrev med tips og produktopdateringer.
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
          transition: 'background 0.12s ease, opacity 0.12s ease',
        }}
      >
        {loading ? (
          <span style={{ display: 'inline-block', width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.75s linear infinite' }} />
        ) : 'Modtag resultater'}
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
          border: '1.5px solid var(--color-border-default)',
          color: 'var(--color-text-primary)',
          fontWeight: 500,
          fontSize: 14,
          textDecoration: 'none',
          marginBottom: 20,
          transition: 'background 0.12s ease',
          fontFamily: 'var(--font-sans)',
          boxSizing: 'border-box',
        }}
      >
        Book en gratis demo med Zenegy
      </a>

      {/* Skip */}
      <div style={{ textAlign: 'center' }}>
        <button
          type="button"
          onClick={onSubmitted}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontSize: 13,
            color: 'var(--color-text-tertiary)',
            fontFamily: 'var(--font-sans)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 4,
          }}
        >
          Spring over
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M5 3L9 7L5 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>

      <p style={{ fontSize: 11, color: 'var(--color-text-tertiary)', textAlign: 'center', marginTop: 16, lineHeight: 1.6 }}>
        Din email bruges udelukkende til at sende dig resultaterne og evt. nyhedsbrev.<br />
        Vi deler ikke dine data med tredjepart.
      </p>
    </div>
  )
}
