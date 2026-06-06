import type { Option } from '../../types'

interface Props {
  options: Option[]
  value: string
  onChange: (value: string) => void
  otherValue?: string
  onOtherChange?: (text: string) => void
}

export function LogoGrid({ options, value, onChange, otherValue = '', onOtherChange }: Props) {
  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
        {options.map(opt => {
          const isSelected = value === opt.value
          return (
            <button
              type="button"
              key={opt.value}
              onClick={() => onChange(opt.value)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 10,
                padding: '16px 12px',
                borderRadius: 12,
                border: isSelected
                  ? '2px solid #6e30fd'
                  : '1.5px solid var(--color-border-default)',
                background: isSelected
                  ? 'var(--color-surface-brand-subtle)'
                  : 'var(--color-surface-default)',
                cursor: 'pointer',
                textAlign: 'center',
                transition: 'background 0.12s ease, border-color 0.12s ease',
                fontFamily: 'var(--font-sans)',
                minHeight: 110,
              }}
            >
              {/* Logo: real image or initials fallback */}
              {opt.logoSrc ? (
                <div style={{
                  width: 56,
                  height: 40,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden',
                }}>
                  <img
                    src={opt.logoSrc}
                    alt={opt.label}
                    style={{
                      maxWidth: '100%',
                      maxHeight: '100%',
                      width: 'auto',
                      height: 'auto',
                      objectFit: 'contain',
                    }}
                  />
                </div>
              ) : (
                <div style={{
                  width: 48,
                  height: 48,
                  borderRadius: 10,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontWeight: 500,
                  fontSize: 14,
                  flexShrink: 0,
                  ...opt.logoStyle,
                }}>
                  {opt.logoInitials}
                </div>
              )}

              {/* Label */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <span style={{
                  fontSize: 12,
                  fontWeight: 500,
                  color: isSelected ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
                  lineHeight: 1.3,
                }}>
                  {opt.label}
                </span>
                {opt.subLabel && (
                  <span style={{ fontSize: 10, color: 'var(--color-text-tertiary)' }}>
                    {opt.subLabel}
                  </span>
                )}
              </div>
            </button>
          )
        })}
      </div>

      {/* Andet text input */}
      {value === 'andet' && (
        <input
          autoFocus
          type="text"
          placeholder="Hvilket system bruger du?"
          value={otherValue}
          onChange={e => onOtherChange?.(e.target.value)}
          style={{
            marginTop: 12,
            width: '100%',
            padding: '12px 16px',
            borderRadius: 8,
            background: 'var(--color-surface-subtle)',
            border: '1.5px solid var(--color-border-default)',
            color: 'var(--color-text-primary)',
            fontSize: 14,
            fontWeight: 500,
            outline: 'none',
            fontFamily: 'var(--font-sans)',
            boxSizing: 'border-box',
          }}
        />
      )}
    </div>
  )
}
