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

  useEffect(() => () => {
    if (autoAdvanceTimer.current) clearTimeout(autoAdvanceTimer.current)
  }, [])

  const handleSingleSelect = (value: string) => {
    onAnswer(question.id, value)
    if (question.autoAdvance) {
      autoAdvanceTimer.current = setTimeout(onAdvance, 300)
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
              onAnswer(question.id === 'b1' ? 'b1_other' : 'numbers_other', v)
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
      {question.subText && (
        <div className="mb-1 text-xs font-bold tracking-widest uppercase text-primary">✦ Spørgsmål</div>
      )}
      <h2 className="text-[23px] font-extrabold leading-snug text-text-main mb-1.5">
        {question.question}
      </h2>
      {question.subText && (
        <p className="text-sm text-text-muted mb-7 leading-relaxed">{question.subText}</p>
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
              className="px-5 py-3 rounded-xl bg-gray-100 text-gray-600 text-sm font-semibold hover:bg-gray-200 transition-colors"
            >
              ← Tilbage
            </button>
          ) : <div />}
          <button
            type="button"
            onClick={onAdvance}
            disabled={!hasAnswer(answer)}
            className="px-7 py-3 rounded-xl bg-primary text-white text-sm font-bold hover:bg-primary-dark transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Næste →
          </button>
        </div>
      )}
    </div>
  )
}
