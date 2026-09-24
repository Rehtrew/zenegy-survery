import { readUtmTags } from './utm'

/**
 * Funnel counters: one ping when the survey is opened, one when someone starts
 * answering. Completions are the saved answers, so the three give a drop-off
 * rate without a cookie, a tracking script or a consent banner.
 *
 * Nothing identifying is sent. The server stores the event name, the time and
 * the campaign tags, and never an IP.
 *
 * Fire and forget by design: a counter must never delay the survey or put an
 * error in front of a respondent, so failures are swallowed.
 */
export type SurveyEvent = 'view' | 'start'

const BASE = import.meta.env.VITE_API_BASE ?? '.'

function endpoint(): string {
  if (/^https?:\/\//.test(BASE) || BASE.startsWith('/')) return `${BASE.replace(/\/$/, '')}/api.php?event=1`
  const path = window.location.pathname
  const dir = path.endsWith('/') ? path : path.slice(0, path.lastIndexOf('/') + 1)
  return `${dir}api.php?event=1`
}

export function trackEvent(event: SurveyEvent): void {
  try {
    void fetch(endpoint(), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ event, ...readUtmTags() }),
      keepalive: true,
    }).catch(() => { /* a missed count is not worth telling anyone about */ })
  } catch {
    /* no fetch, no counting, no problem */
  }
}
