<?php
session_start();

$data = json_decode(file_get_contents("php://input"), true);
$email = $data['email'];

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(['sucesso' => false, 'erro' => 'E-mail inválido']);
    exit;
}

$token = rand(100000, 999999); // Ex: 6 dígitos

$_SESSION['token_email'] = $token;
$_SESSION['email_pendente'] = $email;

// Envie o e-mail com o token
$assunto = "Seu código de verificação";
$mensagem = "Seu código de verificação é: $token";
$headers = "From: no-reply@financepal.com.br";

if (mail($email, $assunto, $mensagem, $headers)) {
    echo json_encode(['sucesso' => true]);
} else {
    echo json_encode(['sucesso' => false, 'erro' => 'Erro ao enviar e-mail']);
}
?>
