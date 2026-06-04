import type { Option } from '../../types'

interface Props {
  options: Option[]
  value: string
  onChange: (value: string) => void
}

export function EmojiRating({ options, value, onChange }: Props) {
  return (
    <div className="flex gap-4 justify-center">
      {options.map(opt => {
        const isSelected = value === opt.value
        return (
          <button
            type="button"
            key={opt.value}
            data-selected={isSelected}
            onClick={() => onChange(opt.value)}
            className={`flex flex-col items-center gap-2 px-6 py-4 rounded-2xl border-2 transition-all duration-150 min-w-[110px]
              ${isSelected
                ? 'border-primary bg-primary-light shadow-[0_4px_16px_rgba(0,200,150,0.18)] -translate-y-0.5'
                : 'border-app-border bg-white hover:border-primary hover:-translate-y-0.5'
              }`}
          >
            <span className="text-4xl">{opt.emoji}</span>
            <span className={`text-[13px] font-semibold ${isSelected ? 'text-primary-dark' : 'text-gray-700'}`}>
              {opt.label}
            </span>
          </button>
        )
      })}
    </div>
  )
}
