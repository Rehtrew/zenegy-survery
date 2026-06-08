import { useRef, type PointerEvent as ReactPointerEvent } from 'react'
import { BRAND_SCENE, type Scene } from '../../lib/scenes'

interface Props {
  value: number | null
  onChange: (value: number) => void
  scene?: Scene
}

/**
 * A 0–10 recommendation scale rendered as a draggable slider: drag the handle, click
 * the track, or tap a number. The picked value rides above the handle in a bubble.
 * Keeps 11 numbered stops + a readout so it stays accessible (and test-covered).
 */
export function NPSScale({ value, onChange, scene = BRAND_SCENE }: Props) {
  const trackRef = useRef<HTMLDivElement>(null)
  const dragging = useRef(false)
  const stops = Array.from({ length: 11 }, (_, i) => i)
  const hasValue = typeof value === 'number' && Number.isFinite(value)
  const pct = hasValue ? (value as number) / 10 : 0

  const setFromClientX = (clientX: number) => {
    const el = trackRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const p = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width))
    onChange(Math.round(p * 10))
  }

  const onPointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    dragging.current = true
    e.currentTarget.setPointerCapture?.(e.pointerId)
    setFromClientX(e.clientX)
  }
  const onPointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (dragging.current) setFromClientX(e.clientX)
  }
  const onPointerUp = () => { dragging.current = false }

  return (
    <div style={{ paddingTop: 6 }}>
      {/* Value bubble / readout */}
      <div style={{ position: 'relative', height: 40 }}>
        <div
          key={value ?? 'none'}
          data-testid="nps-readout"
          className={hasValue ? 'anim-number-flip' : undefined}
          style={{
            position: 'absolute', top: 0, left: `${pct * 100}%`, transform: 'translateX(-50%)',
            background: hasValue ? scene.accent : '#e9e9ef', color: hasValue ? '#fff' : '#9a9aa3',
            fontSize: 15, fontWeight: 500, padding: '5px 12px', borderRadius: 9, whiteSpace: 'nowrap',
            transition: 'left 0.2s cubic-bezier(0.22,1,0.36,1)',
          }}
        >
          {hasValue ? value : '–'}
        </div>
      </div>

      {/* Track */}
      <div
        ref={trackRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        style={{ position: 'relative', height: 10, borderRadius: 99, background: '#e9e9ef', cursor: 'pointer', touchAction: 'none' }}
      >
        <div style={{
          position: 'absolute', left: 0, top: 0, height: '100%', width: `${pct * 100}%`,
          borderRadius: 99, background: scene.accent, opacity: hasValue ? 1 : 0,
          transition: 'width 0.2s cubic-bezier(0.22,1,0.36,1)',
        }} />
        {hasValue && (
          <div style={{
            position: 'absolute', top: '50%', left: `${pct * 100}%`, width: 26, height: 26, borderRadius: '50%',
            background: '#fff', boxShadow: '0 2px 10px rgba(20,12,43,0.22), 0 0 0 1px rgba(0,0,0,0.04)',
            transform: 'translate(-50%, -50%)', cursor: 'grab',
            transition: 'left 0.2s cubic-bezier(0.22,1,0.36,1)',
          }} />
        )}
      </div>

      {/* Numbered stops (clickable + tick labels) */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 14 }}>
        {stops.map(i => {
          const active = value === i
          return (
            <button
              type="button"
              key={i}
              aria-label={`${i}`}
              onClick={() => onChange(i)}
              style={{
                flex: 1, minWidth: 0, padding: '2px 0', textAlign: 'center', border: 'none', background: 'transparent', cursor: 'pointer',
                fontSize: 13, fontWeight: 500, fontFamily: 'var(--font-sans)',
                color: active ? scene.accent : '#b1b1bb', transition: 'color 0.15s ease',
              }}
            >
              {i}
            </button>
          )
        })}
      </div>

      {/* Endpoint labels */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 10 }}>
        <span style={{ fontSize: 13, fontWeight: 500, color: scene.inkMuted }}>Slet ikke</span>
        <span style={{ fontSize: 13, fontWeight: 500, color: scene.inkMuted }}>Helt sikkert</span>
      </div>
    </div>
  )
}
