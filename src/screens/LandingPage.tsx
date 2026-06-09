/**
 * Landing / welcome — a two-column hero rendered inside the (wide, padding-less)
 * SurveyShell card on the landing phase. Left = welcome copy + value props; right =
 * the LandingReport visual. The "Start undersøgelsen" CTA lives in the shell's
 * bottom bar. On narrow screens the grid collapses to a single column.
 *
 * Copy is framed around what a respondent cares about: what it's about, how little
 * effort it takes, that it's safe to be honest, and that they get the results back.
 */
import { LandingReport } from './LandingReport'

const ACCENT = '#6e30fd'

function ValueRow({ icon, title, sub }: { icon: React.ReactNode; title: string; sub: string }) {
  return (
    <div className="value-row" style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
      <span style={{
        width: 44, height: 44, borderRadius: 12, flexShrink: 0,
        background: '#ebe6ff', display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        {icon}
      </span>
      <span style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <span style={{ fontSize: 16, fontWeight: 500, color: '#14132b' }}>{title}</span>
        <span style={{ fontSize: 14, fontWeight: 500, color: '#86868b', marginTop: 2 }}>{sub}</span>
      </span>
    </div>
  )
}

export function LandingPage() {
  return (
    <div className="hero-grid">
      <div className="hero-copy">
      {/* Eyebrow chip */}
      <div style={{
        display: 'inline-flex', alignItems: 'center', gap: 8,
        background: '#efeafe', color: ACCENT, borderRadius: 9999,
        padding: '7px 15px', fontSize: 13, fontWeight: 500, marginBottom: 24,
      }}>
        <span style={{ width: 6, height: 6, borderRadius: '50%', background: ACCENT }} />
        Markedsundersøgelse om løn
      </div>

      {/* Headline + purpose */}
      <h1 style={{ fontSize: 'clamp(26px, 7vw, 33px)', fontWeight: 500, lineHeight: 1.12, letterSpacing: '-0.03em', color: '#14132b', marginBottom: 16 }}>
        Hjælp os med at gøre løn bedre i Danmark
      </h1>
      <p style={{ fontSize: 16.5, fontWeight: 500, color: '#5b5b66', lineHeight: 1.6, marginBottom: 34 }}>
        Vi er nysgerrige på din ærlige mening — uanset om du bruger Zenegy eller et helt
        andet system. Dine svar er med til at forme de værktøjer, tusindvis af danske
        virksomheder bruger hver måned.
      </p>

      {/* Consistent value props */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <ValueRow
          title="2–3 minutter"
          sub="De fleste er færdige på et par minutter."
          icon={
            <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke={ACCENT} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="9" /><g className="ic-clock-hand"><path d="M12 7v5l3 2" /></g>
            </svg>
          }
        />
        <ValueRow
          title="Helt anonymt"
          sub="Vær ærlig — vi registrerer ikke, hvem du er."
          icon={
            <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke={ACCENT} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="4" y="10.5" width="16" height="10" rx="2.5" /><path className="ic-lock-shackle" d="M8 10.5V7a4 4 0 0 1 8 0v3.5" />
            </svg>
          }
        />
        <ValueRow
          title="Vi deler resultaterne"
          sub="Du får indsigterne, når undersøgelsen lukker."
          icon={
            <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke={ACCENT} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path className="ic-bar" d="M4 20V10" /><path className="ic-bar ic-bar-2" d="M10 20V4" /><path className="ic-bar ic-bar-3" d="M16 20v-6" /><path d="M3 20h18" />
            </svg>
          }
        />
      </div>
      </div>

      <LandingReport />
    </div>
  )
}
