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
            c.id AS community_id,
            c.name AS community_name,
            c.description AS community_description,
            c.modifiers AS community_modifiers,

            cm.id AS mod_id,
            cm.name AS mod_name,
            cm.description AS mod_description,

            ct.trait AS trait_name

        FROM dh_communities c
        LEFT JOIN dh_community_modifications cm 
            ON cm.community_id = c.id
        LEFT JOIN dh_community_traits ct 
            ON ct.community_id = c.id

        ORDER BY c.name
    ";

    $stmt = $pdo->query($sql);

    $communities = [];

    while ($row = $stmt->fetch()) {
        $communityId = $row['community_id'];

        // init community
        if (!isset($communities[$communityId])) {
            $modifiers = !empty($row['community_modifiers'])
                ? json_decode($row['community_modifiers'])
                : new stdClass();

            $communities[$communityId] = [
                'id' => $communityId,
                'name' => $row['community_name'],
                'description' => $row['community_description'],
                'modifications' => null,
                'traits' => [],
                'modifiers' => $modifiers
            ];
        }

        // set modification (len jeden)
        if (!empty($row['mod_id']) && $communities[$communityId]['modifications'] === null) {
            $communities[$communityId]['modifications'] = [
                'id' => $row['mod_id'],
                'name' => $row['mod_name'],
                'description' => $row['mod_description']
            ];
        }

        // add trait (unikátne)
        if (!empty($row['trait_name']) && !in_array($row['trait_name'], $communities[$communityId]['traits'])) {
            $communities[$communityId]['traits'][] = $row['trait_name'];
        }
    }

    // fallback ak community nema modification
    foreach ($communities as &$community) {
        if ($community['modifications'] === null) {
            $community['modifications'] = new stdClass();
        }
    }

    echo json_encode(array_values($communities), JSON_PRETTY_PRINT);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'error' => 'Failed to fetch communities',
        'message' => $e->getMessage()
    ]);
}