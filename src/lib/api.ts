import type { Submission } from '../types'

/**
 * Talks to `api.php`, the PHP bundle that sits next to index.html in the
 * deployed folder. It owns the database connection, so nothing secret reaches
 * the browser.
 *
 * Answers only — the optional report email goes to HubSpot instead (lib/hubspot.ts).
 *
 * Paths are relative on purpose: the survey is served from a folder on
 * zenegy.com, and the folder can be renamed without touching the code. Set
 * `VITE_API_BASE` at build time only if the API ever moves somewhere else.
 */
const BASE = import.meta.env.VITE_API_BASE ?? '.'

/** Resolve against the page URL so it works in a subfolder, with or without a trailing slash. */
function endpoint(file: string): string {
  if (/^https?:\/\//.test(BASE) || BASE.startsWith('/')) return `${BASE.replace(/\/$/, '')}/${file}`
  const path = window.location.pathname
  const dir = path.endsWith('/') ? path : path.slice(0, path.lastIndexOf('/') + 1)
  return `${dir}${file}`
}

async function post(file: string, body: unknown): Promise<void> {
  let response: Response
  try {
    response = await fetch(endpoint(file), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
  } catch {
    // Offline, DNS failure, request blocked — the caller offers a retry.
    throw new Error('Kunne ikke få forbindelse. Tjek din internetforbindelse.')
  }
  if (response.ok) return

  let message = `Serveren svarede ${response.status}`
  try {
    const data = await response.json() as { error?: string }
    if (data?.error) message = data.error
  } catch { /* not JSON — keep the status message */ }
  throw new Error(message)
}

/** Insert a completed survey. Answers are anonymous; no email is attached. */
export async function submitSurvey(data: Submission): Promise<void> {
  await post('api.php', data)
}
