import { useState } from 'react'
import type { Option, Tone } from '../../types'
import { BRAND_SCENE, type Scene } from '../../lib/scenes'
import { Glyph } from '../icons/glyphs'

interface Props {
  options: Option[]
  value: string | string[]
  onChange: (value: string | string[]) => void
  multi?: boolean
  scene?: Scene
}

/** Semantic tone colours — the AI question's only sanctioned use of non-purple. */
const TONE: Record<Tone, { accent: string; fill: string }> = {
  positive: { accent: '#1f9d63', fill: '#e7f6ee' },
  caution: { accent: '#d6890a', fill: '#fbf1de' },
  negative: { accent: '#e0354f', fill: '#fdeaed' },
}

export function ChoiceList({ options, value, onChange, multi = false, scene = BRAND_SCENE }: Props) {
  const selected = Array.isArray(value) ? value : value ? [value] : []
  const [popped, setPopped] = useState<string | null>(null)
  const [hovered, setHovered] = useState<string | null>(null)

  const handleClick = (optValue: string) => {
    setPopped(optValue)
    if (multi) {
      const next = selected.includes(optValue)
        ? selected.filter(v => v !== optValue)
        : [...selected, optValue]
      onChange(next)
    } else {
      onChange(optValue)
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {options.map((opt, i) => {
        const isSelected = selected.includes(opt.value)
        const isHover = hovered === opt.value
        const hasLogo = !!opt.logoSrc
        const tone = opt.tone ? TONE[opt.tone] : null
        const accent = tone ? tone.accent : scene.accent
        const selectedFill = tone ? tone.fill : hasLogo ? '#ffffff' : '#efeafe'

        const indicator = (
          <span style={{
            width: 22, height: 22, flexShrink: 0,
            borderRadius: multi ? 7 : '50%',
            border: `1.5px solid ${isSelected ? accent : 'rgba(0,0,0,0.18)'}`,
            background: isSelected ? accent : 'transparent',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'background 0.14s ease, border-color 0.14s ease',
          }}>
            {isSelected && (
              <svg width="12" height="12" viewBox="0 0 11 11" fill="none">
                <path d="M2 5.5L4.5 8L9 3" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </span>
        )

        const iconTile = opt.iconName && !hasLogo && (
          <span style={{
            width: 40, height: 40, borderRadius: 11, flexShrink: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: isSelected ? '#ffffff' : '#ececef',
            transition: 'background 0.14s ease',
          }}>
            <Glyph name={opt.iconName} size={21} color={isSelected ? accent : '#7c7c86'} />
          </span>
        )

        const toneDot = tone && !opt.iconName && (
          <span style={{
            width: 11, height: 11, borderRadius: '50%', flexShrink: 0,
            background: tone.accent,
          }} />
        )

        const text = (
          <span style={{ display: 'flex', flexDirection: 'column', minWidth: 0, flex: 1 }}>
            <span style={{ fontSize: 15.5, fontWeight: 500, color: scene.ink }}>{opt.label}</span>
            {opt.subLabel && <span style={{ fontSize: 13, color: scene.inkMuted, marginTop: 2 }}>{opt.subLabel}</span>}
          </span>
        )

        return (
          <button
            key={opt.value}
            type="button"
            data-selected={isSelected}
            onClick={() => handleClick(opt.value)}
            onMouseEnter={() => setHovered(opt.value)}
            onMouseLeave={() => setHovered(null)}
            className={`anim-rise-in${popped === opt.value && isSelected ? ' anim-select-pop' : ''}`}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 14,
              padding: hasLogo || opt.iconName ? '12px 16px' : '16px 18px',
              borderRadius: 14,
              border: `1.5px solid ${isSelected ? accent : isHover ? '#dcdce2' : '#ededf0'}`,
              background: isSelected ? selectedFill : isHover ? '#f1f1f4' : '#f6f6f7',
              cursor: 'pointer',
              textAlign: 'left',
              width: '100%',
              transition: 'background 0.14s ease, border-color 0.14s ease, transform 0.14s ease, box-shadow 0.14s ease',
              transform: isHover && !isSelected ? 'translateY(-1px)' : 'translateY(0)',
              boxShadow: hasLogo && isSelected ? '0 6px 18px rgba(20,12,43,0.07)' : 'none',
              fontFamily: 'var(--font-sans)',
              animationDelay: `${i * 35}ms`,
            }}
          >
            {hasLogo ? (
              <>
                <img src={opt.logoSrc} alt="" style={{ width: 42, height: 42, borderRadius: 11, flexShrink: 0, objectFit: 'contain' }} />
                {text}
                {indicator}
              </>
            ) : (
              <>
                {/* Leading: icon tile or tone dot when present, otherwise the indicator. */}
                {iconTile || toneDot || indicator}
                {text}
                {(iconTile || toneDot) && indicator}
              </>
            )}
          </button>
        )
      })}
    </div>
  )
}
