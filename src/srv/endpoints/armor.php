<?php
header('Content-Type: application/json');

// CORS
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type");

require_once 'db.php';

// --- QUERY PARAMS ---
$name      = $_GET['name'] ?? null;
$tier      = $_GET['tier'] ?? null;
$baseScore = $_GET['baseScore'] ?? null;

// --- BUILD WHERE ---
$where = [];
$params = [];

// NAME (search)
if ($name) {
    $where[] = "name LIKE ?";
    $params[] = "%" . $name . "%";
}

// TIER
if ($tier) {
    $values = explode(',', $tier);
    $placeholders = implode(',', array_fill(0, count($values), '?'));
    $where[] = "tier IN ($placeholders)";
    $params = array_merge($params, $values);
}

// BASE SCORE (mapovanie weight › čísla)
if ($baseScore) {
    if ($baseScore === 'light') {
        $where[] = "baseScore BETWEEN 0 AND 2";
    } elseif ($baseScore === 'medium') {
        $where[] = "baseScore BETWEEN 3 AND 4";
    } elseif ($baseScore === 'heavy') {
        $where[] = "baseScore >= 5";
    }
}

// --- WHERE SQL ---
$whereSQL = count($where) ? 'WHERE ' . implode(' AND ', $where) : '';

// --- QUERY ---
$sql = "
    SELECT 
        id,
        name,
        tier,
        threshold1,
        threshold2,
        baseScore,
        modifiers,
        ability,
        abilityDescription
    FROM dh_armor
    $whereSQL
    ORDER BY tier, name
";

$stmt = $pdo->prepare($sql);
$stmt->execute($params);

$armor = [];

// --- FORMAT OUTPUT ---
while ($row = $stmt->fetch()) {
    $armor[] = [
        'id' => $row['id'],
        'name' => $row['name'],
        'tier' => (int)$row['tier'],
        'threshold1' => (int)$row['threshold1'],
        'threshold2' => (int)$row['threshold2'],
        'baseScore' => (int)$row['baseScore'],
        'modifiers' => json_decode($row['modifiers'], true),
        'ability' => $row['ability'],
        'abilityDescription' => $row['abilityDescription']
    ];
}

echo json_encode($armor, JSON_PRETTY_PRINT);