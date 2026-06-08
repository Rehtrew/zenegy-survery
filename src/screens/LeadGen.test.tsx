import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { LeadGen } from './LeadGen'

vi.mock('../lib/supabase', () => ({ submitSurvey: vi.fn().mockResolvedValue(undefined) }))
import { submitSurvey } from '../lib/supabase'

describe('LeadGen submit', () => {
  beforeEach(() => { vi.mocked(submitSurvey).mockClear() })

  it('submits employee respondents with track "employee" (they have no payroll track)', async () => {
    render(<LeadGen answers={{ is_employee: true, e_payslip: 'app' }} onSubmitted={vi.fn()} />)
    await userEvent.type(screen.getByPlaceholderText('din@email.dk'), 'a@b.dk')
    await userEvent.click(screen.getByText('Send mig resultaterne'))
    expect(submitSurvey).toHaveBeenCalledWith(
      expect.objectContaining({ track: 'employee', email: 'a@b.dk' }),
    )
  })

  it('submits decision-makers with their chosen track', async () => {
    render(<LeadGen answers={{ track: 'zenegy' }} onSubmitted={vi.fn()} />)
    await userEvent.type(screen.getByPlaceholderText('din@email.dk'), 'a@b.dk')
    await userEvent.click(screen.getByText('Send mig resultaterne'))
    expect(submitSurvey).toHaveBeenCalledWith(
      expect.objectContaining({ track: 'zenegy', email: 'a@b.dk' }),
    )
  })
})
