import { useState } from 'react'
import type { Option } from '../../types'
import { SCENES, type Scene } from '../../lib/scenes'

interface Props {
  options: Option[]
  value: string | string[]
  onChange: (value: string | string[]) => void
  multi?: boolean
  scene?: Scene
}

export function ChoiceList({ options, value, onChange, multi = false, scene = SCENES[0] }: Props) {
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
              padding: '16px 18px',
              borderRadius: 14,
              border: `1.5px solid ${isSelected ? scene.accent : isHover ? '#dcdce2' : '#ededf0'}`,
              background: isSelected ? '#efeafe' : isHover ? '#f1f1f4' : '#f6f6f7',
              cursor: 'pointer',
              textAlign: 'left',
              width: '100%',
              transition: 'background 0.14s ease, border-color 0.14s ease, transform 0.14s ease',
              transform: isHover && !isSelected ? 'translateY(-1px)' : 'translateY(0)',
              boxShadow: 'none',
              fontFamily: 'var(--font-sans)',
              animationDelay: `${i * 35}ms`,
            }}
          >
            <span style={{
              width: 22,
              height: 22,
              flexShrink: 0,
              borderRadius: multi ? 7 : '50%',
              border: `1.5px solid ${isSelected ? scene.accent : 'rgba(0,0,0,0.18)'}`,
              background: isSelected ? scene.accent : 'transparent',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background 0.14s ease, border-color 0.14s ease',
            }}>
              {isSelected && (
                <svg width="12" height="12" viewBox="0 0 11 11" fill="none">
                  <path d="M2 5.5L4.5 8L9 3" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
            </span>
            <span style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
              <span style={{ fontSize: 15.5, fontWeight: 500, color: scene.ink }}>{opt.label}</span>
              {opt.subLabel && (
                <span style={{ fontSize: 13, color: scene.inkMuted, marginTop: 2 }}>{opt.subLabel}</span>
              )}
            </span>
          </button>
        )
      })}
    </div>
  )
}
