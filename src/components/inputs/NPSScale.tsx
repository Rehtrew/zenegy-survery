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
            key={i}
            onClick={() => onChange(i)}
            className={`w-12 h-12 rounded-xl border-[1.5px] text-base font-bold transition-all duration-150
              ${value === i
                ? 'bg-primary border-primary text-white'
                : 'bg-white border-app-border text-gray-700 hover:border-primary hover:bg-primary-light'
              }`}
          >
            {i}
          </button>
        ))}
      </div>
      <div className="flex justify-between mt-2 px-1">
        <span className="text-xs text-text-muted">Ville ikke anbefale</span>
        <span className="text-xs text-text-muted">Vil klart anbefale</span>
      </div>
    </div>
  )
}
