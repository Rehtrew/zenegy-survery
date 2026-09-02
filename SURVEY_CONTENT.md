# Survey Content — Lønmarkedet 2026

Alt tekst, alle spørgsmål og alle svarmuligheder i undersøgelsen. Genereret ud fra
`src/lib/questions.ts` (2026-09-02) — koden er kilden; opdater doc'et, når spørgsmålene ændres.

Undersøgelsen har fire spor:

| Spor | Hvem | Hvordan de rammes |
|------|------|-------------------|
| **Medarbejder** | Lønmodtagere uden systemansvar | `gate` = `employee` |
| **A — Zenegy-kunde** | Intern løn-/systemansvarlig, der bruger Zenegy | `context` = `internal` + `q0` = `zenegy` |
| **B — Andet system** | Intern løn-/systemansvarlig på et andet system | `context` = `internal` + `q0` = `non-zenegy` |
| **C — Bureau** | Revisorer, bogholdere og lønbureauer, der kører løn for kunder | `context` = `bureau` eller `both` |

## Alle spørgsmål, sti for sti

Hver respondent ser én af stierne herunder — spørgsmålene i den rækkefølge, de kommer.
Ingen ser dem alle. Ordlyd og svarmuligheder står længere nede under **Spørgsmål**.

### employee — 5 spørgsmål

| # | ID | Spørgsmål | Type |
|---|----|-----------|------|
| 1 | `gate` | Hvilken rolle spiller du i håndteringen af løn eller regnskab? | choice-single |
| 2 | `e1` | Hvor modtager du typisk din lønseddel? | choice-single |
| 3 | `e2` | Hvilke administrative opgaver oplever du som mest besværlige på din arbejdsplads? | tile-select |
| 4 | `e3` | Hvis du laver et udlæg, hvor lang tid bruger du i gennemsnit på at registrere det? | choice-single |
| 5 | `e4` | Hvor ville du være mest tryg ved, at en AI hjalp dig med dine løn- og arbejdsdata? | choice-single |

### internal-zenegy — 11 spørgsmål

| # | ID | Spørgsmål | Type |
|---|----|-----------|------|
| 1 | `gate` | Hvilken rolle spiller du i håndteringen af løn eller regnskab? | choice-single |
| 2 | `context` | Kører du løn for din egen virksomhed — eller for andres? | choice-single |
| 3 | `q0` | Er Zenegy en del af jeres systemlandskab i dag? | choice-tiles |
| 4 | `size` | Hvor mange medarbejdere kører I løn for? | choice-single |
| 5 | `a1` | Hvilke Zenegy-produkter bruger du aktivt i dag? | choice-multi |
| 6 | `a1_migration` | Hvilket system kom du fra, da du valgte Zenegy? | logo-grid |
| 7 | `a2` | Hvor tilfreds er du med Zenegy i hverdagen? | emoji-rating + fritekst |
| 8 | `a3` | Hvor mærker du den største værdi ved at bruge Zenegy? | choice-single + fritekst |
| 9 | `a4` | Ville du anbefale Zenegy til en kollega eller en i dit professionelle netværk? | nps-scale + fritekst |
| 10 | `ai` | Hvor ser du det største potentiale for AI i jeres administrative processer? | choice-single |
| 11 | `numbers` | Hvilket regnskabs- eller ERP-system bruger I i dag? | logo-grid |

### internal-non-zenegy — 11 spørgsmål

| # | ID | Spørgsmål | Type |
|---|----|-----------|------|
| 1 | `gate` | Hvilken rolle spiller du i håndteringen af løn eller regnskab? | choice-single |
| 2 | `context` | Kører du løn for din egen virksomhed — eller for andres? | choice-single |
| 3 | `q0` | Er Zenegy en del af jeres systemlandskab i dag? | choice-tiles |
| 4 | `size` | Hvor mange medarbejdere kører I løn for? | choice-single |
| 5 | `b1` | Hvilket lønsystem bruger din virksomhed primært i dag? | logo-grid |
| 6 | `b2` | Hvad frustrerer dig mest ved dit nuværende lønsystem? | tile-select |
| 7 | `b3` | Hvilke faktorer vejer du højest i et lønsystem? | priority-rank |
| 8 | `b4` | Hvad er den primære årsag til, at I ikke skifter lønsystem? | tile-select |
| 9 | `b5` | Overvejer I at skifte lønsystem inden for det næste år? | choice-single |
| 10 | `ai` | Hvor ser du det største potentiale for AI i jeres administrative processer? | choice-single |
| 11 | `numbers` | Hvilket regnskabs- eller ERP-system bruger I i dag? | logo-grid |

### bureau-zenegy — 12 spørgsmål

| # | ID | Spørgsmål | Type |
|---|----|-----------|------|
| 1 | `gate` | Hvilken rolle spiller du i håndteringen af løn eller regnskab? | choice-single |
| 2 | `context` | Kører du løn for din egen virksomhed — eller for andres? | choice-single |
| 3 | `c1` | Hvor mange virksomheder kører du løn for i dag? | choice-single |
| 4 | `c2` | Hvilke lønsystemer arbejder du i for dine kunder? | logo-grid-multi |
| 5 | `c3` | Hvem bestemmer lønsystemet — og hvem betaler for det? | choice-single |
| 6 | `c4` | Hvordan får du løndata fra dine kunder? | tile-select |
| 7 | `c5` | Hvad tager mest tid — eller giver flest frustrationer — i lønarbejdet for dine kunder? | tile-select |
| 8 | `c6` | Hvad vejer tungest, når du vælger lønsystem til dine kunder? | priority-rank |
| 9 | `a2` | Hvor tilfreds er du med Zenegy i dit daglige arbejde med kunder? | emoji-rating + fritekst |
| 10 | `a4` | Ville du anbefale Zenegy til en kollega i branchen? | nps-scale + fritekst |
| 11 | `ai` | Hvor ser du det største potentiale for AI i lønarbejdet for dine kunder? | choice-single |
| 12 | `numbers` | Hvilket regnskabssystem arbejder du mest i for dine kunder? | logo-grid |

### bureau-other — 11 spørgsmål

| # | ID | Spørgsmål | Type |
|---|----|-----------|------|
| 1 | `gate` | Hvilken rolle spiller du i håndteringen af løn eller regnskab? | choice-single |
| 2 | `context` | Kører du løn for din egen virksomhed — eller for andres? | choice-single |
| 3 | `c1` | Hvor mange virksomheder kører du løn for i dag? | choice-single |
| 4 | `c2` | Hvilke lønsystemer arbejder du i for dine kunder? | logo-grid-multi |
| 5 | `c3` | Hvem bestemmer lønsystemet — og hvem betaler for det? | choice-single |
| 6 | `c4` | Hvordan får du løndata fra dine kunder? | tile-select |
| 7 | `c5` | Hvad tager mest tid — eller giver flest frustrationer — i lønarbejdet for dine kunder? | tile-select |
| 8 | `c6` | Hvad vejer tungest, når du vælger lønsystem til dine kunder? | priority-rank |
| 9 | `c7` | Overvejer du at flytte kunder til et andet lønsystem inden for det næste år? | choice-single |
| 10 | `ai` | Hvor ser du det største potentiale for AI i lønarbejdet for dine kunder? | choice-single |
| 11 | `numbers` | Hvilket regnskabssystem arbejder du mest i for dine kunder? | logo-grid |

---

## Landingsside

**Eyebrow chip**
> Markedsundersøgelse 2026

**Headline**
> Hvordan ser lønmarkedet ud i Danmark i 2026?

**Body**
> Vi spørger dem, der arbejder med løn hver måned — virksomheder, revisorer og lønbureauer, og dem der bare modtager lønsedlen. Brug 2–3 minutter på dine erfaringer med lønsystemerne og arbejdsgangene omkring dem, og få Lønmarkedsrapporten 2026 tilsendt, når undersøgelsen lukker.

**Primær CTA**
> Start undersøgelsen

**Value rows**

| Titel | Undertekst |
|-------|------------|
| 2–3 minutter | Kort og kontant — de fleste er færdige på et øjeblik. |
| Anonymt | Vi registrerer ikke, hvem du er. Til sidst kan du selv vælge at give os din mail. |
| Få rapporten tilsendt | Du modtager de samlede indsigter og benchmarks, når undersøgelsen lukker. |

---

## Spørgsmål

### `gate` · Din rolle

**Type:** choice-single (auto-advance)  
**Vises for:** employee, internal-zenegy, internal-non-zenegy, bureau-zenegy, bureau-other

> Hvilken rolle spiller du i håndteringen af løn eller regnskab?

*Dit svar sikrer, at du kun ser de spørgsmål, der er relevante for dig.*

| Value | Label | Sublabel |
|-------|-------|----------|
| `decision-maker` | Jeg har (med)ansvar for systemerne | Direktør, HR, bogholder, ekstern revisor eller administrator |
| `employee` | Jeg er primært lønmodtager | Jeg modtager lønseddel, men har ikke systemansvar |

---

### `e1` · Din lønseddel

**Type:** choice-single (auto-advance)  
**Vises for:** employee

> Hvor modtager du typisk din lønseddel?

*Fortæl os om din nuværende oplevelse.*

| Value | Label | Sublabel |
|-------|-------|----------|
| `app` | I en app eller medarbejderportal |  |
| `email` | Som PDF på email |  |
| `eboks` | I e-Boks / Mit.dk |  |
| `paper` | På print / papir |  |

---

### `e2` · Besværlige opgaver

**Type:** tile-select  
**Vises for:** employee

> Hvilke administrative opgaver oplever du som mest besværlige på din arbejdsplads?

*Vælg alle, der tager unødig tid fra dit egentlige arbejde.*

| Value | Label | Sublabel |
|-------|-------|----------|
| `expense-pain` | Gemme kvitteringer og afregne udlæg/kørsel manuelt |  |
| `time-pain` | Tidsregistrering eller at logge ferie og fravær |  |
| `payslip-confusing` | Min lønseddel er svær at tyde |  |
| `no-mobile-access` | Mangel på en app — jeg skal klare alt fra en computer |  |
| `none` | Ingen — det fungerer fint |  |

---

### `e3` · Udlægsregistrering

**Type:** choice-single (auto-advance)  
**Vises for:** employee

> Hvis du laver et udlæg, hvor lang tid bruger du i gennemsnit på at registrere det?

| Value | Label | Sublabel |
|-------|-------|----------|
| `seconds` | Få sekunder — et billede i en app, så er det klaret |  |
| `minutes` | Et par minutter — en formular online |  |
| `heavy-process` | Længere — gemme kvittering, printe eller sende mail |  |
| `not-relevant` | Ikke relevant — jeg har ikke udlæg |  |

---

### `e4` · AI i løn

**Type:** choice-single (auto-advance)  
**Vises for:** employee

> Hvor ville du være mest tryg ved, at en AI hjalp dig med dine løn- og arbejdsdata?

| Value | Label | Sublabel |
|-------|-------|----------|
| `checking` | Til at tjekke min lønseddel for fejl (f.eks. manglende tillæg) |  |
| `input` | Til at læse mine kvitteringer, så jeg slipper for at indtaste beløb |  |
| `assistant` | Som assistent, der forklarer regler om ferie eller barsel |  |
| `none` | Jeg vil ikke have AI i mine løn- eller fraværsdata |  |

---

### `context` · Din hverdag

**Type:** choice-single (auto-advance)  
**Vises for:** internal-zenegy, internal-non-zenegy, bureau-zenegy, bureau-other

> Kører du løn for din egen virksomhed — eller for andres?

*Vi spørger, fordi hverdagen ser helt forskellig ud, alt efter om du sidder internt eller håndterer løn for kunder.*

| Value | Label | Sublabel |
|-------|-------|----------|
| `internal` | Kun for min egen virksomhed | Jeg sidder internt — direktør, HR, bogholder eller økonomiansvarlig |
| `bureau` | For andre virksomheder (lønadministrator) | Revisor, bogholder eller lønbureau, der kører løn for kunder |
| `both` | Begge dele | Både min egen virksomhed og et antal kunder |

---

### `q0` · Dit system

**Type:** choice-tiles (auto-advance)  
**Vises for:** internal-zenegy, internal-non-zenegy

> Er Zenegy en del af jeres systemlandskab i dag?

*Uanset om I er kunde, ekstern partner eller bruger noget helt andet, vil vi gerne høre din mening.*

| Value | Label | Sublabel |
|-------|-------|----------|
| `zenegy` | Ja, vi bruger Zenegy | Som primært løn- eller regnskabssystem |
| `non-zenegy` | Nej, vi bruger et andet system | Visma Dataløn, Danløn, Lessor, Intect, Salary eller lignende |

---

### `size` · Antal medarbejdere

**Type:** choice-single (auto-advance)  
**Vises for:** internal-zenegy, internal-non-zenegy

> Hvor mange medarbejdere kører I løn for?

*Det hjælper os sammenligne svar på tværs af virksomheder af forskellig størrelse.*

| Value | Label | Sublabel |
|-------|-------|----------|
| `1-9` | 1–9 |  |
| `10-49` | 10–49 |  |
| `50-199` | 50–199 |  |
| `200+` | 200+ |  |

---

### `a1` · Zenegy-produkter

**Type:** choice-multi  
**Vises for:** internal-zenegy

> Hvilke Zenegy-produkter bruger du aktivt i dag?

*Vælg alle de moduler, du eller din virksomhed bruger.*

| Value | Label | Sublabel |
|-------|-------|----------|
| `payroll` | Løn | Lønkørsel, SH-dage og automatiske indberetninger |
| `numbers` | Numbers | Finans, bogføring og digitalt regnskab |
| `expense` | Expense | Udlæg, kørsel og kvitteringer |
| `time` | Time | Tidsregistrering, ferie og fravær |

---

### `a1_migration` · Tidligere system

**Type:** logo-grid (auto-advance)  
**Vises for:** internal-zenegy

> Hvilket system kom du fra, da du valgte Zenegy?

*Det hjælper os forstå, hvor i markedet behovet for fornyelse er størst.*

| Value | Label | Sublabel |
|-------|-------|----------|
| `dataloen` | Visma Dataløn | tidl. Bluegarden |
| `danloen` | Danløn |  |
| `lessor` | Lessor | by Paychex |
| `intect` | Intect |  |
| `salary` | Salary | nu Shine Salary |
| `dataloen-branche` | Dataløn Branche | tidl. ProLøn |
| `letloen` | LetLøn |  |
| `eg-loen` | EG Løn | EG Lønservice |
| `intega` | Intega Løn | tidl. Visma Løn |
| `kmd` | KMD Løn |  |
| `epos` | Epos | Azets |
| `excel` | Excel / manuelt |  |
| `startup` | Direkte til Zenegy |  |
| `andet` | Andet |  |

---

### `a2` · Tilfredshed

**Type:** emoji-rating  
**Vises for:** internal-zenegy

> Hvor tilfreds er du med Zenegy i hverdagen?

*Tænk på den generelle oplevelse — ikke kun onboarding.*

**Fritekst-label:** Vil du sætte et par ord på? (valgfrit)  
**Fritekst-placeholder:** Hvad er den primære årsag til din rating?  
**Max længde:** 300

| Value | Label | Sublabel |
|-------|-------|----------|
| `very-unhappy` | Meget utilfreds |  |
| `unhappy` | Ikke tilfreds |  |
| `meh` | Det går |  |
| `happy` | Tilfreds |  |
| `very-happy` | Meget tilfreds |  |

---

### `a3` · Største værdi

**Type:** choice-single  
**Vises for:** internal-zenegy

> Hvor mærker du den største værdi ved at bruge Zenegy?

*Hvis du kun må vælge én ting, der gør en mærkbar forskel i din arbejdsuge.*

**Fritekst-label:** Uddyb gerne med egne ord (valgfrit)  
**Fritekst-placeholder:** Hvad gør Zenegy værdifuldt for dig?  
**Max længde:** 200

| Value | Label | Sublabel |
|-------|-------|----------|
| `time-saving` | Jeg sparer markant tid på lønkørslen |  |
| `automation` | Automatisk indberetning (SKAT, feriepenge m.m.) |  |
| `integrations` | Det spiller sammen med mine andre systemer og min bank |  |
| `ui-ux` | Platformen er moderne og nem at arbejde i |  |
| `support` | Jeg får hurtig og kompetent hjælp, når jeg har brug for det |  |
| `all-in-one` | Alt er samlet ét sted (løn + Numbers + HR) |  |

---

### `a4` · Anbefaling

**Type:** nps-scale  
**Vises for:** internal-zenegy

> Ville du anbefale Zenegy til en kollega eller en i dit professionelle netværk?

*Det her måler noget andet end tilfredshed — om du ville sætte dit navn på en anbefaling.*

**Fritekst-label:** Hvad er det vigtigste, vi kan forbedre? (valgfrit)  
**Fritekst-placeholder:** Din feedback går direkte til vores produktteam...  

---

### `ai` · AI-potentiale

**Type:** choice-single (auto-advance)  
**Vises for:** internal-zenegy, internal-non-zenegy

> Hvor ser du det største potentiale for AI i jeres administrative processer?

*Hvilken opgave ville du helst lade en pålidelig algoritme klare?*

| Value | Label | Sublabel |
|-------|-------|----------|
| `anomaly-detection` | Automatisk fejlsøgning og kontrol inden lønnen godkendes |  |
| `data-entry` | Automatisk bogføring og matchning af udlæg/kvitteringer |  |
| `support-answers` | Besvarelse af interne spørgsmål om ferie og regler |  |
| `not-ready` | Vi er ikke klar til AI i lønprocessen endnu |  |

---

### `numbers` · Regnskabssystem

**Type:** logo-grid (auto-advance)  
**Vises for:** internal-zenegy, internal-non-zenegy

> Hvilket regnskabs- eller ERP-system bruger I i dag?

*Vi er nysgerrige — ikke på jagt efter salg.*

| Value | Label | Sublabel |
|-------|-------|----------|
| `e-conomic` | e-conomic |  |
| `dinero` | Dinero |  |
| `billy` | Billy | nu Shine |
| `uniconta` | Uniconta |  |
| `visma-bc` | Visma Business |  |
| `microsoft-bc` | Business Central |  |
| `zenegy-numbers` | Zenegy Numbers |  |
| `andet` | Andet |  |

---

### `b1` · Lønsystem

**Type:** logo-grid (auto-advance)  
**Vises for:** internal-non-zenegy

> Hvilket lønsystem bruger din virksomhed primært i dag?

*Vælg det primære system din virksomhed bruger til lønkørsel.*

| Value | Label | Sublabel |
|-------|-------|----------|
| `dataloen` | Visma Dataløn | tidl. Bluegarden |
| `danloen` | Danløn |  |
| `lessor` | Lessor | by Paychex |
| `intect` | Intect |  |
| `salary` | Salary | nu Shine Salary |
| `dataloen-branche` | Dataløn Branche | tidl. ProLøn |
| `letloen` | LetLøn |  |
| `eg-loen` | EG Løn | EG Lønservice |
| `intega` | Intega Løn | tidl. Visma Løn |
| `kmd` | KMD Løn |  |
| `epos` | Epos | Azets |
| `excel` | Excel / manuelt |  |
| `andet` | Andet |  |

---

### `b2` · Frustrationer

**Type:** tile-select  
**Vises for:** internal-non-zenegy

> Hvad frustrerer dig mest ved dit nuværende lønsystem?

*Vælg alle der passer.*

**Fritekst-placeholder:** Er der andet, der irriterer dig i hverdagen?  

| Value | Label | Sublabel |
|-------|-------|----------|
| `slow-payroll` | Lønkørslen tager lang tid og kræver mange manuelle tjek |  |
| `ui-old` | Brugerfladen føles gammeldags eller uoverskuelig |  |
| `integrations-broken` | Mangelfulde integrationer til bank og regnskab |  |
| `support-slow` | Support er svær at komme igennem til |  |
| `price-value` | Prisen står ikke mål med, hvad produktet kan |  |
| `missing-features` | Mangler moderne features (f.eks. app eller HR-værktøjer) |  |
| `manual-errors` | Mange manuelle trin, hvor fejl kan opstå |  |
| `satisfied` | Faktisk ingenting — jeg er tilfreds |  |
| `other` | Andet |  |

---

### `b3` · Prioriteter

**Type:** priority-rank  
**Vises for:** internal-non-zenegy

> Hvilke faktorer vejer du højest i et lønsystem?

*Markér de 3 vigtigste i prioriteret rækkefølge.*

**Max rank:** 3

| Value | Label | Sublabel |
|-------|-------|----------|
| `ux-simplicity` | Enkel og intuitiv brugerflade |  |
| `heavy-automation` | Automatisering (SKAT, feriepenge, bogføring) |  |
| `rock-solid-support` | Dansk support, der svarer hurtigt |  |
| `open-integrations` | Integrationer, der synkroniserer data automatisk |  |
| `employee-experience` | Mobilapp, så medarbejderne selv kan klare udlæg/tid |  |
| `price` | Pris og gennemskuelig abonnementsstruktur |  |

---

### `b4` · Skiftehindringer

**Type:** tile-select  
**Vises for:** internal-non-zenegy

> Hvad er den primære årsag til, at I ikke skifter lønsystem?

*Vælg alle der passer.*

**Fritekst-placeholder:** Er der en anden barriere?  

| Value | Label | Sublabel |
|-------|-------|----------|
| `fear-of-transition` | Datamigreringen og overgangen virker uoverskuelig |  |
| `no-time` | Vi har ikke interne ressourcer eller tid til at implementere nyt |  |
| `risk-of-errors` | Bekymring for fejl eller manglende compliance under et skifte |  |
| `advisor-decision` | Det er vores eksterne revisor/bogholder, der beslutter |  |
| `contract-lock` | Vi er bundet af en kontrakt eller et større ERP-system |  |
| `unknown-market` | Vi kender ikke alternativerne godt nok |  |
| `happy-staying` | Vi er tilfredse — et skifte er ikke aktuelt |  |
| `other` | Andet |  |

---

### `b5` · Skifteplaner

**Type:** choice-single (auto-advance)  
**Vises for:** internal-non-zenegy

> Overvejer I at skifte lønsystem inden for det næste år?

*Helt uforpligtende — vi er bare nysgerrige.*

| Value | Label | Sublabel |
|-------|-------|----------|
| `actively` | Ja, vi kigger aktivt på alternativer |  |
| `maybe` | Måske — det er ikke udelukket |  |
| `no` | Nej, ikke lige nu |  |

---

### `c1` · Antal kunder

**Type:** choice-single (auto-advance)  
**Vises for:** bureau-zenegy, bureau-other

> Hvor mange virksomheder kører du løn for i dag?

*Tæl de kunder, du selv står for lønnen på — også de helt små.*

| Value | Label | Sublabel |
|-------|-------|----------|
| `1-5` | 1–5 kunder |  |
| `6-20` | 6–20 kunder |  |
| `21-50` | 21–50 kunder |  |
| `51-100` | 51–100 kunder |  |
| `100+` | Over 100 kunder |  |

---

### `c2` · Lønsystemer

**Type:** logo-grid-multi  
**Vises for:** bureau-zenegy, bureau-other

> Hvilke lønsystemer arbejder du i for dine kunder?

*Vælg alle, du bruger i dag — også dem, du kun har en enkelt kunde i.*

| Value | Label | Sublabel |
|-------|-------|----------|
| `dataloen` | Visma Dataløn | tidl. Bluegarden |
| `danloen` | Danløn |  |
| `lessor` | Lessor | by Paychex |
| `intect` | Intect |  |
| `salary` | Salary | nu Shine Salary |
| `dataloen-branche` | Dataløn Branche | tidl. ProLøn |
| `letloen` | LetLøn |  |
| `eg-loen` | EG Løn | EG Lønservice |
| `intega` | Intega Løn | tidl. Visma Løn |
| `kmd` | KMD Løn |  |
| `epos` | Epos | Azets |
| `zenegy` | Zenegy |  |
| `excel` | Excel / manuelt |  |
| `andet` | Andet |  |

---

### `c3` · Aftalen med kunden

**Type:** choice-single (auto-advance)  
**Vises for:** bureau-zenegy, bureau-other

> Hvem bestemmer lønsystemet — og hvem betaler for det?

*Vælg det, der passer på flest af dine kunder.*

| Value | Label | Sublabel |
|-------|-------|----------|
| `we-choose-we-pay` | Vi vælger systemet og har abonnementet | Vi fakturerer kunden for lønnen — kunden ser sjældent systemet |
| `we-choose-client-pays` | Vi vælger systemet, kunden har abonnementet | Kunden betaler selv, men følger vores anbefaling |
| `client-chose` | Kunden har valgt systemet | Vi arbejder i det, kunden allerede har |
| `mixed` | Det er helt forskelligt fra kunde til kunde | Ingen fast model |

---

### `c4` · Løndata fra kunder

**Type:** tile-select  
**Vises for:** bureau-zenegy, bureau-other

> Hvordan får du løndata fra dine kunder?

*Timer, tillæg, fravær og ændringer — vælg alle de måder, det sker på i dag.*

**Fritekst-placeholder:** Hvordan kommer data ellers ind?  

| Value | Label | Sublabel |
|-------|-------|----------|
| `email-excel` | På mail — typisk et Excel-ark eller en besked |  |
| `client-portal` | Kunden taster selv ind i lønsystemet eller en portal |  |
| `time-system` | Automatisk fra et tidsregistreringssystem |  |
| `messages` | Telefon, SMS eller løse beskeder |  |
| `paper` | Papir, scannede sedler eller PDF'er |  |
| `i-collect` | Jeg finder og taster det selv ud fra bilag og systemer |  |
| `other` | Andet |  |

---

### `c5` · Tidsrøvere

**Type:** tile-select  
**Vises for:** bureau-zenegy, bureau-other

> Hvad tager mest tid — eller giver flest frustrationer — i lønarbejdet for dine kunder?

*Vælg alle der passer. Det er præcis den slags input, vi har brug for.*

**Fritekst-placeholder:** Er der andet, der stjæler tid i hverdagen?  

| Value | Label | Sublabel |
|-------|-------|----------|
| `chasing-data` | At jage løndata og svar hos kunderne inden deadline |  |
| `many-systems` | At skulle arbejde i flere forskellige lønsystemer |  |
| `switching-clients` | Skift mellem kunder, logins og faner |  |
| `client-onboarding` | At sætte nye kunder op — lønarter, overenskomst og pension |  |
| `no-bulk-actions` | Manglende massehandlinger — jeg gentager det samme kunde for kunde |  |
| `approval-trail` | Godkendelse og dokumentation af, hvad kunden har godkendt |  |
| `reconciliation` | Afstemning og bogføring af lønnen i regnskabssystemet |  |
| `employee-questions` | Spørgsmål fra kundernes medarbejdere |  |
| `price-margin` | Prisen pr. lønseddel presser min indtjening |  |
| `other` | Andet |  |

---

### `c6` · Prioriteter

**Type:** priority-rank  
**Vises for:** bureau-zenegy, bureau-other

> Hvad vejer tungest, når du vælger lønsystem til dine kunder?

*Markér de 3 vigtigste i prioriteret rækkefølge.*

**Max rank:** 3

| Value | Label | Sublabel |
|-------|-------|----------|
| `one-login` | Ét login og overblik på tværs af alle kunder |  |
| `bulk-actions` | Massehandlinger — flere kunder klaret i ét flow |  |
| `client-self-service` | At kunden selv leverer og godkender løndata |  |
| `integrations` | Automatisk bogføring og integration til regnskabssystemet |  |
| `expert-support` | Support med lønfaglig viden, når reglerne er svære |  |
| `partner-economics` | Pris og marginer på partneraftalen |  |
| `easy-onboarding` | Nem opsætning og migrering af en ny kunde |  |
| `compliance` | Sikkerhed, GDPR og revisionsspor |  |

---

### `a2` · Tilfredshed

**Type:** emoji-rating  
**Vises for:** bureau-zenegy

> Hvor tilfreds er du med Zenegy i dit daglige arbejde med kunder?

*Tænk på oplevelsen på tværs af dine kunder — ikke kun en enkelt lønkørsel.*

**Fritekst-label:** Vil du sætte et par ord på? (valgfrit)  
**Fritekst-placeholder:** Hvad er den primære årsag til din rating?  
**Max længde:** 300

| Value | Label | Sublabel |
|-------|-------|----------|
| `very-unhappy` | Meget utilfreds |  |
| `unhappy` | Ikke tilfreds |  |
| `meh` | Det går |  |
| `happy` | Tilfreds |  |
| `very-happy` | Meget tilfreds |  |

---

### `a4` · Anbefaling

**Type:** nps-scale  
**Vises for:** bureau-zenegy

> Ville du anbefale Zenegy til en kollega i branchen?

*Det her måler noget andet end tilfredshed — om du ville sætte dit navn på en anbefaling.*

**Fritekst-label:** Hvad skal der til, før du flytter flere kunder over på Zenegy? (valgfrit)  
**Fritekst-placeholder:** Din feedback går direkte til vores produktteam...  

---

### `ai` · AI-potentiale

**Type:** choice-single (auto-advance)  
**Vises for:** bureau-zenegy, bureau-other

> Hvor ser du det største potentiale for AI i lønarbejdet for dine kunder?

*Hvilken opgave ville du helst lade en pålidelig algoritme klare?*

| Value | Label | Sublabel |
|-------|-------|----------|
| `bureau-anomaly-detection` | Automatisk kontrol af lønkørslen, før den sendes til godkendelse |  |
| `bureau-data-entry` | Indlæsning af timer og bilag, jeg i dag taster manuelt |  |
| `bureau-client-questions` | Svar på kundernes spørgsmål om løn, ferie og regler |  |
| `bureau-client-onboarding` | Opsætning af nye kunder — lønarter og overenskomster |  |
| `bureau-not-ready` | Jeg er ikke tryg ved AI i mine kunders løndata |  |

---

### `numbers` · Regnskabssystem

**Type:** logo-grid (auto-advance)  
**Vises for:** bureau-zenegy, bureau-other

> Hvilket regnskabssystem arbejder du mest i for dine kunder?

*Vælg det, du bruger på flest kunder. Vi er nysgerrige — ikke på jagt efter salg.*

| Value | Label | Sublabel |
|-------|-------|----------|
| `e-conomic` | e-conomic |  |
| `dinero` | Dinero |  |
| `billy` | Billy | nu Shine |
| `uniconta` | Uniconta |  |
| `visma-bc` | Visma Business |  |
| `microsoft-bc` | Business Central |  |
| `zenegy-numbers` | Zenegy Numbers |  |
| `andet` | Andet |  |

---

### `c7` · Skifteplaner

**Type:** choice-single (auto-advance)  
**Vises for:** bureau-other

> Overvejer du at flytte kunder til et andet lønsystem inden for det næste år?

*Helt uforpligtende — vi er bare nysgerrige.*

| Value | Label | Sublabel |
|-------|-------|----------|
| `actively-consolidating` | Ja — jeg leder efter ét system til så mange kunder som muligt |  |
| `actively-some` | Ja — for enkelte kunder |  |
| `maybe` | Måske — det er ikke udelukket |  |
| `no` | Nej, ikke lige nu |  |

---

## Routing

```
[gate]
  ├─ employee         → e1 → e2 → e3 → e4
  └─ decision-maker   → [context]
        ├─ internal   → [q0]
        │     ├─ zenegy      → a1 → a1_migration → a2 → a3 → a4 → [ai] → (hvis ikke Numbers: [numbers])
        │     └─ non-zenegy  → b1 → b2 → b3 → b4 → b5 → [ai] → [numbers]
        └─ bureau/both → c1 → c2 → c3 → c4 → c5 → c6
                            ├─ Zenegy valgt i c2      → a2 → a4 → [ai] → [numbers]
                            └─ Zenegy ikke valgt      → c7 → [ai] → [numbers]
```

Bureauer genbruger `a2` (tilfredshed) og `a4` (NPS) med bureau-tilpasset tekst, så
tilfredshed og NPS kan sammenlignes på tværs af spor A og C. Hvilke systemer et bureau
faktisk arbejder i, ligger i `c_payroll_systems` — ikke i `track`, som for bureauer altid
er `'bureau'`.

---

## Datamodel (Supabase `submissions`)

| Spørgsmål | Kolonne |
|-----------|---------|
| `gate` | `is_employee` (boolean) |
| `context` | `payroll_context` |
| `q0` | `track` (`zenegy` / `non-zenegy`; `employee` og `bureau` sættes af sporet) |
| `size` | `size` |
| `b1`–`b5` | `b_payroll_system` (+ `b_payroll_other`), `b_frustrations` (+ `b_frustration_other`), `b_priorities`, `b_barriers` (+ `b_barrier_other`), `b_switch_intent` |
| `a1`–`a4` | `a_products`, `a_migration_from`, `a_satisfaction` (+ `a_satisfaction_text`), `a_best_thing` (+ `a_best_thing_text`), `a_nps` (+ `a_improve_text`) |
| `c1`–`c7` | `c_client_count`, `c_payroll_systems` (+ `c_payroll_system_other`), `c_setup`, `c_data_collection` (+ `c_data_collection_other`), `c_frustrations` (+ `c_frustration_other`), `c_priorities`, `c_switch_intent` |
| `e1`–`e4` | `e_payslip`, `e_pain_points`, `e_expenses`, `e_ai_trust` |
| `ai` | `ai_interest` (bureau-svar har præfikset `bureau-`) |
| `numbers` | `accounting_system` (+ `accounting_other`) |

Emailen fra takke-siden gemmes separat i `report_signups` og kobles aldrig til svarene.

---

## Takke-siden

Svarene gemmes automatisk, når sidste spørgsmål er besvaret. Herefter kan respondenten
valgfrit skrive sin email for at få Lønmarkedsrapporten 2026 tilsendt, og evt. tilmelde
sig nyhedsbrevet. Se `src/screens/ThankYou.tsx` for den præcise tekst.
