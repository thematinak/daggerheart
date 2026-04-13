<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once 'db.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(["error" => "Method not allowed"]);
    exit;
}

$characterId = $_GET['id'] ?? null;

if (!$characterId) {
    http_response_code(400);
    echo json_encode(["error" => "id is required"]);
    exit;
}

function decode_json_or_default($value, $default)
{
    if ($value === null || $value === '') {
        return $default;
    }

    $decoded = json_decode($value, true);
    return $decoded !== null ? $decoded : $default;
}

function normalize_proficiency($value)
{
    $proficiency = isset($value) ? (int)$value : 1;
    return max(1, min(15, $proficiency));
}

function decode_character_experiences($character)
{
    $decoded = decode_json_or_default($character["experiences"] ?? null, null);

    if (is_array($decoded)) {
        return array_values(array_map(function ($experience) {
            return [
                "name" => isset($experience["name"]) ? (string)$experience["name"] : "",
                "description" => isset($experience["description"]) ? (string)$experience["description"] : "",
                "bonus" => isset($experience["bonus"]) ? (int)$experience["bonus"] : 2,
            ];
        }, array_filter($decoded, function ($experience) {
            return is_array($experience);
        })));
    }

    return array_values(array_filter([
        [
            "name" => $character["primaryExperience"] ?? "",
            "description" => $character["primaryExperienceDescription"] ?? "",
            "bonus" => 2,
        ],
        [
            "name" => $character["secondaryExperience"] ?? "",
            "description" => $character["secondaryExperienceDescription"] ?? "",
            "bonus" => 2,
        ],
    ], function ($experience) {
        return $experience["name"] !== "" || $experience["description"] !== "";
    }));
}

function map_weapon_row($row)
{
    return [
        "id" => $row["id"],
        "name" => $row["name"],
        "description" => $row["description"],
        "attribute" => $row["attribute"],
        "range" => $row["range_band"],
        "damage" => decode_json_or_default($row["damage"], new stdClass()),
        "burden" => $row["burden"],
        "tier" => (int)$row["tier"],
        "slot" => $row["slot"],
        "ability" => $row["ability"],
        "abilityDescription" => $row["ability_description"],
        "modifiers" => decode_json_or_default($row["modifiers"], new stdClass()),
    ];
}

function map_armor_row($row)
{
    return [
        "id" => $row["id"],
        "name" => $row["name"],
        "tier" => (int)$row["tier"],
        "threshold1" => (int)$row["threshold1"],
        "threshold2" => (int)$row["threshold2"],
        "baseScore" => (int)$row["baseScore"],
        "modifiers" => decode_json_or_default($row["modifiers"], new stdClass()),
        "ability" => $row["ability"],
        "abilityDescription" => $row["abilityDescription"],
    ];
}

try {
    $stmt = $pdo->prepare("
        SELECT
            ch.*,
            cls.name AS class_name,
            cls.description AS class_description,
            cls.base_hp AS class_base_hp,
            cls.base_evasion AS class_base_evasion,
            cls.modifiers AS class_modifiers,
            cls.hope_feature AS class_hope_feature,
            cls.hope_feature_description AS class_hope_feature_description,
            cls.class_item AS class_item,
            spec.name AS specialization_name,
            spec.description AS specialization_description,
            anc.name AS ancestry_name,
            anc.description AS ancestry_description,
            anc.modifiers AS ancestry_modifiers,
            com.name AS community_name,
            com.description AS community_description,
            com.modifiers AS community_modifiers
        FROM dh_character ch
        LEFT JOIN dh_classes cls ON cls.id = ch.class_id
        LEFT JOIN dh_specializations spec ON spec.id = ch.specialization_id
        LEFT JOIN dh_ancestries anc ON anc.id = ch.ancestry_id
        LEFT JOIN dh_communities com ON com.id = ch.community_id
        WHERE ch.id = ?
        LIMIT 1
    ");
    $stmt->execute([$characterId]);
    $character = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$character) {
        http_response_code(404);
        echo json_encode(["error" => "Character not found"]);
        exit;
    }

    $weaponStmt = $pdo->prepare("
        SELECT
            ce.id AS equipment_id,
            ce.is_equipped,
            w.*
        FROM dh_character_equipment ce
        INNER JOIN dh_weapons w ON w.id = ce.weapon_id
        WHERE ce.character_id = ?
        ORDER BY ce.is_equipped DESC, ce.id ASC
    ");
    $weaponStmt->execute([$characterId]);
    $weaponRows = $weaponStmt->fetchAll(PDO::FETCH_ASSOC);

    $primaryWeapon = null;
    $secondaryWeapon = null;
    $weaponInventory = [];

    foreach ($weaponRows as $row) {
        $mapped = map_weapon_row($row);
        if ((int)$row["is_equipped"] === 1) {
            if ($mapped["slot"] === "primary" && $primaryWeapon === null) {
                $primaryWeapon = $mapped;
                continue;
            }

            if ($mapped["slot"] === "secondary" && $secondaryWeapon === null) {
                $secondaryWeapon = $mapped;
                continue;
            }
        } else {
            $weaponInventory[] = $mapped;
            continue;
        }

        $weaponInventory[] = $mapped;
    }

    $armorStmt = $pdo->prepare("
        SELECT
            ce.id AS equipment_id,
            ce.is_equipped,
            a.*
        FROM dh_character_equipment ce
        INNER JOIN dh_armor a ON a.id = ce.armor_id
        WHERE ce.character_id = ?
        ORDER BY ce.is_equipped DESC, ce.id ASC
    ");
    $armorStmt->execute([$characterId]);
    $armorRows = $armorStmt->fetchAll(PDO::FETCH_ASSOC);

    $equippedArmor = null;
    $armorInventory = [];

    foreach ($armorRows as $row) {
        $mapped = map_armor_row($row);
        if ((int)$row["is_equipped"] === 1 && $equippedArmor === null) {
            $equippedArmor = $mapped;
        } else {
            $armorInventory[] = $mapped;
        }
    }

    $domainStmt = $pdo->prepare("
        SELECT
            dc.id,
            dc.domain_id,
            d.name AS domain_name,
            dc.name,
            dc.description,
            dc.level
        FROM dh_character_domain_cards cdc
        INNER JOIN dh_domain_cards dc ON dc.id = cdc.domain_card_id
        INNER JOIN dh_domains d ON d.id = dc.domain_id
        WHERE cdc.character_id = ?
        ORDER BY dc.level ASC, dc.name ASC
    ");
    $domainStmt->execute([$characterId]);
    $domainCards = array_map(function ($row) {
        return [
            "id" => (int)$row["id"],
            "domainId" => $row["domain_id"],
            "domainName" => $row["domain_name"],
            "name" => $row["name"],
            "description" => $row["description"],
            "level" => (int)$row["level"],
        ];
    }, $domainStmt->fetchAll(PDO::FETCH_ASSOC));

    $backpackStmt = $pdo->prepare("
        SELECT
            b.item_id,
            b.quantity,
            bi.name,
            bi.description,
            bi.modifiers,
            bi.roll,
            bi.type
        FROM dh_backpack b
        INNER JOIN dh_backpack_items bi ON bi.id = b.item_id
        WHERE b.character_id = ?
        ORDER BY bi.name ASC
    ");
    $backpackStmt->execute([$characterId]);
    $backpack = array_map(function ($row) {
        return [
            "id" => $row["item_id"],
            "name" => $row["name"],
            "description" => $row["description"],
            "modifiers" => decode_json_or_default($row["modifiers"], new stdClass()),
            "roll" => (int)$row["roll"],
            "type" => $row["type"],
            "quantity" => (int)$row["quantity"],
        ];
    }, $backpackStmt->fetchAll(PDO::FETCH_ASSOC));

    $response = [
        "id" => $character["id"],
        "userId" => (int)$character["user_id"],
        "level" => (int)$character["level"],
        "proficiency" => normalize_proficiency($character["proficiency"] ?? 1),
        "bank" => (int)$character["bank"],
        "name" => $character["name"],
        "description" => $character["description"],
        "class" => $character["class_id"] ? [
            "id" => $character["class_id"],
            "name" => $character["class_name"],
            "description" => $character["class_description"],
            "baseHp" => (int)$character["class_base_hp"],
            "baseEvasion" => (int)$character["class_base_evasion"],
            "modifiers" => decode_json_or_default($character["class_modifiers"], new stdClass()),
            "hopeFeature" => $character["class_hope_feature"],
            "hopeFeatureDescription" => $character["class_hope_feature_description"],
            "classItem" => $character["class_item"],
        ] : null,
        "specialization" => $character["specialization_id"] ? [
            "id" => $character["specialization_id"],
            "name" => $character["specialization_name"],
            "description" => $character["specialization_description"],
        ] : null,
        "ancestry" => $character["ancestry_id"] ? [
            "id" => $character["ancestry_id"],
            "name" => $character["ancestry_name"],
            "description" => $character["ancestry_description"],
            "modifiers" => decode_json_or_default($character["ancestry_modifiers"], new stdClass()),
        ] : null,
        "community" => $character["community_id"] ? [
            "id" => $character["community_id"],
            "name" => $character["community_name"],
            "description" => $character["community_description"],
            "modifiers" => decode_json_or_default($character["community_modifiers"], new stdClass()),
        ] : null,
        "attributes" => decode_json_or_default($character["attributes"], new stdClass()),
        "customAttributes" => decode_json_or_default($character["customAttributes"], new stdClass()),
        "currentStats" => decode_json_or_default($character["current_stats"], new stdClass()),
        "experiences" => decode_character_experiences($character),
        "weapons" => [
            "primary" => $primaryWeapon,
            "secondary" => $secondaryWeapon,
        ],
        "armor" => $equippedArmor,
        "weaponInventory" => $weaponInventory,
        "armorInventory" => $armorInventory,
        "domainCards" => $domainCards,
        "backpack" => $backpack,
    ];

    echo json_encode($response, JSON_PRETTY_PRINT);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => "Server error"]);
}
