<?php

// --- CORS ---
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

// --- PREFLIGHT ---
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once 'db.php';

$method = $_SERVER['REQUEST_METHOD'];

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
        SELECT ch.*, c.name AS class_name
        FROM dh_character ch
        LEFT JOIN dh_classes c ON ch.class_id = c.id
        LEFT JOIN dh_ancestries a ON ch.ancestry_id = a.id
        LEFT JOIN dh_communities com ON ch.community_id = com.id
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
            "className" => $row["class_name"],
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
            "customAttributes" => $customAttributes
        ];
    }

    echo json_encode($characters, JSON_PRETTY_PRINT);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => "Server error"]);
}