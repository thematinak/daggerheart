<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

require_once 'db.php';

// načítanie JSON body
$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['username']) || trim($data['username']) === '') {
    http_response_code(400);
    echo json_encode(["error" => "Username is required"]);
    exit;
}

$username = trim($data['username']);

try {
    // nájdi usera
    $stmt = $pdo->prepare("SELECT id, username FROM dh_users WHERE username = ?");
    $stmt->execute([$username]);

    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($user) {
        echo json_encode([
            "id" => (int)$user['id'],
            "username" => $user['username']
        ]);
    } else {
        http_response_code(404);
        echo json_encode([
            "error" => "User not found"
        ]);
    }

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        "error" => "Server error"
    ]);
}