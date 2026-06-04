interface Props {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  maxLength?: number
  label?: string
}

export function OpenText({ value, onChange, placeholder, maxLength = 300, label }: Props) {
  return (
    <div className="mt-5">
      {label && (
        <div
          className="mb-2"
          style={{
            fontSize: 13,
            fontWeight: 600,
            color: 'var(--color-text-secondary)',
          }}
        >
          {label}
        </div>
      )}
      <textarea
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        maxLength={maxLength}
        rows={3}
        className="w-full px-4 py-3.5 rounded-xl outline-none text-sm font-sans resize-none transition-colors"
        style={{
          background: 'var(--color-surface-subtle)',
          border: 'none',
          color: 'var(--color-text-primary)',
        }}
      />
      <div
        className="text-xs text-right mt-1"
        style={{ color: 'var(--color-text-tertiary)' }}
      >
        {value.length} / {maxLength}
      </div>
    </div>
  )
}
