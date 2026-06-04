create table submissions (
  id                 uuid primary key default gen_random_uuid(),
  created_at         timestamptz default now(),
  track              text not null check (track in ('zenegy', 'non-zenegy')),

  b_payroll_system   text,
  b_payroll_other    text,
  b_frustrations     text[],
  b_priorities       jsonb,
  b_barriers         text[],

  a_products         text[],
  a_satisfaction     text,
  a_best_thing       text,
  a_best_thing_text  text,
  a_nps              int check (a_nps between 0 and 10),
  a_improve_text     text,

  accounting_system  text,
  accounting_other   text,

  email              text not null,
  newsletter_opt_in  boolean not null default false
);

create index on submissions (track);
create index on submissions (created_at);
create index on submissions (b_payroll_system);
