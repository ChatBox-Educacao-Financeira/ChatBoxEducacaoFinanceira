<?php
session_start(); // NECESSÁRIO para acessar $_SESSION

// Permite CORS com envio de cookie de sessão
header('Access-Control-Allow-Origin: https://elystech.com.br');
header('Access-Control-Allow-Credentials: true');
header('Content-Type: application/json');

// Monta caminhos possíveis para o config/database.php
$databasePath = __DIR__ . '/../../config/database.php';
if (!file_exists($databasePath)) {
    // Tenta caminho alternativo dentro de src/
    $databasePath = $_SERVER['DOCUMENT_ROOT'] . '/src/config/database.php';
    if (!file_exists($databasePath)) {
        http_response_code(500);
        exit(json_encode([
            'erro' => 'Configuração do banco não encontrada',
            'debug_path' => $databasePath
        ]));
    }
}

require_once $databasePath;

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    exit(json_encode(['erro' => 'Método não permitido']));
}

$input = json_decode(file_get_contents("php://input"), true);

// Validação básica
if (empty($input['nome_completo']) || empty($input['email']) || empty($input['senha']) || empty($input['token'])) {
    http_response_code(400);
    exit(json_encode(['erro' => 'Campos obrigatórios faltando']));
}

$token_digitado = $input['token'];
$email = $input['email'];

// Verificar se o token e o e-mail conferem com os salvos na sessão
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
    // Verifica se e-mail já existe
    $stmt = $pdo->prepare("SELECT id FROM usuarios WHERE email = ?");
    $stmt->execute([$email]);

    if ($stmt->fetch()) {
        exit(json_encode(['erro' => 'E-mail já cadastrado']));
    }

    // Cadastra novo usuário
    $stmt = $pdo->prepare("
        INSERT INTO usuarios (nome_completo, email, nome_empresa, senha_hash)
        VALUES (?, ?, ?, ?)
    ");
    $stmt->execute([
        $input['nome_completo'],
        $email,
        $input['nome_empresa'] ?? null,
        password_hash($input['senha'], PASSWORD_DEFAULT)
    ]);

    // Apaga o token da sessão para segurança
    unset($_SESSION['token_email']);
    unset($_SESSION['email_pendente']);

    echo json_encode(['sucesso' => true]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['erro' => 'Erro interno']);
}
?>
