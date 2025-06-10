document.getElementById("signupForm").addEventListener("submit", async function (event) {
  event.preventDefault()

  const fullName = document.getElementById("fullName").value
  const email = document.getElementById("email").value
  const companyName = document.getElementById("companyName").value
  const senha = document.getElementById("password").value
  const confirmSenha = document.getElementById("confirmPassword").value
  const token = document.getElementById("token").value
  const tokenSection = document.getElementById("tokenSection")

  if (senha !== confirmSenha) {
    alert("As senhas não coincidem!")
    return
  }

  if (!tokenSection.style.display || tokenSection.style.display === "none") {
    // Primeira etapa: enviar token
    const r = await fetch("src/routes/api/enviar_token.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email })
    })
    const res = await r.json()
    if (res.sucesso) {
      alert("Token enviado para seu e-mail.")
      tokenSection.style.display = "block"
    } else {
      alert("Erro ao enviar token: " + res.erro)
    }
    return
  }

  // Segunda etapa: enviar cadastro com token para validação
  const formData = {
    nome_completo: fullName,
    email,
    nome_empresa: companyName,
    senha,
    token
  }

  try {
    const response = await fetch("src/routes/api/cadastro_api.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData)
    })

    const result = await response.json()

    if (response.ok && result.sucesso) {
      alert("Cadastro concluído com sucesso!")
      window.location.href = "dashboard.html"
    } else {
      alert(result.erro || "Erro no cadastro")
    }
  } catch (error) {
    alert("Erro de conexão")
  }
})
