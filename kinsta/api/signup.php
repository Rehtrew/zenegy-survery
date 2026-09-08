<?php
/**
 * POST the optional "send me the report" email. Stored in its own table and
 * never joined to an answer row, so the survey stays anonymous.
 */

declare(strict_types=1);

require_once __DIR__ . '/respond.php';
require_once __DIR__ . '/columns.php';
require_once __DIR__ . '/db.php';

$body = survey_read_body();
survey_rate_limit('signup', 10);

try {
    $signup = survey_build_signup($body);
} catch (InvalidArgumentException $e) {
    survey_json(400, ['error' => $e->getMessage()]);
}

try {
    survey_insert('report_signups', ['email', 'newsletter_opt_in'], [$signup['email'], $signup['newsletter']]);
} catch (Throwable $e) {
    error_log('Survey signup failed: ' . $e->getMessage());
    survey_json(500, ['error' => 'Kunne ikke gemme din email']);
}

survey_json(201, ['ok' => true]);
