<?php
session_start();

class EmailService {
    public function enviarToken($email, $token) {
        $assunto = 'Confirmação de E-mail - FinancePal';

        $mensagem = "
            <html>
                <head>
                    <title>Confirmação de E-mail</title>
                </head>
                <body>
                    <h2>Verifique seu e-mail</h2>
                    <p>Use o código abaixo para confirmar sua conta no FinancePal:</p>
                    <h3 style='color: #1e40af;'>$token</h3>
                    <p>Ou clique <a href='https://seudominio.com/confirmar.html?email=$email'>aqui</a> para confirmar.</p>
                    <br />
                    <p>Se você não solicitou esse cadastro, ignore esta mensagem.</p>
                </body>
            </html>
        ";

        $headers  = "MIME-Version: 1.0" . "\r\n";
        $headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";
        $headers .= "From: no-reply@financepal.com.br" . "\r\n";

        // ⚠️ Em produção, use SMTP autenticado ou uma biblioteca como PHPMailer
        mail($email, $assunto, $mensagem, $headers);
    }
}
?>