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
            style={{ transition: 'background 0.12s ease, border-color 0.12s ease' }}
            className={`flex-1 flex items-center justify-center px-4 py-5 rounded-z-l border-[1.5px] text-[15px] font-medium
              ${isSelected
                ? 'bg-surface-brand border-primary text-text-primary'
                : 'bg-surface-default border-border-default text-text-secondary hover:bg-surface-brand hover:border-primary hover:text-text-primary'
              }`}
          >
            {opt.label}
          </button>
        )
      })}
    </div>
  )
}
