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
              style={{ transition: 'background 0.12s ease, border-color 0.12s ease' }}
              className={`flex flex-col items-center gap-2.5 p-4 rounded-z-l border-2 text-left
                ${isSelected
                  ? 'bg-surface-brand border-primary'
                  : 'bg-surface-default border-transparent hover:bg-surface-brand hover:shadow-sm'
                }`}
            >
              <div
                className="w-12 h-12 rounded-z-l flex items-center justify-center text-white font-medium text-sm"
                style={opt.logoStyle}
              >
                {opt.logoInitials}
              </div>
              <div className="text-center">
                <div className={`text-xs font-medium leading-tight ${isSelected ? 'text-text-primary' : 'text-text-secondary'}`}>
                  {opt.label}
                </div>
                {opt.subLabel && (
                  <div className="text-[10px] text-text-secondary mt-0.5">{opt.subLabel}</div>
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
          className="mt-3 w-full px-4 py-3 rounded-z-m bg-surface-subtle focus:ring-[1.5px] focus:ring-primary outline-none text-sm transition-colors duration-[120ms] ease-[ease] text-text-primary"
        />
      )}
    </div>
  )
}
