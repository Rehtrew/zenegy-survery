<?php
/**
 * Checks for the results-page filter: it decides which rows a slice contains,
 * so a wrong match silently changes every percentage on the page.
 */

declare(strict_types=1);

define('SURVEY_NO_DISPATCH', true);
require_once __DIR__ . '/../api/labels.php';
require_once __DIR__ . '/../api/results-page.php';

$failures = 0;
$checks = 0;

function check(string $name, callable $assertion): void
{
    global $failures, $checks;
    $checks++;
    try {
        if ($assertion() !== true) {
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

echo "\nResultatsidens filter\n";

$rows = [
    ['id' => 1, 'track' => 'non-zenegy', 'b_payroll_system' => 'danlon',
     'b_frustrations' => '["ui-old","manual-errors"]', 'c_payroll_systems' => null, 'b_priorities' => null],
    ['id' => 2, 'track' => 'non-zenegy', 'b_payroll_system' => 'lessor',
     'b_frustrations' => '["satisfied"]', 'c_payroll_systems' => null, 'b_priorities' => null],
    ['id' => 3, 'track' => 'bureau', 'b_payroll_system' => null,
     'b_frustrations' => null, 'c_payroll_systems' => '["zenegy","danlon"]',
     'b_priorities' => '[{"rank":1,"value":"heavy-automation"}]'],
];

check('matches a plain single-choice answer', fn () => survey_row_matches($rows[0], 'b_payroll_system', 'danlon'));

check('does not match a different answer', fn () => survey_row_matches($rows[1], 'b_payroll_system', 'danlon') === false);

check('matches any value inside a multi-select', fn () => survey_row_matches($rows[2], 'c_payroll_systems', 'danlon')
    && survey_row_matches($rows[2], 'c_payroll_systems', 'zenegy'));

check('matches inside a ranked priority list', fn () => survey_row_matches($rows[2], 'b_priorities', 'heavy-automation'));

check('treats a missing answer as no match', fn () => survey_row_matches($rows[2], 'b_payroll_system', 'danlon') === false);

check('never matches on a value prefix', fn () => survey_row_matches($rows[0], 'b_payroll_system', 'dan') === false);

check('an empty filter keeps every row', fn () => count(survey_apply_filters($rows, [])) === 3);

check('one filter keeps only its own rows', function () use ($rows) {
    $slice = survey_apply_filters($rows, ['b_payroll_system' => 'danlon']);
    return count($slice) === 1 && $slice[0]['id'] === 1;
});

check('two filters combine with AND', function () use ($rows) {
    $both = survey_apply_filters($rows, ['track' => 'non-zenegy', 'b_payroll_system' => 'lessor']);
    $none = survey_apply_filters($rows, ['track' => 'bureau', 'b_payroll_system' => 'lessor']);
    return count($both) === 1 && $both[0]['id'] === 2 && $none === [];
});

check('a filtered slice still counts answers correctly', function () use ($rows) {
    $counts = survey_count(survey_apply_filters($rows, ['b_payroll_system' => 'danlon']), 'b_frustrations');
    return $counts === ['ui-old' => 1, 'manual-errors' => 1];
});

check('reads known columns from the query string', function () {
    $_GET = ['f' => ['b_payroll_system' => 'danlon']];
    return survey_read_filters() === ['b_payroll_system' => 'danlon'];
});

check('drops columns that are not filterable', function () {
    $_GET = ['f' => ['a_improve_text' => 'x', 'track' => 'bureau']];
    return survey_read_filters() === ['track' => 'bureau'];
});

check('ignores a malformed or empty filter', function () {
    $_GET = ['f' => 'danlon'];
    $a = survey_read_filters();
    $_GET = ['f' => ['track' => '', 'size' => str_repeat('x', 61)]];
    return $a === [] && survey_read_filters() === [];
});

check('any labelled question can be sliced on, not just the curated eight', function () {
    return survey_can_filter('b_frustrations')
        && survey_can_filter('b_payroll_system')
        && survey_can_filter('a_improve_text') === false
        && survey_can_filter('id') === false;
});

check('names a filter by its curated name, else the question heading', function () {
    return survey_filter_name('track') === 'Spor'
        && survey_filter_name('b_frustrations') === survey_heading('b_frustrations', 'short');
});

check('accepts a question column clicked from an answer row', function () {
    $_GET = ['f' => ['b_frustrations' => 'ui-old']];
    return survey_read_filters() === ['b_frustrations' => 'ui-old'];
});

check('slicing on a multi-select answer keeps the people who picked it', function () use ($rows) {
    $slice = survey_apply_filters($rows, ['b_frustrations' => 'ui-old']);
    return count($slice) === 1 && $slice[0]['b_payroll_system'] === 'danlon';
});

check('builds a url that adds, replaces and clears', function () {
    $add = survey_filter_url([], 'track', 'bureau');
    $clear = survey_filter_url(['track' => 'bureau'], 'track', null);
    $csv = survey_filter_url(['track' => 'bureau'], null, null, ['format' => 'csv']);
    return $add === '?' . http_build_query(['f' => ['track' => 'bureau']])
        && $clear === '?'
        && str_contains($csv, 'format=csv') && str_contains($csv, 'bureau');
});

check('groups completions by Danish calendar day, newest last', function () {
    $series = survey_by_day([
        ['created_at' => '2026-09-24 22:30:00'], // 00:30 on the 25th in Denmark
        ['created_at' => '2026-09-24 06:00:00'],
        ['created_at' => '2026-09-24 07:00:00'],
    ]);
    return $series === ['2026-09-24' => 2, '2026-09-25' => 1];
});

check('fills days with no answers, so the chart keeps an even time axis', function () {
    $series = survey_by_day([
        ['created_at' => '2026-09-21 09:00:00'],
        ['created_at' => '2026-09-24 09:00:00'],
    ]);
    return array_keys($series) === ['2026-09-21', '2026-09-22', '2026-09-23', '2026-09-24']
        && array_values($series) === [1, 0, 0, 1];
});

check('has no series to draw when nothing has been answered', fn () => survey_by_day([]) === []);

echo "\n{$checks} checks, {$failures} failed\n";
exit($failures === 0 ? 0 : 1);
