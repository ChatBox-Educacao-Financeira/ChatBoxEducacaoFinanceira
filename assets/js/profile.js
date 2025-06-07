// profile.js (com prints de debug)
console.log('⏺️ profile.js carregado');

const fileUploadArea = document.getElementById('fileUploadArea');
const fileInput = document.getElementById('fileInput');
const uploadedFilesContainer = document.getElementById('uploadedFilesContainer');
let selectedFiles = [];

const profileAvatarContainer = document.getElementById('profileAvatarContainer');
const avatarUploadInput = document.getElementById('avatarUploadInput');
const profileAvatarDisplay = document.getElementById('profileAvatarDisplay');
const defaultAvatarIcon = profileAvatarDisplay.querySelector('.profile-avatar-icon-default');

// Carregar dados do usuário ao carregar a página
document.addEventListener('DOMContentLoaded', async function() {
    console.log('DOMContentLoaded — iniciando carregamento de dados do usuário');
    await carregarDadosUsuario();
});

async function carregarDadosUsuario() {
    console.log('-> fetch src/routes/api/perfil_get.php');
    try {
        const response = await fetch('src/routes/api/perfil_get.php');
        console.log('   status fetch perfil_get:', response.status);
        const result = await response.json();
        console.log('   corpo JSON perfil_get:', result);

        if (result.sucesso) {
            document.getElementById('fullName').value = result.usuario.nome_completo || '';
            document.getElementById('email').value = result.usuario.email || '';
            document.getElementById('companyName').value = result.usuario.nome_empresa || '';

            // Carregar avatar se existir
            if (result.usuario.avatar) {
                console.log('   avatar existente encontrado:', result.usuario.avatar);
                if (defaultAvatarIcon) defaultAvatarIcon.style.display = 'none';
                const existingImg = profileAvatarDisplay.querySelector('img');
                if (existingImg) existingImg.remove();
                const img = document.createElement('img');
                img.src = '/' + result.usuario.avatar;
                img.alt = "Avatar do Usuário";
                profileAvatarDisplay.appendChild(img);
            }
        } else {
            console.warn('perfil_get retornou erro:', result.erro);
            alert('Erro ao carregar dados: ' + result.erro);
            window.location.href = 'index.html';
        }
    } catch (error) {
        console.error('   ERRO de conexão em perfil_get:', error);
        alert('Erro de conexão');
        window.location.href = 'index.html';
    }
}

async function saveProfile() {
    const fullName = document.getElementById('fullName').value;
    const email = document.getElementById('email').value;
    const companyName = document.getElementById('companyName').value;

    if (!fullName || !email) {
        alert('Por favor, preencha todos os campos obrigatórios.');
        return;
    }

    const formData = {
        nome_completo: fullName,
        email: email,
        nome_empresa: companyName
    };
    console.log('-> Enviando perfil_update:', formData);

    try {
        const response = await fetch('src/routes/api/perfil_update.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });
        console.log('   status perfil_update:', response.status);
        const result = await response.json();
        console.log('   corpo JSON perfil_update:', result);

        if (result.sucesso) {
            console.log('   perfil atualizado com sucesso');
            const successMessage = document.getElementById('successMessage');
            successMessage.style.display = 'block';
            setTimeout(() => successMessage.style.display = 'none', 3000);
        } else {
            console.warn('   perfil_update retornou erro:', result.erro);
            alert(result.erro);
        }
    } catch (error) {
        console.error('   ERRO de conexão em perfil_update:', error);
        alert('Erro de conexão');
    }
}

// Gerenciamento de alteração de senha
document.getElementById('changePasswordBtn').addEventListener('click', function() {
    console.log('clicou em Alterar Senha');
    document.getElementById('currentPasswordStep').style.display = 'block';
    this.style.display = 'none';
});

document.getElementById('confirmPasswordBtn').addEventListener('click', async function() {
    const currentPassword = document.getElementById('currentPassword').value;
    console.log('-> Validando senha atual:', currentPassword ? '***' : '(vazio)');

    if (!currentPassword) {
        showPasswordError('Digite sua senha atual');
        return;
    }
    await validateCurrentPassword(currentPassword);
});

async function validateCurrentPassword(currentPassword) {
    try {
        const response = await fetch('src/routes/api/validar_senha.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ senha_atual: currentPassword })
        });
        console.log('   status validar_senha:', response.status);
        const result = await response.json();
        console.log('   corpo JSON validar_senha:', result);

        if (result.sucesso) {
            console.log('senha atual validada com sucesso');
            document.getElementById('currentPasswordStep').style.display = 'none';
            document.getElementById('newPasswordStep').style.display = 'block';
            clearPasswordError();
        } else {
            console.warn('   validar_senha retornou falha');
            showPasswordError('Senha inválida');
        }
    } catch (error) {
        console.error('   ERRO de conexão em validar_senha:', error);
        showPasswordError('Erro de conexão');
    }
}

document.getElementById('savePasswordBtn').addEventListener('click', async function() {
    const newPassword = document.getElementById('newPassword').value;
    const confirmNewPassword = document.getElementById('confirmNewPassword').value;

    console.log('-> Salvando nova senha:', newPassword && confirmNewPassword ? '***' : '(vazio)');
    if (!newPassword || !confirmNewPassword) {
        showPasswordError('Preencha todos os campos de senha');
        return;
    }
    if (newPassword !== confirmNewPassword) {
        showPasswordError('As senhas não coincidem');
        return;
    }
    if (newPassword.length < 6) {
        showPasswordError('A senha deve ter pelo menos 6 caracteres');
        return;
    }

    await saveNewPassword(newPassword);
});

async function saveNewPassword(newPassword) {
    try {
        const response = await fetch('src/routes/api/alterar_senha.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nova_senha: newPassword })
        });
        console.log('   status alterar_senha:', response.status);
        const result = await response.json();
        console.log('   corpo JSON alterar_senha:', result);

        if (result.sucesso) {
            console.log('   senha alterada com sucesso');
            alert('Senha alterada com sucesso!');
            resetPasswordForm();
        } else {
            console.warn('   alterar_senha retornou erro:', result.erro);
            showPasswordError(result.erro);
        }
    } catch (error) {
        console.error('   ERRO de conexão em alterar_senha:', error);
        showPasswordError('Erro de conexão');
    }
}

function showPasswordError(message) {
    clearPasswordError();
    const errorDiv = document.createElement('div');
    errorDiv.className = 'password-error';
    errorDiv.textContent = message;
    errorDiv.id = 'passwordError';
    const activeStep = document.querySelector('.password-step[style*="block"]');
    if (activeStep) activeStep.appendChild(errorDiv);
}

function clearPasswordError() {
    const existingError = document.getElementById('passwordError');
    if (existingError) existingError.remove();
}

function resetPasswordForm() {
    document.getElementById('currentPassword').value = '';
    document.getElementById('newPassword').value = '';
    document.getElementById('confirmNewPassword').value = '';
    document.getElementById('currentPasswordStep').style.display = 'none';
    document.getElementById('newPasswordStep').style.display = 'none';
    document.getElementById('changePasswordBtn').style.display = 'inline-block';
    clearPasswordError();
}

// Upload de avatar
profileAvatarContainer.addEventListener('click', () => {
    console.log('clicou no container do avatar');
    avatarUploadInput.click();
});

avatarUploadInput.addEventListener('change', async function(event) {
    const file = event.target.files[0];
    console.log('arquivo selecionado para avatar:', file);
    if (file && file.type.startsWith('image/')) {
        // preview imediato
        const reader = new FileReader();
        reader.onload = function(e) {
            console.log('preview carregado');
            if (defaultAvatarIcon) defaultAvatarIcon.style.display = 'none';
            const oldImg = profileAvatarDisplay.querySelector('img');
            if (oldImg) oldImg.remove();
            const img = document.createElement('img');
            img.src = e.target.result;
            img.alt = "Avatar do Usuário";
            profileAvatarDisplay.appendChild(img);
        };
        reader.readAsDataURL(file);

        // upload ao servidor
        await uploadAvatar(file);
    } else if (file) {
        alert('Por favor, selecione um arquivo de imagem válido (ex: JPG, PNG).');
    }
});

async function uploadAvatar(file) {
    console.log('-> Iniciando uploadAvatar:', file.name, file.size);
    const formData = new FormData();
    formData.append('avatar', file);

    try {
        const response = await fetch('src/routes/api/upload_avatar.php', {
            method: 'POST',
            body: formData
        });
        console.log('   status upload_avatar:', response.status);
        const result = await response.json();
        console.log('   corpo JSON upload_avatar:', result);

        if (result.sucesso) {
            console.log('   avatar salvo com sucesso no servidor:', result.avatar);
        } else {
            console.warn('   upload_avatar retornou erro:', result.erro, result.debug);
            alert('Erro ao salvar avatar: ' + result.erro);
        }
    } catch (error) {
        console.error('   ERRO de conexão em upload_avatar:', error);
        alert('Erro de conexão ao salvar avatar');
    }
}

// Drag & drop e múltiplos arquivos
fileUploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    fileUploadArea.classList.add('dragover');
});
fileUploadArea.addEventListener('dragleave', () => {
    fileUploadArea.classList.remove('dragover');
});
fileUploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    fileUploadArea.classList.remove('dragover');
    const files = Array.from(e.dataTransfer.files);
    console.log('arquivos arrastados:', files);
    handleFiles(files);
});
fileInput.addEventListener('change', (e) => {
    const files = Array.from(e.target.files);
    console.log('arquivos selecionados pelo input:', files);
    handleFiles(files);
});

function handleFiles(files) {
    files.forEach(file => {
        if (file.size <= 10 * 1024 * 1024) {
            if (!selectedFiles.some(f => f.name === file.name && f.size === file.size)) {
                selectedFiles.push(file);
                console.log('arquivo adicionado ao selectedFiles:', file.name);
                displayFile(file);
            }
        } else {
            alert(`Arquivo ${file.name} é muito grande. Máximo 10MB.`);
        }
    });
    console.log('selectedFiles atuais:', selectedFiles);
    fileInput.value = '';
}

function displayFile(file) {
    const fileDiv = document.createElement('div');
    fileDiv.className = 'uploaded-file';
    fileDiv.innerHTML = `
        <div class="file-info">
            <span class="file-name" title="${file.name}">📎 ${file.name}</span>
            <span class="file-size">(${formatFileSize(file.size)})</span>
        </div>
        <button class="remove-file" data-filename="${file.name}" data-filesize="${file.size}" aria-label="Remover ${file.name}">×</button>
    `;
    uploadedFilesContainer.appendChild(fileDiv);
    fileDiv.querySelector('.remove-file').addEventListener('click', function() {
        removeFile(this.dataset.filename, parseInt(this.dataset.filesize, 10), this.parentElement);
    });
}

function removeFile(fileName, fileSize, fileDivElement) {
    selectedFiles = selectedFiles.filter(file => !(file.name === fileName && file.size === fileSize));
    console.log('arquivo removido:', fileName);
    if (fileDivElement) fileDivElement.remove();
    console.log('selectedFiles após remoção:', selectedFiles);
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function goBack() {
    console.log('navegando de volta para dashboard');
    window.location.href = 'dashboard.html';
}

// Logout Button Functionality
const logoutButton = document.getElementById('logoutButton');
logoutButton.addEventListener('click', () => {
    console.log('clicou em logout');
    document.body.classList.add('logging-out');
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 500);
});

// Adicionar função de logout no profile.js
async function logout() {
    try {
        await fetch('/src/routes/api/logout_api.php', {
            method: 'POST'
        });
        
        localStorage.clear();
        window.location.href = '/index.html';
    } catch (error) {
        console.error('Erro no logout:', error);
    }
}

// No botão de logout
document.getElementById('logoutButton').addEventListener('click', logout);
