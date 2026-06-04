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
        {/* Check circle */}
        <div
          className="anim-check-pop"
          style={{
            width: 64,
            height: 64,
            borderRadius: '50%',
            background: 'var(--color-surface-brand-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 28px',
            color: 'var(--color-action-primary)',
          }}
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 16 4 11"/>
          </svg>
        </div>

        <h1 style={{ fontSize: 28, fontWeight: 500, color: 'var(--color-text-primary)', marginBottom: 12 }}>Du er med!</h1>

        <p style={{ fontSize: 13, fontWeight: 500, color: 'var(--color-text-secondary)', marginBottom: 8 }}>
          Lodtrækning d. 1. august 2025
        </p>
        <p style={{ fontSize: 15, color: 'var(--color-text-secondary)', lineHeight: 1.6, marginBottom: 36 }}>
          Vi trækker en vinder og giver dig besked direkte på din email. Tak fordi du tog dig tid.
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
