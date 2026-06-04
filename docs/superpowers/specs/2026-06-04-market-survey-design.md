# Zenegy Market Survey — Design Spec
_Date: 2026-06-04_

---

## Overview

A standalone web survey for Zenegy — shareable on LinkedIn and via newsletter. Purpose: gather actionable market insights from existing customers and prospects to fuel targeted marketing campaigns. Incentive: iPad contest. Lead capture at the end.

---

## Tech Stack

| Layer | Choice | Rationale |
|---|---|---|
| Framework | React + Vite + TypeScript | Matches existing `.vite` artifact; fast DX |
| Styling | Tailwind CSS | Utility-first, consistent with design system |
| Routing | React Router v6 | Multi-step wizard navigation |
| Database | Supabase (PostgreSQL) | Owned data, free tier covers launch, SQL queryable |
| Hosting | Vercel | Zero-config, fits Vite/React perfectly |
| Language | Danish (da) | Core audience is Danish SMBs |

---

## UX Reference: Typeform-level interactions

The survey must feel as smooth as Typeform. Specific requirements:

- **Full-screen, one question at a time** — no scrolling, no visible question list
- **Keyboard shortcuts:**
  - `Enter` or `Space` → advance to next question
  - Number keys `1`–`9` → select option by index (for single-select questions)
  - `↑` / `↓` arrow keys → navigate between options
  - `Backspace` or `←` → go back one question
- **Auto-advance on single-select** — as soon as a radio/logo card is selected, wait 300ms then automatically advance (with subtle confirmation animation before moving)
- **Multi-select questions** — require explicit "Næste" button (can't auto-advance since user selects multiple)
- **Animated transitions** — questions slide in from the right on advance, from the left on back
- **Animated progress bar** — smooth fill animation on each step
- **Focus management** — first interactive element auto-focused on each question
- **Microcopy throughout** — small, human, reassuring copy under each question (see question details)

---

## Application Structure

```
src/
  components/
    SurveyShell.tsx        # progress bar, keyboard handler, transition wrapper
    QuestionRenderer.tsx   # routes to correct input component by type
    inputs/
      LogoGrid.tsx         # logo card selection (payroll + accounting systems)
      PillSelect.tsx       # pill/tag multi-select
      EmojiRating.tsx      # large emoji single-select
      PriorityRank.tsx     # click-to-rank 1st/2nd/3rd
      NPSScale.tsx         # 0–10 NPS buttons
      OpenText.tsx         # optional free-text textarea
      ChoiceList.tsx       # standard radio list
  screens/
    LandingPage.tsx        # hero screen before first question
    SurveyFlow.tsx         # orchestrates question sequence
    LeadGen.tsx            # email + newsletter + book demo
    ThankYou.tsx           # post-submission confirmation
  lib/
    questions.ts           # question definitions and branching logic
    supabase.ts            # db client + submission function
    keyboard.ts            # keyboard shortcut hook
  types.ts
  App.tsx
```

---

## Survey Flow

### Landing Page

Hero screen shown before question 1.

**Content:**
- Headline: _"Hvad synes du egentlig om løn i Danmark?"_
- Sub: _"Del din mening på 3 minutter og vær med i lodtrækningen om en iPad."_
- Stats row: `~3 min · 5 spørgsmål · 1 iPad`
- 4 perk cards: Anonymt og trygt / Tilpassede spørgsmål / iPad konkurrence / Din stemme tæller
- CTA button: _"Start undersøgelsen →"_
- Fine print: _"Ingen krav om nyhedsbrevstilmelding · Ingen spam"_
- iPad CSS illustration (no external image dependency)

---

### Opening Branch Question

**Q0 — Bruger du Zenegy i dag?**
- Type: `ChoiceList` (2 options, large cards)
- Auto-advance: yes (300ms delay)
- Options:
  - `zenegy` → "Ja, jeg bruger Zenegy" / sub: "Jeg er eksisterende kunde"
  - `non-zenegy` → "Nej, jeg bruger et andet system" / sub: "Dataløn, Bluegarden, Lessor, eller andet"
- Keyboard: `1` or `2`
- Microcopy: _"Dit svar afgør hvilke spørgsmål du ser — vi giver dig den mest relevante oplevelse."_
- Branching: routes to Track A (Zenegy customer) or Track B (non-customer)

---

### Track B — Non-Zenegy customer (5 questions)

**B1 — Lønsystem (logo grid)**
- Type: `LogoGrid`
- Auto-advance: yes (300ms)
- Options (8): Dataløn (Visma), Bluegarden, Lessor, Intect, SD Løn, Danløn, Zenegy, Andet
- "Andet" reveals an inline text input on selection
- Keyboard: `1`–`8`
- Microcopy: _"Vælg det primære system din virksomhed bruger til lønkørsel."_

**B2 — Hvad frustrerer dig mest?**
- Type: `PillSelect` (multi-select)
- Options (9 pills):
  - 💸 Prisen er for høj
  - 🐢 Det er langsomt og tungt
  - 😵 Brugergrænsefladen er forvirrende
  - 🔗 Dårlige integrationer
  - 🆘 Support er svær at komme igennem til
  - 🧾 Mangler features jeg har brug for
  - ⏱️ Lønkørsel tager for lang tid
  - 📱 Ingen god mobilapp
  - 😐 Faktisk ikke noget — jeg er tilfreds
- Requires "Næste" button
- Microcopy: _"Vær ærlig — det er præcis den slags input vi har brug for. Vælg alle der passer."_

**B3 — Hvad er vigtigst for dig i et lønsystem?**
- Type: `PriorityRank` (click to mark 1st / 2nd / 3rd)
- Options (7):
  - 💰 Pris og value for money
  - ✨ Enkel og intuitiv brugerflade
  - 🔗 Integrationer (bank, HR, regnskab)
  - 🎯 Compliance og automatisk SKAT-indberetning
  - 🆘 God og hurtig kundesupport
  - 📱 Mobilapp til medarbejdere
  - ⚡ Features og automatisering
- Medals shown: 🥇 🥈 🥉
- Requires "Næste" button
- Microcopy: _"Klik for at markere dine top 3 — i prioriteret rækkefølge. Hvad ville du betale mest for?"_

**B4 — Hvad holder dig tilbage fra at skifte?**
- Type: `PillSelect` (multi-select)
- Options (7 pills):
  - 😰 Overgangen virker for besværlig
  - ⌛ Vi har ikke tid til at implementere nyt
  - 💡 Jeg tror mit system bliver bedre
  - 💰 Skifteomkostningerne er for høje
  - 🤷 Jeg kender ikke alternativerne godt nok
  - 👥 Det er min revisor/bogholder der beslutter
  - 😊 Jeg er faktisk tilfreds — skifter ikke
- Requires "Næste" button
- Microcopy: _"Ærlighed hjælper os med at forstå markedet bedre — der er ingen forkerte svar."_

**B5 — Numbers awareness (accounting system)**
- Type: `LogoGrid`
- Auto-advance: yes (300ms)
- Options (7): e-conomic, Dinero, Billy, Uniconta, Visma, Zenegy Numbers, Andet
- Microcopy: _"Vi er nysgerrige — ikke på jagt efter salg. 🙂"_
- → Leads to Lead Gen

---

### Track A — Zenegy customer (4 questions)

**A1 — Hvilke Zenegy-produkter bruger du?**
- Type: `ChoiceList` (multi-select checkboxes)
- Options: Løn, Numbers, Expense, Time (with emoji + description sub-text)
- Requires "Næste" button
- Microcopy: _"Markér alle du bruger aktivt — det hjælper os forstå din brug."_

**A2 — Tilfredshed (emoji rating)**
- Type: `EmojiRating`
- Auto-advance: yes (300ms)
- Options: 😤 Ikke tilfreds · 😐 Det går · 😊 Tilfreds
- Keyboard: `1` `2` `3`
- Microcopy: _"Tænk på din daglige oplevelse — ikke kun onboarding."_

**A3 — Hvad sætter du allermest pris på?**
- Type: `ChoiceList` (single-select) + optional `OpenText`
- Auto-advance: no (has optional text field)
- Options (5):
  - 🚀 Det er hurtigt og nemt at køre løn
  - 💰 Prisen er rigtig
  - 🔗 Integrationer med mine andre systemer
  - 🆘 Support der rent faktisk hjælper
  - 📊 Alt samlet ét sted (løn + Numbers)
- Optional open text: _"Vil du uddybe? (valgfrit)"_ — placeholder: _"Fortæl os gerne med egne ord..."_ — 200 char max
- Microcopy: _"Dit svar hjælper os fortælle historien om Zenegy til andre — med dine ord."_

**A4 — NPS + hvad kan vi gøre bedre?**
- Type: `NPSScale` (0–10) + optional `OpenText`
- Auto-advance: no (has text field)
- NPS labels: "Ville ikke anbefale" ← → "Vil klart anbefale"
- Optional open text: _"Hvad er det ene du ville ønske Zenegy gjorde bedre?"_ — placeholder: _"Din feedback går direkte til vores produktteam..."_
- Microcopy: _"NPS er en standard vi måler os på — og din kommentar gør den meningsfuld."_

**A5 — Numbers awareness (same as B5)**
- Conditional: skip if user selected "Numbers" in A1
- → Leads to Lead Gen

---

### Lead Gen Screen

Dark-themed full-width card. Shown to all respondents after their track.

**Content:**
- Badge: 🎁 _"Du er næsten i mål!"_
- Headline: _"Tak — dine svar hjælper os med at gøre løn nemmere for alle."_
- Sub: _"Indtast din email for at deltage i lodtrækningen om en iPad. Vi trækker en vinder d. 1. august 2025."_
- Email field (required, validated)
- Checkbox: newsletter opt-in — label: _"Ja tak, jeg vil gerne modtage Zenegys nyhedsbrev med tips, nyheder og produktopdateringer. (Helt valgfrit — du er med i konkurrencen uanset.)"_
- Primary CTA: _"Send svar og deltag i konkurrencen 🎁"_
- Secondary CTA: _"📅 Book en gratis demo med Zenegy"_ (opens Zenegy's booking link)
- Privacy note: _"Din email bruges udelukkende til konkurrencen og evt. nyhedsbrev. Vi deler ikke dine data med tredjepart."_

---

### Thank You Screen

Shown after successful submission.

**Content:**
- Large ✓ animation
- Headline: _"Du er med! 🎁"_
- Sub: _"Vi trækker en vinder d. 1. august og giver dig besked på din email."_
- Share prompt: _"Kender du nogen der også burde deltage?"_ + LinkedIn share button
- Secondary: _"Læs mere om Zenegy →"_ (link to zenegy.com)

---

## Database Schema (Supabase)

```sql
create table submissions (
  id           uuid primary key default gen_random_uuid(),
  created_at   timestamptz default now(),
  track        text not null check (track in ('zenegy', 'non-zenegy')),

  -- Track B fields
  b_payroll_system     text,
  b_payroll_other      text,
  b_frustrations       text[],
  b_priorities         jsonb,   -- [{ rank: 1, value: 'price' }, ...]
  b_barriers           text[],

  -- Track A fields
  a_products           text[],
  a_satisfaction       text,
  a_best_thing         text,
  a_best_thing_text    text,
  a_nps                int,
  a_improve_text       text,

  -- Shared
  accounting_system    text,
  accounting_other     text,

  -- Lead gen
  email                text not null,
  newsletter_opt_in    boolean default false
);

-- Index for analytics
create index on submissions (track);
create index on submissions (created_at);
create index on submissions (b_payroll_system);
```

---

## Design Tokens (to be confirmed against design.zenegy.com)

| Token | Value | Usage |
|---|---|---|
| `--color-primary` | `#00C896` | Buttons, selected states, progress bar, accents |
| `--color-primary-dark` | `#00A07A` | Hover states |
| `--color-primary-light` | `#F0FDF9` | Selected backgrounds |
| `--color-bg` | `#F5F6FA` | Page background |
| `--color-surface` | `#FFFFFF` | Cards |
| `--color-text` | `#1a1a2e` | Primary text |
| `--color-muted` | `#6B7280` | Sub-text, microcopy |
| `--color-border` | `#E8EAED` | Default borders |
| `--color-dark-bg` | `#1a1a2e` | Lead gen dark card |
| `--font-base` | Inter, system-ui | All text |

> Note: design.zenegy.com is behind auth. Tokens above are inferred from the public site. Adjust once design guide access is confirmed.

---

## Payroll System Logo Assets

Real logos needed (SVG preferred) for:
- Dataløn (Visma), Bluegarden, Lessor, Intect, SD Løn, Danløn

Zenegy logo: use brand asset. Mockup uses colored initials as placeholder until assets are sourced.

---

## Microcopy Principles

1. **Human, not corporate** — "Vær ærlig — det er præcis den slags input vi har brug for" not "Please select all applicable options"
2. **Reassuring, not pressuring** — always note optional fields are optional, contest requires no newsletter signup
3. **Short** — max 1 sentence per question sub-text
4. **Specific** — each sub-text gives context for *why* we're asking, not just *what* to do

---

## Keyboard Shortcuts

| Key | Action |
|---|---|
| `Enter` / `Space` | Advance (if answer selected) |
| `1`–`9` | Select option by index |
| `↑` / `↓` | Navigate between options |
| `←` / `Backspace` | Go back one question |
| `Escape` | (no action — keep user in survey) |

---

## Animation Spec

| Interaction | Animation |
|---|---|
| Question advance | Slide current out left, new in from right (300ms ease-out) |
| Question back | Slide current out right, new in from left (300ms ease-out) |
| Option selected (auto-advance) | Selected state + 300ms pause + transition |
| Progress bar | Width transition, 400ms ease-in-out |
| Pill select | Background + color transition, 150ms |
| Logo card hover | translateY(-2px) + shadow, 150ms |
| Lead gen submit | Button spinner, then transition to ThankYou |

---

## Out of Scope (for v1)

- Multi-language support (Danish only)
- Admin dashboard (read Supabase directly)
- Email automation on submission
- A/B testing question variants
- Embedded mode (standalone URL only)
