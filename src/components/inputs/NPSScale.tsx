import { useRef, useState, type PointerEvent as ReactPointerEvent } from 'react'
import { BRAND_SCENE, type Scene } from '../../lib/scenes'

interface Props {
  value: number | null
  onChange: (value: number) => void
  scene?: Scene
}

/**
 * 0–10 recommendation scale as a draggable slider. The value lives *inside* the
 * thumb (so it can never drift away from the knob), the thumb is always visible
 * (so it's obviously draggable), and the position transition is turned off while
 * dragging so the knob tracks the finger exactly. The 0–10 ticks are also tappable.
 */
export function NPSScale({ value, onChange, scene = BRAND_SCENE }: Props) {
  const trackRef = useRef<HTMLDivElement>(null)
  const [dragging, setDragging] = useState(false)
  const stops = Array.from({ length: 11 }, (_, i) => i)
  const hasValue = typeof value === 'number' && Number.isFinite(value)
  const thumbPct = hasValue ? (value as number) / 10 : 0.5 // unset: park in the middle, neutral
  const fillPct = hasValue ? (value as number) / 10 : 0

  const setFromClientX = (clientX: number) => {
    const el = trackRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const p = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width))
    onChange(Math.round(p * 10))
  }
  const onPointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    setDragging(true)
    e.currentTarget.setPointerCapture?.(e.pointerId)
    setFromClientX(e.clientX)
  }
  const onPointerMove = (e: ReactPointerEvent<HTMLDivElement>) => { if (dragging) setFromClientX(e.clientX) }
  const onPointerUp = () => setDragging(false)

  const move = dragging ? 'none' : 'left 0.18s cubic-bezier(0.22,1,0.36,1), width 0.18s cubic-bezier(0.22,1,0.36,1)'

  return (
    <div style={{ paddingTop: 4 }}>
      <div style={{ textAlign: 'center', fontSize: 13, fontWeight: 500, color: scene.inkMuted, marginBottom: 22 }}>
        {hasValue ? `Du valgte ${value} af 10` : 'Træk skyderen — eller tryk på et tal'}
      </div>

      {/* Track */}
      <div
        ref={trackRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        style={{ position: 'relative', height: 12, borderRadius: 99, background: '#e9e9ef', cursor: 'pointer', touchAction: 'none' }}
      >
        <div style={{
          position: 'absolute', left: 0, top: 0, height: '100%', width: `${fillPct * 100}%`,
          borderRadius: 99, background: scene.accent, opacity: hasValue ? 1 : 0, transition: move,
        }} />
        {/* Always-visible thumb with the value inside it */}
        <div
          data-testid="nps-readout"
          style={{
            position: 'absolute', top: '50%', left: `${thumbPct * 100}%`, transform: 'translate(-50%, -50%)',
            width: 46, height: 46, borderRadius: '50%', background: '#fff',
            border: `2px solid ${hasValue ? scene.accent : '#d1d1da'}`,
            boxShadow: '0 4px 14px rgba(20,12,43,0.18)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 17, fontWeight: 500, color: hasValue ? scene.accent : '#b1b1bb',
            cursor: dragging ? 'grabbing' : 'grab', transition: move, userSelect: 'none',
          }}
        >
          {hasValue ? value : '–'}
        </div>
      </div>

      {/* Tappable 0–10 ticks */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 16 }}>
        {stops.map(i => {
          const active = value === i
          return (
            <button
              type="button"
              key={i}
              aria-label={`${i}`}
              onClick={() => onChange(i)}
              style={{
                flex: 1, minWidth: 0, padding: '4px 0', textAlign: 'center', border: 'none', background: 'transparent',
                cursor: 'pointer', fontSize: 13, fontWeight: 500, fontFamily: 'var(--font-sans)',
                color: active ? scene.accent : '#b1b1bb', transition: 'color 0.15s ease',
              }}
            >
              {i}
            </button>
          )
        })}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
        <span style={{ fontSize: 13, fontWeight: 500, color: scene.inkMuted }}>Slet ikke</span>
        <span style={{ fontSize: 13, fontWeight: 500, color: scene.inkMuted }}>Helt sikkert</span>
      </div>
    </div>
  )
}
