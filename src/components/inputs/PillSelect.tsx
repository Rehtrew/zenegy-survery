import type { Option } from '../../types'

interface Props {
  options: Option[]
  value: string[]
  onChange: (value: string[]) => void
}

export function PillSelect({ options, value, onChange }: Props) {
  const toggle = (v: string) => {
    onChange(value.includes(v) ? value.filter(x => x !== v) : [...value, v])
  }

  return (
    <div className="flex flex-wrap gap-2.5">
      {options.map(opt => {
        const isSelected = value.includes(opt.value)
        return (
          <button
            type="button"
            key={opt.value}
            onClick={() => toggle(opt.value)}
            style={{
              transition: 'background 0.12s ease',
              borderRadius: 9999,
              padding: '10px 16px',
              fontSize: 14,
              fontFamily: 'var(--font-sans)',
              fontWeight: 500,
              cursor: 'pointer',
              border: 'none',
              background: isSelected ? '#6e30fd' : 'var(--color-surface-subtle)',
              color: isSelected ? 'white' : 'var(--color-text-secondary)',
            }}
          >
            {opt.label}
          </button>
        )
      })}
    </div>
  )
}
