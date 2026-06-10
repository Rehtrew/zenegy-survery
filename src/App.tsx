import { SurveyFlow } from './screens/SurveyFlow'
import { LandingPage } from './screens/LandingPage'
import { ThankYou } from './screens/ThankYou'
import type { SurveyAnswers, SubmissionMeta } from './types'

export default function App() {
  return (
    <SurveyFlow
      renderLanding={(onStart) => <LandingPage onStart={onStart} />}
      renderThankYou={(answers: SurveyAnswers, meta: SubmissionMeta) => <ThankYou answers={answers} meta={meta} />}
    />
  )
}
