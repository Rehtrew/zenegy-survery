/**
 * Moving Icons — React ports of https://movingicons.dev/
 * Each icon animates on hover, matching the original Svelte implementations.
 */
import { useState, useCallback, useRef } from 'react'

interface IconProps {
  size?: number
  color?: string
  strokeWidth?: number
  className?: string
  style?: React.CSSProperties
}

// ── ShieldCheck ──────────────────────────────────────────────────────────────
export function ShieldCheck({ size = 24, color = 'currentColor', strokeWidth = 2, className = '', style }: IconProps) {
  const [animate, setAnimate] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const handleMouseEnter = useCallback(() => {
    if (animate) return
    setAnimate(true)
    timer.current = setTimeout(() => setAnimate(false), 500)
  }, [animate])

  return (
    <div aria-label="shield-check" role="img" className={className} style={{ display: 'inline-block', ...style }} onMouseEnter={handleMouseEnter}>
      <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none"
        stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" style={{ overflow: 'visible' }}>
        <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/>
        <path d="m9 12 2 2 4-4" className={`mi-shield-check-path${animate ? ' mi-animate' : ''}`}/>
      </svg>
    </div>
  )
}

// ── CircleCheck ───────────────────────────────────────────────────────────────
export function CircleCheck({ size = 24, color = 'currentColor', strokeWidth = 2, className = '', style }: IconProps) {
  const [animate, setAnimate] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const handleMouseEnter = useCallback(() => {
    if (animate) return
    setAnimate(true)
    timer.current = setTimeout(() => setAnimate(false), 500)
  }, [animate])

  return (
    <div aria-label="circle-check" role="img" className={className} style={{ display: 'inline-block', ...style }} onMouseEnter={handleMouseEnter}>
      <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none"
        stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" style={{ overflow: 'visible' }}>
        <circle cx="12" cy="12" r="10"/>
        <path d="m9 12 2 2 4-4" className={`mi-circle-check-path${animate ? ' mi-animate' : ''}`}/>
      </svg>
    </div>
  )
}

// ── Star ──────────────────────────────────────────────────────────────────────
export function Star({ size = 24, color = 'currentColor', strokeWidth = 2, className = '', style }: IconProps) {
  const [animate, setAnimate] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const handleMouseEnter = useCallback(() => {
    if (animate) return
    setAnimate(true)
    timer.current = setTimeout(() => setAnimate(false), 600)
  }, [animate])

  return (
    <div aria-label="star" role="img" className={className} style={{ display: 'inline-block', ...style }} onMouseEnter={handleMouseEnter}>
      <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none"
        stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" style={{ overflow: 'visible' }}>
        <g className={`mi-star-group${animate ? ' mi-animate' : ''}`}>
          <path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"/>
        </g>
      </svg>
    </div>
  )
}

// ── Sparkles ──────────────────────────────────────────────────────────────────
export function Sparkles({ size = 24, color = 'currentColor', strokeWidth = 2, className = '', style }: IconProps) {
  const [animate, setAnimate] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const handleMouseEnter = useCallback(() => {
    if (animate) return
    setAnimate(true)
    timer.current = setTimeout(() => setAnimate(false), 750)
  }, [animate])

  return (
    <div aria-label="sparkles" role="img" className={className} style={{ display: 'inline-block', ...style }} onMouseEnter={handleMouseEnter}>
      <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none"
        stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" style={{ overflow: 'visible' }}>
        <g className={`mi-sparkles-group${animate ? ' mi-animate' : ''}`}>
          <path d="M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z"/>
        </g>
        <path d="M20 2v4 M22 4h-4" className={`mi-sparkles-plus${animate ? ' mi-animate' : ''}`}/>
        <circle cx="4" cy="20" r="2" className={`mi-sparkles-circle${animate ? ' mi-animate' : ''}`}/>
      </svg>
    </div>
  )
}

// ── MessageCircle ─────────────────────────────────────────────────────────────
export function MessageCircle({ size = 24, color = 'currentColor', strokeWidth = 2, className = '', style }: IconProps) {
  const [animate, setAnimate] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const handleMouseEnter = useCallback(() => {
    if (animate) return
    setAnimate(true)
    timer.current = setTimeout(() => setAnimate(false), 800)
  }, [animate])

  return (
    <div aria-label="message-circle" role="img" className={className} style={{ display: 'inline-block', ...style }} onMouseEnter={handleMouseEnter}>
      <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none"
        stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" style={{ overflow: 'visible' }}>
        <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" className={`mi-message-path${animate ? ' mi-animate' : ''}`}/>
      </svg>
    </div>
  )
}

// ── SlidersHorizontal — animated SVG attributes via rAF ────────────────────────
function ease(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
}

function animVal(from: number, to: number, t: number): number {
  return from + (to - from) * ease(Math.min(t, 1))
}

export function SlidersHorizontal({ size = 24, color = 'currentColor', strokeWidth = 2, className = '', style }: IconProps) {
  // Each slider handle x position (thumb)
  const [thumb, setThumb] = useState({ t1: 14, t2: 8, t3: 16 })
  const rafRef = useRef<number | null>(null)
  const startRef = useRef<number | null>(null)
  const dirRef = useRef<'in' | 'out'>('out')

  const animate = useCallback((direction: 'in' | 'out') => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current)
    dirRef.current = direction
    startRef.current = null

    const targets = direction === 'in'
      ? { t1: 10, t2: 13, t3: 8 }
      : { t1: 14, t2: 8, t3: 16 }

    const initial = { ...thumb }
    const duration = 400

    const step = (now: number) => {
      if (!startRef.current) startRef.current = now
      const t = (now - startRef.current) / duration
      setThumb({
        t1: animVal(initial.t1, targets.t1, t),
        t2: animVal(initial.t2, targets.t2, t),
        t3: animVal(initial.t3, targets.t3, t),
      })
      if (t < 1) rafRef.current = requestAnimationFrame(step)
    }
    rafRef.current = requestAnimationFrame(step)
  }, [thumb])

  return (
    <div aria-label="sliders-horizontal" role="img" className={className}
      style={{ display: 'inline-block', ...style }}
      onMouseEnter={() => animate('in')}
      onMouseLeave={() => animate('out')}>
      <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none"
        stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" style={{ overflow: 'visible' }}>
        {/* Slider 1 */}
        <line x1="21" x2={thumb.t1} y1="4" y2="4"/>
        <line x1={thumb.t1 - 4} x2="3" y1="4" y2="4"/>
        <line x1={thumb.t1} x2={thumb.t1} y1="2" y2="6"/>
        {/* Slider 2 */}
        <line x1="21" x2={thumb.t2 + 4} y1="12" y2="12"/>
        <line x1={thumb.t2} x2="3" y1="12" y2="12"/>
        <line x1={thumb.t2} x2={thumb.t2} y1="10" y2="14"/>
        {/* Slider 3 */}
        <line x1="3" x2={thumb.t3 - 4} y1="20" y2="20"/>
        <line x1={thumb.t3} x2="21" y1="20" y2="20"/>
        <line x1={thumb.t3} x2={thumb.t3} y1="18" y2="22"/>
      </svg>
    </div>
  )
}
