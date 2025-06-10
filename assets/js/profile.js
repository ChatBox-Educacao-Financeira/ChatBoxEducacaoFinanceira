// profile.js - Código Completo
console.log("⏺️ profile.js carregado")

const fileUploadArea = document.getElementById("fileUploadArea")
const fileInput = document.getElementById("fileInput")
const uploadedFilesContainer = document.getElementById("uploadedFilesContainer")
let selectedFiles = []

const profileAvatarContainer = document.getElementById("profileAvatarContainer")
const avatarUploadInput = document.getElementById("avatarUploadInput")
const profileAvatarDisplay = document.getElementById("profileAvatarDisplay")
const defaultAvatarIcon = profileAvatarDisplay?.querySelector(".profile-avatar-icon-default")

// Carregar dados do usuário ao carregar a página
document.addEventListener("DOMContentLoaded", async function () {
  console.log("DOMContentLoaded — iniciando carregamento de dados do usuário")
  await carregarDadosUsuario()
  initializeEventListeners()
})

async function carregarDadosUsuario() {
  console.log("🔄 Carregando dados do usuário...")
  try {
    const response = await fetch("src/routes/api/perfil_get.php")
    console.log("📡 Status response:", response.status)

    const result = await response.json()
    console.log("📊 Dados recebidos:", result)

    if (result.sucesso) {
      // Preencher campos do formulário
      const fullNameEl = document.getElementById("fullName")
      const emailEl = document.getElementById("email")
      const companyNameEl = document.getElementById("companyName")
      const cargoEl = document.getElementById("cargo")

      console.log("🔍 Elementos encontrados:", {
        fullName: !!fullNameEl,
        email: !!emailEl,
        companyName: !!companyNameEl,
        cargo: !!cargoEl
      })

      if (fullNameEl) {
        fullNameEl.value = result.usuario.nome_completo || ""
        console.log("✅ Nome preenchido:", fullNameEl.value)
      }

      if (emailEl) {
        emailEl.value = result.usuario.email || ""
        console.log("✅ Email preenchido:", emailEl.value)
      }

      if (companyNameEl) {
        companyNameEl.value = result.usuario.nome_empresa || ""
        console.log("✅ Empresa preenchida:", companyNameEl.value)
      }

      if (cargoEl) {
        cargoEl.value = result.usuario.cargo || "CEO"
        console.log("✅ Cargo preenchido:", cargoEl.value)
      }

      // Atualizar sidebar
      atualizarSidebar(result.usuario)

      // Avatar
      if (result.usuario.avatar && profileAvatarDisplay) {
        console.log("   avatar existente encontrado:", result.usuario.avatar)
        if (defaultAvatarIcon) defaultAvatarIcon.style.display = "none"
        const existingImg = profileAvatarDisplay.querySelector("img")
        if (existingImg) existingImg.remove()
        const img = document.createElement("img")
        img.src = "/" + result.usuario.avatar
        img.alt = "Avatar do Usuário"
        profileAvatarDisplay.appendChild(img)
      }
    } else {
      console.error("❌ Erro ao carregar dados:", result.erro)
      alert("Erro ao carregar dados: " + result.erro)
      window.location.href = "index.html"
    }
  } catch (error) {
    console.error("💥 Erro de conexão:", error)
    alert("Erro de conexão")
    window.location.href = "index.html"
  }
}

function atualizarSidebar(usuario) {
  console.log("🔄 Atualizando sidebar com:", usuario)

  try {
    // Nome
    const profileName = document.querySelector(".profile-name")
    if (profileName) {
      profileName.textContent = usuario.nome_completo || "Usuário"
      console.log("✅ Nome sidebar atualizado:", profileName.textContent)
    }

    // Cargo e Empresa
    const profileRole = document.querySelector(".profile-role")
    if (profileRole) {
      const empresa = usuario.nome_empresa || "Empresa não informada"
      const cargo = usuario.cargo || "CEO"
      profileRole.textContent = `${cargo} • ${empresa}`
      console.log("✅ Role sidebar atualizado:", profileRole.textContent)
    }

    // Data de cadastro
    const profileMember = document.querySelector(".profile-member")
    if (profileMember && usuario.data_cadastro) {
      const dataCadastro = new Date(usuario.data_cadastro)
      const mes = dataCadastro.toLocaleDateString("pt-BR", { month: "short" })
      const ano = dataCadastro.getFullYear()
      profileMember.textContent = `Membro desde ${mes} ${ano}`
      console.log("✅ Member sidebar atualizado:", profileMember.textContent)
    }

    // Último acesso
    const infoItems = document.querySelectorAll(".info-item")
    const ultimoAcessoItem = Array.from(infoItems).find(item => item.textContent.includes("Último acesso"))

    if (ultimoAcessoItem && usuario.ultimo_acesso) {
      const ultimoAcesso = new Date(usuario.ultimo_acesso)
      const dataFormatada = ultimoAcesso.toLocaleDateString("pt-BR")
      const horaFormatada = ultimoAcesso.toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit"
      })
      const small = ultimoAcessoItem.querySelector("small")
      if (small) {
        small.textContent = `${dataFormatada} às ${horaFormatada} - Pedro Leopoldo, MG`
      }
    }
  } catch (error) {
    console.error("💥 Erro ao atualizar sidebar:", error)
  }
}

async function saveProfile() {
  console.log("💾 Salvando perfil...")

  const fullNameEl = document.getElementById("fullName")
  const emailEl = document.getElementById("email")
  const companyNameEl = document.getElementById("companyName")
  const cargoEl = document.getElementById("cargo")

  if (!fullNameEl || !emailEl) {
    console.error("❌ Elementos obrigatórios não encontrados")
    alert("Erro: elementos do formulário não encontrados")
    return
  }

  const dados = {
    nome_completo: fullNameEl.value.trim(),
    email: emailEl.value.trim(),
    nome_empresa: companyNameEl ? companyNameEl.value.trim() : "",
    cargo: cargoEl ? cargoEl.value.trim() : "CEO"
  }

  console.log("📤 Enviando dados:", dados)

  if (!dados.nome_completo || !dados.email) {
    alert("Por favor, preencha nome e email")
    return
  }

  try {
    const response = await fetch("src/routes/api/perfil_update.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dados)
    })

    console.log("📡 Status update:", response.status)
    const result = await response.json()
    console.log("📊 Resultado update:", result)

    if (result.sucesso) {
      console.log("✅ Perfil salvo com sucesso!")

      // Mostrar mensagem de sucesso
      const successMessage = document.getElementById("successMessage")
      if (successMessage) {
        successMessage.style.display = "block"
        setTimeout(() => (successMessage.style.display = "none"), 3000)
      }

      // Recarregar dados para confirmar salvamento e atualizar sidebar
      console.log("🔄 Recarregando dados para confirmar...")
      await carregarDadosUsuario()
    } else {
      console.error("❌ Erro ao salvar:", result.erro)
      alert("Erro ao salvar: " + result.erro)
    }
  } catch (error) {
    console.error("💥 Erro de conexão ao salvar:", error)
    alert("Erro de conexão ao salvar")
  }
}

function initializeEventListeners() {
  // Tab functionality
  document.querySelectorAll(".tab-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      // Remove active class from all tabs and contents
      document.querySelectorAll(".tab-btn").forEach(t => t.classList.remove("active"))
      document.querySelectorAll(".tab-content").forEach(c => c.classList.remove("active"))

      // Add active class to clicked tab
      btn.classList.add("active")

      // Show corresponding content
      const tabId = btn.getAttribute("data-tab")
      const tabContent = document.getElementById(tabId)
      if (tabContent) tabContent.classList.add("active")
    })
  })

  // Gerenciamento de alteração de senha
  const changePasswordBtn = document.getElementById("changePasswordBtn")
  if (changePasswordBtn) {
    changePasswordBtn.addEventListener("click", function () {
      console.log("clicou em Alterar Senha")
      const currentPasswordStep = document.getElementById("currentPasswordStep")
      if (currentPasswordStep) {
        currentPasswordStep.style.display = "block"
        this.style.display = "none"
      }
    })
  }

  const confirmPasswordBtn = document.getElementById("confirmPasswordBtn")
  if (confirmPasswordBtn) {
    confirmPasswordBtn.addEventListener("click", async function () {
      const currentPasswordEl = document.getElementById("currentPassword")
      if (!currentPasswordEl) return

      const currentPassword = currentPasswordEl.value
      console.log("-> Validando senha atual:", currentPassword ? "***" : "(vazio)")

      if (!currentPassword) {
        showPasswordError("Digite sua senha atual")
        return
      }
      await validateCurrentPassword(currentPassword)
    })
  }

  const savePasswordBtn = document.getElementById("savePasswordBtn")
  if (savePasswordBtn) {
    savePasswordBtn.addEventListener("click", async function () {
      const newPasswordEl = document.getElementById("newPassword")
      const confirmNewPasswordEl = document.getElementById("confirmNewPassword")

      if (!newPasswordEl || !confirmNewPasswordEl) return

      const newPassword = newPasswordEl.value
      const confirmNewPassword = confirmNewPasswordEl.value

      console.log("-> Salvando nova senha:", newPassword && confirmNewPassword ? "***" : "(vazio)")
      if (!newPassword || !confirmNewPassword) {
        showPasswordError("Preencha todos os campos de senha")
        return
      }
      if (newPassword !== confirmNewPassword) {
        showPasswordError("As senhas não coincidem")
        return
      }
      if (newPassword.length < 6) {
        showPasswordError("A senha deve ter pelo menos 6 caracteres")
        return
      }

      await saveNewPassword(newPassword)
    })
  }

  // Upload de avatar
  if (profileAvatarContainer && avatarUploadInput) {
    profileAvatarContainer.addEventListener("click", () => {
      console.log("clicou no container do avatar")
      avatarUploadInput.click()
    })

    avatarUploadInput.addEventListener("change", async function (event) {
      const file = event.target.files[0]
      console.log("arquivo selecionado para avatar:", file)
      if (file && file.type.startsWith("image/")) {
        const reader = new FileReader()
        reader.onload = function (e) {
          console.log("preview carregado")
          if (defaultAvatarIcon) defaultAvatarIcon.style.display = "none"
          const oldImg = profileAvatarDisplay.querySelector("img")
          if (oldImg) oldImg.remove()
          const img = document.createElement("img")
          img.src = e.target.result
          img.alt = "Avatar do Usuário"
          profileAvatarDisplay.appendChild(img)
        }
        reader.readAsDataURL(file)
        await uploadAvatar(file)
      } else if (file) {
        alert("Por favor, selecione um arquivo de imagem válido (ex: JPG, PNG).")
      }
    })
  }

  // Drag & drop e múltiplos arquivos
  if (fileUploadArea && fileInput && uploadedFilesContainer) {
    fileUploadArea.addEventListener("dragover", e => {
      e.preventDefault()
      fileUploadArea.classList.add("dragover")
    })
    fileUploadArea.addEventListener("dragleave", () => {
      fileUploadArea.classList.remove("dragover")
    })
    fileUploadArea.addEventListener("drop", e => {
      e.preventDefault()
      fileUploadArea.classList.remove("dragover")
      const files = Array.from(e.dataTransfer.files)
      console.log("arquivos arrastados:", files)
      handleFiles(files)
    })
    fileInput.addEventListener("change", e => {
      const files = Array.from(e.target.files)
      console.log("arquivos selecionados pelo input:", files)
      handleFiles(files)
    })
  }

  // Botão logout
  const logoutButton = document.getElementById("logoutButton")
  if (logoutButton) {
    logoutButton.addEventListener("click", () => {
      console.log("clicou em logout")
      document.body.classList.add("logging-out")
      setTimeout(() => {
        window.location.href = "index.html"
      }, 500)
    })
  }
}

async function validateCurrentPassword(currentPassword) {
  try {
    const response = await fetch("src/routes/api/validar_senha.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ senha_atual: currentPassword })
    })
    console.log("   status validar_senha:", response.status)
    const result = await response.json()
    console.log("   corpo JSON validar_senha:", result)

    if (result.sucesso) {
      console.log("senha atual validada com sucesso")
      const currentPasswordStep = document.getElementById("currentPasswordStep")
      const newPasswordStep = document.getElementById("newPasswordStep")
      if (currentPasswordStep) currentPasswordStep.style.display = "none"
      if (newPasswordStep) newPasswordStep.style.display = "block"
      clearPasswordError()
    } else {
      console.warn("   validar_senha retornou falha")
      showPasswordError("Senha inválida")
    }
  } catch (error) {
    console.error("   ERRO de conexão em validar_senha:", error)
    showPasswordError("Erro de conexão")
  }
}

async function saveNewPassword(newPassword) {
  try {
    const response = await fetch("src/routes/api/alterar_senha.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nova_senha: newPassword })
    })
    console.log("   status alterar_senha:", response.status)
    const result = await response.json()
    console.log("   corpo JSON alterar_senha:", result)

    if (result.sucesso) {
      console.log("   senha alterada com sucesso")
      alert("Senha alterada com sucesso!")
      resetPasswordForm()
    } else {
      console.warn("   alterar_senha retornou erro:", result.erro)
      showPasswordError(result.erro)
    }
  } catch (error) {
    console.error("   ERRO de conexão em alterar_senha:", error)
    showPasswordError("Erro de conexão")
  }
}

function showPasswordError(message) {
  clearPasswordError()
  const errorDiv = document.createElement("div")
  errorDiv.className = "password-error"
  errorDiv.textContent = message
  errorDiv.id = "passwordError"
  const activeStep = document.querySelector('.password-step[style*="block"]')
  if (activeStep) activeStep.appendChild(errorDiv)
}

function clearPasswordError() {
  const existingError = document.getElementById("passwordError")
  if (existingError) existingError.remove()
}

function resetPasswordForm() {
  const currentPasswordEl = document.getElementById("currentPassword")
  const newPasswordEl = document.getElementById("newPassword")
  const confirmNewPasswordEl = document.getElementById("confirmNewPassword")
  const currentPasswordStep = document.getElementById("currentPasswordStep")
  const newPasswordStep = document.getElementById("newPasswordStep")
  const changePasswordBtn = document.getElementById("changePasswordBtn")

  if (currentPasswordEl) currentPasswordEl.value = ""
  if (newPasswordEl) newPasswordEl.value = ""
  if (confirmNewPasswordEl) confirmNewPasswordEl.value = ""
  if (currentPasswordStep) currentPasswordStep.style.display = "none"
  if (newPasswordStep) newPasswordStep.style.display = "none"
  if (changePasswordBtn) changePasswordBtn.style.display = "inline-block"
  clearPasswordError()
}

async function uploadAvatar(file) {
  console.log("-> Iniciando uploadAvatar:", file.name, file.size)
  const formData = new FormData()
  formData.append("avatar", file)

  try {
    const response = await fetch("src/routes/api/upload_avatar.php", {
      method: "POST",
      body: formData
    })
    console.log("   status upload_avatar:", response.status)
    const result = await response.json()
    console.log("   corpo JSON upload_avatar:", result)

    if (result.sucesso) {
      console.log("   avatar salvo com sucesso no servidor:", result.avatar)
    } else {
      console.warn("   upload_avatar retornou erro:", result.erro, result.debug)
      alert("Erro ao salvar avatar: " + result.erro)
    }
  } catch (error) {
    console.error("   ERRO de conexão em upload_avatar:", error)
    alert("Erro de conexão ao salvar avatar")
  }
}

function handleFiles(files) {
  files.forEach(file => {
    if (file.size <= 10 * 1024 * 1024) {
      if (!selectedFiles.some(f => f.name === file.name && f.size === file.size)) {
        selectedFiles.push(file)
        console.log("arquivo adicionado ao selectedFiles:", file.name)
        displayFile(file)
      }
    } else {
      alert(`Arquivo ${file.name} é muito grande. Máximo 10MB.`)
    }
  })
  console.log("selectedFiles atuais:", selectedFiles)
  if (fileInput) fileInput.value = ""
}

function displayFile(file) {
  if (!uploadedFilesContainer) return

  const fileDiv = document.createElement("div")
  fileDiv.className = "uploaded-file"
  fileDiv.innerHTML = `
        <div class="file-info">
            <span class="file-name" title="${file.name}">📎 ${file.name}</span>
            <span class="file-size">(${formatFileSize(file.size)})</span>
        </div>
        <button class="remove-file" data-filename="${file.name}" data-filesize="${file.size}" aria-label="Remover ${
    file.name
  }">×</button>
    `
  uploadedFilesContainer.appendChild(fileDiv)
  fileDiv.querySelector(".remove-file").addEventListener("click", function () {
    removeFile(this.dataset.filename, parseInt(this.dataset.filesize, 10), this.parentElement)
  })
}

function removeFile(fileName, fileSize, fileDivElement) {
  selectedFiles = selectedFiles.filter(file => !(file.name === fileName && file.size === fileSize))
  console.log("arquivo removido:", fileName)
  if (fileDivElement) fileDivElement.remove()
  console.log("selectedFiles após remoção:", selectedFiles)
}

function formatFileSize(bytes) {
  if (bytes === 0) return "0 Bytes"
  const k = 1024
  const sizes = ["Bytes", "KB", "MB", "GB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
}

function goBack() {
  console.log("navegando de volta para dashboard")
  window.location.href = "dashboard.html"
}

// Funções globais para compatibilidade com onclick inline
window.saveProfile = saveProfile
window.goBack = goBack
