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

/** Columns worth counting, in the order they're shown. */
const SURVEY_COUNTED = [
    'track', 'payroll_context', 'size',
    'c_client_count', 'c_payroll_systems', 'c_setup', 'c_data_collection', 'c_frustrations', 'c_switch_intent',
    'b_payroll_system', 'b_frustrations', 'b_barriers', 'b_switch_intent',
    'a_products', 'a_migration_from', 'a_satisfaction', 'a_best_thing',
    'e_payslip', 'e_pain_points', 'e_expenses', 'e_ai_trust',
    'ai_interest', 'accounting_system',
];

/** Free-text columns, newest first, so the actual wording gets read. */
const SURVEY_FREE_TEXT = [
    'a_satisfaction_text'     => 'Uddybning af tilfredshed',
    'a_best_thing_text'       => 'Største værdi — med egne ord',
    'a_improve_text'          => 'Hvad kan vi forbedre',
    'b_frustration_other'     => 'Andre frustrationer',
    'b_barrier_other'         => 'Andre barrierer',
    'b_payroll_other'         => 'Andet lønsystem',
    'c_frustration_other'     => 'Andre tidsrøvere (bureau)',
    'c_data_collection_other' => 'Anden dataindsamling',
    'c_payroll_system_other'  => 'Andet lønsystem (bureau)',
    'accounting_other'        => 'Andet regnskabssystem',
];

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
    $write(array_keys($rows[0]));
    foreach ($rows as $row) {
        $write(array_map(static fn ($v) => $v === null ? '' : (string) $v, $row));
    }
    exit;
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

    if (($_GET['format'] ?? '') === 'csv') {
        survey_send_csv($rows);
    }

    $total = count($rows);
    $nps = survey_nps($rows);
    $latest = $rows[0]['created_at'] ?? null;

    header('Content-Type: text/html; charset=utf-8');
    header('X-Robots-Tag: noindex, nofollow');
    ?>
<!doctype html>
<html lang="da">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<title>Svar — Lønmarkedsundersøgelsen 2026</title>
<style>
  :root { --ink:#14132b; --ink-2:#5b5b66; --ink-3:#8b88a5; --line:#e6e4ef; --bg:#fbfaff; --card:#fff; --accent:#6e30fd; --accent-soft:#efeafe; }
  * { box-sizing:border-box }
  body { margin:0; background:var(--bg); color:var(--ink);
         font:16px/1.6 -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
  .wrap { max-width:1000px; margin:0 auto; padding:48px 20px 80px; }
  h1 { font-size:32px; letter-spacing:-.02em; margin:0 0 8px }
  .sub { color:var(--ink-2); margin:0 0 28px }
  .cards { display:grid; grid-template-columns:repeat(auto-fit,minmax(150px,1fr)); gap:12px; margin-bottom:36px }
  .card { background:var(--card); border:1px solid var(--line); border-radius:14px; padding:18px 20px }
  .card b { display:block; font-size:30px; letter-spacing:-.02em; font-variant-numeric:tabular-nums }
  .card span { color:var(--ink-3); font-size:13px }
  h2 { font-size:13px; text-transform:uppercase; letter-spacing:.1em; color:var(--ink-3);
       border-bottom:1px solid var(--line); padding-bottom:10px; margin:36px 0 16px }
  .q { background:var(--card); border:1px solid var(--line); border-radius:14px; padding:18px 20px; margin-bottom:12px }
  .q h3 { font-size:17px; margin:0 0 2px; letter-spacing:-.01em }
  .q .asked { margin:0; color:var(--ink-2); font-size:14px }
  .q code { color:var(--ink-3); font-size:11.5px; font-family:ui-monospace, SFMono-Regular, Menlo, monospace }
  .q code.col { display:inline-block; margin-top:10px; background:#f5f3fb; border-radius:5px; padding:2px 7px }
  td.v code { display:block; margin-top:1px; opacity:.65 }
  .pct { display:inline-block; min-width:42px; text-align:right; color:var(--ink-3); font-size:13px }
  table { width:100%; border-collapse:collapse; margin-top:12px }
  td { padding:9px 0; border-top:1px solid #f2f0f8; vertical-align:middle }
  td.v { font-size:14.5px }
  td.n { text-align:right; width:104px; font-variant-numeric:tabular-nums; color:var(--ink-2); white-space:nowrap }
  td.bar { width:45% }
  .bar span { display:block; height:8px; border-radius:4px; background:var(--accent); opacity:.85 }
  .quote { background:var(--card); border:1px solid var(--line); border-left:3px solid var(--accent);
           border-radius:0 12px 12px 0; padding:12px 16px; margin-bottom:8px }
  .quote p { margin:0 0 4px; font-size:15px }
  .quote span { color:var(--ink-3); font-size:12.5px }
  .actions { display:flex; gap:10px; flex-wrap:wrap; margin-bottom:8px }
  .btn { display:inline-block; background:var(--accent); color:#fff; text-decoration:none;
         padding:10px 18px; border-radius:10px; font-size:14.5px; font-weight:500 }
  .btn.ghost { background:var(--accent-soft); color:#5a1fe0 }
  .empty { background:var(--card); border:1px dashed var(--line); border-radius:14px; padding:32px; text-align:center; color:var(--ink-2) }
</style>
</head>
<body>
<div class="wrap">
  <h1>Lønmarkedsundersøgelsen 2026</h1>
  <p class="sub">
    Svar opdateret live<?= $latest ? ' · seneste svar ' . survey_e($latest) : '' ?>.
    Kun synlig for indloggede i WordPress.
  </p>

  <div class="actions">
    <a class="btn" href="?format=csv">Hent alle svar som CSV</a>
    <a class="btn ghost" href="./">Åbn undersøgelsen</a>
  </div>

  <?php if ($total === 0) : ?>
    <div class="empty" style="margin-top:24px">
      Ingen svar endnu. Siden opdaterer sig selv, når det første svar lander.
    </div>
  <?php else : ?>

  <div class="cards">
    <div class="card"><b><?= $total ?></b><span>svar i alt</span></div>
    <?php foreach (survey_count($rows, 'track') as $track => $count) : ?>
      <div class="card"><b><?= $count ?></b><span><?= survey_e(survey_label('track', (string) $track)) ?></span></div>
    <?php endforeach; ?>
    <?php if ($nps) : ?>
      <div class="card"><b><?= $nps['score'] ?></b><span>NPS (<?= $nps['count'] ?> svar, snit <?= $nps['average'] ?>)</span></div>
    <?php endif; ?>
  </div>

  <h2>Svarfordeling</h2>
  <?php foreach (SURVEY_COUNTED as $column) :
      $counts = survey_count($rows, $column);
      if ($counts === []) {
          continue;
      }
      $max = max($counts); ?>
    <div class="q">
      <h3><?= survey_e(survey_heading($column, 'short')) ?></h3>
      <p class="asked"><?= survey_e(survey_heading($column, 'question')) ?></p>
      <table>
        <?php foreach ($counts as $value => $count) : ?>
          <tr>
            <td class="v">
              <?= survey_e(survey_label($column, (string) $value)) ?>
              <code><?= survey_e((string) $value) ?></code>
            </td>
            <td class="bar"><span style="width:<?= (int) round(($count / $max) * 100) ?>%"></span></td>
            <td class="n"><?= $count ?><span class="pct"><?= round(($count / $total) * 100) ?>%</span></td>
          </tr>
        <?php endforeach; ?>
      </table>
      <code class="col"><?= survey_e($column) ?></code>
    </div>
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
          <span><?= survey_e(survey_label('track', (string) $quote['track'])) ?> · <?= survey_e($quote['when']) ?></span>
        </div>
      <?php endforeach; ?>
    </div>
  <?php endforeach; ?>
  <?php if (!$anyText) : ?>
    <div class="empty">Ingen fritekstsvar endnu.</div>
  <?php endif; ?>

  <?php endif; ?>
</div>
</body>
</html>
    <?php
    exit;
}

if (!defined('SURVEY_NO_DISPATCH')) {
    survey_results_main();
}
