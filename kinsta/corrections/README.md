# Corrections to live answers

Each file here was run once against the live database, by hand, and is kept so
the change can be traced. None of them delete data: old values move to the
`survey_corrections` table first, inside the same transaction.

How each one was run:

1. Full export of `survey_submissions` to `~/survey-backups/` on the server
   (outside the web root) and to `backups/` locally, which git ignores.
2. A per-row MD5 over every column the correction does not touch, before and after.
3. A dry-run `SELECT` with the exact guards the `UPDATE` uses.
4. The correction, where each `UPDATE` must hit exactly one row or the batch
   errors before `COMMIT` and rolls back.

To reverse one, write the values in `survey_corrections` back into
`survey_submissions` for that `submission_id` and `column_name`.

| Date       | Rows   | What                                                        |
|------------|--------|-------------------------------------------------------------|
| 2026-09-28 | 14, 24 | Bureau answers left behind by companies that left that path |
