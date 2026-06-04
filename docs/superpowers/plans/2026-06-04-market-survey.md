# Zenegy Market Survey Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a full-screen, Typeform-style Danish market survey with branched question tracks, Supabase persistence, and iPad contest lead gen.

**Architecture:** Single-page React app with no router — a phase state machine (`landing → questions → lead-gen → thank-you`) manages all screen transitions. Input components are stateless; all survey answers live in `SurveyFlow`. The question sequence is a pure function of answers, enabling conditional branching. CSS keyframe animations handle slide transitions between questions.

**Tech Stack:** React 18 + Vite + TypeScript + Tailwind CSS 3 + Supabase JS v2 + Vitest + React Testing Library

---

## File Map

```
src/
  types.ts                          # All shared TypeScript interfaces
  App.tsx                           # Root: renders SurveyFlow
  main.tsx                          # Entry point
  index.css                         # Tailwind + custom keyframe animations
  lib/
    questions.ts                    # Question data + getQuestionSequence()
    supabase.ts                     # Supabase client + submitSurvey()
    useKeyboard.ts                  # Keyboard shortcut hook
  components/
    SurveyShell.tsx                 # Header, progress bar, animation wrapper
    QuestionRenderer.tsx            # Routes question.type → input component
    inputs/
      ChoiceList.tsx                # Single/multi radio+checkbox list
      LogoGrid.tsx                  # 4-col logo card grid
      PillSelect.tsx                # Tag/pill multi-select
      EmojiRating.tsx               # Large emoji single-select
      PriorityRank.tsx              # Click-to-rank (1st/2nd/3rd)
      NPSScale.tsx                  # 0–10 NPS number buttons
      OpenText.tsx                  # Optional free-text textarea
  screens/
    LandingPage.tsx                 # Hero + perks before Q0
    SurveyFlow.tsx                  # Orchestrates all phases + answers
    LeadGen.tsx                     # Email + newsletter + book demo
    ThankYou.tsx                    # Post-submit confirmation
  test/
    setup.ts                        # jest-dom import
supabase/
  migrations/
    001_create_submissions.sql      # DB schema
vite.config.ts
tailwind.config.ts
.env.example
vercel.json
```

---

## Task 1: Scaffold project

**Files:**
- Create: `vite.config.ts`
- Create: `tailwind.config.ts`
- Create: `postcss.config.js`
- Create: `src/index.css`
- Create: `src/test/setup.ts`
- Create: `.env.example`
- Create: `.gitignore`

- [ ] **Step 1: Scaffold Vite + React + TypeScript**

```bash
cd /Users/chw/Documents/Development/zenegy/market_survey
npm create vite@latest . -- --template react-ts
```

Expected: prompts skipped (`.` means current dir), files created: `src/App.tsx`, `src/main.tsx`, `index.html`, `tsconfig.json`, `vite.config.ts`

- [ ] **Step 2: Install dependencies**

```bash
npm install
npm install -D tailwindcss@3 postcss autoprefixer
npm install -D vitest @vitest/coverage-v8 @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom
npm install @supabase/supabase-js
npx tailwindcss init -p
```

- [ ] **Step 3: Replace `tailwind.config.js` with `tailwind.config.ts`**

Delete `tailwind.config.js`, create `tailwind.config.ts`:

```ts
import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: '#00C896', dark: '#00A07A', light: '#F0FDF9' },
        'app-bg': '#F5F6FA',
        'text-main': '#1a1a2e',
        'text-muted': '#6B7280',
        'app-border': '#E8EAED',
        'dark-bg': '#1a1a2e',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
    },
  },
  plugins: [],
} satisfies Config
```

- [ ] **Step 4: Replace `src/index.css`**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');

@keyframes slide-in-right {
  from { transform: translateX(56px); opacity: 0; }
  to   { transform: translateX(0);    opacity: 1; }
}
@keyframes slide-out-left {
  from { transform: translateX(0);     opacity: 1; }
  to   { transform: translateX(-56px); opacity: 0; }
}
@keyframes slide-in-left {
  from { transform: translateX(-56px); opacity: 0; }
  to   { transform: translateX(0);     opacity: 1; }
}
@keyframes slide-out-right {
  from { transform: translateX(0);    opacity: 1; }
  to   { transform: translateX(56px); opacity: 0; }
}
@keyframes check-pop {
  0%   { transform: scale(0.6); opacity: 0; }
  60%  { transform: scale(1.15); }
  100% { transform: scale(1);   opacity: 1; }
}

.anim-slide-in-right  { animation: slide-in-right  300ms ease-out both; }
.anim-slide-out-left  { animation: slide-out-left  300ms ease-out both; }
.anim-slide-in-left   { animation: slide-in-left   300ms ease-out both; }
.anim-slide-out-right { animation: slide-out-right 300ms ease-out both; }
.anim-check-pop       { animation: check-pop       400ms ease-out both; }
```

- [ ] **Step 5: Update `vite.config.ts` to include Vitest config**

```ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    globals: true,
  },
})
```

- [ ] **Step 6: Create `src/test/setup.ts`**

```ts
import '@testing-library/jest-dom'
```

- [ ] **Step 7: Add `"types": ["vitest/globals"]` to `tsconfig.json` compilerOptions**

Open `tsconfig.json`, add to the `compilerOptions` object:
```json
"types": ["vitest/globals"]
```

- [ ] **Step 8: Create `.env.example`**

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

- [ ] **Step 9: Verify dev server**

```bash
npm run dev
```

Expected: Vite server at `http://localhost:5173`, no errors in terminal.

- [ ] **Step 10: Commit**

```bash
git add -A
git commit -m "feat: scaffold Vite + React + Tailwind + Vitest"
```

---

## Task 2: TypeScript types

**Files:**
- Create: `src/types.ts`

- [ ] **Step 1: Write `src/types.ts`**

```ts
export type Track = 'zenegy' | 'non-zenegy'

export type QuestionType =
  | 'choice-single'
  | 'choice-multi'
  | 'logo-grid'
  | 'pill-select'
  | 'emoji-rating'
  | 'priority-rank'
  | 'nps-scale'

export interface Option {
  value: string
  label: string
  subLabel?: string
  emoji?: string
  logoInitials?: string
  logoStyle?: React.CSSProperties
}

export interface Question {
  id: string
  type: QuestionType
  question: string
  subText: string
  options?: Option[]
  autoAdvance?: boolean
  hasOpenText?: boolean
  openTextLabel?: string
  openTextPlaceholder?: string
  openTextMaxLength?: number
  maxRank?: number
}

export interface RankEntry {
  rank: number
  value: string
}

export interface SurveyAnswers {
  track?: Track
  // Track B
  b_payroll_system?: string
  b_payroll_other?: string
  b_frustrations?: string[]
  b_priorities?: RankEntry[]
  b_barriers?: string[]
  // Track A
  a_products?: string[]
  a_satisfaction?: string
  a_best_thing?: string
  a_best_thing_text?: string
  a_nps?: number | null
  a_improve_text?: string
  // Shared
  accounting_system?: string
  accounting_other?: string
}

export interface Submission extends SurveyAnswers {
  track: Track
  email: string
  newsletter_opt_in: boolean
}

export type Phase = 'landing' | 'questions' | 'lead-gen' | 'thank-you'
export type Direction = 'forward' | 'backward'
```

- [ ] **Step 2: Commit**

```bash
git add src/types.ts
git commit -m "feat: add TypeScript types"
```

---

## Task 3: Question definitions + branching logic

**Files:**
- Create: `src/lib/questions.ts`
- Create: `src/lib/questions.test.ts`

- [ ] **Step 1: Write failing tests for `getQuestionSequence`**

```ts
// src/lib/questions.test.ts
import { describe, it, expect } from 'vitest'
import { getQuestionSequence, OPENING_QUESTION } from './questions'

describe('getQuestionSequence', () => {
  it('returns only opening question when track is undefined', () => {
    const seq = getQuestionSequence({})
    expect(seq).toHaveLength(1)
    expect(seq[0].id).toBe('q0')
  })

  it('returns 6 questions for non-zenegy track', () => {
    const seq = getQuestionSequence({ track: 'non-zenegy' })
    expect(seq).toHaveLength(6)
    expect(seq.map(q => q.id)).toEqual(['q0', 'b1', 'b2', 'b3', 'b4', 'numbers'])
  })

  it('includes numbers awareness for zenegy track without Numbers product', () => {
    const seq = getQuestionSequence({ track: 'zenegy', a_products: ['payroll'] })
    expect(seq).toHaveLength(6)
    expect(seq[seq.length - 1].id).toBe('numbers')
  })

  it('skips numbers awareness for zenegy track when Numbers product is used', () => {
    const seq = getQuestionSequence({ track: 'zenegy', a_products: ['payroll', 'numbers'] })
    expect(seq).toHaveLength(5)
    expect(seq.map(q => q.id)).toEqual(['q0', 'a1', 'a2', 'a3', 'a4'])
  })

  it('opening question has autoAdvance true', () => {
    expect(OPENING_QUESTION.autoAdvance).toBe(true)
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
npx vitest run src/lib/questions.test.ts
```

Expected: FAIL — `Cannot find module './questions'`

- [ ] **Step 3: Write `src/lib/questions.ts`**

```ts
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
      { value: 'danloen', label: 'Danløn', logoInitials: 'DL', logoStyle: { background: 'linear-gradient(135deg,#1E3A5F,#152B47)' } },
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
```

- [ ] **Step 4: Run tests — must pass**

```bash
npx vitest run src/lib/questions.test.ts
```

Expected: 5 tests PASS

- [ ] **Step 5: Commit**

```bash
git add src/lib/questions.ts src/lib/questions.test.ts
git commit -m "feat: question definitions and branching logic"
```

---

## Task 4: Supabase migration + client

**Files:**
- Create: `supabase/migrations/001_create_submissions.sql`
- Create: `src/lib/supabase.ts`
- Create: `src/lib/supabase.test.ts`

- [ ] **Step 1: Create migration SQL**

```sql
-- supabase/migrations/001_create_submissions.sql
create table submissions (
  id                 uuid primary key default gen_random_uuid(),
  created_at         timestamptz default now(),
  track              text not null check (track in ('zenegy', 'non-zenegy')),

  b_payroll_system   text,
  b_payroll_other    text,
  b_frustrations     text[],
  b_priorities       jsonb,
  b_barriers         text[],

  a_products         text[],
  a_satisfaction     text,
  a_best_thing       text,
  a_best_thing_text  text,
  a_nps              int,
  a_improve_text     text,

  accounting_system  text,
  accounting_other   text,

  email              text not null,
  newsletter_opt_in  boolean default false
);

create index on submissions (track);
create index on submissions (created_at);
create index on submissions (b_payroll_system);
```

Run this in the Supabase SQL editor after creating your project at supabase.com. Copy `.env.example` to `.env.local` and fill in the values.

- [ ] **Step 2: Write failing test for `submitSurvey`**

```ts
// src/lib/supabase.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { submitSurvey } from './supabase'

vi.mock('@supabase/supabase-js', () => ({
  createClient: () => ({
    from: () => ({
      insert: vi.fn().mockResolvedValue({ error: null }),
    }),
  }),
}))

describe('submitSurvey', () => {
  it('resolves without error on valid submission', async () => {
    await expect(
      submitSurvey({
        track: 'non-zenegy',
        b_payroll_system: 'dataloen',
        b_frustrations: ['price'],
        b_priorities: [{ rank: 1, value: 'price' }],
        b_barriers: ['transition'],
        accounting_system: 'e-conomic',
        email: 'test@test.dk',
        newsletter_opt_in: false,
      })
    ).resolves.toBeUndefined()
  })

  it('throws on supabase error', async () => {
    const { createClient } = await import('@supabase/supabase-js')
    vi.mocked(createClient).mockReturnValueOnce({
      from: () => ({ insert: vi.fn().mockResolvedValue({ error: { message: 'DB error' } }) }),
    } as any)

    await expect(
      submitSurvey({ track: 'zenegy', email: 'x@x.dk', newsletter_opt_in: false })
    ).rejects.toThrow('DB error')
  })
})
```

- [ ] **Step 3: Run tests — must fail**

```bash
npx vitest run src/lib/supabase.test.ts
```

Expected: FAIL — `Cannot find module './supabase'`

- [ ] **Step 4: Write `src/lib/supabase.ts`**

```ts
import { createClient } from '@supabase/supabase-js'
import type { Submission } from '../types'

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
)

export async function submitSurvey(data: Submission): Promise<void> {
  const { error } = await supabase.from('submissions').insert(data)
  if (error) throw new Error(error.message)
}
```

- [ ] **Step 5: Run tests — must pass**

```bash
npx vitest run src/lib/supabase.test.ts
```

Expected: 2 tests PASS

- [ ] **Step 6: Commit**

```bash
git add supabase/ src/lib/supabase.ts src/lib/supabase.test.ts
git commit -m "feat: Supabase migration and submitSurvey client"
```

---

## Task 5: `useKeyboard` hook

**Files:**
- Create: `src/lib/useKeyboard.ts`
- Create: `src/lib/useKeyboard.test.ts`

- [ ] **Step 1: Write failing tests**

```ts
// src/lib/useKeyboard.test.ts
import { renderHook } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useKeyboard } from './useKeyboard'
import userEvent from '@testing-library/user-event'

function setup(overrides = {}) {
  const handlers = {
    onAdvance: vi.fn(),
    onBack: vi.fn(),
    onSelectIndex: vi.fn(),
    enabled: true,
    ...overrides,
  }
  renderHook(() => useKeyboard(handlers))
  return handlers
}

describe('useKeyboard', () => {
  it('calls onAdvance on Enter', async () => {
    const { onAdvance } = setup()
    await userEvent.keyboard('{Enter}')
    expect(onAdvance).toHaveBeenCalledOnce()
  })

  it('calls onBack on ArrowLeft', async () => {
    const { onBack } = setup()
    await userEvent.keyboard('{ArrowLeft}')
    expect(onBack).toHaveBeenCalledOnce()
  })

  it('calls onSelectIndex(2) on key "3"', async () => {
    const { onSelectIndex } = setup()
    await userEvent.keyboard('3')
    expect(onSelectIndex).toHaveBeenCalledWith(2)
  })

  it('does nothing when enabled is false', async () => {
    const { onAdvance, onBack } = setup({ enabled: false })
    await userEvent.keyboard('{Enter}')
    await userEvent.keyboard('{ArrowLeft}')
    expect(onAdvance).not.toHaveBeenCalled()
    expect(onBack).not.toHaveBeenCalled()
  })
})
```

- [ ] **Step 2: Run tests — must fail**

```bash
npx vitest run src/lib/useKeyboard.test.ts
```

- [ ] **Step 3: Write `src/lib/useKeyboard.ts`**

```ts
import { useEffect } from 'react'

interface UseKeyboardOptions {
  onAdvance: () => void
  onBack: () => void
  onSelectIndex: (index: number) => void
  enabled?: boolean
}

export function useKeyboard({
  onAdvance,
  onBack,
  onSelectIndex,
  enabled = true,
}: UseKeyboardOptions): void {
  useEffect(() => {
    if (!enabled) return

    const handler = (e: KeyboardEvent) => {
      // Don't capture when user is typing in an input/textarea
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return

      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        onAdvance()
      } else if (e.key === 'ArrowLeft' || e.key === 'Backspace') {
        e.preventDefault()
        onBack()
      } else if (/^[1-9]$/.test(e.key)) {
        onSelectIndex(parseInt(e.key, 10) - 1)
      }
    }

    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onAdvance, onBack, onSelectIndex, enabled])
}
```

- [ ] **Step 4: Run tests — must pass**

```bash
npx vitest run src/lib/useKeyboard.test.ts
```

Expected: 4 tests PASS

- [ ] **Step 5: Commit**

```bash
git add src/lib/useKeyboard.ts src/lib/useKeyboard.test.ts
git commit -m "feat: useKeyboard hook with shortcut handling"
```

---

## Task 6: `ChoiceList` component

**Files:**
- Create: `src/components/inputs/ChoiceList.tsx`
- Create: `src/components/inputs/ChoiceList.test.tsx`

- [ ] **Step 1: Write failing tests**

```tsx
// src/components/inputs/ChoiceList.test.tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { ChoiceList } from './ChoiceList'

const options = [
  { value: 'a', label: 'Option A', emoji: '🅰️' },
  { value: 'b', label: 'Option B', emoji: '🅱️' },
]

describe('ChoiceList (single)', () => {
  it('renders all options', () => {
    render(<ChoiceList options={options} value="" onChange={vi.fn()} />)
    expect(screen.getByText('Option A')).toBeInTheDocument()
    expect(screen.getByText('Option B')).toBeInTheDocument()
  })

  it('calls onChange with clicked value', async () => {
    const onChange = vi.fn()
    render(<ChoiceList options={options} value="" onChange={onChange} />)
    await userEvent.click(screen.getByText('Option A'))
    expect(onChange).toHaveBeenCalledWith('a')
  })

  it('marks selected option visually', () => {
    render(<ChoiceList options={options} value="b" onChange={vi.fn()} />)
    const selectedItem = screen.getByText('Option B').closest('[data-selected]')
    expect(selectedItem).toHaveAttribute('data-selected', 'true')
  })
})

describe('ChoiceList (multi)', () => {
  it('toggles values on click', async () => {
    const onChange = vi.fn()
    render(<ChoiceList options={options} value={['a']} onChange={onChange} multi />)
    await userEvent.click(screen.getByText('Option B'))
    expect(onChange).toHaveBeenCalledWith(['a', 'b'])
  })

  it('deselects on second click', async () => {
    const onChange = vi.fn()
    render(<ChoiceList options={options} value={['a', 'b']} onChange={onChange} multi />)
    await userEvent.click(screen.getByText('Option A'))
    expect(onChange).toHaveBeenCalledWith(['b'])
  })
})
```

- [ ] **Step 2: Run — must fail**

```bash
npx vitest run src/components/inputs/ChoiceList.test.tsx
```

- [ ] **Step 3: Write `src/components/inputs/ChoiceList.tsx`**

```tsx
import type { Option } from '../../types'

interface Props {
  options: Option[]
  value: string | string[]
  onChange: (value: string | string[]) => void
  multi?: boolean
}

export function ChoiceList({ options, value, onChange, multi = false }: Props) {
  const selected = Array.isArray(value) ? value : value ? [value] : []

  const handleClick = (optValue: string) => {
    if (multi) {
      const next = selected.includes(optValue)
        ? selected.filter(v => v !== optValue)
        : [...selected, optValue]
      onChange(next)
    } else {
      onChange(optValue)
    }
  }

  return (
    <div className="flex flex-col gap-2.5">
      {options.map(opt => {
        const isSelected = selected.includes(opt.value)
        return (
          <button
            key={opt.value}
            data-selected={isSelected}
            onClick={() => handleClick(opt.value)}
            className={`flex items-center gap-3.5 px-5 py-3.5 rounded-xl border-[1.5px] text-left transition-all duration-150 w-full
              ${isSelected
                ? 'border-primary bg-primary-light shadow-[0_0_0_3px_rgba(0,200,150,0.12)]'
                : 'border-app-border bg-white hover:border-primary hover:bg-primary-light'
              }`}
          >
            <div className={`w-5 h-5 flex-shrink-0 transition-all duration-150 ${
              multi ? 'rounded-md border-2' : 'rounded-full border-2'
            } ${isSelected ? 'border-primary bg-primary' : 'border-gray-300'}`}>
              {isSelected && (
                <span className="flex items-center justify-center w-full h-full text-white text-[10px] font-black">
                  {multi ? '✓' : ''}
                </span>
              )}
            </div>
            {opt.emoji && <span className="text-xl">{opt.emoji}</span>}
            <div>
              <div className="text-[15px] font-medium text-text-main">{opt.label}</div>
              {opt.subLabel && <div className="text-[13px] text-text-muted mt-0.5">{opt.subLabel}</div>}
            </div>
          </button>
        )
      })}
    </div>
  )
}
```

- [ ] **Step 4: Run — must pass**

```bash
npx vitest run src/components/inputs/ChoiceList.test.tsx
```

Expected: 5 tests PASS

- [ ] **Step 5: Commit**

```bash
git add src/components/inputs/ChoiceList.tsx src/components/inputs/ChoiceList.test.tsx
git commit -m "feat: ChoiceList input component (single + multi)"
```

---

## Task 7: `LogoGrid`, `PillSelect`, `EmojiRating`

**Files:**
- Create: `src/components/inputs/LogoGrid.tsx`
- Create: `src/components/inputs/PillSelect.tsx`
- Create: `src/components/inputs/EmojiRating.tsx`
- Create: `src/components/inputs/inputs.test.tsx`

- [ ] **Step 1: Write failing tests**

```tsx
// src/components/inputs/inputs.test.tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { LogoGrid } from './LogoGrid'
import { PillSelect } from './PillSelect'
import { EmojiRating } from './EmojiRating'

const logoOptions = [
  { value: 'a', label: 'SystemA', logoInitials: 'SA', logoStyle: { background: '#333' } },
  { value: 'andet', label: 'Andet', logoInitials: '?', logoStyle: { background: '#999' } },
]

describe('LogoGrid', () => {
  it('renders logo cards', () => {
    render(<LogoGrid options={logoOptions} value="" onChange={vi.fn()} />)
    expect(screen.getByText('SystemA')).toBeInTheDocument()
  })

  it('calls onChange on card click', async () => {
    const onChange = vi.fn()
    render(<LogoGrid options={logoOptions} value="" onChange={onChange} />)
    await userEvent.click(screen.getByText('SystemA'))
    expect(onChange).toHaveBeenCalledWith('a')
  })

  it('shows text input when "andet" is selected', () => {
    render(<LogoGrid options={logoOptions} value="andet" onChange={vi.fn()} />)
    expect(screen.getByPlaceholderText('Hvilket system bruger du?')).toBeInTheDocument()
  })

  it('hides text input when "andet" not selected', () => {
    render(<LogoGrid options={logoOptions} value="a" onChange={vi.fn()} />)
    expect(screen.queryByPlaceholderText('Hvilket system bruger du?')).not.toBeInTheDocument()
  })
})

const pillOptions = [
  { value: 'price', label: '💸 Prisen er for høj' },
  { value: 'slow', label: '🐢 Langsomt' },
]

describe('PillSelect', () => {
  it('toggles pill on click', async () => {
    const onChange = vi.fn()
    render(<PillSelect options={pillOptions} value={[]} onChange={onChange} />)
    await userEvent.click(screen.getByText('💸 Prisen er for høj'))
    expect(onChange).toHaveBeenCalledWith(['price'])
  })

  it('deselects already-selected pill', async () => {
    const onChange = vi.fn()
    render(<PillSelect options={pillOptions} value={['price']} onChange={onChange} />)
    await userEvent.click(screen.getByText('💸 Prisen er for høj'))
    expect(onChange).toHaveBeenCalledWith([])
  })
})

const emojiOptions = [
  { value: 'unhappy', label: 'Ikke tilfreds', emoji: '😤' },
  { value: 'happy', label: 'Tilfreds', emoji: '😊' },
]

describe('EmojiRating', () => {
  it('renders emoji options', () => {
    render(<EmojiRating options={emojiOptions} value="" onChange={vi.fn()} />)
    expect(screen.getByText('😤')).toBeInTheDocument()
  })

  it('calls onChange on click', async () => {
    const onChange = vi.fn()
    render(<EmojiRating options={emojiOptions} value="" onChange={onChange} />)
    await userEvent.click(screen.getByText('😊'))
    expect(onChange).toHaveBeenCalledWith('happy')
  })
})
```

- [ ] **Step 2: Run — must fail**

```bash
npx vitest run src/components/inputs/inputs.test.tsx
```

- [ ] **Step 3: Write `src/components/inputs/LogoGrid.tsx`**

```tsx
import { useRef } from 'react'
import type { Option } from '../../types'

interface Props {
  options: Option[]
  value: string
  onChange: (value: string) => void
  otherValue?: string
  onOtherChange?: (text: string) => void
}

export function LogoGrid({ options, value, onChange, otherValue = '', onOtherChange }: Props) {
  return (
    <div>
      <div className="grid grid-cols-4 gap-3">
        {options.map(opt => {
          const isSelected = value === opt.value
          return (
            <button
              key={opt.value}
              onClick={() => onChange(opt.value)}
              className={`flex flex-col items-center gap-2.5 p-4 rounded-xl border-2 transition-all duration-150
                ${isSelected
                  ? 'border-primary bg-primary-light shadow-[0_0_0_3px_rgba(0,200,150,0.15)] -translate-y-0.5'
                  : 'border-app-border bg-white hover:border-primary hover:bg-primary-light hover:-translate-y-0.5 hover:shadow-md'
                }`}
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-black text-sm"
                style={opt.logoStyle}
              >
                {opt.logoInitials}
              </div>
              <div className="text-center">
                <div className={`text-xs font-semibold leading-tight ${isSelected ? 'text-primary-dark' : 'text-gray-700'}`}>
                  {opt.label}
                </div>
                {opt.subLabel && <div className="text-[10px] text-text-muted mt-0.5">{opt.subLabel}</div>}
              </div>
            </button>
          )
        })}
      </div>
      {value === 'andet' && (
        <input
          autoFocus
          type="text"
          placeholder="Hvilket system bruger du?"
          value={otherValue}
          onChange={e => onOtherChange?.(e.target.value)}
          className="mt-3 w-full px-4 py-3 rounded-xl border-[1.5px] border-app-border focus:border-primary outline-none text-sm transition-colors"
        />
      )}
    </div>
  )
}
```

- [ ] **Step 4: Write `src/components/inputs/PillSelect.tsx`**

```tsx
import type { Option } from '../../types'

interface Props {
  options: Option[]
  value: string[]
  onChange: (value: string[]) => void
}

export function PillSelect({ options, value, onChange }: Props) {
  const toggle = (v: string) => {
    onChange(value.includes(v) ? value.filter(x => x !== v) : [...value, v])
  }

  return (
    <div className="flex flex-wrap gap-2.5">
      {options.map(opt => {
        const isSelected = value.includes(opt.value)
        return (
          <button
            key={opt.value}
            onClick={() => toggle(opt.value)}
            className={`px-4 py-2.5 rounded-full border-[1.5px] text-sm font-medium transition-all duration-150
              ${isSelected
                ? 'border-primary bg-primary text-white font-semibold'
                : 'border-app-border bg-white text-gray-700 hover:border-primary hover:bg-primary-light hover:text-primary-dark'
              }`}
          >
            {opt.label}
          </button>
        )
      })}
    </div>
  )
}
```

- [ ] **Step 5: Write `src/components/inputs/EmojiRating.tsx`**

```tsx
import type { Option } from '../../types'

interface Props {
  options: Option[]
  value: string
  onChange: (value: string) => void
}

export function EmojiRating({ options, value, onChange }: Props) {
  return (
    <div className="flex gap-4 justify-center">
      {options.map(opt => {
        const isSelected = value === opt.value
        return (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className={`flex flex-col items-center gap-2 px-6 py-4 rounded-2xl border-2 transition-all duration-150 min-w-[110px]
              ${isSelected
                ? 'border-primary bg-primary-light shadow-[0_4px_16px_rgba(0,200,150,0.18)] -translate-y-0.5'
                : 'border-app-border bg-white hover:border-primary hover:-translate-y-0.5'
              }`}
          >
            <span className="text-4xl">{opt.emoji}</span>
            <span className={`text-[13px] font-semibold ${isSelected ? 'text-primary-dark' : 'text-gray-700'}`}>
              {opt.label}
            </span>
          </button>
        )
      })}
    </div>
  )
}
```

- [ ] **Step 6: Run — must pass**

```bash
npx vitest run src/components/inputs/inputs.test.tsx
```

Expected: 8 tests PASS

- [ ] **Step 7: Commit**

```bash
git add src/components/inputs/
git commit -m "feat: LogoGrid, PillSelect, EmojiRating input components"
```

---

## Task 8: `PriorityRank`, `NPSScale`, `OpenText`

**Files:**
- Create: `src/components/inputs/PriorityRank.tsx`
- Create: `src/components/inputs/NPSScale.tsx`
- Create: `src/components/inputs/OpenText.tsx`
- Create: `src/components/inputs/inputs2.test.tsx`

- [ ] **Step 1: Write failing tests**

```tsx
// src/components/inputs/inputs2.test.tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { PriorityRank } from './PriorityRank'
import { NPSScale } from './NPSScale'
import { OpenText } from './OpenText'

const rankOptions = [
  { value: 'price', label: '💰 Pris' },
  { value: 'ux', label: '✨ UX' },
  { value: 'support', label: '🆘 Support' },
  { value: 'integrations', label: '🔗 Integrationer' },
]

describe('PriorityRank', () => {
  it('assigns rank 1 on first click', async () => {
    const onChange = vi.fn()
    render(<PriorityRank options={rankOptions} value={[]} onChange={onChange} maxRank={3} />)
    await userEvent.click(screen.getByText('💰 Pris'))
    expect(onChange).toHaveBeenCalledWith([{ rank: 1, value: 'price' }])
  })

  it('deselects on second click', async () => {
    const onChange = vi.fn()
    render(<PriorityRank options={rankOptions} value={[{ rank: 1, value: 'price' }]} onChange={onChange} maxRank={3} />)
    await userEvent.click(screen.getByText('💰 Pris'))
    expect(onChange).toHaveBeenCalledWith([])
  })

  it('does not add more than maxRank selections', async () => {
    const onChange = vi.fn()
    const fullValue = [
      { rank: 1, value: 'price' },
      { rank: 2, value: 'ux' },
      { rank: 3, value: 'support' },
    ]
    render(<PriorityRank options={rankOptions} value={fullValue} onChange={onChange} maxRank={3} />)
    await userEvent.click(screen.getByText('🔗 Integrationer'))
    expect(onChange).not.toHaveBeenCalled()
  })
})

describe('NPSScale', () => {
  it('renders 11 buttons (0–10)', () => {
    render(<NPSScale value={null} onChange={vi.fn()} />)
    expect(screen.getAllByRole('button')).toHaveLength(11)
  })

  it('calls onChange with numeric value', async () => {
    const onChange = vi.fn()
    render(<NPSScale value={null} onChange={onChange} />)
    await userEvent.click(screen.getByText('7'))
    expect(onChange).toHaveBeenCalledWith(7)
  })
})

describe('OpenText', () => {
  it('calls onChange on input', async () => {
    const onChange = vi.fn()
    render(<OpenText value="" onChange={onChange} placeholder="Type here" maxLength={200} label="Notes" />)
    await userEvent.type(screen.getByPlaceholderText('Type here'), 'hello')
    expect(onChange).toHaveBeenLastCalledWith('hello')
  })
})
```

- [ ] **Step 2: Run — must fail**

```bash
npx vitest run src/components/inputs/inputs2.test.tsx
```

- [ ] **Step 3: Write `src/components/inputs/PriorityRank.tsx`**

```tsx
import type { Option, RankEntry } from '../../types'

const MEDALS = ['🥇', '🥈', '🥉']
const RANK_STYLES = [
  'border-amber-400 bg-amber-50',
  'border-gray-400 bg-gray-50',
  'border-amber-700 bg-orange-50',
]

interface Props {
  options: Option[]
  value: RankEntry[]
  onChange: (value: RankEntry[]) => void
  maxRank?: number
}

export function PriorityRank({ options, value, onChange, maxRank = 3 }: Props) {
  const handleClick = (optValue: string) => {
    const existing = value.find(e => e.value === optValue)
    if (existing) {
      // Deselect and re-rank remaining
      onChange(
        value
          .filter(e => e.value !== optValue)
          .map((e, i) => ({ ...e, rank: i + 1 }))
      )
    } else {
      if (value.length >= maxRank) return
      onChange([...value, { rank: value.length + 1, value: optValue }])
    }
  }

  return (
    <div className="flex flex-col gap-2">
      {options.map(opt => {
        const entry = value.find(e => e.value === opt.value)
        const rank = entry?.rank
        const rankIndex = rank ? rank - 1 : -1
        return (
          <button
            key={opt.value}
            onClick={() => handleClick(opt.value)}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl border-[1.5px] text-left transition-all duration-150 w-full
              ${rank !== undefined ? RANK_STYLES[rankIndex] : 'border-app-border bg-white hover:border-gray-300 hover:bg-gray-50'}`}
          >
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-black flex-shrink-0 border-[1.5px]
              ${rank !== undefined
                ? [
                    'border-amber-400 bg-amber-400 text-white',
                    'border-gray-400 bg-gray-400 text-white',
                    'border-amber-700 bg-amber-700 text-white',
                  ][rankIndex]
                : 'border-gray-300 text-gray-400'
              }`}
            >
              {rank !== undefined ? MEDALS[rankIndex] : '·'}
            </div>
            <span className="text-[15px] font-medium text-text-main">{opt.label}</span>
          </button>
        )
      })}
      <p className="text-xs text-text-muted mt-1">Vælg op til {maxRank} — 🥇 er vigtigst</p>
    </div>
  )
}
```

- [ ] **Step 4: Write `src/components/inputs/NPSScale.tsx`**

```tsx
interface Props {
  value: number | null
  onChange: (value: number) => void
}

export function NPSScale({ value, onChange }: Props) {
  return (
    <div>
      <div className="flex gap-1.5 flex-wrap justify-center">
        {Array.from({ length: 11 }, (_, i) => (
          <button
            key={i}
            onClick={() => onChange(i)}
            className={`w-12 h-12 rounded-xl border-[1.5px] text-base font-bold transition-all duration-150
              ${value === i
                ? 'bg-primary border-primary text-white'
                : 'bg-white border-app-border text-gray-700 hover:border-primary hover:bg-primary-light'
              }`}
          >
            {i}
          </button>
        ))}
      </div>
      <div className="flex justify-between mt-2">
        <span className="text-xs text-text-muted">Ville ikke anbefale</span>
        <span className="text-xs text-text-muted">Vil klart anbefale</span>
      </div>
    </div>
  )
}
```

- [ ] **Step 5: Write `src/components/inputs/OpenText.tsx`**

```tsx
interface Props {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  maxLength?: number
  label?: string
}

export function OpenText({ value, onChange, placeholder, maxLength = 300, label }: Props) {
  return (
    <div className="mt-5">
      {label && <div className="text-[13px] font-semibold text-gray-700 mb-2">{label}</div>}
      <textarea
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        maxLength={maxLength}
        rows={3}
        className="w-full px-4 py-3.5 rounded-xl border-[1.5px] border-app-border focus:border-primary outline-none text-sm font-sans resize-none transition-colors text-text-main placeholder:text-gray-400"
      />
      <div className="text-xs text-gray-400 text-right mt-1">{value.length} / {maxLength}</div>
    </div>
  )
}
```

- [ ] **Step 6: Run — must pass**

```bash
npx vitest run src/components/inputs/inputs2.test.tsx
```

Expected: 6 tests PASS

- [ ] **Step 7: Commit**

```bash
git add src/components/inputs/PriorityRank.tsx src/components/inputs/NPSScale.tsx src/components/inputs/OpenText.tsx src/components/inputs/inputs2.test.tsx
git commit -m "feat: PriorityRank, NPSScale, OpenText input components"
```

---

## Task 9: `QuestionRenderer`

**Files:**
- Create: `src/components/QuestionRenderer.tsx`
- Create: `src/components/QuestionRenderer.test.tsx`

- [ ] **Step 1: Write failing tests**

```tsx
// src/components/QuestionRenderer.test.tsx
import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { QuestionRenderer } from './QuestionRenderer'
import type { Question, SurveyAnswers } from '../types'

const baseProps = {
  answers: {} as SurveyAnswers,
  onAnswer: vi.fn(),
  onAdvance: vi.fn(),
}

describe('QuestionRenderer', () => {
  it('renders choice-single as ChoiceList', () => {
    const q: Question = {
      id: 'q0', type: 'choice-single',
      question: 'Test question', subText: 'sub',
      options: [{ value: 'a', label: 'Option A' }],
    }
    render(<QuestionRenderer question={q} {...baseProps} />)
    expect(screen.getByText('Test question')).toBeInTheDocument()
    expect(screen.getByText('Option A')).toBeInTheDocument()
  })

  it('renders pill-select as PillSelect', () => {
    const q: Question = {
      id: 'b2', type: 'pill-select',
      question: 'Frustrations?', subText: 'sub',
      options: [{ value: 'price', label: '💸 Price' }],
    }
    render(<QuestionRenderer question={q} {...baseProps} />)
    expect(screen.getByText('💸 Price')).toBeInTheDocument()
  })

  it('renders emoji-rating as EmojiRating', () => {
    const q: Question = {
      id: 'a2', type: 'emoji-rating',
      question: 'Satisfaction?', subText: 'sub',
      options: [{ value: 'happy', label: 'Tilfreds', emoji: '😊' }],
    }
    render(<QuestionRenderer question={q} {...baseProps} />)
    expect(screen.getByText('😊')).toBeInTheDocument()
  })

  it('shows Næste button for non-auto-advance questions', () => {
    const q: Question = {
      id: 'b2', type: 'pill-select',
      question: 'Multi', subText: 'sub',
      options: [],
    }
    render(<QuestionRenderer question={q} {...baseProps} />)
    expect(screen.getByText('Næste →')).toBeInTheDocument()
  })

  it('hides Næste button for auto-advance questions', () => {
    const q: Question = {
      id: 'q0', type: 'choice-single',
      question: 'Single', subText: 'sub',
      autoAdvance: true,
      options: [],
    }
    render(<QuestionRenderer question={q} {...baseProps} />)
    expect(screen.queryByText('Næste →')).not.toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run — must fail**

```bash
npx vitest run src/components/QuestionRenderer.test.tsx
```

- [ ] **Step 3: Write `src/components/QuestionRenderer.tsx`**

```tsx
import { useRef, useEffect } from 'react'
import type { Question, SurveyAnswers, RankEntry } from '../types'
import { ChoiceList } from './inputs/ChoiceList'
import { LogoGrid } from './inputs/LogoGrid'
import { PillSelect } from './inputs/PillSelect'
import { EmojiRating } from './inputs/EmojiRating'
import { PriorityRank } from './inputs/PriorityRank'
import { NPSScale } from './inputs/NPSScale'
import { OpenText } from './inputs/OpenText'

interface Props {
  question: Question
  answers: SurveyAnswers
  onAnswer: (id: string, value: unknown, extra?: unknown) => void
  onAdvance: () => void
  onBack?: () => void
  isFirst?: boolean
}

function getAnswer(answers: SurveyAnswers, id: string): unknown {
  const map: Record<string, unknown> = {
    q0: answers.track,
    b1: answers.b_payroll_system,
    b2: answers.b_frustrations ?? [],
    b3: answers.b_priorities ?? [],
    b4: answers.b_barriers ?? [],
    a1: answers.a_products ?? [],
    a2: answers.a_satisfaction,
    a3: answers.a_best_thing,
    a4: answers.a_nps,
    numbers: answers.accounting_system,
  }
  return map[id] ?? ''
}

export function QuestionRenderer({ question, answers, onAnswer, onAdvance, onBack, isFirst }: Props) {
  const answer = getAnswer(answers, question.id)
  const autoAdvanceTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => () => { if (autoAdvanceTimer.current) clearTimeout(autoAdvanceTimer.current) }, [])

  const handleSingleSelect = (value: string) => {
    onAnswer(question.id, value)
    if (question.autoAdvance) {
      autoAdvanceTimer.current = setTimeout(onAdvance, 300)
    }
  }

  const hasAnswer = (() => {
    if (answer === null || answer === undefined || answer === '') return false
    if (Array.isArray(answer)) return answer.length > 0
    return true
  })()

  const renderInput = () => {
    switch (question.type) {
      case 'choice-single':
        return <ChoiceList options={question.options ?? []} value={answer as string} onChange={handleSingleSelect} />
      case 'choice-multi':
        return <ChoiceList options={question.options ?? []} value={answer as string[]} onChange={v => onAnswer(question.id, v)} multi />
      case 'logo-grid':
        return (
          <LogoGrid
            options={question.options ?? []}
            value={answer as string}
            onChange={handleSingleSelect}
            otherValue={question.id === 'b1' ? (answers.b_payroll_other ?? '') : (answers.accounting_other ?? '')}
            onOtherChange={v => onAnswer(question.id + '_other', v)}
          />
        )
      case 'pill-select':
        return <PillSelect options={question.options ?? []} value={answer as string[]} onChange={v => onAnswer(question.id, v)} />
      case 'emoji-rating':
        return <EmojiRating options={question.options ?? []} value={answer as string} onChange={handleSingleSelect} />
      case 'priority-rank':
        return <PriorityRank options={question.options ?? []} value={answer as RankEntry[]} onChange={v => onAnswer(question.id, v)} maxRank={question.maxRank} />
      case 'nps-scale':
        return (
          <div>
            <NPSScale value={answer as number | null} onChange={v => onAnswer(question.id, v)} />
            {question.hasOpenText && (
              <OpenText
                value={question.id === 'a4' ? (answers.a_improve_text ?? '') : ''}
                onChange={v => onAnswer(question.id + '_text', v)}
                label={question.openTextLabel}
                placeholder={question.openTextPlaceholder}
                maxLength={question.openTextMaxLength}
              />
            )}
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="w-full max-w-[640px] mx-auto">
      <div className="mb-1 text-xs font-bold tracking-widest uppercase text-primary">✦ Spørgsmål</div>
      <h2 className="text-[23px] font-extrabold leading-snug text-text-main mb-1.5">{question.question}</h2>
      <p className="text-sm text-text-muted mb-7 leading-relaxed">{question.subText}</p>

      {renderInput()}

      {question.type === 'choice-single' && question.hasOpenText && (
        <OpenText
          value={answers.a_best_thing_text ?? ''}
          onChange={v => onAnswer('a3_text', v)}
          label={question.openTextLabel}
          placeholder={question.openTextPlaceholder}
          maxLength={question.openTextMaxLength}
        />
      )}

      {!question.autoAdvance && (
        <div className="flex justify-between mt-8">
          {!isFirst && onBack ? (
            <button onClick={onBack} className="px-5 py-3 rounded-xl bg-gray-100 text-gray-600 text-sm font-semibold hover:bg-gray-200 transition-colors">
              ← Tilbage
            </button>
          ) : <div />}
          <button
            onClick={onAdvance}
            disabled={!hasAnswer}
            className="px-7 py-3 rounded-xl bg-primary text-white text-sm font-bold hover:bg-primary-dark transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Næste →
          </button>
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 4: Run — must pass**

```bash
npx vitest run src/components/QuestionRenderer.test.tsx
```

Expected: 5 tests PASS

- [ ] **Step 5: Commit**

```bash
git add src/components/QuestionRenderer.tsx src/components/QuestionRenderer.test.tsx
git commit -m "feat: QuestionRenderer routes question types to input components"
```

---

## Task 10: `SurveyShell` — progress bar + slide transitions

**Files:**
- Create: `src/components/SurveyShell.tsx`

- [ ] **Step 1: Write `src/components/SurveyShell.tsx`**

```tsx
import { useEffect, useState } from 'react'
import type { Direction } from '../types'

interface Props {
  currentIndex: number
  totalQuestions: number
  direction: Direction
  animKey: number
  children: React.ReactNode
}

export function SurveyShell({ currentIndex, totalQuestions, direction, animKey, children }: Props) {
  const progressPct = totalQuestions > 1
    ? Math.round((currentIndex / (totalQuestions - 1)) * 100)
    : 0

  const enterClass = direction === 'forward' ? 'anim-slide-in-right' : 'anim-slide-in-left'

  return (
    <div className="min-h-screen bg-app-bg flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-app-border px-8 py-4 flex items-center justify-between sticky top-0 z-10">
        <div className="text-[22px] font-black tracking-tight text-text-main">
          zen<span className="text-primary">egy</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-text-muted">{currentIndex + 1} af {totalQuestions}</span>
          <div className="w-40 h-1 bg-app-border rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-[width] duration-[400ms] ease-in-out"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>
      </header>

      {/* Question area */}
      <main className="flex-1 flex items-start justify-center px-6 py-14 overflow-hidden">
        <div key={animKey} className={`w-full ${enterClass}`}>
          {children}
        </div>
      </main>

      {/* Keyboard hint */}
      <div className="pb-6 text-center">
        <span className="text-xs text-gray-300">
          Tryk <kbd className="px-1.5 py-0.5 rounded bg-gray-100 text-gray-400 font-mono text-[10px]">Enter</kbd> for at fortsætte
          · <kbd className="px-1.5 py-0.5 rounded bg-gray-100 text-gray-400 font-mono text-[10px]">←</kbd> for at gå tilbage
        </span>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/SurveyShell.tsx
git commit -m "feat: SurveyShell with progress bar and slide animations"
```

---

## Task 11: `SurveyFlow` — state machine + orchestration

**Files:**
- Create: `src/screens/SurveyFlow.tsx`

- [ ] **Step 1: Write `src/screens/SurveyFlow.tsx`**

```tsx
import { useState, useCallback } from 'react'
import type { Phase, Direction, SurveyAnswers, Track, RankEntry } from '../types'
import { getQuestionSequence } from '../lib/questions'
import { useKeyboard } from '../lib/useKeyboard'
import { SurveyShell } from '../components/SurveyShell'
import { QuestionRenderer } from '../components/QuestionRenderer'
import { LandingPage } from './LandingPage'
import { LeadGen } from './LeadGen'
import { ThankYou } from './ThankYou'

export function SurveyFlow() {
  const [phase, setPhase] = useState<Phase>('landing')
  const [questionIndex, setQuestionIndex] = useState(0)
  const [direction, setDirection] = useState<Direction>('forward')
  const [animKey, setAnimKey] = useState(0)
  const [answers, setAnswers] = useState<SurveyAnswers>({})

  const questions = getQuestionSequence({
    track: answers.track,
    a_products: answers.a_products,
  })

  const currentQuestion = questions[questionIndex]

  const handleAnswer = useCallback((id: string, value: unknown) => {
    setAnswers(prev => {
      const map: Record<string, keyof SurveyAnswers> = {
        q0: 'track',
        b1: 'b_payroll_system',
        b1_other: 'b_payroll_other',
        b2: 'b_frustrations',
        b3: 'b_priorities',
        b4: 'b_barriers',
        a1: 'a_products',
        a2: 'a_satisfaction',
        a3: 'a_best_thing',
        a3_text: 'a_best_thing_text',
        a4: 'a_nps',
        a4_text: 'a_improve_text',
        numbers: 'accounting_system',
        numbers_other: 'accounting_other',
      }
      const key = map[id]
      if (!key) return prev
      return { ...prev, [key]: value }
    })
  }, [])

  const advance = useCallback(() => {
    if (phase === 'landing') {
      setPhase('questions')
      setAnimKey(k => k + 1)
      return
    }
    if (phase !== 'questions') return

    if (questionIndex < questions.length - 1) {
      setDirection('forward')
      setAnimKey(k => k + 1)
      setQuestionIndex(i => i + 1)
    } else {
      setPhase('lead-gen')
    }
  }, [phase, questionIndex, questions.length])

  const back = useCallback(() => {
    if (phase !== 'questions') return
    if (questionIndex > 0) {
      setDirection('backward')
      setAnimKey(k => k + 1)
      setQuestionIndex(i => i - 1)
    }
  }, [phase, questionIndex])

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

  if (phase === 'landing') return <LandingPage onStart={advance} />
  if (phase === 'lead-gen') return <LeadGen answers={answers} onSubmitted={() => setPhase('thank-you')} />
  if (phase === 'thank-you') return <ThankYou />

  return (
    <SurveyShell
      currentIndex={questionIndex}
      totalQuestions={questions.length}
      direction={direction}
      animKey={animKey}
    >
      <QuestionRenderer
        question={currentQuestion}
        answers={answers}
        onAnswer={handleAnswer}
        onAdvance={advance}
        onBack={back}
        isFirst={questionIndex === 0}
      />
    </SurveyShell>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/screens/SurveyFlow.tsx
git commit -m "feat: SurveyFlow state machine with branching and keyboard integration"
```

---

## Task 12: `LandingPage`, `ThankYou` screens

**Files:**
- Create: `src/screens/LandingPage.tsx`
- Create: `src/screens/ThankYou.tsx`

- [ ] **Step 1: Write `src/screens/LandingPage.tsx`**

```tsx
interface Props {
  onStart: () => void
}

export function LandingPage({ onStart }: Props) {
  return (
    <div className="min-h-screen bg-app-bg flex flex-col items-center justify-start px-6 py-10">
      {/* Header */}
      <header className="w-full max-w-[660px] flex justify-between items-center mb-10">
        <div className="text-[22px] font-black tracking-tight text-text-main">
          zen<span className="text-primary">egy</span>
        </div>
      </header>

      <div className="w-full max-w-[660px] flex flex-col gap-5">
        {/* Hero */}
        <div className="relative bg-gradient-to-br from-[#0f2027] via-[#1a3a4a] to-[#0f2027] rounded-2xl px-11 py-14 text-white overflow-hidden">
          <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-primary opacity-10 blur-2xl" />

          <div className="inline-flex items-center gap-2 bg-primary/15 border border-primary/30 rounded-full px-4 py-1.5 text-xs font-bold text-primary mb-6">
            🎁 Vind en iPad — ingen tilmelding krævet
          </div>

          <h1 className="text-[34px] font-black leading-tight tracking-tight mb-3">
            Hvad synes du egentlig om<br />
            <span className="text-primary">løn i Danmark?</span>
          </h1>

          <p className="text-base text-white/70 leading-relaxed mb-9 max-w-[460px]">
            Del din mening på 3 minutter og vær med i lodtrækningen om en iPad.
            Dine svar er anonyme og hjælper os gøre løn nemmere for alle.
          </p>

          <div className="flex gap-8 mb-9">
            {[['~3 min', 'at gennemføre'], ['5 spm', 'korte spørgsmål'], ['1 iPad', 'til en heldig deltager']].map(([n, l]) => (
              <div key={n}>
                <div className="text-[22px] font-black">{n}</div>
                <div className="text-xs text-white/50">{l}</div>
              </div>
            ))}
          </div>

          <button
            onClick={onStart}
            className="inline-flex items-center gap-2.5 bg-primary text-white px-8 py-4 rounded-xl text-base font-bold shadow-[0_4px_20px_rgba(0,200,150,0.35)] hover:bg-primary-dark hover:-translate-y-0.5 hover:shadow-[0_6px_24px_rgba(0,200,150,0.45)] transition-all duration-200"
          >
            Start undersøgelsen →
          </button>
          <p className="text-xs text-white/35 mt-4">Ingen krav om nyhedsbrevstilmelding · Ingen spam</p>

          {/* iPad CSS illustration */}
          <div className="absolute right-8 bottom-0 w-24 flex flex-col items-center">
            <div className="w-20 h-28 bg-gradient-to-br from-[#2a2a3a] to-[#1a1a28] rounded-xl border-2 border-[#3a3a4a] flex items-center justify-center shadow-2xl">
              <div className="w-16 h-22 bg-gradient-to-br from-[#0d4a3a] to-[#0a3020] rounded-lg flex items-center justify-center">
                <span className="text-primary text-[9px] font-bold text-center leading-relaxed">✦<br />iPad<br />Pro</span>
              </div>
            </div>
          </div>
        </div>

        {/* Perk cards */}
        <div className="grid grid-cols-2 gap-3">
          {[
            ['🔒', 'Anonymt og trygt', 'Dine svar behandles fortroligt og bruges udelukkende til at forbedre løsninger.'],
            ['🎯', 'Tilpassede spørgsmål', 'Spørgsmålene tilpasser sig, om du er Zenegy-kunde eller bruger et andet system.'],
            ['🏆', 'iPad konkurrence', 'Alle der deltager er med i lodtrækningen — uanset om du tilmelder nyhedsbrev eller ej.'],
            ['💬', 'Din stemme tæller', 'Resultaterne former, hvad vi prioriterer og hvilke problemer vi løser næst.'],
          ].map(([icon, title, desc]) => (
            <div key={title} className="bg-white rounded-2xl p-5 border border-app-border">
              <div className="text-2xl mb-2.5">{icon}</div>
              <div className="text-sm font-bold text-text-main mb-1">{title}</div>
              <div className="text-[13px] text-text-muted leading-relaxed">{desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Write `src/screens/ThankYou.tsx`**

```tsx
export function ThankYou() {
  return (
    <div className="min-h-screen bg-app-bg flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 bg-primary-light rounded-full flex items-center justify-center mx-auto mb-6 anim-check-pop">
          <span className="text-4xl">✓</span>
        </div>
        <h1 className="text-3xl font-black text-text-main mb-3">Du er med! 🎁</h1>
        <p className="text-text-muted text-base leading-relaxed mb-8">
          Vi trækker en vinder d. 1. august og giver dig besked direkte på din email. Tak fordi du tog dig tid.
        </p>

        <p className="text-sm font-semibold text-text-main mb-4">Kender du nogen der også burde deltage?</p>
        <a
          href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent('https://survey.zenegy.com')}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-[#0A66C2] text-white px-6 py-3 rounded-xl text-sm font-semibold hover:bg-[#0856A8] transition-colors mb-4"
        >
          Del på LinkedIn
        </a>

        <div className="mt-2">
          <a href="https://zenegy.com" className="text-sm text-primary font-semibold hover:text-primary-dark transition-colors">
            Læs mere om Zenegy →
          </a>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add src/screens/LandingPage.tsx src/screens/ThankYou.tsx
git commit -m "feat: LandingPage and ThankYou screens"
```

---

## Task 13: `LeadGen` screen

**Files:**
- Create: `src/screens/LeadGen.tsx`

- [ ] **Step 1: Write `src/screens/LeadGen.tsx`**

```tsx
import { useState } from 'react'
import type { SurveyAnswers, Track } from '../types'
import { submitSurvey } from '../lib/supabase'

interface Props {
  answers: SurveyAnswers
  onSubmitted: () => void
}

export function LeadGen({ answers, onSubmitted }: Props) {
  const [email, setEmail] = useState('')
  const [newsletter, setNewsletter] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

  const handleSubmit = async () => {
    if (!isValidEmail) { setError('Indtast venligst en gyldig email.'); return }
    setLoading(true)
    setError('')
    try {
      await submitSurvey({
        ...answers,
        track: answers.track as Track,
        email,
        newsletter_opt_in: newsletter,
      })
      onSubmitted()
    } catch {
      setError('Noget gik galt. Prøv igen.')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-app-bg flex items-start justify-center px-6 py-16">
      <div className="w-full max-w-[580px] bg-gradient-to-br from-[#1a1a2e] to-[#0f2027] rounded-2xl p-11 text-white">
        <div className="inline-flex items-center gap-2 bg-primary/15 border border-primary/30 rounded-full px-4 py-1.5 text-xs font-bold text-primary mb-5">
          🎁 Du er næsten i mål!
        </div>

        <h2 className="text-[28px] font-black leading-snug mb-2">
          Tak — dine svar hjælper os med at gøre løn nemmere for alle.
        </h2>
        <p className="text-sm text-white/60 leading-relaxed mb-8">
          Indtast din email for at deltage i lodtrækningen om en iPad. Vi trækker en vinder d. 1. august 2025.
        </p>

        <div className="mb-3.5">
          <label className="block text-[13px] font-semibold text-white/75 mb-2">
            Email <span className="text-primary">✱</span>
          </label>
          <input
            type="email"
            value={email}
            onChange={e => { setEmail(e.target.value); setError('') }}
            placeholder="din@email.dk"
            className="w-full px-4 py-3 rounded-xl border-[1.5px] border-white/15 bg-white/7 text-white placeholder:text-white/35 outline-none focus:border-primary transition-colors text-sm"
          />
          {error && <p className="text-red-400 text-xs mt-1.5">{error}</p>}
        </div>

        <label className="flex items-start gap-3 cursor-pointer mb-7">
          <input
            type="checkbox"
            checked={newsletter}
            onChange={e => setNewsletter(e.target.checked)}
            className="mt-0.5 accent-primary w-4 h-4 cursor-pointer"
          />
          <span className="text-[13px] text-white/60 leading-relaxed">
            Ja tak, jeg vil gerne modtage Zenegys nyhedsbrev med tips, nyheder og produktopdateringer.{' '}
            <span className="text-white/40">(Helt valgfrit — du er med i konkurrencen uanset.)</span>
          </span>
        </label>

        <button
          onClick={handleSubmit}
          disabled={loading || !isValidEmail}
          className="w-full py-4 rounded-xl bg-primary text-white font-bold text-base mb-3 hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : 'Send svar og deltag i konkurrencen 🎁'}
        </button>

        <a
          href="https://zenegy.com/book-demo"
          target="_blank"
          rel="noopener noreferrer"
          className="w-full py-3.5 rounded-xl border border-white/20 text-white font-semibold text-[15px] hover:bg-white/7 transition-colors flex items-center justify-center"
        >
          📅 Book en gratis demo med Zenegy
        </a>

        <p className="text-[11px] text-white/30 text-center mt-5 leading-relaxed">
          Din email bruges udelukkende til konkurrencen og evt. nyhedsbrev.<br />
          Vi deler ikke dine data med tredjepart.
        </p>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/screens/LeadGen.tsx
git commit -m "feat: LeadGen screen with email validation and submit"
```

---

## Task 14: Wire up `App.tsx` + verify full flow

**Files:**
- Modify: `src/App.tsx`
- Modify: `src/main.tsx`

- [ ] **Step 1: Replace `src/App.tsx`**

```tsx
import { SurveyFlow } from './screens/SurveyFlow'

export default function App() {
  return <SurveyFlow />
}
```

- [ ] **Step 2: Replace `src/main.tsx`**

```tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
```

- [ ] **Step 3: Run all tests**

```bash
npx vitest run
```

Expected: All tests PASS

- [ ] **Step 4: Start dev server and manually verify the full flow**

```bash
npm run dev
```

Walk through manually:
1. Landing page loads, click "Start undersøgelsen"
2. Q0 appears — press `2` to select non-zenegy, auto-advances
3. B1 logo grid — click a system card, auto-advances
4. B2 pills — select several, click Næste
5. B3 priority rank — click 3 items in order, click Næste
6. B4 pills — select, Næste
7. Numbers grid — select, auto-advances
8. Lead gen loads — fill email, submit → thank you screen
9. Repeat from landing with Q0 = zenegy track, verify A1–A4 show correctly, verify numbers awareness skips when "numbers" selected in A1

- [ ] **Step 5: Commit**

```bash
git add src/App.tsx src/main.tsx
git commit -m "feat: wire App.tsx entry point"
```

---

## Task 15: Vercel deployment

**Files:**
- Create: `vercel.json`
- Create: `.env.local` (from `.env.example` — not committed)

- [ ] **Step 1: Create `vercel.json`**

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

- [ ] **Step 2: Add `.env.local` to `.gitignore`**

Open `.gitignore` and confirm it contains:
```
.env.local
.env*.local
```

- [ ] **Step 3: Build to verify no TypeScript errors**

```bash
npm run build
```

Expected: `dist/` folder created, no TypeScript errors, no Vite warnings.

- [ ] **Step 4: Deploy to Vercel**

```bash
npx vercel --prod
```

When prompted:
- Link to existing project or create new: create new
- Project name: `zenegy-market-survey`
- Root directory: `./`
- Set env vars in Vercel dashboard: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`

- [ ] **Step 5: Final commit**

```bash
git add vercel.json .gitignore
git commit -m "feat: Vercel deployment config"
```

---

## Self-Review

**Spec coverage check:**

| Spec requirement | Task |
|---|---|
| Vite + React + TypeScript + Tailwind | Task 1 |
| Supabase DB schema + client | Task 4 |
| Keyboard shortcuts (Enter, 1-9, ←) | Task 5 |
| Auto-advance on single-select (300ms) | Task 9 (QuestionRenderer) |
| Slide animations (forward/backward) | Task 10 (SurveyShell + index.css) |
| ChoiceList (single + multi) | Task 6 |
| LogoGrid with Andet text reveal | Task 7 |
| PillSelect multi-select | Task 7 |
| EmojiRating | Task 7 |
| PriorityRank (1st/2nd/3rd) | Task 8 |
| NPSScale 0–10 | Task 8 |
| OpenText with char count | Task 8 |
| All Track B questions (B1–B5) | Task 3 (data) + Task 9 (render) |
| All Track A questions (A1–A5) | Task 3 (data) + Task 9 (render) |
| Numbers awareness conditional skip | Task 3 (getQuestionSequence) |
| Landing page with iPad illustration | Task 12 |
| Lead gen (email + newsletter + demo) | Task 13 |
| Thank you + LinkedIn share | Task 12 |
| Progress bar | Task 10 |
| Vercel deploy | Task 15 |
| Danish language throughout | All screens |

**No placeholders found.**

**Type consistency:** `RankEntry`, `SurveyAnswers`, `Question`, `Option`, `Phase`, `Direction` — all defined in Task 2 and used consistently through Tasks 3–14.
