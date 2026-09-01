import { describe, it, expect } from 'vitest'
import { getQuestionSequence, OPENING_QUESTION, GATE_QUESTION, CONTEXT_QUESTION, isBureau } from './questions'

describe('getQuestionSequence', () => {
  it('returns only gate question when no answers', () => {
    const seq = getQuestionSequence({})
    expect(seq).toHaveLength(1)
    expect(seq[0].id).toBe('gate')
  })

  it('asks the context question next when the gate is answered as decision-maker', () => {
    const seq = getQuestionSequence({ is_employee: false })
    expect(seq.map(q => q.id)).toEqual(['gate', 'context'])
  })

  it('returns gate + context + opening + size for an internal decision-maker with no track yet', () => {
    const seq = getQuestionSequence({ is_employee: false, payroll_context: 'internal' })
    expect(seq.map(q => q.id)).toEqual(['gate', 'context', 'q0', 'size'])
  })

  it('returns employee track when is_employee is true', () => {
    const seq = getQuestionSequence({ is_employee: true })
    expect(seq.map(q => q.id)).toEqual(['gate', 'e1', 'e2', 'e3', 'e4'])
  })

  it('returns 11 questions for non-zenegy track (gate, context, q0, size, b1-b5, ai, numbers)', () => {
    const seq = getQuestionSequence({ is_employee: false, payroll_context: 'internal', track: 'non-zenegy' })
    expect(seq).toHaveLength(11)
    expect(seq.map(q => q.id)).toEqual(['gate', 'context', 'q0', 'size', 'b1', 'b2', 'b3', 'b4', 'b5', 'ai', 'numbers'])
  })

  it('includes numbers awareness for zenegy track without Numbers product', () => {
    const seq = getQuestionSequence({ is_employee: false, payroll_context: 'internal', track: 'zenegy', a_products: ['payroll'] })
    expect(seq.map(q => q.id)).toEqual(['gate', 'context', 'q0', 'size', 'a1', 'a1_migration', 'a2', 'a3', 'a4', 'ai', 'numbers'])
  })

  it('includes numbers awareness for zenegy track when a_products is undefined', () => {
    const seq = getQuestionSequence({ is_employee: false, payroll_context: 'internal', track: 'zenegy' })
    expect(seq.map(q => q.id)).toEqual(['gate', 'context', 'q0', 'size', 'a1', 'a1_migration', 'a2', 'a3', 'a4', 'ai', 'numbers'])
  })

  it('skips numbers awareness for zenegy track when Numbers product is used', () => {
    const seq = getQuestionSequence({ is_employee: false, payroll_context: 'internal', track: 'zenegy', a_products: ['payroll', 'numbers'] })
    expect(seq).toHaveLength(10)
    expect(seq.map(q => q.id)).toEqual(['gate', 'context', 'q0', 'size', 'a1', 'a1_migration', 'a2', 'a3', 'a4', 'ai'])
  })

  it('routes bureaus into track C and asks about switching when Zenegy is not in their stack', () => {
    const seq = getQuestionSequence({ is_employee: false, payroll_context: 'bureau', c_payroll_systems: ['dataloen', 'lessor'] })
    expect(seq.map(q => q.id)).toEqual(['gate', 'context', 'c1', 'c2', 'c3', 'c4', 'c5', 'c6', 'c7', 'ai', 'numbers'])
  })

  it('asks bureaus who already work in Zenegy for satisfaction and NPS instead of switch intent', () => {
    const seq = getQuestionSequence({ is_employee: false, payroll_context: 'bureau', c_payroll_systems: ['dataloen', 'zenegy'] })
    expect(seq.map(q => q.id)).toEqual(['gate', 'context', 'c1', 'c2', 'c3', 'c4', 'c5', 'c6', 'a2', 'a4', 'ai', 'numbers'])
  })

  it('treats "both" (own company + clients) as a bureau', () => {
    const seq = getQuestionSequence({ is_employee: false, payroll_context: 'both' })
    expect(seq.map(q => q.id)).toEqual(['gate', 'context', 'c1', 'c2', 'c3', 'c4', 'c5', 'c6', 'c7', 'ai', 'numbers'])
  })

  it('never asks a bureau the single-company track questions', () => {
    const seq = getQuestionSequence({ is_employee: false, payroll_context: 'bureau', track: 'non-zenegy' })
    expect(seq.map(q => q.id)).not.toContain('q0')
    expect(seq.map(q => q.id)).not.toContain('size')
    expect(seq.map(q => q.id)).not.toContain('b1')
  })

  it('bureau AI question uses bureau-specific option values', () => {
    const seq = getQuestionSequence({ is_employee: false, payroll_context: 'bureau' })
    const ai = seq.find(q => q.id === 'ai')!
    expect(ai.options?.every(o => o.value.startsWith('bureau-'))).toBe(true)
  })

  it('employees never see the context question', () => {
    const seq = getQuestionSequence({ is_employee: true })
    expect(seq.map(q => q.id)).not.toContain('context')
  })

  it('context question has autoAdvance true', () => {
    expect(CONTEXT_QUESTION.autoAdvance).toBe(true)
  })

  it('isBureau covers bureau and both, but not internal', () => {
    expect(isBureau('bureau')).toBe(true)
    expect(isBureau('both')).toBe(true)
    expect(isBureau('internal')).toBe(false)
    expect(isBureau(undefined)).toBe(false)
  })

  it('gate question has autoAdvance true', () => {
    expect(GATE_QUESTION.autoAdvance).toBe(true)
  })

  it('opening question has autoAdvance true', () => {
    expect(OPENING_QUESTION.autoAdvance).toBe(true)
  })
})
