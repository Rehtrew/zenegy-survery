/**
 * Brand theme — the survey uses one calm, consistent surface: a white card with a
 * single Zenegy-purple accent (Typeform-style minimalism, Apple-style restraint).
 *
 * Earlier the survey rotated through pastel "scenes"; that's been removed because it
 * made every question feel different. The `Scene` shape and `getScene()` are kept so
 * the input components don't need their signatures changed — the palette is now constant.
 *
 * - bg:        card fill (white)
 * - ink:       heading color
 * - inkMuted:  secondary text
 * - accent:    the single purple used for selection / focus
 * - accentSoft:translucent accent for focus rings
 */
export interface Scene {
  key: string
  bg: string
  ink: string
  inkMuted: string
  accent: string
  accentSoft: string
}

export const BRAND_SCENE: Scene = {
  key: 'brand',
  bg: '#ffffff',
  ink: '#14132b',
  inkMuted: '#86868b',
  accent: '#6e30fd',
  accentSoft: 'rgba(110,48,253,0.12)',
}

/** Kept for any code importing the array; all entries are the single brand theme. */
export const SCENES: Scene[] = [BRAND_SCENE]

/** The survey is single-themed now, so every position returns the brand scene. */
export function getScene(_index: number): Scene {
  return BRAND_SCENE
}
