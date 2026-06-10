import { describe, it, expect } from 'vitest'
import { getQuestionSequence, OPENING_QUESTION, GATE_QUESTION } from './questions'

describe('getQuestionSequence', () => {
  it('returns only gate question when no answers', () => {
    const seq = getQuestionSequence({})
    expect(seq).toHaveLength(1)
    expect(seq[0].id).toBe('gate')
  })

  it('returns gate + opening + size when is_employee is false (decision-maker, no track yet)', () => {
    const seq = getQuestionSequence({ is_employee: false })
    expect(seq).toHaveLength(3)
    expect(seq.map(q => q.id)).toEqual(['gate', 'q0', 'size'])
  })

  it('returns employee track when is_employee is true', () => {
    const seq = getQuestionSequence({ is_employee: true })
    expect(seq.map(q => q.id)).toEqual(['gate', 'e1', 'e2', 'e3', 'e4'])
  })

  it('returns 10 questions for non-zenegy track (gate, q0, size, b1-b5, ai, numbers)', () => {
    const seq = getQuestionSequence({ is_employee: false, track: 'non-zenegy' })
    expect(seq).toHaveLength(10)
    expect(seq.map(q => q.id)).toEqual(['gate', 'q0', 'size', 'b1', 'b2', 'b3', 'b4', 'b5', 'ai', 'numbers'])
  })

  it('includes numbers awareness for zenegy track without Numbers product', () => {
    const seq = getQuestionSequence({ is_employee: false, track: 'zenegy', a_products: ['payroll'] })
    expect(seq.map(q => q.id)).toEqual(['gate', 'q0', 'size', 'a1', 'a1_migration', 'a2', 'a3', 'a4', 'ai', 'numbers'])
  })

  it('includes numbers awareness for zenegy track when a_products is undefined', () => {
    const seq = getQuestionSequence({ is_employee: false, track: 'zenegy' })
    expect(seq.map(q => q.id)).toEqual(['gate', 'q0', 'size', 'a1', 'a1_migration', 'a2', 'a3', 'a4', 'ai', 'numbers'])
  })

  it('skips numbers awareness for zenegy track when Numbers product is used', () => {
    const seq = getQuestionSequence({ is_employee: false, track: 'zenegy', a_products: ['payroll', 'numbers'] })
    expect(seq).toHaveLength(9)
    expect(seq.map(q => q.id)).toEqual(['gate', 'q0', 'size', 'a1', 'a1_migration', 'a2', 'a3', 'a4', 'ai'])
  })

  it('gate question has autoAdvance true', () => {
    expect(GATE_QUESTION.autoAdvance).toBe(true)
  })

  it('opening question has autoAdvance true', () => {
    expect(OPENING_QUESTION.autoAdvance).toBe(true)
  })
})
