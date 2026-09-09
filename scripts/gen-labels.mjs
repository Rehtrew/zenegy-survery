/**
 * Generates kinsta/api/labels.php — the Danish wording for the results page.
 *
 * The survey stores option *values* (`we-choose-client-pays`), which is right for
 * analysis and useless to read. The labels already exist in src/lib/questions.ts,
 * so they're extracted from there rather than retyped: bundle the questions
 * module with rolldown (stubbing the logo imports, which Node can't load), read
 * every question, and write the map out as PHP.
 *
 * Run by `npm run build:kinsta`. Commit the generated file — the deploy doesn't
 * need Node on the server.
 */
import { rolldown } from 'rolldown'
import { mkdtemp, writeFile, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')

/**
 * Which question each database column stores. The survey's answer keys and its
 * question ids deliberately differ (b1 → b_payroll_system), so the pairing has
 * to be stated once — here. Everything downstream (which questions the results
 * page shows, in which order, under which heading) is derived from this plus the
 * questions themselves, so a new question can't quietly go missing from the
 * results the way the gate question and the two priority questions did.
 */
const COLUMN_TO_QUESTION = {
  is_employee: 'gate',
  payroll_context: 'context',
  size: 'size',
  b_payroll_system: 'b1',
  b_frustrations: 'b2',
  b_priorities: 'b3',
  b_barriers: 'b4',
  b_switch_intent: 'b5',
  a_products: 'a1',
  a_migration_from: 'a1_migration',
  a_satisfaction: 'a2',
  a_best_thing: 'a3',
  a_nps: 'a4',
  c_client_count: 'c1',
  c_payroll_systems: 'c2',
  c_setup: 'c3',
  c_data_collection: 'c4',
  c_frustrations: 'c5',
  c_priorities: 'c6',
  c_switch_intent: 'c7',
  e_payslip: 'e1',
  e_pain_points: 'e2',
  e_expenses: 'e3',
  e_ai_trust: 'e4',
  ai_interest: 'ai',
  accounting_system: 'numbers',
}

/**
 * The gate is stored as a boolean rather than as its option values, and NPS is a
 * scale with no options at all. Both need their answers spelled out here — and
 * both must skip the option merge below, or the pre-boolean values ('employee',
 * 'decision-maker') would show up as extra rows nobody can ever have chosen.
 */
const GATE_LABELS = { 1: 'Jeg er primært lønmodtager', 0: 'Jeg har (med)ansvar for systemerne' }
const GATE_SUBLABELS = {
  1: 'Jeg modtager lønseddel, men har ikke systemansvar',
  0: 'Direktør, HR, bogholder, ekstern revisor eller administrator',
}
const OWN_VALUES = new Set(['is_employee', 'a_nps'])

/** NPS has no options — the scale is the answer. */
const NPS_LABELS = Object.fromEntries(
  Array.from({ length: 11 }, (_, n) => [n, n === 0 ? '0 (slet ikke)' : n === 10 ? '10 (helt sikkert)' : String(n)]),
)

/**
 * Which respondents saw a question, so the results page can group by segment
 * instead of listing 25 questions in one run.
 */
// Keys are the path set, sorted and joined — the shape seenOn produces.
const GROUPS = {
  'employee': 'Lønmodtagere',
  'a': 'Zenegy-kunder',
  'b': 'Andet lønsystem',
  'c-other': 'Lønbureauer',
  'c-zenegy': 'Lønbureauer',
  'c-other,c-zenegy': 'Lønbureauer',
  'a,b': 'Virksomheder med eget lønsystem',
  'a,c-zenegy': 'Zenegy-brugere (virksomheder og bureauer)',
}
const GROUP_ORDER = [
  'Alle respondenter', 'Alle med systemansvar', 'Virksomheder med eget lønsystem',
  'Zenegy-kunder', 'Zenegy-brugere (virksomheder og bureauer)', 'Andet lønsystem',
  'Lønbureauer', 'Lønmodtagere',
]

/** `track` isn't a question — it's derived from the path the respondent took. */
const TRACK_LABELS = {
  zenegy: 'Zenegy-kunde',
  'non-zenegy': 'Andet lønsystem',
  employee: 'Lønmodtager',
  bureau: 'Lønbureau / lønadministrator',
}

const stubAssets = {
  name: 'stub-assets',
  resolveId(id) {
    return /\.(svg|png|jpe?g|otf|woff2?|css)$/.test(id) ? { id, external: false } : null
  },
  load(id) {
    return /\.(svg|png|jpe?g|otf|woff2?|css)$/.test(id) ? 'export default ""' : null
  },
}

const dir = await mkdtemp(join(tmpdir(), 'survey-labels-'))
try {
  const bundle = await rolldown({
    input: join(root, 'src/lib/questions.ts'),
    plugins: [stubAssets],
    platform: 'node',
  })
  await bundle.write({ dir, format: 'esm', entryFileNames: 'questions.mjs' })
  await bundle.close()

  const questions = await import(join(dir, 'questions.mjs'))
  const { getQuestionSequence } = questions

  // Every path, so questions that only appear on one of them are covered too.
  const paths = [
    { is_employee: true },
    { is_employee: false, payroll_context: 'internal', track: 'zenegy' },
    { is_employee: false, payroll_context: 'internal', track: 'non-zenegy' },
    { is_employee: false, payroll_context: 'bureau', c_payroll_systems: ['zenegy'] },
    { is_employee: false, payroll_context: 'bureau', c_payroll_systems: ['dataloen'] },
  ]
  const PATH_KEYS = ['employee', 'a', 'b', 'c-zenegy', 'c-other']
  const byId = new Map()
  const seenOn = new Map()
  const order = []
  paths.forEach((args, index) => {
    for (const question of getQuestionSequence(args)) {
      if (!byId.has(question.id)) {
        byId.set(question.id, question)
        order.push(question.id)
      }
      const on = seenOn.get(question.id) ?? new Set()
      on.add(PATH_KEYS[index])
      seenOn.set(question.id, on)
    }
  })

  const headings = { track: { short: 'Spor', question: 'Hvilken vej gik respondenten gennem undersøgelsen?' } }
  const values = { track: TRACK_LABELS, is_employee: GATE_LABELS, a_nps: NPS_LABELS }
  const subLabels = { is_employee: GATE_SUBLABELS }
  const questionToColumn = Object.fromEntries(
    Object.entries(COLUMN_TO_QUESTION).map(([column, id]) => [id, column]),
  )
  const groups = new Map([['Alle respondenter', ['track']]])
  for (const [column, questionId] of Object.entries(COLUMN_TO_QUESTION)) {
    const question = byId.get(questionId)
    if (!question) {
      console.warn(`gen-labels: no question "${questionId}" for column ${column}`)
      continue
    }
    headings[column] = { short: question.shortLabel ?? question.question, question: question.question }
    const map = { ...(values[column] ?? {}) }
    const subs = { ...(subLabels[column] ?? {}) }
    for (const option of question.options ?? []) {
      if (OWN_VALUES.has(column)) break
      map[option.value] = option.label
      if (option.subLabel) subs[option.value] = option.subLabel
    }
    if (Object.keys(map).length) values[column] = map
    if (Object.keys(subs).length) subLabels[column] = subs
  }

  // Group every column by who saw it, in the order the survey asks them.
  for (const questionId of order) {
    const column = questionToColumn[questionId]
    if (!column || !headings[column]) continue
    const key = [...(seenOn.get(questionId) ?? [])].sort().join(',')
    const group = key.split(',').length === PATH_KEYS.length ? 'Alle respondenter' : (GROUPS[key] ?? 'Alle med systemansvar')
    groups.set(group, [...(groups.get(group) ?? []), column])
  }
  const orderedGroups = GROUP_ORDER
    .filter(name => groups.has(name))
    .map(name => [name, groups.get(name)])

  const php = (value, indent) => {
    const pad = ' '.repeat(indent)
    const entries = Object.entries(value).map(([k, v]) =>
      typeof v === 'string'
        ? `${pad}'${k.replace(/'/g, "\\'")}' => '${v.replace(/\\/g, '\\\\').replace(/'/g, "\\'")}',`
        : `${pad}'${k}' => [\n${php(v, indent + 4)}\n${pad}],`)
    return entries.join('\n')
  }

  await writeFile(join(root, 'kinsta/api/labels.php'), `<?php
/**
 * Danish wording for the results page — GENERATED by scripts/gen-labels.mjs from
 * src/lib/questions.ts. Don't edit by hand: change the question there and run
 * \`npm run build:kinsta\`.
 *
 * The database stores option values; these are what a human should read.
 */

declare(strict_types=1);

/** Column => { short heading, the question as it was asked }. */
const SURVEY_QUESTION_LABELS = [
${php(headings, 4)}
];

/** Column => stored value => the label the respondent actually clicked. */
const SURVEY_VALUE_LABELS = [
${php(values, 4)}
];

/** The smaller print under an option, where the survey showed one. */
const SURVEY_VALUE_SUBLABELS = [
${php(subLabels, 4)}
];

/** Every question the survey can ask, grouped by who sees it, in survey order. */
const SURVEY_GROUPS = [
${orderedGroups.map(([name, columns]) => `    ['name' => '${name.replace(/'/g, "\\'")}', 'columns' => [${columns.map(c => `'${c}'`).join(', ')}]],`).join('\n')}
];

/** Columns whose options read in their own order rather than by popularity. */
const SURVEY_ORDERED_COLUMNS = ['a_nps'];
`)
  console.log(`Generated kinsta/api/labels.php (${Object.keys(headings).length} questions)`)
} finally {
  await rm(dir, { recursive: true, force: true })
}
