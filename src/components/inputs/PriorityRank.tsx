import type { Option, RankEntry } from '../../types'

interface Props {
  options: Option[]
  value: RankEntry[]
  onChange: (value: RankEntry[]) => void
  maxRank?: number
}

export function PriorityRank({ options, value, onChange, maxRank = 3 }: Props) {
  const effectiveMaxRank = Math.min(maxRank ?? 3, 3)

  const handleClick = (optValue: string) => {
    const existing = value.find(e => e.value === optValue)
    if (existing) {
      // Remove and re-rank remaining
      onChange(
        value
          .filter(e => e.value !== optValue)
          .map((e, i) => ({ ...e, rank: i + 1 }))
      )
    } else {
      if (value.length >= effectiveMaxRank) return
      onChange([...value, { rank: value.length + 1, value: optValue }])
    }
  }

  return (
    <div className="flex flex-col gap-2">
      {options.map(opt => {
        const entry = value.find(e => e.value === opt.value)
        const rankIndex = entry ? entry.rank - 1 : -1
        const isRanked = rankIndex >= 0

        return (
          <button
            type="button"
            key={opt.value}
            onClick={() => handleClick(opt.value)}
            style={{ transition: 'background 0.12s ease, border-color 0.12s ease' }}
            className={`flex items-center gap-3 px-4 py-3 rounded-z-l border-[1.5px] text-left w-full
              ${isRanked
                ? rankIndex === 0
                  ? 'bg-surface-brand border-primary'
                  : 'bg-surface-subtle border-border-default'
                : 'bg-surface-default border-border-default hover:bg-surface-subtle'
              }`}
          >
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0
              ${isRanked ? 'bg-primary text-white' : 'bg-surface-subtle text-text-secondary'}`}
            >
              {isRanked ? entry!.rank : '·'}
            </div>
            <span className="text-[15px] font-medium text-text-primary">{opt.label}</span>
          </button>
        )
      })}
      <p className="text-xs text-text-secondary mt-1">
        Vælg op til {effectiveMaxRank} — 1 er vigtigst
      </p>
    </div>
  )
}
