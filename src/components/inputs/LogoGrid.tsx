import type { Option } from '../../types'
import { SCENES, type Scene } from '../../lib/scenes'

interface Props {
  options: Option[]
  value: string
  onChange: (value: string) => void
  otherValue?: string
  onOtherChange?: (text: string) => void
  scene?: Scene
}

export function LogoGrid({ options, value, onChange, otherValue = '', onOtherChange, scene = SCENES[0] }: Props) {
  return (
    <div>
      <div className="logo-grid" style={{ display: 'grid', gap: 10 }}>
        {options.map((opt, i) => {
          const isSelected = value === opt.value
          return (
            <button
              type="button"
              key={opt.value}
              onClick={() => onChange(opt.value)}
              className="anim-rise-in"
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 10,
                padding: '16px 12px',
                borderRadius: 16,
                border: `1.5px solid ${isSelected ? scene.accent : '#e4e4ea'}`,
                background: isSelected ? '#efeafe' : '#ffffff',
                boxShadow: 'none',
                cursor: 'pointer',
                textAlign: 'center',
                transition: 'background 0.14s ease, border-color 0.14s ease, box-shadow 0.14s ease',
                fontFamily: 'var(--font-sans)',
                minHeight: 112,
                animationDelay: `${i * 30}ms`,
              }}
            >
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

      {value === 'andet' && (
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
