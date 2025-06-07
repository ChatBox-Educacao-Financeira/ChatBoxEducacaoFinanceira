<?php
session_start();
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: https://elystech.com.br');
header('Access-Control-Allow-Credentials: true');

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

if (empty($input['senha_atual'])) {
    http_response_code(400);
    exit(json_encode(['erro' => 'Senha atual é obrigatória']));
}

try {
    $stmt = $pdo->prepare("SELECT senha_hash FROM usuarios WHERE id = ?");
    $stmt->execute([$_SESSION['usuario_id']]);
    $senhaHash = $stmt->fetchColumn();

    if (!$senhaHash) {
        http_response_code(404);
        exit(json_encode(['erro' => 'Usuário não encontrado']));
    }

    if (password_verify($input['senha_atual'], $senhaHash)) {
        echo json_encode(['sucesso' => true]);
    } else {
        echo json_encode(['sucesso' => false, 'erro' => 'Senha inválida']);
    }

} catch(PDOException $e) {
    error_log('Password validation error: ' . $e->getMessage());
    http_response_code(500);
    exit(json_encode(['erro' => 'Erro interno']));
}
?>