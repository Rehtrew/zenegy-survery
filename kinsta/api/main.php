<?php
/**
 * Request dispatch for the bundled endpoint.
 *
 * The deployed survey is two files — index.html and api.php — so both the write
 * and the health check live behind one URL:
 *
 *   POST api.php   one completed survey
 *   GET  api.php   "are the credentials right and does the table exist?"
 *
 * The optional report email is not here: it goes to HubSpot from the browser.
 */

declare(strict_types=1);

require_once __DIR__ . '/respond.php';
require_once __DIR__ . '/columns.php';
require_once __DIR__ . '/db.php';

function survey_handle_health(): never
{
    try {
        $name = survey_table('submissions');
        $statement = survey_pdo()->prepare(
            'SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = DATABASE() AND table_name = ?'
        );
        $statement->execute([$name]);
        $exists = ((int) $statement->fetchColumn()) === 1;
        survey_json($exists ? 200 : 503, ['ok' => $exists, 'tables' => [$name => $exists]]);
    } catch (Throwable $e) {
        error_log('Survey health check failed: ' . $e->getMessage());
        survey_json(503, ['ok' => false, 'error' => 'Ingen forbindelse til databasen']);
    }
}

function survey_handle_submit(): never
{
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
}

function survey_main(): never
{
    if (($_SERVER['REQUEST_METHOD'] ?? '') === 'GET') {
        survey_handle_health();
    }
    survey_handle_submit();
}

// The PHP tests require the modules directly; only the deployed bundle runs.
if (!defined('SURVEY_NO_DISPATCH')) {
    survey_main();
}
