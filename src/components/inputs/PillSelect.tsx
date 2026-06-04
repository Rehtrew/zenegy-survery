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
            className={`px-4 py-2.5 rounded-full border-[1.5px] text-sm font-medium transition-all duration-150
              ${isSelected
                ? 'border-primary bg-primary text-white font-semibold'
                : 'border-app-border bg-white text-gray-700 hover:border-primary hover:bg-primary-light hover:text-primary-dark'
              }`}
          >
            {opt.label}
          </button>
        )
      })}
    </div>
  )
}
