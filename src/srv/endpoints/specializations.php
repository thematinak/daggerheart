<?php
header('Content-Type: application/json');

// CORS
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type");

// DB connection
require_once 'db.php';

try {
    $classId = $_GET['class_id'] ?? null;

    $sql = "
        SELECT 
            s.id AS spec_id,
            s.name AS spec_name,
            s.description AS spec_description,
            s.class_id AS class_id,

            sm.id AS mod_id,
            sm.name AS mod_name,
            sm.description AS mod_description,
            sm.modifiers AS mod_modifiers

        FROM dh_specializations s
        LEFT JOIN dh_specialization_modifications sm 
            ON sm.specialization_id = s.id
    ";

    if ($classId) {
        $sql .= " WHERE s.class_id = :class_id ";
    }

    $sql .= " ORDER BY s.name, sm.name ";

    $stmt = $pdo->prepare($sql);

    if ($classId) {
        $stmt->execute(['class_id' => $classId]);
    } else {
        $stmt->execute();
    }

    $specializations = [];

    while ($row = $stmt->fetch()) {
        $specId = $row['spec_id'];

        // init specialization (SpecializationsItem)
        if (!isset($specializations[$specId])) {
            $specializations[$specId] = [
                'id' => $specId,
                'name' => $row['spec_name'],
                'classId' => $row['class_id'],
                'description' => $row['spec_description'],
                'modifications' => []
            ];
        }

        // add modification (SpecialModifications)
        if (!empty($row['mod_id'])) {
            $modifiers = !empty($row['mod_modifiers'])
                ? json_decode($row['mod_modifiers'])
                : new stdClass();

            $specializations[$specId]['modifications'][] = [
                'id' => $row['mod_id'],
                'name' => $row['mod_name'],
                'description' => $row['mod_description'],
                'modifiers' => $modifiers
            ];
        }
    }

    echo json_encode(array_values($specializations), JSON_PRETTY_PRINT);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'error' => 'Failed to fetch specializations',
        'message' => $e->getMessage()
    ]);
}