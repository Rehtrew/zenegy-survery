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
        <div className="text-[13px] font-semibold text-gray-700 mb-2">{label}</div>
      )}
      <textarea
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        maxLength={maxLength}
        rows={3}
        className="w-full px-4 py-3.5 rounded-xl border-[1.5px] border-app-border focus:border-primary outline-none text-sm font-sans resize-none transition-colors text-text-main placeholder:text-gray-400"
      />
      <div className="text-xs text-gray-400 text-right mt-1">
        {value.length} / {maxLength}
      </div>
    </div>
  )
}
