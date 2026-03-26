<?php
header('Content-Type: application/json');

// CORS
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type");


require_once 'db.php';

$domainFilter = $_GET['domain_id'] ?? null;
$levelFilter  = $_GET['level'] ?? null;

$where = [];
$params = [];

// --- DOMAIN FILTER ---
if ($domainFilter) {
    $domains = explode(',', $domainFilter);
    $placeholders = implode(',', array_fill(0, count($domains), '?'));
    $where[] = "domain_id IN ($placeholders)";
    $params = array_merge($params, $domains);
}

// --- LEVEL FILTER ---
if ($levelFilter) {
    $levels = explode(',', $levelFilter);
    $placeholders = implode(',', array_fill(0, count($levels), '?'));
    $where[] = "level IN ($placeholders)";
    $params = array_merge($params, $levels);
}

// --- WHERE ---
$whereSQL = count($where) ? 'WHERE ' . implode(' AND ', $where) : '';

$sql = "
    SELECT id, domain_id, name, description, level
    FROM dh_domain_cards
    $whereSQL
    ORDER BY level, id
";

$stmt = $pdo->prepare($sql);
$stmt->execute($params);

$cards = [];

while ($row = $stmt->fetch()) {
    $cards[] = [
        'id' => (int)$row['id'],
        'domainId' => $row['domain_id'],
        'name' => $row['name'],
        'description' => $row['description'],
        'level' => (int)$row['level']
    ];
}

echo json_encode($cards, JSON_PRETTY_PRINT);