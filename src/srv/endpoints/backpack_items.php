<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

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

function map_backpack_item($row)
{
    return [
        "id" => $row["id"],
        "name" => $row["name"],
        "description" => $row["description"],
        "modifiers" => decode_json_or_default($row["modifiers"], new stdClass()),
        "roll" => (int)$row["roll"],
        "type" => $row["type"],
    ];
}

if ($method === 'GET') {
    try {
        $stmt = $pdo->query("
            SELECT id, name, description, modifiers, roll, type
            FROM dh_backpack_items
            ORDER BY name ASC
        ");

        $items = array_map('map_backpack_item', $stmt->fetchAll(PDO::FETCH_ASSOC));
        echo json_encode($items, JSON_PRETTY_PRINT);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["error" => "Server error"]);
    }

    exit;
}

if ($method === 'POST') {
    $body = json_decode(file_get_contents("php://input"), true);

    $id = trim($body['id'] ?? '');
    $name = trim($body['name'] ?? '');
    $description = isset($body['description']) ? trim((string)$body['description']) : null;
    $modifiers = $body['modifiers'] ?? new stdClass();
    $roll = isset($body['roll']) ? (int)$body['roll'] : null;
    $type = $body['type'] ?? 'loot';

    if ($id === '' || $name === '' || $roll === null) {
        http_response_code(400);
        echo json_encode(["error" => "id, name and roll are required"]);
        exit;
    }

    if (!in_array($type, ['loot', 'consumables'], true)) {
        http_response_code(400);
        echo json_encode(["error" => "type must be loot or consumables"]);
        exit;
    }

    try {
        $stmt = $pdo->prepare("
            INSERT INTO dh_backpack_items (id, name, description, modifiers, roll, type)
            VALUES (?, ?, ?, ?, ?, ?)
        ");
        $stmt->execute([
            $id,
            $name,
            $description,
            json_encode($modifiers, JSON_UNESCAPED_UNICODE),
            $roll,
            $type
        ]);

        http_response_code(201);
        echo json_encode([
            "success" => true,
            "item" => [
                "id" => $id,
                "name" => $name,
                "description" => $description,
                "modifiers" => $modifiers ?: new stdClass(),
                "roll" => $roll,
                "type" => $type,
            ]
        ], JSON_PRETTY_PRINT);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["error" => "Server error"]);
    }

    exit;
}

if ($method === 'DELETE') {
    $id = $_GET['id'] ?? null;

    if (!$id) {
        http_response_code(400);
        echo json_encode(["error" => "id is required"]);
        exit;
    }

    try {
        $stmt = $pdo->prepare("DELETE FROM dh_backpack_items WHERE id = ?");
        $stmt->execute([$id]);

        echo json_encode([
            "success" => true,
            "deletedId" => $id
        ]);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["error" => "Server error"]);
    }

    exit;
}

http_response_code(405);
echo json_encode(["error" => "Method not allowed"]);
