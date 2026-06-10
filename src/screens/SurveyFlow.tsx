import { useState, useCallback } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import type { Phase, Direction, SurveyAnswers, Question, SubmissionMeta } from '../types'
import { getQuestionSequence } from '../lib/questions'
import { getScene } from '../lib/scenes'
import { useKeyboard } from '../lib/useKeyboard'
import { SurveyShell, type StepGroup } from '../components/SurveyShell'
import { QuestionRenderer } from '../components/QuestionRenderer'

interface SurveyFlowProps {
  renderLanding: (onStart: () => void) => React.ReactNode
  renderThankYou: (answers: SurveyAnswers, meta: SubmissionMeta) => React.ReactNode
}

function getStepGroups(answers: SurveyAnswers): StepGroup[] {
  if (answers.is_employee) {
    return [
      { label: 'Om dig', questionIds: ['gate'] },
      { label: 'Din lønseddel', questionIds: ['e1', 'e2'] },
      { label: 'Udgifter & AI', questionIds: ['e3', 'e4'] },
    ]
  }
  const base: StepGroup[] = [
    { label: 'Om dig', questionIds: ['gate', 'q0', 'size'] },
  ]
  if (answers.track === 'zenegy') {
    return [
      ...base,
      { label: 'Zenegy hos dig', questionIds: ['a1', 'a1_migration'] },
      { label: 'Din oplevelse', questionIds: ['a2', 'a3', 'a4'] },
      { label: 'AI & fremtid', questionIds: ['ai'] },
      { label: 'Regnskab', questionIds: ['numbers'] },
    ]
  }
  return [
    ...base,
    { label: 'Dit lønsystem', questionIds: ['b1'] },
    { label: 'Din oplevelse', questionIds: ['b2', 'b3', 'b4', 'b5'] },
    { label: 'AI & fremtid', questionIds: ['ai'] },
    { label: 'Regnskab', questionIds: ['numbers'] },
  ]
}

/** Whether the current question has a usable answer (drives the Next button). */
function isAnswered(question: Question, answers: SurveyAnswers): boolean {
  const lookup: Record<string, unknown> = {
    gate: answers.is_employee !== undefined ? 'answered' : undefined,
    q0: answers.track,
    size: answers.size,
    b1: answers.b_payroll_system,
    b2: answers.b_frustrations,
    b3: answers.b_priorities,
    b4: answers.b_barriers,
    b5: answers.b_switch_intent,
    a1: answers.a_products,
    a1_migration: answers.a_migration_from,
    a2: answers.a_satisfaction,
    a3: answers.a_best_thing,
    a4: answers.a_nps,
    numbers: answers.accounting_system,
    e1: answers.e_payslip,
    e2: answers.e_pain_points,
    e3: answers.e_expenses,
    e4: answers.e_ai_trust,
    ai: answers.ai_interest,
  }
  const ans = lookup[question.id]
  return ans !== null && ans !== undefined && ans !== '' &&
    !(Array.isArray(ans) && (ans as unknown[]).length === 0)
}

function computePercent(
  phase: Phase, stepGroups: StepGroup[], currentStepIndex: number, currentQuestion?: Question,
): number {
  if (phase === 'landing') return 0
  if (phase === 'thank-you') return 100
  const total = stepGroups.length || 1
  // questions — base on section progress so it stays stable as the sequence branches
  const group = stepGroups[currentStepIndex]
  let frac = 0.5
  if (group && currentQuestion) {
    const within = group.questionIds.indexOf(currentQuestion.id)
    const len = Math.max(group.questionIds.length, 1)
    if (within >= 0) frac = (within + 1) / len
  }
  return Math.round(((currentStepIndex + frac) / total) * 100)
}

export function SurveyFlow({ renderLanding, renderThankYou }: SurveyFlowProps) {
  const [phase, setPhase] = useState<Phase>('landing')
  const [questionIndex, setQuestionIndex] = useState(0)
  const [direction, setDirection] = useState<Direction>('forward')
  const [animKey, setAnimKey] = useState(0)
  const [answers, setAnswers] = useState<SurveyAnswers>({})
  // Soft anti-spam signals (advisory; the anon key is public).
  const [startedAt, setStartedAt] = useState<number | null>(null)
  const [honeypot, setHoneypot] = useState('')

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
        size: 'size',
        b1: 'b_payroll_system',
        b_payroll_other: 'b_payroll_other',
        b2: 'b_frustrations',
        b2_other: 'b_frustration_other',
        b3: 'b_priorities',
        b4: 'b_barriers',
        b4_other: 'b_barrier_other',
        b5: 'b_switch_intent',
        a1: 'a_products',
        a1_migration: 'a_migration_from',
        a2: 'a_satisfaction',
        a2_text: 'a_satisfaction_text',
        a3: 'a_best_thing',
        a3_text: 'a_best_thing_text',
        a4: 'a_nps',
        a4_text: 'a_improve_text',
        numbers: 'accounting_system',
        accounting_other: 'accounting_other',
        e1: 'e_payslip',
        e2: 'e_pain_points',
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
      setStartedAt(prev => prev ?? Date.now())
      setDirection('forward')
      setPhase('questions')
      setAnimKey(k => k + 1)
      return
    }
    if (phase !== 'questions' || !currentQuestion) return
    if (!currentQuestion.autoAdvance && !isAnswered(currentQuestion, answers)) return

    if (questionIndex < questions.length - 1) {
      setDirection('forward')
      setAnimKey(k => k + 1)
      setQuestionIndex(i => i + 1)
    } else {
      // Last question answered — the thank-you screen saves the answers on mount.
      setDirection('forward')
      setAnimKey(k => k + 1)
      setPhase('thank-you')
    }
  }, [phase, questionIndex, questions.length, currentQuestion, answers])

  const back = useCallback(() => {
    if (phase !== 'questions') return
    if (questionIndex > 0) {
      setDirection('backward')
      setAnimKey(k => k + 1)
      setQuestionIndex(i => i - 1)
    } else {
      setDirection('backward')
      setAnimKey(k => k + 1)
      setPhase('landing')
    }
  }, [phase, questionIndex])

  const goToLanding = useCallback(() => {
    setDirection('backward')
    setAnimKey(k => k + 1)
    setPhase('landing')
  }, [])

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

  const stepGroups = getStepGroups(answers).map(g => ({
    ...g,
    subItems: g.questionIds
      .filter(id => questions.some(q => q.id === id))
      .map(id => {
        const q = questions.find(q => q.id === id)!
        return q.shortLabel ?? q.question
      }),
  }))

  // Jump back to the first (reachable) question of an already-visited section.
  const jumpToStep = (groupIndex: number) => {
    const group = stepGroups[groupIndex]
    if (!group) return
    const targetId = group.questionIds.find(id => questions.some(q => q.id === id))
    if (!targetId) return
    const idx = questions.findIndex(q => q.id === targetId)
    if (idx < 0) return
    setDirection(idx <= questionIndex ? 'backward' : 'forward')
    setAnimKey(k => k + 1)
    setPhase('questions')
    setQuestionIndex(idx)
  }

  // ── Survey content (everything except landing) ──
  const renderSurveyContent = () => {
    // Thank-you — answers are saved by the screen itself on mount
    if (phase === 'thank-you') {
      return (
        <SurveyShell
          stepGroups={stepGroups} currentStepIndex={stepGroups.length}
          percent={100} phase="thank-you" direction={direction} animKey={animKey}
        >
          {renderThankYou(answers, { startedAt, honeypot })}
        </SurveyShell>
      )
    }
    // Questions
    if (!currentQuestion) return null
    const found = stepGroups.findIndex(g => g.questionIds.includes(currentQuestion.id))
    const currentStepIndex = found >= 0 ? found : 0
    const scene = getScene(questionIndex)
    const isFirst = questionIndex === 0
    const answered = isAnswered(currentQuestion, answers)
    const logoWithAndet = currentQuestion.type === 'logo-grid' &&
      (answers.accounting_system === 'andet' || answers.b_payroll_system === 'andet' || answers.a_migration_from === 'andet')
    const sectionIds = stepGroups[currentStepIndex]?.questionIds ?? []
    const sectionTotal = sectionIds.length || 1
    const sectionStep = Math.max(1, sectionIds.indexOf(currentQuestion.id) + 1)
    return (
      <SurveyShell
        stepGroups={stepGroups} currentStepIndex={currentStepIndex}
        percent={computePercent('questions', stepGroups, currentStepIndex, currentQuestion)}
        sectionStep={sectionStep} sectionTotal={sectionTotal}
        phase="questions" direction={direction} animKey={animKey}
        showBack backLabel={isFirst ? 'Forsiden' : 'Tilbage'} onBack={back}
        showNext={!currentQuestion.autoAdvance || logoWithAndet} nextLabel="Næste" nextDisabled={!answered} onNext={advance}
        onExit={goToLanding}
        onNavigateWelcome={goToLanding} onNavigateStep={jumpToStep}
      >
        <QuestionRenderer
          question={currentQuestion}
          scene={scene}
          answers={answers}
          onAnswer={handleAnswer}
          onAdvance={advance}
          eyebrow={stepGroups[currentStepIndex]?.label}
        />
      </SurveyShell>
    )
  }

  // Fade between the landing page and the survey shell so the logo doesn't jump.
  return (
    <>
      {/* Honeypot — invisible to humans, off the tab order; bots that auto-fill
          form fields trip it and their submission is silently dropped. */}
      <input
        type="text"
        name="company_website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        value={honeypot}
        onChange={e => setHoneypot(e.target.value)}
        style={{ position: 'absolute', left: '-9999px', top: 0, width: 1, height: 1, opacity: 0, pointerEvents: 'none' }}
      />
      <AnimatePresence mode="wait" initial={false}>
        {phase === 'landing' ? (
          <motion.div key="landing" exit={{ opacity: 0 }} transition={{ duration: 0.22 }}>
            {renderLanding(advance)}
          </motion.div>
        ) : (
          <motion.div key="survey" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.22 }}>
            {renderSurveyContent()}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
