import { useState } from 'react'
import type { Option } from '../../types'
import { SCENES, type Scene } from '../../lib/scenes'

interface Props {
  options: Option[]
  /** Single-select: the chosen value. Multi-select (`multi`): the chosen values. */
  value: string | string[]
  onChange: (value: string | string[]) => void
  /** Let the respondent pick several systems (used by the bureau track). */
  multi?: boolean
  otherValue?: string
  onOtherChange?: (text: string) => void
  scene?: Scene
}

export function LogoGrid({ options, value, onChange, multi = false, otherValue = '', onOtherChange, scene = SCENES[0] }: Props) {
  const [hovered, setHovered] = useState<string | null>(null)
  const selected = multi ? (Array.isArray(value) ? value : []) : []
  const isChosen = (v: string) => (multi ? selected.includes(v) : value === v)
  const toggle = (v: string) => {
    if (!multi) { onChange(v); return }
    onChange(selected.includes(v) ? selected.filter(x => x !== v) : [...selected, v])
  }
  return (
    <div>
      <div className="logo-grid" style={{ display: 'grid', gap: 10 }}>
        {options.map((opt, i) => {
          const isSelected = isChosen(opt.value)
          const isHover = hovered === opt.value
          return (
            <button
              type="button"
              key={opt.value}
              onClick={() => toggle(opt.value)}
              aria-pressed={isSelected}
              onMouseEnter={() => setHovered(opt.value)}
              onMouseLeave={() => setHovered(null)}
              className="anim-rise-in"
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 10,
                padding: '16px 12px',
                borderRadius: 16,
                border: `1.5px solid ${isSelected ? scene.accent : isHover ? '#d4d4dc' : '#e4e4ea'}`,
                background: isSelected ? '#efeafe' : isHover ? '#f8f7ff' : '#ffffff',
                boxShadow: 'none',
                cursor: 'pointer',
                textAlign: 'center',
                transition: 'background 0.14s ease, border-color 0.14s ease, box-shadow 0.14s ease',
                fontFamily: 'var(--font-sans)',
                minHeight: 112,
                animationDelay: `${i * 30}ms`,
                position: 'relative',
              }}
            >
              {multi && isSelected && (
                <span
                  aria-hidden
                  style={{
                    position: 'absolute', top: 8, right: 8, width: 18, height: 18, borderRadius: '50%',
                    background: scene.accent, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}
                >
                  <svg width="11" height="11" viewBox="0 0 14 14" fill="none">
                    <path d="M2.5 7.5L5.5 10.5L11.5 4" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              )}
              {opt.logoSrc ? (
                <div style={{ width: 56, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                  <img src={opt.logoSrc} alt={opt.label} style={{ maxWidth: '100%', maxHeight: '100%', width: 'auto', height: 'auto', objectFit: 'contain' }} />
                </div>
              ) : (
                <div style={{
                  width: 48, height: 48, borderRadius: 12,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'white', fontWeight: 500, fontSize: 14, flexShrink: 0,
                  ...opt.logoStyle,
                }}>
                  {opt.logoInitials}
                </div>
              )}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <span style={{ fontSize: 12.5, fontWeight: 500, color: scene.ink, lineHeight: 1.3 }}>{opt.label}</span>
                {opt.subLabel && (
                  <span style={{ fontSize: 10.5, color: scene.inkMuted }}>{opt.subLabel}</span>
                )}
              </div>
            </button>
          )
        })}
      </div>

      {isChosen('andet') && (
        <input
          autoFocus
          type="text"
          placeholder="Hvilket system bruger du?"
          value={otherValue}
          onChange={e => onOtherChange?.(e.target.value)}
          style={{
            marginTop: 12, width: '100%', padding: '13px 16px', borderRadius: 12,
            background: '#ffffff', border: `1.5px solid ${scene.accent}`,
            color: scene.ink, fontSize: 14, fontWeight: 500, outline: 'none',
            fontFamily: 'var(--font-sans)', boxSizing: 'border-box',
          }}
        />
      )}
    </div>
  )
}
