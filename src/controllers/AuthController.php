public function register($nome, $email, $senha) {
    // Verifica se já existe
    $stmt = $this->db->prepare("SELECT id FROM usuarios WHERE email = :email");
    $stmt->execute(['email' => $email]);
    if ($stmt->fetch()) {
        return ['sucesso' => false, 'erro' => 'E-mail já cadastrado.'];
    }

    $senhaHash = password_hash($senha, PASSWORD_DEFAULT);
    $token = bin2hex(random_bytes(16)); // Token de verificação simples

    $stmt = $this->db->prepare("INSERT INTO usuarios (nome_completo, email, senha, token_verificacao) VALUES (:nome, :email, :senha, :token)");
    $stmt->execute([
        'nome' => $nome,
        'email' => $email,
        'senha' => $senhaHash,
        'token' => $token
    ]);

    // Envia o e-mail com token
    $emailService = new EmailService();
    $emailService->enviarToken($email, $token);

    return ['sucesso' => true];
}
