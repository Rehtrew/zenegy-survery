import type { Direction } from '../types'

interface Props {
  currentIndex: number
  totalQuestions: number
  direction: Direction
  animKey: number
  children: React.ReactNode
}

const ZenegyLogo = () => (
  <svg width="28" height="28" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="64" height="64" rx="14" fill="#6e30fd"/>
    <g transform="translate(10, 13.15) scale(0.662)">
      <path d="M36.1862 13.5684H6.07046C2.7593 13.5684 0 16.2488 0 19.6388V47.9414C0 54.7213 8.82975 57.4018 12.6139 51.7255L36.9746 15.0663C37.3688 14.4356 36.9746 13.5684 36.1862 13.5684Z" fill="white"/>
      <path d="M30.2737 41.242H60.3895C63.7007 41.242 66.46 38.5615 66.46 35.1715V6.869C66.46 0.0890055 57.6302 -2.59146 53.846 3.08482L29.4854 39.7441C29.0912 40.3748 29.4854 41.242 30.2737 41.242Z" fill="white"/>
    </g>
  </svg>
)

export function SurveyShell({ currentIndex, totalQuestions, direction, animKey, children }: Props) {
  const progressPct = totalQuestions > 1
    ? Math.round((currentIndex / (totalQuestions - 1)) * 100)
    : 0

  const enterClass = direction === 'forward' ? 'anim-slide-in-right' : 'anim-slide-in-left'

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-surface-page)', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <header style={{
        background: 'var(--color-surface-default)',
        borderBottom: '1px solid var(--color-border-default)',
        padding: '14px 32px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 10,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <ZenegyLogo />
          <span style={{ fontSize: 18, fontWeight: 500, color: 'var(--color-text-primary)', letterSpacing: '-0.3px' }}>zenegy</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>
            {currentIndex + 1} af {totalQuestions}
          </span>
          <div style={{
            width: 160,
            height: 4,
            background: 'var(--color-surface-subtle)',
            borderRadius: 9999,
            overflow: 'hidden',
          }}>
            <div style={{
              height: '100%',
              background: 'var(--color-action-primary)',
              borderRadius: 9999,
              width: `${progressPct}%`,
              transition: 'width 400ms ease-in-out',
            }} />
          </div>
        </div>
      </header>

      {/* Question area */}
      <main style={{ flex: 1, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '56px 24px', overflow: 'hidden' }}>
        <div key={animKey} className={`w-full max-w-[640px] ${enterClass}`}>
          {children}
        </div>
      </main>

      {/* Keyboard hint */}
      <div style={{ paddingBottom: 24, textAlign: 'center' }}>
        <span style={{ fontSize: 12, color: 'var(--color-text-tertiary)' }}>
          Tryk{' '}
          <kbd style={{
            padding: '2px 6px',
            borderRadius: 4,
            background: 'var(--color-surface-subtle)',
            color: 'var(--color-text-secondary)',
            fontFamily: 'monospace',
            fontSize: 10,
          }}>Enter</kbd>
          {' '}for at fortsætte ·{' '}
          <kbd style={{
            padding: '2px 6px',
            borderRadius: 4,
            background: 'var(--color-surface-subtle)',
            color: 'var(--color-text-secondary)',
            fontFamily: 'monospace',
            fontSize: 10,
          }}>←</kbd>
          {' '}for at gå tilbage
        </span>
      </div>
    </div>
  )
}
