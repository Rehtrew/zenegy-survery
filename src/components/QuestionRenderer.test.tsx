import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { QuestionRenderer } from './QuestionRenderer'
import type { Question, SurveyAnswers } from '../types'

const baseProps = {
  answers: {} as SurveyAnswers,
  onAnswer: vi.fn(),
  onAdvance: vi.fn(),
}

describe('QuestionRenderer', () => {
  it('renders the question text', () => {
    const q: Question = {
      id: 'q0', type: 'choice-single',
      question: 'Test question?', subText: 'Some subtext',
      options: [{ value: 'a', label: 'Option A' }],
    }
    render(<QuestionRenderer question={q} {...baseProps} />)
    expect(screen.getByText('Test question?')).toBeInTheDocument()
    expect(screen.getByText('Some subtext')).toBeInTheDocument()
  })

  it('renders choice-single as ChoiceList', () => {
    const q: Question = {
      id: 'q0', type: 'choice-single',
      question: 'Q', options: [{ value: 'a', label: 'Option A' }],
    }
    render(<QuestionRenderer question={q} {...baseProps} />)
    expect(screen.getByText('Option A')).toBeInTheDocument()
  })

  it('renders tile-select as TileSelect', () => {
    const q: Question = {
      id: 'b2', type: 'tile-select',
      question: 'Frustrations?',
      options: [{ value: 'price', label: 'Price', iconName: 'tag' }],
    }
    render(<QuestionRenderer question={q} {...baseProps} />)
    expect(screen.getByText('Price')).toBeInTheDocument()
  })

  it('renders choice-tiles as ChoiceTiles', () => {
    const q: Question = {
      id: 'q0', type: 'choice-tiles',
      question: 'Use Zenegy?',
      options: [{ value: 'zenegy', label: 'Ja', iconName: 'zenegy' }],
    }
    render(<QuestionRenderer question={q} {...baseProps} />)
    expect(screen.getByText('Ja')).toBeInTheDocument()
  })

  it('reveals the satisfaction comment only after a face is picked', () => {
    const q: Question = {
      id: 'a2', type: 'emoji-rating',
      question: 'Satisfaction?',
      hasOpenText: true,
      openTextLabel: 'Vil du uddybe? (valgfrit)',
      options: [{ value: 'happy', label: 'Tilfreds' }],
    }
    const { rerender } = render(<QuestionRenderer question={q} {...baseProps} />)
    expect(screen.queryByText('Vil du uddybe? (valgfrit)')).not.toBeInTheDocument()
    rerender(<QuestionRenderer question={q} {...baseProps} answers={{ a_satisfaction: 'happy' }} />)
    expect(screen.getByText('Vil du uddybe? (valgfrit)')).toBeInTheDocument()
  })

  it('renders emoji-rating as EmojiRating', () => {
    const q: Question = {
      id: 'a2', type: 'emoji-rating',
      question: 'Satisfaction?',
      options: [{ value: 'happy', label: 'Tilfreds' }],
    }
    render(<QuestionRenderer question={q} {...baseProps} />)
    expect(screen.getByText('Tilfreds')).toBeInTheDocument()
  })

  it('renders priority-rank as PriorityRank', () => {
    const q: Question = {
      id: 'b3', type: 'priority-rank',
      question: 'Priorities?',
      options: [{ value: 'price', label: '💰 Pris' }],
      maxRank: 3,
    }
    render(<QuestionRenderer question={q} {...baseProps} />)
    expect(screen.getByText('💰 Pris')).toBeInTheDocument()
  })

  it('renders nps-scale as NPSScale', () => {
    const q: Question = {
      id: 'a4', type: 'nps-scale',
      question: 'NPS?',
    }
    render(<QuestionRenderer question={q} {...baseProps} />)
    expect(screen.getByText('10')).toBeInTheDocument()
  })

  // Tilbage/Næste navigation moved out of QuestionRenderer into SurveyShell's
  // bottom bar, so the card itself no longer renders nav buttons.

  it('calls onAdvance after 300ms on auto-advance single-select', async () => {
    vi.useFakeTimers()
    const onAdvance = vi.fn()
    const onAnswer = vi.fn()
    const q: Question = {
      id: 'q0', type: 'choice-single',
      question: 'Q?', autoAdvance: true,
      options: [{ value: 'a', label: 'Option A' }],
    }
    render(<QuestionRenderer question={q} answers={{}} onAnswer={onAnswer} onAdvance={onAdvance} />)
    fireEvent.click(screen.getByText('Option A'))
    expect(onAdvance).not.toHaveBeenCalled() // not yet
    vi.advanceTimersByTime(300)
    expect(onAdvance).toHaveBeenCalledOnce()
    vi.useRealTimers()
  })
})
