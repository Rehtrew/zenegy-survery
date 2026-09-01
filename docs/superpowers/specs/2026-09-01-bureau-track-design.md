# Track C — bureaus (revisorer, bogholdere, lønbureauer)

**Date:** 2026-09-01
**Status:** implemented, pending feedback from sales

## Why

The survey assumed every respondent answers for one company: "your company's payroll
system", "how many employees do you run payroll for". A large and commercially important
group doesn't fit that shape — accountants, bookkeepers and payroll bureaus who run
payroll *for other companies*. They evaluate, buy and leave payroll systems on behalf of
dozens of clients at a time, and their clients often never see the system at all (they
only meet it as a line on the payslip).

Internally we called them "admins". That word doesn't work in the survey: to the
respondent an "administrator" is a permission level, not a profession. The Danish survey
never uses it — respondents self-identify by what they *do*.

## Routing

Rather than adding a third option to the gate (which would make the first screen a
three-way choice between a role, a role and a business model), the gate stays as it is and
a follow-up question splits decision-makers:

```
[gate: decision-maker]
   └─ [context] "Kører du løn for din egen virksomhed — eller for andres?"
        ├─ internal      → existing tracks A / B
        └─ bureau | both → track C
```

`both` routes to track C on purpose: someone who runs payroll for their own company *and*
for clients is a bureau for our purposes, and the portfolio questions are the ones we
can't get anywhere else.

## What we ask, and why

Grounded in how the Danish bureau market actually works (sources below), not guesses:

| # | Question | What it buys us |
|---|----------|-----------------|
| `c1` | How many companies do you run payroll for | The single most useful segmentation for this group. Also sizes the addressable seat count behind one respondent. |
| `c2` | Which payroll systems do you work in (multi) | Fragmentation is the defining bureau pain — competitors sell "one login instead of 40 systems". Multi-select also tells us Zenegy's share *inside* a bureau, not just yes/no, and replaces `q0` for this track. |
| `c3` | Who picks the system and who pays | Decides who we sell to and how we price. Four options cross the two dimensions (bureau-chosen/client-chosen × bureau-owned/client-owned subscription) that partner programs are built around. |
| `c4` | How payroll data arrives from clients | Every bureau vendor claims this is the biggest time sink (email + Excel + SMS, with a GDPR problem attached). We should measure it rather than repeat it. |
| `c5` | Biggest time sinks / frustrations | Bureau-specific list: chasing data, many systems, client switching, onboarding a new client (lønarter, overenskomst, pension), missing bulk actions, approval trail, reconciliation, employee questions, per-payslip price. |
| `c6` | What weighs most when choosing a system for clients (top 3) | Directly comparable to `b3` for internal buyers — we can show how differently bureaus and companies weight the same market. |
| `c7` | Are you moving clients to another system within a year | Only asked when Zenegy isn't already in their stack. Their answer moves many companies at once. |
| `a2`, `a4` | Satisfaction + NPS, bureau wording | Only asked when Zenegy *is* in their stack. Same ids as track A so NPS stays comparable; the NPS free-text asks what it would take to move more clients over. |
| `ai` | AI potential, bureau framing | Own option values (`bureau-*`) so bureau answers never blend into the single-company AI numbers. |
| `numbers` | Accounting system across clients | Numbers cross-sell, same as the other tracks. |

Path length: 11 questions for a non-Zenegy bureau, 12 when Zenegy is in the stack — in
line with the existing tracks (10–11 after the new context question).

## Deliberately left out

- **Payslip volume per month.** Client count is the cleaner segmentation and volume
  correlates with it. Add later if sales needs pricing bands.
- **Revenue / price per payslip charged to clients.** Too close to asking about their
  margins in an anonymous survey; `c5` captures the pain via "prisen pr. lønseddel presser
  min indtjening".
- **Capacity ("how many more clients could you take on?").** Interesting for a report
  headline, weak for product decisions. Candidate if we want one more.
- **Data-processing agreements / GDPR specifics.** Covered indirectly by `c6`
  (compliance) and `c5` (approval trail); a dedicated question would need more room than
  the format allows.

## Open questions for sales

1. Do bureaus recognise themselves in "Kører du løn for din egen virksomhed — eller for
   andres?", or is "lønbureau" the word they'd use about themselves?
2. Is `c3` (who decides / who pays) phrased the way partner deals are actually structured
   in the field?
3. Is the client-count banding right (1–5 / 6–20 / 21–50 / 51–100 / 100+), or does the
   Danish market sit lower or higher?
4. Anything in `c5` that's obviously missing from the bureau's month?

## Data model

New columns in `supabase/migrations/007_bureau_track.sql`: `payroll_context`,
`c_client_count`, `c_payroll_systems` (+ `_other`), `c_setup`, `c_data_collection`
(+ `_other`), `c_frustrations` (+ `_other`), `c_priorities`, `c_switch_intent`. Bureaus
submit with `track = 'bureau'`; the track check constraint is widened accordingly.

## Sources

- DataLøn for revisorer — multi-client login, KlarLøn data collection portal, approval
  trail, free partner program: https://www.dataloen.dk/revisorer/
- DataLøn guide, handling payroll for clients: https://www.dataloen.dk/revisorer/guide-haandter-loen-for-kunder/
- Zenegy Portfolio (admin module) — one login across clients, bulk actions across
  companies, certified partner program: https://zenegy.com/Admin
- Intect multi-company / lønbureau setup and per-payslip pricing: https://intect.io/da/
- Intect on the most common client setup errors (lønarter, holiday basis, "silent"
  errors): https://intect.io/da/fejlkilder-i-loensetup/
- Beierholm on typical payroll administration mistakes and their cost:
  https://www.beierholm.dk/viden-og-indsigt/nyheder-og-artikler/loenadministration-typiske-fejl-og-gode-raad-til-undgaa-dem
