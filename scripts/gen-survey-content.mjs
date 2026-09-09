/**
 * Regenerates SURVEY_CONTENT.md from src/lib/questions.ts, so the written record
 * of the survey can't drift from what respondents actually see. Same rolldown
 * trick as gen-labels.mjs: bundle the questions module with the asset imports
 * stubbed, then read the questions straight out of it.
 *
 *   node scripts/gen-survey-content.mjs
 */
import { rolldown } from 'rolldown'
import { mkdtemp, writeFile, readFile, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const assets = /\.(svg|png|jpe?g|otf|woff2?|css)$/

const dir = await mkdtemp(join(tmpdir(), 'survey-content-'))
try {
  const bundle = await rolldown({
    input: join(root, 'src/lib/questions.ts'),
    platform: 'node',
    plugins: [{
      name: 'stub-assets',
      resolveId: id => (assets.test(id) ? { id, external: false } : null),
      load: id => (assets.test(id) ? 'export default ""' : null),
    }],
  })
  await bundle.write({ dir, format: 'esm', entryFileNames: 'questions.mjs' })
  await bundle.close()
  const { getQuestionSequence } = await import(join(dir, 'questions.mjs'))

  const PATHS = [
    { title: 'Medarbejder', args: { is_employee: true } },
    { title: 'A · Intern, bruger Zenegy', args: { is_employee: false, payroll_context: 'internal', track: 'zenegy' } },
    { title: 'B · Intern, andet system', args: { is_employee: false, payroll_context: 'internal', track: 'non-zenegy' } },
    { title: 'C · Bureau, arbejder i Zenegy', args: { is_employee: false, payroll_context: 'bureau', c_payroll_systems: ['zenegy'] } },
    { title: 'C · Bureau, ikke Zenegy', args: { is_employee: false, payroll_context: 'bureau', c_payroll_systems: ['dataloen'] } },
  ]

  const overview = []
  const seen = new Map()
  for (const { title, args } of PATHS) {
    const seq = getQuestionSequence(args)
    overview.push(`\n### ${title} (${seq.length} spørgsmål)\n`, '| # | ID | Spørgsmål | Type |', '|---|----|-----------|------|')
    seq.forEach((q, i) => {
      overview.push(`| ${i + 1} | \`${q.id}\` | ${q.question} | ${q.type}${q.hasOpenText ? ' + fritekst' : ''} |`)
      const key = `${q.id}::${q.question}`
      if (seen.has(key)) seen.get(key).paths.push(title)
      else seen.set(key, { q, paths: [title] })
    })
  }

  const detail = [...seen.values()].map(({ q, paths }) => {
    const lines = [`### \`${q.id}\` · ${q.shortLabel ?? q.question}`, '']
    lines.push(`**Type:** ${q.type}${q.autoAdvance ? ' (auto-advance)' : ''}  `, `**Vises for:** ${paths.join(', ')}`, '')
    lines.push(`> ${q.question}`, '')
    if (q.subText) lines.push(`*${q.subText}*`, '')
    if (q.maxRank) lines.push(`**Max rank:** ${q.maxRank}`, '')
    if (q.hasOpenText || q.openTextPlaceholder) {
      if (q.openTextLabel) lines.push(`**Fritekst-label:** ${q.openTextLabel}  `)
      if (q.openTextPlaceholder) lines.push(`**Fritekst-placeholder:** ${q.openTextPlaceholder}  `)
      if (q.openTextMaxLength) lines.push(`**Max længde:** ${q.openTextMaxLength}`)
      lines.push('')
    }
    if (q.options?.length) {
      lines.push('| Value | Label | Sublabel |', '|-------|-------|----------|')
      for (const o of q.options) lines.push(`| \`${o.value}\` | ${o.label} | ${o.subLabel ?? ''} |`)
      lines.push('')
    }
    return lines.join('\n')
  }).join('\n---\n\n')

  const path = join(root, 'SURVEY_CONTENT.md')
  const doc = await readFile(path, 'utf8')
  const head = doc.slice(0, doc.indexOf('## Alle spørgsmål, sti for sti'))
  const tail = doc.slice(doc.indexOf('\n---\n\n## Routing'))
  await writeFile(path, `${head}## Alle spørgsmål, sti for sti

Hver respondent ser én af stierne herunder. Ingen ser dem alle. Ordlyd og
svarmuligheder står længere nede under **Spørgsmål**.
${overview.join('\n')}

---

## Spørgsmål

${detail}${tail}`)
  console.log(`Regenerated SURVEY_CONTENT.md (${seen.size} questions)`)
} finally {
  await rm(dir, { recursive: true, force: true })
}
