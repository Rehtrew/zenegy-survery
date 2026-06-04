import type { Option } from '../../types'

interface Props {
  options: Option[]
  value: string | string[]
  onChange: (value: string | string[]) => void
  multi?: boolean
}

export function ChoiceList({ options, value, onChange, multi = false }: Props) {
  const selected = Array.isArray(value) ? value : value ? [value] : []

  const handleClick = (optValue: string) => {
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {options.map(opt => {
        const isSelected = selected.includes(opt.value)
        return (
          <button
            key={opt.value}
            type="button"
            data-selected={isSelected}
            onClick={() => handleClick(opt.value)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 14,
              padding: '14px 18px',
              borderRadius: 12,
              border: `1.5px solid ${isSelected ? '#6e30fd' : 'var(--color-border-default)'}`,
              background: isSelected ? 'var(--color-surface-brand-subtle)' : 'var(--color-surface-default)',
              cursor: 'pointer',
              textAlign: 'left',
              width: '100%',
              transition: 'background 0.12s ease, border-color 0.12s ease',
              fontFamily: 'var(--font-sans)',
            }}
          >
            <div style={{
              width: 20,
              height: 20,
              flexShrink: 0,
              borderRadius: multi ? 4 : '50%',
              border: `1.5px solid ${isSelected ? '#6e30fd' : 'var(--color-border-default)'}`,
              background: isSelected ? '#6e30fd' : 'transparent',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background 0.12s ease, border-color 0.12s ease',
            }}>
              {isSelected && multi && (
                <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                  <path d="M2 5.5L4.5 8L9 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
              <span style={{ fontSize: 15, fontWeight: 500, color: 'var(--color-text-primary)' }}>{opt.label}</span>
              {opt.subLabel && (
                <span style={{ fontSize: 13, color: 'var(--color-text-secondary)', marginTop: 2 }}>{opt.subLabel}</span>
              )}
            </div>
          </button>
        )
      })}
    </div>
  )
}
