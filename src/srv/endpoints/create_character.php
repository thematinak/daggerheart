<?php

header("Content-Type: application/json");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Origin: *");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["error" => "Method not allowed"]);
    exit;
}

require_once 'db.php';

$input = json_decode(file_get_contents("php://input"), true);

if (!$input) {
    http_response_code(400);
    echo json_encode(["error" => "Invalid JSON"]);
    exit;
}

function normalize_experiences($value)
{
    if (!is_array($value)) {
        return [];
    }

    $experiences = [];

    foreach ($value as $experience) {
        if (!is_array($experience)) {
            continue;
        }

        $experiences[] = [
            "name" => isset($experience["name"]) ? (string)$experience["name"] : "",
            "description" => isset($experience["description"]) ? (string)$experience["description"] : "",
            "bonus" => isset($experience["bonus"]) ? (int)$experience["bonus"] : 2,
        ];
    }

    return $experiences;
}

function normalize_proficiency($value)
{
    $proficiency = isset($value) ? (int)$value : 1;
    return max(1, min(15, $proficiency));
}

try {
    $pdo->beginTransaction();

    // =========================
    // VALIDÁCIA
    // =========================
    if (empty($input['user_id'])) {
        throw new Exception("Missing user_id");
    }

    if (empty($input['name'])) {
        throw new Exception("Missing name");
    }

    // =========================
    // CREATE CHARACTER ID
    // =========================
    $characterId = bin2hex(random_bytes(16));

    // =========================
    // INSERT CHARACTER
    // =========================
    $stmt = $pdo->prepare("
        INSERT INTO dh_character (
            id, user_id, level, proficiency,
            class_id, specialization_id,
            ancestry_id, community_id,
            bank,
            attributes, customAttributes, current_stats,
            name, description, experiences
        ) VALUES (
            ?, ?, ?, ?,
            ?, ?, ?, ?,
            ?,
            ?, ?, ?,
            ?, ?, ?
        )
    ");

    $stmt->execute([
        $characterId,
        $input['user_id'],
        $input['level'] ?? 1,
        normalize_proficiency($input['proficiency'] ?? 1),
        $input['class']['id'] ?? null,
        $input['specialization']['id'] ?? null,
        $input['ancestry']['id'] ?? null,
        $input['community']['id'] ?? null,
        $input['bank'] ?? 0,
        json_encode($input['attributes'] ?? []),
        json_encode($input['customAttributes'] ?? []),
        json_encode($input['currentStats'] ?? []),
        $input['name'],
        $input['description'] ?? null,
        json_encode(normalize_experiences($input['experiences'] ?? []))
    ]);

    // =========================
    // BACKPACK
    // =========================
    if (!empty($input['backpack'])) {
        $stmt = $pdo->prepare("
            INSERT INTO dh_backpack (character_id, item_id, quantity)
            VALUES (?, ?, ?)
        ");

        foreach ($input['backpack'] as $item) {
            $stmt->execute([
                $characterId,
                $item['id'],
                1
            ]);
        }
    }

    // =========================
    // DOMAIN CARDS
    // =========================
    if (!empty($input['domainCards'])) {
        $stmt = $pdo->prepare("
            INSERT INTO dh_character_domain_cards (character_id, domain_card_id)
            VALUES (?, ?)
        ");

        foreach ($input['domainCards'] as $card) {
            $stmt->execute([
                $characterId,
                $card['id'] // domain_card_id (VARCHAR)
            ]);
        }
    }

    // =========================
    // EQUIPMENT
    // =========================
    $stmt = $pdo->prepare("
        INSERT INTO dh_character_equipment (
            character_id, weapon_id, armor_id, is_equipped
        ) VALUES (?, ?, ?, ?)
    ");

    // primary weapon
    if (!empty($input['weapons']['primary'])) {
        $stmt->execute([
            $characterId,
            $input['weapons']['primary']['id'],
            null,
            1
        ]);
    }

    // secondary weapon
    if (!empty($input['weapons']['secondary'])) {
        $stmt->execute([
            $characterId,
            $input['weapons']['secondary']['id'],
            null,
            1
        ]);
    }

    // armor (equipped)
    if (!empty($input['armor'])) {
        $stmt->execute([
            $characterId,
            null,
            $input['armor']['id'],
            1
        ]);
    }

    // weapon inventory
    if (!empty($input['weaponInventory'])) {
        foreach ($input['weaponInventory'] as $weapon) {
            $stmt->execute([
                $characterId,
                $weapon['id'],
                null,
                0
            ]);
        }
    }

    // armor inventory
    if (!empty($input['armorInventory'])) {
        foreach ($input['armorInventory'] as $armor) {
            $stmt->execute([
                $characterId,
                null,
                $armor['id'],
                0
            ]);
        }
    }

    $pdo->commit();

    echo json_encode([
        "success" => true,
        "character_id" => $characterId
    ]);

} catch (Exception $e) {
    $pdo->rollBack();

    http_response_code(500);
    echo json_encode([
        "error" => $e->getMessage()
    ]);
}
