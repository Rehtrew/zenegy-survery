-- Track C (2026-09-01): accountants, bookkeepers and payroll bureaus who run
-- payroll for client companies. They answer for a portfolio rather than for one
-- company, so they get their own `track` value ('bureau') and their own columns;
-- `payroll_context` records the answer to the new internal/bureau/both question
-- that every decision-maker now sees right after the gate.
--
-- Bureau respondents reuse a_satisfaction / a_satisfaction_text / a_nps /
-- a_improve_text when they already work in Zenegy, so satisfaction and NPS stay
-- comparable with track A. Their payroll systems live in c_payroll_systems
-- (multi-select), which is how you tell a Zenegy bureau from a non-Zenegy one.
--
-- Idempotent (ADD COLUMN IF NOT EXISTS), like 002/003/006 — safe to run on the
-- live database and on a fresh one.

alter table submissions
  add column if not exists payroll_context          text,
  add column if not exists c_client_count           text,
  add column if not exists c_payroll_systems        text[],
  add column if not exists c_payroll_system_other   text,
  add column if not exists c_setup                  text,
  add column if not exists c_data_collection        text[],
  add column if not exists c_data_collection_other  text,
  add column if not exists c_frustrations           text[],
  add column if not exists c_frustration_other      text,
  add column if not exists c_priorities             jsonb,
  add column if not exists c_switch_intent          text;

-- Bureaus don't pick a single zenegy/non-zenegy track.
alter table submissions drop constraint if exists submissions_track_check;
alter table submissions add constraint submissions_track_check
  check (track in ('zenegy', 'non-zenegy', 'employee', 'bureau'));

create index if not exists submissions_payroll_context_idx on submissions (payroll_context);
