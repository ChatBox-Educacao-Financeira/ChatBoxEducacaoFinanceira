<?php

class EmailService {
    public function enviarToken($email, $token) {
        $assunto = 'Confirmação de E-mail - FinancePal';
        $mensagem = "Olá,\n\nSeu código de verificação é: $token\n\nUse-o para confirmar seu e-mail.\n\nAtenciosamente,\nFinancePal";

        $headers = 'From: no-reply@financepal.com.br' . "\r\n" .
                   'Reply-To: suporte@financepal.com.br' . "\r\n" .
                   'X-Mailer: PHP/' . phpversion();

        // Em produção, use um sistema de e-mail robusto (SMTP, PHPMailer etc)
        mail($email, $assunto, $mensagem, $headers);
    }
}
