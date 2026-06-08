import { useState } from 'react'
import type { Option } from '../../types'
import { SCENES, type Scene } from '../../lib/scenes'

interface Props {
  options: Option[]
  value: string[]
  onChange: (value: string[]) => void
  scene?: Scene
}

export function PillSelect({ options, value, onChange, scene = SCENES[0] }: Props) {
  const [popped, setPopped] = useState<string | null>(null)
  const toggle = (v: string) => {
    setPopped(v)
    onChange(value.includes(v) ? value.filter(x => x !== v) : [...value, v])
  }

  return (
    <div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
        {options.map(opt => {
          const isSelected = value.includes(opt.value)
          return (
            <button
              type="button"
              key={opt.value}
              onClick={() => toggle(opt.value)}
              className={popped === opt.value && isSelected ? 'anim-select-pop' : undefined}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                borderRadius: 9999,
                padding: isSelected ? '11px 16px 11px 12px' : '11px 18px',
                fontSize: 14.5,
                fontFamily: 'var(--font-sans)',
                fontWeight: 500,
                cursor: 'pointer',
                border: `1.5px solid ${isSelected ? scene.accent : '#e6e6ea'}`,
                background: isSelected ? scene.accent : '#f4f4f6',
                color: isSelected ? '#ffffff' : scene.ink,
                transition: 'background 0.14s ease, border-color 0.14s ease, padding 0.14s ease',
              }}
            >
              {isSelected && (
                <span style={{
                  width: 18, height: 18, borderRadius: '50%', flexShrink: 0,
                  background: 'rgba(255,255,255,0.25)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                    <path d="M2 5.5L4.5 8L9 3" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </span>
              )}
              {opt.label}
            </button>
          )
        })}
      </div>
      <p style={{ fontSize: 13, color: scene.inkMuted, marginTop: 16 }}>
        {value.length > 0 ? `${value.length} valgt` : 'Vælg alle der passer'}
      </p>
    </div>
  )
}
