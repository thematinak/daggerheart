<?php
header('Content-Type: application/json');

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once 'db.php';

$method = $_SERVER['REQUEST_METHOD'];

function decode_json_or_default($value, $default)
{
    if ($value === null || $value === '') {
        return $default;
    }

    $decoded = json_decode($value, true);
    return $decoded !== null ? $decoded : $default;
}

function map_weapon($row)
{
    return [
        'id' => $row['id'],
        'name' => $row['name'],
        'description' => $row['description'],
        'attribute' => $row['attribute'],
        'range' => $row['range_band'],
        'burden' => $row['burden'],
        'tier' => (int)$row['tier'],
        'slot' => $row['slot'],
        'damage' => decode_json_or_default($row['damage'], new stdClass()),
        'modifiers' => decode_json_or_default($row['modifiers'], new stdClass()),
        'ability' => $row['ability'],
        'abilityDescription' => $row['ability_description']
    ];
}

if ($method === 'GET') {
    $attribute = $_GET['attribute'] ?? null;
    $range = $_GET['range'] ?? null;
    $burden = $_GET['burden'] ?? null;
    $tier = $_GET['tier'] ?? null;
    $slot = $_GET['slot'] ?? null;

    $where = [];
    $params = [];

    if ($attribute) {
        $values = explode(',', $attribute);
        $placeholders = implode(',', array_fill(0, count($values), '?'));
        $where[] = "attribute IN ($placeholders)";
        $params = array_merge($params, $values);
    }

    if ($range) {
        $values = explode(',', $range);
        $placeholders = implode(',', array_fill(0, count($values), '?'));
        $where[] = "range_band IN ($placeholders)";
        $params = array_merge($params, $values);
    }

    if ($burden) {
        $values = explode(',', $burden);
        $placeholders = implode(',', array_fill(0, count($values), '?'));
        $where[] = "burden IN ($placeholders)";
        $params = array_merge($params, $values);
    }

    if ($tier) {
        $values = explode(',', $tier);
        $placeholders = implode(',', array_fill(0, count($values), '?'));
        $where[] = "tier IN ($placeholders)";
        $params = array_merge($params, $values);
    }

    if ($slot) {
        $values = explode(',', $slot);
        $placeholders = implode(',', array_fill(0, count($values), '?'));
        $where[] = "slot IN ($placeholders)";
        $params = array_merge($params, $values);
    }

    $whereSQL = count($where) ? 'WHERE ' . implode(' AND ', $where) : '';

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

    $weapons = array_map('map_weapon', $stmt->fetchAll(PDO::FETCH_ASSOC));
    echo json_encode($weapons, JSON_PRETTY_PRINT);
    exit;
}

if ($method === 'POST') {
    $body = json_decode(file_get_contents("php://input"), true);

    $id = trim($body['id'] ?? '');
    $name = trim($body['name'] ?? '');
    $description = isset($body['description']) ? trim((string)$body['description']) : null;
    $attribute = trim($body['attribute'] ?? '');
    $rangeBand = trim($body['range'] ?? '');
    $burden = $body['burden'] ?? '';
    $tier = isset($body['tier']) ? (int)$body['tier'] : null;
    $slot = $body['slot'] ?? '';
    $damage = $body['damage'] ?? new stdClass();
    $modifiers = $body['modifiers'] ?? new stdClass();
    $ability = isset($body['ability']) ? trim((string)$body['ability']) : null;
    $abilityDescription = isset($body['abilityDescription']) ? trim((string)$body['abilityDescription']) : null;

    if ($id === '' || $name === '' || $attribute === '' || $rangeBand === '' || $tier === null || $slot === '' || $burden === '') {
        http_response_code(400);
        echo json_encode(["error" => "id, name, attribute, range, burden, tier and slot are required"]);
        exit;
    }

    if (!in_array($burden, ['one-handed', 'two-handed'], true)) {
        http_response_code(400);
        echo json_encode(["error" => "burden must be one-handed or two-handed"]);
        exit;
    }

    if (!in_array($slot, ['primary', 'secondary'], true)) {
        http_response_code(400);
        echo json_encode(["error" => "slot must be primary or secondary"]);
        exit;
    }

    if ($tier < 1 || $tier > 4) {
        http_response_code(400);
        echo json_encode(["error" => "tier must be between 1 and 4"]);
        exit;
    }

    try {
        $stmt = $pdo->prepare("
            INSERT INTO dh_weapons (
                id, name, description, attribute, range_band, damage, burden, tier, slot, ability, ability_description, modifiers
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ");
        $stmt->execute([
            $id,
            $name,
            $description,
            $attribute,
            $rangeBand,
            json_encode($damage, JSON_UNESCAPED_UNICODE),
            $burden,
            $tier,
            $slot,
            $ability,
            $abilityDescription,
            json_encode($modifiers, JSON_UNESCAPED_UNICODE),
        ]);

        http_response_code(201);
        echo json_encode([
            "success" => true,
            "weapon" => [
                "id" => $id,
                "name" => $name,
                "description" => $description,
                "attribute" => $attribute,
                "range" => $rangeBand,
                "burden" => $burden,
                "tier" => $tier,
                "slot" => $slot,
                "damage" => $damage ?: new stdClass(),
                "modifiers" => $modifiers ?: new stdClass(),
                "ability" => $ability,
                "abilityDescription" => $abilityDescription,
            ]
        ], JSON_PRETTY_PRINT);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["error" => "Server error"]);
    }

    exit;
}

http_response_code(405);
echo json_encode(["error" => "Method not allowed"]);
