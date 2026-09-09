import type { CSSProperties } from 'react'
import type { Option, Question, SurveyAnswers } from '../types'
import datalonenLogo from '../assets/logos/dataloen.svg'
import lessorLogo from '../assets/logos/lessor.svg'
import intectLogo from '../assets/logos/intect.png'
import danloenLogo from '../assets/logos/danloen.svg'
import economicLogo from '../assets/logos/economic.png'
import dineroLogo from '../assets/logos/dinero.png'
import billyLogo from '../assets/logos/billy.png'
import unicontaLogo from '../assets/logos/uniconta.png'
import vismaLogo from '../assets/logos/visma.png'
import zenegyLogo from '../assets/logos/zenegy.svg'
import excelLogo from '../assets/logos/excel.svg'
import salaryLogo from '../assets/logos/salary.png'
import dataloenBrancheLogo from '../assets/logos/dataloen-branche.svg'
import egLogo from '../assets/logos/eg.svg'
import integaLogo from '../assets/logos/intega.png'
import kmdLogo from '../assets/logos/kmd.svg'
import payrollIcon from '../assets/products/payroll.png'
import numbersIcon from '../assets/products/numbers.png'
import expenseIcon from '../assets/products/expense.png'
import timeIcon from '../assets/products/time.png'

/**
 * The Danish payroll systems respondents can pick from — one list, reused by the
 * "which system do you use" (b1), "which systems do you work in" (c2) and "which
 * system did you come from" (a1_migration) questions so the options can never
 * drift apart between tracks.
 *
 * Names follow what the systems are called in the market today (sales review,
 * 2026-09): Bluegarden is Visma Dataløn, ProLøn is Dataløn Branche, Visma Løn is
 * Intega Løn, and Lessor is a Paychex brand. Values are stable ids — renaming a
 * label never changes the data we've already collected.
 */
const NO_LOGO: CSSProperties = { background: 'linear-gradient(135deg,#5b6270,#343a45)' }

const PAYROLL_SYSTEMS: Option[] = [
  { value: 'dataloen', label: 'Visma Dataløn', subLabel: 'tidl. Bluegarden', logoSrc: datalonenLogo },
  { value: 'danloen', label: 'Danløn', logoSrc: danloenLogo },
  { value: 'lessor', label: 'Lessor', subLabel: 'by Paychex', logoSrc: lessorLogo },
  { value: 'intect', label: 'Intect', logoSrc: intectLogo },
  { value: 'salary', label: 'Salary', subLabel: 'nu Shine Salary', logoSrc: salaryLogo },
  { value: 'dataloen-branche', label: 'Dataløn Branche', subLabel: 'tidl. ProLøn', logoSrc: dataloenBrancheLogo },
  { value: 'letloen', label: 'LetLøn', logoInitials: 'LL', logoStyle: NO_LOGO },
  { value: 'eg-loen', label: 'EG Løn', subLabel: 'EG Lønservice', logoSrc: egLogo },
  { value: 'intega', label: 'Intega Løn', subLabel: 'tidl. Visma Løn', logoSrc: integaLogo },
  { value: 'kmd', label: 'KMD Løn', logoSrc: kmdLogo },
  { value: 'epos', label: 'Epos', subLabel: 'Azets', logoInitials: 'E', logoStyle: NO_LOGO },
]

const EXCEL_OPTION: Option = { value: 'excel', label: 'Excel / manuelt', logoSrc: excelLogo }
const OTHER_OPTION: Option = {
  value: 'andet', label: 'Andet',
  logoInitials: '?', logoStyle: { background: 'linear-gradient(135deg,#616161,#323232)' },
}

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

/**
 * Splits decision-makers into "runs payroll for my own company" and "runs payroll
 * for other companies" (accountants, bookkeepers, payroll bureaus). The latter buy,
 * evaluate and switch payroll systems on behalf of many companies at once, so they
 * get their own track — see TRACK_C_QUESTIONS.
 */
export const CONTEXT_QUESTION: Question = {
  id: 'context',
  type: 'choice-single',
  question: 'Kører du løn for din egen virksomhed eller for andres?',
  shortLabel: 'Din hverdag',
  subText: 'Vi spørger, fordi hverdagen ser helt forskellig ud, alt efter om du sidder internt eller håndterer løn for kunder.',
  autoAdvance: true,
  options: [
    { value: 'internal', label: 'Kun for min egen virksomhed', subLabel: 'Jeg sidder internt som direktør, HR, bogholder eller økonomiansvarlig' },
    { value: 'bureau', label: 'For andre virksomheder (lønadministrator)', subLabel: 'Revisor, bogholder eller lønbureau, der kører løn for kunder' },
    { value: 'both', label: 'Begge dele', subLabel: 'Både min egen virksomhed og et antal kunder' },
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
    { value: 'non-zenegy', label: 'Nej, vi bruger et andet system', subLabel: 'Visma Dataløn, Danløn, Lessor, Intect, Salary eller lignende', iconName: 'other-system' },
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
  subText: 'Vi er nysgerrige, ikke på jagt efter salg.',
  autoAdvance: true,
  options: [
    { value: 'e-conomic', label: 'e-conomic', logoSrc: economicLogo },
    { value: 'dinero', label: 'Dinero', logoSrc: dineroLogo },
    { value: 'billy', label: 'Billy', subLabel: 'nu Shine', logoSrc: billyLogo },
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
    options: [...PAYROLL_SYSTEMS, EXCEL_OPTION, OTHER_OPTION],
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
      { value: 'satisfied', label: 'Faktisk ingenting, jeg er tilfreds', iconName: 'smile' },
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
      { value: 'happy-staying', label: 'Vi er tilfredse, så et skifte er ikke aktuelt', iconName: 'smile' },
      { value: 'other', label: 'Andet', iconName: 'pencil' },
    ],
  },
  {
    id: 'b5',
    type: 'choice-single',
    question: 'Overvejer I at skifte lønsystem inden for det næste år?',
    shortLabel: 'Skifteplaner',
    subText: 'Helt uforpligtende. Vi er bare nysgerrige.',
    autoAdvance: true,
    options: [
      { value: 'actively', label: 'Ja, vi kigger aktivt på alternativer' },
      { value: 'maybe', label: 'Måske, det er ikke udelukket' },
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
      ...PAYROLL_SYSTEMS,
      EXCEL_OPTION,
      { value: 'startup', label: 'Direkte til Zenegy', logoSrc: zenegyLogo },
      OTHER_OPTION,
    ],
  },
  {
    id: 'a2',
    type: 'emoji-rating',
    question: 'Hvor tilfreds er du med Zenegy i hverdagen?',
    shortLabel: 'Tilfredshed',
    subText: 'Tænk på den generelle oplevelse, ikke kun onboarding.',
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
    subText: 'Det her måler noget andet end tilfredshed, nemlig om du ville sætte dit navn på en anbefaling.',
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
      { value: 'no-mobile-access', label: 'Mangel på en app, så jeg skal klare alt fra en computer', iconName: 'smartphone' },
      { value: 'none', label: 'Ingen, det fungerer fint', iconName: 'smile' },
    ],
  },
  {
    id: 'e3',
    type: 'choice-single',
    question: 'Hvis du laver et udlæg, hvor lang tid bruger du i gennemsnit på at registrere det?',
    shortLabel: 'Udlægsregistrering',
    autoAdvance: true,
    options: [
      { value: 'seconds', label: 'Få sekunder: et billede i en app, så er det klaret' },
      { value: 'minutes', label: 'Et par minutter: en formular online' },
      { value: 'heavy-process', label: 'Længere: gemme kvittering, printe eller sende mail' },
      { value: 'not-relevant', label: 'Ikke relevant, jeg har ikke udlæg' },
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

/** Bureau version of the accounting-system question — asked across their client base. */
const NUMBERS_AWARENESS_BUREAU: Question = {
  ...NUMBERS_AWARENESS,
  question: 'Hvilket regnskabssystem arbejder du mest i for dine kunder?',
  subText: 'Vælg det, du bruger på flest kunder. Vi er nysgerrige, ikke på jagt efter salg.',
}

/**
 * Track C — accountants, bookkeepers and payroll bureaus who run payroll for
 * client companies. Their buying situation is different from an internal payroll
 * owner: they work across many companies (often across several payroll systems),
 * they rarely own the data, they frequently pick the system on the client's behalf,
 * and most of their time goes to collecting payroll data from clients rather than
 * to the payroll run itself. The questions below are ordered to mirror that:
 * portfolio → systems → commercial setup → workflow → priorities → switching.
 */
export const TRACK_C_QUESTIONS: Question[] = [
  {
    id: 'c1',
    type: 'choice-single',
    question: 'Hvor mange virksomheder kører du løn for i dag?',
    shortLabel: 'Antal kunder',
    subText: 'Tæl de kunder, du selv står for lønnen på, også de helt små.',
    autoAdvance: true,
    options: [
      { value: '1-5', label: '1–5 kunder' },
      { value: '6-20', label: '6–20 kunder' },
      { value: '21-50', label: '21–50 kunder' },
      { value: '51-100', label: '51–100 kunder' },
      { value: '100+', label: 'Over 100 kunder' },
    ],
  },
  {
    id: 'c2',
    type: 'logo-grid-multi',
    question: 'Hvilke lønsystemer arbejder du i for dine kunder?',
    shortLabel: 'Lønsystemer',
    subText: 'Vælg alle, du bruger i dag, også dem du kun har en enkelt kunde i.',
    options: [
      ...PAYROLL_SYSTEMS,
      { value: 'zenegy', label: 'Zenegy', logoSrc: zenegyLogo },
      EXCEL_OPTION,
      OTHER_OPTION,
    ],
  },
  {
    id: 'c3',
    type: 'choice-single',
    question: 'Hvem bestemmer lønsystemet, og hvem betaler for det?',
    shortLabel: 'Aftalen med kunden',
    subText: 'Vælg det, der passer på flest af dine kunder.',
    autoAdvance: true,
    options: [
      { value: 'we-choose-we-pay', label: 'Vi vælger systemet og har abonnementet', subLabel: 'Vi fakturerer kunden for lønnen, og kunden ser sjældent systemet' },
      { value: 'we-choose-client-pays', label: 'Vi vælger systemet, kunden har abonnementet', subLabel: 'Kunden betaler selv, men følger vores anbefaling' },
      { value: 'client-chose', label: 'Kunden har valgt systemet', subLabel: 'Vi arbejder i det, kunden allerede har' },
      { value: 'mixed', label: 'Det er helt forskelligt fra kunde til kunde', subLabel: 'Ingen fast model' },
    ],
  },
  {
    id: 'c4',
    type: 'tile-select',
    question: 'Hvordan får du løndata fra dine kunder?',
    shortLabel: 'Løndata fra kunder',
    subText: 'Timer, tillæg, fravær og ændringer. Vælg alle de måder, det sker på i dag.',
    openTextPlaceholder: 'Hvordan kommer data ellers ind?',
    options: [
      { value: 'email-excel', label: 'På mail, typisk et Excel-ark eller en besked', iconName: 'mail' },
      { value: 'client-portal', label: 'Kunden taster selv ind i lønsystemet eller en portal', iconName: 'layout' },
      { value: 'time-system', label: 'Automatisk fra et tidsregistreringssystem', iconName: 'clock' },
      { value: 'messages', label: 'Telefon, SMS eller løse beskeder', iconName: 'chat' },
      { value: 'paper', label: 'Papir, scannede sedler eller PDF\'er', iconName: 'file-text' },
      { value: 'i-collect', label: 'Jeg finder og taster det selv ud fra bilag og systemer', iconName: 'pencil' },
      { value: 'other', label: 'Andet', iconName: 'search' },
    ],
  },
  {
    id: 'c5',
    type: 'tile-select',
    question: 'Hvad tager mest tid eller giver flest frustrationer i lønarbejdet for dine kunder?',
    shortLabel: 'Tidsrøvere',
    subText: 'Vælg alle der passer. Det er præcis den slags input, vi har brug for.',
    openTextPlaceholder: 'Er der andet, der stjæler tid i hverdagen?',
    options: [
      { value: 'chasing-data', label: 'At jage løndata og svar hos kunderne inden deadline', iconName: 'clock' },
      { value: 'many-systems', label: 'At skulle arbejde i flere forskellige lønsystemer', iconName: 'layers' },
      { value: 'switching-clients', label: 'Skift mellem kunder, logins og faner', iconName: 'repeat' },
      { value: 'client-onboarding', label: 'At sætte nye kunder op med lønarter, overenskomst og pension', iconName: 'feature' },
      { value: 'no-bulk-actions', label: 'Manglende massehandlinger, så jeg gentager det samme kunde for kunde', iconName: 'hourglass' },
      { value: 'approval-trail', label: 'Godkendelse og dokumentation af, hvad kunden har godkendt', iconName: 'shield' },
      { value: 'reconciliation', label: 'Afstemning og bogføring af lønnen i regnskabssystemet', iconName: 'calculator' },
      { value: 'employee-questions', label: 'Spørgsmål fra kundernes medarbejdere', iconName: 'chat' },
      { value: 'price-margin', label: 'Prisen pr. lønseddel presser min indtjening', iconName: 'tag' },
      { value: 'other', label: 'Andet', iconName: 'pencil' },
    ],
  },
  {
    id: 'c6',
    type: 'priority-rank',
    question: 'Hvad vejer tungest, når du vælger lønsystem til dine kunder?',
    shortLabel: 'Prioriteter',
    subText: 'Markér de 3 vigtigste i prioriteret rækkefølge.',
    maxRank: 3,
    options: [
      { value: 'one-login', label: 'Ét login og overblik på tværs af alle kunder' },
      { value: 'bulk-actions', label: 'Massehandlinger, så flere kunder klares i ét flow' },
      { value: 'client-self-service', label: 'At kunden selv leverer og godkender løndata' },
      { value: 'integrations', label: 'Automatisk bogføring og integration til regnskabssystemet' },
      { value: 'expert-support', label: 'Support med lønfaglig viden, når reglerne er svære' },
      { value: 'partner-economics', label: 'Pris og marginer på partneraftalen' },
      { value: 'easy-onboarding', label: 'Nem opsætning og migrering af en ny kunde' },
      { value: 'compliance', label: 'Sikkerhed, GDPR og revisionsspor' },
    ],
  },
]

/** Asked when the bureau doesn't work in Zenegy today — mirrors b5 for a portfolio. */
const C_SWITCH_INTENT: Question = {
  id: 'c7',
  type: 'choice-single',
  question: 'Overvejer du at flytte kunder til et andet lønsystem inden for det næste år?',
  shortLabel: 'Skifteplaner',
  subText: 'Helt uforpligtende. Vi er bare nysgerrige.',
  autoAdvance: true,
  options: [
    { value: 'actively-consolidating', label: 'Ja, jeg leder efter ét system til så mange kunder som muligt' },
    { value: 'actively-some', label: 'Ja, for enkelte kunder' },
    { value: 'maybe', label: 'Måske, det er ikke udelukket' },
    { value: 'no', label: 'Nej, ikke lige nu' },
  ],
}

/**
 * Asked when Zenegy is one of the systems the bureau works in (c2). Reuses the
 * a2/a4 ids on purpose so satisfaction and NPS stay comparable with track A —
 * only the wording is tuned to someone working across a client portfolio.
 */
const C_ZENEGY_QUESTIONS: Question[] = [
  {
    id: 'a2',
    type: 'emoji-rating',
    question: 'Hvor tilfreds er du med Zenegy i dit daglige arbejde med kunder?',
    shortLabel: 'Tilfredshed',
    subText: 'Tænk på oplevelsen på tværs af dine kunder, ikke kun en enkelt lønkørsel.',
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
    id: 'a4',
    type: 'nps-scale',
    question: 'Ville du anbefale Zenegy til en kollega i branchen?',
    shortLabel: 'Anbefaling',
    subText: 'Det her måler noget andet end tilfredshed, nemlig om du ville sætte dit navn på en anbefaling.',
    hasOpenText: true,
    openTextLabel: 'Hvad skal der til, før du flytter flere kunder over på Zenegy? (valgfrit)',
    openTextPlaceholder: 'Din feedback går direkte til vores produktteam...',
  },
]

/** Bureau version of the AI question — framed around client work, not one company. */
const AI_QUESTION_BUREAU: Question = {
  id: 'ai',
  type: 'choice-single',
  question: 'Hvor ser du det største potentiale for AI i lønarbejdet for dine kunder?',
  shortLabel: 'AI-potentiale',
  subText: 'Hvilken opgave ville du helst lade en pålidelig algoritme klare?',
  autoAdvance: true,
  options: [
    { value: 'bureau-anomaly-detection', label: 'Automatisk kontrol af lønkørslen, før den sendes til godkendelse' },
    { value: 'bureau-data-entry', label: 'Indlæsning af timer og bilag, jeg i dag taster manuelt' },
    { value: 'bureau-client-questions', label: 'Svar på kundernes spørgsmål om løn, ferie og regler' },
    { value: 'bureau-client-onboarding', label: 'Opsætning af nye kunder med lønarter og overenskomster' },
    { value: 'bureau-not-ready', label: 'Jeg er ikke tryg ved AI i mine kunders løndata' },
  ],
}

/** True when the respondent runs payroll for client companies (track C). */
export function isBureau(context?: SurveyAnswers['payroll_context']): boolean {
  return context === 'bureau' || context === 'both'
}

export function getQuestionSequence(
  answers: Pick<SurveyAnswers, 'track' | 'a_products' | 'is_employee' | 'payroll_context' | 'c_payroll_systems'>
): Question[] {
  // Employee track
  if (answers.is_employee) {
    return [GATE_QUESTION, ...EMPLOYEE_QUESTIONS]
  }

  // No gate answer yet
  if (answers.is_employee === undefined && !answers.track) {
    return [GATE_QUESTION]
  }

  // Gate answered as decision-maker — ask whether they run payroll for their own
  // company or for clients before branching any further.
  if (!answers.payroll_context) {
    return [GATE_QUESTION, CONTEXT_QUESTION]
  }

  // Track C — bureaus (accountants, bookkeepers, payroll bureaus)
  if (isBureau(answers.payroll_context)) {
    const usesZenegy = answers.c_payroll_systems?.includes('zenegy') ?? false
    return [
      GATE_QUESTION,
      CONTEXT_QUESTION,
      ...TRACK_C_QUESTIONS,
      ...(usesZenegy ? C_ZENEGY_QUESTIONS : [C_SWITCH_INTENT]),
      AI_QUESTION_BUREAU,
      NUMBERS_AWARENESS_BUREAU,
    ]
  }

  // Internal decision-maker: no payroll-system track selected yet
  if (!answers.track) {
    return [GATE_QUESTION, CONTEXT_QUESTION, OPENING_QUESTION, SIZE_QUESTION]
  }

  if (answers.track === 'non-zenegy') {
    return [GATE_QUESTION, CONTEXT_QUESTION, OPENING_QUESTION, SIZE_QUESTION, ...TRACK_B_QUESTIONS, AI_QUESTION, NUMBERS_AWARENESS]
  }

  // zenegy track
  const usesNumbers = answers.a_products?.includes('numbers') ?? false
  return [
    GATE_QUESTION,
    CONTEXT_QUESTION,
    OPENING_QUESTION,
    SIZE_QUESTION,
    ...TRACK_A_QUESTIONS,
    AI_QUESTION,
    ...(usesNumbers ? [] : [NUMBERS_AWARENESS]),
  ]
}
