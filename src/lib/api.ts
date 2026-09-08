import type { Submission } from '../types'

/**
 * Talks to the PHP endpoints that ship next to the built site
 * (`kinsta/api/*.php` → `api/*.php` in the deployed folder). They own the
 * database connection, so nothing secret reaches the browser.
 *
 * Paths are relative on purpose: the survey is served from a folder on
 * zenegy.com, and the folder can be renamed without touching the code. Set
 * `VITE_API_BASE` at build time only if the API ever moves somewhere else.
 */
const BASE = import.meta.env.VITE_API_BASE ?? 'api'

/** Resolve against the page URL so it works in a subfolder, with or without a trailing slash. */
function endpoint(file: string): string {
  if (/^https?:\/\//.test(BASE) || BASE.startsWith('/')) return `${BASE.replace(/\/$/, '')}/${file}`
  const path = window.location.pathname
  const dir = path.endsWith('/') ? path : path.slice(0, path.lastIndexOf('/') + 1)
  return `${dir}${BASE}/${file}`
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
  await post('submit.php', data)
}

/** Optional report opt-in — stored separately so answers stay anonymous. */
export async function signupForReport(email: string, newsletterOptIn: boolean): Promise<void> {
  await post('signup.php', { email, newsletter_opt_in: newsletterOptIn })
}
