/**
 * Campaign tags from the link the respondent arrived on.
 *
 * Stored with the answer so the results page can show which channel produced
 * them. No cookie and no tracking script is involved: these are campaign labels
 * from the URL, not an identity, which is what lets the survey stay free of a
 * consent banner.
 *
 * Keep the tags at campaign level when sharing links. A per-person tag would
 * narrow an "anonymous" answer down to one person, which is the whole thing we
 * promised not to do.
 */
export interface UtmTags {
  utm_source?: string
  utm_medium?: string
  utm_campaign?: string
}

const KEYS = ['utm_source', 'utm_medium', 'utm_campaign'] as const

/** Short, plain values only: anything odd is dropped rather than stored. */
function clean(value: string | null): string | undefined {
  if (!value) return undefined
  const trimmed = value.trim().toLowerCase().slice(0, 60)
  return /^[a-z0-9_.\-]+$/.test(trimmed) ? trimmed : undefined
}

export function readUtmTags(search: string = window.location.search): UtmTags {
  const params = new URLSearchParams(search)
  const tags: UtmTags = {}
  for (const key of KEYS) {
    const value = clean(params.get(key))
    if (value) tags[key] = value
  }
  return tags
}
