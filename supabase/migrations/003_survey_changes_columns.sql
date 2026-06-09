-- Survey changes (2026-06-09): an optional comment on the satisfaction question
-- and free-text "Andet" inputs on the frustrations / barriers questions.
--
-- Idempotent (ADD COLUMN IF NOT EXISTS), matching migration 002 — safe to run on
-- the live database and on any fresh database built from 001/002.
--
-- Note: the `role` column is intentionally left in place (now unused) — the role
-- question was removed from the survey, but dropping the column would be
-- destructive and offers nothing in return.

alter table submissions
  add column if not exists a_satisfaction_text text,
  add column if not exists b_frustration_other text,
  add column if not exists b_barrier_other     text;
