<?php
/**
 * Quick check after deploying: are the credentials right and do the tables exist?
 * Reports nothing about their contents.
 */

declare(strict_types=1);

require_once __DIR__ . '/respond.php';
require_once __DIR__ . '/db.php';

try {
    $pdo = survey_pdo();
    $tables = [];
    foreach (['submissions'] as $table) {
        $name = survey_table($table);
        $statement = $pdo->prepare('SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = DATABASE() AND table_name = ?');
        $statement->execute([$name]);
        $tables[$name] = ((int) $statement->fetchColumn()) === 1;
    }
    survey_json(in_array(false, $tables, true) ? 503 : 200, ['ok' => !in_array(false, $tables, true), 'tables' => $tables]);
} catch (Throwable $e) {
    error_log('Survey health check failed: ' . $e->getMessage());
    survey_json(503, ['ok' => false, 'error' => 'Ingen forbindelse til databasen']);
}
