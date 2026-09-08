<?php
/**
 * POST one completed survey. Answers are anonymous — no email, no IP stored.
 */

declare(strict_types=1);

require_once __DIR__ . '/respond.php';
require_once __DIR__ . '/columns.php';
require_once __DIR__ . '/db.php';

$body = survey_read_body();
survey_rate_limit('submit', 30);

try {
    [$columns, $values] = survey_build_submission($body);
} catch (InvalidArgumentException $e) {
    survey_json(400, ['error' => $e->getMessage()]);
}

try {
    survey_insert('submissions', $columns, $values);
} catch (Throwable $e) {
    error_log('Survey submission failed: ' . $e->getMessage());
    survey_json(500, ['error' => 'Kunne ikke gemme svaret']);
}

survey_json(201, ['ok' => true]);
