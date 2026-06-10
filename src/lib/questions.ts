import type { Question, SurveyAnswers } from '../types'
import datalonenLogo from '../assets/logos/dataloen.svg'
import lessorLogo from '../assets/logos/lessor.svg'
import intectLogo from '../assets/logos/intect.png'
import sdloenLogo from '../assets/logos/sdloen.svg'
import danloenLogo from '../assets/logos/danloen.svg'
import bluegardenLogo from '../assets/logos/bluegarden.svg'
import economicLogo from '../assets/logos/economic.png'
import dineroLogo from '../assets/logos/dinero.png'
import billyLogo from '../assets/logos/billy.png'
import unicontaLogo from '../assets/logos/uniconta.png'
import vismaLogo from '../assets/logos/visma.png'
import zenegyLogo from '../assets/logos/zenegy.svg'
import excelLogo from '../assets/logos/excel.svg'
import payrollIcon from '../assets/products/payroll.png'
import numbersIcon from '../assets/products/numbers.png'
import expenseIcon from '../assets/products/expense.png'
import timeIcon from '../assets/products/time.png'

export const GATE_QUESTION: Question = {
  id: 'gate',
  type: 'choice-single',
  question: 'Hvilken rolle spiller du i håndteringen af løn eller regnskab?',
  shortLabel: 'Din rolle',
  subText: 'Dit svar sikrer, at du kun ser de spørgsmål, der er relevante for dig.',
  autoAdvance: true,
  options: [
    { value: 'decision-maker', label: 'Jeg har (med)ansvar for systemerne', subLabel: 'Direktør, HR, bogholder, ekstern revisor eller administrator' },
    { value: 'employee', label: 'Jeg er primært lønmodtager', subLabel: 'Jeg modtager lønseddel, men har ikke systemansvar' },
  ],
}

export const OPENING_QUESTION: Question = {
  id: 'q0',
  type: 'choice-tiles',
  question: 'Er Zenegy en del af jeres systemlandskab i dag?',
  shortLabel: 'Dit system',
  subText: 'Uanset om I er kunde, ekstern partner eller bruger noget helt andet, vil vi gerne høre din mening.',
  autoAdvance: true,
  options: [
    { value: 'zenegy', label: 'Ja, vi bruger Zenegy', subLabel: 'Som primært løn- eller regnskabssystem', iconName: 'zenegy' },
    { value: 'non-zenegy', label: 'Nej, vi bruger et andet system', subLabel: 'Dataløn, Danløn, Lessor, Intect, Visma eller lignende', iconName: 'other-system' },
  ],
}

export const SIZE_QUESTION: Question = {
  id: 'size',
  type: 'choice-single',
  question: 'Hvor mange medarbejdere kører I løn for?',
  shortLabel: 'Antal medarbejdere',
  subText: 'Det hjælper os sammenligne svar på tværs af virksomheder af forskellig størrelse.',
  autoAdvance: true,
  options: [
    { value: '1-9', label: '1–9' },
    { value: '10-49', label: '10–49' },
    { value: '50-199', label: '50–199' },
    { value: '200+', label: '200+' },
  ],
}

const NUMBERS_AWARENESS: Question = {
  id: 'numbers',
  type: 'logo-grid',
  question: 'Hvilket regnskabs- eller ERP-system bruger I i dag?',
  shortLabel: 'Regnskabssystem',
  subText: 'Vi er nysgerrige — ikke på jagt efter salg.',
  autoAdvance: true,
  options: [
    { value: 'e-conomic', label: 'e-conomic', logoSrc: economicLogo },
    { value: 'dinero', label: 'Dinero', logoSrc: dineroLogo },
    { value: 'billy', label: 'Billy', logoSrc: billyLogo },
    { value: 'uniconta', label: 'Uniconta', logoSrc: unicontaLogo },
    { value: 'visma-bc', label: 'Visma Business', logoSrc: vismaLogo },
    { value: 'microsoft-bc', label: 'Business Central', logoInitials: 'BC', logoStyle: { background: 'linear-gradient(135deg,#00a4ef,#0072c6)' } },
    { value: 'zenegy-numbers', label: 'Zenegy Numbers', logoSrc: zenegyLogo },
    { value: 'andet', label: 'Andet', logoInitials: '?', logoStyle: { background: 'linear-gradient(135deg,#616161,#323232)' } },
  ],
}

export const TRACK_B_QUESTIONS: Question[] = [
  {
    id: 'b1',
    type: 'logo-grid',
    question: 'Hvilket lønsystem bruger din virksomhed primært i dag?',
    shortLabel: 'Lønsystem',
    subText: 'Vælg det primære system din virksomhed bruger til lønkørsel.',
    autoAdvance: true,
    options: [
      { value: 'dataloen', label: 'Dataløn', subLabel: 'by Visma', logoSrc: datalonenLogo },
      { value: 'danloen', label: 'Danløn', logoSrc: danloenLogo },
      { value: 'lessor', label: 'Lessor', logoSrc: lessorLogo },
      { value: 'intect', label: 'Intect', logoSrc: intectLogo },
      { value: 'sd-loen', label: 'SD Løn', logoSrc: sdloenLogo },
      { value: 'visma-loen', label: 'Visma Løn', logoSrc: vismaLogo },
      { value: 'excel', label: 'Excel / manuelt', logoSrc: excelLogo },
      { value: 'andet', label: 'Andet', logoInitials: '?', logoStyle: { background: 'linear-gradient(135deg,#616161,#323232)' } },
    ],
  },
  {
    id: 'b2',
    type: 'tile-select',
    question: 'Hvad frustrerer dig mest ved dit nuværende lønsystem?',
    shortLabel: 'Frustrationer',
    subText: 'Vælg alle der passer.',
    openTextPlaceholder: 'Er der andet, der irriterer dig i hverdagen?',
    options: [
      { value: 'slow-payroll', label: 'Lønkørslen tager lang tid og kræver mange manuelle tjek', iconName: 'clock' },
      { value: 'ui-old', label: 'Brugerfladen føles gammeldags eller uoverskuelig', iconName: 'layout' },
      { value: 'integrations-broken', label: 'Mangelfulde integrationer til bank og regnskab', iconName: 'plug' },
      { value: 'support-slow', label: 'Support er svær at komme igennem til', iconName: 'chat' },
      { value: 'price-value', label: 'Prisen står ikke mål med, hvad produktet kan', iconName: 'tag' },
      { value: 'missing-features', label: 'Mangler moderne features (f.eks. app eller HR-værktøjer)', iconName: 'feature' },
      { value: 'manual-errors', label: 'Mange manuelle trin, hvor fejl kan opstå', iconName: 'hourglass' },
      { value: 'satisfied', label: 'Faktisk ingenting — jeg er tilfreds', iconName: 'smile' },
      { value: 'other', label: 'Andet', iconName: 'pencil' },
    ],
  },
  {
    id: 'b3',
    type: 'priority-rank',
    question: 'Hvilke faktorer vejer du højest i et lønsystem?',
    shortLabel: 'Prioriteter',
    subText: 'Markér de 3 vigtigste i prioriteret rækkefølge.',
    maxRank: 3,
    options: [
      { value: 'ux-simplicity', label: 'Enkel og intuitiv brugerflade' },
      { value: 'heavy-automation', label: 'Automatisering (SKAT, feriepenge, bogføring)' },
      { value: 'rock-solid-support', label: 'Dansk support, der svarer hurtigt' },
      { value: 'open-integrations', label: 'Integrationer, der synkroniserer data automatisk' },
      { value: 'employee-experience', label: 'Mobilapp, så medarbejderne selv kan klare udlæg/tid' },
      { value: 'price', label: 'Pris og gennemskuelig abonnementsstruktur' },
    ],
  },
  {
    id: 'b4',
    type: 'tile-select',
    question: 'Hvad er den primære årsag til, at I ikke skifter lønsystem?',
    shortLabel: 'Skiftehindringer',
    subText: 'Vælg alle der passer.',
    openTextPlaceholder: 'Er der en anden barriere?',
    options: [
      { value: 'fear-of-transition', label: 'Datamigreringen og overgangen virker uoverskuelig', iconName: 'repeat' },
      { value: 'no-time', label: 'Vi har ikke interne ressourcer eller tid til at implementere nyt', iconName: 'clock' },
      { value: 'risk-of-errors', label: 'Bekymring for fejl eller manglende compliance under et skifte', iconName: 'hourglass' },
      { value: 'advisor-decision', label: 'Det er vores eksterne revisor/bogholder, der beslutter', iconName: 'calculator' },
      { value: 'contract-lock', label: 'Vi er bundet af en kontrakt eller et større ERP-system', iconName: 'banknote' },
      { value: 'unknown-market', label: 'Vi kender ikke alternativerne godt nok', iconName: 'search' },
      { value: 'happy-staying', label: 'Vi er tilfredse — et skifte er ikke aktuelt', iconName: 'smile' },
      { value: 'other', label: 'Andet', iconName: 'pencil' },
    ],
  },
  {
    id: 'b5',
    type: 'choice-single',
    question: 'Overvejer I at skifte lønsystem inden for det næste år?',
    shortLabel: 'Skifteplaner',
    subText: 'Helt uforpligtende — vi er bare nysgerrige.',
    autoAdvance: true,
    options: [
      { value: 'actively', label: 'Ja, vi kigger aktivt på alternativer' },
      { value: 'maybe', label: 'Måske — det er ikke udelukket' },
      { value: 'no', label: 'Nej, ikke lige nu' },
    ],
  },
]

export const TRACK_A_QUESTIONS: Question[] = [
  {
    id: 'a1',
    type: 'choice-multi',
    question: 'Hvilke Zenegy-produkter bruger du aktivt i dag?',
    shortLabel: 'Zenegy-produkter',
    subText: 'Vælg alle de moduler, du eller din virksomhed bruger.',
    options: [
      { value: 'payroll', label: 'Løn', subLabel: 'Lønkørsel, SH-dage og automatiske indberetninger', logoSrc: payrollIcon },
      { value: 'numbers', label: 'Numbers', subLabel: 'Finans, bogføring og digitalt regnskab', logoSrc: numbersIcon },
      { value: 'expense', label: 'Expense', subLabel: 'Udlæg, kørsel og kvitteringer', logoSrc: expenseIcon },
      { value: 'time', label: 'Time', subLabel: 'Tidsregistrering, ferie og fravær', logoSrc: timeIcon },
    ],
  },
  {
    id: 'a1_migration',
    type: 'logo-grid',
    question: 'Hvilket system kom du fra, da du valgte Zenegy?',
    shortLabel: 'Tidligere system',
    subText: 'Det hjælper os forstå, hvor i markedet behovet for fornyelse er størst.',
    autoAdvance: true,
    options: [
      { value: 'dataloen', label: 'Dataløn', subLabel: 'by Visma', logoSrc: datalonenLogo },
      { value: 'danloen', label: 'Danløn', logoSrc: danloenLogo },
      { value: 'lessor', label: 'Lessor', logoSrc: lessorLogo },
      { value: 'intect', label: 'Intect', logoSrc: intectLogo },
      { value: 'bluegarden', label: 'Bluegarden', logoSrc: bluegardenLogo },
      { value: 'excel', label: 'Excel / manuelt', logoSrc: excelLogo },
      { value: 'startup', label: 'Direkte til Zenegy', logoSrc: zenegyLogo },
      { value: 'andet', label: 'Andet', logoInitials: '?', logoStyle: { background: 'linear-gradient(135deg,#616161,#323232)' } },
    ],
  },
  {
    id: 'a2',
    type: 'emoji-rating',
    question: 'Hvor tilfreds er du med Zenegy i hverdagen?',
    shortLabel: 'Tilfredshed',
    subText: 'Tænk på den generelle oplevelse — ikke kun onboarding.',
    hasOpenText: true,
    openTextLabel: 'Vil du sætte et par ord på? (valgfrit)',
    openTextPlaceholder: 'Hvad er den primære årsag til din rating?',
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
    question: 'Hvor mærker du den største værdi ved at bruge Zenegy?',
    shortLabel: 'Største værdi',
    subText: 'Hvis du kun må vælge én ting, der gør en mærkbar forskel i din arbejdsuge.',
    hasOpenText: true,
    openTextLabel: 'Uddyb gerne med egne ord (valgfrit)',
    openTextPlaceholder: 'Hvad gør Zenegy værdifuldt for dig?',
    openTextMaxLength: 200,
    options: [
      { value: 'time-saving', label: 'Jeg sparer markant tid på lønkørslen', iconName: 'zap' },
      { value: 'automation', label: 'Automatisk indberetning (SKAT, feriepenge m.m.)', iconName: 'feature' },
      { value: 'integrations', label: 'Det spiller sammen med mine andre systemer og min bank', iconName: 'plug' },
      { value: 'ui-ux', label: 'Platformen er moderne og nem at arbejde i', iconName: 'layout' },
      { value: 'support', label: 'Jeg får hurtig og kompetent hjælp, når jeg har brug for det', iconName: 'chat' },
      { value: 'all-in-one', label: 'Alt er samlet ét sted (løn + Numbers + HR)', iconName: 'layers' },
    ],
  },
  {
    id: 'a4',
    type: 'nps-scale',
    question: 'Ville du anbefale Zenegy til en kollega eller en i dit professionelle netværk?',
    shortLabel: 'Anbefaling',
    subText: 'Det her måler noget andet end tilfredshed — om du ville sætte dit navn på en anbefaling.',
    hasOpenText: true,
    openTextLabel: 'Hvad er det vigtigste, vi kan forbedre? (valgfrit)',
    openTextPlaceholder: 'Din feedback går direkte til vores produktteam...',
  },
]

export const EMPLOYEE_QUESTIONS: Question[] = [
  {
    id: 'e1',
    type: 'choice-single',
    question: 'Hvor modtager du typisk din lønseddel?',
    shortLabel: 'Din lønseddel',
    subText: 'Fortæl os om din nuværende oplevelse.',
    autoAdvance: true,
    options: [
      { value: 'app', label: 'I en app eller medarbejderportal', iconName: 'smartphone' },
      { value: 'email', label: 'Som PDF på email', iconName: 'mail' },
      { value: 'eboks', label: 'I e-Boks / Mit.dk', iconName: 'shield' },
      { value: 'paper', label: 'På print / papir', iconName: 'file-text' },
    ],
  },
  {
    id: 'e2',
    type: 'tile-select',
    question: 'Hvilke administrative opgaver oplever du som mest besværlige på din arbejdsplads?',
    shortLabel: 'Besværlige opgaver',
    subText: 'Vælg alle, der tager unødig tid fra dit egentlige arbejde.',
    options: [
      { value: 'expense-pain', label: 'Gemme kvitteringer og afregne udlæg/kørsel manuelt', iconName: 'banknote' },
      { value: 'time-pain', label: 'Tidsregistrering eller at logge ferie og fravær', iconName: 'clock' },
      { value: 'payslip-confusing', label: 'Min lønseddel er svær at tyde', iconName: 'layout' },
      { value: 'no-mobile-access', label: 'Mangel på en app — jeg skal klare alt fra en computer', iconName: 'smartphone' },
      { value: 'none', label: 'Ingen — det fungerer fint', iconName: 'smile' },
    ],
  },
  {
    id: 'e3',
    type: 'choice-single',
    question: 'Hvis du laver et udlæg, hvor lang tid bruger du i gennemsnit på at registrere det?',
    shortLabel: 'Udlægsregistrering',
    autoAdvance: true,
    options: [
      { value: 'seconds', label: 'Få sekunder — et billede i en app, så er det klaret' },
      { value: 'minutes', label: 'Et par minutter — en formular online' },
      { value: 'heavy-process', label: 'Længere — gemme kvittering, printe eller sende mail' },
      { value: 'not-relevant', label: 'Ikke relevant — jeg har ikke udlæg' },
    ],
  },
  {
    id: 'e4',
    type: 'choice-single',
    question: 'Hvor ville du være mest tryg ved, at en AI hjalp dig med dine løn- og arbejdsdata?',
    shortLabel: 'AI i løn',
    autoAdvance: true,
    options: [
      { value: 'checking', label: 'Til at tjekke min lønseddel for fejl (f.eks. manglende tillæg)' },
      { value: 'input', label: 'Til at læse mine kvitteringer, så jeg slipper for at indtaste beløb' },
      { value: 'assistant', label: 'Som assistent, der forklarer regler om ferie eller barsel' },
      { value: 'none', label: 'Jeg vil ikke have AI i mine løn- eller fraværsdata' },
    ],
  },
]

const AI_QUESTION: Question = {
  id: 'ai',
  type: 'choice-single',
  question: 'Hvor ser du det største potentiale for AI i jeres administrative processer?',
  shortLabel: 'AI-potentiale',
  subText: 'Hvilken opgave ville du helst lade en pålidelig algoritme klare?',
  autoAdvance: true,
  options: [
    { value: 'anomaly-detection', label: 'Automatisk fejlsøgning og kontrol inden lønnen godkendes' },
    { value: 'data-entry', label: 'Automatisk bogføring og matchning af udlæg/kvitteringer' },
    { value: 'support-answers', label: 'Besvarelse af interne spørgsmål om ferie og regler' },
    { value: 'not-ready', label: 'Vi er ikke klar til AI i lønprocessen endnu' },
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
    return [GATE_QUESTION, OPENING_QUESTION, SIZE_QUESTION]
  }

  if (answers.track === 'non-zenegy') {
    return [GATE_QUESTION, OPENING_QUESTION, SIZE_QUESTION, ...TRACK_B_QUESTIONS, AI_QUESTION, NUMBERS_AWARENESS]
  }

  // zenegy track
  const usesNumbers = answers.a_products?.includes('numbers') ?? false
  return [
    GATE_QUESTION,
    OPENING_QUESTION,
    SIZE_QUESTION,
    ...TRACK_A_QUESTIONS,
    AI_QUESTION,
    ...(usesNumbers ? [] : [NUMBERS_AWARENESS]),
  ]
}
