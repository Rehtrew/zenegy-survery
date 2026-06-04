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
              className={`flex flex-col items-center gap-2.5 p-4 rounded-xl border-2 transition-all duration-150
                ${isSelected
                  ? 'border-primary bg-primary-light shadow-[0_0_0_3px_rgba(0,200,150,0.15)] -translate-y-0.5'
                  : 'border-app-border bg-white hover:border-primary hover:bg-primary-light hover:-translate-y-0.5 hover:shadow-md'
                }`}
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-black text-sm"
                style={opt.logoStyle}
              >
                {opt.logoInitials}
              </div>
              <div className="text-center">
                <div className={`text-xs font-semibold leading-tight ${isSelected ? 'text-primary-dark' : 'text-gray-700'}`}>
                  {opt.label}
                </div>
                {opt.subLabel && (
                  <div className="text-[10px] text-text-muted mt-0.5">{opt.subLabel}</div>
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
          className="mt-3 w-full px-4 py-3 rounded-xl border-[1.5px] border-app-border focus:border-primary outline-none text-sm transition-colors text-text-main"
        />
      )}
    </div>
  )
}
