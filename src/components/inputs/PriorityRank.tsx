import type { Option, RankEntry } from '../../types'
import { SCENES, type Scene } from '../../lib/scenes'

interface Props {
  options: Option[]
  value: RankEntry[]
  onChange: (value: RankEntry[]) => void
  maxRank?: number
  scene?: Scene
}

export function PriorityRank({ options, value, onChange, maxRank = 3, scene = SCENES[0] }: Props) {
  const effectiveMaxRank = Math.min(maxRank ?? 3, 3)

  const handleClick = (optValue: string) => {
    const existing = value.find(e => e.value === optValue)
    if (existing) {
      onChange(value.filter(e => e.value !== optValue).map((e, i) => ({ ...e, rank: i + 1 })))
    } else {
      if (value.length >= effectiveMaxRank) return
      onChange([...value, { rank: value.length + 1, value: optValue }])
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {options.map(opt => {
        const entry = value.find(e => e.value === opt.value)
        const isRanked = !!entry
        const isTop = entry?.rank === 1
        return (
          <button
            type="button"
            key={opt.value}
            onClick={() => handleClick(opt.value)}
            className={isRanked ? 'anim-select-pop' : undefined}
            style={{
              display: 'flex', alignItems: 'center', gap: 14,
              padding: '14px 16px', textAlign: 'left', width: '100%',
              borderRadius: 14, cursor: 'pointer',
              border: `1.5px solid ${isRanked ? scene.accent : '#ededf0'}`,
              background: isRanked ? '#efeafe' : '#f6f6f7',
              boxShadow: 'none',
              transition: 'background 0.14s ease, border-color 0.14s ease',
              fontFamily: 'var(--font-sans)',
            }}
          >
            <span style={{
              width: 34, height: 34, borderRadius: '50%', flexShrink: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: isRanked ? 17 : 15, fontWeight: 500,
              background: isRanked ? scene.accent : 'transparent',
              border: isRanked ? 'none' : `1.5px dashed #cfcfd6`,
              color: isRanked ? '#ffffff' : scene.inkMuted,
              transition: 'all 0.16s ease',
              opacity: isTop ? 1 : isRanked ? 0.82 : 1,
            }}>
              {isRanked ? entry!.rank : '+'}
            </span>
            <span style={{ fontSize: 15.5, fontWeight: 500, color: scene.ink }}>{opt.label}</span>
          </button>
        )
      })}
      <p style={{ fontSize: 13, color: scene.inkMuted, marginTop: 4 }}>
        {value.length > 0
          ? `${value.length} af ${effectiveMaxRank} valgt — 1 er vigtigst`
          : `Tryk for at vælge dine top ${effectiveMaxRank} — 1 er vigtigst`}
      </p>
    </div>
  )
}
