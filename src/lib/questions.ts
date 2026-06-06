import type { Question, SurveyAnswers } from '../types'
import datalonenLogo from '../assets/logos/dataloen.svg'
import bluegardenLogo from '../assets/logos/bluegarden.svg'
import lessorLogo from '../assets/logos/lessor.svg'
import intectLogo from '../assets/logos/intect.png'
import sdloenLogo from '../assets/logos/sdloen.svg'
import danloenLogo from '../assets/logos/danloen.svg'

export const GATE_QUESTION: Question = {
  id: 'gate',
  type: 'choice-single',
  question: 'Spiller du en rolle i valg af løn- eller regnskabssoftware?',
  subText: 'Dit svar afgør hvilke spørgsmål du ser.',
  autoAdvance: true,
  options: [
    { value: 'decision-maker', label: 'Ja, jeg er med til at beslutte', subLabel: 'Direktør, bogholder, HR eller lignende' },
    { value: 'employee', label: 'Nej, jeg bruger systemerne som medarbejder', subLabel: 'Lønmodtager uden systemansvar' },
  ],
}

export const OPENING_QUESTION: Question = {
  id: 'q0',
  type: 'choice-single',
  question: 'Bruger du Zenegy som dit lønsystem i dag?',
  subText: 'Dit svar afgør hvilke spørgsmål du ser — vi giver dig den mest relevante oplevelse.',
  autoAdvance: true,
  options: [
    { value: 'zenegy', label: 'Ja, jeg bruger Zenegy', subLabel: 'Jeg er eksisterende kunde' },
    { value: 'non-zenegy', label: 'Nej, jeg bruger et andet system', subLabel: 'Dataløn, Bluegarden, Lessor, eller andet' },
  ],
}

const ROLE_QUESTION: Question = {
  id: 'role',
  type: 'choice-single',
  question: 'Hvad er din rolle i virksomheden?',
  subText: 'Det hjælper os forstå, hvem der håndterer løn og økonomi i danske virksomheder.',
  autoAdvance: true,
  options: [
    { value: 'cfo', label: 'Direktør / CFO', subLabel: 'Øverste ansvar for økonomi og drift' },
    { value: 'accountant', label: 'Bogholder / Revisor', subLabel: 'Daglig bogføring, løn og regnskab' },
    { value: 'hr', label: 'HR / Lønadministrator', subLabel: 'Personale og lønkørsel' },
    { value: 'decision-maker', label: 'Anden beslutningstager', subLabel: 'Indflydelse på valg af systemer' },
  ],
}

const NUMBERS_AWARENESS: Question = {
  id: 'numbers',
  type: 'logo-grid',
  question: 'Hvilket regnskabssystem bruger du i dag?',
  subText: 'Vi er nysgerrige — ikke på jagt efter salg.',
  autoAdvance: true,
  options: [
    { value: 'e-conomic', label: 'e-conomic', logoInitials: 'ec', logoStyle: { background: 'linear-gradient(135deg,#0057B8,#004499)' } },
    { value: 'dinero', label: 'Dinero', logoInitials: 'Di', logoStyle: { background: 'linear-gradient(135deg,#FF6B2B,#E55520)' } },
    { value: 'billy', label: 'Billy', logoInitials: 'Bi', logoStyle: { background: 'linear-gradient(135deg,#F59E0B,#D97706)', color: '#111111' } },
    { value: 'uniconta', label: 'Uniconta', logoInitials: 'Un', logoStyle: { background: 'linear-gradient(135deg,#1E40AF,#1E3A8A)' } },
    { value: 'visma', label: 'Visma', logoInitials: 'Vi', logoStyle: { background: 'linear-gradient(135deg,#0066B3,#004F8A)' } },
    { value: 'zenegy-numbers', label: 'Zenegy Numbers', logoInitials: 'Ze', logoStyle: { background: 'linear-gradient(135deg,#6e30fd,#331070)' } },
    { value: 'andet', label: 'Andet', logoInitials: '?', logoStyle: { background: 'linear-gradient(135deg,#616161,#323232)' } },
  ],
}

export const TRACK_B_QUESTIONS: Question[] = [
  {
    id: 'b1',
    type: 'logo-grid',
    question: 'Hvilket lønsystem bruger din virksomhed i dag?',
    subText: 'Vælg det primære system din virksomhed bruger til lønkørsel.',
    autoAdvance: true,
    options: [
      { value: 'dataloen', label: 'Dataløn', subLabel: 'by Visma', logoSrc: datalonenLogo },
      { value: 'bluegarden', label: 'Bluegarden', logoSrc: bluegardenLogo },
      { value: 'lessor', label: 'Lessor', logoSrc: lessorLogo },
      { value: 'intect', label: 'Intect', logoSrc: intectLogo },
      { value: 'sd-loen', label: 'SD Løn', logoSrc: sdloenLogo },
      { value: 'danloen', label: 'Danløn', logoSrc: danloenLogo },
      { value: 'zenegy', label: 'Zenegy', logoInitials: 'Ze', logoStyle: { background: 'linear-gradient(135deg,#6e30fd,#331070)' } },
      { value: 'andet', label: 'Andet', logoInitials: '?', logoStyle: { background: 'linear-gradient(135deg,#616161,#323232)' } },
    ],
  },
  {
    id: 'b2',
    type: 'pill-select',
    question: 'Hvad frustrerer dig mest ved dit nuværende lønsystem?',
    subText: 'Vær ærlig — det er præcis den slags input vi har brug for. Vælg alle der passer.',
    options: [
      { value: 'price', label: 'Prisen er for høj' },
      { value: 'slow', label: 'Det er langsomt og tungt' },
      { value: 'ui', label: 'Brugergrænsefladen er forvirrende' },
      { value: 'integrations', label: 'Dårlige integrationer' },
      { value: 'support', label: 'Support er svær at komme igennem til' },
      { value: 'features', label: 'Mangler features jeg har brug for' },
      { value: 'slow-payroll', label: 'Lønkørsel tager for lang tid' },
      { value: 'no-app', label: 'Ingen god mobilapp' },
      { value: 'satisfied', label: 'Faktisk ikke noget — jeg er tilfreds' },
    ],
  },
  {
    id: 'b3',
    type: 'priority-rank',
    question: 'Hvad er vigtigst for dig i et lønsystem?',
    subText: 'Klik for at markere dine top 3 — i prioriteret rækkefølge. Hvad ville du betale mest for?',
    maxRank: 3,
    options: [
      { value: 'price', label: 'Pris og value for money' },
      { value: 'ux', label: 'Enkel og intuitiv brugerflade' },
      { value: 'integrations', label: 'Integrationer (bank, HR, regnskab)' },
      { value: 'compliance', label: 'Compliance og automatisk SKAT-indberetning' },
      { value: 'support', label: 'God og hurtig kundesupport' },
      { value: 'mobile', label: 'Mobilapp til medarbejdere' },
      { value: 'features', label: 'Features og automatisering' },
    ],
  },
  {
    id: 'b4',
    type: 'pill-select',
    question: 'Hvad holder dig tilbage fra at skifte lønsystem?',
    subText: 'Ærlighed hjælper os med at forstå markedet bedre — der er ingen forkerte svar.',
    options: [
      { value: 'transition', label: 'Overgangen virker for besværlig' },
      { value: 'time', label: 'Vi har ikke tid til at implementere nyt' },
      { value: 'faith', label: 'Jeg tror mit system bliver bedre' },
      { value: 'cost', label: 'Skifteomkostningerne er for høje' },
      { value: 'unknown', label: 'Jeg kender ikke alternativerne godt nok' },
      { value: 'accountant', label: 'Det er min revisor/bogholder der beslutter' },
      { value: 'happy', label: 'Jeg er faktisk tilfreds — skifter ikke' },
    ],
  },
]

export const TRACK_A_QUESTIONS: Question[] = [
  {
    id: 'a1',
    type: 'choice-multi',
    question: 'Hvilke Zenegy-produkter bruger du?',
    subText: 'Markér alle du bruger aktivt — det hjælper os forstå din brug.',
    options: [
      { value: 'payroll', label: 'Løn', subLabel: 'Lønkørsel og lønsedler' },
      { value: 'numbers', label: 'Numbers', subLabel: 'Bogføring og regnskab' },
      { value: 'expense', label: 'Expense', subLabel: 'Udlæg og kvitteringer' },
      { value: 'time', label: 'Time', subLabel: 'Tidsregistrering og fravær' },
    ],
  },
  {
    id: 'a2',
    type: 'emoji-rating',
    question: 'Hvor tilfreds er du med Zenegy overordnet?',
    subText: 'Tænk på din daglige oplevelse — ikke kun onboarding.',
    autoAdvance: true,
    options: [
      { value: 'unhappy', label: 'Ikke tilfreds' },
      { value: 'meh', label: 'Det går' },
      { value: 'happy', label: 'Tilfreds' },
    ],
  },
  {
    id: 'a3',
    type: 'choice-single',
    question: 'Hvad er det ene du sætter allermest pris på ved Zenegy?',
    subText: 'Dit svar hjælper os fortælle historien om Zenegy til andre — med dine ord.',
    hasOpenText: true,
    openTextLabel: 'Vil du uddybe? (valgfrit)',
    openTextPlaceholder: 'Fortæl os gerne med egne ord, hvad der gør Zenegy værdifuldt for dig...',
    openTextMaxLength: 200,
    options: [
      { value: 'speed', label: 'Det er hurtigt og nemt at køre løn' },
      { value: 'price', label: 'Prisen er rigtig' },
      { value: 'integrations', label: 'Integrationer med mine andre systemer' },
      { value: 'support', label: 'Support der rent faktisk hjælper' },
      { value: 'all-in-one', label: 'Alt samlet ét sted (løn + Numbers)' },
    ],
  },
  {
    id: 'a4',
    type: 'nps-scale',
    question: 'Ville du anbefale Zenegy til en kollega eller forretningsforbindelse?',
    subText: 'NPS er en standard vi måler os på — og din kommentar gør den meningsfuld.',
    hasOpenText: true,
    openTextLabel: 'Hvad er det ene du ville ønske Zenegy gjorde bedre? (valgfrit)',
    openTextPlaceholder: 'Din feedback går direkte til vores produktteam...',
  },
]

export const EMPLOYEE_QUESTIONS: Question[] = [
  {
    id: 'e1',
    type: 'choice-single',
    question: 'Modtager du din lønseddel digitalt?',
    subText: 'Fortæl os om din nuværende oplevelse.',
    autoAdvance: true,
    options: [
      { value: 'app', label: 'Ja, via app eller selvbetjeningsportal' },
      { value: 'email', label: 'Ja, som PDF på email' },
      { value: 'paper', label: 'Nej, på papir eller print' },
    ],
  },
  {
    id: 'e2',
    type: 'emoji-rating',
    question: 'Hvad synes du om lønprocessen i din virksomhed?',
    subText: 'Tænk på din daglige oplevelse som medarbejder.',
    autoAdvance: true,
    options: [
      { value: 'bad', label: 'Besværlig' },
      { value: 'ok', label: 'Det fungerer' },
      { value: 'good', label: 'Problemfri' },
    ],
  },
  {
    id: 'e3',
    type: 'choice-single',
    question: 'Indberetter du udgifter eller udlæg til din virksomhed?',
    autoAdvance: true,
    options: [
      { value: 'yes-easy', label: 'Ja, regelmæssigt og det er nemt' },
      { value: 'yes-hard', label: 'Ja, men processen er besværlig' },
      { value: 'no', label: 'Nej, ikke relevant for mig' },
    ],
  },
  {
    id: 'e4',
    type: 'choice-single',
    question: 'Ville du have tillid til en AI der håndterede din lønseddel?',
    subText: 'Der er ingen forkerte svar.',
    autoAdvance: true,
    options: [
      { value: 'yes', label: 'Ja, hvis systemet er nøjagtigt' },
      { value: 'controlled', label: 'Kun med menneskelig kontrol undervejs' },
      { value: 'no', label: 'Nej — løn er for vigtigt til AI' },
    ],
  },
]

const AI_QUESTION: Question = {
  id: 'ai',
  type: 'choice-single',
  question: 'Ville du overveje AI-automatisering i jeres lønproces?',
  subText: 'AI er på alles læber — vi er nysgerrige på jeres holdning.',
  autoAdvance: true,
  options: [
    { value: 'using', label: 'Ja, vi bruger det allerede' },
    { value: 'interested', label: 'Ja, vi er interesserede' },
    { value: 'exploring', label: 'Måske — vi undersøger det' },
    { value: 'no', label: 'Nej, ikke foreløbigt' },
  ],
}

export function getQuestionSequence(
  answers: Pick<SurveyAnswers, 'track' | 'a_products' | 'is_employee'>
): Question[] {
  // Employee track
  if (answers.is_employee) {
    return [GATE_QUESTION, ...EMPLOYEE_QUESTIONS]
  }

  // No gate answer yet
  if (answers.is_employee === undefined && !answers.track) {
    return [GATE_QUESTION]
  }

  // Decision-maker track: no track selected yet
  if (!answers.track) {
    return [GATE_QUESTION, OPENING_QUESTION]
  }

  if (answers.track === 'non-zenegy') {
    return [GATE_QUESTION, OPENING_QUESTION, ROLE_QUESTION, ...TRACK_B_QUESTIONS, AI_QUESTION, NUMBERS_AWARENESS]
  }

  // zenegy track
  const usesNumbers = answers.a_products?.includes('numbers') ?? false
  return [
    GATE_QUESTION,
    OPENING_QUESTION,
    ROLE_QUESTION,
    ...TRACK_A_QUESTIONS,
    AI_QUESTION,
    ...(usesNumbers ? [] : [NUMBERS_AWARENESS]),
  ]
}
