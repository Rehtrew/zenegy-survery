-- The initial migration (001) was later edited in place to add the employee-track
-- and AI-question columns, but the live database was created from the original
-- version and never got those columns. Result: every submission that includes
-- `ai_interest` (all decision-makers) or the `e_*`/`is_employee` fields (employees)
-- fails with PostgREST error PGRST204 "Could not find the 'X' column".
--
-- This migration is idempotent (ADD COLUMN IF NOT EXISTS), so it is safe to run on
-- the live database and on any fresh database built from 001.

alter table submissions
  add column if not exists role                   text,
  add column if not exists is_employee            boolean,
  add column if not exists e_payslip              text,
  add column if not exists e_payroll_satisfaction text,
  add column if not exists e_expenses             text,
  add column if not exists e_ai_trust             text,
  add column if not exists ai_interest            text,
  add column if not exists b_payroll_system       text,
  add column if not exists b_payroll_other        text,
  add column if not exists b_frustrations         text[],
  add column if not exists b_priorities           jsonb,
  add column if not exists b_barriers             text[],
  add column if not exists a_products             text[],
  add column if not exists a_satisfaction         text,
  add column if not exists a_best_thing           text,
  add column if not exists a_best_thing_text      text,
  add column if not exists a_nps                  int,
  add column if not exists a_improve_text         text,
  add column if not exists accounting_system      text,
  add column if not exists accounting_other       text;

-- Employees never pick a zenegy/non-zenegy payroll track, so allow 'employee'.
alter table submissions drop constraint if exists submissions_track_check;
alter table submissions add constraint submissions_track_check
  check (track in ('zenegy', 'non-zenegy', 'employee'));
