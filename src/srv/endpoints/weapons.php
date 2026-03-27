<?php
header('Content-Type: application/json');

// CORS
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type");

require_once 'db.php';

// --- QUERY PARAMS ---
$attribute = $_GET['attribute'] ?? null;
$range     = $_GET['range'] ?? null;
$burden    = $_GET['burden'] ?? null;
$tier      = $_GET['tier'] ?? null;
$slot      = $_GET['slot'] ?? null;

// --- BUILD WHERE ---
$where = [];
$params = [];

// ATTRIBUTE
if ($attribute) {
    $values = explode(',', $attribute);
    $placeholders = implode(',', array_fill(0, count($values), '?'));
    $where[] = "attribute IN ($placeholders)";
    $params = array_merge($params, $values);
}

// RANGE (mapuje sa na range_band v DB)
if ($range) {
    $values = explode(',', $range);
    $placeholders = implode(',', array_fill(0, count($values), '?'));
    $where[] = "range_band IN ($placeholders)";
    $params = array_merge($params, $values);
}

// BURDEN
if ($burden) {
    $values = explode(',', $burden);
    $placeholders = implode(',', array_fill(0, count($values), '?'));
    $where[] = "burden IN ($placeholders)";
    $params = array_merge($params, $values);
}

// TIER
if ($tier) {
    $values = explode(',', $tier);
    $placeholders = implode(',', array_fill(0, count($values), '?'));
    $where[] = "tier IN ($placeholders)";
    $params = array_merge($params, $values);
}

// SLOT
if ($slot) {
    $values = explode(',', $slot);
    $placeholders = implode(',', array_fill(0, count($values), '?'));
    $where[] = "slot IN ($placeholders)";
    $params = array_merge($params, $values);
}

// --- WHERE SQL ---
$whereSQL = count($where) ? 'WHERE ' . implode(' AND ', $where) : '';

// --- QUERY ---
$sql = "
    SELECT 
        id,
        name,
        description,
        attribute,
        range_band,
        damage,
        burden,
        tier,
        slot,
        ability,
        ability_description,
        modifiers
    FROM dh_weapons
    $whereSQL
    ORDER BY tier, name
";

$stmt = $pdo->prepare($sql);
$stmt->execute($params);

$weapons = [];

// --- FORMAT OUTPUT ---
while ($row = $stmt->fetch()) {
    $weapons[] = [
        'id' => $row['id'],
        'name' => $row['name'],
        'description' => $row['description'],
        'attribute' => $row['attribute'],
        'range' => $row['range_band'], // ?? mapovanie pre React
        'burden' => $row['burden'],
        'tier' => (int)$row['tier'],
        'slot' => $row['slot'],
        'damage' => $row['damage'] ? json_decode($row['damage'], true) : null,
        'modifiers' => $row['modifiers'] ? json_decode($row['modifiers'], true) : null,
        'ability' => $row['ability'],
        'abilityDescription' => $row['ability_description']
    ];
}

echo json_encode($weapons, JSON_PRETTY_PRINT);