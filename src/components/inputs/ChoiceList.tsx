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
            type="button"
            key={opt.value}
            data-selected={isSelected}
            onClick={() => handleClick(opt.value)}
            style={{ transition: 'background 0.12s ease, border-color 0.12s ease' }}
            className={`flex items-center gap-3.5 px-5 py-3.5 rounded-z-l border-[1.5px] text-left w-full
              ${isSelected
                ? 'border-primary bg-surface-brand'
                : 'border-border-default bg-surface-default hover:bg-surface-brand hover:border-primary'
              }`}
          >
            <div className={`w-5 h-5 flex-shrink-0 flex items-center justify-center
              ${multi ? 'rounded-z-s border-2' : 'rounded-full border-2'}
              ${isSelected ? 'border-primary bg-primary' : 'border-border-default'}`}
            >
              {isSelected && multi && (
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                  <polyline points="1.5 5 4 7.5 8.5 2.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-[15px] font-medium text-text-primary">{opt.label}</span>
              {opt.subLabel && (
                <span className="text-[13px] text-text-secondary mt-0.5">{opt.subLabel}</span>
              )}
            </div>
          </button>
        )
      })}
    </div>
  )
}
