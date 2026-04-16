<?php
header('Content-Type: application/json');

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type");

require_once 'db.php';

function decode_json_or_default($value, $default)
{
    if ($value === null || $value === '') {
        return $default;
    }

    $decoded = json_decode($value, true);
    return $decoded !== null ? $decoded : $default;
}

$stmt = $pdo->prepare("
    SELECT id, name, description, modifiers
    FROM dh_conditions
    ORDER BY name ASC
");
$stmt->execute();

$conditions = [];

while ($row = $stmt->fetch()) {
    $conditions[] = [
        'id' => $row['id'],
        'name' => $row['name'],
        'description' => $row['description'],
        'modifiers' => decode_json_or_default($row['modifiers'] ?? null, new stdClass()),
    ];
}

echo json_encode($conditions, JSON_PRETTY_PRINT);
