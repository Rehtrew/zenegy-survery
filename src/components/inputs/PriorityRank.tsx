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

  const getItemStyle = (isRanked: boolean, rankIndex: number): React.CSSProperties => {
    if (isRanked) {
      return rankIndex === 0
        ? {
            background: 'var(--color-surface-brand-subtle)',
            border: '1.5px solid #6e30fd',
          }
        : {
            background: 'var(--color-surface-subtle)',
            border: '1.5px solid var(--color-border-default)',
          }
    }
    return {
      background: 'var(--color-surface-default)',
      border: '1.5px solid var(--color-border-default)',
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
            className="flex items-center gap-3 px-4 py-3 text-left w-full"
            style={{
              transition: 'background 0.12s ease, border-color 0.12s ease',
              borderRadius: 12,
              cursor: 'pointer',
              ...getItemStyle(isRanked, rankIndex),
            }}
          >
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0"
              style={
                isRanked
                  ? { background: '#6e30fd', color: 'white' }
                  : { background: 'var(--color-surface-subtle)', color: 'var(--color-text-secondary)' }
              }
            >
              {isRanked ? entry!.rank : '·'}
            </div>
            <span
              style={{
                fontSize: 15,
                fontWeight: 500,
                color: 'var(--color-text-primary)',
              }}
            >
              {opt.label}
            </span>
          </button>
        )
      })}
      <p
        className="text-xs mt-1"
        style={{ color: 'var(--color-text-secondary)' }}
      >
        Vælg op til {effectiveMaxRank} — 1 er vigtigst
      </p>
    </div>
  )
}
