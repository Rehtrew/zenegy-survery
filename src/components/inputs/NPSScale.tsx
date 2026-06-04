interface Props {
  value: number | null
  onChange: (value: number) => void
}

export function NPSScale({ value, onChange }: Props) {
  return (
    <div>
      <div className="flex gap-1.5 flex-wrap justify-center">
        {Array.from({ length: 11 }, (_, i) => (
          <button
            type="button"
            key={i}
            onClick={() => onChange(i)}
            style={{ transition: 'background 0.12s ease, border-color 0.12s ease' }}
            className={`w-11 h-11 rounded-z-m text-[15px] font-medium
              ${value === i
                ? 'bg-primary text-white'
                : 'bg-surface-subtle text-text-primary hover:bg-surface-brand hover:text-text-primary'
              }`}
          >
            {i}
          </button>
        ))}
      </div>
      <div className="flex justify-between mt-2 px-1">
        <span className="text-xs text-text-secondary">Ville ikke anbefale</span>
        <span className="text-xs text-text-secondary">Vil klart anbefale</span>
      </div>
    </div>
  )
}
