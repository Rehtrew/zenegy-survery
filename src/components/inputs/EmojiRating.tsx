import { useState } from 'react'
import type { Option } from '../../types'
import { SCENES, type Scene } from '../../lib/scenes'

interface Props {
  options: Option[]
  value: string
  onChange: (value: string) => void
  scene?: Scene
}

/**
 * A row of big tactile smiley faces. Mood is derived from each option's
 * position (left = unhappy → right = happy), drawn as an SVG so it can
 * animate and recolor on selection.
 */
export function EmojiRating({ options, value, onChange, scene = SCENES[0] }: Props) {
  const [justPicked, setJustPicked] = useState<string | null>(null)
  const n = options.length
  const compact = n >= 5 // 5-point scales need tighter tiles/faces to fit

  return (
    <div style={{ display: 'flex', gap: compact ? 8 : 12 }}>
      {options.map((opt, i) => {
        const isSelected = value === opt.value
        // mood: 0 = saddest, 1 = happiest
        const mood = n > 1 ? i / (n - 1) : 0.5
        return (
          <button
            type="button"
            key={opt.value}
            data-selected={isSelected}
            onClick={() => { onChange(opt.value); setJustPicked(opt.value) }}
            style={{
              flex: 1,
              minWidth: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: compact ? 9 : 12,
              padding: compact ? '15px 6px 13px' : '22px 12px 18px',
              borderRadius: 16,
              border: `1.5px solid ${isSelected ? scene.accent : '#ededf0'}`,
              background: isSelected ? '#efeafe' : '#f6f6f7',
              cursor: 'pointer',
              transition: 'border-color 0.16s ease, background 0.16s ease, transform 0.16s ease',
              fontFamily: 'var(--font-sans)',
              boxShadow: 'none',
            }}
            onMouseEnter={e => { if (!isSelected) (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-2px)' }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)' }}
          >
            <Face
              mood={mood}
              selected={isSelected}
              accent={scene.accent}
              animate={justPicked === opt.value && isSelected}
              size={compact ? 46 : 60}
            />
            <span style={{
              fontSize: compact ? 12 : 14,
              fontWeight: 500,
              lineHeight: 1.25,
              textAlign: 'center',
              color: isSelected ? scene.ink : scene.inkMuted,
              transition: 'color 0.16s ease',
            }}>
              {opt.label}
            </span>
          </button>
        )
      })}
    </div>
  )
}

function Face({ mood, selected, accent, animate, size = 60 }: { mood: number; selected: boolean; accent: string; animate: boolean; size?: number }) {
  // Mouth: control-point y rises for happy (dip down = smile), drops for sad (peak up = frown)
  const controlY = 22 + mood * 17
  const stroke = selected ? '#ffffff' : '#b6b6b6'
  return (
    <span
      className={animate ? 'anim-face-bounce' : undefined}
      style={{
        width: size, height: size, borderRadius: '50%',
        background: selected ? accent : '#ffffff',
        border: `1.5px solid ${selected ? accent : '#e4e4e4'}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'background 0.18s ease, border-color 0.18s ease',
      }}
    >
      <svg width={Math.round(size * 0.66)} height={Math.round(size * 0.66)} viewBox="0 0 48 48" fill="none">
        <circle cx="17" cy="20" r="2.6" fill={stroke} />
        <circle cx="31" cy="20" r="2.6" fill={stroke} />
        <path
          d={`M15 29 Q24 ${controlY} 33 29`}
          stroke={stroke}
          strokeWidth="2.4"
          strokeLinecap="round"
          fill="none"
          style={{ transition: 'd 0.2s ease' }}
        />
      </svg>
    </span>
  )
}
