-- Enable Row-Level Security on submissions.
-- Supabase flagged rls_disabled_in_public: without RLS any authenticated role
-- with schema access could bypass table-level grants via PostgREST.
--
-- After this migration:
--   anon can INSERT (anonymous survey submissions) — allowed by the policy below.
--   anon CANNOT SELECT, UPDATE, or DELETE — no policies for those operations.

alter table submissions enable row level security;

-- Allow anonymous respondents to submit answers.
create policy "anon_insert" on submissions
  for insert
  to anon
  with check (true);
