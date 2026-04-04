<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

require_once 'db.php';

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['username']) || trim($data['username']) === '') {
    http_response_code(400);
    echo json_encode(["error" => "Username is required"]);
    exit;
}

$username = trim($data['username']);

try {
    // insert user
    $stmt = $pdo->prepare("INSERT INTO dh_users (username) VALUES (?)");
    $stmt->execute([$username]);

    $userId = $pdo->lastInsertId();

    echo json_encode([
        "id" => (int)$userId,
        "username" => $username
    ]);

} catch (PDOException $e) {

    // duplicate username (UNIQUE constraint)
    if ($e->getCode() == 23000) {
        http_response_code(409);
        echo json_encode([
            "error" => "Username already exists"
        ]);
    } else {
        http_response_code(500);
        echo json_encode([
            "error" => "Server error"
        ]);
    }
}