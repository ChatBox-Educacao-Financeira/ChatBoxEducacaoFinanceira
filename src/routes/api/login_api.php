<?php
session_start();
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: https://elystech.com.br');
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// Definir timezone do Brasil
date_default_timezone_set('America/Sao_Paulo');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    exit(json_encode(['erro' => 'Método não permitido']));
}

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

if (empty($input['email']) || empty($input['senha'])) {
    http_response_code(400);
    exit(json_encode(['erro' => 'Email e senha são obrigatórios']));
}

try {
    $stmt = $pdo->prepare("SELECT id, nome_completo, email, senha_hash, avatar FROM usuarios WHERE email = ?");
    $stmt->execute([$input['email']]);
    $usuario = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$usuario || !password_verify($input['senha'], $usuario['senha_hash'])) {
        http_response_code(401);
        exit(json_encode(['erro' => 'Credenciais inválidas']));
    }

    // Configurar timezone no MySQL e atualizar último acesso
    $pdo->exec("SET time_zone = '-03:00'");
    $stmt = $pdo->prepare("UPDATE usuarios SET ultimo_acesso = NOW() WHERE id = ?");
    $stmt->execute([$usuario['id']]);

    $_SESSION['usuario_id'] = $usuario['id'];
    $_SESSION['usuario_nome'] = $usuario['nome_completo'];
    $_SESSION['usuario_email'] = $usuario['email'];
    
    unset($usuario['senha_hash']);
    
    echo json_encode([
        'sucesso' => true,
        'usuario' => $usuario
    ]);

} catch (PDOException $e) {
    error_log("Login error: " . $e->getMessage());
    http_response_code(500);
    exit(json_encode(['erro' => 'Erro interno: ' . $e->getMessage()]));
}
?>