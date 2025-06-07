<?php

require_once __DIR__ . '/../services/EmailService.php';

class AuthController {
    private $db;

    public function __construct(PDO $pdo) {
        $this->db = $pdo;
    }

    public function login($email, $senha) {
        try {
            $stmt = $this->db->prepare("
                SELECT id, nome_completo, email, senha, avatar 
                FROM usuarios 
                WHERE email = :email
            ");
            $stmt->execute(['email' => $email]);
            $usuario = $stmt->fetch(PDO::FETCH_ASSOC);

            if (!$usuario) {
                return ['sucesso' => false, 'erro' => 'Usuário não encontrado'];
            }

            if (!password_verify($senha, $usuario['senha'])) {
                return ['sucesso' => false, 'erro' => 'Senha incorreta'];
            }

            // Remover senha antes de retornar
            unset($usuario['senha']);
            
            return ['sucesso' => true, 'usuario' => $usuario];
            
        } catch (Exception $e) {
            error_log("Erro no login: " . $e->getMessage());
            return ['sucesso' => false, 'erro' => 'Erro no banco de dados'];
        }
    }

    public function register($nome, $email, $senha) {
        try {
            // Verificar se email já existe
            $stmt = $this->db->prepare("SELECT id FROM usuarios WHERE email = :email");
            $stmt->execute(['email' => $email]);
            
            if ($stmt->fetch()) {
                return ['sucesso' => false, 'erro' => 'E-mail já cadastrado'];
            }

            // Criar hash da senha
            $senhaHash = password_hash($senha, PASSWORD_DEFAULT);
            $token = bin2hex(random_bytes(16));

            // Inserir usuário
            $stmt = $this->db->prepare("
                INSERT INTO usuarios (nome_completo, email, senha, token_verificacao) 
                VALUES (:nome, :email, :senha, :token)
            ");
            
            $stmt->execute([
                'nome' => $nome,
                'email' => $email,
                'senha' => $senhaHash,
                'token' => $token
            ]);

            // Enviar email
            $emailService = new EmailService();
            $emailService->enviarToken($email, $token);

            return ['sucesso' => true];
            
        } catch (Exception $e) {
            error_log("Erro no registro: " . $e->getMessage());
            return ['sucesso' => false, 'erro' => 'Erro ao cadastrar'];
        }
    }
}
?>