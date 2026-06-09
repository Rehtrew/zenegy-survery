/**
 * Landing / welcome — a full-bleed marketing hero (no survey sidebar; the sidebar
 * shell appears once the survey starts). Top header with the Zenegy lockup + a
 * "Start" CTA, a copy column on the left, and the LandingReport visual bleeding off
 * the right. On narrow screens the hero collapses to a single column.
 *
 * Copy is framed around what a respondent cares about: what it's about, how little
 * effort it takes, that it's safe to be honest, and that they get the results back.
 */
import { LandingReport } from './LandingReport'
import { Glyph } from '../components/icons/glyphs'

const ACCENT = '#6e30fd'

function ValueRow({ icon, title, sub }: { icon: React.ReactNode; title: string; sub: string }) {
  return (
    <div className="value-row" style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
      <span style={{
        width: 40, height: 40, borderRadius: 11, flexShrink: 0,
        background: '#ebe6ff', display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        {icon}
      </span>
      <span style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <span style={{ fontSize: 15, fontWeight: 500, color: '#14132b' }}>{title}</span>
        <span style={{ fontSize: 13.5, fontWeight: 500, color: '#86868b', marginTop: 1 }}>{sub}</span>
      </span>
    </div>
  )
}

export function LandingPage({ onStart }: { onStart: () => void }) {
  return (
    <div className="lp-root">
      <header className="lp-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Glyph name="zenegy" size={34} />
          <span style={{ fontSize: 21, fontWeight: 500, letterSpacing: '-0.02em', color: '#14132b' }}>Zenegy</span>
        </div>
        <button type="button" onClick={onStart} className="lp-cta-sm">Start undersøgelsen</button>
      </header>

      <div className="lp-hero">
        <div className="lp-copy">
          {/* Eyebrow chip */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: '#efeafe', color: ACCENT, borderRadius: 9999,
            padding: '7px 15px', fontSize: 13, fontWeight: 500, marginBottom: 22, alignSelf: 'flex-start',
          }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: ACCENT }} />
            Markedsundersøgelse om løn
          </div>

          <h1 style={{ fontSize: 'clamp(30px, 4vw, 46px)', fontWeight: 500, lineHeight: 1.08, letterSpacing: '-0.03em', color: '#14132b', marginBottom: 18 }}>
            Hjælp os med at gøre løn bedre i Danmark
          </h1>
          <p style={{ fontSize: 17, fontWeight: 500, color: '#5b5b66', lineHeight: 1.6, marginBottom: 30, maxWidth: 520 }}>
            Vi er nysgerrige på din ærlige mening — uanset om du bruger Zenegy eller et helt
            andet system. Dine svar former de værktøjer, tusindvis af danske virksomheder
            bruger hver måned.
          </p>

          <button type="button" onClick={onStart} className="lp-cta">
            Start undersøgelsen
            <svg width="17" height="17" viewBox="0 0 16 16" fill="none"><path d="M6 4L10 8L6 12" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 34 }}>
            <ValueRow
              title="2–3 minutter"
              sub="De fleste er færdige på et par minutter."
              icon={
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={ACCENT} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="9" /><g className="ic-clock-hand"><path d="M12 7v5l3 2" /></g>
                </svg>
              }
            />
            <ValueRow
              title="Helt anonymt"
              sub="Vær ærlig — vi registrerer ikke, hvem du er."
              icon={
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={ACCENT} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="4" y="10.5" width="16" height="10" rx="2.5" /><path className="ic-lock-shackle" d="M8 10.5V7a4 4 0 0 1 8 0v3.5" />
                </svg>
              }
            />
            <ValueRow
              title="Vi deler resultaterne"
              sub="Du får indsigterne, når undersøgelsen lukker."
              icon={
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={ACCENT} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path className="ic-bar" d="M4 20V10" /><path className="ic-bar ic-bar-2" d="M10 20V4" /><path className="ic-bar ic-bar-3" d="M16 20v-6" /><path d="M3 20h18" />
                </svg>
              }
            />
          </div>
        </div>

        <LandingReport />
      </div>
    </div>
  )
}
