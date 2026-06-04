import type { Direction } from '../types'

interface Props {
  currentIndex: number
  totalQuestions: number
  direction: Direction
  animKey: number
  children: React.ReactNode
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

export function SurveyShell({ currentIndex, totalQuestions, direction, animKey, children }: Props) {
  const progressPct = totalQuestions > 1
    ? Math.round((currentIndex / (totalQuestions - 1)) * 100)
    : 0

  const enterClass = direction === 'forward' ? 'anim-slide-in-right' : 'anim-slide-in-left'

  return (
    <div className="min-h-screen bg-surface-page flex flex-col">
      {/* Header */}
      <header className="bg-surface-default border-b border-border-default px-8 py-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-2.5">
          <ZenegyLogo />
          <span className="text-[18px] font-medium text-text-primary tracking-tight">zenegy</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-text-secondary">{currentIndex + 1} af {totalQuestions}</span>
          <div className="w-40 h-1.5 bg-surface-subtle rounded-z-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-z-full transition-[width] duration-[400ms] ease-in-out"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>
      </header>

      {/* Question area */}
      <main className="flex-1 flex items-start justify-center px-6 py-14 overflow-hidden">
        <div key={animKey} className={`w-full max-w-[640px] ${enterClass}`}>
          {children}
        </div>
      </main>

      {/* Keyboard hint */}
      <div className="pb-6 text-center">
        <span className="text-xs text-text-secondary">
          Tryk{' '}
          <kbd className="px-1.5 py-0.5 rounded bg-surface-subtle text-text-secondary font-mono text-[10px]">Enter</kbd>
          {' '}for at fortsætte ·{' '}
          <kbd className="px-1.5 py-0.5 rounded bg-surface-subtle text-text-secondary font-mono text-[10px]">←</kbd>
          {' '}for at gå tilbage
        </span>
      </div>
    </div>
  )
}
