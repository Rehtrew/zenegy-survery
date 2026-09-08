<?php
/**
 * Database credentials for the survey.
 *
 * The survey lives in a folder inside the WordPress public directory, so by
 * default it reuses the credentials WordPress already has instead of keeping a
 * second copy of them. Resolution order:
 *
 *   1. Environment variables (SURVEY_DB_NAME / SURVEY_DB_USER / …)
 *   2. A .env file next to this folder or at the site root (KEY=VALUE lines)
 *   3. wp-config.php, walking up from here — read, never executed
 *
 * Nothing here is ever sent to the browser.
 */

declare(strict_types=1);

function survey_env(string $key): ?string
{
    // Only an unset variable counts as missing — an empty value is a real one
    // (a local MySQL with no password, say), and silently skipping it would send
    // us looking for credentials somewhere the operator didn't intend.
    $value = getenv($key);
    return $value === false ? null : $value;
}

/** Minimal KEY=VALUE reader — enough for the .env files already on the site. */
function survey_read_env_file(string $path): array
{
    if (!is_readable($path)) {
        return [];
    }
    $values = [];
    foreach (file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES) as $line) {
        $line = trim($line);
        if ($line === '' || str_starts_with($line, '#')) {
            continue;
        }
        $parts = explode('=', $line, 2);
        if (count($parts) !== 2) {
            continue;
        }
        $values[trim($parts[0])] = trim($parts[1], " \t\"'");
    }
    return $values;
}

/** Pull DB_* constants out of wp-config.php by reading it, not including it. */
function survey_read_wp_config(): array
{
    $dir = __DIR__;
    for ($i = 0; $i < 6; $i++) {
        $candidate = $dir . '/wp-config.php';
        if (is_readable($candidate)) {
            $contents = (string) file_get_contents($candidate);
            $found = [];
            foreach (['DB_NAME', 'DB_USER', 'DB_PASSWORD', 'DB_HOST'] as $constant) {
                if (preg_match(
                    "/define\(\s*['\"]" . $constant . "['\"]\s*,\s*['\"](.*?)['\"]\s*\)/s",
                    $contents,
                    $matches
                )) {
                    $found[$constant] = $matches[1];
                }
            }
            return $found;
        }
        $parent = dirname($dir);
        if ($parent === $dir) {
            break;
        }
        $dir = $parent;
    }
    return [];
}

function survey_db_config(): array
{
    $envFile = array_merge(
        survey_read_env_file(dirname(__DIR__, 2) . '/.env'),
        survey_read_env_file(dirname(__DIR__) . '/.env'),
    );
    $wp = survey_read_wp_config();

    $pick = static function (string $surveyKey, string $wpKey) use ($envFile, $wp): ?string {
        return survey_env($surveyKey)
            ?? ($envFile[$surveyKey] ?? null)
            ?? ($envFile[$wpKey] ?? null)
            ?? ($wp[$wpKey] ?? null);
    };

    $host = $pick('SURVEY_DB_HOST', 'DB_HOST') ?? 'localhost';
    $port = '3306';
    // wp-config often stores host as "localhost:3306" or a socket path.
    if (str_contains($host, ':')) {
        [$host, $suffix] = explode(':', $host, 2);
        if (ctype_digit($suffix)) {
            $port = $suffix;
        }
    }

    return [
        'name' => $pick('SURVEY_DB_NAME', 'DB_NAME'),
        'user' => $pick('SURVEY_DB_USER', 'DB_USER'),
        'pass' => $pick('SURVEY_DB_PASSWORD', 'DB_PASSWORD'),
        'host' => $host,
        'port' => $port,
        // Both tables are prefixed so they can never be mistaken for WordPress's.
        'prefix' => $pick('SURVEY_TABLE_PREFIX', 'SURVEY_TABLE_PREFIX') ?? 'survey_',
    ];
}
