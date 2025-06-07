<?php

$host = 'localhost';
$dbname = 'u473202279_ChatBoxEdu';
$user = 'u473202279_ChatBoxEdu';
$pass = 'Lu999838235Lu';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $user, $pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['erro' => 'Erro de conexão com o banco de dados']);
    exit;
}
?>