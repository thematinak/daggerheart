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

// --- QUERY PARAMS ---
if ($method === 'GET') {
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
            'modifiers' => decode_json_or_default($row['modifiers'], new stdClass()),
            'ability' => $row['ability'],
            'abilityDescription' => $row['abilityDescription']
        ];
    }

    echo json_encode($armor, JSON_PRETTY_PRINT);
    exit;
}

if ($method === 'POST') {
    $body = json_decode(file_get_contents("php://input"), true);

    $id = trim($body['id'] ?? '');
    $name = trim($body['name'] ?? '');
    $tier = isset($body['tier']) ? (int)$body['tier'] : null;
    $threshold1 = isset($body['threshold1']) ? (int)$body['threshold1'] : null;
    $threshold2 = isset($body['threshold2']) ? (int)$body['threshold2'] : null;
    $baseScore = isset($body['baseScore']) ? (int)$body['baseScore'] : null;
    $modifiers = $body['modifiers'] ?? new stdClass();
    $ability = isset($body['ability']) ? trim((string)$body['ability']) : null;
    $abilityDescription = isset($body['abilityDescription']) ? trim((string)$body['abilityDescription']) : null;

    if ($id === '' || $name === '' || $tier === null || $threshold1 === null || $threshold2 === null || $baseScore === null) {
        http_response_code(400);
        echo json_encode(["error" => "id, name, tier, threshold1, threshold2 and baseScore are required"]);
        exit;
    }

    if ($tier < 1 || $tier > 4) {
        http_response_code(400);
        echo json_encode(["error" => "tier must be between 1 and 4"]);
        exit;
    }

    try {
        $stmt = $pdo->prepare("
            INSERT INTO dh_armor (
                id, name, tier, threshold1, threshold2, baseScore, modifiers, ability, abilityDescription
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        ");
        $stmt->execute([
            $id,
            $name,
            $tier,
            $threshold1,
            $threshold2,
            $baseScore,
            json_encode($modifiers, JSON_UNESCAPED_UNICODE),
            $ability,
            $abilityDescription,
        ]);

        http_response_code(201);
        echo json_encode([
            "success" => true,
            "armor" => [
                "id" => $id,
                "name" => $name,
                "tier" => $tier,
                "threshold1" => $threshold1,
                "threshold2" => $threshold2,
                "baseScore" => $baseScore,
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
