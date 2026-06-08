import { useState, useCallback } from 'react'
import type { Phase, Direction, SurveyAnswers } from '../types'
import { getQuestionSequence } from '../lib/questions'
import { useKeyboard } from '../lib/useKeyboard'
import { SurveyShell } from '../components/SurveyShell'
import { QuestionRenderer } from '../components/QuestionRenderer'

// These are imported lazily to avoid circular dependencies at compile time
// They will be provided by App.tsx in the actual render tree
interface SurveyFlowProps {
  renderLanding: (onStart: () => void) => React.ReactNode
  renderLeadGen: (answers: SurveyAnswers, onSubmitted: () => void) => React.ReactNode
  renderThankYou: () => React.ReactNode
}

function getStepGroups(answers: SurveyAnswers): Array<{ label: string; questionIds: string[] }> {
  if (answers.is_employee) {
    return [
      { label: 'Om dig', questionIds: ['gate'] },
      { label: 'Din lønseddel', questionIds: ['e1', 'e2'] },
      { label: 'Udgifter & AI', questionIds: ['e3', 'e4'] },
      { label: 'Deltag', questionIds: [] },
    ]
  }
  const base = [
    { label: 'Om dig', questionIds: ['gate', 'q0', 'role'] },
  ]
  if (answers.track === 'zenegy') {
    return [
      ...base,
      { label: 'Zenegy hos dig', questionIds: ['a1'] },
      { label: 'Din oplevelse', questionIds: ['a2', 'a3', 'a4'] },
      { label: 'AI & fremtid', questionIds: ['ai'] },
      { label: 'Regnskab', questionIds: ['numbers'] },
      { label: 'Deltag', questionIds: [] },
    ]
  }
  return [
    ...base,
    { label: 'Dit lønsystem', questionIds: ['b1'] },
    { label: 'Din oplevelse', questionIds: ['b2', 'b3', 'b4'] },
    { label: 'AI & fremtid', questionIds: ['ai'] },
    { label: 'Regnskab', questionIds: ['numbers'] },
    { label: 'Deltag', questionIds: [] },
  ]
}

export function SurveyFlow({ renderLanding, renderLeadGen, renderThankYou }: SurveyFlowProps) {
  const [phase, setPhase] = useState<Phase>('landing')
  const [questionIndex, setQuestionIndex] = useState(0)
  const [direction, setDirection] = useState<Direction>('forward')
  const [animKey, setAnimKey] = useState(0)
  const [answers, setAnswers] = useState<SurveyAnswers>({})

  const questions = getQuestionSequence({
    track: answers.track,
    a_products: answers.a_products,
    is_employee: answers.is_employee,
  })

  const currentQuestion = questions[questionIndex]

  const handleAnswer = useCallback((id: string, value: unknown) => {
    if (id === 'gate') {
      setAnswers(prev => ({ ...prev, is_employee: value === 'employee' }))
      return
    }
    setAnswers(prev => {
      const keyMap: Record<string, keyof SurveyAnswers> = {
        q0: 'track',
        role: 'role',
        b1: 'b_payroll_system',
        b_payroll_other: 'b_payroll_other',
        b2: 'b_frustrations',
        b3: 'b_priorities',
        b4: 'b_barriers',
        a1: 'a_products',
        a2: 'a_satisfaction',
        a3: 'a_best_thing',
        a3_text: 'a_best_thing_text',
        a4: 'a_nps',
        a4_text: 'a_improve_text',
        numbers: 'accounting_system',
        accounting_other: 'accounting_other',
        e1: 'e_payslip',
        e2: 'e_payroll_satisfaction',
        e3: 'e_expenses',
        e4: 'e_ai_trust',
        ai: 'ai_interest',
      }
      const key = keyMap[id]
      if (!key) return prev
      return { ...prev, [key]: value }
    })
  }, [])

  const advance = useCallback(() => {
    if (phase === 'landing') {
      setPhase('questions')
      setAnimKey(k => k + 1)
      return
    }
    if (phase !== 'questions' || !currentQuestion) return

    // Block keyboard Enter from advancing without a selection on non-auto-advance questions
    if (!currentQuestion.autoAdvance) {
      const answerLookup: Record<string, unknown> = {
        gate: answers.is_employee !== undefined ? 'answered' : undefined,
        q0: answers.track,
        role: answers.role,
        b1: answers.b_payroll_system,
        b2: answers.b_frustrations,
        b3: answers.b_priorities,
        b4: answers.b_barriers,
        a1: answers.a_products,
        a2: answers.a_satisfaction,
        a3: answers.a_best_thing,
        a4: answers.a_nps,
        numbers: answers.accounting_system,
        e1: answers.e_payslip,
        e2: answers.e_payroll_satisfaction,
        e3: answers.e_expenses,
        e4: answers.e_ai_trust,
        ai: answers.ai_interest,
      }
      const ans = answerLookup[currentQuestion.id]
      const answered = ans !== null && ans !== undefined && ans !== '' &&
        !(Array.isArray(ans) && (ans as unknown[]).length === 0)
      if (!answered) return
    }

    if (questionIndex < questions.length - 1) {
      setDirection('forward')
      setAnimKey(k => k + 1)
      setQuestionIndex(i => i + 1)
    } else {
      setDirection('forward')
      setAnimKey(k => k + 1)
      setPhase('lead-gen')
    }
  }, [phase, questionIndex, questions.length, currentQuestion, answers])

  const back = useCallback(() => {
    if (phase !== 'questions') return
    if (questionIndex > 0) {
      setDirection('backward')
      setAnimKey(k => k + 1)
      setQuestionIndex(i => i - 1)
    }
  }, [phase, questionIndex])

  const handleKeySelectIndex = useCallback((index: number) => {
    if (phase !== 'questions' || !currentQuestion?.options) return
    const opt = currentQuestion.options[index]
    if (!opt) return
    handleAnswer(currentQuestion.id, opt.value)
  }, [phase, currentQuestion, handleAnswer])

  useKeyboard({
    onAdvance: advance,
    onBack: back,
    onSelectIndex: handleKeySelectIndex,
    enabled: phase === 'questions',
  })

  const stepGroups = getStepGroups(answers)

  if (phase === 'landing') return <>{renderLanding(advance)}</>
  if (phase === 'lead-gen') return (
    <SurveyShell
      currentIndex={questions.length}
      totalQuestions={questions.length}
      direction="forward"
      animKey={animKey}
      stepGroups={stepGroups}
      currentStepIndex={stepGroups.length - 1}
      hideCounter
    >
      {renderLeadGen(answers, () => setPhase('thank-you'))}
    </SurveyShell>
  )
  if (phase === 'thank-you') return <>{renderThankYou()}</>
  if (!currentQuestion) return null

  const currentStepIndex = stepGroups.findIndex(g => g.questionIds.includes(currentQuestion.id))

  return (
    <SurveyShell
      currentIndex={questionIndex}
      totalQuestions={questions.length}
      direction={direction}
      animKey={animKey}
      stepGroups={stepGroups}
      currentStepIndex={currentStepIndex >= 0 ? currentStepIndex : 0}
    >
      <QuestionRenderer
        question={currentQuestion}
        answers={answers}
        onAnswer={handleAnswer}
        onAdvance={advance}
        onBack={back}
        isFirst={questionIndex === 0}
      />
    </SurveyShell>
  )
}
