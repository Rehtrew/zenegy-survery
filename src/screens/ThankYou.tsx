import trophyUrl from '../assets/Illustrations/Success/Success _ achievement, success, trophy, awards, celebration.svg'

/** Completion — rendered inside the SurveyShell card ("Tak" milestone active). */
export function ThankYou() {
  return (
    <div style={{ textAlign: 'center', maxWidth: 400, margin: '0 auto' }}>
      <div className="anim-check-pop" style={{
        width: 124, height: 124, borderRadius: '50%', background: '#f1ecff',
        display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '4px auto 28px',
      }}>
        <img src={trophyUrl} alt="" aria-hidden="true" style={{ width: 86, height: 86, objectFit: 'contain' }} />
      </div>

      <h1 style={{ fontSize: 30, fontWeight: 500, letterSpacing: '-0.02em', color: '#14132b', marginBottom: 12 }}>
        Tak for din tid!
      </h1>

      <p style={{ fontSize: 16, fontWeight: 500, color: '#5b5b66', lineHeight: 1.6, marginBottom: 32 }}>
        Din ærlige mening hjælper os med at gøre løn nemmere for alle i Danmark.
        Hvis du har skrevet din email, sender vi dig resultaterne, når undersøgelsen lukker.
      </p>

      <p style={{ fontSize: 14.5, fontWeight: 500, color: '#14132b', marginBottom: 16 }}>
        Kender du nogen, der også burde deltage?
      </p>

      <a
        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent('https://survey.zenegy.com')}`}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          background: '#0A66C2', color: 'white', padding: '13px 26px', borderRadius: 12,
          fontSize: 14.5, fontWeight: 500, textDecoration: 'none', marginBottom: 20,
          fontFamily: 'var(--font-sans)', transition: 'opacity 0.12s ease',
        }}
        onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.opacity = '0.9' }}
        onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.opacity = '1' }}
      >
        <svg width="17" height="17" viewBox="0 0 24 24" fill="white">
          <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.34V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.55V9h3.57v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.22.79 24 1.77 24h20.45c.98 0 1.78-.78 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z" />
        </svg>
        Del på LinkedIn
      </a>

      <div>
        <a href="https://zenegy.com" style={{ fontSize: 14, fontWeight: 500, color: '#6e30fd', textDecoration: 'none' }}>
          Læs mere om Zenegy
        </a>
      </div>
    </div>
  )
}
