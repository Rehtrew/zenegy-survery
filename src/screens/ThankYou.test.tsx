import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ThankYou } from './ThankYou'
import type { SurveyAnswers, SubmissionMeta } from '../types'

vi.mock('../lib/supabase', () => ({
  submitSurvey: vi.fn().mockResolvedValue(undefined),
  signupForReport: vi.fn().mockResolvedValue(undefined),
}))
import { submitSurvey, signupForReport } from '../lib/supabase'

// A meta that passes all soft guards: started a minute ago, honeypot empty.
const cleanMeta = (over: Partial<SubmissionMeta> = {}): SubmissionMeta => ({
  startedAt: Date.now() - 60_000,
  honeypot: '',
  ...over,
})

const renderThankYou = (answers: SurveyAnswers, meta: SubmissionMeta = cleanMeta()) =>
  render(<ThankYou answers={answers} meta={meta} />)

describe('ThankYou (merged completion page)', () => {
  beforeEach(() => {
    vi.mocked(submitSurvey).mockClear()
    vi.mocked(signupForReport).mockClear()
    localStorage.clear()
  })

  it('saves answers on arrival — employees get track "employee" (they have no payroll track)', async () => {
    renderThankYou({ is_employee: true, e_payslip: 'app' })
    await waitFor(() => expect(submitSurvey).toHaveBeenCalledWith(
      expect.objectContaining({ track: 'employee', e_payslip: 'app', email: '' }),
    ))
    expect(await screen.findByText('Dine svar er registreret')).toBeInTheDocument()
  })

  it('saves answers on arrival — decision-makers keep their chosen track', async () => {
    renderThankYou({ track: 'zenegy' })
    await waitFor(() => expect(submitSurvey).toHaveBeenCalledWith(
      expect.objectContaining({ track: 'zenegy', email: '' }),
    ))
  })

  it('saves answers exactly once even with StrictMode-style double effects', async () => {
    renderThankYou({ track: 'zenegy' })
    await waitFor(() => expect(submitSurvey).toHaveBeenCalled())
    expect(submitSurvey).toHaveBeenCalledTimes(1)
  })

  it('email opt-in goes to the separate report signup, not the submission', async () => {
    renderThankYou({ track: 'zenegy' })
    await userEvent.type(screen.getByPlaceholderText('din@email.dk'), 'a@b.dk')
    await userEvent.click(screen.getByText('Send mig rapporten, når den er klar'))
    await waitFor(() => expect(signupForReport).toHaveBeenCalledWith('a@b.dk', false))
    expect(await screen.findByText('Du er på listen')).toBeInTheDocument()
  })

  it('passes the newsletter opt-in along with the email', async () => {
    renderThankYou({ track: 'non-zenegy' })
    await userEvent.type(screen.getByPlaceholderText('din@email.dk'), 'a@b.dk')
    await userEvent.click(screen.getByRole('checkbox'))
    await userEvent.click(screen.getByText('Send mig rapporten, når den er klar'))
    await waitFor(() => expect(signupForReport).toHaveBeenCalledWith('a@b.dk', true))
  })

  it('shows a retry chip when saving fails', async () => {
    vi.mocked(submitSurvey).mockRejectedValueOnce(new Error('boom'))
    renderThankYou({ track: 'zenegy' })
    expect(await screen.findByText('Dine svar blev ikke gemt')).toBeInTheDocument()
    await userEvent.click(screen.getByText('Prøv igen'))
    expect(await screen.findByText('Dine svar er registreret')).toBeInTheDocument()
    expect(submitSurvey).toHaveBeenCalledTimes(2)
  })

  describe('soft anti-spam guards', () => {
    it('drops the submission (but shows success) when the honeypot is filled', async () => {
      renderThankYou({ track: 'zenegy' }, cleanMeta({ honeypot: 'http://spam.example' }))
      expect(await screen.findByText('Dine svar er registreret')).toBeInTheDocument()
      expect(submitSurvey).not.toHaveBeenCalled()
    })

    it('drops the submission when completed implausibly fast', async () => {
      renderThankYou({ track: 'zenegy' }, cleanMeta({ startedAt: Date.now() - 1_000 }))
      expect(await screen.findByText('Dine svar er registreret')).toBeInTheDocument()
      expect(submitSurvey).not.toHaveBeenCalled()
    })

    it('still saves a normally-paced submission', async () => {
      renderThankYou({ track: 'zenegy' }, cleanMeta({ startedAt: Date.now() - 30_000 }))
      await waitFor(() => expect(submitSurvey).toHaveBeenCalledTimes(1))
    })

    it('skips the insert if this browser already completed the survey', async () => {
      localStorage.setItem('zenegy_survey_completed', new Date().toISOString())
      renderThankYou({ track: 'zenegy' })
      expect(await screen.findByText('Dine svar er registreret')).toBeInTheDocument()
      expect(submitSurvey).not.toHaveBeenCalled()
    })

    it('records completion so a later run from the same browser is de-duped', async () => {
      renderThankYou({ track: 'zenegy' })
      await waitFor(() => expect(submitSurvey).toHaveBeenCalledTimes(1))
      expect(localStorage.getItem('zenegy_survey_completed')).toBeTruthy()
    })
  })
})
