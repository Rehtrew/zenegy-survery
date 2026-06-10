import { AnimatePresence, motion } from 'motion/react'
import type { Direction, Phase } from '../types'
import { useIsMobile } from '../lib/useIsMobile'

export interface StepGroup {
  label: string
  questionIds: string[]
  subItems?: string[]
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
  sectionStep?: number
  sectionTotal?: number
  children: React.ReactNode
}

const ACCENT = '#6e30fd'

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

/** A single row in the sidebar timeline. Renders its dot + the connector line below it. */
function TimelineStep({ label, state, isLast, onClick, subItems, activeSubIndex }: {
  label: string; state: StepState; isLast: boolean; onClick?: () => void
  subItems?: string[]; activeSubIndex?: number
}) {
  const isDone = state === 'done'
  const isActive = state === 'active'
  const showSubs = isActive && subItems && subItems.length > 1

  return (
    <div
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onClick={onClick}
      onKeyDown={onClick ? e => { if (e.key === 'Enter' || e.key === ' ') onClick() } : undefined}
      style={{ display: 'flex', gap: 12, cursor: onClick ? 'pointer' : 'default' }}
    >
      {/* Dot + connector column */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 18, flexShrink: 0, paddingTop: 2 }}>
        <div style={{
          width: 16, height: 16, borderRadius: '50%', flexShrink: 0,
          background: isDone ? ACCENT : 'transparent',
          border: isDone ? 'none' : isActive ? `2px solid ${ACCENT}` : '1.5px solid #d6d6de',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxSizing: 'border-box', transition: 'background 0.25s ease, border-color 0.25s ease',
        }}>
          {isDone && (
            <svg width="8" height="8" viewBox="0 0 10 10" fill="none">
              <path d="M2 5l2.5 2.5L8 3" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
          {isActive && <div style={{ width: 5, height: 5, borderRadius: '50%', background: ACCENT }} />}
        </div>
        {!isLast && (
          <div style={{
            flex: 1, width: 1.5, minHeight: 20, margin: '3px 0', borderRadius: 2,
            background: isDone ? `${ACCENT}45` : '#e4e4ea',
            transition: 'background 0.3s ease',
          }} />
        )}
      </div>

      {/* Label + optional expanded sub-items */}
      <div style={{ paddingBottom: isLast ? 8 : 22, flex: 1 }}>
        <span style={{
          fontSize: 13.5, lineHeight: 1.4, transition: 'color 0.2s ease',
          fontWeight: isActive ? 500 : 400,
          color: isActive ? '#14132b' : isDone ? '#9a9aa3' : '#c4c4cc',
        }}>
          {label}
        </span>

        {showSubs && (
          <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 6 }}>
            {subItems!.map((sub, i) => {
              const subDone = i < (activeSubIndex ?? 0)
              const subActive = i === (activeSubIndex ?? 0)
              return (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                  <div style={{
                    width: 5, height: 5, borderRadius: '50%', flexShrink: 0, marginTop: 5,
                    background: subDone ? ACCENT : subActive ? `${ACCENT}80` : '#dcdce4',
                    transition: 'background 0.2s',
                  }} />
                  <span style={{
                    fontSize: 11.5, lineHeight: 1.4,
                    color: subActive ? '#3d1d7a' : subDone ? '#9a9aa3' : '#c0c0c8',
                    fontWeight: subActive ? 500 : 400,
                    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                  }}>
                    {sub}
                  </span>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

function progressCopy(phase: Phase, percent: number): { title: string; desc: string } {
  if (phase === 'thank-you') return { title: 'Færdig', desc: 'Tak for din tid.' }
  if (phase === 'landing') return { title: 'Klar?', desc: 'Det tager kun 2–3 minutter.' }
  if (percent >= 50) return { title: 'Du er over halvvejs', desc: 'Færdiggør de sidste spørgsmål.' }
  return { title: 'Godt i gang', desc: 'Tag den tid du har brug for.' }
}

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

function CardStack({
  animKey, direction, stacked, radius, padding, shadow, children,
}: {
  animKey: number; direction: Direction; stacked: boolean
  radius: number; padding: string; shadow: string; children: React.ReactNode
}) {
  const dir = direction === 'forward' ? 1 : -1
  const liftedShadow = '0 34px 70px rgba(20,12,43,0.22)'
  const variants = {
    enter: { y: -64, scale: 1.06, rotate: dir * -3, opacity: 0, zIndex: 2, boxShadow: liftedShadow },
    center: { y: 0, scale: 1, rotate: 0, opacity: 1, zIndex: 2, boxShadow: shadow },
    exit: { y: 22, scale: 0.88, rotate: 0, opacity: 0, zIndex: 1, boxShadow: shadow },
  }
  const ghost = (ty: number, scale: number, opacity: number): React.CSSProperties => ({
    position: 'absolute', left: 0, right: 0, top: 0, bottom: 0,
    background: '#fff', borderRadius: radius, opacity, zIndex: 0,
    transform: `translateY(${ty}px) scale(${scale})`,
    boxShadow: '0 12px 30px rgba(20,12,43,0.06)',
    border: '1px solid #eef0f4',
  })
  return (
    <div style={{ position: 'relative' }}>
      {stacked && (
        <>
          <div aria-hidden style={ghost(44, 0.9, 0.45)} />
          <div aria-hidden style={ghost(28, 0.935, 0.7)} />
          <div aria-hidden style={ghost(13, 0.97, 0.92)} />
        </>
      )}
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.div
          key={animKey}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            type: 'spring', stiffness: 460, damping: 25, mass: 1,
            opacity: { duration: 0.15 }, boxShadow: { duration: 0.32 },
          }}
          style={{ position: 'relative', background: '#fff', borderRadius: radius, padding, transformOrigin: 'center' }}
        >
          {children}
        </motion.div>
      </AnimatePresence>
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
  onExit, onNavigateStep, sectionStep, children,
}: Props) {
  const isMobile = useIsMobile()
  const canExit = onExit && phase !== 'landing' && phase !== 'thank-you'

  const currentLabel = phase === 'landing' ? 'Velkommen'
    : phase === 'thank-you' ? 'Tak'
      : (stepGroups[currentStepIndex]?.label ?? '')

  // ── MOBILE: sticky top bar + bottom nav ──
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
          <div style={{ flex: 1, padding: '20px 16px 24px', overflowX: 'hidden' }}>
            <CardStack animKey={animKey} direction={direction} stacked={phase === 'questions'} radius={20} padding="28px 22px 32px" shadow="0 8px 30px rgba(20,12,43,0.06)">
              {children}
            </CardStack>
            {canExit && <div style={{ textAlign: 'center', marginTop: 18 }}><ExitLink onExit={onExit!} /></div>}
          </div>
          {(showBack || showNext) && (
            <NavBar showBack={showBack} backLabel={backLabel} onBack={onBack} showNext={showNext} nextLabel={nextLabel} nextDisabled={nextDisabled} onNext={onNext} padInline={16} sticky />
          )}
        </main>
      </div>
    )
  }

  // ── DESKTOP: persistent sidebar + card with inline footer ──
  const groupState = (i: number): StepState => {
    if (phase === 'landing') return 'upcoming'
    if (phase === 'thank-you') return 'done'
    if (i < currentStepIndex) return 'done'
    if (i === currentStepIndex) return 'active'
    return 'upcoming'
  }
  const takState: StepState = phase === 'thank-you' ? 'active' : 'upcoming'
  const navEnabled = phase === 'questions'

  const hasCardNav = showBack || showNext
  // Remove bottom padding from card when we render our own footer inside it
  const cardPadding = hasCardNav ? '42px 46px 0' : '42px 46px 46px'

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f4f4f6' }}>
      {/* ── Sidebar ── */}
      <aside style={{
        width: 272, flexShrink: 0, background: '#fff', borderRight: '1px solid #ededf0',
        display: 'flex', flexDirection: 'column', padding: '24px 20px 20px',
        position: 'sticky', top: 0, height: '100vh', overflowY: 'auto',
      }}>
        {/* Logo — click goes to landing */}
        <button
          type="button" onClick={onExit} aria-label="Til forsiden"
          style={{ border: 'none', background: 'none', padding: 0, marginBottom: 32, marginLeft: 2, cursor: onExit ? 'pointer' : 'default', alignSelf: 'flex-start', transition: 'opacity 0.12s ease', borderRadius: 8 }}
          onMouseEnter={e => { if (onExit) (e.currentTarget as HTMLButtonElement).style.opacity = '0.7' }}
          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.opacity = '1' }}
        >
          <AppSymbol />
        </button>

        {/* Timeline nav — vertically centered */}
        <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingLeft: 4 }}>
          {stepGroups.map((g, i) => {
            const st = groupState(i)
            const clickable = navEnabled && onNavigateStep && st !== 'upcoming'
            const activeSubIndex = st === 'active' && sectionStep != null ? sectionStep - 1 : undefined
            return (
              <TimelineStep
                key={g.label}
                label={g.label}
                state={st}
                isLast={false}
                subItems={g.subItems}
                activeSubIndex={activeSubIndex}
                onClick={clickable ? () => onNavigateStep!(i) : undefined}
              />
            )
          })}
          <TimelineStep label="Tak" state={takState} isLast />
        </nav>

        <ProgressCard phase={phase} percent={percent} />
      </aside>

      {/* ── Main ── */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: '100vh', position: 'relative' }}>
        {/* Forlad — top right, discrete */}
        {canExit && (
          <div style={{ position: 'absolute', top: 20, right: 28, zIndex: 6 }}>
            <ExitLink onExit={onExit!} />
          </div>
        )}

        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '56px 48px 48px', overflowX: 'hidden' }}>
          <div style={{ width: '100%', maxWidth: 580 }}>
            <CardStack
              animKey={animKey} direction={direction} stacked={phase === 'questions'}
              radius={24} padding={cardPadding} shadow="0 10px 40px rgba(20,12,43,0.06)"
            >
              <>
                {children}
                {/* Card footer — back + next inside the card */}
                {hasCardNav && (
                  <div style={{
                    borderTop: '1px solid #f0f0f4',
                    margin: '28px -46px 0',
                    padding: '18px 46px 28px',
                    display: 'flex',
                    justifyContent: showBack && showNext ? 'space-between' : showNext ? 'flex-end' : 'flex-start',
                    alignItems: 'center',
                  }}>
                    {showBack && (
                      <button
                        type="button" onClick={onBack}
                        style={{ display: 'inline-flex', alignItems: 'center', gap: 6, border: 'none', background: 'none', cursor: 'pointer', fontSize: 13.5, fontWeight: 500, color: '#9a9aa3', fontFamily: 'var(--font-sans)', transition: 'color 0.12s ease' }}
                        onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = '#5b5b66' }}
                        onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = '#9a9aa3' }}
                      >
                        <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
                          <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        {backLabel}
                      </button>
                    )}
                    {showNext && (
                      <button
                        type="button" onClick={onNext} disabled={nextDisabled}
                        style={{
                          display: 'inline-flex', alignItems: 'center', gap: 8, padding: '13px 28px', borderRadius: 13, border: 'none',
                          background: ACCENT, color: '#fff', fontSize: 15, fontWeight: 500, fontFamily: 'var(--font-sans)',
                          cursor: nextDisabled ? 'not-allowed' : 'pointer', opacity: nextDisabled ? 0.4 : 1,
                          boxShadow: nextDisabled ? 'none' : '0 8px 22px rgba(110,48,253,0.28)',
                          transition: 'opacity 0.15s ease, box-shadow 0.15s ease',
                        }}
                      >
                        {nextLabel}
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                          <path d="M6 4L10 8L6 12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </button>
                    )}
                  </div>
                )}
              </>
            </CardStack>
          </div>
        </div>
      </main>
    </div>
  )
}
