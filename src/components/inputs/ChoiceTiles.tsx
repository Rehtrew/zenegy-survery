import { useState } from 'react'
import type { Option } from '../../types'
import { BRAND_SCENE, type Scene } from '../../lib/scenes'
import { Glyph } from '../icons/glyphs'

interface Props {
  options: Option[]
  value: string
  onChange: (value: string) => void
  scene?: Scene
}

const SPECIAL_MARKS = new Set(['zenegy', 'other-system'])

/**
 * Single-select tiles with the icon on top and the text below — used for the
 * "do you use Zenegy?" question. A named glyph sits at the top of each tile;
 * the brand/neutral marks (`zenegy`, `other-system`) carry their own background,
 * line glyphs get a soft rounded tile.
 */
export function ChoiceTiles({ options, value, onChange, scene = BRAND_SCENE }: Props) {
  const [popped, setPopped] = useState<string | null>(null)

  return (
    <div className="choice-tiles" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
      {options.map((opt, i) => {
        const isSelected = value === opt.value
        const isMark = !!opt.iconName && SPECIAL_MARKS.has(opt.iconName)
        return (
          <button
            type="button"
            key={opt.value}
            data-selected={isSelected}
            onClick={() => { setPopped(opt.value); onChange(opt.value) }}
            className={`anim-rise-in${popped === opt.value && isSelected ? ' anim-select-pop' : ''}`}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              gap: 14,
              padding: '26px 18px 22px',
              borderRadius: 18,
              border: `1.5px solid ${isSelected ? scene.accent : '#e4e4ea'}`,
              background: isSelected ? '#efeafe' : '#ffffff',
              cursor: 'pointer',
              transition: 'background 0.16s ease, border-color 0.16s ease, transform 0.16s ease',
              fontFamily: 'var(--font-sans)',
              animationDelay: `${i * 40}ms`,
            }}
            onMouseEnter={e => { if (!isSelected) (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-2px)' }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)' }}
          >
            {opt.iconName && (
              isMark ? (
                <Glyph name={opt.iconName} size={56} animate={popped === opt.value && isSelected} />
              ) : (
                <span style={{
                  width: 56, height: 56, borderRadius: 15, flexShrink: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: isSelected ? '#ffffff' : '#ebe6ff',
                  transition: 'background 0.16s ease',
                }}>
                  <Glyph name={opt.iconName} size={28} color={scene.accent} animate={popped === opt.value && isSelected} />
                </span>
              )
            )}
            <span style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <span style={{ fontSize: 15.5, fontWeight: 500, color: scene.ink, lineHeight: 1.3 }}>{opt.label}</span>
              {opt.subLabel && <span style={{ fontSize: 13, color: scene.inkMuted, lineHeight: 1.4 }}>{opt.subLabel}</span>}
            </span>
          </button>
        )
      })}
    </div>
  )
}
