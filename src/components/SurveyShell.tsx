import type { Direction } from '../types'

interface Props {
  currentIndex: number
  totalQuestions: number
  direction: Direction
  animKey: number
  children: React.ReactNode
}

export function SurveyShell({ currentIndex, totalQuestions, direction, animKey, children }: Props) {
  const progressPct = totalQuestions > 1
    ? Math.round((currentIndex / (totalQuestions - 1)) * 100)
    : 0

  const enterClass = direction === 'forward' ? 'anim-slide-in-right' : 'anim-slide-in-left'

  return (
    <div className="min-h-screen bg-app-bg flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-app-border px-8 py-4 flex items-center justify-between sticky top-0 z-10">
        <div className="text-[22px] font-black tracking-tight text-text-main">
          zen<span className="text-primary">egy</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-text-muted">{currentIndex + 1} af {totalQuestions}</span>
          <div className="w-40 h-1 bg-app-border rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-[width] duration-[400ms] ease-in-out"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>
      </header>

      {/* Question area */}
      <main className="flex-1 flex items-start justify-center px-6 py-14 overflow-hidden">
        <div key={animKey} className={`w-full ${enterClass}`}>
          {children}
        </div>
      </main>

      {/* Keyboard hint */}
      <div className="pb-6 text-center">
        <span className="text-xs text-gray-300">
          Tryk{' '}
          <kbd className="px-1.5 py-0.5 rounded bg-gray-100 text-gray-400 font-mono text-[10px]">Enter</kbd>
          {' '}for at fortsætte ·{' '}
          <kbd className="px-1.5 py-0.5 rounded bg-gray-100 text-gray-400 font-mono text-[10px]">←</kbd>
          {' '}for at gå tilbage
        </span>
      </div>
    </div>
  )
}
