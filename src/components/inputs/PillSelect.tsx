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
            style={{ transition: 'background 0.12s ease, border-color 0.12s ease' }}
            onClick={() => toggle(opt.value)}
            className={`px-4 py-2.5 rounded-z-full text-sm font-medium
              ${isSelected
                ? 'bg-primary text-white'
                : 'bg-surface-subtle text-text-secondary hover:bg-surface-brand hover:text-text-primary'
              }`}
          >
            {opt.label}
          </button>
        )
      })}
    </div>
  )
}
