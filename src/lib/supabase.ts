import { createClient } from '@supabase/supabase-js'
import type { Submission } from '../types'

// Lazy singleton — defers createClient until first call so tests that mock
// @supabase/supabase-js at module level don't get a client built with undefined URLs.
let _client: ReturnType<typeof createClient> | null = null

function getClient() {
  if (!_client) {
    _client = createClient(
      import.meta.env.VITE_SUPABASE_URL,
      import.meta.env.VITE_SUPABASE_ANON_KEY,
    )
  }
  return _client
}

/**
 * Insert a completed survey. PostgREST rejects unknown columns one at a time
 * with PGRST204 ("Could not find the 'X' column …"). If the live schema is
 * behind the app — e.g. a pending migration hasn't been pushed yet — we drop
 * the offending column and retry, so a respondent's submission still saves
 * (minus that one field) instead of being lost entirely. Once the migration
 * is applied, the first attempt succeeds with the full payload.
 */
export async function submitSurvey(data: Submission): Promise<void> {
  const payload: Record<string, unknown> = { ...data }
  // Bound the loop generously above the number of optional columns so a genuine
  // error can never spin forever.
  for (let attempt = 0; attempt < 24; attempt++) {
    // Snapshot per attempt so each insert gets an independent object.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await getClient().from('submissions').insert({ ...payload } as any)
    if (!error) return
    const missingCol = error.message.match(/Could not find the '(.+?)' column/)?.[1]
    if (missingCol && missingCol in payload) {
      console.warn(`submissions.${missingCol} missing from live schema — dropping it (apply the pending migration to capture this field).`)
      delete payload[missingCol]
      continue
    }
    throw new Error(error.message)
  }
  throw new Error('submitSurvey: too many unknown columns — schema is badly out of sync')
}

/** Optional report opt-in — stored separately so answers stay anonymous. */
export async function signupForReport(email: string, newsletterOptIn: boolean): Promise<void> {
  const { error } = await getClient()
    .from('report_signups')
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .insert({ email, newsletter_opt_in: newsletterOptIn } as any)
  if (error) throw new Error(error.message)
}
