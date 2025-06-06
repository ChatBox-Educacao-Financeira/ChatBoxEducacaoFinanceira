document.addEventListener('DOMContentLoaded', () => {
  const usuario = JSON.parse(localStorage.getItem('usuario'));
  if (!usuario) return window.location.href = 'index.html';

  document.getElementById('nome').value = usuario.nome_completo;
  document.getElementById('email').value = usuario.email;

  const avatarPreview = document.getElementById('avatarPreview');
  if (usuario.avatar_url) {
    avatarPreview.style.backgroundImage = `url(${usuario.avatar_url})`;
  } else {
    avatarPreview.textContent = usuario.nome_completo[0].toUpperCase();
  }

  // Preview de novo avatar
  document.getElementById('avatar').addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      avatarPreview.style.backgroundImage = `url(${URL.createObjectURL(file)})`;
      avatarPreview.textContent = '';
    }
  });

  // Atualizar dados
  document.getElementById('profileForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    formData.append('id', usuario.id);

    const response = await fetch('/src/routes/api/perfil_update.php', {
      method: 'POST',
      body: formData
    });

    const result = await response.json();
    if (result.sucesso) {
      alert('Perfil atualizado com sucesso!');
      localStorage.setItem('usuario', JSON.stringify(result.usuario));
      location.reload();
    } else {
      alert(result.erro || 'Erro ao atualizar perfil');
    }
  });

  // Logout
  document.getElementById('logoutBtn').addEventListener('click', () => {
    localStorage.clear();
    document.querySelector('.profile-container').classList.add('logging-out');
    setTimeout(() => window.location.href = 'index.html', 600);
  });
});
