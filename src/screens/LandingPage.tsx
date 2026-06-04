interface Props {
  onStart: () => void
}

export function LandingPage({ onStart }: Props) {
  return (
    <div className="min-h-screen bg-app-bg flex flex-col items-center justify-start px-6 py-10">
      {/* Header */}
      <header className="w-full max-w-[660px] flex justify-between items-center mb-10">
        <div className="text-[22px] font-black tracking-tight text-text-main">
          zen<span className="text-primary">egy</span>
        </div>
      </header>

      <div className="w-full max-w-[660px] flex flex-col gap-5">
        {/* Hero */}
        <div className="relative bg-gradient-to-br from-[#0f2027] via-[#1a3a4a] to-[#0f2027] rounded-2xl px-11 py-14 text-white overflow-hidden">
          <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-primary opacity-10 blur-2xl pointer-events-none" />

          <div className="inline-flex items-center gap-2 bg-primary/15 border border-primary/30 rounded-full px-4 py-1.5 text-xs font-bold text-primary mb-6">
            🎁 Vind en iPad — ingen tilmelding krævet
          </div>

          <h1 className="text-[34px] font-black leading-tight tracking-tight mb-3">
            Hvad synes du egentlig om<br />
            <span className="text-primary">løn i Danmark?</span>
          </h1>

          <p className="text-base text-white/70 leading-relaxed mb-9 max-w-[460px]">
            Del din mening på 3 minutter og vær med i lodtrækningen om en iPad.
            Dine svar er anonyme og hjælper os gøre løn nemmere for alle.
          </p>

          <div className="flex gap-8 mb-9">
            {[['~3 min', 'at gennemføre'], ['5 spm', 'korte spørgsmål'], ['1 iPad', 'til en heldig deltager']].map(([n, l]) => (
              <div key={n}>
                <div className="text-[22px] font-black">{n}</div>
                <div className="text-xs text-white/50">{l}</div>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={onStart}
            className="inline-flex items-center gap-2.5 bg-primary text-white px-8 py-4 rounded-xl text-base font-bold shadow-[0_4px_20px_rgba(0,200,150,0.35)] hover:bg-primary-dark hover:-translate-y-0.5 hover:shadow-[0_6px_24px_rgba(0,200,150,0.45)] transition-all duration-200"
          >
            Start undersøgelsen →
          </button>
          <p className="text-xs text-white/35 mt-4">Ingen krav om nyhedsbrevstilmelding · Ingen spam</p>

          {/* iPad CSS illustration */}
          <div className="absolute right-8 bottom-0 w-24 flex flex-col items-center pointer-events-none">
            <div className="w-20 h-28 bg-gradient-to-br from-[#2a2a3a] to-[#1a1a28] rounded-xl border-2 border-[#3a3a4a] flex items-center justify-center shadow-2xl">
              <div className="w-16 h-[88px] bg-gradient-to-br from-[#0d4a3a] to-[#0a3020] rounded-lg flex items-center justify-center">
                <span className="text-primary text-[9px] font-bold text-center leading-relaxed">✦<br />iPad<br />Pro</span>
              </div>
            </div>
          </div>
        </div>

        {/* Perk cards */}
        <div className="grid grid-cols-2 gap-3">
          {[
            ['🔒', 'Anonymt og trygt', 'Dine svar behandles fortroligt og bruges udelukkende til at forbedre løsninger.'],
            ['🎯', 'Tilpassede spørgsmål', 'Spørgsmålene tilpasser sig, om du er Zenegy-kunde eller bruger et andet system.'],
            ['🏆', 'iPad konkurrence', 'Alle der deltager er med i lodtrækningen — uanset om du tilmelder nyhedsbrev eller ej.'],
            ['💬', 'Din stemme tæller', 'Resultaterne former, hvad vi prioriterer og hvilke problemer vi løser næst.'],
          ].map(([icon, title, desc]) => (
            <div key={title} className="bg-white rounded-2xl p-5 border border-app-border">
              <div className="text-2xl mb-2.5">{icon}</div>
              <div className="text-sm font-bold text-text-main mb-1">{title}</div>
              <div className="text-[13px] text-text-muted leading-relaxed">{desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
