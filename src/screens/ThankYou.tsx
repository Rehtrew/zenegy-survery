import trophyUrl from '../assets/Illustrations/Success/Success _ achievement, success, trophy, awards, celebration.svg'

export function ThankYou() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-surface-page)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <div style={{
        background: 'var(--color-surface-default)',
        borderRadius: 16,
        padding: '56px 48px',
        textAlign: 'center',
        maxWidth: 440,
        width: '100%',
      }}>
        {/* Illustration */}
        <div className="anim-check-pop" style={{ marginBottom: 28 }}>
          <img
            src={trophyUrl}
            alt=""
            aria-hidden="true"
            style={{ width: 140, height: 140, objectFit: 'contain', margin: '0 auto' }}
          />
        </div>

        <h1 style={{ fontSize: 28, fontWeight: 500, color: 'var(--color-text-primary)', marginBottom: 12 }}>
          Tak for din tid!
        </h1>

        <p style={{ fontSize: 15, color: 'var(--color-text-secondary)', lineHeight: 1.6, marginBottom: 36 }}>
          Dine svar hjælper os med at gøre løn nemmere for alle i Danmark. Hvis du har indtastet din email, sender vi dig resultaterne, når undersøgelsen lukker.
        </p>

        <p style={{ fontSize: 14, fontWeight: 500, color: 'var(--color-text-primary)', marginBottom: 16 }}>
          Kender du nogen der også burde deltage?
        </p>

        <a
          href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent('https://survey.zenegy.com')}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            background: '#0A66C2',
            color: 'white',
            padding: '12px 24px',
            borderRadius: 8,
            fontSize: 14,
            fontWeight: 500,
            textDecoration: 'none',
            marginBottom: 16,
            transition: 'background 0.12s ease',
          }}
        >
          Del på LinkedIn
        </a>

        <div style={{ marginTop: 8 }}>
          <a
            href="https://zenegy.com"
            style={{ fontSize: 14, fontWeight: 500, color: 'var(--color-action-primary)', textDecoration: 'none' }}
          >
            Læs mere om Zenegy
          </a>
        </div>
      </div>
    </div>
  )
}
