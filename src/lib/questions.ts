import type { Question, SurveyAnswers } from '../types'

export const OPENING_QUESTION: Question = {
  id: 'q0',
  type: 'choice-single',
  question: 'Bruger du Zenegy som dit lønsystem i dag?',
  subText: 'Dit svar afgør hvilke spørgsmål du ser — vi giver dig den mest relevante oplevelse.',
  autoAdvance: true,
  options: [
    { value: 'zenegy', label: 'Ja, jeg bruger Zenegy', subLabel: 'Jeg er eksisterende kunde', emoji: '✅' },
    { value: 'non-zenegy', label: 'Nej, jeg bruger et andet system', subLabel: 'Dataløn, Bluegarden, Lessor, eller andet', emoji: '🔍' },
  ],
}

const NUMBERS_AWARENESS: Question = {
  id: 'numbers',
  type: 'logo-grid',
  question: 'Hvilket regnskabssystem bruger du i dag?',
  subText: 'Vi er nysgerrige — ikke på jagt efter salg. 🙂',
  autoAdvance: true,
  options: [
    { value: 'e-conomic', label: 'e-conomic', logoInitials: 'ec', logoStyle: { background: 'linear-gradient(135deg,#0057B8,#004499)' } },
    { value: 'dinero', label: 'Dinero', logoInitials: 'Di', logoStyle: { background: 'linear-gradient(135deg,#FF6B2B,#E55520)' } },
    { value: 'billy', label: 'Billy', logoInitials: 'Bi', logoStyle: { background: 'linear-gradient(135deg,#FFD700,#CCA800)', color: '#1a1a2e' } },
    { value: 'uniconta', label: 'Uniconta', logoInitials: 'Un', logoStyle: { background: 'linear-gradient(135deg,#2C5282,#1A365D)' } },
    { value: 'visma', label: 'Visma', logoInitials: 'Vi', logoStyle: { background: 'linear-gradient(135deg,#006FB4,#005288)' } },
    { value: 'zenegy-numbers', label: 'Zenegy Numbers', logoInitials: 'Ze', logoStyle: { background: 'linear-gradient(135deg,#00C896,#00A07A)' } },
    { value: 'andet', label: 'Andet', logoInitials: '?', logoStyle: { background: 'linear-gradient(135deg,#9CA3AF,#6B7280)' } },
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
      { value: 'dataloen', label: 'Dataløn', subLabel: 'by Visma', logoInitials: 'DL', logoStyle: { background: 'linear-gradient(135deg,#0052CC,#0747A6)' } },
      { value: 'bluegarden', label: 'Bluegarden', logoInitials: 'BG', logoStyle: { background: 'linear-gradient(135deg,#1B3E7B,#2557B0)' } },
      { value: 'lessor', label: 'Lessor', logoInitials: 'Le', logoStyle: { background: 'linear-gradient(135deg,#E85D26,#C94A1A)' } },
      { value: 'intect', label: 'Intect', logoInitials: 'In', logoStyle: { background: 'linear-gradient(135deg,#6B2D8B,#4A1F63)' } },
      { value: 'sd-loen', label: 'SD Løn', logoInitials: 'SD', logoStyle: { background: 'linear-gradient(135deg,#D62D20,#A51F15)' } },
      { value: 'danloen', label: 'Danløn', logoInitials: 'Dn', logoStyle: { background: 'linear-gradient(135deg,#1E3A5F,#152B47)' } },
      { value: 'zenegy', label: 'Zenegy', logoInitials: 'Ze', logoStyle: { background: 'linear-gradient(135deg,#00C896,#00A07A)' } },
      { value: 'andet', label: 'Andet', logoInitials: '?', logoStyle: { background: 'linear-gradient(135deg,#9CA3AF,#6B7280)' } },
    ],
  },
  {
    id: 'b2',
    type: 'pill-select',
    question: 'Hvad frustrerer dig mest ved dit nuværende lønsystem?',
    subText: 'Vær ærlig — det er præcis den slags input vi har brug for. Vælg alle der passer.',
    options: [
      { value: 'price', label: '💸 Prisen er for høj' },
      { value: 'slow', label: '🐢 Det er langsomt og tungt' },
      { value: 'ui', label: '😵 Brugergrænsefladen er forvirrende' },
      { value: 'integrations', label: '🔗 Dårlige integrationer' },
      { value: 'support', label: '🆘 Support er svær at komme igennem til' },
      { value: 'features', label: '🧾 Mangler features jeg har brug for' },
      { value: 'slow-payroll', label: '⏱️ Lønkørsel tager for lang tid' },
      { value: 'no-app', label: '📱 Ingen god mobilapp' },
      { value: 'satisfied', label: '😐 Faktisk ikke noget — jeg er tilfreds' },
    ],
  },
  {
    id: 'b3',
    type: 'priority-rank',
    question: 'Hvad er vigtigst for dig i et lønsystem?',
    subText: 'Klik for at markere dine top 3 — i prioriteret rækkefølge. Hvad ville du betale mest for?',
    maxRank: 3,
    options: [
      { value: 'price', label: '💰 Pris og value for money' },
      { value: 'ux', label: '✨ Enkel og intuitiv brugerflade' },
      { value: 'integrations', label: '🔗 Integrationer (bank, HR, regnskab)' },
      { value: 'compliance', label: '🎯 Compliance og automatisk SKAT-indberetning' },
      { value: 'support', label: '🆘 God og hurtig kundesupport' },
      { value: 'mobile', label: '📱 Mobilapp til medarbejdere' },
      { value: 'features', label: '⚡ Features og automatisering' },
    ],
  },
  {
    id: 'b4',
    type: 'pill-select',
    question: 'Hvad holder dig tilbage fra at skifte lønsystem?',
    subText: 'Ærlighed hjælper os med at forstå markedet bedre — der er ingen forkerte svar.',
    options: [
      { value: 'transition', label: '😰 Overgangen virker for besværlig' },
      { value: 'time', label: '⌛ Vi har ikke tid til at implementere nyt' },
      { value: 'faith', label: '💡 Jeg tror mit system bliver bedre' },
      { value: 'cost', label: '💰 Skifteomkostningerne er for høje' },
      { value: 'unknown', label: '🤷 Jeg kender ikke alternativerne godt nok' },
      { value: 'accountant', label: '👥 Det er min revisor/bogholder der beslutter' },
      { value: 'happy', label: '😊 Jeg er faktisk tilfreds — skifter ikke' },
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
      { value: 'payroll', label: 'Løn', subLabel: 'Lønkørsel og lønsedler', emoji: '💼' },
      { value: 'numbers', label: 'Numbers', subLabel: 'Bogføring og regnskab', emoji: '📊' },
      { value: 'expense', label: 'Expense', subLabel: 'Udlæg og kvitteringer', emoji: '🧾' },
      { value: 'time', label: 'Time', subLabel: 'Tidsregistrering og fravær', emoji: '⏱️' },
    ],
  },
  {
    id: 'a2',
    type: 'emoji-rating',
    question: 'Hvor tilfreds er du med Zenegy overordnet?',
    subText: 'Tænk på din daglige oplevelse — ikke kun onboarding.',
    autoAdvance: true,
    options: [
      { value: 'unhappy', label: 'Ikke tilfreds', emoji: '😤' },
      { value: 'meh', label: 'Det går', emoji: '😐' },
      { value: 'happy', label: 'Tilfreds', emoji: '😊' },
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
      { value: 'speed', label: '🚀 Det er hurtigt og nemt at køre løn' },
      { value: 'price', label: '💰 Prisen er rigtig' },
      { value: 'integrations', label: '🔗 Integrationer med mine andre systemer' },
      { value: 'support', label: '🆘 Support der rent faktisk hjælper' },
      { value: 'all-in-one', label: '📊 Alt samlet ét sted (løn + Numbers)' },
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

export function getQuestionSequence(
  answers: Pick<SurveyAnswers, 'track' | 'a_products'>
): Question[] {
  if (!answers.track) return [OPENING_QUESTION]

  if (answers.track === 'non-zenegy') {
    return [OPENING_QUESTION, ...TRACK_B_QUESTIONS, NUMBERS_AWARENESS]
  }

  const usesNumbers = answers.a_products?.includes('numbers') ?? false
  return [
    OPENING_QUESTION,
    ...TRACK_A_QUESTIONS,
    ...(usesNumbers ? [] : [NUMBERS_AWARENESS]),
  ]
}
