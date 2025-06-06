<?php
header('Content-Type: application/json');

require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../controllers/AuthController.php';
require_once __DIR__ . '/../../services/EmailService.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['erro' => 'Método não permitido']);
    exit;
}

$data = json_decode(file_get_contents('php://input'), true);

$nome = trim($data['nome'] ?? '');
$email = trim($data['email'] ?? '');
$senha = $data['senha'] ?? '';

if (!$nome || !$email || !$senha) {
    http_response_code(400);
    echo json_encode(['erro' => 'Todos os campos são obrigatórios.']);
    exit;
}

$auth = new AuthController($pdo);
$result = $auth->register($nome, $email, $senha);

if ($result['sucesso']) {
    echo json_encode(['sucesso' => true, 'mensagem' => 'Cadastro realizado. Verifique seu e-mail.']);
} else {
    http_response_code(400);
    echo json_encode(['erro' => $result['erro']]);
}
