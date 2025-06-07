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

if (empty($input['nova_senha'])) {
    http_response_code(400);
    exit(json_encode(['erro' => 'Nova senha é obrigatória']));
}

if (strlen($input['nova_senha']) < 6) {
    http_response_code(400);
    exit(json_encode(['erro' => 'A senha deve ter pelo menos 6 caracteres']));
}

try {
    $novaSenhaHash = password_hash($input['nova_senha'], PASSWORD_DEFAULT);
    
    $stmt = $pdo->prepare("UPDATE usuarios SET senha_hash = ? WHERE id = ?");
    $stmt->execute([$novaSenhaHash, $_SESSION['usuario_id']]);

    echo json_encode(['sucesso' => true, 'mensagem' => 'Senha alterada com sucesso']);

} catch(PDOException $e) {
    error_log('Password change error: ' . $e->getMessage());
    http_response_code(500);
    exit(json_encode(['erro' => 'Erro interno']));
}
?>