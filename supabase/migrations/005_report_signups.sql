-- The final page now saves answers the moment the respondent finishes the last
-- question (anonymous, email left ''). The optional "send me the report" email
-- is stored here, in a separate table — never linked to the answers. This keeps
-- the "Anonymt" promise on the landing page literal, and avoids needing an anon
-- UPDATE policy on submissions (which PostgREST would let anyone abuse to
-- rewrite every row).

create table report_signups (
  id                 uuid primary key default gen_random_uuid(),
  created_at         timestamptz not null default now(),
  email              text not null,
  newsletter_opt_in  boolean not null default false
);

alter table report_signups enable row level security;

-- Anonymous respondents may add their email; nothing else.
create policy "anon_insert" on report_signups
  for insert
  to anon
  with check (true);
