import { useRef, useEffect } from 'react'
import type { Question, SurveyAnswers, RankEntry } from '../types'
import { BRAND_SCENE, type Scene } from '../lib/scenes'
import { ChoiceList } from './inputs/ChoiceList'
import { ChoiceTiles } from './inputs/ChoiceTiles'
import { LogoGrid } from './inputs/LogoGrid'
import { TileSelect } from './inputs/TileSelect'
import { EmojiRating } from './inputs/EmojiRating'
import { PriorityRank } from './inputs/PriorityRank'
import { NPSScale } from './inputs/NPSScale'
import { OpenText } from './inputs/OpenText'

interface Props {
  question: Question
  answers: SurveyAnswers
  onAnswer: (id: string, value: unknown) => void
  onAdvance: () => void
  eyebrow?: string
  scene?: Scene
}

function getAnswer(answers: SurveyAnswers, id: string): unknown {
  const map: Record<string, unknown> = {
    gate: answers.is_employee !== undefined ? (answers.is_employee ? 'employee' : 'decision-maker') : undefined,
    q0: answers.track,
    size: answers.size,
    b1: answers.b_payroll_system,
    b2: answers.b_frustrations ?? [],
    b3: answers.b_priorities ?? [],
    b4: answers.b_barriers ?? [],
    b5: answers.b_switch_intent,
    a1: answers.a_products ?? [],
    a1_migration: answers.a_migration_from,
    a2: answers.a_satisfaction,
    a3: answers.a_best_thing,
    a4: answers.a_nps,
    numbers: answers.accounting_system,
    e1: answers.e_payslip,
    e2: answers.e_pain_points ?? [],
    e3: answers.e_expenses,
    e4: answers.e_ai_trust,
    ai: answers.ai_interest,
  }
  return map[id] ?? (id.endsWith('_text') ? '' : '')
}

/** Free-text companion field for a question: its current value and the answer key it writes to. */
function openTextFor(id: string, answers: SurveyAnswers): { value: string; key: string } | null {
  switch (id) {
    case 'a2': return { value: answers.a_satisfaction_text ?? '', key: 'a2_text' }
    case 'a3': return { value: answers.a_best_thing_text ?? '', key: 'a3_text' }
    case 'a4': return { value: answers.a_improve_text ?? '', key: 'a4_text' }
    default: return null
  }
}

export function QuestionRenderer({
  question,
  answers,
  onAnswer,
  onAdvance,
  eyebrow,
  scene = BRAND_SCENE,
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
      // Don't auto-advance logo-grid when "andet" is chosen — user needs to type their answer first.
      if (question.type === 'logo-grid' && single === 'andet') {
        if (autoAdvanceTimer.current) clearTimeout(autoAdvanceTimer.current)
        return
      }
      if (autoAdvanceTimer.current) clearTimeout(autoAdvanceTimer.current)
      autoAdvanceTimer.current = setTimeout(() => onAdvanceRef.current(), 300)
    }
  }

  const otherText = openTextFor(question.id, answers)

  const renderInput = () => {
    switch (question.type) {
      case 'choice-single':
        return <ChoiceList options={question.options ?? []} value={answer as string} onChange={handleSingleSelect} scene={scene} />
      case 'choice-multi':
        return <ChoiceList options={question.options ?? []} value={answer as string[]} onChange={v => onAnswer(question.id, v)} multi scene={scene} />
      case 'choice-tiles':
        return <ChoiceTiles options={question.options ?? []} value={answer as string} onChange={handleSingleSelect} scene={scene} />
      case 'logo-grid':
        return (
          <LogoGrid
            options={question.options ?? []}
            value={answer as string}
            onChange={handleSingleSelect}
            scene={scene}
            otherValue={question.id === 'b1' ? (answers.b_payroll_other ?? '') : (answers.accounting_other ?? '')}
            onOtherChange={v => onAnswer(question.id === 'b1' ? 'b_payroll_other' : 'accounting_other', v)}
          />
        )
      case 'tile-select':
        return (
          <TileSelect
            options={question.options ?? []}
            value={answer as string[]}
            onChange={v => onAnswer(question.id, v)}
            otherTrigger="other"
            otherValue={question.id === 'b2' ? (answers.b_frustration_other ?? '') : (answers.b_barrier_other ?? '')}
            onOtherChange={v => onAnswer(question.id === 'b2' ? 'b2_other' : 'b4_other', v)}
            otherPlaceholder={question.openTextPlaceholder}
            scene={scene}
          />
        )
      case 'emoji-rating':
        return <EmojiRating options={question.options ?? []} value={answer as string} onChange={handleSingleSelect} scene={scene} />
      case 'priority-rank':
        return <PriorityRank options={question.options ?? []} value={answer as RankEntry[]} onChange={v => onAnswer(question.id, v)} maxRank={question.maxRank} scene={scene} />
      case 'nps-scale':
        return (
          <div>
            <NPSScale value={answers.a_nps ?? null} onChange={v => onAnswer(question.id, v)} scene={scene} />
            {question.hasOpenText && otherText && (
              <OpenText
                value={otherText.value}
                onChange={v => onAnswer(otherText.key, v)}
                label={question.openTextLabel}
                placeholder={question.openTextPlaceholder}
                maxLength={question.openTextMaxLength}
                scene={scene}
              />
            )}
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div style={{ width: '100%' }}>
      {eyebrow && (
        <div style={{ fontSize: 13, fontWeight: 500, color: '#b3a4e8', marginBottom: 14 }}>{eyebrow}</div>
      )}
      <h2 style={{ fontSize: 'clamp(22px, 5.5vw, 28px)', fontWeight: 500, lineHeight: 1.18, letterSpacing: '-0.025em', color: scene.ink, marginBottom: question.subText ? 10 : 28 }}>
        {question.question}
      </h2>
      {question.subText && (
        <p style={{ fontSize: 15, color: scene.inkMuted, lineHeight: 1.55, marginBottom: 28 }}>
          {question.subText}
        </p>
      )}

      {renderInput()}

      {/* Always-visible comment for choice-single (a3). */}
      {question.type === 'choice-single' && question.hasOpenText && otherText && (
        <OpenText
          value={otherText.value}
          onChange={v => onAnswer(otherText.key, v)}
          label={question.openTextLabel}
          placeholder={question.openTextPlaceholder}
          maxLength={question.openTextMaxLength}
          scene={scene}
        />
      )}

      {/* Comment that reveals once a satisfaction face is picked (a2). */}
      {question.type === 'emoji-rating' && question.hasOpenText && otherText && Boolean(answer) && (
        <OpenText
          value={otherText.value}
          onChange={v => onAnswer(otherText.key, v)}
          label={question.openTextLabel}
          placeholder={question.openTextPlaceholder}
          maxLength={question.openTextMaxLength}
          scene={scene}
        />
      )}
    </div>
  )
}
