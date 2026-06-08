import { useState } from 'react'
import type { SurveyAnswers } from '../types'
import { submitSurvey } from '../lib/supabase'

interface Props {
  answers: SurveyAnswers
  onSubmitted: () => void
}

/** "Deltag" step — rendered inside the SurveyShell card. Back lives in the shell. */
export function LeadGen({ answers, onSubmitted }: Props) {
  const [email, setEmail] = useState('')
  const [newsletter, setNewsletter] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  const accent = '#6e30fd'

  const handleSubmit = async () => {
    if (!isValidEmail) { setError('Indtast venligst en gyldig email.'); return }
    setLoading(true)
    setError('')
    // Employees never choose a zenegy/non-zenegy payroll track.
    const track = answers.is_employee ? 'employee' : answers.track
    if (!track) {
      setError('Noget gik galt. Prøv igen.')
      setLoading(false)
      return
    }
    try {
      await submitSurvey({ ...answers, track, email, newsletter_opt_in: newsletter })
      onSubmitted()
    } catch (err) {
      console.error('Survey submission failed:', err)
      setError('Noget gik galt. Prøv igen.')
      setLoading(false)
    }
  }

  return (
    <div>
      {/* Badge */}
      <div style={{
        display: 'inline-flex', alignItems: 'center', gap: 8,
        background: '#e2f5ec', borderRadius: 9999, padding: '7px 15px',
        fontSize: 13, fontWeight: 500, color: '#155e3f', marginBottom: 22,
      }}>
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M2.5 7.5L5.5 10.5L11.5 4" stroke="#1f9d63" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Dine svar er registreret
      </div>

      <h2 style={{ fontSize: 27, fontWeight: 500, lineHeight: 1.2, letterSpacing: '-0.02em', marginBottom: 10, color: '#14132b' }}>
        Tak — det betyder meget.
      </h2>
      <p style={{ fontSize: 15.5, fontWeight: 500, color: '#5b5b66', lineHeight: 1.6, marginBottom: 30 }}>
        Vil du have resultaterne? Skriv din email, så sender vi dig indsigterne,
        når undersøgelsen lukker. Det er helt frivilligt — du har allerede hjulpet os.
      </p>

      {/* Email */}
      <div style={{ marginBottom: 16 }}>
        <label style={{ display: 'block', fontSize: 13.5, fontWeight: 500, color: '#5b5b66', marginBottom: 8 }}>
          Email
        </label>
        <input
          type="email"
          value={email}
          onChange={e => { setEmail(e.target.value); setError('') }}
          placeholder="din@email.dk"
          style={{
            width: '100%', padding: '14px 16px', borderRadius: 12,
            background: '#f6f6f7',
            border: `1.5px solid ${error ? '#ff1e46' : '#ededf0'}`,
            color: '#14132b', fontSize: 15, fontWeight: 500, outline: 'none',
            fontFamily: 'var(--font-sans)', boxSizing: 'border-box',
            transition: 'border-color 0.12s ease, background 0.12s ease',
          }}
          onFocus={e => { e.currentTarget.style.borderColor = accent; e.currentTarget.style.background = '#fff' }}
          onBlur={e => { if (!error) e.currentTarget.style.borderColor = '#ededf0'; e.currentTarget.style.background = '#f6f6f7' }}
        />
        {error && <p style={{ color: '#ff1e46', fontSize: 12.5, marginTop: 6 }}>{error}</p>}
      </div>

      {/* Newsletter */}
      <label style={{ display: 'flex', alignItems: 'flex-start', gap: 12, cursor: 'pointer', marginBottom: 28 }}>
        <input
          type="checkbox"
          checked={newsletter}
          onChange={e => setNewsletter(e.target.checked)}
          style={{ marginTop: 2, accentColor: accent, width: 17, height: 17, cursor: 'pointer', flexShrink: 0 }}
        />
        <span style={{ fontSize: 13.5, fontWeight: 500, color: '#5b5b66', lineHeight: 1.55 }}>
          Ja tak, send mig også Zenegys nyhedsbrev med tips og produktopdateringer.
        </span>
      </label>

      {/* Submit */}
      <button
        type="button"
        onClick={handleSubmit}
        disabled={loading || !isValidEmail}
        style={{
          width: '100%', padding: '15px', borderRadius: 12,
          background: accent, color: 'white', fontWeight: 500, fontSize: 15.5, border: 'none',
          cursor: loading || !isValidEmail ? 'not-allowed' : 'pointer',
          opacity: loading || !isValidEmail ? 0.45 : 1,
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          marginBottom: 12, fontFamily: 'var(--font-sans)',
          boxShadow: loading || !isValidEmail ? 'none' : '0 10px 26px rgba(110,48,253,0.30)',
          transition: 'opacity 0.12s ease, box-shadow 0.12s ease',
        }}
      >
        {loading ? (
          <span style={{ display: 'inline-block', width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.75s linear infinite' }} />
        ) : 'Send mig resultaterne'}
      </button>

      {/* Book demo */}
      <a
        href="https://zenegy.com/book-demo"
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          width: '100%', padding: '14px', borderRadius: 12,
          border: '1.5px solid #ededf0', color: '#14132b', fontWeight: 500, fontSize: 14.5,
          textDecoration: 'none', marginBottom: 22, boxSizing: 'border-box',
          fontFamily: 'var(--font-sans)', transition: 'background 0.12s ease, border-color 0.12s ease',
        }}
        onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.background = '#f6f6f7' }}
        onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.background = 'transparent' }}
      >
        Book en gratis demo med Zenegy
      </a>

      {/* Skip */}
      <div style={{ textAlign: 'center' }}>
        <button
          type="button"
          onClick={onSubmitted}
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            fontSize: 13.5, fontWeight: 500, color: '#9a9aa3', fontFamily: 'var(--font-sans)',
            display: 'inline-flex', alignItems: 'center', gap: 4,
            transition: 'color 0.12s ease',
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = '#5b5b66' }}
          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = '#9a9aa3' }}
        >
          Spring over og afslut
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M5 3L9 7L5 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      <p style={{ fontSize: 11.5, fontWeight: 500, color: '#a8a8b0', textAlign: 'center', marginTop: 18, lineHeight: 1.6 }}>
        Din email bruges kun til at sende dig resultaterne og evt. nyhedsbrev.<br />
        Vi deler ikke dine data med tredjepart.
      </p>
    </div>
  )
}
