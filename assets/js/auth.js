document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm")
  const cadastroForm = document.getElementById("cadastroForm")

  if (loginForm) {
    loginForm.addEventListener("submit", async e => {
      e.preventDefault()

      const email = document.getElementById("email").value
      const senha = document.getElementById("senha").value

      try {
        const res = await fetch("src/routes/api/login_api.php", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, senha })
        })

        const data = await res.json()

        if (res.ok && data.usuario) {
          localStorage.setItem("usuario", JSON.stringify(data.usuario))
          window.location.href = "dashboard.html"
        } else {
          alert(data.erro || "Erro ao fazer login")
        }
      } catch {
        alert("Erro de conexão com o servidor")
      }
    })
  }

  if (cadastroForm) {
    cadastroForm.addEventListener("submit", async e => {
      e.preventDefault()

      const nome = document.getElementById("nome").value
      const email = document.getElementById("email").value
      const senha = document.getElementById("senha").value

      try {
        const res = await fetch("src/routes/api/cadastro_api.php", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ nome, email, senha })
        })

        const data = await res.json()

        if (res.ok && data.sucesso) {
          alert("Cadastro realizado com sucesso! Verifique seu e-mail.")
          window.location.href = "dashboard.htmls"
        } else {
          alert(data.erro || "Erro ao cadastrar")
        }
      } catch {
        alert("Erro de conexão com o servidor")
      }
    })
  }
})
