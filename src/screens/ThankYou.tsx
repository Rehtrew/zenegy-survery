import { useCallback, useEffect, useRef, useState } from 'react'
import type { SurveyAnswers, SubmissionMeta } from '../types'
import { submitSurvey, signupForReport } from '../lib/supabase'

const ACCENT = '#6e30fd'

function Confetti() {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const colors = ['#6e30fd', '#9d94ff', '#ebe6ff', '#c4b5fd', '#fbbf24', '#34d399', '#f87171', '#60a5fa']
    const particles = Array.from({ length: 90 }, () => ({
      x: Math.random() * canvas.width,
      y: -20 - Math.random() * 120,
      vx: (Math.random() - 0.5) * 4,
      vy: 1.5 + Math.random() * 3.5,
      size: 5 + Math.random() * 7,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * 360,
      rotSpeed: (Math.random() - 0.5) * 6,
    }))

    const start = performance.now()
    let frame: number

    const animate = (now: number) => {
      const elapsed = now - start
      if (elapsed > 5000) {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        return
      }
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      const fade = Math.max(0, 1 - (elapsed - 3500) / 1500)
      particles.forEach(p => {
        p.x += p.vx
        p.y += p.vy
        p.vy += 0.06
        p.rotation += p.rotSpeed
        ctx.save()
        ctx.translate(p.x, p.y)
        ctx.rotate((p.rotation * Math.PI) / 180)
        ctx.globalAlpha = fade
        ctx.fillStyle = p.color
        ctx.fillRect(-p.size / 2, -p.size * 0.3, p.size, p.size * 0.6)
        ctx.restore()
      })
      frame = requestAnimationFrame(animate)
    }
    frame = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(frame)
  }, [])
  return <canvas ref={ref} aria-hidden style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 999 }} />
}

function StatusChip({ state, onRetry }: { state: 'saving' | 'saved' | 'error'; onRetry: () => void }) {
  if (state === 'error') {
    return (
      <div style={{
        display: 'inline-flex', alignItems: 'center', gap: 8,
        background: '#fdeeee', borderRadius: 9999, padding: '7px 15px',
        fontSize: 13, fontWeight: 500, color: '#a13838', marginBottom: 22,
      }}>
        Dine svar blev ikke gemt
        <button
          type="button" onClick={onRetry}
          style={{ border: 'none', background: 'none', padding: 0, cursor: 'pointer', fontSize: 13, fontWeight: 500, color: '#a13838', textDecoration: 'underline', fontFamily: 'var(--font-sans)' }}
        >
          Prøv igen
        </button>
      </div>
    )
  }
  const saved = state === 'saved'
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: 8,
      background: saved ? '#e2f5ec' : '#f0f0f3', borderRadius: 9999, padding: '7px 15px',
      fontSize: 13, fontWeight: 500, color: saved ? '#155e3f' : '#5b5b66', marginBottom: 22,
      transition: 'background 0.25s ease, color 0.25s ease',
    }}>
      {saved ? (
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M2.5 7.5L5.5 10.5L11.5 4" stroke="#1f9d63" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ) : (
        <span style={{ display: 'inline-block', width: 12, height: 12, border: '2px solid #d6d6de', borderTopColor: '#9a9aa3', borderRadius: '50%', animation: 'spin 0.75s linear infinite' }} />
      )}
      {saved ? 'Dine svar er registreret' : 'Gemmer dine svar…'}
    </div>
  )
}

/** Completion — answers are saved on arrival; the email opt-in is optional and separate. */
// One-per-browser guard. Soft (cleared by wiping site data / incognito), but
// stops casual repeat submissions from the same person.
const DONE_KEY = 'zenegy_survey_completed'
// A real respondent can't answer a multi-question survey in this time; anything
// faster is a script. Conservative so a fast human is never falsely dropped.
const SUSPICIOUSLY_FAST_SECONDS = 4

function alreadyCompleted(): boolean {
  try { return !!localStorage.getItem(DONE_KEY) } catch { return false }
}
function markCompleted(): void {
  try { localStorage.setItem(DONE_KEY, new Date().toISOString()) } catch { /* private mode — ignore */ }
}

export function ThankYou({ answers, meta }: { answers: SurveyAnswers; meta: SubmissionMeta }) {
  const [saveState, setSaveState] = useState<'saving' | 'saved' | 'error'>('saving')
  const submittedOnce = useRef(false)

  const [email, setEmail] = useState('')
  const [newsletter, setNewsletter] = useState(false)
  const [signupState, setSignupState] = useState<'idle' | 'sending' | 'sent'>('idle')
  const [signupError, setSignupError] = useState('')

  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

  const save = useCallback(async () => {
    // Employees never choose a zenegy/non-zenegy payroll track.
    const track = answers.is_employee ? 'employee' : answers.track
    if (!track) { setSaveState('error'); return }

    // Soft anti-spam: honeypot filled, implausibly fast, or this browser already
    // submitted. Show the same success UI but don't write a row — a bot can't
    // tell it was dropped, and a legit duplicate is silently de-duped.
    const elapsed = meta.startedAt ? (Date.now() - meta.startedAt) / 1000 : Infinity
    const looksLikeBot = meta.honeypot.trim() !== '' || elapsed < SUSPICIOUSLY_FAST_SECONDS
    if (looksLikeBot || alreadyCompleted()) { setSaveState('saved'); return }

    setSaveState('saving')
    try {
      await submitSurvey({ ...answers, track, email: '', newsletter_opt_in: false })
      markCompleted()
      setSaveState('saved')
    } catch (err) {
      console.error('Survey submission failed:', err)
      setSaveState('error')
    }
  }, [answers, meta])

  useEffect(() => {
    if (submittedOnce.current) return
    submittedOnce.current = true
    void save()
  }, [save])

  const handleSignup = async () => {
    if (!isValidEmail) { setSignupError('Indtast venligst en gyldig email.'); return }
    setSignupState('sending')
    setSignupError('')
    try {
      await signupForReport(email, newsletter)
      setSignupState('sent')
    } catch (err) {
      console.error('Report signup failed:', err)
      setSignupError('Noget gik galt. Prøv igen.')
      setSignupState('idle')
    }
  }

  return (
    <div>
      <Confetti />

      <StatusChip state={saveState} onRetry={() => void save()} />

      <h2 style={{ fontSize: 27, fontWeight: 500, lineHeight: 1.2, letterSpacing: '-0.02em', marginBottom: 10, color: '#14132b' }}>
        Tak for din tid — du er færdig.
      </h2>
      <p style={{ fontSize: 15.5, fontWeight: 500, color: '#5b5b66', lineHeight: 1.6, marginBottom: 26 }}>
        Din ærlige mening hjælper os med at gøre løn nemmere for alle i Danmark.
        Du behøver ikke gøre mere — dine svar er gemt.
      </p>

      {/* Optional report opt-in — answers are already saved; this is purely for
          getting the (not-yet-published) report emailed when it's ready. */}
      <div style={{ background: '#f8f8fa', borderRadius: 16, padding: '22px 22px 24px', marginBottom: 24 }}>
        {signupState === 'sent' ? (
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 13 }}>
            <span className="anim-check-pop" style={{
              width: 36, height: 36, borderRadius: '50%', background: '#e2f5ec', flexShrink: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg width="17" height="17" viewBox="0 0 14 14" fill="none">
                <path d="M2.5 7.5L5.5 10.5L11.5 4" stroke="#1f9d63" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            <div>
              <div style={{ fontSize: 15.5, fontWeight: 500, color: '#14132b', marginBottom: 4 }}>
                Du er på listen
              </div>
              <div style={{ fontSize: 13.5, fontWeight: 500, color: '#5b5b66', lineHeight: 1.55 }}>
                Rapporten er ikke udkommet endnu. Så snart undersøgelsen lukker og tallene er
                samlet, sender vi den til <span style={{ color: '#14132b' }}>{email}</span>.
                {newsletter && ' Du er også tilmeldt nyhedsbrevet.'}
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Header: title + clear "not ready yet" explanation */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 16 }}>
              <span style={{
                width: 36, height: 36, borderRadius: 10, background: '#ebe6ff', flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={ACCENT} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 20V10M10 20V4M16 20v-6" /><path d="M3 20h18" />
                </svg>
              </span>
              <div>
                <div style={{ fontSize: 15.5, fontWeight: 500, color: '#14132b', marginBottom: 3 }}>
                  Få Lønmarkedsrapporten 2026
                </div>
                <div style={{ fontSize: 13, fontWeight: 500, color: '#86868b', lineHeight: 1.5 }}>
                  Rapporten er ikke klar endnu — vi udgiver den, når undersøgelsen lukker.
                  Skriv din email, så sender vi den direkte til dig. Helt valgfrit.
                </div>
              </div>
            </div>

            {/* Full-width email input */}
            <input
              type="email"
              value={email}
              onChange={e => { setEmail(e.target.value); setSignupError('') }}
              onKeyDown={e => { if (e.key === 'Enter' && isValidEmail) handleSignup() }}
              placeholder="din@email.dk"
              style={{
                width: '100%', padding: '13px 16px', borderRadius: 11,
                background: '#fff',
                border: `1.5px solid ${signupError ? '#ff1e46' : '#e8e8ec'}`,
                color: '#14132b', fontSize: 15, fontWeight: 500, outline: 'none',
                fontFamily: 'var(--font-sans)', boxSizing: 'border-box', marginBottom: 12,
                transition: 'border-color 0.12s ease',
              }}
              onFocus={e => { e.currentTarget.style.borderColor = ACCENT }}
              onBlur={e => { if (!signupError) e.currentTarget.style.borderColor = '#e8e8ec' }}
            />
            {signupError && <p style={{ color: '#ff1e46', fontSize: 12.5, margin: '-4px 0 12px' }}>{signupError}</p>}

            {/* Newsletter opt-in */}
            <label style={{ display: 'flex', alignItems: 'flex-start', gap: 10, cursor: 'pointer', marginBottom: 16 }}>
              <input
                type="checkbox"
                checked={newsletter}
                onChange={e => setNewsletter(e.target.checked)}
                style={{ marginTop: 1, accentColor: ACCENT, width: 16, height: 16, cursor: 'pointer', flexShrink: 0 }}
              />
              <span style={{ fontSize: 13, fontWeight: 500, color: '#5b5b66', lineHeight: 1.5 }}>
                Ja tak, send mig også Zenegys nyhedsbrev med tips og produktopdateringer.
              </span>
            </label>

            {/* Full-width primary action */}
            <button
              type="button"
              onClick={handleSignup}
              disabled={signupState === 'sending' || !isValidEmail}
              style={{
                width: '100%', padding: '13px', borderRadius: 11, border: 'none',
                background: ACCENT, color: '#fff', fontWeight: 500, fontSize: 15,
                cursor: signupState === 'sending' || !isValidEmail ? 'not-allowed' : 'pointer',
                opacity: signupState === 'sending' || !isValidEmail ? 0.45 : 1,
                fontFamily: 'var(--font-sans)', transition: 'opacity 0.12s ease',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              }}
            >
              {signupState === 'sending' ? (
                <span style={{ display: 'inline-block', width: 15, height: 15, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.75s linear infinite' }} />
              ) : 'Send mig rapporten, når den er klar'}
            </button>
          </>
        )}
      </div>

      {/* Secondary actions */}
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        <a
          href="https://zenegy.com/book-demo"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            flex: 1, minWidth: 200, display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '13px 18px', borderRadius: 12,
            border: '1.5px solid #ededf0', color: '#14132b', fontWeight: 500, fontSize: 14,
            textDecoration: 'none', boxSizing: 'border-box',
            fontFamily: 'var(--font-sans)', transition: 'background 0.12s ease',
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.background = '#f6f6f7' }}
          onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.background = 'transparent' }}
        >
          Book en gratis demo
        </a>
        <a
          href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent('https://survey.zenegy.com')}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            flex: 1, minWidth: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            padding: '13px 18px', borderRadius: 12, border: '1.5px solid #ededf0',
            color: '#14132b', fontSize: 14, fontWeight: 500, textDecoration: 'none', boxSizing: 'border-box',
            fontFamily: 'var(--font-sans)', transition: 'background 0.12s ease',
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.background = '#f6f6f7' }}
          onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.background = 'transparent' }}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="#0A66C2">
            <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.34V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.55V9h3.57v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.22.79 24 1.77 24h20.45c.98 0 1.78-.78 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z" />
          </svg>
          Del på LinkedIn
        </a>
      </div>

      <p style={{ fontSize: 11.5, fontWeight: 500, color: '#a8a8b0', textAlign: 'center', marginTop: 22, lineHeight: 1.6 }}>
        Din email bruges kun til at sende dig resultaterne og evt. nyhedsbrev — den kobles ikke til dine svar.<br />
        Vi deler ikke dine data med tredjepart.
      </p>
    </div>
  )
}
