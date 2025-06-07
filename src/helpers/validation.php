<?php

function validarEmail($email) {
    return filter_var($email, FILTER_VALIDATE_EMAIL);
}

function validarSenhaForte($senha) {
    return strlen($senha) >= 8 &&
           preg_match('/[A-Z]/', $senha) &&
           preg_match('/[a-z]/', $senha) &&
           preg_match('/[0-9]/', $senha);
}

function sanitizarTexto($texto) {
    return htmlspecialchars(trim($texto), ENT_QUOTES, 'UTF-8');
}

function gerarToken($tamanho = 32) {
    return bin2hex(random_bytes($tamanho / 2)); // gera string hex equivalente
}
?>