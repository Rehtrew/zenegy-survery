import { describe, it, expect, vi } from 'vitest'
import type { Submission } from '../types'

// Control what the mocked client returns per-test
const mockInsert = vi.fn().mockResolvedValue({ error: null })

vi.mock('@supabase/supabase-js', () => ({
  createClient: () => ({
    from: () => ({ insert: mockInsert }),
  }),
}))

// Dynamic import AFTER mock so the lazy singleton uses the mocked createClient
const { submitSurvey } = await import('./supabase')

const validSubmission: Submission = {
  track: 'non-zenegy',
  b_payroll_system: 'dataloen',
  b_frustrations: ['price'],
  b_priorities: [{ rank: 1, value: 'price' }],
  b_barriers: ['transition'],
  accounting_system: 'e-conomic',
  email: 'test@test.dk',
  newsletter_opt_in: false,
}

describe('submitSurvey', () => {
  it('resolves without error on valid submission', async () => {
    mockInsert.mockResolvedValueOnce({ error: null })
    await expect(submitSurvey(validSubmission)).resolves.toBeUndefined()
  })

  it('throws when supabase returns an error', async () => {
    mockInsert.mockResolvedValueOnce({ error: { message: 'DB error' } })
    await expect(submitSurvey(validSubmission)).rejects.toThrow('DB error')
  })
})
