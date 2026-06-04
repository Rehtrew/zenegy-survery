import { describe, it, expect } from 'vitest'
import { getQuestionSequence, OPENING_QUESTION } from './questions'
import type { SurveyAnswers } from '../types'

describe('getQuestionSequence', () => {
  it('returns only opening question when track is undefined', () => {
    const seq = getQuestionSequence({})
    expect(seq).toHaveLength(1)
    expect(seq[0].id).toBe('q0')
  })

  it('returns 6 questions for non-zenegy track', () => {
    const seq = getQuestionSequence({ track: 'non-zenegy' })
    expect(seq).toHaveLength(6)
    expect(seq.map(q => q.id)).toEqual(['q0', 'b1', 'b2', 'b3', 'b4', 'numbers'])
  })

  it('includes numbers awareness for zenegy track without Numbers product', () => {
    const seq = getQuestionSequence({ track: 'zenegy', a_products: ['payroll'] })
    expect(seq).toHaveLength(6)
    expect(seq[seq.length - 1].id).toBe('numbers')
  })

  it('skips numbers awareness for zenegy track when Numbers product is used', () => {
    const seq = getQuestionSequence({ track: 'zenegy', a_products: ['payroll', 'numbers'] })
    expect(seq).toHaveLength(5)
    expect(seq.map(q => q.id)).toEqual(['q0', 'a1', 'a2', 'a3', 'a4'])
  })

  it('opening question has autoAdvance true', () => {
    expect(OPENING_QUESTION.autoAdvance).toBe(true)
  })
})
