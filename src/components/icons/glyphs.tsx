/**
 * Glyphs — small static line icons (lucide-style) used to make survey options
 * scannable. Rendered by name so the question data in `lib/questions.ts` stays
 * declarative. Two names are special filled marks: `zenegy` (the brand app
 * symbol) and `other-system` (a neutral grey apps grid for "another system").
 */
import type { CSSProperties, ReactElement } from 'react'

interface GlyphProps {
  name: string
  size?: number
  color?: string
  strokeWidth?: number
  /** Play a one-shot "pop" — pass true on the frame the option becomes selected. */
  animate?: boolean
  style?: CSSProperties
}

/** Stroke-line icons: each entry is the inner SVG markup for a 24×24 viewBox. */
const LINE_PATHS: Record<string, ReactElement> = {
  // a3 + shared
  zap: <path d="M13 2 3 14h9l-1 8 10-12h-9l1-8Z" />,
  tag: (
    <>
      <path d="M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z" />
      <circle cx="7.5" cy="7.5" r="0.6" />
    </>
  ),
  plug: (
    <>
      <path d="M12 22v-5" />
      <path d="M9 8V2" />
      <path d="M15 8V2" />
      <path d="M18 8v5a4 4 0 0 1-4 4h-4a4 4 0 0 1-4-4V8Z" />
    </>
  ),
  chat: <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />,
  layers: (
    <>
      <path d="M12 2 2 7l10 5 10-5-10-5Z" />
      <path d="m2 12 10 5 10-5" />
      <path d="m2 17 10 5 10-5" />
    </>
  ),
  // b2
  hourglass: (
    <path d="M5 22h14M5 2h14M17 2v4.5a5 5 0 0 1-2 4 5 5 0 0 1 2 4V22M7 2v4.5a5 5 0 0 0 2 4 5 5 0 0 0-2 4V22" />
  ),
  layout: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M3 9h18M9 21V9" />
    </>
  ),
  feature: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M12 8v8M8 12h8" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </>
  ),
  smartphone: (
    <>
      <rect x="6" y="2" width="12" height="20" rx="2.5" />
      <path d="M11 18h2" />
    </>
  ),
  smile: (
    <>
      <circle cx="12" cy="12" r="10" />
      <path d="M8 14s1.5 2 4 2 4-2 4-2" />
      <path d="M9 9h.01M15 9h.01" />
    </>
  ),
  pencil: (
    <>
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
    </>
  ),
  // b4
  repeat: (
    <>
      <path d="m17 2 4 4-4 4" />
      <path d="M3 11v-1a4 4 0 0 1 4-4h14" />
      <path d="m7 22-4-4 4-4" />
      <path d="M21 13v1a4 4 0 0 1-4 4H3" />
    </>
  ),
  'trending-up': (
    <>
      <path d="m22 7-8.5 8.5-5-5L2 17" />
      <path d="M16 7h6v6" />
    </>
  ),
  banknote: (
    <>
      <rect x="2" y="6" width="20" height="12" rx="2" />
      <circle cx="12" cy="12" r="2.4" />
      <path d="M6 12h.01M18 12h.01" />
    </>
  ),
  search: (
    <>
      <circle cx="11" cy="11" r="7" />
      <path d="m21 21-4.3-4.3" />
    </>
  ),
  calculator: (
    <>
      <rect x="4" y="2" width="16" height="20" rx="2" />
      <path d="M8 6h8" />
      <path d="M8 11h.01M12 11h.01M16 11h.01M8 15h.01M12 15h.01M16 15h.01M8 19h8" />
    </>
  ),
  mail: (
    <>
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </>
  ),
  shield: (
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  ),
  'file-text': (
    <>
      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
      <polyline points="14 2 14 8 20 8" />
      <path d="M8 13h8M8 17h5" />
    </>
  ),
}

export function Glyph({ name, size = 24, color = 'currentColor', strokeWidth = 2, animate, style }: GlyphProps) {
  const animClass = animate ? 'glyph-pop' : undefined
  const animStyle: CSSProperties = animate ? { transformOrigin: 'center' } : {}

  // Zenegy brand mark — lavender square + purple symbol.
  if (name === 'zenegy') {
    return (
      <svg width={size} height={size} viewBox="0 0 40 40" fill="none" className={animClass} style={{ display: 'block', ...animStyle, ...style }}>
        <rect width="40" height="40" rx="9" fill="#EBE6FF" />
        <path d="M20.8139 16.679H12.3237C11.3902 16.679 10.6123 17.4287 10.6123 18.3769V26.2927C10.6123 28.189 13.1016 28.9387 14.1684 27.3511L21.0362 17.098C21.1473 16.9216 21.0362 16.679 20.8139 16.679Z" fill="#6E30FD" />
        <path d="M19.1471 24.419H27.6373C28.5708 24.419 29.3487 23.6693 29.3487 22.7212V14.8053C29.3487 12.909 26.8594 12.1593 25.7926 13.7469L18.9248 24.0001C18.8137 24.1765 18.9248 24.419 19.1471 24.419Z" fill="#6E30FD" />
      </svg>
    )
  }

  // Neutral "another system" mark — a grey apps grid.
  if (name === 'other-system') {
    return (
      <svg width={size} height={size} viewBox="0 0 40 40" fill="none" className={animClass} style={{ display: 'block', ...animStyle, ...style }}>
        <rect width="40" height="40" rx="9" fill="#ECECEF" />
        <rect x="10" y="10" width="8" height="8" rx="2.2" fill="#9A9AA3" />
        <rect x="22" y="10" width="8" height="8" rx="2.2" fill="#B9B9C0" />
        <rect x="10" y="22" width="8" height="8" rx="2.2" fill="#B9B9C0" />
        <rect x="22" y="22" width="8" height="8" rx="2.2" fill="#9A9AA3" />
      </svg>
    )
  }

  const inner = LINE_PATHS[name]
  if (!inner) return null
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={animClass}
      style={{ display: 'block', overflow: 'visible', ...animStyle, ...style }}
    >
      {inner}
    </svg>
  )
}
