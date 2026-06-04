import ipadImg from '../assets/ipad.png'
import { ShieldCheck, SlidersHorizontal, Star, MessageCircle } from '../components/icons'

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

const perks = [
  {
    Icon: ShieldCheck,
    title: 'Anonymt og trygt',
    desc: 'Dine svar behandles fortroligt og bruges udelukkende til at forbedre løsninger.',
  },
  {
    Icon: SlidersHorizontal,
    title: 'Tilpassede spørgsmål',
    desc: 'Spørgsmålene tilpasser sig, om du er Zenegy-kunde eller bruger et andet system.',
  },
  {
    Icon: Star,
    title: 'iPad konkurrence',
    desc: 'Alle der deltager er med i lodtrækningen — uanset om du tilmelder nyhedsbrev eller ej.',
  },
  {
    Icon: MessageCircle,
    title: 'Din stemme tæller',
    desc: 'Resultaterne former, hvad vi prioriterer og hvilke problemer vi løser næst.',
  },
]

export function LandingPage({ onStart }: Props) {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--color-surface-page)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '40px 24px 64px',
    }}>

      {/* Header */}
      <header style={{ width: '100%', maxWidth: 700, display: 'flex', alignItems: 'center', gap: 10, marginBottom: 40 }}>
        <ZenegyLogo />
        <span style={{ fontSize: 20, fontWeight: 500, color: 'var(--color-text-primary)', letterSpacing: '-0.3px' }}>zenegy</span>
      </header>

      <div style={{ width: '100%', maxWidth: 700, display: 'flex', flexDirection: 'column', gap: 12 }}>

        {/* Hero card */}
        <div style={{
          position: 'relative',
          background: '#120c2b',
          borderRadius: 16,
          overflow: 'hidden',
          minHeight: 360,
        }}>
          {/* Ambient glow */}
          <div style={{
            position: 'absolute', top: -100, right: 80,
            width: 360, height: 360, borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(110,48,253,0.2) 0%, transparent 65%)',
            pointerEvents: 'none',
          }}/>

          {/* Left copy */}
          <div style={{ padding: '52px 48px 52px', maxWidth: 420, position: 'relative', zIndex: 1 }}>
            <p style={{ fontSize: 12, fontWeight: 500, color: '#9d94ff', marginBottom: 20, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              Markedsundersøgelse 2025
            </p>

            <h1 style={{ fontSize: 34, fontWeight: 500, lineHeight: 1.15, letterSpacing: '-0.5px', color: 'white', marginBottom: 18 }}>
              Hvad synes du egentlig om løn i Danmark?
            </h1>

            <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.58)', lineHeight: 1.65, marginBottom: 36 }}>
              Del din mening på 3 minutter og vær med i lodtrækningen om en iPad. Dine svar er anonyme.
            </p>

            {/* Stats */}
            <div style={{ display: 'flex', gap: 36, marginBottom: 40 }}>
              {[['~3 min', 'at gennemføre'], ['7 spm', 'korte spørgsmål'], ['1 iPad', 'til en heldig deltager']].map(([n, l]) => (
                <div key={n}>
                  <div style={{ fontSize: 22, fontWeight: 500, color: 'white', lineHeight: 1 }}>{n}</div>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginTop: 4 }}>{l}</div>
                </div>
              ))}
            </div>

            {/* CTA */}
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
                fontFamily: 'var(--font-sans)',
                transition: 'background 0.12s ease',
                marginBottom: 16,
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = '#331070' }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = '#6e30fd' }}
            >
              Start undersøgelsen
            </button>

            <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.28)' }}>
              Ingen krav om nyhedsbrevstilmelding · Ingen spam
            </p>
          </div>

          {/* iPad photo — positioned right side */}
          <img
            src={ipadImg}
            alt="iPad"
            style={{
              position: 'absolute',
              right: 0,
              bottom: 0,
              height: '100%',
              width: 'auto',
              maxWidth: 280,
              objectFit: 'cover',
              objectPosition: 'center top',
              maskImage: 'linear-gradient(to right, transparent 0%, black 20%)',
              WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 20%)',
              pointerEvents: 'none',
            }}
          />
        </div>

        {/* Perk cards */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          {perks.map(({ Icon, title, desc }) => (
            <div key={title} style={{
              background: 'var(--color-surface-default)',
              borderRadius: 12,
              padding: '20px 20px',
              display: 'flex',
              flexDirection: 'column',
              gap: 10,
            }}>
              <Icon size={20} color="var(--color-action-primary)" strokeWidth={1.75}/>
              <div>
                <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--color-text-primary)', marginBottom: 5 }}>{title}</div>
                <div style={{ fontSize: 13, color: 'var(--color-text-secondary)', lineHeight: 1.55 }}>{desc}</div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}
