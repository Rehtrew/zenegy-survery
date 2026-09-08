-- Survey table for the Zenegy.com WordPress database (MySQL/MariaDB).
--
-- Run once in MyKinsta → Database → SQL console. It only CREATEs one new table,
-- prefixed `survey_`; it never reads, alters or drops a wp_ table.
--
-- Answers only. The optional "send me the report" email goes to HubSpot, so no
-- email is ever stored here — which is what keeps the survey anonymous.
--
-- Safe to run twice (CREATE TABLE IF NOT EXISTS).

CREATE TABLE IF NOT EXISTS `survey_submissions` (
  `id`                      BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `created_at`              DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `track`                   VARCHAR(20) NOT NULL,

  `payroll_context`         VARCHAR(20)  DEFAULT NULL,
  `is_employee`             TINYINT(1)   DEFAULT NULL,
  `size`                    VARCHAR(20)  DEFAULT NULL,

  `a_products`              JSON         DEFAULT NULL,
  `a_migration_from`        VARCHAR(40)  DEFAULT NULL,
  `a_satisfaction`          VARCHAR(20)  DEFAULT NULL,
  `a_satisfaction_text`     TEXT         DEFAULT NULL,
  `a_best_thing`            VARCHAR(40)  DEFAULT NULL,
  `a_best_thing_text`       TEXT         DEFAULT NULL,
  `a_nps`                   TINYINT      DEFAULT NULL,
  `a_improve_text`          TEXT         DEFAULT NULL,

  `b_payroll_system`        VARCHAR(40)  DEFAULT NULL,
  `b_payroll_other`         VARCHAR(300) DEFAULT NULL,
  `b_frustrations`          JSON         DEFAULT NULL,
  `b_frustration_other`     TEXT         DEFAULT NULL,
  `b_priorities`            JSON         DEFAULT NULL,
  `b_barriers`              JSON         DEFAULT NULL,
  `b_barrier_other`         TEXT         DEFAULT NULL,
  `b_switch_intent`         VARCHAR(40)  DEFAULT NULL,

  `c_client_count`          VARCHAR(20)  DEFAULT NULL,
  `c_payroll_systems`       JSON         DEFAULT NULL,
  `c_payroll_system_other`  VARCHAR(300) DEFAULT NULL,
  `c_setup`                 VARCHAR(40)  DEFAULT NULL,
  `c_data_collection`       JSON         DEFAULT NULL,
  `c_data_collection_other` TEXT         DEFAULT NULL,
  `c_frustrations`          JSON         DEFAULT NULL,
  `c_frustration_other`     TEXT         DEFAULT NULL,
  `c_priorities`            JSON         DEFAULT NULL,
  `c_switch_intent`         VARCHAR(40)  DEFAULT NULL,

  `e_payslip`               VARCHAR(40)  DEFAULT NULL,
  `e_pain_points`           JSON         DEFAULT NULL,
  `e_expenses`              VARCHAR(40)  DEFAULT NULL,
  `e_ai_trust`              VARCHAR(40)  DEFAULT NULL,

  `ai_interest`             VARCHAR(60)  DEFAULT NULL,
  `accounting_system`       VARCHAR(40)  DEFAULT NULL,
  `accounting_other`        VARCHAR(300) DEFAULT NULL,

  PRIMARY KEY (`id`),
  KEY `survey_submissions_track` (`track`),
  KEY `survey_submissions_created_at` (`created_at`),
  KEY `survey_submissions_context` (`payroll_context`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
