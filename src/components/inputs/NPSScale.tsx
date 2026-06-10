import { useRef, useState, type PointerEvent as ReactPointerEvent } from 'react'
import { BRAND_SCENE, type Scene } from '../../lib/scenes'

interface Props {
  value: number | null
  onChange: (value: number) => void
  scene?: Scene
}

// macOS-style slider geometry. The thumb line travels between INSET and
// width-INSET so it never touches the pill's rounded ends; the fill bleeds
// MARGIN past the line so the line floats inside the fill; FRAME is the gap
// between fill and track edge — at 10 the fill lands exactly FRAME from the
// right edge, mirroring the left.
const INSET = 12
const MARGIN = 9
const FRAME = 3

const STOPS = Array.from({ length: 11 }, (_, i) => i)

export function NPSScale({ value, onChange, scene = BRAND_SCENE }: Props) {
  const trackRef = useRef<HTMLDivElement>(null)
  const [dragging, setDragging] = useState(false)
  const hasValue = typeof value === 'number' && Number.isFinite(value)
  const pct = hasValue ? (value as number) / 10 : 0
  // Thumb-line center, in CSS calc terms
  const lineX = `calc(${INSET}px + ${pct} * (100% - ${INSET * 2}px))`

  const setFromClientX = (clientX: number) => {
    const el = trackRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const raw = (clientX - rect.left - INSET) / (rect.width - INSET * 2)
    onChange(Math.min(10, Math.max(0, Math.round(raw * 10))))
  }

  const onPointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    setDragging(true)
    e.currentTarget.setPointerCapture?.(e.pointerId)
    setFromClientX(e.clientX)
  }
  const onPointerMove = (e: ReactPointerEvent<HTMLDivElement>) => { if (dragging) setFromClientX(e.clientX) }
  const onPointerUp = () => setDragging(false)

  const ease = 'cubic-bezier(0.22,1,0.36,1)'
  const trans = dragging ? 'none' : `width 0.18s ${ease}, left 0.18s ${ease}`

  return (
    <div style={{ paddingTop: 4 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 18, marginBottom: 6 }}>
        <div
          ref={trackRef}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          style={{
            flex: 1, position: 'relative', height: 52, borderRadius: 99,
            background: '#f0f0f4',
            cursor: 'pointer', touchAction: 'none', overflow: 'hidden',
          }}
        >
          {/* Stop dots — sit under the fill, visible only on the unfilled part */}
          {STOPS.map(i => (
            <span
              key={i}
              aria-hidden
              style={{
                position: 'absolute', top: '50%',
                left: `calc(${INSET}px + ${i / 10} * (100% - ${INSET * 2}px))`,
                transform: 'translate(-50%, -50%)',
                width: 3, height: 3, borderRadius: '50%',
                background: '#d2d2dc', zIndex: 0,
              }}
            />
          ))}

          {/* Opaque rounded fill — covers the dots it has passed */}
          {hasValue && (
            <div style={{
              position: 'absolute', left: FRAME, top: FRAME, bottom: FRAME,
              width: `calc(${INSET + MARGIN - FRAME}px + ${pct} * (100% - ${INSET * 2}px))`,
              borderRadius: 99,
              background: '#ebe6ff',
              transition: trans,
              zIndex: 1,
            }} />
          )}

          {/* Thumb — short vertical line floating inside the fill's right end */}
          {hasValue && (
            <div style={{
              position: 'absolute', top: 15, bottom: 15,
              left: lineX,
              transform: 'translateX(-50%)',
              width: 3, borderRadius: 99,
              background: scene.accent,
              transition: trans,
              zIndex: 2,
            }} />
          )}

          {/* Placeholder — only shown when nothing selected */}
          {!hasValue && (
            <span style={{
              position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 13, fontWeight: 500, color: '#a8a8b8', pointerEvents: 'none', zIndex: 3,
            }}>
              Træk skyderen
            </span>
          )}

          {/* Labels always shown for scale context */}
          <span style={{
            position: 'absolute', left: 26, top: '50%', transform: 'translateY(-50%)',
            fontSize: 12.5, fontWeight: 500, color: '#46465a',
            pointerEvents: 'none', zIndex: 3, whiteSpace: 'nowrap',
          }}>
            0 · Slet ikke
          </span>
          <span style={{
            position: 'absolute', right: 26, top: '50%', transform: 'translateY(-50%)',
            fontSize: 12.5, fontWeight: 500, color: '#46465a',
            pointerEvents: 'none', zIndex: 3, whiteSpace: 'nowrap',
          }}>
            10 · Helt sikkert
          </span>
        </div>

        {/* Value readout */}
        <div
          data-testid="nps-readout"
          style={{
            fontSize: 40, fontWeight: 600, letterSpacing: '-0.04em', lineHeight: 1,
            color: hasValue ? scene.accent : '#d1d1da',
            minWidth: 50, textAlign: 'right',
            transition: 'color 0.2s ease',
          }}
        >
          {hasValue ? value : '—'}
        </div>
      </div>
    </div>
  )
}
