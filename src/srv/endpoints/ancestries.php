<?php
header('Content-Type: application/json');

// CORS
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type");

// DB connection
require_once 'db.php';

try {
    $sql = "
        SELECT 
            a.id AS ancestry_id,
            a.name AS ancestry_name,
            a.description AS ancestry_description,
            a.modifiers AS ancestry_modifiers,

            am.id AS mod_id,
            am.name AS mod_name,
            am.description AS mod_description

        FROM dh_ancestries a
        LEFT JOIN dh_ancestry_modifications am
            ON am.ancestry_id = a.id

        ORDER BY a.name, am.name
    ";

    $stmt = $pdo->query($sql);

    $ancestries = [];

    while ($row = $stmt->fetch()) {
        $ancestryId = $row['ancestry_id'];

        // init ancestry
        if (!isset($ancestries[$ancestryId])) {
            $modifiers = !empty($row['ancestry_modifiers'])
                ? json_decode($row['ancestry_modifiers'])
                : new stdClass();

            $ancestries[$ancestryId] = [
                'id' => $ancestryId,
                'name' => $row['ancestry_name'],
                'description' => $row['ancestry_description'],
                'modifications' => [],
                'modifiers' => $modifiers
            ];
        }

        // pridanie modification
        if (!empty($row['mod_id'])) {
            $ancestries[$ancestryId]['modifications'][] = [
                'id' => $row['mod_id'],
                'name' => $row['mod_name'],
                'description' => $row['mod_description']
            ];
        }
    }

    echo json_encode(array_values($ancestries), JSON_PRETTY_PRINT);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'error' => 'Failed to fetch ancestries',
        'message' => $e->getMessage()
    ]);
}