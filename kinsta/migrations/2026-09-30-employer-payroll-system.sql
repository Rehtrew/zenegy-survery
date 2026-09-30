-- Adds the employee question "Hvilket lønsystem bruger din arbejdsgiver?" (e5).
--
-- Two nullable columns and nothing else: no existing row is read or written.
-- Employees who answered before this ran simply have NULL here, which the
-- results page counts as "not asked". Safe to run twice.
ALTER TABLE `survey_submissions`
  ADD COLUMN IF NOT EXISTS `e_payroll_system` VARCHAR(40)  DEFAULT NULL AFTER `e_ai_trust`,
  ADD COLUMN IF NOT EXISTS `e_payroll_other`  VARCHAR(300) DEFAULT NULL AFTER `e_payroll_system`;
