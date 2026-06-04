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
      <div className="grid grid-cols-4 gap-3">
        {options.map(opt => {
          const isSelected = value === opt.value
          return (
            <button
              type="button"
              key={opt.value}
              onClick={() => onChange(opt.value)}
              style={{
                transition: 'background 0.12s ease, border-color 0.12s ease',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 10,
                padding: 16,
                borderRadius: 12,
                border: isSelected
                  ? '2px solid #6e30fd'
                  : '1.5px solid var(--color-border-default)',
                background: isSelected
                  ? 'var(--color-surface-brand-subtle)'
                  : 'var(--color-surface-default)',
                cursor: 'pointer',
                textAlign: 'left',
              }}
            >
              <div
                className="w-12 h-12 rounded-z-l flex items-center justify-center text-white font-medium text-sm"
                style={opt.logoStyle}
              >
                {opt.logoInitials}
              </div>
              <div className="text-center">
                <div
                  style={{
                    fontSize: 12,
                    fontWeight: 500,
                    lineHeight: 1.3,
                    color: isSelected
                      ? 'var(--color-text-primary)'
                      : 'var(--color-text-secondary)',
                  }}
                >
                  {opt.label}
                </div>
                {opt.subLabel && (
                  <div
                    style={{
                      fontSize: 10,
                      color: 'var(--color-text-secondary)',
                      marginTop: 2,
                    }}
                  >
                    {opt.subLabel}
                  </div>
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
          className="mt-3 w-full px-4 py-3 rounded-z-m outline-none text-sm transition-colors duration-[120ms] ease-[ease]"
          style={{
            background: 'var(--color-surface-subtle)',
            border: '1.5px solid var(--color-border-default)',
            color: 'var(--color-text-primary)',
          }}
        />
      )}
    </div>
  )
}
