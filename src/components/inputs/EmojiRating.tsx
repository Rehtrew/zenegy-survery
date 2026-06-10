import { useState } from 'react'
import type { Option } from '../../types'
import type { Scene } from '../../lib/scenes'

interface Props {
  options: Option[]
  value: string
  onChange: (value: string) => void
  scene?: Scene
}

// mood 0→1 palette: red → orange → yellow → lime → green
const MOOD_COLORS: Array<{ bg: string; fg: string; selectedBg: string }> = [
  { bg: '#ffecec', fg: '#d94f4f', selectedBg: '#ffd7d7' },
  { bg: '#fff1e8', fg: '#d97b40', selectedBg: '#ffddc2' },
  { bg: '#fffbe6', fg: '#c9960f', selectedBg: '#fff0a8' },
  { bg: '#edf8ee', fg: '#3fa64a', selectedBg: '#c8eeca' },
  { bg: '#e2f7e5', fg: '#2a9437', selectedBg: '#a8e6ae' },
]

function moodColor(n: number, i: number) {
  const idx = n <= 1 ? 2 : Math.round((i / (n - 1)) * (MOOD_COLORS.length - 1))
  return MOOD_COLORS[Math.min(idx, MOOD_COLORS.length - 1)]
}

/**
 * A row of big tactile smiley faces. Mood is derived from each option's
 * position (left = unhappy → right = happy), drawn as an SVG so it can
 * animate and recolor on selection.
 */
export function EmojiRating({ options, value, onChange }: Props) {
  const [justPicked, setJustPicked] = useState<string | null>(null)
  const [hovered, setHovered] = useState<string | null>(null)
  const n = options.length
  const compact = n >= 5 // 5-point scales need tighter tiles/faces to fit

  return (
    <div style={{ display: 'flex', gap: compact ? 8 : 12 }}>
      {options.map((opt, i) => {
        const isSelected = value === opt.value
        const isHovered = hovered === opt.value
        const active = isSelected || isHovered
        // mood: 0 = saddest, 1 = happiest
        const mood = n > 1 ? i / (n - 1) : 0.5
        const mc = moodColor(n, i)
        return (
          <button
            type="button"
            key={opt.value}
            data-selected={isSelected}
            onClick={() => { onChange(opt.value); setJustPicked(opt.value) }}
            onMouseEnter={() => setHovered(opt.value)}
            onMouseLeave={() => setHovered(null)}
            style={{
              flex: 1,
              minWidth: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: compact ? 9 : 12,
              padding: compact ? '15px 6px 13px' : '22px 12px 18px',
              borderRadius: 16,
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
              transition: 'transform 0.16s ease',
              fontFamily: 'var(--font-sans)',
              transform: isHovered && !isSelected ? 'translateY(-2px)' : 'translateY(0)',
            }}
          >
            <Face
              mood={mood}
              selected={active}
              moodColor={mc}
              animate={justPicked === opt.value && isSelected}
              size={compact ? 46 : 60}
            />
            <span style={{
              fontSize: compact ? 10.5 : 13,
              fontWeight: 500,
              lineHeight: 1.25,
              textAlign: 'center',
              color: active ? mc.fg : '#c0c0cc',
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

function Face({ mood, selected, moodColor, animate, size = 60 }: {
  mood: number; selected: boolean; moodColor: { bg: string; fg: string; selectedBg: string }; accent?: string; animate: boolean; size?: number
}) {
  const faceGlyph = selected ? moodColor.fg : '#c0c0cc'
  const faceBg    = selected ? moodColor.bg : '#f0f0f3'
  const faceBorder = faceBg
  const controlY = 29 + (mood - 0.5) * 26
  const happy = mood >= 0.875
  return (
    <span
      className={animate ? 'anim-face-bounce' : undefined}
      style={{
        width: size, height: size, borderRadius: '50%',
        background: faceBg,
        border: `1.5px solid ${faceBorder}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'background 0.18s ease, border-color 0.18s ease',
      }}
    >
      <svg width={Math.round(size * 0.66)} height={Math.round(size * 0.66)} viewBox="0 0 48 48" fill="none">
        {happy ? (
          <>
            <path d="M13.5 21 Q17 17 20.5 21" stroke={faceGlyph} strokeWidth="2.4" strokeLinecap="round" fill="none" />
            <path d="M27.5 21 Q31 17 34.5 21" stroke={faceGlyph} strokeWidth="2.4" strokeLinecap="round" fill="none" />
            <path d="M13.5 28 Q24 41 34.5 28 Z" fill={faceGlyph} />
          </>
        ) : (
          <>
            <circle cx="17" cy="20" r="2.6" fill={faceGlyph} />
            <circle cx="31" cy="20" r="2.6" fill={faceGlyph} />
            <path
              d={`M15 29 Q24 ${controlY} 33 29`}
              stroke={faceGlyph}
              strokeWidth="2.4"
              strokeLinecap="round"
              fill="none"
            />
          </>
        )}
      </svg>
    </span>
  )
}
