-- Correction of row 16: an employee whose "internal" payroll context was left
-- behind from the decision-maker path they backed out of. The old value moves
-- to survey_corrections first, so nothing is lost.

START TRANSACTION;

SET @why = 'Svar fra beslutningstager-sporet, som respondenten forlod igen (fejl rettet 2026-09-28)';

INSERT INTO survey_corrections (submission_id, column_name, old_value, reason)
  SELECT id, 'payroll_context', payroll_context, @why FROM survey_submissions
   WHERE id = 16 AND track = 'employee' AND is_employee = 1 AND payroll_context = 'internal';
SELECT IF(ROW_COUNT() = 1, 'gammel værdi gemt', (SELECT 1 UNION SELECT 2)) AS guard;

UPDATE survey_submissions SET payroll_context = NULL
 WHERE id = 16 AND track = 'employee' AND is_employee = 1 AND payroll_context = 'internal';
-- Anything but exactly one row errors before COMMIT and rolls it all back.
SELECT IF(ROW_COUNT() = 1, 'række 16 rettet', (SELECT 1 UNION SELECT 2)) AS guard;

COMMIT;
