-- Correction of rows 14 and 24: bureau answers left behind when two companies
-- backed out of the bureau path. The old values move to survey_corrections, so
-- nothing is lost; the row keeps every answer from the path actually taken.

CREATE TABLE IF NOT EXISTS `survey_corrections` (
  `id`            BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `created_at`    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `submission_id` BIGINT UNSIGNED NOT NULL,
  `column_name`   VARCHAR(64) NOT NULL,
  `old_value`     TEXT NULL,
  `reason`        VARCHAR(255) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `survey_corrections_submission` (`submission_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

START TRANSACTION;

SET @why = 'Svar fra bureau-sporet, som respondenten forlod igen (fejl rettet 2026-09-28)';

INSERT INTO survey_corrections (submission_id, column_name, old_value, reason)
  SELECT id, 'c_client_count', c_client_count, @why FROM survey_submissions WHERE id IN (14, 24);
INSERT INTO survey_corrections (submission_id, column_name, old_value, reason)
  SELECT id, 'c_payroll_systems', c_payroll_systems, @why FROM survey_submissions WHERE id IN (14, 24);
INSERT INTO survey_corrections (submission_id, column_name, old_value, reason)
  SELECT id, 'c_setup', c_setup, @why FROM survey_submissions WHERE id = 24;

UPDATE survey_submissions SET c_client_count = NULL, c_payroll_systems = NULL
 WHERE id = 14 AND track = 'zenegy' AND payroll_context = 'internal'
   AND c_client_count = '1-5' AND c_payroll_systems = '["zenegy"]' AND c_setup IS NULL;
-- Anything but exactly one row raises "Subquery returns more than 1 row",
-- which aborts the batch before COMMIT and rolls the whole thing back.
SELECT IF(ROW_COUNT() = 1, 'række 14 rettet', (SELECT 1 UNION SELECT 2)) AS guard;

UPDATE survey_submissions SET c_client_count = NULL, c_payroll_systems = NULL, c_setup = NULL
 WHERE id = 24 AND track = 'zenegy' AND payroll_context = 'internal'
   AND c_client_count = '6-20' AND c_payroll_systems = '["zenegy"]' AND c_setup = 'we-choose-we-pay';
SELECT IF(ROW_COUNT() = 1, 'række 24 rettet', (SELECT 1 UNION SELECT 2)) AS guard;

SELECT IF((SELECT COUNT(*) FROM survey_corrections WHERE submission_id IN (14, 24)) = 5,
          '5 gamle værdier gemt i survey_corrections', (SELECT 1 UNION SELECT 2)) AS guard;

COMMIT;
