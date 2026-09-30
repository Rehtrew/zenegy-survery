import { describe, it, expect } from 'vitest'
import { getStepGroups } from './SurveyFlow'
import { getQuestionSequence } from '../lib/questions'
import type { SurveyAnswers } from '../types'

describe('getStepGroups', () => {
  // Every route through the survey, as in the pruneToPath tests.
  const routes: [string, SurveyAnswers][] = [
    ['employee', { is_employee: true }],
    ['zenegy company', { is_employee: false, payroll_context: 'internal', track: 'zenegy', a_products: ['payroll'] }],
    ['other-system company', { is_employee: false, payroll_context: 'internal', track: 'non-zenegy' }],
    ['bureau on Zenegy', { is_employee: false, payroll_context: 'bureau', c_payroll_systems: ['zenegy'] }],
    ['bureau without Zenegy', { is_employee: false, payroll_context: 'both', c_payroll_systems: ['danloen'] }],
  ]

  // A question missing from the steps shows the first step and resets the
  // progress bar; adding e5 without a step did exactly that.
  it.each(routes)('places every question of the %s route in a step', (_name, answers) => {
    const inSteps = new Set(getStepGroups(answers).flatMap(g => g.questionIds))
    const missing = getQuestionSequence(answers).map(q => q.id).filter(id => !inSteps.has(id))
    expect(missing).toEqual([])
  })

  it('ends the employee route on its own step for the employer question', () => {
    const groups = getStepGroups({ is_employee: true })
    expect(groups[groups.length - 1]).toEqual({ label: 'Din arbejdsgiver', questionIds: ['e5'] })
  })
})
