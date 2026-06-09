import { useState } from 'react'
import type { Option } from '../../types'
import { BRAND_SCENE, type Scene } from '../../lib/scenes'
import { Glyph } from '../icons/glyphs'

interface Props {
  options: Option[]
  value: string[]
  onChange: (value: string[]) => void
  /** Value of the option that reveals a free-text input when selected. */
  otherTrigger?: string
  otherValue?: string
  onOtherChange?: (text: string) => void
  otherPlaceholder?: string
  scene?: Scene
}

/**
 * Multi-select tiles in a two-column grid — icon on top, label below, with a
 * check badge on selected tiles. Used for the frustrations / barriers questions
 * so the options scan more easily than wrapped pills. When the `otherTrigger`
 * tile is selected, a free-text input reveals below the grid.
 */
export function TileSelect({
  options, value, onChange,
  otherTrigger, otherValue = '', onOtherChange, otherPlaceholder = 'Skriv dit svar…',
  scene = BRAND_SCENE,
}: Props) {
  const [popped, setPopped] = useState<string | null>(null)

  const toggle = (v: string) => {
    setPopped(v)
    onChange(value.includes(v) ? value.filter(x => x !== v) : [...value, v])
  }

  const showOther = !!otherTrigger && value.includes(otherTrigger)

  return (
    <div>
      <div className="tile-grid" style={{ display: 'grid', gap: 10 }}>
        {options.map((opt, i) => {
          const isSelected = value.includes(opt.value)
          return (
            <button
              type="button"
              key={opt.value}
              data-selected={isSelected}
              onClick={() => toggle(opt.value)}
              className={`anim-rise-in${popped === opt.value && isSelected ? ' anim-select-pop' : ''}`}
              style={{
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-start',
                textAlign: 'center',
                gap: 10,
                padding: '18px 12px 16px',
                borderRadius: 16,
                border: `1.5px solid ${isSelected ? scene.accent : '#e4e4ea'}`,
                background: isSelected ? '#efeafe' : '#ffffff',
                cursor: 'pointer',
                transition: 'background 0.16s ease, border-color 0.16s ease, transform 0.16s ease',
                fontFamily: 'var(--font-sans)',
                minHeight: 104,
                animationDelay: `${i * 30}ms`,
              }}
              onMouseEnter={e => { if (!isSelected) (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-2px)' }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)' }}
            >
              {/* Check badge (selected) */}
              <span style={{
                position: 'absolute', top: 9, right: 9,
                width: 19, height: 19, borderRadius: '50%', flexShrink: 0,
                background: isSelected ? scene.accent : 'transparent',
                border: `1.5px solid ${isSelected ? scene.accent : 'rgba(0,0,0,0.14)'}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'background 0.14s ease, border-color 0.14s ease',
              }}>
                {isSelected && (
                  <svg width="10" height="10" viewBox="0 0 11 11" fill="none">
                    <path d="M2 5.5L4.5 8L9 3" stroke="white" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </span>

              {opt.iconName && (
                <span style={{
                  width: 42, height: 42, borderRadius: 12, flexShrink: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: isSelected ? '#ffffff' : '#ececef',
                  transition: 'background 0.16s ease',
                }}>
                  <Glyph name={opt.iconName} size={22} color={isSelected ? scene.accent : '#7c7c86'} />
                </span>
              )}
              <span style={{ fontSize: 13.5, fontWeight: 500, color: scene.ink, lineHeight: 1.32 }}>{opt.label}</span>
            </button>
          )
        })}
      </div>

      {showOther && (
        <input
          autoFocus
          type="text"
          placeholder={otherPlaceholder}
          value={otherValue}
          onChange={e => onOtherChange?.(e.target.value)}
          className="anim-rise-in"
          style={{
            marginTop: 12, width: '100%', padding: '13px 16px', borderRadius: 12,
            background: '#ffffff', border: `1.5px solid ${scene.accent}`,
            color: scene.ink, fontSize: 14.5, fontWeight: 500, outline: 'none',
            fontFamily: 'var(--font-sans)', boxSizing: 'border-box',
          }}
        />
      )}

      <p style={{ fontSize: 13, color: scene.inkMuted, marginTop: 16 }}>
        {value.length > 0 ? `${value.length} valgt` : 'Vælg alle der passer'}
      </p>
    </div>
  )
}
