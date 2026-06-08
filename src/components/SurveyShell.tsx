import type { Direction, Phase } from '../types'
import { useIsMobile } from '../lib/useIsMobile'

export interface StepGroup {
  label: string
  questionIds: string[]
}

interface Props {
  stepGroups: StepGroup[]
  currentStepIndex: number
  percent: number
  phase: Phase
  direction: Direction
  animKey: number
  showBack?: boolean
  backLabel?: string
  onBack?: () => void
  showNext?: boolean
  nextLabel?: string
  nextDisabled?: boolean
  onNext?: () => void
  onExit?: () => void
  onNavigateWelcome?: () => void
  onNavigateStep?: (groupIndex: number) => void
  children: React.ReactNode
}

const ACCENT = '#6e30fd'
const PILL = '#efeafe'

/** The Zenegy app symbol — lavender square + purple mark. */
function AppSymbol({ size = 36 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" style={{ display: 'block' }}>
      <rect width="40" height="40" rx="8" fill="#EBE6FF" />
      <path d="M20.8139 16.679H12.3237C11.3902 16.679 10.6123 17.4287 10.6123 18.3769V26.2927C10.6123 28.189 13.1016 28.9387 14.1684 27.3511L21.0362 17.098C21.1473 16.9216 21.0362 16.679 20.8139 16.679Z" fill="#6E30FD" />
      <path d="M19.1471 24.419H27.6373C28.5708 24.419 29.3487 23.6693 29.3487 22.7212V14.8053C29.3487 12.909 26.8594 12.1593 25.7926 13.7469L18.9248 24.0001C18.8137 24.1765 18.9248 24.419 19.1471 24.419Z" fill="#6E30FD" />
    </svg>
  )
}

type StepState = 'done' | 'active' | 'upcoming'

function StatusDot({ state }: { state: StepState }) {
  const base: React.CSSProperties = { width: 11, height: 11, borderRadius: '50%', flexShrink: 0, transition: 'all 0.25s ease' }
  if (state === 'done') return <span style={{ ...base, background: ACCENT }} />
  if (state === 'active') return <span style={{ ...base, border: `2px solid ${ACCENT}`, boxShadow: `0 0 0 4px ${ACCENT}24` }} />
  return <span style={{ ...base, border: '2px solid #d6d6de' }} />
}

function MilestoneIcon({ state, kind }: { state: StepState; kind: 'home' | 'flag' }) {
  const on = state === 'active' || state === 'done'
  return (
    <span style={{
      width: 22, height: 22, borderRadius: 7, flexShrink: 0,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: on ? PILL : '#f1f1f4', color: on ? ACCENT : '#b1b1bb', transition: 'all 0.25s ease',
    }}>
      {kind === 'home' ? (
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 10.5 12 3l9 7.5" /><path d="M5 9.5V20h14V9.5" />
        </svg>
      ) : (
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 21V5a2 2 0 0 1 2-2h7l-1 4h6v8h-7l1-4H7" />
        </svg>
      )}
    </span>
  )
}

function StepRow({ label, state, icon, onClick }: { label: string; state: StepState; icon?: React.ReactNode; onClick?: () => void }) {
  const color = state === 'active' ? '#4a1fb0' : state === 'done' ? '#86868b' : '#b1b1bb'
  const isActive = state === 'active'
  const style: React.CSSProperties = {
    display: 'flex', alignItems: 'center', gap: 12, padding: '9px 12px', borderRadius: 10, fontSize: 14,
    background: isActive ? PILL : 'transparent', color, transition: 'background 0.18s ease, color 0.25s ease',
    width: '100%', textAlign: 'left', border: 'none', fontFamily: 'var(--font-sans)',
    cursor: onClick ? 'pointer' : 'default',
  }
  const inner = (
    <>
      {icon ?? <StatusDot state={state} />}
      <span style={{ flex: 1, fontWeight: 500 }}>{label}</span>
    </>
  )
  if (!onClick) return <div style={style}>{inner}</div>
  return (
    <button
      type="button" style={style} onClick={onClick}
      onMouseEnter={e => { if (!isActive) (e.currentTarget as HTMLButtonElement).style.background = '#f4f4f6' }}
      onMouseLeave={e => { if (!isActive) (e.currentTarget as HTMLButtonElement).style.background = 'transparent' }}
    >
      {inner}
    </button>
  )
}

function progressCopy(phase: Phase, percent: number): { title: string; desc: string } {
  if (phase === 'thank-you') return { title: 'Færdig', desc: 'Tak for din tid.' }
  if (phase === 'landing') return { title: 'Klar?', desc: 'Det tager kun 2–3 minutter.' }
  if (percent >= 50) return { title: 'Du er over halvvejs', desc: 'Færdiggør de sidste spørgsmål.' }
  return { title: 'Godt i gang', desc: 'Tag den tid du har brug for.' }
}

/** Segmented tick bar (light→deep purple gradient on the filled ticks). */
function TickBar({ percent, total = 28 }: { percent: number; total?: number }) {
  const filled = Math.round((percent / 100) * total)
  return (
    <div style={{ display: 'flex', gap: 3, alignItems: 'flex-end', height: 22 }}>
      {Array.from({ length: total }, (_, i) => {
        if (i >= filled) return <span key={i} style={{ flex: 1, height: '100%', borderRadius: 3, background: '#e9e7f1' }} />
        const t = filled > 1 ? i / (filled - 1) : 1
        const r = Math.round(189 + (110 - 189) * t)
        const g = Math.round(163 + (48 - 163) * t)
        const b = Math.round(255 + (253 - 255) * t)
        return <span key={i} style={{ flex: 1, height: '100%', borderRadius: 3, background: `rgb(${r},${g},${b})` }} />
      })}
    </div>
  )
}

function ProgressCard({ phase, percent }: { phase: Phase; percent: number }) {
  const { title, desc } = progressCopy(phase, percent)
  return (
    <div style={{ marginTop: 14, background: '#faf8ff', border: '1px solid #eee8ff', borderRadius: 15, padding: '15px 15px 16px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 14.5, fontWeight: 500, color: '#14132b', letterSpacing: '-0.01em' }}>{title}</span>
        <span style={{ fontSize: 12.5, fontWeight: 500, color: '#fff', background: ACCENT, borderRadius: 8, padding: '3px 9px' }}>{Math.round(percent)}%</span>
      </div>
      <div style={{ fontSize: 12.5, fontWeight: 500, color: '#9a9aa3', lineHeight: 1.45, marginTop: 5, marginBottom: 14 }}>{desc}</div>
      <TickBar percent={percent} />
    </div>
  )
}

function ExitLink({ onExit, style }: { onExit: () => void; style?: React.CSSProperties }) {
  return (
    <button
      type="button"
      onClick={onExit}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 6, border: 'none', background: 'none', cursor: 'pointer',
        fontSize: 12.5, fontWeight: 500, color: '#9a9aa3', fontFamily: 'var(--font-sans)', transition: 'color 0.12s ease', ...style,
      }}
      onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = '#5b5b66' }}
      onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = '#9a9aa3' }}
    >
      <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
        <path d="M9 3L5 7L9 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      Forlad undersøgelsen
    </button>
  )
}

function NavBar({
  showBack, backLabel = 'Tilbage', onBack, showNext, nextLabel = 'Næste', nextDisabled, onNext, padInline, sticky,
}: {
  showBack?: boolean; backLabel?: string; onBack?: () => void
  showNext?: boolean; nextLabel?: string; nextDisabled?: boolean; onNext?: () => void
  padInline: number; sticky?: boolean
}) {
  return (
    <div style={{
      borderTop: '1px solid #ededf0', padding: `0 ${padInline}px`, background: 'rgba(244,244,246,0.92)',
      backdropFilter: 'saturate(180%) blur(8px)',
      ...(sticky ? { position: 'sticky', bottom: 0, zIndex: 5 } : null),
    }}>
      <div style={{ maxWidth: 580, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 0' }}>
        {showBack ? (
          <button
            type="button" onClick={onBack}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 7, border: 'none', background: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 500, color: '#9a9aa3', fontFamily: 'var(--font-sans)', transition: 'color 0.12s ease' }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = '#5b5b66' }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = '#9a9aa3' }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
            {backLabel}
          </button>
        ) : <span />}
        {showNext && (
          <button
            type="button" onClick={onNext} disabled={nextDisabled}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8, padding: '13px 28px', borderRadius: 13, border: 'none',
              background: ACCENT, color: '#fff', fontSize: 15, fontWeight: 500, fontFamily: 'var(--font-sans)',
              cursor: nextDisabled ? 'not-allowed' : 'pointer', opacity: nextDisabled ? 0.4 : 1,
              boxShadow: nextDisabled ? 'none' : '0 8px 22px rgba(110,48,253,0.28)', transition: 'opacity 0.15s ease, box-shadow 0.15s ease',
            }}
          >
            {nextLabel}
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6 4L10 8L6 12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
        )}
      </div>
    </div>
  )
}

export function SurveyShell({
  stepGroups, currentStepIndex, percent, phase, direction, animKey,
  showBack = false, backLabel = 'Tilbage', onBack,
  showNext = false, nextLabel = 'Næste', nextDisabled = false, onNext,
  onExit, onNavigateWelcome, onNavigateStep, children,
}: Props) {
  const isMobile = useIsMobile()
  const enterClass = direction === 'forward' ? 'anim-slide-in-right' : 'anim-slide-in-left'
  const canExit = onExit && phase !== 'landing' && phase !== 'thank-you'

  const currentLabel = phase === 'landing' ? 'Velkommen'
    : phase === 'thank-you' ? 'Tak'
      : (stepGroups[currentStepIndex]?.label ?? '')

  // ── MOBILE: compact top bar + stacked card + sticky bottom nav ──
  if (isMobile) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: '#f4f4f6' }}>
        <header style={{ position: 'sticky', top: 0, zIndex: 10, background: '#fff', borderBottom: '1px solid #ededf0', padding: '12px 16px 10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
            <button
              type="button" onClick={onExit} aria-label="Til forsiden"
              style={{ border: 'none', background: 'none', padding: 0, cursor: onExit ? 'pointer' : 'default', flexShrink: 0 }}
            >
              <AppSymbol size={30} />
            </button>
            <span style={{ flex: 1, fontSize: 14, fontWeight: 500, color: '#14132b' }}>{currentLabel}</span>
            <span style={{ fontSize: 12.5, fontWeight: 500, color: '#fff', background: ACCENT, borderRadius: 8, padding: '3px 9px' }}>{Math.round(percent)}%</span>
          </div>
          <div style={{ height: 5, borderRadius: 99, background: '#e9e7f1', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${percent}%`, borderRadius: 99, background: ACCENT, transition: 'width 0.4s cubic-bezier(0.22,1,0.36,1)' }} />
          </div>
        </header>

        <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <div style={{ flex: 1, padding: '20px 16px 24px' }}>
            <div key={animKey} className={enterClass} style={{ background: '#fff', borderRadius: 20, padding: '28px 22px 32px', boxShadow: '0 8px 30px rgba(20,12,43,0.06)' }}>
              {children}
            </div>
            {canExit && <div style={{ textAlign: 'center', marginTop: 18 }}><ExitLink onExit={onExit!} /></div>}
          </div>
          {(showBack || showNext) && (
            <NavBar showBack={showBack} backLabel={backLabel} onBack={onBack} showNext={showNext} nextLabel={nextLabel} nextDisabled={nextDisabled} onNext={onNext} padInline={16} sticky />
          )}
        </main>
      </div>
    )
  }

  // ── DESKTOP: persistent sidebar + main ──
  const groupState = (i: number): StepState => {
    if (phase === 'landing') return 'upcoming'
    if (phase === 'thank-you') return 'done'
    if (i < currentStepIndex) return 'done'
    if (i === currentStepIndex) return 'active'
    return 'upcoming'
  }
  const velkommenState: StepState = phase === 'landing' ? 'active' : 'done'
  const takState: StepState = phase === 'thank-you' ? 'active' : 'upcoming'
  // Let respondents jump back to steps they've reached (not while on landing/thank-you).
  const navEnabled = phase === 'questions' || phase === 'lead-gen'

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f4f4f6' }}>
      <aside style={{
        width: 280, flexShrink: 0, background: '#fff', borderRight: '1px solid #ededf0',
        display: 'flex', flexDirection: 'column', padding: '24px 18px 20px',
        position: 'sticky', top: 0, height: '100vh', overflowY: 'auto',
      }}>
        <button
          type="button" onClick={onExit} aria-label="Til forsiden"
          style={{ border: 'none', background: 'none', padding: 0, marginBottom: 28, marginLeft: 6, cursor: onExit ? 'pointer' : 'default', alignSelf: 'flex-start', transition: 'opacity 0.12s ease', borderRadius: 8 }}
          onMouseEnter={e => { if (onExit) (e.currentTarget as HTMLButtonElement).style.opacity = '0.7' }}
          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.opacity = '1' }}
        >
          <AppSymbol />
        </button>

        <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
          <StepRow
            label="Velkommen" state={velkommenState} icon={<MilestoneIcon state={velkommenState} kind="home" />}
            onClick={navEnabled && onNavigateWelcome ? onNavigateWelcome : undefined}
          />
          <div style={{ height: 1, background: '#f0f0f3', margin: '7px 6px' }} />
          {stepGroups.map((g, i) => {
            const st = groupState(i)
            const clickable = navEnabled && onNavigateStep && st !== 'upcoming'
            return <StepRow key={g.label} label={g.label} state={st} onClick={clickable ? () => onNavigateStep!(i) : undefined} />
          })}
          <div style={{ height: 1, background: '#f0f0f3', margin: '7px 6px' }} />
          <StepRow label="Tak" state={takState} icon={<MilestoneIcon state={takState} kind="flag" />} />
        </nav>

        <ProgressCard phase={phase} percent={percent} />
        {canExit && <ExitLink onExit={onExit!} style={{ marginTop: 14, paddingLeft: 6, alignSelf: 'flex-start' }} />}
      </aside>

      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 48px 16px' }}>
          <div style={{ width: '100%', maxWidth: 580 }}>
            <div key={animKey} className={enterClass} style={{ background: '#fff', borderRadius: 24, padding: '42px 46px 46px', boxShadow: '0 10px 40px rgba(20,12,43,0.06)' }}>
              {children}
            </div>
          </div>
        </div>
        {(showBack || showNext) && (
          <NavBar showBack={showBack} backLabel={backLabel} onBack={onBack} showNext={showNext} nextLabel={nextLabel} nextDisabled={nextDisabled} onNext={onNext} padInline={48} />
        )}
      </main>
    </div>
  )
}
