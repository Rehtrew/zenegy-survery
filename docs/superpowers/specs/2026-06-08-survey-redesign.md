# Survey Redesign — 2026-06-08

## Overview

A holistic redesign of the market survey tool addressing five areas: remove incentive, remove keyboard shortcut, white sidebar with proper step indicator, brand illustrations, and content/UX cleanup.

---

## 1. Remove incentive entirely

The iPad prize draw is removed. No replacement incentive is introduced now (may be added later).

**Touch points:**
- `LandingPage.tsx` — remove "1 iPad, til en heldig deltager" from stats row; remove iPad mention from hero body copy; replace the "iPad konkurrence" perk card with "Resultater deles" (we'll share the findings)
- `LeadGen.tsx` — reframe purpose from "enter to win" to "receive the results". New value prop: "Indtast din email og vi sender dig resultaterne, når undersøgelsen lukker." Email is **optional** — add a "Spring over" link that skips to ThankYou without requiring email. The dark card background changes to light (see sidebar/design section).
- `ThankYou.tsx` — remove "Lodtrækning d. 1. august 2025". New message: "Tak! Hvis du har indtastet din email, sender vi dig resultaterne, når undersøgelsen lukker."
- Fix "7 spm" stat on landing — change to "8–10 min" or just remove the question count entirely since it varies by track.

---

## 2. Remove keyboard shortcuts & hint

- `useKeyboard.ts` — remove `e.key === 'Enter'` from the advance handler. Keep: Space bar (debatable — remove too for consistency), ArrowLeft/Backspace for back, number keys 1–9 for selection.

  **Decision:** Remove both Enter and Space from advance. Number key selection stays — it's genuinely useful for choice questions and invisible to non-power-users.

- `SurveyShell.tsx` — remove the keyboard hint footer entirely (`"Enter for at fortsætte · ← for at gå tilbage"`).

---

## 3. White sidebar + redesigned step indicator

### Sidebar shell
- Background: `#ffffff`
- Right border: `1px solid #e8e8e8`
- Width: 260px (unchanged)
- Logo: dark version (reuse `ZenegyLogoFull` from `LandingPage.tsx` — it already supports a `color` prop)

### Step indicator
Replace the current dot + label pattern with a numbered vertical stepper:

Each step row contains:
- A **step circle** (20×20px):
  - **Upcoming:** white fill, `1px solid #e0e0e0` border, gray number inside (`#b3b3b3`)
  - **Active:** `#6e30fd` fill, white number inside, `box-shadow: 0 0 0 3px rgba(110,48,253,0.12)`
  - **Done:** white fill, `1px solid #e0e0e0` border, purple checkmark SVG inside (12px)
- A **connector line** between steps: `1px solid #e8e8e8`, 20px tall, left-aligned under the circle centre
- A **label**: 13px, `font-weight: 500`
  - Upcoming: `#b3b3b3`
  - Active: `#111111`
  - Done: `#999999`

No bottom footer. No keyboard hints.

---

## 4. Illustrations

### Landing page hero
Remove the iPad image (`ipad.png`). Replace with one SVG from `src/assets/Illustrations/Business/` or `Abstract/` placed on the right side of the hero card. The illustration is absolutely positioned, right-aligned, bottom-anchored, with a left-fade mask (`linear-gradient(to right, transparent 0%, black 20%)`). Same visual slot as the iPad image — just a brand illustration instead.

**Chosen illustration:** `Business _ megaphone, announcement, communication, marketing, promotion.svg` — fits the "market survey / share your voice" theme. If the composition doesn't work, fall back to an abstract geometric one.

Import the SVG as a React component (Vite supports `?react` suffix for SVGs).

### ThankYou page
Replace the Lucide `CircleCheck` icon + purple circle with a proper success illustration from `src/assets/Illustrations/Success/`. Use `Success _ achievement, success, trophy, awards, celebration.svg` or the mountain/flag one for a "you made it" feel.

Display the illustration at ~160px wide, centered, above the heading. Remove the current purple circle wrapper.

---

## 5. Content & UX cleanup

### Remove decorative noise
- `QuestionRenderer.tsx` — remove the `✦ Spørgsmål` label (the `{question.subText && <div>✦ Spørgsmål</div>}` block at the top). It adds no information and looks undesigned.

### Button polish
- Replace text-arrow combos (`← Tilbage`, `Næste →`) with icon+label using Lucide icons already in the project (`ArrowLeft`, `ArrowRight`).
- The back button: `<ArrowLeft size={16} /> Tilbage`
- The next button: `Næste <ArrowRight size={16} />`

### First question layout fix
When `isFirst` is true, the back button is hidden but the flex layout still has a `<div />` placeholder — verify this doesn't cause the Next button to mis-align.

### LeadGen redesign
- Move LeadGen into the SurveyShell so it shares the sidebar and step indicator. The current "floating dark card" approach feels detached.
- OR: Use a white card on the `var(--color-surface-page)` background — consistent with the survey's light aesthetic.
- Decision: **wrap in SurveyShell** — shows "Deltag" as the active final step, maintains sidebar context.
- Add a "Spring over →" text link below the submit button that calls `onSubmitted()` without submitting (bypasses Supabase call entirely — no data is saved for skipped respondents).

### Landing stats row
Current: `~3 min | 7 spm | 1 iPad`
New: `~3 min | Anonym | Resultater deles`
(Removes inaccurate question count, removes iPad, adds honest value props)

---

## 6. File change map

| File | Changes |
|------|---------|
| `src/lib/useKeyboard.ts` | Remove Enter + Space from advance trigger |
| `src/components/SurveyShell.tsx` | White sidebar, dark logo, new step indicator, remove keyboard hint |
| `src/components/QuestionRenderer.tsx` | Remove ✦ label, icon buttons |
| `src/screens/LandingPage.tsx` | Remove iPad image/import, update stats, update perk card, add illustration |
| `src/screens/LeadGen.tsx` | Reframe copy, optional email (skip link), light card, wrap in SurveyShell |
| `src/screens/ThankYou.tsx` | Add success illustration, update copy |
| `src/screens/SurveyFlow.tsx` | Pass SurveyShell props to LeadGen if wrapping it |

---

## Out of scope

- Question content edits beyond removing ✦ label
- Track B question count reduction
- Mobile responsiveness
- Animation refinements
