import { SCENES, type Scene } from '../../lib/scenes'

interface Props {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  maxLength?: number
  label?: string
  scene?: Scene
}

export function OpenText({ value, onChange, placeholder, maxLength = 300, label, scene = SCENES[0] }: Props) {
  return (
    <div style={{ marginTop: 20 }}>
      {label && (
        <div style={{ fontSize: 13.5, fontWeight: 500, color: scene.inkMuted, marginBottom: 8 }}>
          {label}
        </div>
      )}
      <textarea
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        maxLength={maxLength}
        rows={3}
        style={{
          width: '100%',
          padding: '14px 16px',
          borderRadius: 14,
          outline: 'none',
          fontSize: 14.5,
          fontFamily: 'var(--font-sans)',
          resize: 'none',
          background: '#f6f6f7',
          border: '1.5px solid #ededf0',
          color: scene.ink,
          boxSizing: 'border-box',
          transition: 'border-color 0.14s ease, background 0.14s ease',
        }}
        onFocus={e => { e.currentTarget.style.borderColor = scene.accent; e.currentTarget.style.background = '#ffffff' }}
        onBlur={e => { e.currentTarget.style.borderColor = '#ededf0'; e.currentTarget.style.background = '#f6f6f7' }}
      />
      <div style={{ fontSize: 12, textAlign: 'right', marginTop: 5, color: scene.inkMuted }}>
        {value.length} / {maxLength}
      </div>
    </div>
  )
}
