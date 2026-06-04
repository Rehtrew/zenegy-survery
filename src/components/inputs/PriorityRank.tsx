import type { Option, RankEntry } from '../../types'

const MEDALS = ['🥇', '🥈', '🥉']
const RANK_BORDER_CLASSES = [
  'border-amber-400 bg-amber-50',
  'border-gray-400 bg-gray-50',
  'border-amber-700 bg-orange-50',
]
const RANK_BADGE_CLASSES = [
  'border-amber-400 bg-amber-400 text-white',
  'border-gray-400 bg-gray-400 text-white',
  'border-amber-700 bg-amber-700 text-white',
]

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
            className={`flex items-center gap-3 px-4 py-3 rounded-xl border-[1.5px] text-left transition-all duration-150 w-full
              ${isRanked ? RANK_BORDER_CLASSES[rankIndex] : 'border-app-border bg-white hover:border-gray-300 hover:bg-gray-50'}`}
          >
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-black flex-shrink-0 border-[1.5px]
              ${isRanked ? RANK_BADGE_CLASSES[rankIndex] : 'border-gray-300 text-gray-400'}`}
            >
              {isRanked ? MEDALS[rankIndex] : '·'}
            </div>
            <span className="text-[15px] font-medium text-text-main">{opt.label}</span>
          </button>
        )
      })}
      <p className="text-xs text-text-muted mt-1">
        Vælg op til {effectiveMaxRank} — 🥇 er vigtigst
      </p>
    </div>
  )
}
