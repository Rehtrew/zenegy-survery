# Landing hero with report visual — design (2026-06-09)

Status: approved

Expand the landing into a **wide split hero** (inspired by fabrichealth.com) that
shows the survey is a data/insight tool: copy + value props on the left, an
animated fictional "report" panel on the right. Sidebar, progress card, and the
bottom "Start undersøgelsen" bar are unchanged. The focused 580px card returns
for the question phases (the one width change, accepted during brainstorming).

## Layout

- **SurveyShell**: phase-aware. `phase === 'landing'` → main area max-width ~1080
  and the card renders with `padding: 0` + `clip` (overflow hidden) so the report
  panel can bleed to the card's rounded edges. All other phases unchanged (580px,
  existing padding). Applies to both desktop and mobile branches.
- **LandingPage**: a responsive `.hero-grid` (two columns desktop, one column on
  ≤900px). Left column owns its own padding (the card padding is now 0) and is
  vertically centred. Right column = `<LandingReport />` filling its cell, bleeding
  to the card's top/right/bottom edges.
- The **Start CTA stays in the bottom bar** (unchanged) — keeps the nav pattern and
  the "layout must not change when the survey starts" rule intact.

## LandingReport panel

- Background: the design-system gradient `#120C2B → #9D94FF (56%) → #EBE6FF`
  (diagonal), with a **pulsating low-opacity dotted grid** overlaid (white-ish dots
  on the purple field, ~0.1 opacity, slow ~4.5s ease-in-out opacity pulse — the
  Figma reference, colour adapted to the dark gradient).
- A white **"Lønmarkedet 2026"** report card floats on the panel (soft shadow,
  small Zenegy symbol + skeleton title/subtitle), containing fictional survey
  visuals:
  - **NPS donut gauge** (purple arc, sweeps on entrance) with a score,
  - **bar chart** (purple bars, grow on entrance, staggered),
  - **area/sparkline trend** ("svar over tid", line draws via `pathLength`),
  - **skeleton paragraph bars** (grey rounded rects, varying widths).
- Two small **floating accent cards** offset over the panel (fabric-style), e.g.
  "1.248 svar / +18%" with a tiny sparkline, and a GDPR/anonymity check chip. One
  gets a gentle float loop.

## Motion (per motion-design skill)

- Dot grid: opacity pulse, ease-in-out, ~4.5s loop.
- Charts: one-shot entrance on mount — bars `scaleY` grow (reuse `bar-grow`),
  donut `stroke-dashoffset` sweep, sparkline `pathLength` draw. Curves from the
  existing vocabulary (`cubic-bezier(0.22,1,0.36,1)` / spring pop).
- All under the existing `prefers-reduced-motion` guard → static for those users.
- `transform`/`opacity` only (compositor-friendly).

## Build

- New `src/screens/LandingReport.tsx` — self-contained; mini charts are small
  inline SVGs (no chart library, keep the bundle lean).
- `src/screens/LandingPage.tsx` — wrap existing content as the left column + add
  the report panel; responsive grid.
- `src/components/SurveyShell.tsx` — phase-aware max-width + `clip` prop on
  `CardStack`; landing card padding 0.
- `src/index.css` — `.hero-grid`, dot-grid background + `dot-pulse`, chart
  entrance keyframes (`donut-sweep`, `spark-draw`, reuse `bar-grow`), `float`.

## Decisions locked

- Wide split hero (not stacked / not contained).
- Purple design-system gradient (not fabric's peach).
- Start CTA stays in the bottom bar.
- "Expand a bit": one report card + two floating accents, not a full dashboard.
