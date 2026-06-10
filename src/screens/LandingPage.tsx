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
import wordmark from '../assets/zenegy-wordmark.svg'

const ICON_COLOR = '#636374'

function ValueRow({ icon, title, sub }: { icon: React.ReactNode; title: string; sub: string }) {
  return (
    <div className="value-row" style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
      <span style={{
        width: 40, height: 40, borderRadius: 11, flexShrink: 0,
        background: '#f0f0f3', display: 'flex', alignItems: 'center', justifyContent: 'center',
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
          <img src={wordmark} alt="Zenegy" style={{ height: 20, width: 'auto', display: 'block', marginTop: 4 }} />
        </div>
      </header>

      <div className="lp-hero">
        <div className="lp-copy">
          <div style={{ maxWidth: 520, width: '100%' }}>
            {/* Eyebrow chip */}
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: '#f0f0f3', color: '#5b5b66', borderRadius: 9999,
              padding: '7px 15px', fontSize: 13, fontWeight: 500, marginBottom: 22,
            }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#9090a0' }} />
              Markedsundersøgelse 2026
            </div>

            <h1 style={{ fontSize: 'clamp(30px, 4vw, 46px)', fontWeight: 500, lineHeight: 1.08, letterSpacing: '-0.03em', color: '#14132b', marginBottom: 18 }}>
              Hvordan klarer din virksomhed sig på løn og administration?
            </h1>
            <p style={{ fontSize: 17, fontWeight: 500, color: '#5b5b66', lineHeight: 1.6, marginBottom: 30 }}>
              Hvor meget tid bruger danske virksomheder på lønkørsel — og hvor trygge er vi ved
              AI i processen? Del dine erfaringer på 2–3 min og få Lønmarkedsrapporten 2026
              tilsendt, så du kan benchmarke dine egne processer mod resten af markedet.
            </p>

            <button type="button" onClick={onStart} className="lp-cta">
              Start undersøgelsen
              <svg width="17" height="17" viewBox="0 0 16 16" fill="none"><path d="M6 4L10 8L6 12" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </button>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 34 }}>
              <ValueRow
                title="2–3 minutter"
                sub="Kort og kontant — de fleste er færdige på et øjeblik."
                icon={
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={ICON_COLOR} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="9" /><g className="ic-clock-hand"><path d="M12 7v5l3 2" /></g>
                  </svg>
                }
              />
              <ValueRow
                title="Anonymt"
                sub="Vi registrerer ikke, hvem du er. Til sidst kan du selv vælge at give os din mail."
                icon={
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={ICON_COLOR} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="4" y="10.5" width="16" height="10" rx="2.5" /><path className="ic-lock-shackle" d="M8 10.5V7a4 4 0 0 1 8 0v3.5" />
                  </svg>
                }
              />
              <ValueRow
                title="Få rapporten tilsendt"
                sub="Du modtager de samlede indsigter og benchmarks, når undersøgelsen lukker."
                icon={
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={ICON_COLOR} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path className="ic-bar" d="M4 20V10" /><path className="ic-bar ic-bar-2" d="M10 20V4" /><path className="ic-bar ic-bar-3" d="M16 20v-6" /><path d="M3 20h18" />
                  </svg>
                }
              />
            </div>
          </div>
        </div>

        <LandingReport />
      </div>
    </div>
  )
}
