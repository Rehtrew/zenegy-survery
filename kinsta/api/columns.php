<?php
/**
 * The only columns the survey will ever write, and how each value is checked.
 *
 * The browser posts whatever the survey collected; anything not listed here is
 * dropped rather than trusted. Values are coerced before they reach SQL, and
 * every write is a prepared statement — see db.php.
 */

declare(strict_types=1);

const SURVEY_TRACKS = ['zenegy', 'non-zenegy', 'employee', 'bureau'];

const SURVEY_MAX_TEXT = 2000;
const SURVEY_MAX_ARRAY_ITEMS = 60;
const SURVEY_MAX_ARRAY_ITEM = 300;
const SURVEY_MAX_RANKS = 12;

/** column => type. json = stored as a JSON string in a JSON column. */
const SURVEY_COLUMNS = [
    'track'                   => 'text',
    'payroll_context'         => 'text',
    'is_employee'             => 'bool',
    'size'                    => 'text',

    'a_products'              => 'json_list',
    'a_migration_from'        => 'text',
    'a_satisfaction'          => 'text',
    'a_satisfaction_text'     => 'text',
    'a_best_thing'            => 'text',
    'a_best_thing_text'       => 'text',
    'a_nps'                   => 'nps',
    'a_improve_text'          => 'text',

    'b_payroll_system'        => 'text',
    'b_payroll_other'         => 'text',
    'b_frustrations'          => 'json_list',
    'b_frustration_other'     => 'text',
    'b_priorities'            => 'json_ranks',
    'b_barriers'              => 'json_list',
    'b_barrier_other'         => 'text',
    'b_switch_intent'         => 'text',

    'c_client_count'          => 'text',
    'c_payroll_systems'       => 'json_list',
    'c_payroll_system_other'  => 'text',
    'c_setup'                 => 'text',
    'c_data_collection'       => 'json_list',
    'c_data_collection_other' => 'text',
    'c_frustrations'          => 'json_list',
    'c_frustration_other'     => 'text',
    'c_priorities'            => 'json_ranks',
    'c_switch_intent'         => 'text',

    'e_payslip'               => 'text',
    'e_pain_points'           => 'json_list',
    'e_expenses'              => 'text',
    'e_ai_trust'              => 'text',

    'ai_interest'             => 'text',
    'accounting_system'       => 'text',
    'accounting_other'        => 'text',
];

function survey_clean_text(mixed $value): ?string
{
    if (!is_string($value)) {
        return null;
    }
    $trimmed = trim($value);
    if ($trimmed === '') {
        return null;
    }
    return mb_substr($trimmed, 0, SURVEY_MAX_TEXT);
}

function survey_clean_list(mixed $value): ?string
{
    if (!is_array($value)) {
        return null;
    }
    $items = [];
    foreach ($value as $item) {
        if (!is_string($item)) {
            continue;
        }
        $item = mb_substr(trim($item), 0, SURVEY_MAX_ARRAY_ITEM);
        if ($item !== '') {
            $items[] = $item;
        }
        if (count($items) >= SURVEY_MAX_ARRAY_ITEMS) {
            break;
        }
    }
    return $items === [] ? null : json_encode($items, JSON_UNESCAPED_UNICODE);
}

/** Priority questions store [{ rank, value }] — keep that shape, drop the rest. */
function survey_clean_ranks(mixed $value): ?string
{
    if (!is_array($value)) {
        return null;
    }
    $items = [];
    foreach ($value as $entry) {
        if (!is_array($entry)) {
            continue;
        }
        $rank = $entry['rank'] ?? null;
        $label = survey_clean_text($entry['value'] ?? null);
        if (!is_int($rank) || $rank < 0 || $rank > 100 || $label === null) {
            continue;
        }
        $items[] = ['rank' => $rank, 'value' => $label];
        if (count($items) >= SURVEY_MAX_RANKS) {
            break;
        }
    }
    return $items === [] ? null : json_encode($items, JSON_UNESCAPED_UNICODE);
}

/**
 * Turn a decoded request body into the columns and values to insert.
 *
 * @return array{0: string[], 1: array<int, string|int|bool>}
 * @throws InvalidArgumentException when the body can't be stored at all
 */
function survey_build_submission(mixed $body): array
{
    if (!is_array($body)) {
        throw new InvalidArgumentException('Body skal være et JSON-objekt');
    }
    $track = survey_clean_text($body['track'] ?? null);
    if ($track === null || !in_array($track, SURVEY_TRACKS, true)) {
        throw new InvalidArgumentException('track skal være en af: ' . implode(', ', SURVEY_TRACKS));
    }

    $columns = [];
    $values = [];
    foreach (SURVEY_COLUMNS as $column => $kind) {
        if (!array_key_exists($column, $body)) {
            continue;
        }
        $raw = $body[$column];
        $value = match ($kind) {
            'text'       => survey_clean_text($raw),
            'json_list'  => survey_clean_list($raw),
            'json_ranks' => survey_clean_ranks($raw),
            'bool'       => is_bool($raw) ? $raw : null,
            'nps'        => (is_int($raw) && $raw >= 0 && $raw <= 10) ? $raw : null,
            default      => null,
        };
        if ($value === null) {
            continue;
        }
        $columns[] = $column;
        $values[] = $value;
    }

    if (!in_array('track', $columns, true)) {
        array_unshift($columns, 'track');
        array_unshift($values, $track);
    }
    return [$columns, $values];
}

/**
 * @return array{email: string, newsletter: bool}
 * @throws InvalidArgumentException
 */
function survey_build_signup(mixed $body): array
{
    if (!is_array($body)) {
        throw new InvalidArgumentException('Body skal være et JSON-objekt');
    }
    $email = survey_clean_text($body['email'] ?? null);
    if ($email === null || mb_strlen($email) > 320 || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
        throw new InvalidArgumentException('Ugyldig email');
    }
    return ['email' => $email, 'newsletter' => ($body['newsletter_opt_in'] ?? false) === true];
}
