<?php

// --- CORS ---
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, DELETE, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

// --- PREFLIGHT ---
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once 'db.php';

$method = $_SERVER['REQUEST_METHOD'];

function decode_json_object($value)
{
    if ($value === null || $value === '') {
        return [];
    }

    $decoded = json_decode($value, true);
    return is_array($decoded) ? $decoded : [];
}

function json_error_response($statusCode, $message)
{
    http_response_code($statusCode);
    echo json_encode(["error" => $message]);
    exit;
}

function require_positive_integer($value, $fieldName)
{
    if (!is_int($value) || $value < 1) {
        throw new Exception($fieldName . " must be a positive integer");
    }

    return $value;
}

function require_string_value($value, $fieldName)
{
    if (!is_string($value) || trim($value) === '') {
        throw new Exception($fieldName . " is required");
    }

    return trim($value);
}

function update_current_stat(PDO $pdo, $characterId, $statName, $delta)
{
    $stmt = $pdo->prepare("SELECT current_stats FROM dh_character WHERE id = ? LIMIT 1");
    $stmt->execute([$characterId]);
    $row = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$row) {
        throw new Exception("Character not found");
    }

    $currentStats = decode_json_object($row['current_stats'] ?? null);
    $currentValue = isset($currentStats[$statName]) ? (int)$currentStats[$statName] : 0;
    $newValue = max(0, $currentValue + $delta);

    if ($statName === 'hope') {
        $newValue = min(6, $newValue);
    }

    $currentStats[$statName] = $newValue;

    $updateStmt = $pdo->prepare("UPDATE dh_character SET current_stats = ? WHERE id = ?");
    $updateStmt->execute([json_encode($currentStats), $characterId]);
}

function update_bank(PDO $pdo, $characterId, $delta)
{
    $stmt = $pdo->prepare("
        UPDATE dh_character
        SET bank = GREATEST(0, bank + ?)
        WHERE id = ?
    ");
    $stmt->execute([$delta, $characterId]);

    if ($stmt->rowCount() === 0) {
        throw new Exception("Character not found");
    }
}

function upsert_backpack_item(PDO $pdo, $characterId, $itemId, $delta)
{
    $selectStmt = $pdo->prepare("
        SELECT id, quantity
        FROM dh_backpack
        WHERE character_id = ? AND item_id = ?
        LIMIT 1
    ");
    $selectStmt->execute([$characterId, $itemId]);
    $existing = $selectStmt->fetch(PDO::FETCH_ASSOC);

    if ($delta > 0) {
        if ($existing) {
            $updateStmt = $pdo->prepare("UPDATE dh_backpack SET quantity = quantity + ? WHERE id = ?");
            $updateStmt->execute([$delta, $existing['id']]);
            return;
        }

        $insertStmt = $pdo->prepare("
            INSERT INTO dh_backpack (character_id, item_id, quantity)
            VALUES (?, ?, ?)
        ");
        $insertStmt->execute([$characterId, $itemId, $delta]);
        return;
    }

    if (!$existing) {
        return;
    }

    $newQuantity = (int)$existing['quantity'] + $delta;

    if ($newQuantity <= 0) {
        $deleteStmt = $pdo->prepare("DELETE FROM dh_backpack WHERE id = ?");
        $deleteStmt->execute([$existing['id']]);
        return;
    }

    $updateStmt = $pdo->prepare("UPDATE dh_backpack SET quantity = ? WHERE id = ?");
    $updateStmt->execute([$newQuantity, $existing['id']]);
}

function add_equipment(PDO $pdo, $characterId, $equipmentType, $itemId)
{
    $column = $equipmentType . "_id";
    $selectStmt = $pdo->prepare("
        SELECT id
        FROM dh_character_equipment
        WHERE character_id = ? AND {$column} = ?
        LIMIT 1
    ");
    $selectStmt->execute([$characterId, $itemId]);
    $existing = $selectStmt->fetch(PDO::FETCH_ASSOC);

    if ($existing) {
        return;
    }

    $insertStmt = $pdo->prepare("
        INSERT INTO dh_character_equipment (character_id, weapon_id, armor_id, is_equipped)
        VALUES (?, ?, ?, 0)
    ");
    $insertStmt->execute([
        $characterId,
        $equipmentType === 'weapon' ? $itemId : null,
        $equipmentType === 'armor' ? $itemId : null,
    ]);
}

function remove_equipment(PDO $pdo, $characterId, $equipmentType, $itemId)
{
    $column = $equipmentType . "_id";
    $deleteStmt = $pdo->prepare("
        DELETE FROM dh_character_equipment
        WHERE character_id = ? AND {$column} = ?
    ");
    $deleteStmt->execute([$characterId, $itemId]);
}

function equip_item(PDO $pdo, $characterId, $equipmentType, $itemId)
{
    $column = $equipmentType . "_id";

    $selectStmt = $pdo->prepare("
        SELECT id
        FROM dh_character_equipment
        WHERE character_id = ? AND {$column} = ?
        LIMIT 1
    ");
    $selectStmt->execute([$characterId, $itemId]);
    $existing = $selectStmt->fetch(PDO::FETCH_ASSOC);

    if (!$existing) {
        add_equipment($pdo, $characterId, $equipmentType, $itemId);
        $selectStmt->execute([$characterId, $itemId]);
        $existing = $selectStmt->fetch(PDO::FETCH_ASSOC);
    }

    if (!$existing) {
        throw new Exception("Equipment could not be equipped");
    }

    if ($equipmentType === 'armor') {
        $resetStmt = $pdo->prepare("
            UPDATE dh_character_equipment
            SET is_equipped = 0
            WHERE character_id = ? AND armor_id IS NOT NULL
        ");
        $resetStmt->execute([$characterId]);
    }

    $equipStmt = $pdo->prepare("UPDATE dh_character_equipment SET is_equipped = 1 WHERE id = ?");
    $equipStmt->execute([$existing['id']]);

    if ($equipmentType === 'weapon') {
        $equippedStmt = $pdo->prepare("
            SELECT id
            FROM dh_character_equipment
            WHERE character_id = ? AND weapon_id IS NOT NULL AND is_equipped = 1
            ORDER BY CASE WHEN id = ? THEN 0 ELSE 1 END, id ASC
        ");
        $equippedStmt->execute([$characterId, $existing['id']]);
        $equippedIds = array_map('intval', array_column($equippedStmt->fetchAll(PDO::FETCH_ASSOC), 'id'));

        if (count($equippedIds) > 2) {
            $idsToUnequip = array_slice($equippedIds, 2);
            $placeholders = implode(',', array_fill(0, count($idsToUnequip), '?'));
            $unequipStmt = $pdo->prepare("
                UPDATE dh_character_equipment
                SET is_equipped = 0
                WHERE id IN ({$placeholders})
            ");
            $unequipStmt->execute($idsToUnequip);
        }
    }
}

function apply_command(PDO $pdo, $characterId, $command)
{
    if (!is_array($command)) {
        throw new Exception("Each command must be an object");
    }

    $action = require_string_value($command['action'] ?? null, 'action');
    $target = require_string_value($command['target'] ?? null, 'target');
    $hasId = array_key_exists('id', $command);
    $hasValue = array_key_exists('value', $command);

    if (
        in_array($target, ['health', 'stress', 'hope', 'bank'], true) ||
        ($target === 'armor' && $hasValue)
    ) {
        if (!in_array($action, ['add', 'remove'], true)) {
            throw new Exception("Unsupported action '{$action}' for target '{$target}'");
        }

        $amount = require_positive_integer($command['value'] ?? null, 'value');
        $delta = $action === 'add' ? $amount : -$amount;

        if ($target === 'bank') {
            update_bank($pdo, $characterId, $delta);
            return;
        }

        $statMap = [
            'health' => 'hp',
            'armor' => 'armor',
            'stress' => 'stress',
            'hope' => 'hope',
        ];

        update_current_stat($pdo, $characterId, $statMap[$target], $delta);
        return;
    }

    if ($target === 'item') {
        if (!in_array($action, ['add', 'remove'], true)) {
            throw new Exception("Unsupported action '{$action}' for target 'item'");
        }

        $itemId = require_string_value($command['id'] ?? null, 'id');
        $quantity = require_positive_integer($command['quantity'] ?? null, 'quantity');
        $delta = $action === 'add' ? $quantity : -$quantity;

        upsert_backpack_item($pdo, $characterId, $itemId, $delta);
        return;
    }

    if (
        ($target === 'weapon' && $hasId) ||
        ($target === 'armor' && $hasId)
    ) {
        $equipmentType = $target === 'weapon' ? 'weapon' : 'armor';
        $itemId = require_string_value($command['id'] ?? null, 'id');

        if ($action === 'add') {
            add_equipment($pdo, $characterId, $equipmentType, $itemId);
            return;
        }

        if ($action === 'remove') {
            remove_equipment($pdo, $characterId, $equipmentType, $itemId);
            return;
        }

        if ($action === 'equip') {
            equip_item($pdo, $characterId, $equipmentType, $itemId);
            return;
        }

        throw new Exception("Unsupported action '{$action}' for target '{$target}'");
    }

    throw new Exception("Unsupported target '{$target}'");
}

// ==========================
// POST COMMANDS
// ==========================
if ($method === 'POST') {
    $input = json_decode(file_get_contents("php://input"), true);

    if (!is_array($input)) {
        json_error_response(400, "Invalid JSON");
    }

    $characterId = $input['character_id'] ?? $input['id'] ?? null;
    $commands = $input['commands'] ?? null;

    if (!$characterId || !is_string($characterId)) {
        json_error_response(400, "character_id is required");
    }

    if (!is_array($commands)) {
        json_error_response(400, "commands must be an array");
    }

    try {
        $pdo->beginTransaction();

        $existsStmt = $pdo->prepare("SELECT id FROM dh_character WHERE id = ? LIMIT 1");
        $existsStmt->execute([$characterId]);

        if (!$existsStmt->fetch(PDO::FETCH_ASSOC)) {
            throw new Exception("Character not found");
        }

        foreach ($commands as $command) {
            apply_command($pdo, $characterId, $command);
        }

        $pdo->commit();

        echo json_encode([
            "success" => true,
            "character_id" => $characterId,
            "processedCommands" => count($commands),
        ]);
    } catch (Exception $e) {
        if ($pdo->inTransaction()) {
            $pdo->rollBack();
        }

        http_response_code(400);
        echo json_encode(["error" => $e->getMessage()]);
    }

    exit;
}

// ==========================
// DELETE CHARACTER
// ==========================
if ($method === 'DELETE') {

    $id = $_GET['id'] ?? null;

    if (!$id) {
        http_response_code(400);
        echo json_encode(["error" => "id is required"]);
        exit;
    }

    try {
        $stmt = $pdo->prepare("DELETE FROM dh_character WHERE id = ?");
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

// ==========================
// GET CHARACTERS
// ==========================
$userId = $_GET['user_id'] ?? null;

if (!$userId) {
    http_response_code(400);
    echo json_encode(["error" => "user_id is required"]);
    exit;
}

try {
    $stmt = $pdo->prepare("
        SELECT ch.*
        FROM dh_character ch
        WHERE ch.user_id = ?
        ORDER BY ch.name
    ");

    $stmt->execute([$userId]);

    $characters = [];

    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {

        $attributes = !empty($row['attributes'])
            ? json_decode($row['attributes'])
            : new stdClass();

        $customAttributes = !empty($row['customAttributes'])
            ? json_decode($row['customAttributes'])
            : new stdClass();

        $characters[] = [
            "id" => $row["id"],
            "userId" => (int)$row["user_id"],
            "level" => (int)$row["level"],

            "classId" => $row["class_id"],
            "specializationId" => $row["specialization_id"],
            "ancestryId" => $row["ancestry_id"],
            "communityId" => $row["community_id"],

            "bank" => (int)$row["bank"],

            "name" => $row["name"],
            "description" => $row["description"],

            "primaryExperience" => $row["primaryExperience"],
            "primaryExperienceDescription" => $row["primaryExperienceDescription"],

            "secondaryExperience" => $row["secondaryExperience"],
            "secondaryExperienceDescription" => $row["secondaryExperienceDescription"],

            "attributes" => $attributes,
            "customAttributes" => $customAttributes,
            "currentStats" => decode_json_object($row["current_stats"] ?? null)
        ];
    }

    echo json_encode($characters, JSON_PRETTY_PRINT);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => "Server error"]);
}
