import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('@supabase/supabase-js', () => ({
  createClient: vi.fn(() => ({
    from: vi.fn(() => ({
      insert: vi.fn().mockResolvedValue({ error: null }),
    })),
  })),
}))

// Must import AFTER mock is set up
const { submitSurvey } = await import('./supabase')
const { createClient } = await import('@supabase/supabase-js')

describe('submitSurvey', () => {
  it('resolves without error on valid submission', async () => {
    await expect(
      submitSurvey({
        track: 'non-zenegy',
        b_payroll_system: 'dataloen',
        b_frustrations: ['price'],
        b_priorities: [{ rank: 1, value: 'price' }],
        b_barriers: ['transition'],
        accounting_system: 'e-conomic',
        email: 'test@test.dk',
        newsletter_opt_in: false,
      })
    ).resolves.toBeUndefined()
  })

  it('throws on supabase error', async () => {
    const mockedCreateClient = vi.mocked(createClient)
    mockedCreateClient.mockReturnValueOnce({
      from: vi.fn(() => ({
        insert: vi.fn().mockResolvedValue({ error: { message: 'DB error' } }),
      })),
    } as any)

    // Re-import to get fresh client with overridden mock
    vi.resetModules()
    const { submitSurvey: freshSubmit } = await import('./supabase')

    await expect(
      freshSubmit({ track: 'zenegy', email: 'x@x.dk', newsletter_opt_in: false })
    ).rejects.toThrow()
  })
})
