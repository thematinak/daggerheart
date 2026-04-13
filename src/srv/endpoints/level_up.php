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

function json_error_response($statusCode, $message)
{
    http_response_code($statusCode);
    echo json_encode(["error" => $message]);
    exit;
}

function decode_json_assoc($value, $default = [])
{
    if ($value === null || $value === '') {
        return $default;
    }

    $decoded = json_decode($value, true);
    return is_array($decoded) ? $decoded : $default;
}

function require_string_value($value, $fieldName)
{
    if (!is_string($value) || trim($value) === '') {
        throw new Exception($fieldName . " is required");
    }

    return trim($value);
}

function require_int_value($value, $fieldName)
{
    if (!is_int($value) && !is_numeric($value)) {
        throw new Exception($fieldName . " must be an integer");
    }

    return (int)$value;
}

function clamp_proficiency($value)
{
    return max(1, min(15, (int)$value));
}

function get_tier_from_level($level)
{
    if ($level <= 1) {
        return 1;
    }

    if ($level <= 4) {
        return 2;
    }

    if ($level <= 7) {
        return 3;
    }

    return 4;
}

function get_tier_key($tier)
{
    return "tier" . (int)$tier;
}

function get_option_limits_for_tier($tier)
{
    if ($tier === 2) {
        return [
            "traitBoost" => 3,
            "hitPoint" => 2,
            "stress" => 2,
            "experienceBonus" => 1,
            "domainCard" => 1,
            "evasion" => 1,
        ];
    }

    if ($tier === 3) {
        return [
            "traitBoost" => 3,
            "hitPoint" => 2,
            "stress" => 2,
            "experienceBonus" => 1,
            "domainCard" => 1,
            "evasion" => 1,
            "subclass" => 2,
            "multiclass" => 2,
        ];
    }

    return [
        "traitBoost" => 3,
        "hitPoint" => 2,
        "stress" => 2,
        "experienceBonus" => 1,
        "domainCard" => 1,
        "evasion" => 1,
        "subclass" => 1,
        "multiclass" => 2,
        "proficiency" => 2,
    ];
}

function get_domain_cap_for_tier_option($tier, $targetLevel)
{
    if ($tier === 2) {
        return min(4, $targetLevel);
    }

    if ($tier === 3) {
        return min(7, $targetLevel);
    }

    return $targetLevel;
}

function get_mutable_block(&$array, $key)
{
    if (!isset($array[$key]) || !is_array($array[$key])) {
        $array[$key] = [];
    }

    return $array[$key];
}

function normalize_leveling_data($value)
{
    $decoded = decode_json_assoc($value, []);

    if (!isset($decoded["optionUses"]) || !is_array($decoded["optionUses"])) {
        $decoded["optionUses"] = [];
    }

    if (!isset($decoded["markedTraits"]) || !is_array($decoded["markedTraits"])) {
        $decoded["markedTraits"] = [];
    }

    if (!isset($decoded["multiclassBlocked"]) || !is_array($decoded["multiclassBlocked"])) {
        $decoded["multiclassBlocked"] = [];
    }

    if (!isset($decoded["blockedSubclassSlots"]) || !is_array($decoded["blockedSubclassSlots"])) {
        $decoded["blockedSubclassSlots"] = [];
    }

    if (!isset($decoded["subclassNotes"]) || !is_array($decoded["subclassNotes"])) {
        $decoded["subclassNotes"] = [];
    }

    if (!isset($decoded["multiclassChoices"]) || !is_array($decoded["multiclassChoices"])) {
        $decoded["multiclassChoices"] = [];
    }

    return $decoded;
}

function increment_option_use(&$levelingData, $tierKey, $optionId)
{
    if (!isset($levelingData["optionUses"][$tierKey]) || !is_array($levelingData["optionUses"][$tierKey])) {
        $levelingData["optionUses"][$tierKey] = [];
    }

    $current = isset($levelingData["optionUses"][$tierKey][$optionId]) ? (int)$levelingData["optionUses"][$tierKey][$optionId] : 0;
    $levelingData["optionUses"][$tierKey][$optionId] = $current + 1;
}

function get_option_use_count($levelingData, $tierKey, $optionId)
{
    return isset($levelingData["optionUses"][$tierKey][$optionId]) ? (int)$levelingData["optionUses"][$tierKey][$optionId] : 0;
}

function ensure_distinct_values($values, $fieldName)
{
    if (!is_array($values) || count($values) !== 2) {
        throw new Exception($fieldName . " must contain exactly two selections");
    }

    $normalized = array_values(array_map(function ($value) {
        return is_string($value) ? trim($value) : $value;
    }, $values));

    if ($normalized[0] === "" || $normalized[1] === "") {
        throw new Exception($fieldName . " contains an empty selection");
    }

    if ($normalized[0] === $normalized[1]) {
        throw new Exception($fieldName . " selections must be distinct");
    }

    return $normalized;
}

function find_domain_card(PDO $pdo, $cardId)
{
    $stmt = $pdo->prepare("
        SELECT id, domain_id, level
        FROM dh_domain_cards
        WHERE id = ?
        LIMIT 1
    ");
    $stmt->execute([$cardId]);
    return $stmt->fetch(PDO::FETCH_ASSOC) ?: null;
}

function get_class_domain_ids(PDO $pdo, $classId)
{
    $stmt = $pdo->prepare("
        SELECT domain_id
        FROM dh_class_domains
        WHERE class_id = ?
    ");
    $stmt->execute([$classId]);
    return array_values(array_map(function ($row) {
        return $row["domain_id"];
    }, $stmt->fetchAll(PDO::FETCH_ASSOC)));
}

$input = json_decode(file_get_contents("php://input"), true);

if (!is_array($input)) {
    json_error_response(400, "Invalid JSON");
}

try {
    $characterId = require_string_value($input["character_id"] ?? null, "character_id");
    $targetLevel = require_int_value($input["targetLevel"] ?? null, "targetLevel");
    $selectedAdvancements = $input["selectedAdvancements"] ?? null;
    $rewardDomainCardId = require_string_value($input["rewardDomainCardId"] ?? null, "rewardDomainCardId");
    $achievementExperience = $input["achievementExperience"] ?? null;

    if (!is_array($selectedAdvancements) || count($selectedAdvancements) !== 2) {
        throw new Exception("selectedAdvancements must contain exactly two choices");
    }

    $pdo->beginTransaction();

    $stmt = $pdo->prepare("
        SELECT id, class_id, level, proficiency, attributes, customAttributes, experiences, leveling_data
        FROM dh_character
        WHERE id = ?
        LIMIT 1
    ");
    $stmt->execute([$characterId]);
    $character = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$character) {
        throw new Exception("Character not found");
    }

    $currentLevel = (int)$character["level"];

    if ($currentLevel >= 10) {
        throw new Exception("Character is already at max level");
    }

    if ($targetLevel !== $currentLevel + 1) {
        throw new Exception("targetLevel must be exactly one level above the current level");
    }

    $targetTier = get_tier_from_level($targetLevel);
    $eligibleTiers = $targetTier >= 4 ? [2, 3, 4] : ($targetTier === 3 ? [2, 3] : ($targetTier === 2 ? [2] : []));

    if (count($eligibleTiers) === 0) {
        throw new Exception("No advancement tier is available for this level");
    }

    $attributes = decode_json_assoc($character["attributes"] ?? null, []);
    $customAttributes = decode_json_assoc($character["customAttributes"] ?? null, []);
    $experiences = decode_json_assoc($character["experiences"] ?? null, []);
    $levelingData = normalize_leveling_data($character["leveling_data"] ?? null);
    $proficiency = clamp_proficiency($character["proficiency"] ?? 1);
    $ownedDomainCardIds = [];

    $ownedCardsStmt = $pdo->prepare("
        SELECT domain_card_id
        FROM dh_character_domain_cards
        WHERE character_id = ?
    ");
    $ownedCardsStmt->execute([$characterId]);
    foreach ($ownedCardsStmt->fetchAll(PDO::FETCH_ASSOC) as $row) {
        $ownedDomainCardIds[] = (string)$row["domain_card_id"];
    }

    $classId = $character["class_id"] ?? null;
    if (!$classId) {
        throw new Exception("Character class is required for level up");
    }

    $accessibleDomainIds = get_class_domain_ids($pdo, $classId);

    if (count($accessibleDomainIds) === 0) {
        throw new Exception("Character class has no accessible domains configured");
    }

    if (in_array($targetLevel, [5, 8], true)) {
        $levelingData["markedTraits"] = [];
    }

    if (in_array($targetLevel, [2, 5, 8], true)) {
        if (!is_array($achievementExperience)) {
            throw new Exception("achievementExperience is required for this level");
        }

        $experiences[] = [
            "name" => isset($achievementExperience["name"]) ? trim((string)$achievementExperience["name"]) : "",
            "description" => isset($achievementExperience["description"]) ? trim((string)$achievementExperience["description"]) : "",
            "bonus" => 2,
        ];

        $proficiency = clamp_proficiency($proficiency + 1);
    }

    $newDomainCardIds = [];
    $pendingDomainCardIds = [$rewardDomainCardId];

    foreach ($selectedAdvancements as $selectionIndex => $selection) {
        if (!is_array($selection)) {
            throw new Exception("Each advancement selection must be an object");
        }

        $tier = require_int_value($selection["tier"] ?? null, "selectedAdvancements.tier");
        $optionId = require_string_value($selection["optionId"] ?? null, "selectedAdvancements.optionId");

        if (!in_array($tier, $eligibleTiers, true)) {
            throw new Exception("Advancement tier {$tier} is not available for this level");
        }

        $tierKey = get_tier_key($tier);
        $limits = get_option_limits_for_tier($tier);

        if (!isset($limits[$optionId])) {
            throw new Exception("Option '{$optionId}' is not available in tier {$tier}");
        }

        $usedCount = get_option_use_count($levelingData, $tierKey, $optionId);
        $blockedSubclassSlots = (int)($levelingData["blockedSubclassSlots"][$tierKey] ?? 0);

        if ($optionId === "subclass") {
            $effectiveLimit = max(0, $limits[$optionId] - $blockedSubclassSlots);
            if (!empty($levelingData["multiclassBlocked"][$tierKey])) {
                throw new Exception("Subclass upgrades are blocked for {$tierKey}");
            }
            if ($usedCount >= $effectiveLimit) {
                throw new Exception("No subclass upgrade slots remain for {$tierKey}");
            }
        } elseif ($optionId === "multiclass") {
            if (!empty($levelingData["multiclassBlocked"][$tierKey])) {
                throw new Exception("Multiclass is no longer available for {$tierKey}");
            }
            if ($usedCount >= 1) {
                throw new Exception("Multiclass can only be taken once per tier block");
            }
        } else {
            if ($usedCount >= $limits[$optionId]) {
                throw new Exception("No slots remain for option '{$optionId}' in {$tierKey}");
            }
        }

        if ($optionId === "traitBoost") {
            $traits = ensure_distinct_values($selection["traits"] ?? null, "traits");
            $markedTraits = array_values(array_unique(array_filter($levelingData["markedTraits"], "is_string")));

            foreach ($traits as $trait) {
                if (!array_key_exists($trait, $attributes) || !is_array($attributes[$trait])) {
                    throw new Exception("Trait '{$trait}' is not available on this character");
                }

                if (in_array($trait, $markedTraits, true)) {
                    throw new Exception("Trait '{$trait}' has already been marked");
                }
            }

            foreach ($traits as $trait) {
                $attributes[$trait]["value"] = ((int)$attributes[$trait]["value"]) + 1;
                $levelingData["markedTraits"][] = $trait;
            }

            $levelingData["markedTraits"] = array_values(array_unique($levelingData["markedTraits"]));
        } elseif ($optionId === "hitPoint") {
            $customAttributes["maxHp"] = ((int)($customAttributes["maxHp"] ?? 0)) + 1;
        } elseif ($optionId === "stress") {
            $customAttributes["maxStress"] = ((int)($customAttributes["maxStress"] ?? 0)) + 1;
        } elseif ($optionId === "experienceBonus") {
            $experienceIndexes = ensure_distinct_values($selection["experienceIndexes"] ?? null, "experienceIndexes");
            foreach ($experienceIndexes as $experienceIndex) {
                $numericIndex = (int)$experienceIndex;
                if (!isset($experiences[$numericIndex]) || !is_array($experiences[$numericIndex])) {
                    throw new Exception("Experience index {$numericIndex} is invalid");
                }

                $experiences[$numericIndex]["bonus"] = ((int)($experiences[$numericIndex]["bonus"] ?? 0)) + 1;
            }
        } elseif ($optionId === "domainCard") {
            $domainCardId = require_string_value($selection["domainCardId"] ?? null, "domainCardId");
            $pendingDomainCardIds[] = $domainCardId;
            $newDomainCardIds[] = [
                "id" => $domainCardId,
                "cap" => get_domain_cap_for_tier_option($tier, $targetLevel),
            ];
        } elseif ($optionId === "evasion") {
            $customAttributes["evasion"] = ((int)($customAttributes["evasion"] ?? 0)) + 1;
        } elseif ($optionId === "subclass") {
            $note = trim((string)($selection["subclassNote"] ?? ""));
            if ($note === "") {
                throw new Exception("subclassNote is required for subclass upgrades");
            }

            if (!isset($levelingData["subclassNotes"][$tierKey]) || !is_array($levelingData["subclassNotes"][$tierKey])) {
                $levelingData["subclassNotes"][$tierKey] = [];
            }

            $levelingData["subclassNotes"][$tierKey][] = $note;
            $levelingData["multiclassBlocked"][$tierKey] = true;

            if ($tier === 3) {
                $proficiency = clamp_proficiency($proficiency + 1);
            }
        } elseif ($optionId === "multiclass") {
            $multiclassClassId = require_string_value($selection["classId"] ?? null, "classId");
            if ($multiclassClassId === $classId) {
                throw new Exception("Multiclass must use a different class");
            }

            $classCheckStmt = $pdo->prepare("SELECT id FROM dh_classes WHERE id = ? LIMIT 1");
            $classCheckStmt->execute([$multiclassClassId]);
            if (!$classCheckStmt->fetch(PDO::FETCH_ASSOC)) {
                throw new Exception("Selected multiclass does not exist");
            }

            if (!isset($levelingData["multiclassChoices"][$tierKey]) || !is_array($levelingData["multiclassChoices"][$tierKey])) {
                $levelingData["multiclassChoices"][$tierKey] = [];
            }

            $levelingData["multiclassChoices"][$tierKey][] = $multiclassClassId;
            $levelingData["multiclassBlocked"][$tierKey] = true;
            $levelingData["blockedSubclassSlots"][$tierKey] = ((int)($levelingData["blockedSubclassSlots"][$tierKey] ?? 0)) + 1;
        } elseif ($optionId === "proficiency") {
            $proficiency = clamp_proficiency($proficiency + 1);
        }

        increment_option_use($levelingData, $tierKey, $optionId);
    }

    array_unshift($newDomainCardIds, [
        "id" => $rewardDomainCardId,
        "cap" => $targetLevel,
    ]);

    $reservedDomainCardIds = [];
    foreach ($newDomainCardIds as $domainSelection) {
        $domainCard = find_domain_card($pdo, $domainSelection["id"]);

        if (!$domainCard) {
            throw new Exception("Selected domain card '{$domainSelection["id"]}' was not found");
        }

        $domainCardId = (string)$domainCard["id"];
        $domainId = (string)$domainCard["domain_id"];
        $domainLevel = (int)$domainCard["level"];

        if (!in_array($domainId, $accessibleDomainIds, true)) {
            throw new Exception("Domain card '{$domainCardId}' is not from an accessible domain");
        }

        if ($domainLevel > (int)$domainSelection["cap"]) {
            throw new Exception("Domain card '{$domainCardId}' is above the allowed level cap");
        }

        if (in_array($domainCardId, $ownedDomainCardIds, true) || in_array($domainCardId, $reservedDomainCardIds, true)) {
            throw new Exception("Domain card '{$domainCardId}' is already owned or selected");
        }

        $reservedDomainCardIds[] = $domainCardId;
    }

    $updateStmt = $pdo->prepare("
        UPDATE dh_character
        SET
            level = ?,
            proficiency = ?,
            attributes = ?,
            customAttributes = ?,
            experiences = ?,
            leveling_data = ?
        WHERE id = ?
    ");

    $updateStmt->execute([
        $targetLevel,
        $proficiency,
        json_encode($attributes),
        json_encode($customAttributes),
        json_encode(array_values($experiences)),
        json_encode($levelingData),
        $characterId,
    ]);

    if (count($reservedDomainCardIds) > 0) {
        $insertDomainStmt = $pdo->prepare("
            INSERT INTO dh_character_domain_cards (character_id, domain_card_id)
            VALUES (?, ?)
        ");

        foreach ($reservedDomainCardIds as $domainCardId) {
            $insertDomainStmt->execute([$characterId, $domainCardId]);
        }
    }

    $pdo->commit();

    echo json_encode([
        "success" => true,
        "character_id" => $characterId,
        "level" => $targetLevel,
        "proficiency" => $proficiency,
    ]);
} catch (Exception $error) {
    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }

    json_error_response(400, $error->getMessage());
}
