import { createClient } from '@supabase/supabase-js'
import type { Submission } from '../types'

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
)

export async function submitSurvey(data: Submission): Promise<void> {
  const { error } = await supabase.from('submissions').insert(data)
  if (error) throw new Error(error.message)
}
