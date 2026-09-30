# Schema changes to the live database

`kinsta/schema.sql` describes the tables as they should be, but `CREATE TABLE IF
NOT EXISTS` never alters one that already exists. Each change to a live table is
a file here, run once by hand, before the code that needs it is deployed.

Every file only adds: nullable columns, no defaults that rewrite rows, nothing
dropped or renamed. Before and after running one, a per-row MD5 over all the
columns that existed beforehand must match for every row.

| Date       | File                              | What                                           |
|------------|-----------------------------------|------------------------------------------------|
| 2026-09-30 | 2026-09-30-employer-payroll-system | `e_payroll_system`, `e_payroll_other` for e5   |
