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

if (!isset($_FILES['avatar']) || $_FILES['avatar']['error'] !== UPLOAD_ERR_OK) {
    http_response_code(400);
    exit(json_encode(['erro' => 'Nenhuma imagem enviada']));
}

$file = $_FILES['avatar'];

$allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
if (!in_array($file['type'], $allowedTypes)) {
    http_response_code(400);
    exit(json_encode(['erro' => 'Tipo de arquivo não permitido']));
}

if ($file['size'] > 5 * 1024 * 1024) {
    http_response_code(400);
    exit(json_encode(['erro' => 'Arquivo muito grande. Máximo 5MB']));
}

// Create upload directory
$uploadDir = $_SERVER['DOCUMENT_ROOT'] . '/uploads/avatars/';
if (!is_dir($uploadDir)) {
    mkdir($uploadDir, 0755, true);
}

$extension = pathinfo($file['name'], PATHINFO_EXTENSION);
$fileName = $_SESSION['usuario_id'] . '_' . time() . '.' . $extension;
$filePath = $uploadDir . $fileName;

if (!move_uploaded_file($file['tmp_name'], $filePath)) {
    http_response_code(500);
    exit(json_encode(['erro' => 'Erro ao salvar arquivo']));
}

try {
    // Remove old avatar
    $stmt = $pdo->prepare("SELECT avatar FROM usuarios WHERE id = ?");
    $stmt->execute([$_SESSION['usuario_id']]);
    $oldAvatar = $stmt->fetchColumn();
    
    if ($oldAvatar && file_exists($_SERVER['DOCUMENT_ROOT'] . '/' . $oldAvatar)) {
        unlink($_SERVER['DOCUMENT_ROOT'] . '/' . $oldAvatar);
    }
    
    // Save relative path in database
    $relativePath = 'uploads/avatars/' . $fileName;
    
    $stmt = $pdo->prepare("UPDATE usuarios SET avatar = ? WHERE id = ?");
    $stmt->execute([$relativePath, $_SESSION['usuario_id']]);
    
    echo json_encode([
        'sucesso' => true,
        'avatar' => $relativePath
    ]);
    
} catch(PDOException $e) {
    unlink($filePath);
    error_log('Avatar upload error: ' . $e->getMessage());
    http_response_code(500);
    exit(json_encode(['erro' => 'Erro interno']));
}
?>