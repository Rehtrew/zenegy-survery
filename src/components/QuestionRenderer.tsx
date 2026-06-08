import { useRef, useEffect } from 'react'
import type { Question, SurveyAnswers, RankEntry } from '../types'
import { ChoiceList } from './inputs/ChoiceList'
import { LogoGrid } from './inputs/LogoGrid'
import { PillSelect } from './inputs/PillSelect'
import { EmojiRating } from './inputs/EmojiRating'
import { PriorityRank } from './inputs/PriorityRank'
import { NPSScale } from './inputs/NPSScale'
import { OpenText } from './inputs/OpenText'

interface Props {
  question: Question
  answers: SurveyAnswers
  onAnswer: (id: string, value: unknown) => void
  onAdvance: () => void
  onBack?: () => void
  isFirst?: boolean
}

function getAnswer(answers: SurveyAnswers, id: string): unknown {
  const map: Record<string, unknown> = {
    q0: answers.track,
    b1: answers.b_payroll_system,
    b2: answers.b_frustrations ?? [],
    b3: answers.b_priorities ?? [],
    b4: answers.b_barriers ?? [],
    a1: answers.a_products ?? [],
    a2: answers.a_satisfaction,
    a3: answers.a_best_thing,
    a4: answers.a_nps,
    numbers: answers.accounting_system,
  }
  return map[id] ?? (id.endsWith('_text') ? '' : '')
}

function hasAnswer(answer: unknown): boolean {
  if (answer === null || answer === undefined || answer === '') return false
  if (Array.isArray(answer)) return answer.length > 0
  return true
}

export function QuestionRenderer({
  question,
  answers,
  onAnswer,
  onAdvance,
  onBack,
  isFirst = false,
}: Props) {
  const answer = getAnswer(answers, question.id)
  const autoAdvanceTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const onAdvanceRef = useRef(onAdvance)
  useEffect(() => { onAdvanceRef.current = onAdvance }, [onAdvance])

  useEffect(() => () => {
    if (autoAdvanceTimer.current) clearTimeout(autoAdvanceTimer.current)
  }, [])

  const handleSingleSelect = (value: string | string[]) => {
    const single = Array.isArray(value) ? value[0] : value
    onAnswer(question.id, single)
    if (question.autoAdvance) {
      if (autoAdvanceTimer.current) clearTimeout(autoAdvanceTimer.current)
      autoAdvanceTimer.current = setTimeout(() => onAdvanceRef.current(), 300)
    }
  }

  const renderInput = () => {
    switch (question.type) {
      case 'choice-single':
        return (
          <ChoiceList
            options={question.options ?? []}
            value={answer as string}
            onChange={handleSingleSelect}
          />
        )
      case 'choice-multi':
        return (
          <ChoiceList
            options={question.options ?? []}
            value={answer as string[]}
            onChange={v => onAnswer(question.id, v)}
            multi
          />
        )
      case 'logo-grid':
        return (
          <LogoGrid
            options={question.options ?? []}
            value={answer as string}
            onChange={handleSingleSelect}
            otherValue={
              question.id === 'b1' ? (answers.b_payroll_other ?? '') : (answers.accounting_other ?? '')
            }
            onOtherChange={v =>
              onAnswer(question.id === 'b1' ? 'b_payroll_other' : 'accounting_other', v)
            }
          />
        )
      case 'pill-select':
        return (
          <PillSelect
            options={question.options ?? []}
            value={answer as string[]}
            onChange={v => onAnswer(question.id, v)}
          />
        )
      case 'emoji-rating':
        return (
          <EmojiRating
            options={question.options ?? []}
            value={answer as string}
            onChange={handleSingleSelect}
          />
        )
      case 'priority-rank':
        return (
          <PriorityRank
            options={question.options ?? []}
            value={answer as RankEntry[]}
            onChange={v => onAnswer(question.id, v)}
            maxRank={question.maxRank}
          />
        )
      case 'nps-scale':
        return (
          <div>
            <NPSScale
              value={answer as number | null}
              onChange={v => onAnswer(question.id, v)}
            />
            {question.hasOpenText && (
              <OpenText
                value={question.id === 'a4' ? (answers.a_improve_text ?? '') : ''}
                onChange={v => onAnswer(`${question.id}_text`, v)}
                label={question.openTextLabel}
                placeholder={question.openTextPlaceholder}
                maxLength={question.openTextMaxLength}
              />
            )}
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="w-full max-w-[640px] mx-auto">
      <h2
        className="leading-snug mb-1.5"
        style={{
          fontSize: 23,
          fontWeight: 500,
          color: 'var(--color-text-primary)',
        }}
      >
        {question.question}
      </h2>
      {question.subText && (
        <p
          className="mb-7 leading-relaxed"
          style={{
            fontSize: 14,
            color: 'var(--color-text-secondary)',
          }}
        >
          {question.subText}
        </p>
      )}

      {renderInput()}

      {question.type === 'choice-single' && question.hasOpenText && (
        <OpenText
          value={answers.a_best_thing_text ?? ''}
          onChange={v => onAnswer('a3_text', v)}
          label={question.openTextLabel}
          placeholder={question.openTextPlaceholder}
          maxLength={question.openTextMaxLength}
        />
      )}

      {!question.autoAdvance && (
        <div className="flex justify-between mt-8">
          {!isFirst && onBack ? (
            <button
              type="button"
              onClick={onBack}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                padding: '12px 20px',
                borderRadius: 8,
                border: 'none',
                background: 'var(--color-surface-subtle)',
                color: 'var(--color-text-secondary)',
                fontSize: 14,
                fontWeight: 500,
                cursor: 'pointer',
                fontFamily: 'var(--font-sans)',
              }}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Tilbage
            </button>
          ) : <div />}
          <button
            type="button"
            onClick={onAdvance}
            disabled={!hasAnswer(answer)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              padding: '12px 24px',
              borderRadius: 8,
              border: 'none',
              background: '#6e30fd',
              color: 'white',
              fontSize: 14,
              fontWeight: 500,
              cursor: hasAnswer(answer) ? 'pointer' : 'not-allowed',
              opacity: hasAnswer(answer) ? 1 : 0.4,
              fontFamily: 'var(--font-sans)',
              transition: 'opacity 0.15s ease',
            }}
          >
            Næste
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M6 4L10 8L6 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      )}
    </div>
  )
}
