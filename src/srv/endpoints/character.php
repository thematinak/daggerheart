<?php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

require_once 'db.php';

// --- INPUT ---
$userId = $_GET['user_id'] ?? null;

if (!$userId) {
    http_response_code(400);
    echo json_encode(["error" => "user_id is required"]);
    exit;
}

try {
    // --- QUERY ---
    $stmt = $pdo->prepare("
        SELECT ch.*, c.name AS class_name
        FROM dh_character as ch
            join dh_classes as c on ch.user_id = 1
        WHERE c.id = ch.class_id
        ORDER BY ch.name;
    ");
    $stmt->execute([$userId]);

    $characters = [];

    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {

        // --- JSON polia ---
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
    echo json_encode([
        "error" => "Server error"
    ]);
}