<?php
session_start();
header('Access-Control-Allow-Origin: https://elystech.com.br');
header('Access-Control-Allow-Credentials: true');
header('Content-Type: application/json');

$databasePath = __DIR__ . '/../../config/database.php';
if (!file_exists($databasePath)) {
    $databasePath = $_SERVER['DOCUMENT_ROOT'] . '/src/config/database.php';
    if (!file_exists($databasePath)) {
        http_response_code(500);
        exit(json_encode(['erro' => 'Configuração do banco não encontrada']));
    }
}

require_once $databasePath;

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    exit(json_encode(['erro' => 'Método não permitido']));
}

$input = json_decode(file_get_contents("php://input"), true);

if (empty($input['nome_completo']) || empty($input['email']) || empty($input['senha']) || empty($input['token'])) {
    http_response_code(400);
    exit(json_encode(['erro' => 'Campos obrigatórios faltando']));
}

$token_digitado = $input['token'];
$email = $input['email'];

if (
    !isset($_SESSION['token_email']) ||
    !isset($_SESSION['email_pendente']) ||
    $_SESSION['email_pendente'] !== $email
) {
    exit(json_encode(['sucesso' => false, 'erro' => 'Token expirado ou e-mail não confirmado']));
}

if ($token_digitado != $_SESSION['token_email']) {
    exit(json_encode(['sucesso' => false, 'erro' => 'Token inválido']));
}

try {
    $stmt = $pdo->prepare("SELECT id FROM usuarios WHERE email = ?");
    $stmt->execute([$email]);

    if ($stmt->fetch()) {
        exit(json_encode(['erro' => 'E-mail já cadastrado']));
    }

    // Verifica quais campos existem na tabela
    $stmt = $pdo->prepare("DESCRIBE usuarios");
    $stmt->execute();
    $columns = $stmt->fetchAll(PDO::FETCH_COLUMN);
    
    // Monta query dinâmica
    $insertFields = ['nome_completo', 'email', 'senha_hash'];
    $insertValues = ['?', '?', '?'];
    $params = [
        $input['nome_completo'],
        $email,
        password_hash($input['senha'], PASSWORD_DEFAULT)
    ];
    
    if (in_array('nome_empresa', $columns)) {
        $insertFields[] = 'nome_empresa';
        $insertValues[] = '?';
        $params[] = $input['nome_empresa'] ?? null;
    }
    
    if (in_array('cargo', $columns)) {
        $insertFields[] = 'cargo';
        $insertValues[] = '?';
        $params[] = 'CEO';
    }
    
    if (in_array('data_cadastro', $columns)) {
        $insertFields[] = 'data_cadastro';
        $insertValues[] = 'NOW()';
    }
    
    $insertQuery = "INSERT INTO usuarios (" . implode(', ', $insertFields) . ") VALUES (" . implode(', ', $insertValues) . ")";
    $stmt = $pdo->prepare($insertQuery);
    $stmt->execute($params);

    unset($_SESSION['token_email']);
    unset($_SESSION['email_pendente']);

    echo json_encode(['sucesso' => true]);
} catch (PDOException $e) {
    error_log('Cadastro error: ' . $e->getMessage());
    http_response_code(500);
    echo json_encode(['erro' => 'Erro interno: ' . $e->getMessage()]);
}
?>