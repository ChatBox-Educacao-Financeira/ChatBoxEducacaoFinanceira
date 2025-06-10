<?php
session_start();
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: https://elystech.com.br');
header('Access-Control-Allow-Credentials: true');

// Definir timezone do Brasil
date_default_timezone_set('America/Sao_Paulo');

if (!isset($_SESSION['usuario_id'])) {
    http_response_code(401);
    exit(json_encode(['erro' => 'Usuário não autenticado']));
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

try {
    // Configurar timezone no MySQL
    $pdo->exec("SET time_zone = '-03:00'");
    
    $stmt = $pdo->prepare("SELECT nome_completo, email, nome_empresa, avatar, data_cadastro, ultimo_acesso, cargo FROM usuarios WHERE id = ?");
    $stmt->execute([$_SESSION['usuario_id']]);
    $usuario = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$usuario) {
        http_response_code(404);
        exit(json_encode(['erro' => 'Usuário não encontrado']));
    }
    
    // Garantir que todos os campos existem
    if (!isset($usuario['cargo'])) {
        $usuario['cargo'] = 'CEO';
    }
    if (!isset($usuario['data_cadastro'])) {
        $usuario['data_cadastro'] = date('Y-m-d H:i:s');
    }
    if (!isset($usuario['ultimo_acesso'])) {
        $usuario['ultimo_acesso'] = date('Y-m-d H:i:s');
    }
    
    // Debug log
    error_log('perfil_get retornando: ' . json_encode($usuario));
    
    echo json_encode([
        'sucesso' => true,
        'usuario' => $usuario
    ]);
    
} catch(PDOException $e) {
    error_log('Profile get error: ' . $e->getMessage());
    http_response_code(500);
    exit(json_encode(['erro' => 'Erro interno: ' . $e->getMessage()]));
}
?>