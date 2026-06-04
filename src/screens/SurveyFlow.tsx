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

export function SurveyFlow({ renderLanding, renderLeadGen, renderThankYou }: SurveyFlowProps) {
  const [phase, setPhase] = useState<Phase>('landing')
  const [questionIndex, setQuestionIndex] = useState(0)
  const [direction, setDirection] = useState<Direction>('forward')
  const [animKey, setAnimKey] = useState(0)
  const [answers, setAnswers] = useState<SurveyAnswers>({})

  const questions = getQuestionSequence({
    track: answers.track,
    a_products: answers.a_products,
  })

  const currentQuestion = questions[questionIndex]

  const handleAnswer = useCallback((id: string, value: unknown) => {
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
    if (phase !== 'questions') return

    if (questionIndex < questions.length - 1) {
      setDirection('forward')
      setAnimKey(k => k + 1)
      setQuestionIndex(i => i + 1)
    } else {
      setPhase('lead-gen')
    }
  }, [phase, questionIndex, questions.length])

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

  if (phase === 'landing') return <>{renderLanding(advance)}</>
  if (phase === 'lead-gen') return <>{renderLeadGen(answers, () => setPhase('thank-you'))}</>
  if (phase === 'thank-you') return <>{renderThankYou()}</>
  if (!currentQuestion) return null

  return (
    <SurveyShell
      currentIndex={questionIndex}
      totalQuestions={questions.length}
      direction={direction}
      animKey={animKey}
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
