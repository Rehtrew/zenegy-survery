import type { Option } from '../../types'

interface Props {
  options: Option[]
  value: string
  onChange: (value: string) => void
}

export function EmojiRating({ options, value, onChange }: Props) {
  return (
    <div className="flex gap-3">
      {options.map(opt => {
        const isSelected = value === opt.value
        return (
          <button
            type="button"
            key={opt.value}
            data-selected={isSelected}
            onClick={() => onChange(opt.value)}
            style={{
              transition: 'background 0.12s ease, border-color 0.12s ease',
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '20px 16px',
              borderRadius: 12,
              border: isSelected
                ? '1.5px solid #6e30fd'
                : '1.5px solid var(--color-border-default)',
              background: isSelected
                ? 'var(--color-surface-brand-subtle)'
                : 'var(--color-surface-default)',
              fontSize: 15,
              fontWeight: 500,
              color: 'var(--color-text-primary)',
              cursor: 'pointer',
            }}
          >
            {opt.label}
          </button>
        )
      })}
    </div>
  )
}
