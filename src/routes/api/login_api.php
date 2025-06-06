<?php
header('Content-Type: application/json');

require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../controllers/AuthController.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['erro' => 'Método não permitido']);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);

if (empty($input['email']) || empty($input['senha'])) {
    http_response_code(400);
    echo json_encode(['erro' => 'Email e senha são obrigatórios.']);
    exit;
}

$authController = new AuthController($pdo);
$response = $authController->login($input['email'], $input['senha']);

if ($response['sucesso']) {
    echo json_encode([
        'sucesso' => true,
        'usuario' => $response['usuario']
    ]);
} else {
    http_response_code(401);
    echo json_encode(['erro' => $response['erro']]);
}
