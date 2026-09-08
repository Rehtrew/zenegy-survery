<?php
/**
 * Plain-PHP checks for the validation that guards the database. No framework and
 * no database: these are the rules that decide what a row may contain, so they
 * should be runnable anywhere with `npm run test:php`.
 */

declare(strict_types=1);

define('SURVEY_NO_DISPATCH', true);
require_once __DIR__ . '/../api/columns.php';

$failures = 0;
$checks = 0;

function check(string $name, callable $assertion): void
{
    global $failures, $checks;
    $checks++;
    try {
        $result = $assertion();
        if ($result !== true) {
            $failures++;
            echo "  ✗ {$name}\n";
            return;
        }
    } catch (Throwable $e) {
        $failures++;
        echo "  ✗ {$name} — threw " . $e::class . ': ' . $e->getMessage() . "\n";
        return;
    }
    echo "  ✓ {$name}\n";
}

function throws(callable $fn, string $expect): bool
{
    try {
        $fn();
    } catch (InvalidArgumentException $e) {
        return str_contains($e->getMessage(), $expect);
    }
    return false;
}

echo "survey_build_submission\n";

check('keeps known columns and drops everything else', function () {
    [$columns, $values] = survey_build_submission([
        'track' => 'bureau',
        'c_client_count' => '21-50',
        'id' => 99,
        'is_admin' => true,
    ]);
    return $columns === ['track', 'c_client_count'] && $values === ['bureau', '21-50'];
});

check('rejects an unknown track', fn () => throws(
    fn () => survey_build_submission(['track' => 'partner']),
    'track skal være en af',
));

check('rejects a body that is not an object', fn () => throws(
    fn () => survey_build_submission('nope'),
    'JSON-objekt',
));

check('stores string lists as JSON and skips non-strings', function () {
    [$columns, $values] = survey_build_submission([
        'track' => 'bureau',
        'c_payroll_systems' => ['dataloen', 42, null, 'zenegy'],
    ]);
    $index = array_search('c_payroll_systems', $columns, true);
    return $values[$index] === '["dataloen","zenegy"]';
});

check('serialises rankings and drops malformed entries', function () {
    [$columns, $values] = survey_build_submission([
        'track' => 'bureau',
        'c_priorities' => [
            ['rank' => 1, 'value' => 'one-login'],
            ['rank' => 'x', 'value' => 'bad'],
            ['value' => 'no rank'],
        ],
    ]);
    $index = array_search('c_priorities', $columns, true);
    return $values[$index] === '[{"rank":1,"value":"one-login"}]';
});

check('accepts NPS 0–10 and ignores anything else', function () {
    [$zero] = survey_build_submission(['track' => 'zenegy', 'a_nps' => 0]);
    [$eleven] = survey_build_submission(['track' => 'zenegy', 'a_nps' => 11]);
    [$text] = survey_build_submission(['track' => 'zenegy', 'a_nps' => 'seven']);
    return in_array('a_nps', $zero, true)
        && !in_array('a_nps', $eleven, true)
        && !in_array('a_nps', $text, true);
});

check('drops blank strings instead of storing them', function () {
    [$columns] = survey_build_submission(['track' => 'employee', 'e_payslip' => '   ']);
    return $columns === ['track'];
});

check('caps very long free text at 2000 characters', function () {
    [$columns, $values] = survey_build_submission([
        'track' => 'zenegy',
        'a_improve_text' => str_repeat('x', 5000),
    ]);
    return mb_strlen($values[array_search('a_improve_text', $columns, true)]) === 2000;
});

check('keeps Danish characters intact', function () {
    [$columns, $values] = survey_build_submission([
        'track' => 'bureau',
        'c_frustration_other' => 'Løn og æøå',
    ]);
    return $values[array_search('c_frustration_other', $columns, true)] === 'Løn og æøå';
});

check('keeps booleans typed and rejects string lookalikes', function () {
    [, $values] = survey_build_submission(['track' => 'employee', 'is_employee' => true]);
    [$columns] = survey_build_submission(['track' => 'employee', 'is_employee' => 'yes']);
    return in_array(true, $values, true) && $columns === ['track'];
});

echo "\n{$checks} checks, {$failures} failed\n";
exit($failures === 0 ? 0 : 1);
