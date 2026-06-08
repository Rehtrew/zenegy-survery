# Survey Redesign v2 — 2026-06-08

Supersedes `2026-06-08-survey-redesign.md`. Validated screen-by-screen with the user
via browser mockups before implementation. Guiding principle: **Typeform ease-of-use +
Apple-style simplicity**, on the Zenegy brand (single purple accent, weight 500 only).

## Design decisions (approved)

### Foundation
- **Kill the rotating "scenes" color system.** `scenes.ts` collapses to a single brand
  theme: white card, dark ink (`#14132b`), muted gray (`#86868b`), one accent (`#6e30fd`).
  Component signatures keep the `scene` prop (now constant) to avoid churn.
- **Single persistent shell** wraps *every* phase — landing, questions, lead-gen,
  thank-you. The sidebar never disappears; the layout never "changes when the survey starts".
- **No uppercase anywhere.** Sentence case only. Weight 500 only (PP Neue Montreal Medium).

### Sidebar
- **App symbol only** at the top (the lavender-square + purple-mark SVG the user supplied).
  No wordmark next to it.
- **Clean Apple-style step rows**: small status dot + label; active row in a soft purple
  pill (`#efeafe`, purple text); done = filled purple dot; upcoming = hollow gray dot.
  **No checkmarks, no per-section bars.**
- **Velkommen** (home icon) and **Tak** (flag icon) are milestone rows that bookend the
  question sections — so landing + completion are visibly part of the journey.
- **Bottom progress card** (replaces the old "Tilpasset dine svar" box): title + `%` badge
  + a segmented tick bar with a light→deep purple gradient on filled ticks. This is the
  modeled on the user's "Almost There" reference, recolored to brand purple. It is *the*
  overall-progress cue.
- A subtle "Forlad undersøgelsen" exit link at the very bottom.

### Question screen
- White card holds **only** the question + answer input (+ optional open text). A small
  sentence-case eyebrow shows the active section name.
- **Tilbage / Næste live in a bottom bar anchored to the bottom of the main area** — they
  no longer sit inside the card, so they stop shifting as the card grows/shrinks.
- Auto-advance questions hide the Næste button (unchanged behavior).

### Inputs
- All inputs restyled for a white card: unselected = subtle gray fill (`#f6f6f7`); selected
  = light purple fill (`#efeafe`) + purple border/accent. (Old translucent-white fills were
  invisible on white.)
- **Emoji smileys kept** (SVG faces) for satisfaction questions.
- **NPS (`a4`) becomes a draggable slider**: track + purple fill + draggable handle + value
  bubble, 11 clickable stops (0–10) underneath, ticks, and end labels. Rebuilt inside the
  existing `NPSScale` component so the existing tests (11 stops, readout, numeric onChange)
  stay green.

### Landing page
- Renders inside the shell ("Velkommen" active). Card content: purpose-driven headline,
  warm subcopy, and **three consistent value props** with matching icon treatment:
  - ~2–3 minutter (respects your time)
  - Helt anonymt (safe to be honest)
  - Vi deler resultaterne (you get the insights back)
- **Removed:** "Visuelle spørgsmål" (an internal feature, not a respondent benefit), the
  iPad/incentive, the three mismatched colored boxes. CTA ("Start undersøgelsen") is the
  shell's bottom-bar primary button.

### Thank-you
- Renders inside the shell ("Tak" active, 100%). Success illustration, "Tak for din tid!",
  honest results-sharing copy, LinkedIn share + "Læs mere om Zenegy".

### Lead-gen ("Deltag")
- Already inside the shell. Drops its own back button (shell provides it), inputs restyled
  to white-card language. Keeps optional email, skip link, book-demo.

## File change map
| File | Change |
|------|--------|
| `lib/scenes.ts` | Single brand theme |
| `components/SurveyShell.tsx` | Full rewrite (sidebar + bottom nav + progress card) |
| `screens/SurveyFlow.tsx` | Render shell for all phases; nav + progress config |
| `components/QuestionRenderer.tsx` | Remove in-card nav; add eyebrow |
| `components/inputs/*` | White-card fills; weight 500 |
| `components/inputs/NPSScale.tsx` | Rebuild as draggable slider (tests preserved) |
| `screens/LandingPage.tsx` | In-shell card; new IA/copy/value props |
| `screens/ThankYou.tsx` | In-shell card |
| `screens/LeadGen.tsx` | Drop own back; white-card fills |
| `App.tsx` | Wiring updates |

## Out of scope
- Question content changes beyond NPS input type + landing copy
- Mobile responsiveness pass
- Supabase schema changes
