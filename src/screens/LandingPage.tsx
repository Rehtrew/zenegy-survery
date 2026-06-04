import heroImg from '../assets/hero.png'

interface Props {
  onStart: () => void
}

const ZenegyLogo = () => (
  <svg width="32" height="32" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="64" height="64" rx="14" fill="#6e30fd"/>
    <g transform="translate(10, 13.15) scale(0.662)">
      <path d="M36.1862 13.5684H6.07046C2.7593 13.5684 0 16.2488 0 19.6388V47.9414C0 54.7213 8.82975 57.4018 12.6139 51.7255L36.9746 15.0663C37.3688 14.4356 36.9746 13.5684 36.1862 13.5684Z" fill="white"/>
      <path d="M30.2737 41.242H60.3895C63.7007 41.242 66.46 38.5615 66.46 35.1715V6.869C66.46 0.0890055 57.6302 -2.59146 53.846 3.08482L29.4854 39.7441C29.0912 40.3748 29.4854 41.242 30.2737 41.242Z" fill="white"/>
    </g>
  </svg>
)

// Clean SVG iPad mockup for the contest visual
const IpadMockup = () => (
  <svg width="110" height="148" viewBox="0 0 110 148" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="0.75" y="0.75" width="108.5" height="146.5" rx="11.25" fill="#1c1c1e" stroke="#3a3a3c" strokeWidth="1.5"/>
    <rect x="6" y="6" width="98" height="132" rx="7" fill="#000"/>
    {/* Screen content */}
    <rect x="10" y="10" width="90" height="124" rx="5" fill="#1a1a2e"/>
    <rect x="18" y="22" width="52" height="5" rx="2.5" fill="#6e30fd" opacity="0.9"/>
    <rect x="18" y="32" width="74" height="3" rx="1.5" fill="white" opacity="0.3"/>
    <rect x="18" y="39" width="60" height="3" rx="1.5" fill="white" opacity="0.2"/>
    <rect x="18" y="53" width="74" height="28" rx="4" fill="#6e30fd" opacity="0.15"/>
    <rect x="22" y="59" width="40" height="3" rx="1.5" fill="#9d94ff" opacity="0.8"/>
    <rect x="22" y="66" width="30" height="3" rx="1.5" fill="white" opacity="0.4"/>
    <rect x="18" y="90" width="32" height="16" rx="4" fill="#6e30fd"/>
    <rect x="55" y="90" width="37" height="16" rx="4" fill="white" opacity="0.08" stroke="white" strokeWidth="0.75" strokeOpacity="0.2"/>
    {/* Home bar */}
    <rect x="42" y="136" width="26" height="3" rx="1.5" fill="white" opacity="0.3"/>
  </svg>
)

export function LandingPage({ onStart }: Props) {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-surface-page)', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '40px 24px' }}>

      {/* Header */}
      <header style={{ width: '100%', maxWidth: 680, display: 'flex', alignItems: 'center', gap: 10, marginBottom: 40 }}>
        <ZenegyLogo />
        <span style={{ fontSize: 20, fontWeight: 500, color: 'var(--color-text-primary)', letterSpacing: '-0.3px' }}>zenegy</span>
      </header>

      <div style={{ width: '100%', maxWidth: 680, display: 'flex', flexDirection: 'column', gap: 12 }}>

        {/* Hero card */}
        <div style={{
          position: 'relative',
          background: '#120c2b',
          borderRadius: 16,
          padding: '52px 48px 0 48px',
          color: 'white',
          overflow: 'hidden',
        }}>
          {/* Glow */}
          <div style={{
            position: 'absolute', top: -80, right: -80,
            width: 280, height: 280,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(110,48,253,0.25) 0%, transparent 70%)',
            pointerEvents: 'none',
          }} />

          <div style={{ position: 'relative', zIndex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            {/* Left: copy + CTA */}
            <div style={{ maxWidth: 400, paddingBottom: 52 }}>
              <p style={{ fontSize: 13, fontWeight: 500, color: '#9d94ff', marginBottom: 16, letterSpacing: '0.02em' }}>
                Markedsundersøgelse 2025
              </p>

              <h1 style={{ fontSize: 36, fontWeight: 500, lineHeight: 1.15, letterSpacing: '-0.5px', marginBottom: 16, color: 'white' }}>
                Hvad synes du egentlig om løn i Danmark?
              </h1>

              <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.6)', lineHeight: 1.6, marginBottom: 36 }}>
                Del din mening på 3 minutter og vær med i lodtrækningen om en iPad. Dine svar er anonyme.
              </p>

              {/* Stats */}
              <div style={{ display: 'flex', gap: 32, marginBottom: 36 }}>
                {[['~3 min', 'at gennemføre'], ['5 spm', 'korte spørgsmål'], ['1 iPad', 'til en heldig deltager']].map(([n, l]) => (
                  <div key={n}>
                    <div style={{ fontSize: 22, fontWeight: 500, color: 'white' }}>{n}</div>
                    <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', marginTop: 2 }}>{l}</div>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={onStart}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  background: '#6e30fd',
                  color: 'white',
                  border: 'none',
                  borderRadius: 8,
                  padding: '14px 28px',
                  fontSize: 15,
                  fontWeight: 500,
                  cursor: 'pointer',
                  transition: 'background 0.12s ease',
                  fontFamily: 'var(--font-sans)',
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = '#331070' }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = '#6e30fd' }}
              >
                Start undersøgelsen
              </button>

              <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', marginTop: 14 }}>
                Ingen krav om nyhedsbrevstilmelding · Ingen spam
              </p>
            </div>

            {/* Right: iPad + product illustration */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, paddingBottom: 0, flexShrink: 0 }}>
              <IpadMockup />
              <img
                src={heroImg}
                alt="Zenegy"
                style={{ width: 140, objectFit: 'contain', opacity: 0.9 }}
              />
            </div>
          </div>
        </div>

        {/* Perk cards */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          {[
            ['Anonymt og trygt', 'Dine svar behandles fortroligt og bruges udelukkende til at forbedre løsninger.'],
            ['Tilpassede spørgsmål', 'Spørgsmålene tilpasser sig, om du er Zenegy-kunde eller bruger et andet system.'],
            ['iPad konkurrence', 'Alle der deltager er med i lodtrækningen — uanset om du tilmelder nyhedsbrev eller ej.'],
            ['Din stemme tæller', 'Resultaterne former, hvad vi prioriterer og hvilke problemer vi løser næst.'],
          ].map(([title, desc]) => (
            <div key={title} style={{
              background: 'var(--color-surface-default)',
              borderRadius: 12,
              padding: '20px 20px',
            }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#6e30fd', marginBottom: 12 }} />
              <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--color-text-primary)', marginBottom: 6 }}>{title}</div>
              <div style={{ fontSize: 13, color: 'var(--color-text-secondary)', lineHeight: 1.55 }}>{desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
