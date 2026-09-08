<?php
/**
 * The survey's database access: a PDO connection to the site's MySQL, and one
 * prepared-statement insert. The survey only ever writes its own two tables —
 * nothing here reads or touches a wp_ table.
 */

declare(strict_types=1);

require_once __DIR__ . '/config.php';

function survey_pdo(): PDO
{
    static $pdo = null;
    if ($pdo instanceof PDO) {
        return $pdo;
    }
    $config = survey_db_config();
    foreach (['name', 'user'] as $required) {
        if (($config[$required] ?? null) === null || $config[$required] === '') {
            throw new RuntimeException('Database credentials are missing (' . $required . ')');
        }
    }
    // A blank password is unusual but valid; only the name and user are required.
    $config['pass'] ??= '';
    $dsn = sprintf(
        'mysql:host=%s;port=%s;dbname=%s;charset=utf8mb4',
        $config['host'],
        $config['port'],
        $config['name'],
    );
    $pdo = new PDO($dsn, $config['user'], $config['pass'], [
        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES   => false,
    ]);
    return $pdo;
}

function survey_table(string $name): string
{
    $prefix = survey_db_config()['prefix'];
    // Table names can't be bound as parameters, so make sure the prefix can only
    // ever be a plain identifier.
    if (!preg_match('/^[A-Za-z0-9_]*$/', $prefix)) {
        throw new RuntimeException('Invalid table prefix');
    }
    return $prefix . $name;
}

/**
 * @param string[] $columns whitelisted names from columns.php — never user input
 * @param array<int, string|int|bool> $values
 */
function survey_insert(string $table, array $columns, array $values): void
{
    $placeholders = implode(', ', array_fill(0, count($columns), '?'));
    $sql = sprintf(
        'INSERT INTO `%s` (`%s`) VALUES (%s)',
        survey_table($table),
        implode('`, `', $columns),
        $placeholders,
    );
    $statement = survey_pdo()->prepare($sql);
    foreach ($values as $index => $value) {
        $type = is_bool($value) ? PDO::PARAM_BOOL : (is_int($value) ? PDO::PARAM_INT : PDO::PARAM_STR);
        $statement->bindValue($index + 1, $value, $type);
    }
    $statement->execute();
}
