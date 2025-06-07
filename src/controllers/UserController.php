<?php

class UserController {
    private $db;

    public function __construct(PDO $pdo) {
        $this->db = $pdo;
    }

    public function updateProfile($data, $files) {
        $id = $data['id'] ?? null;
        $nome = trim($data['nome'] ?? '');

        if (!$id || !$nome) {
            return ['sucesso' => false, 'erro' => 'Dados obrigatórios ausentes.'];
        }

        $avatarUrl = null;
        if (!empty($files['avatar']) && $files['avatar']['error'] === UPLOAD_ERR_OK) {
            $avatarUrl = $this->uploadAvatar($files['avatar'], $id);
        }

        $query = "UPDATE usuarios SET nome_completo = :nome";
        if ($avatarUrl) $query .= ", avatar_url = :avatar_url";
        $query .= " WHERE id = :id";

        $stmt = $this->db->prepare($query);
        $params = ['nome' => $nome, 'id' => $id];
        if ($avatarUrl) $params['avatar_url'] = $avatarUrl;
        $stmt->execute($params);

        $stmt = $this->db->prepare("SELECT id, nome_completo, email, avatar_url FROM usuarios WHERE id = :id");
        $stmt->execute(['id' => $id]);
        $usuario = $stmt->fetch(PDO::FETCH_ASSOC);

        return ['sucesso' => true, 'usuario' => $usuario];
    }

    public function updatePassword($id, $senhaAtual, $novaSenha) {
        $stmt = $this->db->prepare("SELECT senha FROM usuarios WHERE id = :id");
        $stmt->execute(['id' => $id]);
        $usuario = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$usuario || !password_verify($senhaAtual, $usuario['senha'])) {
            return ['sucesso' => false, 'erro' => 'Senha atual incorreta.'];
        }

        $novaHash = password_hash($novaSenha, PASSWORD_DEFAULT);
        $stmt = $this->db->prepare("UPDATE usuarios SET senha = :senha WHERE id = :id");
        $stmt->execute([
            'senha' => $novaHash,
            'id' => $id
        ]);

        return ['sucesso' => true];
    }

    private function uploadAvatar($file, $userId) {
        $uploadDir = __DIR__ . '/../../public/assets/img/';
        $ext = pathinfo($file['name'], PATHINFO_EXTENSION);
        $filename = 'avatar_' . $userId . '_' . time() . '.' . $ext;
        $destino = $uploadDir . $filename;

        if (!move_uploaded_file($file['tmp_name'], $destino)) {
            return null;
        }

        return "/public/assets/img/$filename";
    }
}
?>