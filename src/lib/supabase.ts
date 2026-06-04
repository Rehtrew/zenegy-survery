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

export async function submitSurvey(data: Submission): Promise<void> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await getClient().from('submissions').insert(data as any)
  if (error) throw new Error(error.message)
}
