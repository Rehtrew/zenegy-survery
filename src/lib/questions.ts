import type { Question, SurveyAnswers } from '../types'
import datalonenLogo from '../assets/logos/dataloen.svg'
import bluegardenLogo from '../assets/logos/bluegarden.svg'
import lessorLogo from '../assets/logos/lessor.svg'
import intectLogo from '../assets/logos/intect.png'
import sdloenLogo from '../assets/logos/sdloen.svg'
import danloenLogo from '../assets/logos/danloen.svg'
import economicLogo from '../assets/logos/economic.png'
import dineroLogo from '../assets/logos/dinero.png'
import billyLogo from '../assets/logos/billy.png'
import unicontaLogo from '../assets/logos/uniconta.png'
import vismaLogo from '../assets/logos/visma.png'
import zenegyLogo from '../assets/logos/zenegy.svg'
import payrollIcon from '../assets/products/payroll.png'
import numbersIcon from '../assets/products/numbers.png'
import expenseIcon from '../assets/products/expense.png'
import timeIcon from '../assets/products/time.png'

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
  type: 'choice-tiles',
  question: 'Bruger du Zenegy som dit lønsystem i dag?',
  subText: 'Dit svar afgør hvilke spørgsmål du ser — vi giver dig den mest relevante oplevelse.',
  autoAdvance: true,
  options: [
    { value: 'zenegy', label: 'Ja, jeg bruger Zenegy', subLabel: 'Jeg er eksisterende kunde', iconName: 'zenegy' },
    { value: 'non-zenegy', label: 'Nej, jeg bruger et andet system', subLabel: 'Dataløn, Bluegarden, Lessor, eller andet', iconName: 'other-system' },
  ],
}

const NUMBERS_AWARENESS: Question = {
  id: 'numbers',
  type: 'logo-grid',
  question: 'Hvilket regnskabssystem bruger du i dag?',
  subText: 'Vi er nysgerrige — ikke på jagt efter salg.',
  autoAdvance: true,
  options: [
    { value: 'e-conomic', label: 'e-conomic', logoSrc: economicLogo },
    { value: 'dinero', label: 'Dinero', logoSrc: dineroLogo },
    { value: 'billy', label: 'Billy', logoSrc: billyLogo },
    { value: 'uniconta', label: 'Uniconta', logoSrc: unicontaLogo },
    { value: 'visma', label: 'Visma', logoSrc: vismaLogo },
    { value: 'zenegy-numbers', label: 'Zenegy Numbers', logoSrc: zenegyLogo },
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
    type: 'tile-select',
    question: 'Hvad frustrerer dig mest ved dit nuværende lønsystem?',
    subText: 'Vær ærlig — det er præcis den slags input vi har brug for. Vælg alle der passer.',
    openTextPlaceholder: 'Hvad frustrerer dig?',
    options: [
      { value: 'price', label: 'Prisen er for høj', iconName: 'tag' },
      { value: 'slow', label: 'Det er langsomt og tungt', iconName: 'hourglass' },
      { value: 'ui', label: 'Brugergrænsefladen er forvirrende', iconName: 'layout' },
      { value: 'integrations', label: 'Dårlige integrationer', iconName: 'plug' },
      { value: 'support', label: 'Support er svær at komme igennem til', iconName: 'chat' },
      { value: 'features', label: 'Mangler features jeg har brug for', iconName: 'feature' },
      { value: 'slow-payroll', label: 'Lønkørsel tager for lang tid', iconName: 'clock' },
      { value: 'no-app', label: 'Ingen god mobilapp', iconName: 'smartphone' },
      { value: 'satisfied', label: 'Faktisk ikke noget — jeg er tilfreds', iconName: 'smile' },
      { value: 'other', label: 'Andet', iconName: 'pencil' },
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
    type: 'tile-select',
    question: 'Hvad holder dig tilbage fra at skifte lønsystem?',
    subText: 'Ærlighed hjælper os med at forstå markedet bedre — der er ingen forkerte svar.',
    openTextPlaceholder: 'Hvad holder dig tilbage?',
    options: [
      { value: 'transition', label: 'Overgangen virker for besværlig', iconName: 'repeat' },
      { value: 'time', label: 'Vi har ikke tid til at implementere nyt', iconName: 'clock' },
      { value: 'faith', label: 'Jeg tror mit system bliver bedre', iconName: 'trending-up' },
      { value: 'cost', label: 'Skifteomkostningerne er for høje', iconName: 'banknote' },
      { value: 'unknown', label: 'Jeg kender ikke alternativerne godt nok', iconName: 'search' },
      { value: 'accountant', label: 'Det er min revisor/bogholder der beslutter', iconName: 'calculator' },
      { value: 'happy', label: 'Jeg er faktisk tilfreds — skifter ikke', iconName: 'smile' },
      { value: 'other', label: 'Andet', iconName: 'pencil' },
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
      { value: 'payroll', label: 'Løn', subLabel: 'Lønkørsel og lønsedler', logoSrc: payrollIcon },
      { value: 'numbers', label: 'Numbers', subLabel: 'Bogføring og regnskab', logoSrc: numbersIcon },
      { value: 'expense', label: 'Expense', subLabel: 'Udlæg og kvitteringer', logoSrc: expenseIcon },
      { value: 'time', label: 'Time', subLabel: 'Tidsregistrering og fravær', logoSrc: timeIcon },
    ],
  },
  {
    id: 'a2',
    type: 'emoji-rating',
    question: 'Hvor tilfreds er du med Zenegy i hverdagen?',
    subText: 'Tænk på din daglige oplevelse med produktet — ikke kun onboarding.',
    hasOpenText: true,
    openTextLabel: 'Vil du uddybe? (valgfrit)',
    openTextPlaceholder: 'Hvad ligger bag dit svar?',
    openTextMaxLength: 300,
    options: [
      { value: 'very-unhappy', label: 'Meget utilfreds' },
      { value: 'unhappy', label: 'Ikke tilfreds' },
      { value: 'meh', label: 'Det går' },
      { value: 'happy', label: 'Tilfreds' },
      { value: 'very-happy', label: 'Meget tilfreds' },
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
      { value: 'speed', label: 'Det er hurtigt og nemt at køre løn', iconName: 'zap' },
      { value: 'price', label: 'Prisen er rigtig', iconName: 'tag' },
      { value: 'integrations', label: 'Integrationer med mine andre systemer', iconName: 'plug' },
      { value: 'support', label: 'Support der rent faktisk hjælper', iconName: 'chat' },
      { value: 'all-in-one', label: 'Alt samlet ét sted (løn + Numbers)', iconName: 'layers' },
    ],
  },
  {
    id: 'a4',
    type: 'nps-scale',
    question: 'Ville du anbefale Zenegy til en kollega eller forretningsforbindelse?',
    subText: 'Det her måler noget andet end tilfredshed — om du ville sætte dit navn på en anbefaling til andre.',
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
    { value: 'using', label: 'Ja, vi bruger det allerede', tone: 'positive' },
    { value: 'interested', label: 'Ja, vi er interesserede', tone: 'positive' },
    { value: 'exploring', label: 'Måske — vi undersøger det', tone: 'caution' },
    { value: 'no', label: 'Nej, ikke foreløbigt', tone: 'negative' },
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
    return [GATE_QUESTION, OPENING_QUESTION, ...TRACK_B_QUESTIONS, AI_QUESTION, NUMBERS_AWARENESS]
  }

  // zenegy track
  const usesNumbers = answers.a_products?.includes('numbers') ?? false
  return [
    GATE_QUESTION,
    OPENING_QUESTION,
    ...TRACK_A_QUESTIONS,
    AI_QUESTION,
    ...(usesNumbers ? [] : [NUMBERS_AWARENESS]),
  ]
}
