<?php
session_start();
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: https://elystech.com.br');
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    exit(json_encode(['erro' => 'Método não permitido']));
}

if (!isset($_SESSION['usuario_id'])) {
    http_response_code(401);
    exit(json_encode(['erro' => 'Usuário não autenticado']));
}

// Fixed database path resolution
$databasePath = $_SERVER['DOCUMENT_ROOT'] . '/src/config/database.php';
if (!file_exists($databasePath)) {
    $databasePath = __DIR__ . '/../../config/database.php';
    if (!file_exists($databasePath)) {
        http_response_code(500);
        exit(json_encode(['erro' => 'Configuração do banco não encontrada']));
    }
}

require_once $databasePath;

$input = json_decode(file_get_contents('php://input'), true);

if (empty($input['nome_completo']) || empty($input['email'])) {
    http_response_code(400);
    exit(json_encode(['erro' => 'Nome e email são obrigatórios']));
}

if (!filter_var($input['email'], FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    exit(json_encode(['erro' => 'Email inválido']));
}

try {
    // Check if email is already used by another user
    $stmt = $pdo->prepare("SELECT id FROM usuarios WHERE email = ? AND id != ?");
    $stmt->execute([$input['email'], $_SESSION['usuario_id']]);
    
    if ($stmt->fetch()) {
        http_response_code(409);
        exit(json_encode(['erro' => 'Email já está em uso']));
    }
    
    // Update user
    $stmt = $pdo->prepare("UPDATE usuarios SET nome_completo = ?, email = ?, nome_empresa = ? WHERE id = ?");
    $stmt->execute([
        $input['nome_completo'],
        $input['email'],
        $input['nome_empresa'] ?? null,
        $_SESSION['usuario_id']
    ]);
    
    echo json_encode(['sucesso' => true]);
    
} catch(PDOException $e) {
    error_log('Profile update error: ' . $e->getMessage());
    http_response_code(500);
    exit(json_encode(['erro' => 'Erro interno']));
}
?>