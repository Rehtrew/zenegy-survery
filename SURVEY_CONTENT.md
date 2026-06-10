# Survey Content — Lønmarkedet 2026

All text, labels, and questions in the survey, organised by screen.

---

## Landing page

**Eyebrow chip**
> Markedsundersøgelse om løn

**Headline**
> Hjælp os med at gøre løn bedre i Danmark

**Body**
> Vi er nysgerrige på din ærlige mening — uanset om du bruger Zenegy eller et helt andet system. Dine svar former de værktøjer, tusindvis af danske virksomheder bruger hver måned.

**Primary CTA**
> Start undersøgelsen

**Value rows**

| Icon | Title | Subtitle |
|------|-------|----------|
| Clock | 2–3 minutter | De fleste er færdige på et par minutter. |
| Lock | Helt anonymt | Vær ærlig — vi registrerer ikke, hvem du er. |
| Bar chart | Vi deler resultaterne | Du får indsigterne, når undersøgelsen lukker. |

---

## Gate question

**Question ID:** `gate`  
**Type:** Single choice (auto-advance)

> Spiller du en rolle i valg af løn- eller regnskabssoftware?

**Subtext**
> Dit svar afgør hvilke spørgsmål du ser.

**Options**

| Value | Label | Sublabel |
|-------|-------|----------|
| `decision-maker` | Ja, jeg er med til at beslutte | Direktør, bogholder, HR eller lignende |
| `employee` | Nej, jeg bruger systemerne som medarbejder | Lønmodtager uden systemansvar |

---

## Opening question (decision-makers only)

**Question ID:** `q0`  
**Type:** Choice tiles (auto-advance)

> Bruger du Zenegy som dit lønsystem i dag?

**Subtext**
> Dit svar afgør hvilke spørgsmål du ser — vi giver dig den mest relevante oplevelse.

**Options**

| Value | Label | Sublabel |
|-------|-------|----------|
| `zenegy` | Ja, jeg bruger Zenegy | Jeg er eksisterende kunde |
| `non-zenegy` | Nej, jeg bruger et andet system | Dataløn, Bluegarden, Lessor, eller andet |

---

## Track A — Zenegy customers

### A1 · Product usage

**Question ID:** `a1`  
**Type:** Multi-choice

> Hvilke Zenegy-produkter bruger du?

**Subtext**
> Markér alle du bruger aktivt — det hjælper os forstå din brug.

**Options**

| Value | Label | Sublabel |
|-------|-------|----------|
| `payroll` | Løn | Lønkørsel og lønsedler |
| `numbers` | Numbers | Bogføring og regnskab |
| `expense` | Expense | Udlæg og kvitteringer |
| `time` | Time | Tidsregistrering og fravær |

---

### A2 · Satisfaction rating

**Question ID:** `a2`  
**Type:** Emoji rating

> Hvor tilfreds er du med Zenegy i hverdagen?

**Subtext**
> Tænk på din daglige oplevelse med produktet — ikke kun onboarding.

**Open text label:** Vil du uddybe? (valgfrit)  
**Open text placeholder:** Hvad ligger bag dit svar?  
**Max length:** 300

**Options**

| Value | Label |
|-------|-------|
| `very-unhappy` | Meget utilfreds |
| `unhappy` | Ikke tilfreds |
| `meh` | Det går |
| `happy` | Tilfreds |
| `very-happy` | Meget tilfreds |

---

### A3 · Best feature

**Question ID:** `a3`  
**Type:** Single choice

> Hvad er det ene du sætter allermest pris på ved Zenegy?

**Subtext**
> Dit svar hjælper os fortælle historien om Zenegy til andre — med dine ord.

**Open text label:** Vil du uddybe? (valgfrit)  
**Open text placeholder:** Fortæl os gerne med egne ord, hvad der gør Zenegy værdifuldt for dig...  
**Max length:** 200

**Options**

| Value | Label |
|-------|-------|
| `speed` | Det er hurtigt og nemt at køre løn |
| `price` | Prisen er rigtig |
| `integrations` | Integrationer med mine andre systemer |
| `support` | Support der rent faktisk hjælper |
| `all-in-one` | Alt samlet ét sted (løn + Numbers) |

---

### A4 · NPS

**Question ID:** `a4`  
**Type:** NPS scale (0–10)

> Ville du anbefale Zenegy til en kollega eller forretningsforbindelse?

**Subtext**
> Det her måler noget andet end tilfredshed — om du ville sætte dit navn på en anbefaling til andre.

**Scale labels:** Slet ikke (0) — Helt sikkert (10)

**Open text label:** Hvad er det ene du ville ønske Zenegy gjorde bedre? (valgfrit)  
**Open text placeholder:** Din feedback går direkte til vores produktteam...

---

## Track B — Non-Zenegy customers

### B1 · Current payroll system

**Question ID:** `b1`  
**Type:** Logo grid (auto-advance)

> Hvilket lønsystem bruger din virksomhed i dag?

**Subtext**
> Vælg det primære system din virksomhed bruger til lønkørsel.

**Options**

| Value | Label | Sublabel |
|-------|-------|----------|
| `dataloen` | Dataløn | by Visma |
| `bluegarden` | Bluegarden | |
| `lessor` | Lessor | |
| `intect` | Intect | |
| `sd-loen` | SD Løn | |
| `danloen` | Danløn | |
| `zenegy` | Zenegy | |
| `andet` | Andet | |

---

### B2 · Frustrations

**Question ID:** `b2`  
**Type:** Tile select (multi, with open text)

> Hvad frustrerer dig mest ved dit nuværende lønsystem?

**Subtext**
> Vær ærlig — det er præcis den slags input vi har brug for. Vælg alle der passer.

**Open text placeholder:** Hvad frustrerer dig?

**Options**

| Value | Label |
|-------|-------|
| `price` | Prisen er for høj |
| `slow` | Det er langsomt og tungt |
| `ui` | Brugergrænsefladen er forvirrende |
| `integrations` | Dårlige integrationer |
| `support` | Support er svær at komme igennem til |
| `features` | Mangler features jeg har brug for |
| `slow-payroll` | Lønkørsel tager for lang tid |
| `no-app` | Ingen god mobilapp |
| `satisfied` | Faktisk ikke noget — jeg er tilfreds |
| `other` | Andet |

---

### B3 · Priorities

**Question ID:** `b3`  
**Type:** Priority rank (top 3)

> Hvad er vigtigst for dig i et lønsystem?

**Subtext**
> Klik for at markere dine top 3 — i prioriteret rækkefølge. Hvad ville du betale mest for?

**Options**

| Value | Label |
|-------|-------|
| `price` | Pris og value for money |
| `ux` | Enkel og intuitiv brugerflade |
| `integrations` | Integrationer (bank, HR, regnskab) |
| `compliance` | Compliance og automatisk SKAT-indberetning |
| `support` | God og hurtig kundesupport |
| `mobile` | Mobilapp til medarbejdere |
| `features` | Features og automatisering |

---

### B4 · Switching barriers

**Question ID:** `b4`  
**Type:** Tile select (multi, with open text)

> Hvad holder dig tilbage fra at skifte lønsystem?

**Subtext**
> Ærlighed hjælper os med at forstå markedet bedre — der er ingen forkerte svar.

**Open text placeholder:** Hvad holder dig tilbage?

**Options**

| Value | Label |
|-------|-------|
| `transition` | Overgangen virker for besværlig |
| `time` | Vi har ikke tid til at implementere nyt |
| `faith` | Jeg tror mit system bliver bedre |
| `cost` | Skifteomkostningerne er for høje |
| `unknown` | Jeg kender ikke alternativerne godt nok |
| `accountant` | Det er min revisor/bogholder der beslutter |
| `happy` | Jeg er faktisk tilfreds — skifter ikke |
| `other` | Andet |

---

## Employee track

### E1 · Payslip delivery

**Question ID:** `e1`  
**Type:** Single choice (auto-advance)

> Modtager du din lønseddel digitalt?

**Subtext**
> Fortæl os om din nuværende oplevelse.

**Options**

| Value | Label |
|-------|-------|
| `app` | Ja, via app eller selvbetjeningsportal |
| `email` | Ja, som PDF på email |
| `paper` | Nej, på papir eller print |

---

### E2 · Payroll process satisfaction

**Question ID:** `e2`  
**Type:** Emoji rating (auto-advance)

> Hvad synes du om lønprocessen i din virksomhed?

**Subtext**
> Tænk på din daglige oplevelse som medarbejder.

**Options**

| Value | Label |
|-------|-------|
| `bad` | Besværlig |
| `ok` | Det fungerer |
| `good` | Problemfri |

---

### E3 · Expense reporting

**Question ID:** `e3`  
**Type:** Single choice (auto-advance)

> Indberetter du udgifter eller udlæg til din virksomhed?

**Options**

| Value | Label |
|-------|-------|
| `yes-easy` | Ja, regelmæssigt og det er nemt |
| `yes-hard` | Ja, men processen er besværlig |
| `no` | Nej, ikke relevant for mig |

---

### E4 · AI trust

**Question ID:** `e4`  
**Type:** Single choice (auto-advance)

> Ville du have tillid til en AI der håndterede din lønseddel?

**Subtext**
> Der er ingen forkerte svar.

**Options**

| Value | Label |
|-------|-------|
| `yes` | Ja, hvis systemet er nøjagtigt |
| `controlled` | Kun med menneskelig kontrol undervejs |
| `no` | Nej — løn er for vigtigt til AI |

---

## Shared / tail questions

### AI automation (shown to all decision-maker tracks)

**Question ID:** `ai`  
**Type:** Single choice (auto-advance)

> Ville du overveje AI-automatisering i jeres lønproces?

**Subtext**
> AI er på alles læber — vi er nysgerrige på jeres holdning.

**Options**

| Value | Label | Tone |
|-------|-------|------|
| `using` | Ja, vi bruger det allerede | positive |
| `interested` | Ja, vi er interesserede | positive |
| `exploring` | Måske — vi undersøger det | caution |
| `no` | Nej, ikke foreløbigt | negative |

---

### Accounting system awareness (Track B + Track A without Numbers)

**Question ID:** `numbers`  
**Type:** Logo grid (auto-advance)

> Hvilket regnskabssystem bruger du i dag?

**Subtext**
> Vi er nysgerrige — ikke på jagt efter salg.

**Options**

| Value | Label |
|-------|-------|
| `e-conomic` | e-conomic |
| `dinero` | Dinero |
| `billy` | Billy |
| `uniconta` | Uniconta |
| `visma` | Visma |
| `zenegy-numbers` | Zenegy Numbers |
| `andet` | Andet |

---

## Question routing

```
[gate]
  ├─ employee        → E1 → E2 → E3 → E4
  └─ decision-maker  → [q0]
                          ├─ zenegy      → A1 → A2 → A3 → A4 → [ai] → (if no Numbers: [numbers])
                          └─ non-zenegy  → B1 → B2 → B3 → B4 → [ai] → [numbers]
```

---

## Thank-you screen

After completing the survey, respondents see a thank-you message and are invited to leave their email to receive the published report.

**Lead-gen screen heading:** (see LeadGen.tsx for exact copy)

---

## Landing report preview cards (non-interactive)

These floating cards on the landing page illustrate the survey experience:

| Card | Question shown |
|------|---------------|
| Satisfaction | Hvad synes du om dit lønsystem? |
| NPS | Ville du anbefale dit lønsystem til andre? |
