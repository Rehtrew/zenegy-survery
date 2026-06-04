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
    <div className="flex flex-col gap-2.5">
      {options.map(opt => {
        const isSelected = selected.includes(opt.value)
        return (
          <button
            key={opt.value}
            data-selected={isSelected}
            onClick={() => handleClick(opt.value)}
            className={`flex items-center gap-3.5 px-5 py-3.5 rounded-xl border-[1.5px] text-left transition-all duration-150 w-full
              ${isSelected
                ? 'border-primary bg-primary-light shadow-[0_0_0_3px_rgba(0,200,150,0.12)]'
                : 'border-app-border bg-white hover:border-primary hover:bg-primary-light'
              }`}
          >
            <div className={`w-5 h-5 flex-shrink-0 transition-all duration-150 flex items-center justify-center
              ${multi ? 'rounded-md border-2' : 'rounded-full border-2'}
              ${isSelected ? 'border-primary bg-primary' : 'border-gray-300'}`}
            >
              {isSelected && (
                <span className="text-white text-[10px] font-black leading-none">
                  {multi ? '✓' : ''}
                </span>
              )}
            </div>
            {opt.emoji && <span className="text-xl">{opt.emoji}</span>}
            <div className="flex flex-col min-w-0">
              <span className="text-[15px] font-medium text-text-main">{opt.label}</span>
              {opt.subLabel && (
                <span className="text-[13px] text-text-muted mt-0.5">{opt.subLabel}</span>
              )}
            </div>
          </button>
        )
      })}
    </div>
  )
}
