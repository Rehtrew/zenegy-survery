import { SurveyFlow } from './screens/SurveyFlow'
import { LandingPage } from './screens/LandingPage'
import { LeadGen } from './screens/LeadGen'
import { ThankYou } from './screens/ThankYou'
import type { SurveyAnswers } from './types'

export default function App() {
  return (
    <SurveyFlow
      renderLanding={(onStart) => <LandingPage onStart={onStart} />}
      renderLeadGen={(answers: SurveyAnswers, onSubmitted) => (
        <LeadGen answers={answers} onSubmitted={onSubmitted} />
      )}
      renderThankYou={() => <ThankYou />}
    />
  )
}
