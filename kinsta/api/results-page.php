<?php
/**
 * Internal results view: /markeds-undersoegelse/results.php
 *
 * Read-only. Access is the WordPress login that already exists — the page boots
 * WordPress purely to ask "is this a logged-in editor?" and redirects to wp-login
 * if not. No new password, no separate user list, nothing to leak.
 *
 * ?format=csv downloads every row.
 */

declare(strict_types=1);

/** Boot WordPress from wherever it sits above this folder, for auth only. */
function survey_require_login(): void
{
    $dir = __DIR__;
    for ($i = 0; $i < 6; $i++) {
        if (is_readable($dir . '/wp-load.php')) {
            require_once $dir . '/wp-load.php';
            if (!is_user_logged_in() || !current_user_can('edit_posts')) {
                auth_redirect();
                exit;
            }
            return;
        }
        $parent = dirname($dir);
        if ($parent === $dir) {
            break;
        }
        $dir = $parent;
    }
    http_response_code(500);
    exit('Kunne ikke finde WordPress til login-tjek.');
}

/** Free-text columns, newest first, so the actual wording gets read. */
const SURVEY_FREE_TEXT = [
    'a_satisfaction_text'     => 'Uddybning af tilfredshed',
    'a_best_thing_text'       => 'Største værdi, med egne ord',
    'a_improve_text'          => 'Hvad kan vi forbedre',
    'b_frustration_other'     => 'Andre frustrationer',
    'b_barrier_other'         => 'Andre barrierer',
    'b_payroll_other'         => 'Andet lønsystem',
    'c_frustration_other'     => 'Andre tidsrøvere (bureau)',
    'c_data_collection_other' => 'Anden dataindsamling',
    'c_payroll_system_other'  => 'Andet lønsystem (bureau)',
    'accounting_other'        => 'Andet regnskabssystem',
];

/**
 * Dimensions worth slicing the whole page by, so "what do Danløn users find
 * frustrating" is one click rather than a CSV export and a pivot table.
 * Every other question then recomputes against that subset.
 */
const SURVEY_FILTERS = [
    'track'             => 'Hvem',
    'size'              => 'Virksomhedens størrelse',
    'b_payroll_system'  => 'Lønsystem',
    'c_payroll_systems' => 'Bureauernes lønsystemer',
    'c_client_count'    => 'Bureauernes antal kunder',
    'accounting_system' => 'Regnskabssystem',
    'utm_source'        => 'Kilde',
];

/** How each curated facet draws: tiles, a small histogram, or chips. */
const SURVEY_FACET_KIND = [
    'track'          => 'tiles',
    'size'           => 'hist',
    'c_client_count' => 'hist',
];

/** True when one row answered $column with $value. Handles JSON multi-selects. */
function survey_row_matches(array $row, string $column, string $value): bool
{
    $raw = $row[$column] ?? null;
    if ($raw === null || $raw === '') {
        return false;
    }
    $decoded = is_string($raw) && str_starts_with($raw, '[') ? json_decode($raw, true) : null;
    foreach (is_array($decoded) ? $decoded : [$raw] as $item) {
        if (is_array($item)) {
            $item = $item['value'] ?? null; // priority rankings
        }
        if ($item !== null && (string) $item === $value) {
            return true;
        }
    }
    return false;
}

/** True when this column may be sliced on. Every labelled question qualifies. */
function survey_can_filter(string $column): bool
{
    return isset(SURVEY_FILTERS[$column]) || isset(SURVEY_QUESTION_LABELS[$column]);
}

/** What to call a filter: the curated name, else the question's own heading. */
function survey_filter_name(string $column): string
{
    return SURVEY_FILTERS[$column] ?? survey_heading($column, 'short');
}

/** Filters from the query string, keyed by column; unknown columns are dropped. */
function survey_read_filters(): array
{
    $raw = $_GET['f'] ?? null;
    if (!is_array($raw)) {
        return [];
    }
    $filters = [];
    foreach ($raw as $column => $value) {
        if (is_string($column) && is_string($value) && $value !== ''
            && survey_can_filter($column) && strlen($value) <= 60) {
            $filters[$column] = $value;
        }
    }
    return $filters;
}

/** Keep only the rows matching every active filter. */
function survey_apply_filters(array $rows, array $filters): array
{
    if ($filters === []) {
        return $rows;
    }
    return array_values(array_filter($rows, static function (array $row) use ($filters): bool {
        foreach ($filters as $column => $value) {
            if (!survey_row_matches($row, $column, $value)) {
                return false;
            }
        }
        return true;
    }));
}

/**
 * A link to this page with $column set to $value, or cleared when $value is
 * null. Clicking an already-active option therefore removes it.
 */
function survey_filter_url(array $filters, ?string $column = null, ?string $value = null, array $extra = []): string
{
    if ($column !== null) {
        if ($value === null) {
            unset($filters[$column]);
        } else {
            $filters[$column] = $value;
        }
    }
    $query = array_merge($filters === [] ? [] : ['f' => $filters], $extra);
    return $query === [] ? '?' : '?' . http_build_query($query);
}

/**
 * Funnel counts per event, and per campaign source.
 *
 * The events table holds counts only, so this is the whole picture: how many
 * opened the survey, how many started, and (from the answers) how many finished.
 */
function survey_funnel(): array
{
    $table = survey_table('events');
    $rows = survey_pdo()
        ->query("SELECT `event`, COALESCE(`utm_source`, 'direkte') AS src, COUNT(*) AS n
                 FROM `{$table}` GROUP BY `event`, src")
        ->fetchAll();

    $totals = ['view' => 0, 'start' => 0];
    $bySource = [];
    foreach ($rows as $row) {
        $event = (string) $row['event'];
        $src = (string) $row['src'];
        $n = (int) $row['n'];
        $totals[$event] = ($totals[$event] ?? 0) + $n;
        $bySource[$src][$event] = ($bySource[$src][$event] ?? 0) + $n;
    }
    return ['totals' => $totals, 'bySource' => $bySource];
}

/** Completed answers per campaign source, to close the funnel. */
function survey_completions_by_source(array $rows): array
{
    $counts = [];
    foreach ($rows as $row) {
        $src = ($row['utm_source'] ?? null) ?: 'direkte';
        $counts[$src] = ($counts[$src] ?? 0) + 1;
    }
    return $counts;
}

function survey_rows(): array
{
    return survey_pdo()
        ->query('SELECT * FROM `' . survey_table('submissions') . '` ORDER BY id DESC')
        ->fetchAll();
}

/** Count answers for one column; JSON lists count once per selected value. */
function survey_count(array $rows, string $column): array
{
    $counts = [];
    foreach ($rows as $row) {
        $value = $row[$column] ?? null;
        if ($value === null || $value === '') {
            continue;
        }
        $decoded = is_string($value) && str_starts_with($value, '[') ? json_decode($value, true) : null;
        foreach (is_array($decoded) ? $decoded : [$value] as $item) {
            if (is_array($item)) {
                $item = $item['value'] ?? null; // priority rankings
            }
            if ($item === null || $item === '') {
                continue;
            }
            $key = (string) $item;
            $counts[$key] = ($counts[$key] ?? 0) + 1;
        }
    }
    arsort($counts);
    return $counts;
}

/** Completions per calendar day (Danish time), oldest first, gaps filled in. */
function survey_by_day(array $rows): array
{
    $byDay = [];
    foreach ($rows as $row) {
        $day = survey_local_time($row['created_at'] ?? null, 'Y-m-d');
        if ($day !== '') {
            $byDay[$day] = ($byDay[$day] ?? 0) + 1;
        }
    }
    if ($byDay === []) {
        return [];
    }
    ksort($byDay);
    $days = array_keys($byDay);
    $cursor = new DateTimeImmutable((string) reset($days));
    $last = new DateTimeImmutable((string) end($days));
    $series = [];
    while ($cursor <= $last) {
        $key = $cursor->format('Y-m-d');
        $series[$key] = $byDay[$key] ?? 0;
        $cursor = $cursor->modify('+1 day');
    }
    return $series;
}

/**
 * Role against payroll system. The four tracks exclude each other, which hides
 * the one overlap the data does hold: most bureaus run Zenegy for some clients.
 * Employees are never asked their employer's system, so that cell stays empty
 * rather than pretending to know.
 */
function survey_audience(array $rows): array
{
    $cells = [
        'company' => ['zenegy' => 0, 'other' => 0],
        'bureau'  => ['zenegy' => 0, 'other' => 0],
        'employee' => ['unknown' => 0],
    ];
    foreach ($rows as $row) {
        switch ($row['track'] ?? '') {
            case 'zenegy':
                $cells['company']['zenegy']++;
                break;
            case 'non-zenegy':
                $cells['company']['other']++;
                break;
            case 'bureau':
                $cells['bureau'][survey_row_matches($row, 'c_payroll_systems', 'zenegy') ? 'zenegy' : 'other']++;
                break;
            case 'employee':
                $cells['employee']['unknown']++;
                break;
        }
    }
    return $cells;
}

/**
 * Counts for one facet within the current slice, ignoring that facet's own
 * filter, so its options still show what picking them would give.
 */
function survey_facet_counts(array $allRows, array $filters, string $column): array
{
    unset($filters[$column]);
    return survey_count(survey_apply_filters($allRows, $filters), $column);
}

/** Options in the order the survey listed them, with counts, zeros included. */
function survey_scale(array $counts, string $column): array
{
    $out = [];
    foreach (array_keys(SURVEY_VALUE_LABELS[$column] ?? []) as $value) {
        $out[(string) $value] = $counts[(string) $value] ?? 0;
    }
    return $out;
}

/** The small mark in front of an option: its logo, or initials on a colour. */
function survey_logo(string $column, string $value): string
{
    $logo = SURVEY_VALUE_LOGOS[$column][$value] ?? null;
    if ($logo === null) {
        return '';
    }
    if (isset($logo['img'])) {
        return '<i class="lg ' . survey_e($logo['img']) . '"></i>';
    }
    $bg = isset($logo['bg']) ? ' style="background:' . survey_e($logo['bg']) . '"' : '';
    return '<i class="lg txt"' . $bg . '>' . survey_e((string) $logo['initials']) . '</i>';
}

/**
 * Bar colour class for an option. Scales with a direction get the system
 * colours; everything else takes the colour of the slice being read.
 */
function survey_tone(string $column, string $value): string
{
    if ($column === 'a_nps') {
        $n = (int) $value;
        return $n >= 9 ? 'good' : ($n >= 7 ? 'mid' : 'bad');
    }
    if ($column === 'a_satisfaction') {
        return match ($value) {
            'very-happy', 'happy' => 'good',
            'meh' => 'mid',
            default => 'bad',
        };
    }
    return '';
}

/** How many people answered this question at all — the honest denominator. */
function survey_respondents(array $rows, string $column): int
{
    $answered = 0;
    foreach ($rows as $row) {
        $value = $row[$column] ?? null;
        if ($value !== null && $value !== '' && $value !== '[]') {
            $answered++;
        }
    }
    return $answered;
}

/**
 * Every option for a question in survey order, with its count — including the
 * ones nobody picked, because "nobody picked this" is a finding. Values that
 * aren't in the label map (an older option, say) are kept and listed last.
 */
function survey_option_rows(array $counts, string $column): array
{
    $rows = [];
    foreach (array_keys(SURVEY_VALUE_LABELS[$column] ?? []) as $value) {
        $rows[(string) $value] = $counts[$value] ?? 0;
    }
    foreach ($counts as $value => $count) {
        $rows[(string) $value] = $count;
    }
    // Answered options first, biggest first; the untouched ones keep survey order.
    // A scale (NPS) reads in its own order — 0 to 10, not by popularity.
    if (!in_array($column, SURVEY_ORDERED_COLUMNS, true)) {
        uasort($rows, static fn ($a, $b) => $b <=> $a);
    }
    return $rows;
}

/** The winning option(s). Ties are called out rather than silently resolved. */
function survey_top_answer(array $counts): ?array
{
    if ($counts === []) {
        return null;
    }
    $max = max($counts);
    if ($max === 0) {
        return null;
    }
    $winners = array_keys($counts, $max, true);
    return ['values' => $winners, 'count' => $max];
}

function survey_nps(array $rows): ?array
{
    $scores = array_values(array_filter(
        array_map(static fn ($r) => $r['a_nps'], $rows),
        static fn ($n) => $n !== null,
    ));
    if ($scores === []) {
        return null;
    }
    $promoters = count(array_filter($scores, static fn ($n) => $n >= 9));
    $detractors = count(array_filter($scores, static fn ($n) => $n <= 6));
    $total = count($scores);
    return [
        'count' => $total,
        'score' => (int) round((($promoters - $detractors) / $total) * 100),
        'average' => round(array_sum($scores) / $total, 1),
        'promoters' => $promoters,
        'detractors' => $detractors,
    ];
}

function survey_send_csv(array $rows): never
{
    header('Content-Type: text/csv; charset=utf-8');
    header('Content-Disposition: attachment; filename="lonmarkedsundersogelsen-' . date('Y-m-d') . '.csv"');
    $out = fopen('php://output', 'w');
    fwrite($out, "\xEF\xBB\xBF"); // BOM so Excel opens the Danish characters right
    // PHP 8.4 deprecates fputcsv()'s implicit $escape, so pass it explicitly.
    // An empty escape is the RFC-4180 behaviour Excel and Sheets expect.
    $write = static fn (array $fields) => fputcsv($out, $fields, ',', '"', '');
    if ($rows === []) {
        $write(['id', 'created_at', 'track']);
        exit;
    }
    $headers = array_keys($rows[0]);
    $write(array_map(static fn ($h) => $h === 'created_at' ? 'created_at_dansk_tid' : $h, $headers));
    foreach ($rows as $row) {
        $row['created_at'] = survey_local_time($row['created_at'] ?? null, 'Y-m-d H:i:s');
        $write(array_map(static fn ($v) => $v === null ? '' : (string) $v, $row));
    }
    exit;
}

/**
 * The server runs in UTC, so a raw timestamp reads two hours early to anyone in
 * Denmark and invites exactly the wrong conclusion about when an answer landed.
 * Convert for display; the database keeps UTC, which is the right thing to store.
 */
function survey_local_time(?string $utc, string $format = 'd.m.Y H:i'): string
{
    if ($utc === null || $utc === '') {
        return '';
    }
    try {
        return (new DateTimeImmutable($utc, new DateTimeZone('UTC')))
            ->setTimezone(new DateTimeZone('Europe/Copenhagen'))
            ->format($format);
    } catch (Throwable) {
        return $utc;
    }
}

function survey_e(?string $value): string
{
    return htmlspecialchars((string) $value, ENT_QUOTES, 'UTF-8');
}

/** The label the respondent actually clicked, falling back to the stored value. */
function survey_label(string $column, string $value): string
{
    return SURVEY_VALUE_LABELS[$column][$value] ?? $value;
}

function survey_sublabel(string $column, string $value): ?string
{
    return SURVEY_VALUE_SUBLABELS[$column][$value] ?? null;
}

function survey_heading(string $column, string $key): string
{
    return SURVEY_QUESTION_LABELS[$column][$key] ?? $column;
}

function survey_results_main(): never
{
    survey_require_login();

    try {
        $rows = survey_rows();
    } catch (Throwable $e) {
        error_log('Survey results failed: ' . $e->getMessage());
        http_response_code(503);
        exit('Ingen forbindelse til databasen.');
    }

    // Every number below this line is computed from the filtered set, so one
    // filter re-cuts the whole page. $allRows stays whole, to build the bar.
    $allRows = $rows;
    $filters = survey_read_filters();
    $rows = survey_apply_filters($allRows, $filters);

    if (($_GET['format'] ?? '') === 'csv') {
        survey_send_csv($rows);
    }

    $total = count($rows);
    $grandTotal = count($allRows);
    $nps = survey_nps($rows);
    try {
        $funnel = survey_funnel();
    } catch (Throwable $e) {
        error_log('Survey funnel failed: ' . $e->getMessage());
        $funnel = ['totals' => ['view' => 0, 'start' => 0], 'bySource' => []];
    }
    $completionsBySource = survey_completions_by_source($rows);
    $latest = $rows[0]['created_at'] ?? null;

    $partial = ($_GET['partial'] ?? '') === '1';

    header('Content-Type: text/html; charset=utf-8');
    header('X-Robots-Tag: noindex, nofollow');
    // Live numbers behind a login: a cached copy is always the wrong answer, and
    // without this the browser is free to reuse one for as long as it likes.
    header('Cache-Control: no-cache, no-store, must-revalidate, max-age=0, private');
    header('Pragma: no-cache');
    header('Expires: 0');
    if ($partial) {
        ob_start();
    }
    ?>
<!doctype html>
<html lang="da">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<title>Svar | Lønmarkedsundersøgelsen 2026</title>
<style>
  /* Zenegy's system colours. Each carries one meaning on this page:
     a track's colour is that group everywhere, ink is a filter you set,
     info marks the most common answer, and good/mid/bad only ever mean
     a scale with a direction (NPS, satisfaction). */
  :root {
    --ink:#14132b; --ink-2:#55546a; --ink-3:#8b88a5; --line:#e8e6f0; --bg:#f8f7fc; --card:#fff;
    --brand:#6e30fd; --brand-soft:#efeafe;
    --good:#7db875; --good-soft:#eef6ec;
    --mid:#e2a865;  --mid-soft:#faf3ec;
    --bad:#d5534f;  --bad-soft:#f7e3e3;
    --info:#5b7bf5; --info-soft:#e6ebfd;
    --bar:var(--brand);
  }
  .t-zenegy     { --c:var(--brand); --cs:var(--brand-soft) }
  .t-bureau     { --c:var(--info);  --cs:var(--info-soft) }
  .t-non-zenegy { --c:var(--mid);   --cs:var(--mid-soft) }
  .t-employee   { --c:var(--good);  --cs:var(--good-soft) }
  .slice-zenegy { --bar:var(--brand) } .slice-bureau { --bar:var(--info) }
  .slice-non-zenegy { --bar:var(--mid) } .slice-employee { --bar:var(--good) }

  * { box-sizing:border-box }
  body { margin:0; background:var(--bg); color:var(--ink);
         font:15px/1.55 -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif }
  .wrap { max-width:1440px; margin:0 auto; padding:32px 24px 80px }
  h1 { font-size:28px; letter-spacing:-.02em; margin:0 0 4px }
  .sub { color:var(--ink-3); margin:0 0 22px; font-size:13.5px }
  h2 { font-size:12px; text-transform:uppercase; letter-spacing:.1em; color:var(--ink-3); font-weight:600;
       margin:30px 0 12px; padding-bottom:8px; border-bottom:1px solid var(--line) }
  h2 .count { margin-left:10px; text-transform:none; letter-spacing:0; font-weight:400 }
  .is-busy { opacity:.5; transition:opacity .12s }

  /* layout */
  .layout { display:grid; grid-template-columns:340px minmax(0,1fr); gap:24px; align-items:start }
  .main { min-width:0 }
  .side { position:sticky; top:16px; display:flex; flex-direction:column; max-height:calc(100vh - 32px);
          background:var(--card); border:1px solid var(--line); border-radius:16px; padding:16px 10px 12px 16px }

  /* sidebar: head, active filters, search */
  .side-head { margin:0 6px 12px 0; color:var(--ink-3); font-size:13px }
  .side-head b { color:var(--ink); font-size:24px; letter-spacing:-.02em; margin-right:4px; font-variant-numeric:tabular-nums }
  .side-head .csv { float:right; margin-top:9px; color:var(--ink-2); font-size:12px; text-decoration:none;
                    border:1px solid var(--line); border-radius:6px; padding:1px 7px }
  .side-head .csv:hover { border-color:var(--ink-3) }
  .active { display:flex; flex-wrap:wrap; gap:6px; align-items:center; margin:0 6px 12px 0 }
  .act { display:inline-flex; align-items:center; gap:6px; text-decoration:none; background:var(--ink); color:#fff;
         border-radius:8px; padding:5px 9px; font-size:13px; line-height:1.3 }
  .act i:not(.lg) { font-style:normal; opacity:.55; font-size:11px }
  .act b { opacity:.55; font-weight:400; margin-left:2px }
  .act:hover b { opacity:1 }
  .clear { color:var(--ink-3); font-size:12.5px; text-decoration:none; padding:0 4px }
  .clear:hover { color:var(--ink) }
  .warn { margin:0 6px 12px 0; background:var(--mid-soft); color:#8a5a12; border-radius:9px;
          padding:8px 10px; font-size:12.5px; line-height:1.45 }
  .find { width:calc(100% - 6px); border:1px solid var(--line); border-radius:10px; padding:9px 12px;
          font:inherit; font-size:13.5px; color:var(--ink); background:var(--bg) }
  .find:focus { outline:none; border-color:var(--ink-3); background:#fff }

  /* sidebar: facets */
  .facets { flex:1; overflow-y:auto; margin-top:4px; padding-right:6px }
  .facets::-webkit-scrollbar { width:8px }
  .facets::-webkit-scrollbar-thumb { background:#e2def0; border-radius:4px }
  .facet { margin-top:18px }
  .facet.extra { display:none }
  .searching .facet.extra { display:block }
  .facet-head { margin:0 0 8px; color:var(--ink-3); font-size:10.5px; font-weight:600;
                text-transform:uppercase; letter-spacing:.09em }
  .facet-none { display:none; margin:16px 4px; color:var(--ink-3); font-size:13px }
  .facets.none-found .facet-none { display:block }
  .side-foot { margin:12px 6px 0 0; padding-top:10px; border-top:1px solid var(--line);
               color:var(--ink-3); font-size:11.5px; line-height:1.5 }
  .opt { text-decoration:none; color:var(--ink-2) }
  .opt.nil { opacity:.4; pointer-events:none }

  /* Hvem: one tile per group, in that group's colour */
  .who { display:grid; grid-template-columns:1fr 1fr; gap:6px }
  .who .opt { display:block; border-radius:11px; padding:9px 11px 8px; background:var(--cs);
              border:1.5px solid transparent; transition:border-color .12s }
  .who .opt b { display:block; font-size:21px; line-height:1.15; letter-spacing:-.02em; color:var(--c);
                font-variant-numeric:tabular-nums }
  .who .opt span { display:block; font-size:12px; line-height:1.3; color:var(--ink-2) }
  .who .opt:hover { border-color:var(--c) }
  .who .opt.on { background:var(--c); border-color:var(--c) }
  .who .opt.on b, .who .opt.on span { color:#fff }

  /* sizes: a histogram you click */
  .hist { display:flex; gap:5px; align-items:stretch }
  .hist .opt { flex:1; display:flex; flex-direction:column; align-items:center; gap:3px; min-width:0;
               padding:4px 2px 2px; border-radius:8px }
  .hist .opt b { font-size:11.5px; font-weight:500; color:var(--ink-3); font-variant-numeric:tabular-nums }
  .hist .opt em { display:flex; align-items:flex-end; width:100%; height:46px }
  .hist .opt em i { display:block; width:100%; border-radius:5px 5px 2px 2px; background:#d9d2f3; transition:background .12s }
  .hist .opt span { font-size:11px; color:var(--ink-2); white-space:nowrap }
  .hist .opt:hover { background:var(--bg) }
  .hist .opt:hover em i { background:var(--brand) }
  .hist .opt.on em i { background:var(--ink) }
  .hist .opt.on b, .hist .opt.on span { color:var(--ink); font-weight:600 }

  /* systems: chips carrying the logo the survey showed */
  .chipset { display:flex; flex-wrap:wrap; gap:5px }
  .chipset .opt { display:inline-flex; align-items:center; gap:6px; background:var(--card); border:1px solid var(--line);
                  border-radius:8px; padding:4px 8px 4px 5px; font-size:13px; line-height:1.3 }
  .chipset .opt:not(:has(.lg)) { padding-left:9px }
  .chipset .opt b { color:var(--ink-3); font-size:11.5px; font-weight:500; font-variant-numeric:tabular-nums }
  .chipset .opt:hover { border-color:var(--ink-3); color:var(--ink) }
  .chipset .opt.on { background:var(--ink); border-color:var(--ink); color:#fff }
  .chipset .opt.on b { color:#fff; opacity:.7 }
  .lg { display:inline-block; flex:none; width:18px; height:18px; border-radius:5px; background:#fff center/contain no-repeat;
        box-shadow:inset 0 0 0 1px rgba(20,19,43,.07) }
  .lg.txt { display:inline-flex; align-items:center; justify-content:center; font-style:normal; font-size:8.5px;
            font-weight:700; color:#fff; background:var(--ink-3); box-shadow:none; letter-spacing:-.02em }

  /* dashboard */
  .tiles { display:flex; flex-wrap:wrap; gap:10px; margin-bottom:10px }
  .tile { flex:1 1 130px; max-width:230px; background:var(--card); border:1px solid var(--line); border-radius:14px; padding:12px 14px }
  .tile b { display:block; font-size:24px; letter-spacing:-.02em; line-height:1.2; font-variant-numeric:tabular-nums }
  .tile span { color:var(--ink-3); font-size:12px }
  .panels { display:grid; grid-template-columns:repeat(auto-fit,minmax(300px,1fr)); gap:10px; margin-bottom:10px }
  .panel { background:var(--card); border:1px solid var(--line); border-radius:14px; padding:14px 16px }
  .panel h3 { margin:0 0 10px; font-size:11.5px; color:var(--ink-3); font-weight:600; text-transform:uppercase; letter-spacing:.08em }
  .spark { display:flex; align-items:flex-end; gap:4px; height:64px }
  .spark span { flex:1 1 0; max-width:48px; height:100%; display:flex; align-items:flex-end }
  .spark i { display:block; width:100%; background:var(--bar); opacity:.85; border-radius:4px 4px 1px 1px }
  .spark span:hover i { opacity:1 }
  .panel-foot { display:flex; justify-content:space-between; gap:10px; margin:8px 0 0; color:var(--ink-3); font-size:12px; line-height:1.5 }
  .panel-foot em { font-style:normal }
  table.aud { margin:0; font-variant-numeric:tabular-nums }
  table.aud td { padding:6px 0; font-size:14px; border-top:1px solid #f1eff6 }
  table.aud tr.h td { border-top:none; color:var(--ink-3); font-size:11.5px; padding-top:0; text-align:right }
  table.aud td.r { color:var(--ink-2); text-align:left }
  table.aud td.c, table.aud td.t { text-align:right; width:23% }
  table.aud td.t { color:var(--ink-3) }
  table.aud td.c a, table.aud td.c span { display:inline-block; min-width:40px; padding:2px 9px; border-radius:7px;
                                          text-align:center; font-weight:600; text-decoration:none }
  table.aud td.c a { background:var(--cs); color:var(--c); border:1.5px solid transparent }
  table.aud td.c a:hover { border-color:var(--c) }
  table.aud td.c.on a { background:var(--c); color:#fff }
  table.aud td.c.plain span { color:var(--ink-2); font-weight:500 }
  table.aud td.nil span { color:var(--ink-3); font-weight:400 }
  table.aud td.span { text-align:center }
  table.aud td.span a { font-weight:500; font-size:13px }
  .sources { margin:0 0 10px }
  .sources > summary { cursor:pointer; color:var(--ink-3); font-size:13px }
  .sources table { margin-top:6px }
  .answered { color:var(--ink-3); font-size:12px }
  .empty { background:var(--card); border:1px dashed var(--line); border-radius:14px; padding:32px;
           text-align:center; color:var(--ink-2) }
  .empty a { color:var(--ink) }

  /* questions */
  .q { background:var(--card); border:1px solid var(--line); border-radius:14px; padding:16px 18px 12px; margin-bottom:10px }
  .q h3 { font-size:16px; margin:0 0 1px; letter-spacing:-.01em }
  .q h3 code { color:var(--ink-3); font-size:11px; font-weight:400; margin-left:6px }
  .q .asked { margin:0 0 6px; color:var(--ink-2); font-size:13.5px }
  table { width:100%; border-collapse:collapse; margin-top:6px }
  td { padding:7px 0; border-top:1px solid #f1eff6; vertical-align:middle }
  td.v { font-size:14px; padding-right:14px }
  td.v .lbl { display:inline-flex; align-items:center; gap:7px }
  td.v i:not(.lg) { display:block; font-style:normal; color:var(--ink-3); font-size:12.5px }
  .most { display:inline-block; margin-left:8px; background:var(--info-soft); color:#3552c7; border-radius:5px;
          padding:0 6px; font-size:10.5px; font-weight:600; letter-spacing:.03em; vertical-align:1px }
  td.bar { width:38%; min-width:60px }
  td.bar span { display:block; height:8px; border-radius:4px; background:var(--bar); opacity:.8 }
  td.bar span.good { background:var(--good); opacity:1 }
  td.bar span.mid  { background:var(--mid);  opacity:1 }
  td.bar span.bad  { background:var(--bad);  opacity:1 }
  tr.win td.bar span { opacity:1 }
  tr.win td.v { font-weight:600 }
  tr.zero td.v { color:var(--ink-3) }
  tr.zero td.bar span { background:var(--line) }
  td.n { text-align:right; width:96px; font-variant-numeric:tabular-nums; color:var(--ink-2); white-space:nowrap }
  .pct { display:inline-block; min-width:40px; text-align:right; color:var(--ink-3); font-size:12.5px }
  tr.head td { border-top:none; color:var(--ink-3); font-size:12.5px }
  .q-foot { margin:8px 0 0; color:var(--ink-3); font-size:12px }
  .q-foot code { margin-left:6px; font-size:11px; background:var(--bg); border-radius:4px; padding:1px 5px }
  .quote { background:var(--card); border:1px solid var(--line); border-left:3px solid var(--bar);
           border-radius:0 10px 10px 0; padding:10px 14px; margin-top:8px }
  .quote p { margin:0 0 2px; font-size:14.5px }
  .quote span { color:var(--ink-3); font-size:12px }

  @media (max-width:1150px) { td.bar { width:24% } }
  @media (max-width:980px) {
    .layout { grid-template-columns:1fr; gap:16px }
    .side { position:static; max-height:none }
    .facets { max-height:360px }
  }
</style>
<style>
  <?php foreach (SURVEY_LOGO_IMAGES as $key => $uri) : ?>
  .lg.<?= $key ?> { background-image:url("<?= $uri ?>") }
  <?php endforeach; ?>
</style>
</head>
<body>
<div class="wrap">
  <h1>Lønmarkedsundersøgelsen 2026</h1>
  <p class="sub">
    Svar opdateret live<?= $latest ? ' · seneste svar ' . survey_e(survey_local_time($latest)) : '' ?>.
    Alle tidspunkter er dansk tid. Kun synlig for indloggede i WordPress.
  </p>

  <!--live--><div id="live">
  <div class="layout">
  <aside class="side">
    <p class="side-head">
      <b><?= $total ?></b><?= $filters === [] ? ' svar i alt' : ' af ' . $grandTotal . ' svar' ?>
      <a class="csv" href="<?= survey_e(survey_filter_url($filters, null, null, ['format' => 'csv'])) ?>">CSV</a>
    </p>

    <?php if ($filters !== []) : ?>
      <div class="active">
        <?php foreach ($filters as $column => $value) : ?>
          <a class="act" data-go href="<?= survey_e(survey_filter_url($filters, $column, null)) ?>" title="Fjern filter">
            <i><?= survey_e(survey_filter_name($column)) ?></i>
            <?= survey_logo($column, $value) ?><?= survey_e(survey_label($column, $value)) ?><b>✕</b>
          </a>
        <?php endforeach; ?>
        <a class="clear" data-go href="<?= survey_e(survey_filter_url([])) ?>">Ryd alle</a>
      </div>
      <?php if ($total > 0 && $total < 10) : ?>
        <p class="warn">Kun <?= $total ?> svar. Ét svar flytter procenterne meget.</p>
      <?php endif; ?>
    <?php endif; ?>

    <input class="find" type="search" autocomplete="off" placeholder="Søg i alle svar, fx danløn eller gammeldags">

    <div class="facets">
      <?php
        $facetOrder = array_merge(
            array_keys(SURVEY_FILTERS),
            array_diff(array_keys(SURVEY_QUESTION_LABELS), array_keys(SURVEY_FILTERS))
        );
        foreach ($facetOrder as $column) :
          $counts = survey_facet_counts($allRows, $filters, $column);
          $isActive = isset($filters[$column]);
          // Nobody in this slice answered it: the facet has nothing to offer.
          if ($counts === [] && !$isActive) {
              continue;
          }
          $extra = isset(SURVEY_FILTERS[$column]) ? '' : ' extra';
          $kind = $extra === '' ? (SURVEY_FACET_KIND[$column] ?? 'chips') : 'chips';
          $name = survey_filter_name($column);
          $options = $kind === 'chips' ? $counts : survey_scale($counts, $column);
          if ($column === 'track') {
              // Same order as "Hvem er de": companies, then bureaus, then employees.
              $options = array_replace(array_fill_keys(['zenegy', 'non-zenegy', 'bureau', 'employee'], 0), $options);
          }
          if ($isActive && !isset($options[$filters[$column]])) {
              $options[$filters[$column]] = 0;
          }
          $peak = $options === [] ? 0 : max($options);
          $find = static fn (string $v): string => survey_e(mb_strtolower($name . ' ' . survey_label($column, $v) . ' ' . $v));
          $href = static fn (string $v, bool $on): string =>
              survey_e(survey_filter_url($filters, $column, $on ? null : $v)); ?>
        <section class="facet<?= $extra ?> k-<?= $kind ?>">
          <p class="facet-head"><?= survey_e($name) ?></p>

          <?php if ($kind === 'tiles') : ?>
            <div class="who">
              <?php foreach ($options as $value => $n) :
                  $value = (string) $value;
                  $on = ($filters[$column] ?? null) === $value; ?>
                <a class="opt t-<?= survey_e($value) ?><?= $on ? ' on' : '' ?><?= $n === 0 ? ' nil' : '' ?>" data-go
                   data-find="<?= $find($value) ?>" href="<?= $href($value, $on) ?>">
                  <b><?= $n ?></b><span><?= survey_e(survey_label($column, $value)) ?></span>
                </a>
              <?php endforeach; ?>
            </div>

          <?php elseif ($kind === 'hist') : ?>
            <div class="hist">
              <?php foreach ($options as $value => $n) :
                  $value = (string) $value;
                  $on = ($filters[$column] ?? null) === $value;
                  $h = $peak > 0 ? max(4, (int) round(($n / $peak) * 100)) : 4; ?>
                <a class="opt<?= $on ? ' on' : '' ?><?= $n === 0 ? ' nil' : '' ?>" data-go
                   data-find="<?= $find($value) ?>" href="<?= $href($value, $on) ?>"
                   title="<?= survey_e(survey_label($column, $value)) ?>: <?= $n ?>">
                  <b><?= $n ?></b><em><i style="height:<?= $h ?>%"></i></em>
                  <span><?= survey_e(preg_replace('/ kunder$/', '', survey_label($column, $value))) ?></span>
                </a>
              <?php endforeach; ?>
            </div>

          <?php else : ?>
            <div class="chipset">
              <?php foreach ($options as $value => $n) :
                  $value = (string) $value;
                  $on = ($filters[$column] ?? null) === $value; ?>
                <a class="opt<?= $on ? ' on' : '' ?>" data-go data-find="<?= $find($value) ?>" href="<?= $href($value, $on) ?>">
                  <?= survey_logo($column, $value) ?><span><?= survey_e(survey_label($column, $value)) ?></span><b><?= $n ?></b>
                </a>
              <?php endforeach; ?>
            </div>
          <?php endif; ?>
        </section>
      <?php endforeach; ?>
      <p class="facet-none">Ingen svar matcher søgningen.</p>
    </div>

    <p class="side-foot">
      Tallene følger dit udsnit: de viser, hvor mange du får, hvis du vælger dem.
      Søgningen dækker alle spørgsmål.
    </p>
  </aside>

  <?php
    // Reading one kind of respondent: the bars take that group's colour, so
    // the whole column says whose answers these are without reading a chip.
    $slice = isset($filters['track']) ? preg_replace('/[^a-z-]/', '', $filters['track']) : 'all';
  ?>
  <main class="main slice-<?= survey_e($slice) ?>">
  <?php if ($total === 0) : ?>
    <div class="empty">
      <?php if ($filters === []) : ?>
        Ingen svar endnu. Siden opdaterer sig selv, når det første svar lander.
      <?php else : ?>
        Ingen af de <?= $grandTotal ?> svar matcher filteret.
        <a data-go href="<?= survey_e(survey_filter_url([])) ?>">Ryd filteret</a>.
      <?php endif; ?>
    </div>
  <?php else : ?>

  <?php
    $pct = static fn (int $n, int $of): int => $of > 0 ? (int) round(($n / $of) * 100) : 0;
    $views = $funnel['totals']['view'] ?? 0;
    $starts = $funnel['totals']['start'] ?? 0;
    $showFunnel = $filters === [] && $views > 0;
    $series = survey_by_day($rows);
    $peak = $series === [] ? 0 : max($series);
  ?>

  <div class="tiles">
    <?php if ($showFunnel) : ?>
      <div class="tile"><b><?= $views ?></b><span>åbnede</span></div>
      <div class="tile"><b><?= $pct($starts, $views) ?>%</b><span>begyndte at svare</span></div>
      <div class="tile"><b><?= $pct($total, $views) ?>%</b><span>gennemførte</span></div>
    <?php endif; ?>
    <div class="tile"><b><?= $total ?></b><span><?= $filters === [] ? 'svar i alt' : 'svar i udsnittet' ?></span></div>
    <?php if ($nps) : ?>
      <div class="tile"><b><?= $nps['score'] ?></b><span>NPS · snit <?= $nps['average'] ?> af <?= $nps['count'] ?></span></div>
    <?php endif; ?>
  </div>

  <div class="panels">
    <?php if ($series !== []) : ?>
      <div class="panel">
        <h3>Svar per dag</h3>
        <div class="spark">
          <?php foreach ($series as $day => $n) : ?>
            <span title="<?= survey_e(date('j. M', strtotime($day))) ?>: <?= $n ?> svar">
              <i style="height:<?= $peak > 0 ? max(2, (int) round(($n / $peak) * 100)) : 2 ?>%"></i>
            </span>
          <?php endforeach; ?>
        </div>
        <p class="panel-foot">
          <?= survey_e(date('j. M', strtotime((string) array_key_first($series)))) ?>
          <em>højeste dag <?= $peak ?></em>
          <?= survey_e(date('j. M', strtotime((string) array_key_last($series)))) ?>
        </p>
      </div>
    <?php endif; ?>

    <?php
      $aud = survey_audience($rows);
      // A cell links to the filter that reproduces it, where one exists.
      $cellUrl = static function (array $set) use ($filters): string {
          return survey_filter_url(array_merge($filters, $set));
      };
      $isCell = static fn (array $set): bool => array_intersect_assoc($set, $filters) === $set
          && count($filters) === count($set);
      $cell = static function (int $n, ?array $set, string $tone) use ($cellUrl, $isCell): string {
          if ($n === 0 || $set === null) {
              return '<td class="c t-' . $tone . ($n === 0 ? ' nil' : ' plain') . '"><span>' . ($n === 0 ? '–' : $n) . '</span></td>';
          }
          return '<td class="c t-' . $tone . ($isCell($set) ? ' on' : '') . '"><a data-go href="'
              . survey_e($cellUrl($set)) . '">' . $n . '</a></td>';
      };
    ?>
    <div class="panel">
      <h3>Hvem er de</h3>
      <table class="aud">
        <tr class="h"><td></td><td>Bruger Zenegy</td><td>Bruger ikke Zenegy</td><td>I alt</td></tr>
        <tr>
          <td class="r">Virksomheder</td>
          <?= $cell($aud['company']['zenegy'], ['track' => 'zenegy'], 'zenegy') ?>
          <?= $cell($aud['company']['other'], ['track' => 'non-zenegy'], 'non-zenegy') ?>
          <td class="t"><?= $aud['company']['zenegy'] + $aud['company']['other'] ?></td>
        </tr>
        <tr>
          <td class="r">Lønbureauer</td>
          <?= $cell($aud['bureau']['zenegy'], ['track' => 'bureau', 'c_payroll_systems' => 'zenegy'], 'bureau') ?>
          <?= $cell($aud['bureau']['other'], null, 'bureau') ?>
          <td class="t"><?= $aud['bureau']['zenegy'] + $aud['bureau']['other'] ?></td>
        </tr>
        <tr>
          <td class="r">Lønmodtagere</td>
          <td class="c span t-employee<?= $isCell(['track' => 'employee']) ? ' on' : '' ?>" colspan="2">
            <?php if ($aud['employee']['unknown'] > 0) : ?>
              <a data-go href="<?= survey_e($cellUrl(['track' => 'employee'])) ?>"><?= $aud['employee']['unknown'] ?> · ikke spurgt om system</a>
            <?php else : ?><span>–</span><?php endif; ?>
          </td>
          <td class="t"><?= $aud['employee']['unknown'] ?></td>
        </tr>
      </table>
      <p class="panel-foot">
        <span>Bureauer tæller som Zenegy-brugere, når Zenegy er blandt deres systemer.
        Lønmodtagere bliver ikke spurgt om arbejdsgiverens lønsystem.</span>
      </p>
    </div>
  </div>

  <?php if ($showFunnel && count($funnel['bySource']) > 1) : ?>
    <details class="sources">
      <summary>Kilder · hvilke links giver besvarelser, ikke bare klik</summary>
      <table>
        <tr class="head"><td class="v"><b>Kilde</b></td><td class="n"><b>Åbnet</b></td><td class="n"><b>Startet</b></td><td class="n"><b>Gennemført</b></td></tr>
        <?php foreach ($funnel['bySource'] as $src => $c) :
            $v = $c['view'] ?? 0;
            $done = $completionsBySource[$src] ?? 0; ?>
          <tr>
            <td class="v"><?= survey_e($src) ?></td>
            <td class="n"><?= $v ?></td>
            <td class="n"><?= $c['start'] ?? 0 ?></td>
            <td class="n"><?= $done ?><span class="pct"><?= $pct($done, $v) ?>%</span></td>
          </tr>
        <?php endforeach; ?>
      </table>
      <span class="answered">Tæller sidevisninger, ikke unikke personer. En genindlæsning tæller igen.</span>
    </details>
  <?php endif; ?>

  <?php foreach (SURVEY_GROUPS as $group) :
      // Only the questions this slice actually answered. A card for a column
      // that is itself the filter, with one answer left, just reads "100 %".
      $cards = [];
      foreach ($group['columns'] as $column) {
          // The route through the survey, not something anyone answered. The
          // tiles and "Hvem er de" already say it.
          if ($column === 'track') {
              continue;
          }
          // With a track chosen, these two follow from it and read "100 %".
          // Bureaus are the exception: "for others" against "both" still says something.
          if (isset($filters['track']) && ($column === 'is_employee'
              || ($column === 'payroll_context' && $filters['track'] !== 'bureau'))) {
              continue;
          }
          $counts = survey_count($rows, $column);
          $answered = survey_respondents($rows, $column);
          if ($answered === 0 || (isset($filters[$column]) && count($counts) <= 1)) {
              continue;
          }
          $cards[$column] = [$counts, $answered];
      }
      if ($cards === []) {
          continue;
      } ?>
    <h2>
      <?= survey_e($group['name']) ?>
      <span class="count"><?= count($cards) ?> spørgsmål</span>
    </h2>

    <?php foreach ($cards as $column => [$counts, $answered]) :
        $options = survey_option_rows($counts, $column);
        $max = $options === [] ? 0 : max($options);
        $top = survey_top_answer($counts);
        $winners = $top && count($options) > 1 ? array_map('strval', $top['values']) : []; ?>
      <div class="q">
        <h3><?= survey_e(survey_heading($column, 'short')) ?></h3>
        <p class="asked"><?= survey_e(survey_heading($column, 'question')) ?></p>

        <table>
          <?php foreach ($options as $value => $count) :
              $value = (string) $value;
              $share = $answered > 0 ? round(($count / $answered) * 100) : 0;
              $sub = survey_sublabel($column, $value);
              $won = in_array($value, $winners, true);
              $tone = survey_tone($column, $value); ?>
            <tr class="<?= $count === 0 ? 'zero' : '' ?><?= $won ? ' win' : '' ?>">
              <td class="v">
                <span class="lbl"><?= survey_logo($column, $value) ?><?= survey_e(survey_label($column, $value)) ?></span>
                <?php if ($won) : ?><span class="most"><?= count($winners) > 1 ? 'Delt førsteplads' : 'Flest svar' ?></span><?php endif; ?>
                <?php if ($sub) : ?><i><?= survey_e($sub) ?></i><?php endif; ?>
              </td>
              <td class="bar"><span class="<?= $tone ?>" style="width:<?= $max > 0 ? (int) round(($count / $max) * 100) : 0 ?>%"></span></td>
              <td class="n"><?= $count ?><span class="pct"><?= $share ?>%</span></td>
            </tr>
          <?php endforeach; ?>
        </table>
        <p class="q-foot">
          <?= $answered ?> har svaret<?= $filters === [] ? '' : ' i udsnittet' ?>
          <code><?= survey_e($column) ?></code>
        </p>
      </div>
    <?php endforeach; ?>
  <?php endforeach; ?>

  <h2>Fritekst</h2>
  <?php
    $anyText = false;
    foreach (SURVEY_FREE_TEXT as $column => $label) :
        $quotes = [];
        foreach ($rows as $row) {
            $value = trim((string) ($row[$column] ?? ''));
            if ($value !== '') {
                $quotes[] = ['text' => $value, 'when' => $row['created_at'], 'track' => $row['track']];
            }
        }
        if ($quotes === []) {
            continue;
        }
        $anyText = true; ?>
    <div class="q">
      <h3><?= survey_e($label) ?> <code><?= survey_e($column) ?></code></h3>
      <?php foreach (array_slice($quotes, 0, 25) as $quote) : ?>
        <div class="quote" style="margin-top:10px">
          <p><?= survey_e($quote['text']) ?></p>
          <span><?= survey_e(survey_label('track', (string) $quote['track'])) ?> · <?= survey_e(survey_local_time($quote['when'])) ?></span>
        </div>
      <?php endforeach; ?>
    </div>
  <?php endforeach; ?>
  <?php if (!$anyText) : ?>
    <div class="empty">Ingen fritekstsvar endnu.</div>
  <?php endif; ?>

  <?php endif; ?>
  </main>
  </div>
  </div><!--/live-->
</div>
<script>
(function () {
  var live = document.getElementById('live');
  if (!live || !window.fetch || !window.history.pushState) return;

  // Type to narrow the filter list. Matching is on the dimension name, the
  // answer label and the stored value, so "gammeldags" and "ui-old" both land.
  // While searching, the questions hidden from the default list join in.
  function wireSearch(scope) {
    var box = scope.querySelector('.find');
    if (!box) return;
    var facets = scope.querySelector('.facets');

    function run() {
      var q = box.value.trim().toLowerCase();
      facets.classList.toggle('searching', q !== '');
      var shown = 0;
      facets.querySelectorAll('.facet').forEach(function (facet) {
        var any = false;
        facet.querySelectorAll('.opt').forEach(function (opt) {
          var hit = q === '' || opt.dataset.find.indexOf(q) !== -1;
          opt.style.display = hit ? '' : 'none';
          if (hit) any = true;
        });
        var show = q === '' ? !facet.classList.contains('extra') : any;
        facet.style.display = show ? '' : 'none';
        if (show) shown++;
      });
      facets.classList.toggle('none-found', shown === 0);
    }

    box.addEventListener('input', run);
    box.addEventListener('search', run);
    if (box.value.trim() !== '') run();
  }

  var busy = false;
  function go(url, push) {
    if (busy) return;
    busy = true;
    live.classList.add('is-busy');
    fetch(url + (url.indexOf('?') === -1 ? '?' : '&') + 'partial=1', { credentials: 'same-origin' })
      .then(function (r) { if (!r.ok) throw new Error(r.status); return r.text(); })
      .then(function (html) {
        var holder = document.createElement('div');
        holder.innerHTML = html;
        var fresh = holder.firstElementChild;
        if (!fresh) throw new Error('empty');
        var typed = live.querySelector('.find');
        var carry = typed ? typed.value : '';
        live.innerHTML = fresh.innerHTML;
        var box = live.querySelector('.find');
        if (box && carry) box.value = carry;
        if (push) history.pushState({}, '', url);
        wireSearch(live);
        if (box && carry) box.focus();
        busy = false;
        live.classList.remove('is-busy');
      })
      .catch(function () { window.location.href = url; });
  }

  // One listener for every filter link, including the ones swapped in later.
  document.addEventListener('click', function (e) {
    var link = e.target.closest('a[data-go]');
    if (!link || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
    e.preventDefault();
    go(link.getAttribute('href'), true);
  });

  window.addEventListener('popstate', function () { go(location.search || '?', false); });
  wireSearch(live);
})();
</script>
</body>
</html>
    <?php
    if ($partial) {
        $html = ob_get_clean();
        // Explicit markers, so the slice never depends on counting </div>s.
        $open = strpos($html, '<!--live-->');
        $close = strpos($html, '<!--/live-->');
        echo ($open === false || $close === false)
            ? $html
            : substr($html, $open + 11, $close - $open - 11);
    }
    exit;
}

if (!defined('SURVEY_NO_DISPATCH')) {
    survey_results_main();
}
