<?php
/**
 * Shared request/response plumbing for the two endpoints: JSON in, JSON out,
 * POST only, and a light per-IP rate limit.
 */

declare(strict_types=1);

function survey_json(int $status, array $body): never
{
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    header('Cache-Control: no-store');
    echo json_encode($body, JSON_UNESCAPED_UNICODE);
    exit;
}

/** Decoded POST body, or a 400 response if the request isn't usable. */
function survey_read_body(): array
{
    if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
        header('Allow: POST');
        survey_json(405, ['error' => 'Kun POST er tilladt']);
    }
    $raw = file_get_contents('php://input');
    if ($raw === false || strlen($raw) > 64 * 1024) {
        survey_json(413, ['error' => 'Body er for stort']);
    }
    $decoded = json_decode($raw, true);
    if (!is_array($decoded)) {
        survey_json(400, ['error' => 'Body skal være et JSON-objekt']);
    }
    return $decoded;
}

/**
 * Blunt a script without adding infrastructure: count recent hits per IP in a
 * temp file. Not a security control — the honeypot and timing checks in the
 * client catch the lazy bots, and this catches the impatient ones.
 */
function survey_rate_limit(string $bucket, int $maxPerHour): void
{
    $ip = $_SERVER['HTTP_X_FORWARDED_FOR'] ?? $_SERVER['REMOTE_ADDR'] ?? '0.0.0.0';
    $ip = trim(explode(',', $ip)[0]);
    $file = sys_get_temp_dir() . '/survey_rl_' . $bucket . '_' . sha1($ip) . '.json';
    $now = time();
    $hits = [];
    if (is_readable($file)) {
        $decoded = json_decode((string) file_get_contents($file), true);
        if (is_array($decoded)) {
            $hits = array_values(array_filter($decoded, static fn ($t) => is_int($t) && $now - $t < 3600));
        }
    }
    if (count($hits) >= $maxPerHour) {
        survey_json(429, ['error' => 'For mange forsøg. Prøv igen senere.']);
    }
    $hits[] = $now;
    @file_put_contents($file, json_encode($hits), LOCK_EX);
}
