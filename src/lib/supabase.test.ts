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
const { submitSurvey, signupForReport } = await import('./supabase')

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

  it('throws when supabase returns a non-schema error', async () => {
    mockInsert.mockReset()
    mockInsert.mockResolvedValueOnce({ error: { message: 'DB error' } })
    await expect(submitSurvey(validSubmission)).rejects.toThrow('DB error')
  })

  it('drops an unknown column (pending migration) and retries so data still saves', async () => {
    mockInsert.mockReset()
    // Live schema is behind the app: it has no 'size' column yet.
    mockInsert
      .mockResolvedValueOnce({ error: { message: "Could not find the 'size' column of 'submissions' in the schema cache" } })
      .mockResolvedValueOnce({ error: null })

    await expect(submitSurvey({ ...validSubmission, size: '10-49' })).resolves.toBeUndefined()

    expect(mockInsert).toHaveBeenCalledTimes(2)
    // First attempt includes size; the retry has it stripped out.
    expect(mockInsert.mock.calls[0][0]).toHaveProperty('size')
    expect(mockInsert.mock.calls[1][0]).not.toHaveProperty('size')
    // Real answer data is preserved on the retry.
    expect(mockInsert.mock.calls[1][0]).toMatchObject({ track: 'non-zenegy', b_payroll_system: 'dataloen' })
  })

  it('strips several unknown columns across retries, never losing the rest', async () => {
    mockInsert.mockReset()
    mockInsert
      .mockResolvedValueOnce({ error: { message: "Could not find the 'size' column of 'submissions' in the schema cache" } })
      .mockResolvedValueOnce({ error: { message: "Could not find the 'b_switch_intent' column of 'submissions' in the schema cache" } })
      .mockResolvedValueOnce({ error: null })

    await expect(submitSurvey({ ...validSubmission, size: '1-9', b_switch_intent: 'no' })).resolves.toBeUndefined()
    expect(mockInsert).toHaveBeenCalledTimes(3)
    const final = mockInsert.mock.calls[2][0]
    expect(final).not.toHaveProperty('size')
    expect(final).not.toHaveProperty('b_switch_intent')
    expect(final).toMatchObject({ track: 'non-zenegy' })
  })
})

describe('signupForReport', () => {
  it('inserts email + newsletter flag into report_signups', async () => {
    mockInsert.mockReset()
    mockInsert.mockResolvedValueOnce({ error: null })
    await expect(signupForReport('a@b.dk', true)).resolves.toBeUndefined()
    expect(mockInsert).toHaveBeenCalledWith({ email: 'a@b.dk', newsletter_opt_in: true })
  })

  it('throws when the signup fails', async () => {
    mockInsert.mockReset()
    mockInsert.mockResolvedValueOnce({ error: { message: 'nope' } })
    await expect(signupForReport('a@b.dk', false)).rejects.toThrow('nope')
  })
})
