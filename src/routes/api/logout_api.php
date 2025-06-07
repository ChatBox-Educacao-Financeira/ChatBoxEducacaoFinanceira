<?php
session_start();
header('Content-Type: application/json');

// Destruir sessão
session_destroy();

echo json_encode(['sucesso' => true, 'mensagem' => 'Logout realizado']);
?>