-- Four answer fields were collected by the app but never added to ANY migration,
-- so they don't exist as columns on the live table. Because the client inserts
-- the whole answers object at once, PostgREST rejected every submission that
-- carried one of them with PGRST204 ("Could not find the 'X' column …"):
--
--   size              every decision-maker sets this (the "how many employees" step)
--   b_switch_intent   non-Zenegy track, "are you considering switching?"
--   a_migration_from  Zenegy track, "which system did you come from?"
--   e_pain_points     employee track, multi-select admin pain points (text[])
--
-- Idempotent (ADD COLUMN IF NOT EXISTS), matching migrations 002 / 003 — safe to
-- run on the live database and on any fresh database built from earlier migrations.

alter table submissions
  add column if not exists size             text,
  add column if not exists b_switch_intent  text,
  add column if not exists a_migration_from text,
  add column if not exists e_pain_points    text[];
