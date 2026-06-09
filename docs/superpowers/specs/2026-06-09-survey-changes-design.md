# Survey changes — design (2026-06-09)

Status: approved

Eight question-level changes to the market survey, plus the shared pieces they
need (an icon set, two new input components, two new question types, three new
data fields). Builds on the v2 redesign
(`2026-06-08-survey-redesign-v2.md`). Visual rules in the
`survey-design-language` memory still hold; the one sanctioned exception is the
AI question's semantic colors (see change 6).

## Changes

### 1. q0 "Bruger du Zenegy som dit lønsystem i dag?" — icon-on-top tiles
- New presentation: a 2-up grid of tiles, **icon on top, text below** (label +
  subLabel), replacing the radio-row `ChoiceList`.
- Left tile icon = the Zenegy app symbol (lavender square + purple mark, the
  same mark used in `SurveyShell`). Right tile icon = a neutral **gray
  grid-of-tiles glyph** representing "another system" — deliberately generic,
  not a competitor logo.
- New question type `choice-tiles` → new `ChoiceTiles` input component.
- Auto-advance preserved (selecting a tile advances).

### 2. role "Hvad er din rolle i virksomheden?" — removed
- The gate question already establishes decision-maker status, so this is
  redundant. Delete `ROLE_QUESTION` and its references: `getQuestionSequence`
  (both tracks), `getStepGroups` (`'role'` drops from the "Om dig" group),
  `isAnswered`, `handleAnswer` keyMap, `getAnswer`.
- Remove `role` from the `SurveyAnswers` type and stop populating it on submit.
- The DB `role` column **stays** (nullable, unused) — no destructive migration.

### 3. a2 "Hvor tilfreds er du med Zenegy?" — distinct faces + comment-on-select
- Redraw the 5 faces so each is clearly distinct: widen the mouth-curvature
  range and give "Meget tilfreds" a genuinely open/raised smile so it no longer
  reads the same as "Tilfreds". Selected face **stays brand purple** — the bug
  was shape similarity, not color, and rainbow faces would break the one-accent
  rule.
- Remove `autoAdvance`. After a face is selected, an **optional comment** field
  reveals below it ("Vil du uddybe? (valgfrit)"); user then clicks Next.
- New field `a_satisfaction_text` (key `a2_text`).

### 4. a3 "Hvad sætter du allermest pris på ved Zenegy?" — icons per option
- Keep all 5 options (they're distinct) but add a leading **icon tile** to each
  so the list scans at a glance: speed, price-tag, integrations/plug,
  support/chat, all-in-one/layers.
- Stays `choice-single` with open-text; `ChoiceList` gains optional `iconName`
  rendering.

### 5. a4 "Ville du anbefale Zenegy?" (NPS) — kept, differentiated from a2
- No structural change. Reframe copy so a2 and a4 don't read as the same
  question: a2 = how Zenegy feels day-to-day; a4 = advocacy ("would you put your
  name behind it to a peer"). Adjust both subtexts to make the distinction
  explicit.

### 6. ai "Ville du overveje AI-automatisering?" — semantic colors
- **Sanctioned exception to the purple-only rule.** Each option carries a `tone`:
  `positive` (green) for the two "ja", `caution` (amber) for "måske",
  `negative` (red) for "nej".
- `ChoiceList` renders a small colored dot per option; on select the row tints
  softly to that tone's color with a matching check, instead of purple.

### 7. b2 "Hvad frustrerer dig mest?" — two-column icon tiles + "Andet"
- Move from wrapped `pill-select` → **2-column icon tiles** (icon top, label
  below), multi-select with a check badge.
- Add an **"Andet"** tile that, when selected, reveals a free-text input below
  the grid. New field `b_frustration_other` (key `b2_other`).
- Icons: price, slow, ui-confusing, integrations, support, features,
  slow-payroll, no-app, satisfied, other.

### 8. b4 "Hvad holder dig tilbage fra at skifte?" — two-column icon tiles + "Andet"
- Same treatment as b2. New field `b_barrier_other` (key `b4_other`).
- Icons: transition, time, faith, cost, unknown, accountant, happy, other.

## Shared pieces

- **`src/components/icons/glyphs.tsx`** — a `Glyph` component rendering ~18
  simple static line icons (lucide-style) keyed by name, shared across q0, a3,
  b2, b4. Plus the named `zenegy` (colored symbol) and `other-system` (gray
  grid) marks for q0.
- **`ChoiceTiles`** input — 2-up tiles, icon on top, single-select, autoAdvance.
- **`TileSelect`** input — 2-column tiles, multi-select, optional "other" reveal.
  Replaces `PillSelect` for b2/b4; `PillSelect` is retired (its only callers).
- **`Option` type** gains `iconName?: string` and `tone?: 'positive' |
  'caution' | 'negative'`.
- **`Question` type** gains types `choice-tiles` and `tile-select`, and an
  `otherKey?`/reveal field as needed for the "Andet" input wiring.
- **`QuestionRenderer`** routes the new types; renders the after-select comment
  for emoji-rating when `hasOpenText`.
- **`SurveyFlow.handleAnswer`** keyMap gains `a2_text → a_satisfaction_text`,
  `b2_other → b_frustration_other`, `b4_other → b_barrier_other`.

## Data model

Migration `003_survey_changes_columns.sql`, idempotent, matching the existing
`ADD COLUMN IF NOT EXISTS` pattern:

```sql
alter table submissions
  add column if not exists a_satisfaction_text text,
  add column if not exists b_frustration_other text,
  add column if not exists b_barrier_other     text;
```

`SurveyAnswers` / `Submission` gain the three matching optional fields; `role` is
removed from the types.

## Testing

- `questions.test.ts`: sequences no longer contain `role`; q0 is `choice-tiles`;
  b2/b4 are `tile-select` with an "other" option.
- `QuestionRenderer.test.tsx` / input tests: new components render and select;
  emoji-rating reveals the comment after selection; "Andet" reveals its input.
- Update/remove any test asserting the role question or `PillSelect`.
- Validate with `npm run build` + `npm test`. Visual verification is done by the
  user (per the `verification-workflow` memory) — no self-screenshotting.

## Decisions locked during brainstorming

- NPS kept and differentiated (not removed).
- b2/b4 → two-column icon tiles (not vertical rows, not pills).
- q0 "other" = neutral gray glyph, not a competitor logo.
- a2 selected face stays purple; differentiation is by shape only.
