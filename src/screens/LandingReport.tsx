/**
 * LandingReport — the right-hand hero visual. A fictional "market report" floating
 * on the Zenegy gradient with a pulsating dotted grid, plus a couple of floating
 * stat cards. Its job is to signal at a glance that this is a tool for gathering
 * survey data and turning it into insight. All numbers are illustrative.
 *
 * Charts are tiny inline SVGs (no chart library) with one-shot entrance animations;
 * everything sits under the global prefers-reduced-motion guard.
 */
import { Glyph } from '../components/icons/glyphs'

const ACCENT = '#6e30fd'
const GRADIENT = 'linear-gradient(145deg, #120C2B 0%, #9D94FF 56%, #EBE6FF 100%)'

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
      <circle
        cx="32" cy="32" r={r} fill="none" stroke={ACCENT} strokeWidth="8" strokeLinecap="round"
        strokeDasharray={c} transform="rotate(-90 32 32)" style={sweep}
      />
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
        <rect
          key={i} x={i * 23 + 4} y={56 - h} width="15" height={h} rx="3.5" fill="url(#barGrad)"
          className="chart-bar" style={{ animationDelay: `${i * 70}ms` }}
        />
      ))}
    </svg>
  )
}

function AreaTrend() {
  const line = 'M0 34 L34 28 L68 30 L102 18 L136 22 L170 9 L200 13'
  const area = `${line} L200 48 L0 48 Z`
  return (
    <svg width="100%" height="46" viewBox="0 0 200 48" preserveAspectRatio="none" style={{ display: 'block' }}>
      <defs>
        <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#9D94FF" stopOpacity="0.38" />
          <stop offset="100%" stopColor="#9D94FF" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill="url(#areaGrad)" />
      <path
        d={line} fill="none" stroke={ACCENT} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
        pathLength={1} vectorEffect="non-scaling-stroke" className="spark-draw"
      />
    </svg>
  )
}

/** Tiny up-and-to-the-right sparkline for the floating stat card. */
function MiniSpark() {
  return (
    <svg width="52" height="20" viewBox="0 0 52 20" fill="none">
      <path d="M2 16 L12 11 L22 13 L32 6 L42 8 L50 2" stroke={ACCENT} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" pathLength={1} className="spark-draw" />
    </svg>
  )
}

export function LandingReport() {
  return (
    <div className="landing-report" style={{ position: 'relative', overflow: 'hidden', background: GRADIENT }}>
      {/* Pulsating dotted grid */}
      <div
        className="dot-grid-pulse"
        aria-hidden
        style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.5) 1.2px, transparent 1.4px)',
          backgroundSize: '22px 22px',
        }}
      />

      {/* Floating stat card (top-left, over the dark corner) */}
      <div
        className="anim-float"
        style={{
          position: 'absolute', top: 38, left: 26, zIndex: 3,
          background: '#fff', borderRadius: 14, padding: '13px 15px',
          boxShadow: '0 16px 38px rgba(20,12,43,0.20)', minWidth: 132,
        }}
      >
        <div style={{ fontSize: 12, fontWeight: 500, color: '#86868b', marginBottom: 5 }}>Svar i alt</div>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 10 }}>
          <span style={{ fontSize: 21, fontWeight: 500, color: '#14132b', letterSpacing: '-0.02em' }}>1.248</span>
          <MiniSpark />
        </div>
        <div style={{ fontSize: 11.5, fontWeight: 500, color: '#1f9d63', marginTop: 4 }}>+18% denne uge</div>
      </div>

      {/* Main report card (right side, bleeds off the right edge) */}
      <div
        className="anim-rise-in"
        style={{
          position: 'absolute', top: 60, right: -8, width: 332, zIndex: 2,
          background: '#fff', borderRadius: 16, padding: '20px 20px 22px',
          boxShadow: '0 26px 60px rgba(20,12,43,0.24)',
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 11, marginBottom: 16 }}>
          <Glyph name="zenegy" size={30} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flex: 1 }}>
            <span style={{ fontSize: 14.5, fontWeight: 500, color: '#14132b' }}>Lønmarkedet 2026</span>
            <Sk w={108} h={6} />
          </div>
          <span style={{ fontSize: 10.5, fontWeight: 500, color: ACCENT, background: '#efeafe', borderRadius: 7, padding: '3px 8px' }}>Live</span>
        </div>

        <div style={{ height: 1, background: '#f0f0f3', margin: '0 -20px 16px' }} />

        {/* Two mini charts */}
        <div style={{ display: 'flex', gap: 14, marginBottom: 16 }}>
          <div style={{ flex: 1, background: '#faf9fe', borderRadius: 12, padding: '12px 12px 10px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
            <DonutGauge />
            <Sk w={48} h={6} />
          </div>
          <div style={{ flex: 1, background: '#faf9fe', borderRadius: 12, padding: '12px 12px 10px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
            <BarChart />
            <Sk w={56} h={6} />
          </div>
        </div>

        {/* Trend */}
        <div style={{ marginBottom: 14 }}>
          <Sk w={84} h={6} style={{ marginBottom: 8 }} />
          <AreaTrend />
        </div>

        {/* Skeleton paragraph */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <Sk w="100%" />
          <Sk w="92%" />
          <Sk w="74%" />
        </div>
      </div>

      {/* Floating check chip (bottom-left, overlaps the report) */}
      <div
        style={{
          position: 'absolute', bottom: 46, left: 22, zIndex: 4,
          display: 'inline-flex', alignItems: 'center', gap: 9,
          background: '#fff', borderRadius: 12, padding: '11px 15px',
          boxShadow: '0 16px 38px rgba(20,12,43,0.20)',
        }}
      >
        <span style={{ width: 22, height: 22, borderRadius: '50%', background: '#e2f5ec', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <svg width="12" height="12" viewBox="0 0 14 14" fill="none"><path d="M2.5 7.5L5.5 10.5L11.5 4" stroke="#1f9d63" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </span>
        <span style={{ fontSize: 12.5, fontWeight: 500, color: '#14132b' }}>Anonymt · GDPR-sikkert</span>
      </div>
    </div>
  )
}
