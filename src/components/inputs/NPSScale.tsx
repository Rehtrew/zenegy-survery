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
            style={{
              transition: 'background 0.12s ease',
              width: 44,
              height: 44,
              borderRadius: 8,
              border: 'none',
              fontSize: 15,
              fontWeight: 500,
              cursor: 'pointer',
              background: value === i ? '#6e30fd' : 'var(--color-surface-subtle)',
              color: value === i ? 'white' : 'var(--color-text-primary)',
            }}
          >
            {i}
          </button>
        ))}
      </div>
      <div className="flex justify-between mt-2 px-1">
        <span
          className="text-xs"
          style={{ color: 'var(--color-text-secondary)' }}
        >
          Ville ikke anbefale
        </span>
        <span
          className="text-xs"
          style={{ color: 'var(--color-text-secondary)' }}
        >
          Vil klart anbefale
        </span>
      </div>
    </div>
  )
}
