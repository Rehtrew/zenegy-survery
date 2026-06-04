import ipadImg from '../assets/hero.png'

interface Props {
  onStart: () => void
}

const ZenegyLogo = () => (
  <svg width="24" height="24" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="64" height="64" rx="14" fill="#6e30fd"/>
    <g transform="translate(10, 13.15) scale(0.662)">
      <path d="M36.1862 13.5684H6.07046C2.7593 13.5684 0 16.2488 0 19.6388V47.9414C0 54.7213 8.82975 57.4018 12.6139 51.7255L36.9746 15.0663C37.3688 14.4356 36.9746 13.5684 36.1862 13.5684Z" fill="white"/>
      <path d="M30.2737 41.242H60.3895C63.7007 41.242 66.46 38.5615 66.46 35.1715V6.869C66.46 0.0890055 57.6302 -2.59146 53.846 3.08482L29.4854 39.7441C29.0912 40.3748 29.4854 41.242 30.2737 41.242Z" fill="white"/>
    </g>
  </svg>
)

export function LandingPage({ onStart }: Props) {
  return (
    <div className="min-h-screen bg-surface-page flex flex-col items-center justify-start px-6 py-10">
      {/* Header */}
      <header className="w-full max-w-[660px] flex justify-between items-center mb-10">
        <div className="flex items-center gap-2.5">
          <ZenegyLogo />
          <span className="text-[18px] font-medium text-text-primary tracking-tight">zenegy</span>
        </div>
      </header>

      <div className="w-full max-w-[660px] flex flex-col gap-4">
        {/* Hero card */}
        <div className="relative bg-hero-bg rounded-z-l px-10 py-12 text-white overflow-hidden">
          <h1 className="text-[30px] font-medium leading-tight tracking-tight mb-3 max-w-[380px]">
            Hvad synes du egentlig om løn i Danmark?
          </h1>

          <p className="text-[15px] text-white/70 leading-relaxed mb-8 max-w-[400px]">
            Del din mening på 3 minutter og vær med i lodtrækningen om en iPad.
          </p>

          <div className="flex gap-8 mb-8">
            {[
              ['~3 min', 'at gennemføre'],
              ['5 spm', 'korte spørgsmål'],
              ['1 iPad', 'til en heldig deltager'],
            ].map(([n, l]) => (
              <div key={n}>
                <div className="text-[20px] font-medium">{n}</div>
                <div className="text-xs text-white/50">{l}</div>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={onStart}
            className="inline-flex items-center bg-primary text-white px-7 py-3.5 rounded-z-m text-[15px] font-medium hover:bg-primary-hover transition-colors duration-[120ms] ease-[ease]"
          >
            Start undersøgelsen
          </button>

          <p className="text-xs text-white/35 mt-4">
            Ingen krav om nyhedsbrevstilmelding · Ingen spam
          </p>

          <img
            src={ipadImg}
            alt="iPad"
            className="absolute right-6 bottom-0 h-36 object-contain pointer-events-none"
          />
        </div>

        {/* Perk cards */}
        <div className="grid grid-cols-2 gap-3">
          {[
            ['Anonymt og trygt', 'Dine svar behandles fortroligt og bruges udelukkende til at forbedre løsninger.'],
            ['Tilpassede spørgsmål', 'Spørgsmålene tilpasser sig, om du er Zenegy-kunde eller bruger et andet system.'],
            ['iPad konkurrence', 'Alle der deltager er med i lodtrækningen — uanset om du tilmelder nyhedsbrev eller ej.'],
            ['Din stemme tæller', 'Resultaterne former, hvad vi prioriterer og hvilke problemer vi løser næst.'],
          ].map(([title, desc]) => (
            <div key={title} className="bg-surface-default rounded-z-l p-5">
              <div className="w-2 h-2 rounded-full bg-primary mb-3" />
              <div className="text-sm font-medium text-text-primary mb-1">{title}</div>
              <div className="text-[13px] text-text-secondary leading-relaxed">{desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
