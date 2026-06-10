/**
 * LandingReport — the right-hand hero visual. A fictional "market report" floating
 * on the Zenegy gradient with a pulsating dotted grid, plus two real survey-question
 * previews (satisfaction smileys + NPS slider) floating in front. Its job is to show
 * at a glance that this is a survey tool that turns answers into insight. All numbers
 * are illustrative; the preview cards are non-interactive.
 */
import { useEffect, useRef } from 'react'
import { Glyph } from '../components/icons/glyphs'
import { EmojiRating } from '../components/inputs/EmojiRating'
import { NPSScale } from '../components/inputs/NPSScale'
import type { Option } from '../types'

/**
 * Draws a circular wave of dots that pulses outward from center.
 * Each dot's opacity = sin²(phase) where phase lags behind center
 * proportionally to its distance, creating a ripple effect.
 */
function DotGrid() {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current!
    const ctx = canvas.getContext('2d')!
    let raf: number

    const sync = () => {
      const p = canvas.parentElement!
      const w = p.offsetWidth
      const h = p.offsetHeight
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w
        canvas.height = h
      }
    }

    const draw = (t: number) => {
      sync()
      const { width, height } = canvas
      ctx.clearRect(0, 0, width, height)

      const cx = width / 2
      const cy = height / 2
      const spacing = 24
      const cycleDuration = 5000
      // 12ms lag per pixel → wave front at ~417px/s; creates a dramatic stagger
      // where center and far corners are nearly opposite phases at any moment.
      const delayPerPx = 12

      for (let x = spacing / 2; x < width; x += spacing) {
        for (let y = spacing / 2; y < height; y += spacing) {
          const d = Math.sqrt((x - cx) ** 2 + (y - cy) ** 2)
          const raw = (t - d * delayPerPx) / cycleDuration
          const phase = ((raw % 1) + 1) % 1
          const s = Math.sin(phase * Math.PI)
          const alpha = 0.05 + 0.42 * s * s

          ctx.globalAlpha = alpha
          ctx.beginPath()
          ctx.arc(x, y, 1.5, 0, Math.PI * 2)
          ctx.fill()
        }
      }

      raf = requestAnimationFrame(draw)
    }

    ctx.fillStyle = '#ffffff'
    raf = requestAnimationFrame(draw)
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <canvas
      ref={ref}
      aria-hidden
      style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
    />
  )
}

const ACCENT = '#6e30fd'
const GRADIENT = 'linear-gradient(145deg, #120C2B 0%, #9D94FF 56%, #EBE6FF 100%)'
const noop = () => {}

const SAT_OPTIONS: Option[] = [
  { value: 'very-unhappy', label: 'Meget utilfreds' },
  { value: 'unhappy', label: 'Ikke tilfreds' },
  { value: 'meh', label: 'Det går' },
  { value: 'happy', label: 'Tilfreds' },
  { value: 'very-happy', label: 'Meget tilfreds' },
]

/** Grey skeleton bar standing in for text. */
function Sk({ w, h = 7, style }: { w: number | string; h?: number; style?: React.CSSProperties }) {
  return <span style={{ display: 'block', width: w, height: h, borderRadius: 5, background: '#e9e9ef', ...style }} />
}

function DonutGauge({ score = '42', pct = 0.74 }: { score?: string; pct?: number }) {
  const r = 26, c = 2 * Math.PI * r
  const offset = c * (1 - pct)
  const sweep = {
    strokeDashoffset: offset,
    animation: 'donut-sweep 1000ms cubic-bezier(0.22,1,0.36,1) both',
    '--from': `${c}px`,
  } as React.CSSProperties
  return (
    <svg width="66" height="66" viewBox="0 0 64 64">
      <circle cx="32" cy="32" r={r} fill="none" stroke="#ece8fb" strokeWidth="8" />
      <circle cx="32" cy="32" r={r} fill="none" stroke={ACCENT} strokeWidth="8" strokeLinecap="round" strokeDasharray={c} transform="rotate(-90 32 32)" style={sweep} />
      <text x="32" y="36" textAnchor="middle" fontSize="16" fontWeight="500" fill="#14132b" fontFamily="var(--font-sans)">{score}</text>
    </svg>
  )
}

function BarChart() {
  const bars = [20, 34, 28, 44, 38]
  return (
    <svg width="116" height="60" viewBox="0 0 116 60">
      <defs>
        <linearGradient id="barGrad" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor="#9D94FF" />
          <stop offset="100%" stopColor={ACCENT} />
        </linearGradient>
      </defs>
      {bars.map((h, i) => (
        <rect key={i} x={i * 23 + 4} y={56 - h} width="15" height={h} rx="3.5" fill="url(#barGrad)" className="chart-bar" style={{ animationDelay: `${i * 70}ms` }} />
      ))}
    </svg>
  )
}

function AreaTrend() {
  const line = 'M0 34 L34 28 L68 30 L102 18 L136 22 L170 9 L200 13'
  const area = `${line} L200 48 L0 48 Z`
  return (
    <svg width="100%" height="100%" viewBox="0 0 200 48" preserveAspectRatio="none" style={{ display: 'block' }}>
      <defs>
        <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#9D94FF" stopOpacity="0.38" />
          <stop offset="100%" stopColor="#9D94FF" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill="url(#areaGrad)" />
      <path d={line} fill="none" stroke={ACCENT} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" pathLength={1} vectorEffect="non-scaling-stroke" className="spark-draw" />
    </svg>
  )
}

/** A floating, non-interactive preview of a real survey question. */
function PreviewCard({ className, style, question, children }: {
  className?: string; style: React.CSSProperties; question: string; children: React.ReactNode
}) {
  return (
    <div
      className={className}
      style={{
        position: 'absolute', background: '#fff', borderRadius: 16, padding: '18px 18px 16px',
        boxShadow: '0 22px 52px rgba(20,12,43,0.22)', pointerEvents: 'none', ...style,
      }}
    >
      <div style={{ fontSize: 12, fontWeight: 500, color: '#b3a4e8', marginBottom: 8 }}>Din oplevelse</div>
      <div style={{ fontSize: 15, fontWeight: 500, color: '#14132b', marginBottom: 14 }}>{question}</div>
      {children}
    </div>
  )
}

export function LandingReport() {
  return (
    <div className="landing-report">
      {/* Gradient background box — dots live inside so overflow:hidden clips them */}
      <div className="landing-report-bg" style={{ background: GRADIENT }} aria-hidden>
        <DotGrid />
      </div>

      {/* Wrapper aligns with the purple bg area (top/bottom: 44px).
          Report card is vertically centered; preview cards anchor at the purple edges. */}
      <div style={{
        position: 'absolute',
        top: 44, bottom: 44,
        left: 0, right: 0,
        zIndex: 2,
        overflow: 'visible',
      }}>
        {/* Report card — the outer column spans the full height and flex-centers
            the card. Centering lives here (no transform) so it can't clash with
            the card's anim-rise-in entrance, which animates transform. */}
        <div style={{
          position: 'absolute', top: 0, bottom: 0, left: 130, right: -8,
          display: 'flex', alignItems: 'center',
        }}>
        <div
          className="anim-rise-in"
          style={{
            width: '100%',
            height: 'min(520px, 90%)',
            background: '#fff', borderRadius: 16, padding: '20px 22px 22px',
            boxShadow: '0 26px 60px rgba(20,12,43,0.24)',
            display: 'flex', flexDirection: 'column',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 11, marginBottom: 16 }}>
            <Glyph name="zenegy" size={30} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flex: 1 }}>
              <span style={{ fontSize: 14.5, fontWeight: 500, color: '#14132b' }}>Lønmarkedet 2026</span>
              <Sk w={108} h={6} />
            </div>
            <span style={{ fontSize: 10.5, fontWeight: 500, color: ACCENT, background: '#efeafe', borderRadius: 7, padding: '3px 8px' }}>Live</span>
          </div>

          <div style={{ height: 1, background: '#f0f0f3', margin: '0 -22px 16px' }} />

          <div style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
            <div style={{ flex: 1, background: '#faf9fe', borderRadius: 12, padding: '14px 14px 12px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
              <DonutGauge />
              <Sk w={56} h={6} />
            </div>
            <div style={{ flex: 1.4, background: '#faf9fe', borderRadius: 12, padding: '14px 14px 12px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
              <BarChart />
              <Sk w={64} h={6} />
            </div>
          </div>

          <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', marginBottom: 16 }}>
            <Sk w={84} h={6} style={{ marginBottom: 10 }} />
            <div style={{ flex: 1, minHeight: 80 }}>
              <AreaTrend />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
            <Sk w="100%" />
            <Sk w="88%" />
            <Sk w="70%" />
          </div>
        </div>
        </div>

        {/* Preview cards — 10% in from the purple area's top and bottom edges */}
        <PreviewCard
          className="anim-float"
          style={{ position: 'absolute', top: '10%', left: 0, width: 'min(340px, calc(100% - 20px))', zIndex: 4 }}
          question="Hvad synes du om dit lønsystem?"
        >
          <EmojiRating options={SAT_OPTIONS} value="very-happy" onChange={noop} />
        </PreviewCard>

        <PreviewCard
          className="anim-float"
          style={{ position: 'absolute', bottom: '10%', left: 20, width: 'min(340px, calc(100% - 30px))', zIndex: 3, animationDelay: '-2.5s' }}
          question="Ville du anbefale dit lønsystem til andre?"
        >
          <NPSScale value={9} onChange={noop} />
        </PreviewCard>
      </div>
    </div>
  )
}
