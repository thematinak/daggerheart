<?php
header("Access-Control-Allow-Origin: *");
header('Content-Type: application/json');

// --- Database connection ---
$host = '86.110.243.71';
$db   = 'kd037800db';
$user = 'kd037800';
$pass = 'PhfDHdtcKBQIPkH6RfajkR';
$charset = 'utf8mb4';

require_once 'db.php';

// --- Fetch classes with their domains ---
$sql = "
    SELECT c.id AS class_id, c.name AS class_name, c.description AS class_description, 
           c.base_hp, c.base_evasion, c.modifiers,
           d.name AS domain_name
    FROM dh_classes c
    LEFT JOIN dh_class_domains cd ON cd.class_id = c.id
    LEFT JOIN dh_domains d ON d.id = cd.domain_id
    ORDER BY c.id
";

$stmt = $pdo->query($sql);

$classes = [];
while ($row = $stmt->fetch()) {
    $classId = $row['class_id'];

    // Parse JSON modifiers as object
    $modifiers = !empty($row['modifiers']) ? json_decode($row['modifiers']) : new stdClass();

    // Initialize class entry
    if (!isset($classes[$classId])) {
        $classes[$classId] = [
            'id' => $classId,
            'name' => $row['class_name'],
            'description' => $row['class_description'],
            'baseHp' => (int)$row['base_hp'],
            'baseEvasion' => (int)$row['base_evasion'],
            'baseArmor' => isset($modifiers->maxArmor) ? (int)$modifiers->maxArmor : 0,
            'domains' => [],
            'modifiers' => $modifiers
        ];
    }

    // Append domain name if exists and not duplicate
    if (!empty($row['domain_name']) && !in_array($row['domain_name'], $classes[$classId]['domains'])) {
        $classes[$classId]['domains'][] = $row['domain_name'];
    }
}

// Return JSON array of classes
echo json_encode(array_values($classes), JSON_PRETTY_PRINT);